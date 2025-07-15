const OrderModel = require('../../models/orders/orders.model');

exports.getAllOrders = async (req, res) => {
  try {
    const results = await OrderModel.fetchOrdersWithDetails();

    const orders = results.reduce((acc, row) => {
      const {
        order_id, user_id, total_amount, shipping_address,
        order_date, status, payment_method, payment_id, unique_id,
        order_item_id, product_name, quantity, price,
        invoice, product_description
      } = row;

      if (!acc[order_id]) {
        acc[order_id] = {
          order_id, user_id, total_amount, shipping_address,
          order_date, status, invoice, payment_method, payment_id, unique_id,
          items: [],
        };
      }

      if (order_item_id) {
        acc[order_id].items.push({
          order_item_id,
          product_name,
          quantity,
          price,
          product_description,
          is_buy_together: row.is_buy_together === 1,
        });
      }

      return acc;
    }, {});

    const enrichedOrders = Object.values(orders);
    const userIds = [...new Set(enrichedOrders.map((order) => order.user_id))];

    if (userIds.length === 0) {
      return res.json(enrichedOrders);
    }

    const users = await OrderModel.fetchUsersByIds(userIds);
    const userMap = users.reduce((acc, user) => {
      acc[user.user_id] = user.username;
      return acc;
    }, {});

    const finalOrders = enrichedOrders.map(order => ({
      ...order,
      customerName: userMap[order.user_id] || "Unknown",
    }));

    res.json(finalOrders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
};


exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    await OrderModel.deleteOrderById(orderId);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Error deleting order" });
  }
};


exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: "orderId and status are required." });
  }

  try {
    const result = await OrderModel.updateOrderStatus(orderId, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({ message: "Status updated successfully!" });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update the status." });
  }
};


exports.getOrderStatus = async (req, res) => {
  const { orderId } = req.query;
  try {
    const result = await OrderModel.getOrderStatus(orderId);
    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    console.error("Error fetching order status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  const { orderId, deliveryStatus, deliveryDate } = req.body;

  if (!orderId || !deliveryStatus) {
    return res.status(400).json({ message: "Order ID and delivery status are required" });
  }

  try {
    const result = await OrderModel.updateDeliveryStatus(orderId, deliveryStatus, deliveryDate);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Delivery status and date updated successfully" });
  } catch (err) {
    console.error("Error updating delivery status:", err);
    res.status(500).json({ message: "Error updating delivery status" });
  }
};
