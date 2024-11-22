import express from 'express';

var app = express();

app.listen(3001, () => {
	console.log('The server is running!')
});

// defining an endpoint
app.get('/genre', (req, res) => {
	res.send('')
});

app.get('/', (req, res) => {

});