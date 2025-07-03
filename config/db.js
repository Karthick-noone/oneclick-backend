// db.js
const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'oneclick',
};

let db;

function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error('MySQL connection error:', err);
      setTimeout(handleDisconnect, 2000); // retry after 2 sec
    } else {
      console.log('Connected to MySQL');
    }
  });

  db.on('error', (err) => {
    console.error('MySQL error:', err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.fatal) {
      console.warn(' Reconnecting to MySQL...');
      handleDisconnect(); // reconnect on connection loss
    } else {
      throw err; // unexpected error
    }
  });
}

handleDisconnect();

module.exports = db;
