const db = require('../../config/db');

const EditHomePage = {
  fetchAll: (callback) => {
    const sql = "SELECT * FROM oneclick_edithomepage ORDER BY id DESC";
    db.query(sql, callback);
  },
  addImage: (imageData, callback) => {
    const query = "INSERT INTO oneclick_edithomepage (image, category) VALUES (?, ?)";
    db.query(query, imageData, callback);
  },
updateImage: (fields, values, callback) => {
  const query = `UPDATE oneclick_edithomepage SET ${fields.join(", ")} WHERE id = ?`;
  db.query(query, values, callback);
},
  deleteImage: (id, callback) => {
    const query = "DELETE FROM oneclick_edithomepage WHERE id = ?";
    db.query(query, [id], callback);
  },
  getImageById: (id, callback) => {
    const query = "SELECT image FROM oneclick_edithomepage WHERE id = ?";
    db.query(query, [id], callback);
  }
};

module.exports = EditHomePage;
