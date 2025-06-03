// staffModel.js
const db = require("../../config/db");
// Get all staff
exports.getAllStaff = (callback) => {
  const query = "SELECT * FROM oneclick_staff ORDER BY id DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching staff:", err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Add new staff
exports.addStaff = (staffname, username, password, status, callback) => {
  const query =
    "INSERT INTO oneclick_staff (staffname, username, password, status) VALUES (?, ?, ?, ?)";
  db.query(query, [staffname, username, password, status], (err, results) => {
    if (err) {
      console.error("Error adding staff:", err);
      callback(err, null);
    } else {
      callback(null, { id: results.insertId, staffname, username, password, status });
    }
  });
};

// Update staff
exports.updateStaff = (staffId, staffname, username, password, status, callback) => {
  const query = `
    UPDATE oneclick_staff 
    SET staffname = ?, username = ?, password = ?, status = ? 
    WHERE id = ?
  `;
  db.query(query, [staffname, username, password, status, staffId], (err, results) => {
    if (err) {
      console.error("Error updating staff:", err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Delete staff
exports.deleteStaff = (staffId, callback) => {
  const query = "DELETE FROM oneclick_staff WHERE id = ?";
  db.query(query, [staffId], (err, result) => {
    if (err) {
      console.error("Error deleting staff:", err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};
