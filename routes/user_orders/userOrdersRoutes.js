const express = require('express');
const router = express.Router();
const userOrdersController = require('../../controllers/user_orders/userOrdersController');

// Route to fetch orders for a user
router.get('/api/my-orders/:userId', userOrdersController.fetchOrders);

// Route to fetch product IDs by order ID
router.get('/getProductByOrderId/:orderId', userOrdersController.fetchProductByOrderId);
// Route to get order status
router.get('/api/get-order-status', userOrdersController.getOrderStatus);
// Route to cancel an order
router.post('/cancelOrder', userOrdersController.cancelOrder);

module.exports = router;
