CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(id),
    assignment_id INT REFERENCES assignments(id),
    submission_text TEXT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    score DECIMAL(5, 2)
);