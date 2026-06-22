"""
Прокси-функция: перенаправляет все запросы от фронтенда к FastAPI-серверу на 72.56.35.26:8000.
Решает проблему Mixed Content (HTTPS сайт → HTTP сервер).
"""

import json
import os
import urllib.request
import urllib.error
import urllib.parse

TARGET = os.environ.get("FASTAPI_URL", "http://72.56.35.26:8000")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token",
}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("queryStringParameters", {}).get("path", "/")
    body_raw = event.get("body") or ""

    url = TARGET.rstrip("/") + "/" + path.lstrip("/")

    # Передаём query string если есть (кроме нашего ?path=)
    qs = {k: v for k, v in (event.get("queryStringParameters") or {}).items() if k != "path"}
    if qs:
        url += "?" + urllib.parse.urlencode(qs)

    req_headers = {}
    content_type = (event.get("headers") or {}).get("content-type", "")
    if content_type:
        req_headers["Content-Type"] = content_type

    body_bytes = body_raw.encode() if isinstance(body_raw, str) else body_raw

    req = urllib.request.Request(url, data=body_bytes or None, headers=req_headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            resp_body = resp.read()
            resp_ct = resp.headers.get("Content-Type", "application/json")
            return {
                "statusCode": resp.status,
                "headers": {**CORS, "Content-Type": resp_ct},
                "body": resp_body.decode("utf-8", errors="replace"),
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