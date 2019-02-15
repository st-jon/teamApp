DROP TABLE if EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(200) UNIQUE NOT NULL CHECK (username <> ''),
    first_name VARCHAR(200) NOT NULL CHECK (first_name <> ''),
    last_name VARCHAR(200) NOT NULL CHECK (last_name <> ''),
    email VARCHAR(300) UNIQUE NOT NULL CHECK (email <> ''),
    genre VARCHAR(100), 
    user_picture VARCHAR(400),
    user_status TEXT,
    password VARCHAR(300) NOT NULL CHECK (password <> '')
);