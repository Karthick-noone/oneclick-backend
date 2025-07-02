const db = require("../../config/db");

exports.fetchAll = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM oneclick_doubleadpage ORDER BY id DESC LIMIT 4", (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

exports.insert = (image, category) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO oneclick_doubleadpage (image, category) VALUES (?, ?)",
      [image, category],
      (err, result) => {
        if (err) reject(err);
        else resolve(result.insertId);
      }
    );
  });
};

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT image FROM oneclick_doubleadpage WHERE id = ?", [id], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
};

exports.update = (fields, values) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE oneclick_doubleadpage SET ${fields.join(", ")} WHERE id = ?`;
    db.query(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};
exports.getImageById = (id, callback) => {
  db.query("SELECT image FROM oneclick_doubleadpage WHERE id = ?", [id], callback);
};


exports.delete = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM oneclick_doubleadpage WHERE id = ?", [id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
