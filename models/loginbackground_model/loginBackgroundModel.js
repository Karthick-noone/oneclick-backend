const db = require("../../config/db");

const LoginBackgroundModel = {
  fetchLoginBg: (callback) => {
    const query = `SELECT * FROM oneclick_singleadpage WHERE category = 'loginbg' ORDER BY id DESC LIMIT 1`;
    db.query(query, callback);
  },

  insertLoginBg: (image, callback) => {
    const category = "loginbg";
    const query = "INSERT INTO oneclick_singleadpage (image, category) VALUES (?, ?)";
    db.query(query, [image, category], callback);
  },

  getLoginBgById: (id, callback) => {
    const query = "SELECT image FROM oneclick_singleadpage WHERE id = ?";
    db.query(query, [id], callback);
  },

  updateLoginBg: (fields, values, id, callback) => {
    const query = `UPDATE oneclick_singleadpage SET ${fields.join(", ")} WHERE id = ?`;
    db.query(query, [...values, id], callback);
  },

  deleteLoginBgById: (id, callback) => {
    const query = "DELETE FROM oneclick_singleadpage WHERE id = ?";
    db.query(query, [id], callback);
  }
};

module.exports = LoginBackgroundModel;
