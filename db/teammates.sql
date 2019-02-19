DROP TABLE if EXISTS teammates;

CREATE TABLE teammates (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    team_name VARCHAR(200) NOT NULL REFERENCES teams(team),
    member_id INTEGER NOT NULL REFERENCES users(id),
    is_admin BOOLEAN DEFAULT false,
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);