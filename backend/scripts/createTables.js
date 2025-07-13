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
    return console.log("MySQL DB connection failed: " + err.message);
  }
  const createUsersTable = `create table if not exists users(
                          id int primary key auto_increment,
                          username varchar(100) not null unique,
                          email varchar(100) not null unique,
                          password varchar(255) not null,
                          level int default 1,
                          hints int default 0
                      )`;

  connection.query(createUsersTable, (err, results, fields) => {
    if (err) return console.log(err.message);
  });

  // close the connection
  connection.end((err) => {
    if (err) return console.log(err.message);
  });
});


