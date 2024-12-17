import express from 'express';
import { pgPool } from './pg_connection.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// middleware to handle body parameters
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// start the server
app.listen(3001, () => {
	console.log('The server is running!');
});

// defining endpoints

app.post('/genres', async (req, res) => {
	const { name, description } = req.body;

	if (!name || !description) {
		return res.status(400).json({ success: false, error: 'Genre name and description are required.' });
	}

	try {
		const existingGenre = await pgPool.query('SELECT * FROM Genre WHERE genreName = $1', [name]);
		if (existingGenre.rowCount > 0) {
			return res.status(400).json({ success: false, error: 'Genre already exists.' });
		}

		const result = await pgPool.query(
			'INSERT INTO Genre (genreName, descr) VALUES ($1, $2) RETURNING *',
			[name, description]
		);

		const newGenre = result.rows[0];

		res.status(201).json({
			success: true,
			message: 'Genre added successfully.',
			genre: { id: newGenre.id, name: newGenre.genreName, description: newGenre.descr }
		});
	} catch (e) {
		console.error('Error adding genre:', e.message);
		res.status(500).json({ success: false, error: 'An error occurred while adding the genre.' });
	}
});

app.post('/movies', async (req, res) => {
	const { name, year, genre } = req.body;

	if (!name || !year || !genre) {
		return res.status(400).json({ success: false, error: 'Movie name, year, and genre are required.' });
	}
	try {
		const genreResult = await pgPool.query('SELECT * FROM Genre WHERE genreName = $1', [genre]);
		if (genreResult.rowCount === 0) {
			return res.status(400).json({ success: false, error: `Genre '${genre}' does not exist.` });
		}

		const movieResult = await pgPool.query(
			'SELECT * FROM Movie WHERE name = $1 AND year = $2 AND genre_id = $3',
			[name, year, genreResult.rows[0].id]
		);
		if (movieResult.rowCount > 0) {
			return res.status(400).json({ success: false, error: 'Movie already exists.' });
		}

		const insertResult = await pgPool.query(
			'INSERT INTO Movie (name, year, genre_id) VALUES ($1, $2, $3) RETURNING *',
			[name, year, genreResult.rows[0].id]
		);

		const newMovie = insertResult.rows[0];

		res.status(201).json({
			success: true,
			message: 'Movie added successfully.',
			movie: {
				id: newMovie.id,
				name: newMovie.name,
				year: newMovie.year,
				genre: genre,
			},
		});
	} catch (e) {
		console.error('Error adding movie:', e.message);
		res.status(500).json({ success: false, error: 'An error occurred while adding the movie.' });
	}
});

app.get('/movies', async (req, res) => {
	try {
		const result = await pgPool.query("SELECT * FROM movie");
		res.json({ success: true, movies: result.rows });
	} catch (e) {
		console.error("Error fetching movies:", e.message);
		res.status(500).json({ success: false, error: e.message });
	}
});

app.post('/users', async (req, res) => {
	const { name, username, password, yearOfBirth } = req.body;

	if (!name || !username || !password || !yearOfBirth) {
		return res.status(400).json({ success: false, error: 'All fields are required.' });
	}

	try {
		const userCheckResult = await pgPool.query('SELECT * FROM Users WHERE username = $1', [username]);

		if (userCheckResult.rowCount > 0) {
			return res.status(400).json({ success: false, error: 'Username already exists.' });
		}

		const insertResult = await pgPool.query(
			'INSERT INTO Users (name, username, password, yearOfBirth) VALUES ($1, $2, $3, $4) RETURNING *',
			[name, username, password, yearOfBirth]
		);

		const newUser = insertResult.rows[0];

		res.status(201).json({
			success: true,
			message: 'User registered successfully.',
			user: {
				id: newUser.id,
				name: newUser.name,
				username: newUser.username,
				yearOfBirth: newUser.yearofbirth,
			},
		});
	} catch (e) {
		console.error('Error registering user:', e.message);
		res.status(500).json({ success: false, error: 'An error occurred while registering the user.' });
	}
});

app.get('/movies/search', async (req, res) => {
    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({ success: false, error: 'Keyword is required.' });
    }

    try {
        const result = await pgPool.query(
            "SELECT * FROM Movie WHERE LOWER(name) LIKE LOWER($1)",
            [`%${keyword}%`]
        );

        res.status(200).json({ success: true, results: result.rows });
    } catch (e) {
        console.error('Error searching for movies:', e.message);
        res.status(500).json({ success: false, error: 'An error occurred while searching for movies.' });
    }
});

