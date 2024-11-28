-- Active: 1730660150090@@127.0.0.1@5432@postgres@public
CREATE TABLE Genre(  
	id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	genreName VARCHAR(255),
	descr VARCHAR(255)
);

CREATE TABLE Users(  
	id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR(255),
	username VARCHAR(255),
	password VARCHAR(255),
	yearOfBirth INT
);

CREATE TABLE Movie(  
	id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	name VARCHAR(255),
	year INT,
	genre_id INT,
	FOREIGN KEY (genre_id) REFERENCES Genre(id)
);

CREATE TABLE Reviews(  
	id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_id INT,
	movie_id INT,
	reviewText VARCHAR(255),
	stars INT
);

CREATE TABLE Favorite(  
	id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_id INT,
	movie_id INT,
	FOREIGN KEY (user_id) REFERENCES Users(id),
	FOREIGN KEY (movie_id) REFERENCES Movie(id)
);

INSERT INTO Genre (genreName, descr) VALUES 
('Drama', 'Dramatic movies'), 
('Comedy', 'Funny movies'), 
('Sci-Fi', 'Science Fiction movies'), 
('Fantasy', 'Fantasy adventures'), 
('Action', 'Action movies'), 
('Thriller', 'Suspenseful movies');

INSERT INTO Movie (name, year, genre_id) VALUES 
('Inception', 2010, (SELECT id FROM Genre WHERE genreName = 'Action')),
('The Terminator', 1984, (SELECT id FROM Genre WHERE genreName = 'Action')),
('Tropic Thunder', 2008, (SELECT id FROM Genre WHERE genreName = 'Comedy')),
('Borat', 2006, (SELECT id FROM Genre WHERE genreName = 'Comedy')),
('Interstellar', 2014, (SELECT id FROM Genre WHERE genreName = 'Drama')),
('Joker', 2019, (SELECT id FROM Genre WHERE genreName = 'Drama'));

INSERT INTO Users (username, name, password, yearOfBirth) VALUES
('reimarii', 'Reima Riihimäki', 'qwerty123', 1986),
('lizzy', 'Lisa Simpson', 'abcdef', 1991),
('boss', 'Ben Bossy', 'salasana', 1981);