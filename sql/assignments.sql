CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id INT REFERENCES users(id),
    due_date TIMESTAMP NOT NULL
);