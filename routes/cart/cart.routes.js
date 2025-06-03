const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/cart/cart.controller");

router.post("/add-to-cart", cartController.addToCart);
router.post("/get-cart-items", cartController.getCartItems);
router.post("/get-cart-quantity-sum", cartController.getCartQuantitySum);
router.post("/update-cart-quantity", cartController.updateCartQuantity);
router.post("/remove-from-cart", cartController.removeFromCart);
router.post("/clear-cart", cartController.clearCart);

module.exports = router;

