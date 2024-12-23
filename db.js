const mysql = require('mysql');

// MySQL connection configuration
const dbConfig = {
  host: 'sql12.freesqldatabase.com',
  user: 'sql12753687',
  password: 'wKSH8crbyC',
  database: 'sql12753687',
};

// Create a MySQL connection
const db = mysql.createConnection(dbConfig);

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Middleware to handle MySQL errors
db.on('error', (err) => {
  console.error('MySQL error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Reconnect if the connection is lost
    db.connect((err) => {
      if (err) {
        console.error('Error reconnecting to MySQL:', err);
      } else {
        console.log('Reconnected to MySQL');
      }
    });
  } else {
    throw err;
  }
});



// Export the connection
module.exports = db;
