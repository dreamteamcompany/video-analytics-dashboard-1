"""
Подпроект «Юна»: анализ приёма врач-пациент.
GET                 — список приёмов (yuna_sessions).
GET ?session_id=N   — реплики конкретного приёма.
POST { audio_base64, format, duration_sec } — обработка записи тремя шагами:
      1) Whisper (audio/transcriptions) переводит аудио в текст;
      2) gpt-4o разбивает текст на реплики врача (doctor) и пациента (patient);
      3) gpt-4o оценивает приём (эмпатия, доверие, состояние, качество,
         коммуникация) + резюме, рекомендации, сильные и тревожные моменты,
         а также стоматологическую диагностику (dental): предварительный
         диагноз, дифдиагнозы, обследования, план лечения.
      Результат сохраняется в БД (колонка analysis).
Изолирован от основного проекта: свои таблицы с префиксом yuna_.
"""

import json
import os
import base64
import uuid
import urllib.request
import urllib.error
import psycopg2

CHAT_URL = "https://routerai.ru/api/v1/chat/completions"
TRANSCRIBE_URL = "https://routerai.ru/api/v1/audio/transcriptions"
WHISPER_MODEL = "openai/gpt-4o-transcribe"
CHAT_MODEL = "openai/gpt-5.1"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

SPLIT_PROMPT = (
    "Ты — эксперт по анализу медицинских диалогов. На вход приходит сплошная "
    "расшифровка приёма на русском языке без разметки говорящих. "
    "Твоя задача — восстановить диалог: разбей текст на отдельные реплики и "
    "определи говорящего для каждой (doctor — врач, patient — пациент).\n"
    "Признаки врача: задаёт уточняющие вопросы о симптомах, собирает анамнез, "
    "объясняет, ставит диагноз, назначает обследования, препараты, дозировки, "
    "даёт рекомендации, говорит на профессиональном языке.\n"
    "Признаки пациента: описывает жалобы, боль, самочувствие, отвечает на вопросы, "
    "переспрашивает, выражает эмоции и опасения.\n"
    "Правила: сохраняй исходные слова дословно, не переписывай и не сокращай; "
    "объединяй подряд идущие фразы одного говорящего в одну реплику; "
    "чередование ролей типично для диалога (вопрос врача → ответ пациента). "
    "Если говорящего определить невозможно — используй unknown.\n"
    "Верни СТРОГО JSON без markdown вида: "
    '{"utterances":[{"speaker":"doctor|patient|unknown","text":"реплика"}]} '
    "в хронологическом порядке. Ничего кроме JSON."
)


def _conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def _resp(status: int, body: dict) -> dict:
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "isBase64Encoded": False,
        "body": json.dumps(body, default=str, ensure_ascii=False),
    }


