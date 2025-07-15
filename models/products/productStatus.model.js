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

const updateStatus = (productId, status, callback) => {
  const sql = "UPDATE oneclick_product_category SET status = ? WHERE id = ?";
  db.query(sql, [status, productId], callback);
};

const removeProductFromCarts = (productId, callback) => {
  const fetchUsersQuery = "SELECT id, addtocart FROM oneclick_users WHERE JSON_SEARCH(addtocart, 'one', ?) IS NOT NULL";
  const productIdPattern = `${productId}-`;

  db.query(fetchUsersQuery, [productIdPattern + "%"], (err, users) => {
    if (err) return callback(err);

    users.forEach((user) => {
      let cart = [];
      try {
        cart = JSON.parse(user.addtocart || "[]");
      } catch (e) {
        console.error(`Invalid addtocart JSON for user ${user.id}:`, e);
      }
      const updatedCart = cart.filter(item => !item.startsWith(productIdPattern));
      const updateQuery = "UPDATE oneclick_users SET addtocart = ? WHERE id = ?";
      db.query(updateQuery, [JSON.stringify(updatedCart), user.id], (err) => {
        if (err) console.error(`Failed to update cart for user ${user.id}:`, err);
      });
    });
    callback(null); // done
  });
};

module.exports = {
  updateProductStatus,
  removeProductFromCarts,
  updateStatus
};
