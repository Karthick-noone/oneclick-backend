const express = require("express");
const router = express.Router();
const ordersController = require('../../controllers/orders/orders.controller');

router.get("/fetchorders", ordersController.getAllOrders);
router.delete("/deleteOrder/:orderId", ordersController.deleteOrder);
router.post("/api/update-order-status", ordersController.updateOrderStatus);
router.get("/api/get-order-status", ordersController.getOrderStatus);
router.put("/api/update-status", ordersController.updateDeliveryStatus);

module.exports = router;