def _transcribe_audio(audio_bytes: bytes, fmt: str) -> str:
    """Шаг 1: аудио -> текст через Whisper (multipart/form-data)."""
    boundary = f"----YunaBoundary{uuid.uuid4().hex}"
    ext = "webm" if fmt == "webm" else "mp4"
    parts = []

    def add_field(name, value):
        parts.append(f"--{boundary}\r\n".encode())
        parts.append(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode())
        parts.append(f"{value}\r\n".encode())

    add_field("model", WHISPER_MODEL)
    add_field("language", "ru")
    add_field("temperature", "0")
    add_field(
        "prompt",
        "Медицинский приём: диалог врача и пациента на русском языке. "
        "Пациент описывает жалобы, симптомы, боль, самочувствие. "
        "Врач задаёт вопросы, ставит диагноз, назначает лечение, "
        "анализы, препараты и дозировки.",
    )
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(
        f'Content-Disposition: form-data; name="file"; filename="audio.{ext}"\r\n'.encode()
    )
    parts.append(f"Content-Type: audio/{fmt}\r\n\r\n".encode())
    parts.append(audio_bytes)
    parts.append(f"\r\n--{boundary}--\r\n".encode())
    body = b"".join(parts)

    req = urllib.request.Request(
        TRANSCRIBE_URL,
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Authorization": f"Bearer {os.environ['ROUTERAI_API_KEY']}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        raw = r.read().decode("utf-8")
    data = json.loads(raw)
    text = data.get("text")
    if text is None:
        print(f"[yuna] Whisper unexpected response: {raw[:800]}")
        raise RuntimeError("Whisper не вернул текст")
    return text.strip()


def _split_speakers(transcript: str) -> list:
    """Шаг 2: текст -> реплики с ролями через chat-модель."""
    payload = {
        "model": CHAT_MODEL,
        "messages": [
            {"role": "system", "content": SPLIT_PROMPT},
            {"role": "user", "content": transcript},
        ],
        "response_format": {"type": "json_object"},
    }
    req = urllib.request.Request(
        CHAT_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ['ROUTERAI_API_KEY']}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        raw = r.read().decode("utf-8")
    data = json.loads(raw)
    if "choices" not in data:
        print(f"[yuna] Chat unexpected response: {raw[:800]}")
        raise RuntimeError("Модель разбора не вернула результат")
    content = data["choices"][0]["message"]["content"].strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()
    parsed = json.loads(content)
    out = []
    for it in parsed.get("utterances", []):
        sp = it.get("speaker", "unknown")
        if sp not in ("doctor", "patient"):
            sp = "unknown"
        text = (it.get("text") or "").strip()
        if text:
            out.append({"speaker": sp, "text": text})
    return out


def _call_routerai(audio_b64: str, fmt: str) -> list:
    audio_bytes = base64.b64decode(audio_b64)
    transcript = _transcribe_audio(audio_bytes, fmt)
    if not transcript:
        return []
    return _split_speakers(transcript)


ANALYSIS_PROMPT = (
    "Ты — эксперт по качеству медицинских приёмов. Проанализируй расшифровку "
    "диалога врача и пациента на русском языке. Оцени по шкале 0-100 пять метрик:\n"
    "- empathy — эмпатия врача (внимательность, чуткость);\n"
    "- trust — доверие пациента (открытость, доверие к врачу);\n"
    "- patient_state — психологическое состояние пациента "
    "(100 = спокоен и уверен, 0 = сильная тревога/стресс);\n"
    "- quality — качество и сервис (профессионализм, ясность, вежливость);\n"
    "- communication — коммуникация (ясность объяснений, умение слушать).\n"
    "Также дай: summary (краткое резюме приёма, 2-3 предложения), "
    "recommendations (массив из 2-4 конкретных рекомендаций врачу), "
    "strengths (массив из 1-3 сильных сторон врача), "
    "concerns (массив тревожных моментов: риски, конфликты, жалобы; пустой если их нет).\n"
    "Это СТОМАТОЛОГИЧЕСКИЙ приём. Дополнительно сформируй объект dental — "
    "клиническую диагностику по стоматологии на основе жалоб и слов из диалога:\n"
    "- primary_diagnosis: {name (предварительный стоматологический диагноз, "
    "например 'Пульпит 36 зуба', 'Хронический периодонтит', 'Кариес дентина'), "
    "probability (0-100, уверенность), tooth (номер зуба по FDI если упомянут, иначе '')};\n"
    "- differential: массив из 1-3 строк — дифференциальные диагнозы (что ещё исключить);\n"
    "- examinations: массив из 1-4 объектов {name, reason} — рекомендуемые обследования "
    "(рентген/прицельный снимок, КЛКТ/3D, ЭОД, термопроба, перкуссия и т.п.) с краткой причиной;\n"
    "- plan: массив из 2-5 строк — план лечения по шагам.\n"
    "Дополнительно сформируй tactics — тактику лечения:\n"
    "- approach: строка, оптимальная тактика/подход одним предложением;\n"
    "- sequence: массив из 2-6 строк — оптимальная последовательность этапов;\n"
    "- equipment: массив из 1-6 строк — необходимые материалы/оборудование;\n"
    "- notes: массив из 0-3 строк — важные заметки (успешность, среднее время и т.п.).\n"
    "Дополнительно сформируй complications — прогноз осложнений:\n"
    "- risk: int 0-100, общий риск послеоперационных осложнений;\n"
    "- factors: массив из 0-4 объектов {name, impact} — факторы риска и их вклад "
    "(impact — строка, например '+12% к риску'), из анамнеза в диалоге "
    "(курение, возраст, сопутствующие болезни и т.п.).\n"
    "Дополнительно сформируй treatment — рекомендации по лечению:\n"
    "- recommended: массив из 1-4 объектов {title, detail} — основной план лечения;\n"
    "- match: int 0-100, уверенность в рекомендации;\n"
    "- alternatives: массив из 0-3 объектов {name, score} (score int 0-100) — альтернативы;\n"
    "- aftercare: массив из 0-5 строк — рекомендации после лечения.\n"
    "Если данных в диалоге недостаточно — делай осторожные предположения с низкой "
    "probability/match, но поля всё равно заполни осмысленно по контексту стоматологии.\n"
    "Верни СТРОГО JSON без markdown вида: "
    '{"empathy":int,"trust":int,"patient_state":int,"quality":int,'
    '"communication":int,"summary":str,"recommendations":[str],'
    '"strengths":[str],"concerns":[str],'
    '"dental":{"primary_diagnosis":{"name":str,"probability":int,"tooth":str},'
    '"differential":[str],"examinations":[{"name":str,"reason":str}],"plan":[str]},'
    '"tactics":{"approach":str,"sequence":[str],"equipment":[str],"notes":[str]},'
    '"complications":{"risk":int,"factors":[{"name":str,"impact":str}]},'
    '"treatment":{"recommended":[{"title":str,"detail":str}],"match":int,'
    '"alternatives":[{"name":str,"score":int}],"aftercare":[str]}}. '
    "Ничего кроме JSON."
)


def _clamp_score(v) -> int:
    try:
        n = int(round(float(v)))
    except Exception:
        return 0
    return max(0, min(100, n))


def _analyze(transcript: str) -> dict:
    payload = {
        "model": CHAT_MODEL,
        "messages": [
            {"role": "system", "content": ANALYSIS_PROMPT},
            {"role": "user", "content": transcript},
        ],
        "response_format": {"type": "json_object"},
    }
    req = urllib.request.Request(
        CHAT_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {os.environ['ROUTERAI_API_KEY']}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        raw = r.read().decode("utf-8")
    data = json.loads(raw)
    if "choices" not in data:
        print(f"[yuna] Analysis unexpected response: {raw[:800]}")
        raise RuntimeError("Модель анализа не вернула результат")
    content = data["choices"][0]["message"]["content"].strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()
    p = json.loads(content)

    def arr(key):
        v = p.get(key, [])
        return [str(x).strip() for x in v if str(x).strip()] if isinstance(v, list) else []

    return {
        "empathy": _clamp_score(p.get("empathy")),
        "trust": _clamp_score(p.get("trust")),
        "patient_state": _clamp_score(p.get("patient_state")),
        "quality": _clamp_score(p.get("quality")),
        "communication": _clamp_score(p.get("communication")),
        "summary": str(p.get("summary") or "").strip(),
        "recommendations": arr("recommendations"),
        "strengths": arr("strengths"),
        "concerns": arr("concerns"),
        "dental": _parse_dental(p.get("dental")),
        "tactics": _parse_tactics(p.get("tactics")),
        "complications": _parse_complications(p.get("complications")),
        "treatment": _parse_treatment(p.get("treatment")),
    }


def _str_list(v) -> list:
    return [str(x).strip() for x in v if str(x).strip()] if isinstance(v, list) else []


def _parse_tactics(t) -> dict:
    """Разбор тактики лечения."""
    if not isinstance(t, dict):
        return {}
    approach = str(t.get("approach") or "").strip()
    sequence = _str_list(t.get("sequence"))
    equipment = _str_list(t.get("equipment"))
    notes = _str_list(t.get("notes"))
    if not approach and not sequence and not equipment and not notes:
        return {}
    return {"approach": approach, "sequence": sequence, "equipment": equipment, "notes": notes}


def _parse_complications(c) -> dict:
    """Разбор прогноза осложнений."""
    if not isinstance(c, dict):
        return {}
    factors = []
    raw = c.get("factors")
    if isinstance(raw, list):
        for f in raw:
            if isinstance(f, dict):
                name = str(f.get("name") or "").strip()
                if name:
                    factors.append({"name": name, "impact": str(f.get("impact") or "").strip()})
            elif str(f).strip():
                factors.append({"name": str(f).strip(), "impact": ""})
    has_risk = isinstance(c.get("risk"), (int, float))
    if not has_risk and not factors:
        return {}
    return {"risk": _clamp_score(c.get("risk")), "factors": factors}


def _parse_treatment(t) -> dict:
    """Разбор рекомендаций по лечению."""
    if not isinstance(t, dict):
        return {}
    recommended = []
    raw = t.get("recommended")
    if isinstance(raw, list):
        for r in raw:
            if isinstance(r, dict):
                title = str(r.get("title") or "").strip()
                if title:
                    recommended.append({"title": title, "detail": str(r.get("detail") or "").strip()})
            elif str(r).strip():
                recommended.append({"title": str(r).strip(), "detail": ""})
    alternatives = []
    raw_alt = t.get("alternatives")
    if isinstance(raw_alt, list):
        for a in raw_alt:
            if isinstance(a, dict):
                name = str(a.get("name") or "").strip()
                if name:
                    alternatives.append({"name": name, "score": _clamp_score(a.get("score"))})
    aftercare = _str_list(t.get("aftercare"))
    if not recommended and not alternatives and not aftercare:
        return {}
    return {
        "recommended": recommended,
        "match": _clamp_score(t.get("match")),
        "alternatives": alternatives,
        "aftercare": aftercare,
    }


def _parse_dental(d) -> dict:
    """Разбор стоматологического блока диагностики."""
    if not isinstance(d, dict):
        return {}
    pd = d.get("primary_diagnosis") or {}
    if not isinstance(pd, dict):
        pd = {}
    primary = {
        "name": str(pd.get("name") or "").strip(),
        "probability": _clamp_score(pd.get("probability")),
        "tooth": str(pd.get("tooth") or "").strip(),
    }
    differential = [
        str(x).strip() for x in d.get("differential", [])
        if isinstance(d.get("differential"), list) and str(x).strip()
    ]
    exams = []
    ex_raw = d.get("examinations")
    if isinstance(ex_raw, list):
        for e in ex_raw:
            if isinstance(e, dict):
                name = str(e.get("name") or "").strip()
                if name:
                    exams.append({"name": name, "reason": str(e.get("reason") or "").strip()})
            elif str(e).strip():
                exams.append({"name": str(e).strip(), "reason": ""})
    plan = [
        str(x).strip() for x in d.get("plan", [])
        if isinstance(d.get("plan"), list) and str(x).strip()
    ]
    if not primary["name"] and not differential and not exams and not plan:
        return {}
    return {
        "primary_diagnosis": primary,
        "differential": differential,
        "examinations": exams,
        "plan": plan,
    }


def _list_sessions() -> dict:
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, title, status, duration_sec, created_at, analysis "
            "FROM yuna_sessions ORDER BY created_at DESC LIMIT 200"
        )
        rows = cur.fetchall()
        metric_keys = ["empathy", "trust", "patient_state", "quality", "communication"]
        sessions = []
        for r in rows:
            a = r[5] or {}
            metrics = {}
            overall = None
            if a:
                for k in metric_keys:
                    v = a.get(k)
                    metrics[k] = int(v) if isinstance(v, (int, float)) else None
                ov = ["empathy", "trust", "quality", "communication"]
                vals = [a.get(k) for k in ov if isinstance(a.get(k), (int, float))]
                if vals:
                    overall = round(sum(vals) / len(vals))
            sessions.append({
                "id": r[0], "title": r[1], "status": r[2],
                "duration_sec": r[3], "created_at": r[4],
                "overall": overall, "metrics": metrics or None,
            })
        return _resp(200, {"sessions": sessions})
    finally:
        conn.close()


def _get_session(session_id: int) -> dict:
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, title, status, transcript, duration_sec, created_at, analysis "
            "FROM yuna_sessions WHERE id = %s",
            (session_id,),
        )
        s = cur.fetchone()
        if not s:
            return _resp(404, {"error": "Приём не найден"})
        cur.execute(
            "SELECT speaker, text FROM yuna_utterances "
            "WHERE session_id = %s ORDER BY ord ASC",
            (session_id,),
        )
        utterances = [{"speaker": u[0], "text": u[1]} for u in cur.fetchall()]
        return _resp(200, {
            "session": {
                "id": s[0], "title": s[1], "status": s[2],
                "transcript": s[3], "duration_sec": s[4], "created_at": s[5],
            },
            "utterances": utterances,
            "analysis": s[6],
        })
    finally:
        conn.close()


