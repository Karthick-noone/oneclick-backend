const db = require("../../config/db");

exports.getSalesReport = (callback) => {
  const query = `
    SELECT 
        p.name AS product_name, 
        p.category, 
        IFNULL(SUM(oi.price * oi.quantity), 0) AS sales
    FROM oneclick_products p
    LEFT JOIN oneclick_order_items oi ON oi.product_id = p.product_id
    LEFT JOIN oneclick_orders o ON oi.order_id = o.order_id
    GROUP BY p.name, p.category
  `;
  db.query(query, callback);
};

exports.getOrdersReport = (callback) => {
  const query = `
    SELECT o.*, u.* 
    FROM oneclick_orders o
    JOIN oneclick_users u ON o.user_id = u.user_id
    ORDER BY o.order_id DESC
  `;
  db.query(query, callback);
};

exports.getCustomersReport = (callback) => {
  const query = `
    SELECT u.username AS user_name, 
           COUNT(o.unique_id) AS total_orders, 
           SUM(o.total_amount) AS total_spent
    FROM oneclick_orders o
    JOIN oneclick_users u ON o.user_id = u.user_id
    GROUP BY u.username
  `;
  db.query(query, callback);
};

exports.deleteSalesReport = (id, callback) => {
  db.query("DELETE FROM oneclick_products WHERE product_id = ?", [id], callback);
};

exports.deleteOrderReport = (id, callback) => {
  db.query("DELETE FROM oneclick_orders WHERE order_id = ?", [id], callback);
};

exports.deleteCustomerReport = (id, callback) => {
  db.query("DELETE FROM oneclick_users WHERE user_id = ?", [id], callback);
};

exports.getUsers = (callback) => {
  const query = `
    SELECT 
      u.user_id, contact_number, u.username, u.email, u.id, 
      GROUP_CONCAT(ua.address_id) AS address_ids,
      GROUP_CONCAT(ua.name SEPARATOR ', ') AS address_names,
      GROUP_CONCAT(ua.street SEPARATOR ', ') AS streets, 
      GROUP_CONCAT(ua.city SEPARATOR ', ') AS cities,
      GROUP_CONCAT(ua.state SEPARATOR ', ') AS states,
      GROUP_CONCAT(ua.postal_code SEPARATOR ', ') AS postal_codes,
      GROUP_CONCAT(ua.country SEPARATOR ', ') AS countries,
      GROUP_CONCAT(ua.phone SEPARATOR ', ') AS phones
    FROM oneclick_users u
    LEFT JOIN oneclick_useraddress ua ON u.user_id = ua.user_id 
    GROUP BY u.user_id, u.username, u.email
    ORDER BY u.user_id DESC
  `;
  db.query(query, callback);
};

exports.deleteUser = (id, callback) => {
  db.query("DELETE FROM oneclick_users WHERE id = ?", [id], callback);
};


exports.getPendingPayments = (callback) => {
  const sql = "SELECT total_amount FROM oneclick_orders WHERE status != 'Paid'";

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching pending payments:", error);
      callback(error, null); // Call the callback with error
    } else {
      callback(null, results); // Call the callback with results
    }
  });
};

// Fetch product categories for Pie Chart
exports.getProductCategories = (callback) => {
  const query = `
    SELECT 
      category, 
      COUNT(*) AS total_category 
    FROM oneclick_product_category 
    GROUP BY category;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching product categories:", err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Fetch product categories and total amounts
exports.getProductCategoryAmounts = (callback) => {
  const query = `
    SELECT 
      category, 
      COUNT(*) AS total_amount 
    FROM oneclick_products
    GROUP BY category
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching product categories:", err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};