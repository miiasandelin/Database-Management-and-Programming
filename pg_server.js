import express from 'express';
import pg from 'pg';

const app = express();

const {Client} = pg;

app.listen(3001, () => {
	console.log('The server is running!');
  });

const client = new Client({
	user: 'postgres',
	password: '126pOst1258',
	database: 'postgres',
	host: 'localhost',
	port: 5432
});

connect();

async function connect() {

	try {
		await client.connect();
		console.log('Database connected...')

	} catch (error) {
		console.log(error.message);
	}

}