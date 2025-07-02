const db = require("../../config/db");

exports.getSalesReport = (callback) => {
  const query = `
    SELECT 
        p.name AS product_name, 
        p.category, 
        IFNULL(SUM(oi.quantity), 0) AS total_quantity,
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
    SELECT 
      u.username AS user_name, 
      u.contact_number,
      COUNT(o.unique_id) AS total_orders, 
      SUM(o.total_amount) AS total_spent
    FROM oneclick_orders o
    JOIN oneclick_users u ON o.user_id = u.user_id
    GROUP BY u.username, u.contact_number
    ORDER BY total_orders DESC
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
      GROUP_CONCAT(ua.phone SEPARATOR ', ') AS phones,
      GROUP_CONCAT(ua.current_address SEPARATOR ', ') AS current_addresses
    FROM oneclick_users u
    LEFT JOIN oneclick_useraddress ua ON u.user_id = ua.user_id 
    GROUP BY u.user_id, u.username, u.email
    ORDER BY u.user_id DESC
  `;
  db.query(query, callback);
};

// Get user_id from primary id
exports.getUserIdById = (id, callback) => {
  db.query("SELECT user_id FROM oneclick_users WHERE id = ?", [id], callback);
};

// Delete from user_address using user_id
exports.deleteUserAddresses = (userId, callback) => {
  db.query("DELETE FROM oneclick_useraddress WHERE user_id = ?", [userId], callback);
};

// Delete from oneclick_users using id
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

exports.getCustomerOrdersByMobile = (mobile, callback) => {
  const query = `
    SELECT 
      o.order_id, o.unique_id, o.total_amount, o.status, o.order_date
    FROM oneclick_orders o
    JOIN oneclick_users u ON o.user_id = u.user_id
    WHERE u.contact_number = ?
    ORDER BY o.order_id DESC
  `;
  db.query(query, [mobile], callback);
};

exports.getProductCountByCategory = (callback) => {
  const query = `
    SELECT 
      category, 
      COUNT(*) AS total_products
    FROM oneclick_product_category
    GROUP BY category
  `;
  db.query(query, callback);
};

exports.getTotalProducts = (callback) => {
  const query = `SELECT COUNT(*) AS total_products FROM oneclick_product_category`;
  db.query(query, callback);
};


exports.getStaffCounts = (callback) => {
  const query = `SELECT COUNT(*) AS staffCount FROM oneclick_staff`;
  db.query(query, callback);
};
