const express = require("express");
const router = express.Router();
const ProductStatusController = require("../../controllers/products/productStatus.controller");

// POST /backend/product-status/update
router.post("/product-status/update", ProductStatusController.updateProductStatus);

module.exports = router;
