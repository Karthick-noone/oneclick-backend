const express = require("express");
const router = express.Router();
const controller = require("../../controllers/offerspage/productBannerController");
const { uploadMultiple, uploadSingle } = require("../../middlewares/uploadOffersBanner");

// Add multiple banner images
router.post("/add-banner-products", uploadMultiple, controller.create);

// Fetch all product banners
router.get("/fetch-banner-products", controller.fetchAll);

// Update product info
router.put("/update-banner-product/:id", uploadSingle, controller.update);

// Update image only
router.put("/update-banner-product-image/:id", uploadSingle, controller.updateImage);

// Delete a banner product
router.delete("/delete-banner-product/:id", controller.deleteProduct);

module.exports = router;
