const express = require("express");
const router = express.Router();
const buylaterController = require("../../controllers/buylater/buylater.controller");

// Route to store items in Buy Later
router.post("/api/store-buy-later", buylaterController.storeBuyLater);

// Route to get Buy Later items
router.get("/api/get-buy-later/:userId", buylaterController.getBuyLaterItems);

// Route to remove an item from Buy Later (using POST or DELETE)
router.post("/api/remove-buy-later", buylaterController.removeBuyLaterItem);

router.post("/api/addtocart", buylaterController.addToCart);

module.exports = router;
