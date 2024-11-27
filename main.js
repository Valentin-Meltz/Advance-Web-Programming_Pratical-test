// Import the mysql2 package
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Create a connection to the MySQL server
const dbCon = mysql.createConnection({
  host: 'localhost',     
  user: 'root',
  password: 'azertyuiop',
  database: "node_mysql"
});

// Connect to MySQL
dbCon.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ');
});


app.get('/db', (req, res) => {
  // testing:
  console.log("Access DB Route page");
  // create the SQL query:
  let sql = 'CREATE DATABASE if not exists node_mysql';
  dbCon.query(sql, (error, result) => {
      if (error) {
          console.log(error.message);
          throw error;
      }
      // for testing:
      console.log(result);
      res.send('A new database was created!');
  });
});

app.get('/users', (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255)
    )
  `;

  dbCon.query(sql, (err, result) => {
      if (err) {
          throw err;
      }
      console.log(result);
      res.send('users table is created!');
  });
});

// Create (POST) - Add a new user
app.get('/adduser', (req, res) => {
  let name = 'Valentin';
  let email = 'valentin.meltz@efrei.net';
  
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';

  // Creating queries 
  dbCon.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error('Error inserting: ' + err.stack);
      throw err;
    }
    console.log(result);
    res.send('One user was inserted');
});
});

// Select:
app.get('/selectall', (req, res) => {
  const sql = `SELECT * FROM users`;

  // Creating queries 
  dbCon.query(sql, (err, records) => {
      if (err) {
        console.error('Error selecting: ' + err.stack);
          throw err;
      }
      console.log(records);
      res.send('All users');
  });
});

// Read (GET) - Get a user by ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  dbCon.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching record: ' + err.stack);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]);
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});