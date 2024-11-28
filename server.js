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
app.get('/genres', (req, res) => {
	res.send('This is genre page')
});

app.get('/movies', (req, res) => {

});

app.post('/users', (req, res) => {
	console.log(req.body.fname);
	console.log(req.body.lname);
});

app.get('/movies/:id', (req, res) => {

});

app.get('/movies/search', (req, res) => {

});

app.post('/movies/:id/reviews', (req, res) => {

});


app.post('/users/:username/favorites', (req, res) => {

});

app.get('/users/:username/favorites', (req, res) => {

});