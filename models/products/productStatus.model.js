const db = require("../../config/db");

// Update product status by prod_id
const updateProductStatus = (prod_id, productStatus, callback) => {
  const query = "UPDATE oneclick_product_category SET productStatus = ? WHERE prod_id = ?";
  db.query(query, [productStatus, prod_id], (err, result) => {
    if (err) {
      console.error("Model Error updating product status:", err);
      return callback(err);
    }
    callback(null, result);
  });
};

module.exports = {
  updateProductStatus,
};
