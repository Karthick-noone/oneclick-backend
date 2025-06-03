const express = require('express');
const router = express.Router();
const productDetailsController = require('../../controllers/product_details/productDetails.controller');

// Fetch product details by ID
router.get("/products/:id", productDetailsController.getProductDetailsById);
// Route to fetch related products by category
router.get("/products/related/:category", productDetailsController.getRelatedProductsByCategory);

// Route to fetch related products with accessory mapping
router.get("/products2/related/:category", productDetailsController.getRelatedProductsWithAccessories);

// Route to fetch related accessories based on category
router.get("/products/relatedaccessories/:category", productDetailsController.getRelatedProductsWithAccessories);

// Route to get additional accessories
router.get("/products/accessories/:productId", productDetailsController.getAdditionalAccessories);

// Route to get accessory product details
router.get("/products/accessory-details/:id", productDetailsController.getAccessoryDetails);

router.get("/productdetailsofferspage", productDetailsController.getAllOfferPageProducts);

module.exports = router;


