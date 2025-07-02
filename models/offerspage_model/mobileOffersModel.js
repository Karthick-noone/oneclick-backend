const db = require("../../config/db");

const MobileOffersPage = {
  getAll: (category, callback) => {
    const sql = "SELECT * FROM oneclick_offerspage WHERE category=? ORDER BY id DESC";
    db.query(sql, [category], callback);
  },

  create: (data, callback) => {
    const sql = `INSERT INTO oneclick_offerspage (offer, brand_name, title, description, category, image) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, data, callback);
  },

  update: (id, data, callback) => {
    const sql = `UPDATE oneclick_offerspage SET title = ?, description = ?, brand_name =?, offer = ?, image = ? WHERE id = ?`;
    db.query(sql, [...data, id], callback);
  },

  updateWithoutImage: (id, data, callback) => {
    const sql = `UPDATE oneclick_offerspage SET title = ?, description = ?, brand_name =?, offer = ? WHERE id = ?`;
    db.query(sql, [...data, id], callback);
  },

 updateImageOnly: (id, image, title, callback) => {
  const sql = `UPDATE oneclick_offerspage SET image = ?, title = ? WHERE id = ?`;
  db.query(sql, [image, title, id], callback);
},

 
deleteProduct: (id, callback) => {
  const sql = "DELETE FROM oneclick_offerspage WHERE id = ?";
  db.query(sql, [id], callback);
},

  getImageById: (id, callback) => {
    const sql = `SELECT image FROM oneclick_offerspage WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = MobileOffersPage;
