const db = require("../../config/db"); // adjust path as needed

exports.fetchOrdersWithDetails = () => {
  const query = `
    SELECT o.*, 
          oi.order_item_id, 
          oi.quantity, 
          oi.price, 
          oi.is_buy_together, 
          p.product_id, 
          p.name AS product_name, 
          p.description AS product_description,
          o.shipping_address 
    FROM oneclick_orders o
    LEFT JOIN oneclick_order_items oi ON o.order_id = oi.order_id
    LEFT JOIN oneclick_products p ON oi.product_id = p.product_id
    ORDER BY o.order_id DESC
  `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.fetchUsersByIds = (userIds) => {
  const query = `SELECT user_id, username FROM oneclick_users WHERE user_id IN (?)`;
  return new Promise((resolve, reject) => {
    db.query(query, [userIds], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


exports.deleteOrderById = (orderId) => {
  const sql = `DELETE FROM oneclick_orders WHERE unique_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};


exports.updateOrderStatus = (orderId, status) => {
  const query = "UPDATE oneclick_orders SET status = ? WHERE unique_id = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [status, orderId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getOrderStatus = (orderId) => {
  const query = `SELECT unique_id, payment_method, delivery_status, delivery_date, order_date FROM oneclick_orders WHERE unique_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [orderId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.updateDeliveryStatus = (orderId, deliveryStatus, deliveryDate) => {
  const query = `UPDATE oneclick_orders SET delivery_status = ?, delivery_date = ? WHERE unique_id = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [deliveryStatus, deliveryDate, orderId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
