const UserOrders = require('../../models/user_orders/userOrdersModel');
const db = require('../../config/db');

exports.fetchOrders = (req, res) => {
  const userId = req.params.userId;

  UserOrders.fetchOrders(userId, (err, result) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Error fetching orders", error: err.message });
    }
    res.status(200).json(result);
  });
};

exports.fetchProductByOrderId = (req, res) => {
  const { orderId } = req.params;

  UserOrders.fetchProductByOrderId(orderId, (err, result) => {
    if (err) {
      console.error("Error fetching product IDs by order ID:", err);
      return res.status(500).json({ error: err.message || "Failed to fetch product IDs" });
    }
    res.json(result);
  });
};

exports.cancelOrder = (req, res) => {
  const { orderId } = req.body;

  if (!orderId || typeof orderId !== "string" || !/^ORD\d{8,}$/.test(orderId)) {
    return res.status(400).json({ error: "Invalid Order ID format." });
  }

  const query = `
    UPDATE oneclick_orders
    SET delivery_status = 'Cancelled'
    WHERE unique_id = ? AND delivery_status != 'Cancelled'
  `;

  db.query(query, [orderId], (error, result) => {
    if (error) {
      console.error("Database error while cancelling order:", error);
      return res.status(500).json({ error: "Internal server error." });
    }

    if (result.affectedRows > 0) {
      return res.json({ message: "Order successfully cancelled." });
    }

    return res.status(404).json({ error: "Order not found or already cancelled." });
  });
};

exports.getOrderStatus = (req, res) => {
  const { orderId } = req.query;

  UserOrders.getOrderStatus(orderId, (error, results) => {
    if (error) {
      console.error("Error fetching order status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ message: "Order not found" });
    }
  });
};

exports.fetchAllOrdersWithUsers = (req, res) => {
  UserOrders.getAllOrders((err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Error fetching orders" });
    }

    const orders = results.reduce((acc, row) => {
      const {
        order_id, user_id, total_amount, shipping_address, order_date,
        status, payment_method, unique_id, order_item_id,
        product_name, quantity, price, invoice, product_description, is_buy_together
      } = row;

      if (!acc[order_id]) {
        acc[order_id] = {
          order_id, user_id, total_amount, shipping_address, order_date,
          status, invoice, payment_method, unique_id, items: []
        };
      }

      if (order_item_id) {
        acc[order_id].items.push({
          order_item_id,
          product_name,
          quantity,
          price,
          product_description,
          is_buy_together: is_buy_together === 1,
        });
      }

      return acc;
    }, {});

    const enrichedOrders = Object.values(orders);
    const userIds = [...new Set(enrichedOrders.map(order => order.user_id))];

    if (userIds.length === 0) {
      return res.json(enrichedOrders);
    }

    UserOrders.getUsersByIds(userIds, (err, users) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Error fetching users" });
      }

      const userMap = users.reduce((acc, user) => {
        acc[user.user_id] = user.username;
        return acc;
      }, {});

      const finalOrders = enrichedOrders.map(order => ({
        ...order,
        customerName: userMap[order.user_id] || "Unknown"
      }));

      res.json(finalOrders);
    });
  });
};
