import express from 'express';

var app = express();

//urlencoded middleware to handle body parameters
app.use(express.urlencoded({extended: true}));

app.listen(3001, () => {
	console.log('The server is running!')
});

// defining an endpoint
app.get('/genres', (req, res) => {
	res.send('This is genre page')
});

app.get('/movies', (req, res) => {

});

app.post('/user', (req, res) => {

		let user = req.body;
		console.log(user)

		res.send();
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