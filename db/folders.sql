DROP TABLE if EXISTS folders;

CREATE TABLE folders(
    id SERIAL PRIMARY KEY,
    folder_name VARCHAR(200) NOT NULL CHECK (folder_name <> "")
    author_id INTEGER NOT NULL REFERENCES users(id)

 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);