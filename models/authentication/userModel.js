const db = require('../../config/db');


// Check if user exists
exports.checkExistingUser = (email, username, contactNumber, callback) => {
  const query = "SELECT * FROM oneclick_users WHERE email = ? OR username = ? OR contact_number = ?";
  db.query(query, [email, username, contactNumber], callback);
};

// Generate new user ID
exports.generateUserId = (callback) => {
  const query = "SELECT user_id FROM oneclick_users ORDER BY user_id DESC LIMIT 1";
  db.query(query, (err, results) => {
    if (err) return callback(err);

    let nextUserId = "usr000001";
    if (results.length > 0 && results[0].user_id) {
      const lastUserId = results[0].user_id;
      const numberPart = parseInt(lastUserId.slice(3));
      const newNumberPart = numberPart + 1;
      nextUserId = `usr${newNumberPart.toString().padStart(6, "0")}`;
    }
    callback(null, nextUserId);
  });
};

// Create a new user
exports.createUser = (username, email, password, userId, contactNumber, callback) => {
  const query = "INSERT INTO oneclick_users (username, email, password, user_id, contact_number) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [username, email, password, userId, contactNumber], callback);
};

// Insert notification
exports.insertNotification = (username, callback) => {
  const message = `New user ${username} has signed up.`;
  const query = 'INSERT INTO oneclick_notifications (type, message, is_read, created_at) VALUES ("New user", ?, FALSE, NOW())';
  db.query(query, [message], callback);
};

// Login user
exports.loginUser = (contact_number, password, callback) => {
  db.query(
    "SELECT * FROM oneclick_users WHERE contact_number = ? AND password = ?",
    [contact_number, password],
    (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    }
  );
};
