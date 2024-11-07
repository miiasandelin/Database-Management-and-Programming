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

INSERT INTO Genre (genreName, descr) VALUES ('Horror', 'Scary!');