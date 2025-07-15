const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10, // Adjust as needed
  host: "localhost",
  user: "root",
  password: "",
  database: "oneclick",
});

module.exports = pool;