def _transcribe(body: dict) -> dict:
    audio_b64 = body.get("audio_base64", "")
    fmt = (body.get("format") or "webm").lower()
    duration_sec = int(body.get("duration_sec") or 0)

    if not audio_b64:
        return _resp(400, {"error": "Аудио не передано"})
    try:
        base64.b64decode(audio_b64[:100])
    except Exception:
        return _resp(400, {"error": "Некорректное аудио"})

    try:
        utterances = _call_routerai(audio_b64, fmt)
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")[:300]
        return _resp(502, {"error": f"Сервис анализа вернул {e.code}", "detail": detail})
    except Exception as e:
        return _resp(502, {"error": f"Не удалось расшифровать: {e}"})

    def label(sp):
        return "Врач" if sp == "doctor" else "Пациент" if sp == "patient" else "—"

    transcript = "\n".join(f"{label(u['speaker'])}: {u['text']}" for u in utterances)

    analysis = None
    if transcript:
        try:
            analysis = _analyze(transcript)
        except Exception as e:
            print(f"[yuna] analysis failed: {e}")

    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO yuna_sessions (status, transcript, duration_sec, analysis) "
            "VALUES ('analyzed', %s, %s, %s) RETURNING id",
            (transcript, duration_sec, json.dumps(analysis) if analysis else None),
        )
        session_id = cur.fetchone()[0]
        for i, u in enumerate(utterances):
            cur.execute(
                "INSERT INTO yuna_utterances (session_id, speaker, text, ord) "
                "VALUES (%s, %s, %s, %s)",
                (session_id, u["speaker"], u["text"], i),
            )
        conn.commit()
    finally:
        conn.close()

    return _resp(200, {
        "session_id": session_id,
        "utterances": utterances,
        "transcript": transcript,
        "analysis": analysis,
    })


def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "isBase64Encoded": False, "body": ""}

    if method == "GET":
        qs = event.get("queryStringParameters") or {}
        sid = qs.get("session_id")
        if sid:
            try:
                return _get_session(int(sid))
            except ValueError:
                return _resp(400, {"error": "Неверный session_id"})
        return _list_sessions()

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        return _transcribe(body)

    return _resp(405, {"error": "Метод не поддерживается"})