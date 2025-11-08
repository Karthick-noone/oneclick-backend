const express = require("express");
const router = express.Router();
const controller = require("../../controllers/reports/branchReports.controller");

// GET reports
router.get("/api/salesreport", controller.getSalesReport);
router.get("/api/ordersreport", controller.getOrdersReport);
router.get("/api/customersreport", controller.getCustomersReport);
router.get("/api/users", controller.getUsers);
router.get("/customer-orders-by-mobile/:mobile", controller.getCustomerOrdersByMobile);

// DELETE reports
router.delete("/api/salesreport/:id", controller.deleteSalesReport);
router.delete("/api/ordersreport/:id", controller.deleteOrderReport);
router.delete("/api/customersreport/:id", controller.deleteCustomerReport);
router.delete("/api/deleteuser/:id", controller.deleteUser);

// Fetch Product Categories for Pie Chart
router.get("/fetchcategories", controller.getProductCategories);

// Fetch Product Categories and Total Amount
router.get("/fetchproductcategories", controller.getProductCategoryAmounts);

router.get("/pending-payment", controller.getPendingPayments);

router.get("/product-count-by-category", controller.getProductCountByCategory);
router.get("/total-products", controller.getTotalProducts);

router.get("/total-staff", controller.getStaffCounts);

module.exports = router;
