"""
Сборка видео из чанков в S3 и запуск анализа на FastAPI-сервере (72.56.35.26:8000).

POST (JSON body): { filename, upload_id, chunk (base64), chunk_index, total_chunks }
  - Каждый чанк сохраняется в S3 (files/video_chunks/{upload_id}/{index}.part)
  - На последнем чанке все части склеиваются в один файл и одним запросом
    отправляются на FastAPI /upload_video — возвращается { task_id, status }

GET ?stream={filename} — скачивает готовое обработанное видео с FastAPI /videos/{filename},
кэширует его в S3 и отдаёт браузеру редирект на CDN-ссылку (обход mixed content HTTPS→HTTP
и лимита размера ответа облачной функции).
"""

import json
import os
import io
import base64
import urllib.request
import urllib.error
import boto3

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
)


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


def handle_stream(event: dict) -> dict:
    qs = event.get("queryStringParameters") or {}
    filename = qs.get("stream")
    if not filename:
        return error_response(400, "Параметр stream (имя файла) обязателен")

    cache_key = f"video_results/{filename}"
    access_key = os.environ.get("AWS_ACCESS_KEY_ID")

    try:
        s3.head_object(Bucket=BUCKET, Key=cache_key)
        cached = True
    except Exception:
        cached = False

    cdn_url = f"https://cdn.poehali.dev/projects/{access_key}/bucket/{cache_key}"

    if not cached:
        url = f"{TARGET.rstrip('/')}/videos/{filename}"
        try:
            with urllib.request.urlopen(url, timeout=120) as resp:
                video_bytes = resp.read()
        except urllib.error.HTTPError as e:
            return {
                "statusCode": e.code,
                "headers": {**CORS, "Content-Type": "application/json"},
                "body": e.read().decode("utf-8", errors="replace"),
            }
        except Exception as e:
            return error_response(502, str(e))

        s3.put_object(Bucket=BUCKET, Key=cache_key, Body=video_bytes, ContentType="video/mp4")

    return {
        "statusCode": 200,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"url": cdn_url, "cached": cached}),
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
        s3.put_object(Bucket=BUCKET, Key=chunk_key(upload_id, chunk_index), Body=chunk_bytes)

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