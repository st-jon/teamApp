DROP TABLE if EXISTS messages;

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    messages TEXT NOT NULL CHECK (messages <> ''),
    team_id INTEGER NOT NULL REFERENCES teams(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);