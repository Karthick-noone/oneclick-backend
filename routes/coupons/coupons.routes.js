const express = require("express");
const router = express.Router();
const controller = require("../../controllers/coupons/coupons.controller");

// Apply Coupon
router.post("/api/apply-coupon", controller.applyCoupon);

// Add Multiple Coupons
router.post("/multiplecoupons", controller.addMultipleCoupons);

// Get Coupons by Product ID
router.get("/coupons/:productId", controller.getCouponsByProductId);

// Update Coupon
router.put("/edit/coupons/:id", controller.updateCoupon);

// Delete Coupon
router.delete("/deletecoupons/:id", controller.deleteCoupon);

//delete Common coupon
router.delete("/api/deletecoupons/:id", controller.deleteCommonCoupon);

// Get All Common Coupons
router.get("/api/fetchcoupons", controller.getAllCoupons);

// Add New Coupon
router.post("/api/addcoupons", controller.addNewCoupon);

//common coupon update
router.put("/api/editcoupons/:id", controller.updateCommonCoupon);

//make a copy of the product
router.post("/api/copy-product/:id", controller.copyProduct);

// Check if a product has a coupon
router.get("/api/couponstatus/:productId", controller.checkProductCoupon);

module.exports = router;
