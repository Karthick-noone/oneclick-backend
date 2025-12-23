const db = require("../../config/db"); // Adjust path to your DB connection

module.exports = {
 insertOrder: (orderData, orderProducts, callback) => {

  // if only 2 args passed → shift
  if (typeof orderProducts === "function") {
    callback = orderProducts;
    orderProducts = [];
  }

  console.log("orderProducts VALUE:", orderProducts);

  const products = Array.isArray(orderProducts) ? orderProducts : [];

  const query = `
    INSERT INTO oneclick_orders 
    (invoice, payment_method, payment_id, unique_id, user_id, total_amount, shipping_address, address_id, status, delivery_status, delivery_date, branch_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 DAY), ?)
  `;

  db.query(query, orderData, (err, result) => {
    if (err) return callback(err);

    console.log("[Orders][Insert] SUCCESS — ID:", result.insertId);

    const hasNoBranch = products.some(p => !p.branch_id);

    // if no products passed OR any without branch_id
    if (products.length === 0 || hasNoBranch) {
      const msg = `New Order placed.`;
      const notifySQL = `INSERT INTO oneclick_notifications (type, message, is_read, created_at) VALUES ('New Order', ?, 0, NOW())`;
      db.query(notifySQL, [msg], () => callback(null, result));
      return;
    }

    // all have branch id
    const branch_id = products[0].branch_id;

    const branchSQL = `SELECT branch_name FROM oneclick_branches WHERE id = ?`;
    db.query(branchSQL, [branch_id], (bErr, bRes) => {
      if (bErr) return callback(null, result);

      const branchName = bRes[0]?.branch_name || "Branch";
      const msg = `New order placed for ${branchName}.`;

      const notifySQL = `INSERT INTO oneclick_notifications (type, message, is_read, created_at) VALUES ('New Order', ?, 0, NOW())`;
      db.query(notifySQL, [msg], () => callback(null, result));
    });
  });
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
