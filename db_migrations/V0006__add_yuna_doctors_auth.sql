ALTER TABLE yuna_doctors ADD COLUMN IF NOT EXISTS login VARCHAR(120);
ALTER TABLE yuna_doctors ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_yuna_doctors_login ON yuna_doctors(LOWER(login)) WHERE login IS NOT NULL AND login <> '';

CREATE TABLE IF NOT EXISTS yuna_auth_tokens (
    token VARCHAR(64) PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES yuna_doctors(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_yuna_auth_tokens_doctor ON yuna_auth_tokens(doctor_id);
