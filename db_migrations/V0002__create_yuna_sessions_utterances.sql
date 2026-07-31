CREATE TABLE IF NOT EXISTS yuna_sessions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'Приём',
    status VARCHAR(32) NOT NULL DEFAULT 'new',
    transcript TEXT DEFAULT '',
    duration_sec INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS yuna_utterances (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES yuna_sessions(id),
    speaker VARCHAR(32) NOT NULL DEFAULT 'unknown',
    text TEXT NOT NULL DEFAULT '',
    ord INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_yuna_utterances_session ON yuna_utterances(session_id);