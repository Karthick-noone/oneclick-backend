const db = require('../../config/db');

// Admin login
exports.loginAdmin = (username, password, callback) => {
  db.query(
    "SELECT * FROM oneclick_admin WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    }
  );
};


exports.verifyOldPassword = (oldPassword, callback) => {
  const query = "SELECT * FROM oneclick_admin WHERE password = ?";
  db.query(query, [oldPassword], callback);
};

// Note: Always update based on admin ID or email in production!
exports.updatePassword = (newPassword, callback) => {
  const query = "UPDATE oneclick_admin SET password = ? LIMIT 1";
  db.query(query, [newPassword], callback);
};
