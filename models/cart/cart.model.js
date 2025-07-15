const db = require("../../config/db");

const getUserCart = (email, callback) => {
  const query = "SELECT addtocart FROM oneclick_users WHERE email = ?";
  db.query(query, [email], callback);
};

const updateUsersCart = (email, cartArray, callback) => {
  const query = "UPDATE oneclick_users SET addtocart = ? WHERE email = ?";
  db.query(query, [JSON.stringify(cartArray), email], callback);
};

const getUserCartByEmailAndUsername = (email, username, callback) => {
  const query = "SELECT addtocart FROM oneclick_users WHERE email = ? AND username = ?";
  db.query(query, [email, username], callback);
};

const getProductsByIds = (productIds, callback) => {
  const placeholders = productIds.map(() => "?").join(",");
  const query = `SELECT * FROM oneclick_product_category WHERE id IN (${placeholders})`;
  db.query(query, productIds, callback);
};

const getFeaturesByProdIds = (prodIds, callback) => {
  const placeholders = prodIds.map(() => "?").join(",");
  const query = `SELECT * FROM oneclick_mobile_features WHERE prod_id IN (${placeholders})`;
  db.query(query, prodIds, callback);
};

const getCartByEmail = (email, callback) => {
  const query = "SELECT addtocart FROM oneclick_users WHERE email = ?";
  db.query(query, [email], callback);
};

const updateCartByEmail = (email, updatedCart, callback) => {
  const query = "UPDATE oneclick_users SET addtocart = ? WHERE email = ?";
  db.query(query, [JSON.stringify(updatedCart), email], callback);
};

const getUserCartData = (email, callback) => {
  db.query("SELECT addtocart, buy_later FROM oneclick_users WHERE email = ?", [email], callback);
};

const updateUserCart = (cart, email, callback) => {
  db.query("UPDATE oneclick_users SET addtocart = ? WHERE email = ?", [JSON.stringify(cart), email], callback);
};


const removeItemFromCart = (email, itemId, quantity, callback) => {
  const getCartQuery = "SELECT addtocart FROM oneclick_users WHERE email = ?";
  db.query(getCartQuery, [email], (err, results) => {
    if (err) return callback(err);
    if (!results.length) return callback(new Error("User not found"));

    let cartItems;
    try {
      cartItems = JSON.parse(results[0].addtocart || "[]"); // ["398-2", "390-1"]
    } catch (parseErr) {
      return callback(new Error("Invalid cart data"));
    }

    // Construct the string to match (e.g., "398-2")
    const itemString = `${itemId}-${quantity}`;

    // Find index of item in the array
    const index = cartItems.indexOf(itemString);

    if (index === -1) return callback(new Error("Item not found in the cart"));

    // Remove the item
    cartItems.splice(index, 1);

    const updateCartQuery = "UPDATE oneclick_users SET addtocart = ? WHERE email = ?";
    db.query(updateCartQuery, [JSON.stringify(cartItems), email], (updateErr) => {
      if (updateErr) return callback(updateErr);
      return callback(null, "Item removed from cart successfully");
    });
  });
};




const clearUserCart = (email, updatedCart, callback) => {
  const sql = "UPDATE oneclick_users SET addtocart = ? WHERE email = ?";
  db.query(sql, [JSON.stringify(updatedCart), email], callback);
};

const fetchUserCart = (email, callback) => {
  const sql = "SELECT addtocart FROM oneclick_users WHERE email = ?";
  db.query(sql, [email], callback);
};



module.exports = {
  getUserCart,
  updateCartByEmail,
  getCartByEmail,
  updateUsersCart,
  getUserCartByEmailAndUsername,
  getProductsByIds,
  getFeaturesByProdIds,
  removeItemFromCart,
  getUserCartData,
  updateUserCart,
  clearUserCart,
  fetchUserCart,
};
