DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  author VARCHAR(255),
  image_url VARCHAR(255),
  isbn VARCHAR(255)
);

INSERT INTO books (title, description, author, image_url, isbn) 
VALUES('feed Sherry','Razan','do immediately after getting home','pets','Sherry is hungry');



