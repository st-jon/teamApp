DROP TABLE if EXISTS notes;

CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id),
    team VARCHAR(200),
    note_type VARCHAR NOT NULL CHECK (note_type <> ''),
    note TEXT,
    title VARCHAR(200) NOT NULL CHECK (title <> ''),
    picture VARCHAR(400),
    link VARCHAR(400),
    link_content TEXT,
    publisher VARCHAR(200),
    video VARCHAR(1000),
    sound VARCHAR(1000),
    editable BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notes (author_id, note_type, note, title, editable)
VALUES ('To Do', 'My first note to do', 'my first note to do', true);

INSERT INTO notes (author_id, note_type, note, title, editable)
VALUES ('To read', 'My first note to read', 'my first note to read', true);

INSERT INTO notes (author_id, note_type, note, title, editable)
VALUES ('Idea', 'My first idea', 'my first idea is ...', true);

INSERT INTO notes (author_id, note_type, note, title, editable)
VALUES ('Various', 'My first note', 'my first note', true);