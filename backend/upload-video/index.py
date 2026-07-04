"""
Сборка видео из чанков в S3 и запуск анализа на FastAPI-сервере (72.56.35.26:8000).

POST (JSON body): { filename, upload_id, chunk (base64), chunk_index, total_chunks }
  - Каждый чанк сохраняется в S3 (files/video_chunks/{upload_id}/{index}.part)
  - На последнем чанке все части склеиваются в один файл и одним запросом
    отправляются на FastAPI /upload_video — возвращается { task_id, status }

GET ?stream={filename} — скачивает готовое обработанное видео с FastAPI /videos/{filename},
кэширует его в S3 (через multipart upload с ретраями) и отдаёт браузеру JSON с CDN-ссылкой
(обход mixed content HTTPS→HTTP и лимита размера ответа облачной функции).
"""

import json
import os
import io
import time
import base64
import urllib.request
import urllib.error
import boto3
from botocore.config import Config

TARGET = os.environ.get("FASTAPI_URL", "http://72.56.35.26:8000")
BUCKET = "files"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

s3 = boto3.client(
    "s3",
    endpoint_url="https://bucket.poehali.dev",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    config=Config(retries={"max_attempts": 5, "mode": "standard"}),
)


def put_with_retry(key: str, body: bytes, content_type: str, attempts: int = 4):
    last_err = None
    for i in range(attempts):
        try:
            s3.put_object(Bucket=BUCKET, Key=key, Body=body, ContentType=content_type)
            return
        except Exception as e:
            last_err = e
            time.sleep(1.5 * (i + 1))
    raise last_err


def build_multipart(filename: str, file_bytes: bytes) -> tuple[bytes, str]:
    boundary = "----FormBoundary7MA4YWxkTrZu0gW"
    body = io.BytesIO()

    def w(s: str):
        body.write(s.encode("utf-8"))

    w(f"--{boundary}\r\n")
    w(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n')
    w("Content-Type: video/mp4\r\n\r\n")
    body.write(file_bytes)
    w("\r\n")
    w(f"--{boundary}--\r\n")
    return body.getvalue(), f"multipart/form-data; boundary={boundary}"


def chunk_key(upload_id: str, index: int) -> str:
    return f"video_chunks/{upload_id}/{index:05d}.part"


def error_response(status: int, message: str) -> dict:
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"error": message}),
    }


# Максимальный размер одного куска, отдаваемого браузеру за запрос.
# base64 раздувает данные в ~1.37 раза, поэтому держим кусок небольшим,
# чтобы итоговый ответ не упирался в лимит размера ответа облачной функции.
CHUNK_SIZE = 1024 * 1024


def _skip_stream(resp, n: int) -> None:
    """Пропускает n байт из потока, читая порциями (без буферизации всего)."""
    remaining = n
    step = 256 * 1024
    while remaining > 0:
        buf = resp.read(min(step, remaining))
        if not buf:
            break
        remaining -= len(buf)


def _size_cache_key(filename: str) -> str:
    return f"video_sizes/{filename}.size"


def get_total_size(filename: str) -> int | None:
    """Определяет полный размер видеофайла и кэширует его в S3.

    Сервер анализа не отдаёт Content-Length при статусе 200, поэтому размер
    приходится вычислять, прочитав файл целиком один раз (считая байты, не
    сохраняя их). Результат кэшируется, чтобы не делать это повторно.
    """
    key = _size_cache_key(filename)
    try:
        obj = s3.get_object(Bucket=BUCKET, Key=key)
        val = obj["Body"].read().decode("utf-8").strip()
        if val.isdigit():
            return int(val)
    except Exception:
        pass

    url = f"{TARGET.rstrip('/')}/videos/{filename}"
    try:
        resp = urllib.request.urlopen(url, timeout=90)
        cl = resp.headers.get("Content-Length", "")
        if cl.isdigit():
            total = int(cl)
        else:
            # Content-Length отсутствует — считаем байты, читая поток.
            total = 0
            while True:
                buf = resp.read(1024 * 1024)
                if not buf:
                    break
                total += len(buf)
        resp.close()
    except Exception as e:
        print(f"[size] failed for {filename}: {type(e).__name__}: {e}")
        return None

    try:
        s3.put_object(Bucket=BUCKET, Key=key, Body=str(total).encode("utf-8"))
    except Exception:
        pass
    return total