app.get('/movies/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pgPool.query('SELECT * FROM Movie WHERE id = $1', [id]);

		if (result.rowCount === 0) {
			return res.status(404).json({ success: false, error: 'Movie not found.' });
		}

		const movie = result.rows[0];
		res.json({ success: true, movie });
	} catch (e) {
		console.error('Error fetching movie:', e.message);
		res.status(500).json({ success: false, error: 'An error occurred while fetching the movie.' });
	}
});

app.post('/movies/:id/reviews', async (req, res) => {
	const { id } = req.params;
	const { username, stars, text } = req.body;

	if (!username || !stars || !text) {
		return res.status(400).json({ success: false, error: 'Username, stars, and text are required.' });
	}

	try {

		const movieResult = await pgPool.query('SELECT * FROM Movie WHERE id = $1', [id]);
		if (movieResult.rowCount === 0) {
			return res.status(404).json({ success: false, error: 'Movie not found.' });
		}

		const userResult = await pgPool.query('SELECT * FROM Users WHERE username = $1', [username]);
		if (userResult.rowCount === 0) {
			return res.status(404).json({ success: false, error: 'User not found.' });
		}

		const insertResult = await pgPool.query(
			'INSERT INTO Reviews (user_id, movie_id, reviewText, stars) VALUES ($1, $2, $3, $4) RETURNING *',
			[userResult.rows[0].id, id, text, stars]
		);

		const newReview = insertResult.rows[0];

		res.status(201).json({
			success: true,
			message: 'Review added successfully.',
			review: {
				id: newReview.id,
				movie_id: newReview.movie_id,
				userId: newReview.user_id,
				stars: newReview.stars,
				text: newReview.reviewtext,
			},
		});
	} catch (e) {
		console.error('Error adding review:', e.message);
		res.status(500).json({ success: false, error: 'An error occurred while adding the review.' });
	}
});

app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pgPool.query("DELETE FROM movie WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Movie not found.' });
        }
        res.json({ success: true, message: 'Movie deleted successfully.', movie: result.rows[0] });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

app.post('/users/:username/favorites', async (req, res) => {
	const { username } = req.params;
	const { movie_id } = req.body;

	if (!movie_id) {
		return res.status(400).json({ success: false, error: 'Movie ID is required.' });
	}

	try {
		const userResult = await pgPool.query('SELECT * FROM Users WHERE username = $1', [username]);
		if (userResult.rowCount === 0) {
			return res.status(404).json({ success: false, error: 'User not found.' });
		}

		const movieResult = await pgPool.query('SELECT * FROM Movie WHERE id = $1', [movie_id]);
		if (movieResult.rowCount === 0) {
			return res.status(404).json({ success: false, error: 'Movie not found.' });
		}

		const favoriteResult = await pgPool.query(
			'SELECT * FROM Favorite WHERE user_id = $1 AND movie_id = $2',
			[userResult.rows[0].id, movie_id]
		);
		if (favoriteResult.rowCount > 0) {
			return res.status(400).json({ success: false, error: 'This movie is already in the user\'s favorites.' });
		}

		const insertResult = await pgPool.query(
			'INSERT INTO Favorite (user_id, movie_id) VALUES ($1, $2) RETURNING *',
			[userResult.rows[0].id, movie_id]
		);

		const newFavorite = insertResult.rows[0];

		res.status(201).json({
			success: true,
			message: 'Favorite added successfully.',
			favorite: newFavorite,
		});
	} catch (e) {
		console.error('Error adding favorite:', e.message);
		res.status(500).json({ success: false, error: 'An error occurred while adding the favorite.' });
	}
});


app.get('/users/:username/favorites', async (req, res) => {
	const { username } = req.params;
	try {
		const result = await pgPool.query(`
			SELECT movie.* 
			FROM favorite
			JOIN users ON favorite.user_id = users.id
			JOIN movie ON favorite.movie_id = movie.id
			WHERE users.username = $1
		`, [username]);
		res.json({ success: true, favorites: result.rows });
	} catch (e) {
		console.error("Error fetching favorites:", e.message);
		res.status(500).json({ success: false, error: e.message });
	}
});