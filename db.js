require('dotenv').config(); // Load .env variables
const mysql = require('mysql2'); // not 'mysql2/promise'

// Create and export the promise-based pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise(); // 💥 THIS IS THE KEY LINE

console.log('✅ Connected to MySQL database!');

module.exports = pool;
