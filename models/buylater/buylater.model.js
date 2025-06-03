// models/buyLater.model.js
const db = require("../../config/db"); // Assuming you have a separate db config file

// Fetch existing buy_later and addtocart items for a user
const getUserCartData = (userId, callback) => {
  const query = "SELECT buy_later, addtocart FROM oneclick_users WHERE user_id = ?";
  db.query(query, [userId], callback);
};

// Update the user's buy_later and addtocart fields
const updateUserCartData = (userId, updatedBuyLater, updatedCart, callback) => {
  const query = "UPDATE oneclick_users SET buy_later = ?, addtocart = ? WHERE user_id = ?";
  db.query(query, [JSON.stringify(updatedBuyLater), JSON.stringify(updatedCart), userId], callback);
};

// Fetch existing buy_later items for a user
const getUserBuyLater = (userId, callback) => {
  const query = "SELECT buy_later FROM oneclick_users WHERE user_id = ?";
  db.query(query, [userId], callback);
};

// Update the user's buy_later field
const updateUserBuyLater = (userId, updatedBuyLater, callback) => {
  const query = "UPDATE oneclick_users SET buy_later = ? WHERE user_id = ?";
  db.query(query, [JSON.stringify(updatedBuyLater), userId], callback);
};

// Fetch product details from oneclick_product_category by IDs
const getProductDetailsByIds = (productIds, callback) => {
  const placeholders = productIds.map(() => "?").join(","); // Create ?,?,? for SQL query
  const query = `SELECT * FROM oneclick_product_category WHERE id IN (${placeholders})`;
  db.query(query, productIds, callback);
};

const getUserBuyLaterData = (userId, callback) => {
    const query = "SELECT buy_later FROM oneclick_users WHERE user_id = ?";
    db.query(query, [userId], callback);
  };
  

  const getUserCartAndBuyLater = (email, callback) => {
    const query = "SELECT addtocart, buy_later FROM oneclick_users WHERE email = ?";
    db.query(query, [email], callback);
  };
  
  const updateUserCart = (email, cart, callback) => {
    const query = "UPDATE oneclick_users SET addtocart = ? WHERE email = ?";
    db.query(query, [JSON.stringify(cart), email], callback);
  };
  
  const updateUserBuyLaterItem = (email, buyLater, callback) => {
    const query = "UPDATE oneclick_users SET buy_later = ? WHERE email = ?";
    db.query(query, [JSON.stringify(buyLater), email], callback);
  };

module.exports = {
  getUserCartData,
  updateUserCartData,
  getUserBuyLater,
  updateUserBuyLater,
  getProductDetailsByIds,
  getUserBuyLaterData,
  getUserCartAndBuyLater,
  updateUserCart,
  updateUserBuyLaterItem
};
