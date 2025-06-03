const db = require("../../config/db");

const SingleAdPageModel = {
  fetchLatestImage: (callback) => {
    const query = `SELECT * FROM oneclick_singleadpage WHERE category != 'loginbg' ORDER BY id DESC LIMIT 1`;
    db.query(query, callback);
  },

  insertImage: (image, category, callback) => {
    const query = "INSERT INTO oneclick_singleadpage (image, category) VALUES (?, ?)";
    db.query(query, [image, category], callback);
  },

  getImageById: (id, callback) => {
    const query = "SELECT image FROM oneclick_singleadpage WHERE id = ?";
    db.query(query, [id], callback);
  },

  updateImage: (fields, values, id, callback) => {
    const query = `UPDATE oneclick_singleadpage SET ${fields.join(", ")} WHERE id = ?`;
    db.query(query, [...values, id], callback);
  },

  deleteImageById: (id, callback) => {
    const query = "DELETE FROM oneclick_singleadpage WHERE id = ?";
    db.query(query, [id], callback);
  }
};

module.exports = SingleAdPageModel;
