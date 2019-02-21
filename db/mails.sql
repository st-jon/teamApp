DROP TABLE if EXISTS mails;

CREATE TABLE mails(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    team_id VARCHAR(200) NOT NULL REFERENCES teams(team),
    note_id INTEGER NOT NULL REFERENCES notes(id),  
    read BOOLEAN DEFAULT false, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);