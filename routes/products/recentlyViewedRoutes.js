const express = require("express");
const router = express.Router();
const RecentlyViewedController = require("../../controllers/products/recentlyViewedProductsController");

// GET recently viewed product by ID
router.get("/recently-viewed-products/:id", RecentlyViewedController.getRecentlyViewedProduct);

module.exports = router;
