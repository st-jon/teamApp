DROP TABLE if EXISTS teams;

CREATE TABLE teams(
    id SERIAL PRIMARY KEY,
    team VARCHAR(200) UNIQUE NOT NULL CHECK (team <> '' OR team != 'home'),
    team_admin INTEGER NOT NULL REFERENCES users(id)
);