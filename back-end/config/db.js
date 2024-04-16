const { Pool } = require('pg');
require('dotenv').config();

const retryInterval = 1000;  // Interval entre les tentatives en millisecondes (1 seconde)

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

function attemptConnection() {
  return db.connect()
    .then(() => {
      console.log('Connected to PostgreSQL database');
    })
    .catch((err) => {
      console.error('Error connecting to PostgreSQL database');
      console.log(`Retrying connection in ${retryInterval / 1000} seconds...`);
      setTimeout(() => attemptConnection(), retryInterval);
    });
}

attemptConnection(0);

module.exports = db;
