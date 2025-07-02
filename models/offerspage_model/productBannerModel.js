const db = require("../../config/db");

exports.insertProduct = (product, callback) => {
  const query = `
    INSERT INTO oneclick_offerspage (title, description, brand_name, category, image)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [product.title, product.description, product.brand_name, product.category, product.image], callback);
};

exports.getAllProducts = (callback) => {
  db.query(`
    SELECT * FROM oneclick_offerspage 
    WHERE title = "product_banner" 
    ORDER BY id DESC LIMIT 2
  `, callback);
};

exports.updateProduct = (id, data, callback) => {
  const values = [];
  let query = `UPDATE oneclick_offerspage SET title = ?, brand_name = ?, category = ?`;
  values.push(data.title, data.brand_name, data.category);

  if (data.image) {
    query += `, image = ?`;
    values.push(data.image);
  }

  query += ` WHERE id = ?`;
  values.push(id);

  db.query(query, values, callback);
};


exports.updateImage = (id, image, callback) => {
  db.query("UPDATE oneclick_offerspage SET image = ? WHERE id = ?", [image, id], callback);
};

exports.deleteProduct = (id, callback) => {
  db.query("DELETE FROM oneclick_offerspage WHERE id = ?", [id], callback);
};

exports.getImageById = (id, callback) => {
  db.query("SELECT image FROM oneclick_offerspage WHERE id = ?", [id], callback);
};
