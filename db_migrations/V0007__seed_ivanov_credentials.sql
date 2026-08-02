UPDATE yuna_doctors
SET login = 'ivanov',
    password_hash = 'a1b2c3d4$99fa6c23a8710483e0f0c8bf27761e0507b7eb48f6d96c5660d83b3abaf0c97d'
WHERE login IS NULL AND id = (SELECT MIN(id) FROM yuna_doctors);
