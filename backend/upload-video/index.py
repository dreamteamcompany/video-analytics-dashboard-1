"""
Загрузка видео чанками на FastAPI-бэкенд (72.56.35.26:8000).
Принимает base64-чанк, пересылает multipart/form-data на /upload_video.
Обходит ограничение 413 у основного прокси.
"""

import json
import os
import base64
import urllib.request
import urllib.error
import io

TARGET = os.environ.get("FASTAPI_URL", "http://72.56.35.26:8000")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

CHUNK_SIZE = 5 * 1024 * 1024  # 5 MB — безопасный лимит для одного чанка


def build_multipart(filename: str, chunk_bytes: bytes, chunk_index: int, total_chunks: int) -> tuple[bytes, str]:
    boundary = "----FormBoundary7MA4YWxkTrZu0gW"
    body = io.BytesIO()

    def w(s: str):
        body.write(s.encode("utf-8"))

    # поле file
    w(f"--{boundary}\r\n")
    w(f'Content-Disposition: form-data; name="file"; filename="{filename}"\r\n')
    w("Content-Type: application/octet-stream\r\n\r\n")
    body.write(chunk_bytes)
    w("\r\n")

    # метаданные чанка
    for name, val in [("chunk_index", str(chunk_index)), ("total_chunks", str(total_chunks))]:
        w(f"--{boundary}\r\n")
        w(f'Content-Disposition: form-data; name="{name}"\r\n\r\n')
        w(f"{val}\r\n")

    w(f"--{boundary}--\r\n")
    return body.getvalue(), f"multipart/form-data; boundary={boundary}"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    try:
        body_raw = event.get("body") or "{}"
        if event.get("isBase64Encoded"):
            body_raw = base64.b64decode(body_raw).decode("utf-8")
        data = json.loads(body_raw)

        filename    = data.get("filename", "video.mp4")
        chunk_b64   = data.get("chunk", "")
        chunk_index = int(data.get("chunk_index", 0))
        total_chunks = int(data.get("total_chunks", 1))

        chunk_bytes = base64.b64decode(chunk_b64)

        # Если чанков > 1, добавляем суффикс в URL, чтобы бэкенд мог собирать части
        # Если бэкенд не поддерживает chunks — шлём целиком (total_chunks == 1)
        path = "/upload_video"
        url = TARGET.rstrip("/") + path

        multipart_body, content_type = build_multipart(filename, chunk_bytes, chunk_index, total_chunks)

        req = urllib.request.Request(
            url,
            data=multipart_body,
            headers={"Content-Type": content_type},
            method="POST",
        )

        with urllib.request.urlopen(req, timeout=60) as resp:
            resp_body = resp.read().decode("utf-8", errors="replace")
            return {
                "statusCode": resp.status,
                "headers": {**CORS, "Content-Type": "application/json"},
                "body": resp_body,
            }

    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return {
            "statusCode": e.code,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": body,
        }
    except Exception as e:
        return {
            "statusCode": 502,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}),
        }
