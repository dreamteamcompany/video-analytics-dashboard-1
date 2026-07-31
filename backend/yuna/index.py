"""
Подпроект «Юна»: работа с записями (yuna_items).
GET  — список записей.
POST — создание записи { title, description }.
Изолирован от основного проекта: свои таблицы с префиксом yuna_.
"""

import json
import os
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def _conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def _resp(status: int, body: dict) -> dict:
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "isBase64Encoded": False,
        "body": json.dumps(body, default=str),
    }


def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "isBase64Encoded": False, "body": ""}

    if method == "GET":
        conn = _conn()
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT id, title, description, created_at "
                "FROM yuna_items ORDER BY created_at DESC LIMIT 200"
            )
            rows = cur.fetchall()
            items = [
                {"id": r[0], "title": r[1], "description": r[2], "created_at": r[3]}
                for r in rows
            ]
            return _resp(200, {"items": items})
        finally:
            conn.close()

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        title = (body.get("title") or "").strip()
        description = (body.get("description") or "").strip()
        if not title:
            return _resp(400, {"error": "Поле title обязательно"})

        title = title[:255]
        conn = _conn()
        try:
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO yuna_items (title, description) VALUES (%s, %s) "
                "RETURNING id, title, description, created_at",
                (title, description),
            )
            r = cur.fetchone()
            conn.commit()
            return _resp(
                201,
                {"item": {"id": r[0], "title": r[1], "description": r[2], "created_at": r[3]}},
            )
        finally:
            conn.close()

    return _resp(405, {"error": "Метод не поддерживается"})
