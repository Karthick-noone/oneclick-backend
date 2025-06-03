const db = require('../../config/db');

// Staff login
exports.loginStaff = (username, password, callback) => {
  db.query(
    "SELECT * FROM oneclick_staff WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    }
  );
};
