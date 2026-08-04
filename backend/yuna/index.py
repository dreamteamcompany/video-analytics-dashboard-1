"""
Подпроект «Юна»: анализ приёма врач-пациент.
GET                 — список приёмов (yuna_sessions).
GET ?session_id=N   — реплики конкретного приёма.
POST { audio_base64, format, duration_sec } — обработка записи тремя шагами:
      1) Whisper (audio/transcriptions) переводит аудио в текст + сегменты с таймингами;
      2) гибридная диаризация: реплики режутся по паузам, модель проставляет роли
         (doctor/patient); если сегментов нет — fallback на разбор текста по смыслу;
      2.5) корректор исправляет искажённые стоматологические термины в репликах;
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
import hashlib
import secrets
import urllib.request
import urllib.error
import psycopg2
import boto3

CHAT_URL = "https://routerai.ru/api/v1/chat/completions"
TRANSCRIBE_URL = "https://routerai.ru/api/v1/audio/transcriptions"
WHISPER_MODEL = "openai/whisper-large-v3"
CHAT_MODEL = "openai/gpt-5.1"
SEARCH_MODEL = "perplexity/sonar"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
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


def _hash_password(password: str) -> str:
    """Хеширует пароль со случайной солью. Формат: salt$hex_hash."""
    salt = secrets.token_hex(4)
    h = hashlib.sha256((salt + ":" + password).encode()).hexdigest()
    return f"{salt}${h}"


def _check_password(password: str, stored: str) -> bool:
    if not stored or "$" not in stored:
        return False
    salt, h = stored.split("$", 1)
    calc = hashlib.sha256((salt + ":" + password).encode()).hexdigest()
    return secrets.compare_digest(calc, h)


def _doctor_by_token(token: str):
    """Возвращает id врача по токену авторизации или None."""
    if not token:
        return None
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT doctor_id FROM yuna_auth_tokens WHERE token = %s", (token,))
        r = cur.fetchone()
        return r[0] if r else None
    finally:
        conn.close()


def _upload_audio(audio_bytes: bytes, fmt: str) -> str:
    """Сохраняет запись приёма в S3 и возвращает публичный CDN-URL для прослушивания."""
    ext = "webm" if fmt == "webm" else "mp4" if fmt in ("mp4", "m4a") else fmt
    content_type = "audio/webm" if ext == "webm" else "audio/mp4"
    key = f"yuna/recordings/{uuid.uuid4().hex}.{ext}"
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=key, Body=audio_bytes, ContentType=content_type)
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def _resp(status: int, body: dict) -> dict:
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "isBase64Encoded": False,
        "body": json.dumps(body, default=str, ensure_ascii=False),
    }


def _transcribe_audio(audio_bytes: bytes, fmt: str) -> tuple:
    """Шаг 1: аудио -> текст + сегменты с таймингами через Whisper (multipart/form-data).

    Возвращает (text, segments), где segments — список {start, end, text} для
    гибридной диаризации по паузам. Если провайдер не вернул сегменты,
    segments будет пустым списком.
    """
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
    add_field("response_format", "verbose_json")
    add_field("timestamp_granularities[]", "segment")
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

    segments = []
    for s in data.get("segments") or []:
        if not isinstance(s, dict):
            continue
        st = s.get("text")
        if st is None or not str(st).strip():
            continue
        try:
            start = float(s.get("start", 0.0))
            end = float(s.get("end", start))
        except (TypeError, ValueError):
            start, end = 0.0, 0.0
        segments.append({"start": start, "end": end, "text": str(st).strip()})

    return text.strip(), segments


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


PAUSE_GAP = 0.7  # секунды тишины между сегментами -> вероятная смена говорящего

ASSIGN_PROMPT = (
    "Ты — эксперт по анализу медицинских диалогов. На вход приходит СТОМАТОЛОГИЧЕСКИЙ "
    "приём, уже разбитый на пронумерованные реплики (границы определены по паузам в "
    "речи). Твоя задача — для КАЖДОЙ реплики определить говорящего: doctor (врач) или "
    "patient (пациент). Реплики НЕ переписывай, НЕ объединяй и НЕ дели — только "
    "проставь роль каждой по её номеру.\n"
    "Признаки врача: задаёт уточняющие вопросы о симптомах, собирает анамнез, "
    "объясняет, ставит диагноз, назначает обследования, препараты, дозировки.\n"
    "Признаки пациента: описывает жалобы, боль, самочувствие, отвечает на вопросы, "
    "переспрашивает, выражает эмоции и опасения.\n"
    "Учитывай чередование ролей (вопрос врача -> ответ пациента) как ориентир. "
    "Если роль неочевидна — unknown.\n"
    "Верни СТРОГО JSON без markdown вида: "
    '{"roles":[{"i":номер,"speaker":"doctor|patient|unknown"}]} для всех номеров. '
    "Ничего кроме JSON."
)


def _group_by_pauses(segments: list) -> list:
    """Группирует сегменты в реплики-«ходы»: новая реплика при паузе >= PAUSE_GAP."""
    turns = []
    cur = None
    for s in segments:
        if cur is None:
            cur = {"text": s["text"]}
            prev_end = s["end"]
            continue
        gap = s["start"] - prev_end
        if gap >= PAUSE_GAP:
            turns.append(cur)
            cur = {"text": s["text"]}
        else:
            cur["text"] = (cur["text"] + " " + s["text"]).strip()
        prev_end = s["end"]
    if cur is not None:
        turns.append(cur)
    return [t for t in turns if t["text"].strip()]


def _assign_roles(turns: list) -> list:
    """Проставляет роли на уже нарезанных по паузам репликах через chat-модель."""
    numbered = "\n".join(f"[{i}] {t['text']}" for i, t in enumerate(turns))
    payload = {
        "model": CHAT_MODEL,
        "messages": [
            {"role": "system", "content": ASSIGN_PROMPT},
            {"role": "user", "content": numbered},
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
        print(f"[yuna] Assign unexpected response: {raw[:400]}")
        raise RuntimeError("Модель разметки ролей не вернула результат")
    content = data["choices"][0]["message"]["content"].strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()
    parsed = json.loads(content)
    roles = {}
    for r in parsed.get("roles", []):
        try:
            idx = int(r.get("i"))
        except (TypeError, ValueError):
            continue
        sp = r.get("speaker", "unknown")
        roles[idx] = sp if sp in ("doctor", "patient") else "unknown"
    out = []
    for i, t in enumerate(turns):
        out.append({"speaker": roles.get(i, "unknown"), "text": t["text"]})
    return out


def _diarize(segments: list) -> list:
    """Гибридная диаризация: паузы задают границы реплик, модель проставляет роли."""
    turns = _group_by_pauses(segments)
    if not turns:
        return []
    return _assign_roles(turns)


CORRECT_PROMPT = (
    "Ты — редактор-корректор расшифровок СТОМАТОЛОГИЧЕСКОГО приёма. На вход "
    "приходит сырой текст, полученный распознаванием речи (возможны ошибки из-за "
    "шума кабинета и бормашины). Твоя задача — исправить ТОЛЬКО искажённые "
    "медицинские и стоматологические термины, вернув корректный текст.\n"
    "Что исправлять:\n"
    "- названия зубов и их нумерацию (например 'тридцать шестой зуб', '36 зуб', "
    "правильные названия: моляр, премоляр, клык, резец);\n"
    "- названия препаратов и анестетиков (Ультракаин, Убистезин, Артикаин, "
    "Лидокаин, Септанест, амоксициллин и т.п.) — восстанови верное написание;\n"
    "- диагнозы и состояния (пульпит, периодонтит, кариес, гингивит, пародонтит, "
    "периимплантит и т.п.);\n"
    "- процедуры, материалы и инструменты (эндодонтия, коффердам, апекслокатор, "
    "гуттаперча, коронка, имплантат, композит, ProTaper и т.п.);\n"
    "- очевидные опечатки в числах, дозировках и единицах (мл, мг, %).\n"
    "СТРОГИЕ правила: НЕ меняй смысл; НЕ добавляй и НЕ удаляй информацию; "
    "сохраняй разговорные слова и жалобы пациента как есть; если слово не является "
    "искажённым термином — оставь без изменений; не размечай говорящих.\n"
    "Верни СТРОГО JSON без markdown: {\"text\":\"исправленный текст\"}. Ничего кроме JSON."
)


def _correct_terms(transcript: str) -> str:
    """Шаг-корректор: исправляет искажённые стоматологические термины после Whisper."""
    payload = {
        "model": CHAT_MODEL,
        "messages": [
            {"role": "system", "content": CORRECT_PROMPT},
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
        print(f"[yuna] Correct unexpected response: {raw[:400]}")
        return transcript
    content = data["choices"][0]["message"]["content"].strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()
    try:
        fixed = json.loads(content).get("text")
    except Exception:
        return transcript
    fixed = (fixed or "").strip()
    return fixed if fixed else transcript


def _correct_utterances(utterances: list) -> list:
    """Исправляет стоматологические термины в тексте каждой реплики (сохраняя разбивку)."""
    joined = "\n".join(f"[{i}] {u['text']}" for i, u in enumerate(utterances))
    fixed_text = _correct_terms(joined)
    fixed_map = {}
    for line in fixed_text.split("\n"):
        line = line.strip()
        if line.startswith("[") and "]" in line:
            try:
                idx = int(line[1:line.index("]")])
            except ValueError:
                continue
            fixed_map[idx] = line[line.index("]") + 1:].strip()
    if not fixed_map:
        return utterances
    out = []
    for i, u in enumerate(utterances):
        out.append({"speaker": u["speaker"], "text": fixed_map.get(i, u["text"]) or u["text"]})
    return out


def _call_routerai(audio_b64: str, fmt: str) -> list:
    audio_bytes = base64.b64decode(audio_b64)
    transcript, segments = _transcribe_audio(audio_bytes, fmt)
    if not transcript:
        return []

    # Гибридная диаризация: если есть тайминги сегментов — режем по паузам и
    # проставляем роли на готовых репликах; иначе — старый разбор текста моделью.
    utterances = []
    if segments:
        try:
            utterances = _diarize(segments)
        except Exception as e:
            print(f"[yuna] diarization failed, fallback to text split: {e}")
    if not utterances:
        try:
            transcript = _correct_terms(transcript)
        except Exception as e:
            print(f"[yuna] term correction skipped: {e}")
        return _split_speakers(transcript)

    try:
        utterances = _correct_utterances(utterances)
    except Exception as e:
        print(f"[yuna] term correction (utterances) skipped: {e}")
    return utterances


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
    "Дополнительно сформируй patient — карту пациента по тому, что прозвучало в диалоге:\n"
    "- name: ФИО или имя, если названо, иначе '';\n"
    "- age: возраст числом (int) если назван, иначе null;\n"
    "- sex: 'Мужской'/'Женский' если ясно, иначе '';\n"
    "- weight_kg: вес в кг (int) если назван, иначе null;\n"
    "- allergies: массив аллергий (например ['Пенициллин']), пустой если нет;\n"
    "- chronic: массив хронических заболеваний, пустой если нет;\n"
    "- smoking: строка про курение (например '10 сигарет/день') или '';\n"
    "- complaints: массив жалоб/симптомов пациента из диалога (боль, реакция и т.п.);\n"
    "- localization: локализация проблемы (например '36 зуб') или ''.\n"
    "Дополнительно сформируй anesthesia — расчёт анестезии:\n"
    "- drug: рекомендуемый анестетик (например 'Ультракаин DS'), '' если не определить;\n"
    "- dose_ml: рекомендуемая доза в мл (число, например 1.7);\n"
    "- reserve_ml: резерв в мл (число);\n"
    "- max_ml: максимально допустимая доза в мл (число) с учётом веса/возраста;\n"
    "- basis: краткое обоснование расчёта (учтён вес/возраст/анамнез) строкой;\n"
    "- alternatives: массив 0-3 объектов {name, dose_ml} — аналоги препаратов.\n"
    "Дополнительно сформируй drug_control — фармакологический контроль:\n"
    "- contraindications: массив 0-4 объектов {drug, reason} — что избегать и почему "
    "(на основе аллергий/анамнеза, например {drug:'Амоксициллин', reason:'аллергия на пенициллин'});\n"
    "- interactions: массив 0-3 объектов {drug, note} — лекарственные взаимодействия;\n"
    "- safe: массив 0-5 строк — разрешённые/безопасные препараты.\n"
    "Дополнительно сформируй upsell — потенциал доп. услуг по словам пациента:\n"
    "- potential: 'Высокий'/'Средний'/'Низкий';\n"
    "- services: массив 0-4 объектов {name, score} (score int 0-100) — рекомендуемые доп. услуги;\n"
    "- phrases: массив 0-4 ключевых фраз пациента, указывающих на готовность (дословно из диалога).\n"
    "Дополнительно сформируй loyalty — прогноз лояльности пациента:\n"
    "- repeat: int 0-100 — вероятность повторного визита;\n"
    "- nps: int 0-10 — ожидаемый NPS пациента;\n"
    "- recommend: int 0-100 — готовность рекомендовать клинику.\n"
    "Дополнительно сформируй doctor_state — состояние врача по его речи в диалоге:\n"
    "- status: краткий статус (например 'Спокоен и уверен' или 'Повышенное напряжение');\n"
    "- stress: int 0-100 — уровень стресса/напряжения врача;\n"
    "- speech_rate: строка про темп речи (например 'В норме' или 'Учащённая, +35%');\n"
    "- tone: строка про тональность (например 'Ровная' или 'Повышенная');\n"
    "- improve: массив 0-4 объектов {area, delta} — что улучшить и оценка "
    "(например {area:'Эмпатические ответы', delta:'-15%'});\n"
    "- coaching: строка — рекомендуемая мини-тренировка (например 'Активное слушание пациента').\n"
    "Дополнительно сформируй speech — детальную РЕЧЕВУЮ АНАЛИТИКУ речи ВРАЧА в диалоге:\n"
    "- comm_quality: {empathy, clarity, professionalism, engagement} — оценки качества общения "
    "по шкале 0-100 (эмпатия, ясность, профессионализм, вовлечённость);\n"
    "- needs: {active_questions, depth, hidden_needs} int 0-100 — выявление потребностей пациента "
    "(активные вопросы, глубина анализа, выявление скрытых нужд);\n"
    "- objections: {financial, fear_pain, time_need} int 0-100 — качество отработки возражений "
    "(финансовых, страха/боли, времени/необходимости);\n"
    "- promotions: {mentioned, relevance, conversion} int 0-100 — информирование об акциях/доп.услугах "
    "(упоминание, релевантность, конверсия);\n"
    "- filler_words: массив 0-6 объектов {word, count} — слова-паразиты врача с числом употреблений "
    "(например {word:'ну', count:5}), пустой если их нет;\n"
    "- pauses_sec: number — средняя длительность пауз в речи врача в секундах;\n"
    "- listening: {clarifying, paraphrasing} int 0-100 — активное слушание "
    "(уточняющие вопросы, перефразирование);\n"
    "- med_terms: {explained, adapted} int 0-100 — работа с мед. терминами "
    "(объяснение терминов, адаптация под пациента);\n"
    "- emotion: {positive, neutral, negative} int 0-100 — эмоциональный окрас диалога "
    "(в сумме ~100);\n"
    "- mistakes: массив 0-5 объектов {name, share} — ошибки в общении с пациентом и их доля 0-100 "
    "(например {name:'Сложные термины', share:42}), пустой если ошибок нет.\n"
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
    '"alternatives":[{"name":str,"score":int}],"aftercare":[str]},'
    '"patient":{"name":str,"age":int|null,"sex":str,"weight_kg":int|null,'
    '"allergies":[str],"chronic":[str],"smoking":str,"complaints":[str],"localization":str},'
    '"anesthesia":{"drug":str,"dose_ml":number,"reserve_ml":number,"max_ml":number,'
    '"basis":str,"alternatives":[{"name":str,"dose_ml":number}]},'
    '"drug_control":{"contraindications":[{"drug":str,"reason":str}],'
    '"interactions":[{"drug":str,"note":str}],"safe":[str]},'
    '"upsell":{"potential":str,"services":[{"name":str,"score":int}],"phrases":[str]},'
    '"loyalty":{"repeat":int,"nps":int,"recommend":int},'
    '"doctor_state":{"status":str,"stress":int,"speech_rate":str,"tone":str,'
    '"improve":[{"area":str,"delta":str}],"coaching":str},'
    '"speech":{"comm_quality":{"empathy":int,"clarity":int,"professionalism":int,"engagement":int},'
    '"needs":{"active_questions":int,"depth":int,"hidden_needs":int},'
    '"objections":{"financial":int,"fear_pain":int,"time_need":int},'
    '"promotions":{"mentioned":int,"relevance":int,"conversion":int},'
    '"filler_words":[{"word":str,"count":int}],"pauses_sec":number,'
    '"listening":{"clarifying":int,"paraphrasing":int},'
    '"med_terms":{"explained":int,"adapted":int},'
    '"emotion":{"positive":int,"neutral":int,"negative":int},'
    '"mistakes":[{"name":str,"share":int}]}}. '
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
        "patient": _parse_patient(p.get("patient")),
        "anesthesia": _parse_anesthesia(p.get("anesthesia")),
        "drug_control": _parse_drug_control(p.get("drug_control")),
        "upsell": _parse_upsell(p.get("upsell")),
        "loyalty": _parse_loyalty(p.get("loyalty")),
        "doctor_state": _parse_doctor_state(p.get("doctor_state")),
        "speech": _parse_speech(p.get("speech")),
    }


def _parse_speech(s) -> dict:
    """Детальная речевая аналитика речи врача."""
    s = s if isinstance(s, dict) else {}

    def grp(key, fields):
        src = s.get(key) if isinstance(s.get(key), dict) else {}
        return {f: _clamp_score(src.get(f)) for f in fields}

    cq = grp("comm_quality", ["empathy", "clarity", "professionalism", "engagement"])
    needs = grp("needs", ["active_questions", "depth", "hidden_needs"])
    obj = grp("objections", ["financial", "fear_pain", "time_need"])
    promo = grp("promotions", ["mentioned", "relevance", "conversion"])
    listening = grp("listening", ["clarifying", "paraphrasing"])
    med = grp("med_terms", ["explained", "adapted"])
    emo = grp("emotion", ["positive", "neutral", "negative"])

    fillers = []
    for it in (s.get("filler_words") or []):
        if isinstance(it, dict) and str(it.get("word", "")).strip():
            fillers.append({
                "word": str(it["word"]).strip(),
                "count": _int_or_none(it.get("count")) or 0,
            })

    mistakes = []
    for it in (s.get("mistakes") or []):
        if isinstance(it, dict) and str(it.get("name", "")).strip():
            mistakes.append({
                "name": str(it["name"]).strip(),
                "share": _clamp_score(it.get("share")),
            })

    return {
        "comm_quality": cq,
        "needs": needs,
        "objections": obj,
        "promotions": promo,
        "filler_words": fillers[:6],
        "pauses_sec": _num(s.get("pauses_sec")) or 0,
        "listening": listening,
        "med_terms": med,
        "emotion": emo,
        "mistakes": mistakes[:5],
    }


def _str_list(v) -> list:
    return [str(x).strip() for x in v if str(x).strip()] if isinstance(v, list) else []


def _num(v):
    try:
        n = float(v)
        return int(n) if n == int(n) else round(n, 2)
    except (TypeError, ValueError):
        return None


def _int_or_none(v):
    try:
        return int(round(float(v)))
    except (TypeError, ValueError):
        return None


def _parse_patient(p) -> dict:
    """Карта пациента из диалога."""
    if not isinstance(p, dict):
        return {}
    out = {
        "name": str(p.get("name") or "").strip(),
        "age": _int_or_none(p.get("age")),
        "sex": str(p.get("sex") or "").strip(),
        "weight_kg": _int_or_none(p.get("weight_kg")),
        "allergies": _str_list(p.get("allergies")),
        "chronic": _str_list(p.get("chronic")),
        "smoking": str(p.get("smoking") or "").strip(),
        "complaints": _str_list(p.get("complaints")),
        "localization": str(p.get("localization") or "").strip(),
    }
    if not any([out["name"], out["age"], out["allergies"], out["chronic"],
                out["smoking"], out["complaints"], out["localization"]]):
        return {}
    return out


def _parse_anesthesia(a) -> dict:
    """Расчёт анестезии."""
    if not isinstance(a, dict):
        return {}
    alts = []
    raw = a.get("alternatives")
    if isinstance(raw, list):
        for x in raw:
            if isinstance(x, dict):
                name = str(x.get("name") or "").strip()
                if name:
                    alts.append({"name": name, "dose_ml": _num(x.get("dose_ml"))})
    out = {
        "drug": str(a.get("drug") or "").strip(),
        "dose_ml": _num(a.get("dose_ml")),
        "reserve_ml": _num(a.get("reserve_ml")),
        "max_ml": _num(a.get("max_ml")),
        "basis": str(a.get("basis") or "").strip(),
        "alternatives": alts,
    }
    if not out["drug"] and out["dose_ml"] is None and not alts:
        return {}
    return out


def _parse_drug_control(d) -> dict:
    """Фармакологический контроль: противопоказания, взаимодействия, безопасные."""
    if not isinstance(d, dict):
        return {}
    contra = []
    for x in d.get("contraindications") or []:
        if isinstance(x, dict):
            drug = str(x.get("drug") or "").strip()
            if drug:
                contra.append({"drug": drug, "reason": str(x.get("reason") or "").strip()})
    inter = []
    for x in d.get("interactions") or []:
        if isinstance(x, dict):
            drug = str(x.get("drug") or "").strip()
            if drug:
                inter.append({"drug": drug, "note": str(x.get("note") or "").strip()})
    safe = _str_list(d.get("safe"))
    if not contra and not inter and not safe:
        return {}
    return {"contraindications": contra, "interactions": inter, "safe": safe}


def _parse_upsell(u) -> dict:
    """Потенциал доп. услуг."""
    if not isinstance(u, dict):
        return {}
    services = []
    for x in u.get("services") or []:
        if isinstance(x, dict):
            name = str(x.get("name") or "").strip()
            if name:
                services.append({"name": name, "score": _clamp_score(x.get("score"))})
    phrases = _str_list(u.get("phrases"))
    potential = str(u.get("potential") or "").strip()
    if not services and not phrases and not potential:
        return {}
    return {"potential": potential, "services": services, "phrases": phrases}


def _parse_loyalty(l) -> dict:
    """Прогноз лояльности пациента."""
    if not isinstance(l, dict):
        return {}
    has = any(isinstance(l.get(k), (int, float)) for k in ("repeat", "nps", "recommend"))
    if not has:
        return {}
    nps = _int_or_none(l.get("nps"))
    return {
        "repeat": _clamp_score(l.get("repeat")),
        "nps": max(0, min(10, nps)) if nps is not None else None,
        "recommend": _clamp_score(l.get("recommend")),
    }


def _parse_doctor_state(d) -> dict:
    """Состояние врача по речи."""
    if not isinstance(d, dict):
        return {}
    improve = []
    for x in d.get("improve") or []:
        if isinstance(x, dict):
            area = str(x.get("area") or "").strip()
            if area:
                improve.append({"area": area, "delta": str(x.get("delta") or "").strip()})
    out = {
        "status": str(d.get("status") or "").strip(),
        "stress": _clamp_score(d.get("stress")),
        "speech_rate": str(d.get("speech_rate") or "").strip(),
        "tone": str(d.get("tone") or "").strip(),
        "improve": improve,
        "coaching": str(d.get("coaching") or "").strip(),
    }
    if not out["status"] and not out["speech_rate"] and not improve and not out["coaching"]:
        return {}
    return out


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


def _list_sessions(doctor_id=None) -> dict:
    conn = _conn()
    try:
        cur = conn.cursor()
        if doctor_id is not None:
            cur.execute(
                "SELECT id, title, status, duration_sec, created_at, analysis, audio_url "
                "FROM yuna_sessions WHERE doctor_id = %s ORDER BY created_at DESC LIMIT 200",
                (doctor_id,),
            )
        else:
            cur.execute(
                "SELECT id, title, status, duration_sec, created_at, analysis, audio_url "
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
                "audio_url": r[6] or "",
            })
        return _resp(200, {"sessions": sessions})
    finally:
        conn.close()


def _get_session(session_id: int) -> dict:
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, title, status, transcript, duration_sec, created_at, analysis, audio_url "
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
                "audio_url": s[7] or "",
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
    try:
        doctor_id = int(body.get("doctor_id")) if body.get("doctor_id") else None
    except (TypeError, ValueError):
        doctor_id = None

    if not audio_b64:
        return _resp(400, {"error": "Аудио не передано"})
    try:
        audio_bytes = base64.b64decode(audio_b64)
    except Exception:
        return _resp(400, {"error": "Некорректное аудио"})

    audio_url = ""
    try:
        audio_url = _upload_audio(audio_bytes, fmt)
    except Exception as e:
        print(f"[yuna] audio upload skipped: {e}")

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
            "INSERT INTO yuna_sessions (status, transcript, duration_sec, analysis, doctor_id, audio_url) "
            "VALUES ('analyzed', %s, %s, %s, %s, %s) RETURNING id",
            (transcript, duration_sec, json.dumps(analysis) if analysis else None, doctor_id, audio_url),
        )
        session_id = cur.fetchone()[0]
        for i, u in enumerate(utterances):
            cur.execute(
                "INSERT INTO yuna_utterances (session_id, speaker, text, ord) "
                "VALUES (%s, %s, %s, %s)",
                (session_id, u["speaker"], u["text"], i),
            )
        # Начисляем врачу баллы за приём: базовые 5 + бонус за качество
        if doctor_id and analysis:
            ov = ["empathy", "trust", "quality", "communication"]
            vals = [analysis.get(k) for k in ov if isinstance(analysis.get(k), (int, float))]
            bonus = round(sum(vals) / len(vals) / 10) if vals else 0
            cur.execute(
                "UPDATE yuna_doctors SET points = points + %s WHERE id = %s",
                (5 + bonus, doctor_id),
            )
        conn.commit()
    finally:
        conn.close()

    return _resp(200, {
        "session_id": session_id,
        "utterances": utterances,
        "transcript": transcript,
        "analysis": analysis,
        "audio_url": audio_url,
    })


def _doctor_row(r) -> dict:
    return {
        "id": r[0], "name": r[1], "specialty": r[2],
        "experience_years": r[3], "avatar_url": r[4],
        "points": r[5], "is_active": r[6],
        "login": r[7] if len(r) > 7 else "",
    }


def _list_doctors() -> dict:
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, specialty, experience_years, avatar_url, points, is_active, login "
            "FROM yuna_doctors ORDER BY points DESC, id ASC"
        )
        return _resp(200, {"doctors": [_doctor_row(r) for r in cur.fetchall()]})
    finally:
        conn.close()


def _create_doctor(body: dict) -> dict:
    name = str(body.get("name") or "").strip()
    if not name:
        return _resp(400, {"error": "Имя обязательно"})
    login = str(body.get("login") or "").strip().lower()
    password = str(body.get("password") or "")
    if not login:
        return _resp(400, {"error": "Логин обязателен"})
    if len(password) < 4:
        return _resp(400, {"error": "Пароль должен быть не короче 4 символов"})
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM yuna_doctors WHERE LOWER(login) = %s", (login,))
        if cur.fetchone():
            return _resp(409, {"error": "Такой логин уже занят"})
        cur.execute(
            "INSERT INTO yuna_doctors (name, specialty, experience_years, avatar_url, points, login, password_hash) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s) "
            "RETURNING id, name, specialty, experience_years, avatar_url, points, is_active, login",
            (
                name,
                str(body.get("specialty") or "").strip(),
                int(body.get("experience_years") or 0),
                str(body.get("avatar_url") or "").strip(),
                int(body.get("points") or 0),
                login,
                _hash_password(password),
            ),
        )
        row = cur.fetchone()
        conn.commit()
        return _resp(200, {"doctor": _doctor_row(row)})
    finally:
        conn.close()


def _update_doctor(doctor_id: int, body: dict) -> dict:
    login = str(body.get("login") or "").strip().lower()
    password = str(body.get("password") or "")
    conn = _conn()
    try:
        cur = conn.cursor()
        if login:
            cur.execute(
                "SELECT 1 FROM yuna_doctors WHERE LOWER(login) = %s AND id <> %s",
                (login, doctor_id),
            )
            if cur.fetchone():
                return _resp(409, {"error": "Такой логин уже занят"})
        cur.execute(
            "UPDATE yuna_doctors SET name=%s, specialty=%s, experience_years=%s, "
            "avatar_url=%s, is_active=%s, "
            "login=COALESCE(NULLIF(%s, ''), login) "
            "WHERE id=%s "
            "RETURNING id, name, specialty, experience_years, avatar_url, points, is_active, login",
            (
                str(body.get("name") or "").strip(),
                str(body.get("specialty") or "").strip(),
                int(body.get("experience_years") or 0),
                str(body.get("avatar_url") or "").strip(),
                bool(body.get("is_active", True)),
                login,
                doctor_id,
            ),
        )
        row = cur.fetchone()
        if not row:
            return _resp(404, {"error": "Врач не найден"})
        if password:
            if len(password) < 4:
                return _resp(400, {"error": "Пароль должен быть не короче 4 символов"})
            cur.execute(
                "UPDATE yuna_doctors SET password_hash=%s WHERE id=%s",
                (_hash_password(password), doctor_id),
            )
        conn.commit()
        return _resp(200, {"doctor": _doctor_row(row)})
    finally:
        conn.close()


def _delete_doctor(doctor_id: int) -> dict:
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute("UPDATE yuna_sessions SET doctor_id = NULL WHERE doctor_id = %s", (doctor_id,))
        cur.execute("DELETE FROM yuna_doctors WHERE id = %s", (doctor_id,))
        conn.commit()
        return _resp(200, {"deleted": doctor_id})
    finally:
        conn.close()


def _login(body: dict) -> dict:
    """Проверяет логин/пароль врача и выдаёт токен авторизации."""
    login = str(body.get("login") or "").strip().lower()
    password = str(body.get("password") or "")
    if not login or not password:
        return _resp(400, {"error": "Укажите логин и пароль"})
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, specialty, experience_years, avatar_url, points, is_active, login, password_hash "
            "FROM yuna_doctors WHERE LOWER(login) = %s",
            (login,),
        )
        row = cur.fetchone()
        if not row or not _check_password(password, row[8]):
            return _resp(401, {"error": "Неверный логин или пароль"})
        if not row[6]:
            return _resp(403, {"error": "Учётная запись деактивирована"})
        token = secrets.token_hex(32)
        cur.execute(
            "INSERT INTO yuna_auth_tokens (token, doctor_id) VALUES (%s, %s)",
            (token, row[0]),
        )
        conn.commit()
        return _resp(200, {"token": token, "doctor": _doctor_row(row[:8])})
    finally:
        conn.close()


def _logout(token: str) -> dict:
    if token:
        conn = _conn()
        try:
            cur = conn.cursor()
            cur.execute("DELETE FROM yuna_auth_tokens WHERE token = %s", (token,))
            conn.commit()
        finally:
            conn.close()
    return _resp(200, {"ok": True})


def _me(token: str) -> dict:
    """Возвращает данные врача по токену (проверка сессии на фронте)."""
    doctor_id = _doctor_by_token(token)
    if not doctor_id:
        return _resp(401, {"error": "Не авторизован"})
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, specialty, experience_years, avatar_url, points, is_active, login "
            "FROM yuna_doctors WHERE id = %s",
            (doctor_id,),
        )
        row = cur.fetchone()
        if not row:
            return _resp(401, {"error": "Не авторизован"})
        return _resp(200, {"doctor": _doctor_row(row)})
    finally:
        conn.close()


def _doctors_rating() -> dict:
    """Рейтинг врачей по баллам + число приёмов за неделю."""
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT d.id, d.name, d.specialty, d.experience_years, d.avatar_url, d.points, "
            "COUNT(s.id) FILTER (WHERE s.created_at >= NOW() - INTERVAL '7 days') "
            "FROM yuna_doctors d LEFT JOIN yuna_sessions s ON s.doctor_id = d.id "
            "WHERE d.is_active = TRUE "
            "GROUP BY d.id ORDER BY d.points DESC, d.id ASC LIMIT 20"
        )
        rating = []
        for i, r in enumerate(cur.fetchall()):
            rating.append({
                "place": i + 1, "id": r[0], "name": r[1], "specialty": r[2],
                "experience_years": r[3], "avatar_url": r[4], "points": r[5],
                "sessions_week": r[6],
            })
        return _resp(200, {"rating": rating})
    finally:
        conn.close()


def _aggregate_speech(rows: list) -> dict:
    """Усредняет speech-аналитику по всем приёмам врача. None, если приёмов нет."""
    if not rows:
        return None

    def avg_group(key, fields):
        out = {}
        for f in fields:
            vals = [r[key][f] for r in rows
                    if isinstance(r.get(key), dict) and isinstance(r[key].get(f), (int, float))]
            out[f] = round(sum(vals) / len(vals)) if vals else 0
        return out

    def avg_num(key):
        vals = [r[key] for r in rows if isinstance(r.get(key), (int, float))]
        return round(sum(vals) / len(vals), 1) if vals else 0

    # слова-паразиты: суммируем по слову
    fillers = {}
    for r in rows:
        for it in (r.get("filler_words") or []):
            w = str(it.get("word", "")).strip()
            if w:
                fillers[w] = fillers.get(w, 0) + (it.get("count") or 0)
    filler_list = sorted(
        [{"word": w, "count": c} for w, c in fillers.items()],
        key=lambda x: -x["count"],
    )[:6]

    # ошибки: усредняем долю по названию
    merr = {}
    for r in rows:
        for it in (r.get("mistakes") or []):
            n = str(it.get("name", "")).strip()
            if n:
                merr.setdefault(n, []).append(it.get("share") or 0)
    mistakes = sorted(
        [{"name": n, "share": round(sum(v) / len(v))} for n, v in merr.items()],
        key=lambda x: -x["share"],
    )[:5]

    return {
        "count": len(rows),
        "comm_quality": avg_group("comm_quality", ["empathy", "clarity", "professionalism", "engagement"]),
        "needs": avg_group("needs", ["active_questions", "depth", "hidden_needs"]),
        "objections": avg_group("objections", ["financial", "fear_pain", "time_need"]),
        "promotions": avg_group("promotions", ["mentioned", "relevance", "conversion"]),
        "listening": avg_group("listening", ["clarifying", "paraphrasing"]),
        "med_terms": avg_group("med_terms", ["explained", "adapted"]),
        "emotion": avg_group("emotion", ["positive", "neutral", "negative"]),
        "pauses_sec": avg_num("pauses_sec"),
        "filler_words": filler_list,
        "mistakes": mistakes,
    }


def _stats(doctor_id=None) -> dict:
    """Авто-журналы (п.7) и KPI (п.7): агрегаты по приёмам."""
    where = "WHERE doctor_id = %s" if doctor_id is not None else ""
    params = (doctor_id,) if doctor_id is not None else ()
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT "
            "COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE), "
            "COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days'), "
            "COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days'), "
            "COUNT(*), "
            "AVG(duration_sec) FILTER (WHERE duration_sec > 0) "
            f"FROM yuna_sessions {where}",
            params,
        )
        row = cur.fetchone()
        today, week, month, total, avg_dur = row[0], row[1], row[2], row[3], row[4]

        # KPI по метрикам анализа
        kpi_where = "WHERE analysis IS NOT NULL" + (" AND doctor_id = %s" if doctor_id is not None else "")
        cur.execute(f"SELECT analysis FROM yuna_sessions {kpi_where}", params)
        quals, comms, loyals = [], [], []
        speech_rows = []
        for (a,) in cur.fetchall():
            if not a:
                continue
            if isinstance(a.get("quality"), (int, float)):
                quals.append(a["quality"])
            if isinstance(a.get("communication"), (int, float)):
                comms.append(a["communication"])
            loy = a.get("loyalty") or {}
            if isinstance(loy.get("nps"), (int, float)):
                loyals.append(loy["nps"])
            sp = a.get("speech")
            if isinstance(sp, dict):
                speech_rows.append(sp)

        def avg(lst):
            return round(sum(lst) / len(lst)) if lst else None

        satisfaction = None
        if loyals:
            satisfaction = round(sum(loyals) / len(loyals) / 2, 1)  # nps 0-10 -> 0-5

        return _resp(200, {
            "counts": {"today": today, "week": week, "month": month, "total": total},
            "kpi": {
                "quality": avg(quals),
                "communication": avg(comms),
                "avg_minutes": round(avg_dur / 60) if avg_dur else None,
                "satisfaction": satisfaction,
            },
            "speech": _aggregate_speech(speech_rows),
        })
    finally:
        conn.close()


def _learning() -> dict:
    """Персональное обучение (п.12): ищет актуальные курсы/мероприятия в интернете.

    Определяет слабые темы врача по последним приёмам (dental-диагнозы, зоны роста
    из doctor_state) и ищет реальные курсы/вебинары по стоматологии через
    web-search модель (perplexity sonar).
    """
    conn = _conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT analysis FROM yuna_sessions WHERE analysis IS NOT NULL "
            "ORDER BY created_at DESC LIMIT 10"
        )
        topics = set()
        improve = set()
        for (a,) in cur.fetchall():
            if not a:
                continue
            dental = a.get("dental") or {}
            pd = dental.get("primary_diagnosis") or {}
            if pd.get("name"):
                topics.add(pd["name"])
            ds = a.get("doctor_state") or {}
            for im in ds.get("improve") or []:
                if isinstance(im, dict) and im.get("area"):
                    improve.add(im["area"])
    finally:
        conn.close()

    focus = ", ".join(list(topics)[:5]) or "современная стоматология, эндодонтия, диагностика"
    growth = ", ".join(list(improve)[:4]) or "коммуникация с пациентом, эмпатия"

    prompt = (
        "Ты помогаешь стоматологу с профессиональным развитием. Найди в интернете "
        f"АКТУАЛЬНЫЕ (2025-2026) курсы, мастер-классы и вебинары по темам: {focus}. "
        f"Также учти зоны роста врача: {growth}. "
        "Верни СТРОГО JSON без markdown вида: "
        '{"recommended":[{"topic":str,"relevance":int(0-100),"why":str}],'
        '"events":[{"title":str,"date":str,"format":str,"url":str}]}. '
        "Дай 2-3 темы в recommended и 2-4 реальных мероприятия в events с ссылками. "
        "Ничего кроме JSON."
    )
    payload = {
        "model": SEARCH_MODEL,
        "messages": [{"role": "user", "content": prompt}],
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
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            data = json.loads(r.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"].strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()
        # perplexity иногда добавляет текст до/после JSON — вырезаем скобки
        if "{" in content and "}" in content:
            content = content[content.index("{"):content.rindex("}") + 1]
        p = json.loads(content)
    except Exception as e:
        print(f"[yuna] learning failed: {e}")
        return _resp(200, {"recommended": [], "events": [], "focus": focus})

    rec = []
    for x in p.get("recommended") or []:
        if isinstance(x, dict) and x.get("topic"):
            rec.append({
                "topic": str(x["topic"]).strip(),
                "relevance": _clamp_score(x.get("relevance")),
                "why": str(x.get("why") or "").strip(),
            })
    events = []
    for x in p.get("events") or []:
        if isinstance(x, dict) and x.get("title"):
            events.append({
                "title": str(x["title"]).strip(),
                "date": str(x.get("date") or "").strip(),
                "format": str(x.get("format") or "").strip(),
                "url": str(x.get("url") or "").strip(),
            })
    return _resp(200, {"recommended": rec, "events": events, "focus": focus})


def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "isBase64Encoded": False, "body": ""}

    qs = event.get("queryStringParameters") or {}
    resource = qs.get("resource")
    headers = event.get("headers") or {}
    token = headers.get("X-Authorization") or headers.get("x-authorization") or ""

    if method == "GET":
        did_raw = qs.get("doctor_id")
        try:
            did = int(did_raw) if did_raw else None
        except ValueError:
            did = None
        if resource == "me":
            return _me(token)
        if resource == "doctors":
            return _list_doctors()
        if resource == "rating":
            return _doctors_rating()
        if resource == "stats":
            return _stats(did)
        if resource == "learning":
            return _learning()
        sid = qs.get("session_id")
        if sid:
            try:
                return _get_session(int(sid))
            except ValueError:
                return _resp(400, {"error": "Неверный session_id"})
        return _list_sessions(did)

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        if resource == "login":
            return _login(body)
        if resource == "logout":
            return _logout(token)
        if resource == "doctors":
            return _create_doctor(body)
        return _transcribe(body)

    if method == "PUT":
        body = json.loads(event.get("body") or "{}")
        if resource == "doctors":
            try:
                return _update_doctor(int(qs.get("id")), body)
            except (TypeError, ValueError):
                return _resp(400, {"error": "Неверный id"})
        return _resp(400, {"error": "Неизвестный ресурс"})

    if method == "DELETE":
        if resource == "doctors":
            try:
                return _delete_doctor(int(qs.get("id")))
            except (TypeError, ValueError):
                return _resp(400, {"error": "Неверный id"})
        return _resp(400, {"error": "Неизвестный ресурс"})

    return _resp(405, {"error": "Метод не поддерживается"})