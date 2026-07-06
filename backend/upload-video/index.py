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


def video_cache_key(filename: str) -> str:
    return f"videos_ready/{filename}"


def cdn_url(key: str) -> str:
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def s3_key_exists(key: str) -> bool:
    try:
        s3.head_object(Bucket=BUCKET, Key=key)
        return True
    except Exception:
        return False


def handle_stream(event: dict) -> dict:
    """Отдаёт браузеру постоянную CDN-ссылку на готовое видео.

    Сервер анализа игнорирует Range-запросы и отдаёт файл целиком, из-за чего
    покусочный стриминг через функцию упирался в таймаут. Поэтому готовое видео
    один раз скачивается с сервера анализа, кладётся в S3 и дальше
    воспроизводится браузером напрямую с CDN (быстро, с перемоткой).
    """
    qs = event.get("queryStringParameters") or {}
    filename = qs.get("stream")
    if not filename:
        return error_response(400, "Параметр stream (имя файла) обязателен")

    key = video_cache_key(filename)

    # Видео уже перенесено в S3 — сразу отдаём CDN-ссылку.
    if s3_key_exists(key):
        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"url": cdn_url(key), "ready": True}),
        }

    # Скачиваем готовое видео с сервера анализа и кладём в S3.
    url = f"{TARGET.rstrip('/')}/videos/{filename}"
    try:
        resp = urllib.request.urlopen(url, timeout=90)
        data = resp.read()
        resp.close()
    except urllib.error.HTTPError as e:
        print(f"[stream] HTTPError {e.code} for {filename}")
        return error_response(e.code, f"Сервер анализа вернул {e.code}")
    except Exception as e:
        print(f"[stream] proxy error for {filename}: {type(e).__name__}: {e}")
        return error_response(502, f"Сервер анализа не отдаёт видео: {e}")

    try:
        put_with_retry(key, data, "video/mp4")
    except Exception as e:
        print(f"[stream] S3 upload failed for {filename}: {e}")
        return error_response(502, "Не удалось сохранить видео")

    print(f"[stream] cached {filename}: {len(data)} bytes -> {key}")
    return {
        "statusCode": 200,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"url": cdn_url(key), "ready": True}),
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