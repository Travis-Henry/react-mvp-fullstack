DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    user_id SERIAL,
    username VARCHAR(30),
    password VARCHAR(30),
    CONSTRAINT user_key PRIMARY KEY (user_id)
);

CREATE TABLE messages(
    message_id SERIAL,
    content TEXT,
    user_id INTEGER REFERENCES users(user_id),
    recipient_id INTEGER REFERENCES users(user_id),
    CONSTRAINT message_key PRIMARY KEY(message_id)
);

INSERT INTO users(username, password) VALUES('Travis', 'password');
INSERT INTO users(username, password) VALUES('Austin', 'password');                 

INSERT INTO messages(content, user_id, recipient_id) VALUES('Hello', 1, 2);