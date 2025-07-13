require('dotenv').config({ path: __dirname + '/../.env' });
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL DB connection failed:", err.message);
    process.exit(1);
  }
  console.log("MySQL connected successfully!");
});

module.exports = connection