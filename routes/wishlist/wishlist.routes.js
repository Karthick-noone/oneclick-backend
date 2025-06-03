const express = require("express");
const router = express.Router();
const wishlistController = require("../../controllers/wishlist/wishlist.controller");

router.post("/fetchwishlist", wishlistController.fetchWishlist);
router.post("/remove-from-wishlist", wishlistController.removeFromWishlist);
router.post("/update-user-wishlist", wishlistController.updateUserWishlist);
router.post("/fetch-wishlist", wishlistController.fetchWishlistWithFeatures);

module.exports = router;