def handle_stream(event: dict) -> dict:
    qs = event.get("queryStringParameters") or {}
    filename = qs.get("stream")
    if not filename:
        return error_response(400, "Параметр stream (имя файла) обязателен")

    headers = event.get("headers") or {}
    range_header = (
        headers.get("Range")
        or headers.get("range")
        or headers.get("X-Range")
        or headers.get("x-range")
        or ""
    )

    # Определяем начало диапазона. Если браузер не прислал Range — начинаем с 0.
    start = 0
    if range_header.startswith("bytes="):
        try:
            spec = range_header.split("=", 1)[1].split(",")[0].strip()
            start_str = spec.split("-", 1)[0].strip()
            if start_str:
                start = int(start_str)
        except Exception:
            start = 0

    end = start + CHUNK_SIZE - 1

    url = f"{TARGET.rstrip('/')}/videos/{filename}"
    req = urllib.request.Request(url, headers={"Range": f"bytes={start}-{end}"})

    try:
        resp = urllib.request.urlopen(req, timeout=60)
        status = resp.status
        content_range = resp.headers.get("Content-Range", "")
        content_length = resp.headers.get("Content-Length", "")

        if status == 200:
            # Сервер проигнорировал Range и отдаёт файл с байта 0.
            # Пропускаем start байт, затем читаем нужный кусок.
            if start > 0:
                _skip_stream(resp, start)
            chunk = resp.read(CHUNK_SIZE)
        else:
            # 206 Partial Content — сервер уже отдаёт нужный диапазон.
            chunk = resp.read(CHUNK_SIZE)
        resp.close()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"[stream] FastAPI HTTPError {e.code} for {filename}: {body[:200]}")
        return {
            "statusCode": e.code,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"error": f"Сервер анализа вернул {e.code}"}),
        }
    except Exception as e:
        print(f"[stream] proxy error for {filename}: {type(e).__name__}: {e}")
        return error_response(502, f"Сервер анализа не отдаёт видео: {e}")

    # Определяем полный размер файла.
    total = None
    if "/" in content_range:
        # 206 Partial Content: "bytes start-end/total"
        tail = content_range.rsplit("/", 1)[-1].strip()
        if tail.isdigit():
            total = int(tail)
    elif status == 200 and content_length.isdigit():
        # Сервер вернул весь файл — Content-Length равен полному размеру.
        total = int(content_length)

    # Сервер не отдал размер в заголовках — вычисляем и кэшируем его.
    if total is None:
        total = get_total_size(filename)

    chunk_len = len(chunk)
    real_end = start + chunk_len - 1

    resp_headers = {
        **CORS,
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "Content-Range, Accept-Ranges, Content-Length",
    }

    total_str = str(total) if total is not None else "*"
    resp_headers["Content-Range"] = f"bytes {start}-{real_end}/{total_str}"

    print(f"[stream] {filename}: sent bytes {start}-{real_end} ({chunk_len}), total={total}, src_status={status}")

    return {
        "statusCode": 206,
        "headers": resp_headers,
        "body": base64.b64encode(chunk).decode("utf-8"),
        "isBase64Encoded": True,
    }


def handle_chunk(event: dict) -> dict:
    try:
        body_raw = event.get("body") or ""
        if event.get("isBase64Encoded") and body_raw:
            body_raw = base64.b64decode(body_raw).decode("utf-8")
        data = json.loads(body_raw) if body_raw.strip() else {}

        filename = data.get("filename", "video.mp4")
        upload_id = data.get("upload_id")
        chunk_b64 = data.get("chunk", "")
        chunk_index = int(data.get("chunk_index", 0))
        total_chunks = int(data.get("total_chunks", 1))

        if not upload_id:
            return error_response(400, "upload_id обязателен")

        chunk_bytes = base64.b64decode(chunk_b64)
        put_with_retry(chunk_key(upload_id, chunk_index), chunk_bytes, "application/octet-stream")

        is_last = chunk_index == total_chunks - 1
        if not is_last:
            return {
                "statusCode": 200,
                "headers": {**CORS, "Content-Type": "application/json"},
                "body": json.dumps({"received": chunk_index, "status": "chunk_uploaded"}),
            }

        buffer = io.BytesIO()
        for i in range(total_chunks):
            obj = s3.get_object(Bucket=BUCKET, Key=chunk_key(upload_id, i))
            buffer.write(obj["Body"].read())
        full_bytes = buffer.getvalue()

        for i in range(total_chunks):
            try:
                s3.delete_object(Bucket=BUCKET, Key=chunk_key(upload_id, i))
            except Exception:
                pass

        multipart_body, content_type = build_multipart(filename, full_bytes)
        req = urllib.request.Request(
            TARGET.rstrip("/") + "/upload_video",
            data=multipart_body,
            headers={"Content-Type": content_type},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=25) as resp:
            resp_body = resp.read().decode("utf-8", errors="replace")
            return {
                "statusCode": resp.status,
                "headers": {**CORS, "Content-Type": "application/json"},
                "body": resp_body,
            }

    except urllib.error.HTTPError as e:
        return {
            "statusCode": e.code,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": e.read().decode("utf-8", errors="replace"),
        }
    except Exception as e:
        return error_response(502, str(e))


def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if method == "GET":
        return handle_stream(event)

    return handle_chunk(event)