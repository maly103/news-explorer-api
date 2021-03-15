require('dotenv').config();

const {
  PORT, NODE_ENV, JWT_SECRET, DB_URL,
} = process.env;
const isProd = NODE_ENV === 'production';
const port = (isProd && PORT) ? PORT : '3003';
const jwt = (isProd && JWT_SECRET) ? JWT_SECRET : 'secret';
const dbUrl = (isProd && DB_URL) ? DB_URL : 'mongodb://localhost:27017/newsDB';

module.exports = {
  PORT: port, DB_URL: dbUrl, JWT_SECRET: jwt,
};
