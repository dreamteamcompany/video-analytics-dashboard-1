CREATE TABLE IF NOT EXISTS yuna_doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL DEFAULT '',
    experience_years INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT DEFAULT '',
    points INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE yuna_sessions ADD COLUMN IF NOT EXISTS doctor_id INTEGER REFERENCES yuna_doctors(id);

CREATE INDEX IF NOT EXISTS idx_yuna_sessions_doctor ON yuna_sessions(doctor_id);

INSERT INTO yuna_doctors (name, specialty, experience_years, points, is_active)
SELECT 'Доктор Иванов А.С.', 'Стоматолог-хирург', 12, 245, TRUE
WHERE NOT EXISTS (SELECT 1 FROM yuna_doctors);
