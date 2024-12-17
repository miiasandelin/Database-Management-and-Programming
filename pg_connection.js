import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const pgPool = new pg.Pool({
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	database: process.env.PG_DATABASE,
	user: process.env.PG_USER,
	password: process.env.PG_PW
	//ssl: true
});

export {pgPool};