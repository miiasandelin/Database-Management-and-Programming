import express from 'express';
import multer from 'multer';

const app = express();

// middleware to handle body parameters
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// start the server
app.listen(3001, () => {
	console.log('The server is running!');
});

// defining endpoints
const genres = [];
const movies = [];
const users = [];
const favorites = {};
const reviews = [];

app.post('/genres', (req, res) => {
	const { name, description } = req.body;
	if (!name || !description) {
		return res.status(400).json({ success: false, error: 'Genre name and description are required.' });
	}
	if (genres.some((genre) => name === genre.name)) {
		return res.status(400).json({ success: false, error: 'Genre already exists.' });
	}
	genres.push({name, description});
	res.status(201).json({ success: true, message: 'Genre added successfully.', genre: name, description, genres });
});

app.post('/movies', (req, res) => {
	const { name, year, genre } = req.body;

	if (!name || !year || !genre) {
	  return res.status(400).send('Movie name, year, and genre are required.');
	}

	if (movies.some((movie) => movie.name === name && movie.year === year && movie.genre === genre)) {
	  return res.status(400).json({ success: false, error: 'Movie already exists.' });
	}

	if (!genres.some((g) => g.name === genre)) {
	  return res.status(400).send(`Genre '${genre}' does not exist.`);
	}

	const movie = { id: movies.length + 1, name, year, genre };
	movies.push(movie);
  
	res.status(201).json({ success: true, message: 'Movie added successfully.', movie });
  });
  
  
app.post('/users', (req, res) => {
	const { name, username, password, yearOfBirth } = req.body;
	if (!name || !username || !password || !yearOfBirth) {
		return res.status(400).json({ success: false, error: 'All fields are required.' });
	}
	if (users.some((user) => user.username === username)) {
		return res.status(400).json({ success: false, error: 'Username already exists.' });
	}
	const user = { name, username, password, yearOfBirth };
	users.push(user);
	res.status(201).json({ success: true, message: 'User registered successfully.', user });
});

app.get('/users/:username', (req, res) => {
	const username = req.params['username'];
	res.send(`You made the request for username ${username}`);
});

app.get('/movies/:id', (req, res) => {
	const { id } = req.params;
	const movie = movies.find((m) => m.id === parseInt(id));
	if (!movie) {
		return res.status(404).json({ success: false, error: 'Movie not found.' });
	}
	res.json({ success: true, movie });
});

app.get('/movies/search', (req, res) => {
	const { keyword } = req.query;
	if (!keyword) {
	  return res.status(400).json({ success: false, error: 'Keyword is required.' });
	}
  
	const results = movies.filter((m) =>
	  m.name.toLowerCase().includes(keyword.toLowerCase())
	);
  
	res.status(200).json({ success: true, results });
  });

app.post('/movies/:id/reviews', (req, res) => {
	const { id } = req.params;
	const { username, stars, text } = req.body;
	if (!username || !stars || !text) {
		return res.status(400).json({ success: false, error: 'Username, stars, and text are required.' });
	}
	const movie = movies.find((m) => m.id === parseInt(id));
	if (!movie) {
		return res.status(404).json({ success: false, error: 'Movie not found.' });
	}
	const review = { movieId: parseInt(id), username, stars, text };
	reviews.push(review);
	res.status(201).json({ success: true, message: 'Review added successfully.', review });
});
  
  app.post('/users/:username/favorites', (req, res) => {
	const { username } = req.params;
	const { favorites: userFavorites } = req.body;
  
	const userExists = users.some(user => user.username === username);
	if (!userExists) {
	  return res.status(404).json({ success: false, error: 'Username not found.' });
	}
  
	if (!userFavorites || !Array.isArray(userFavorites)) {
	  return res.status(400).json({ success: false, error: 'Favorites must be an array of movie IDs.' });
	}
  
	if (!favorites[username]) {
	  favorites[username] = [];
	}
  
	favorites[username] = [...new Set([...favorites[username], ...userFavorites])];
  
	res.status(200).json({ success: true, message: 'Favorites added successfully.', favorites: favorites[username] });
  });
  