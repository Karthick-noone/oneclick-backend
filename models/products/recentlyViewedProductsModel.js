const db = require("../../config/db");

exports.getProductById = (id, callback) => {
  const query = "SELECT * FROM oneclick_product_category WHERE id = ?";
  db.query(query, [id], callback);
};
