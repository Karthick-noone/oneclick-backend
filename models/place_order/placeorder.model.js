const db = require("../../config/db"); // Adjust path to your DB connection

module.exports = {
  insertOrder: (orderData, callback) => {
    const query = `
      INSERT INTO oneclick_orders 
      (invoice, payment_method, payment_id, unique_id, user_id, total_amount, shipping_address, address_id, status, delivery_status, delivery_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 DAY))
    `;
    db.query(query, orderData, callback);
  },

  upsertProducts: (products, callback) => {
    const query = `
      INSERT INTO oneclick_products (product_id, name, category, price, description) 
      VALUES ? 
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name), 
        category = VALUES(category), 
        price = VALUES(price), 
        description = VALUES(description)
    `;
    db.query(query, [products], callback);
  },

  insertOrderItems: (items, callback) => {
    const query = `
      INSERT INTO oneclick_order_items 
      (order_id, product_id, quantity, price, is_buy_together) 
      VALUES ?
    `;
    db.query(query, [items], callback);
  },

  insertProductImages: (images, callback) => {
    const query = `
      INSERT INTO oneclick_product_images (product_id, image_url) 
      VALUES ?
    `;
    db.query(query, [images], callback);
  },
};
