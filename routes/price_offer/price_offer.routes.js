const express = require("express");
const router = express.Router();
const priceOfferController = require("../../controllers/price_offer/price_offer.controller");

router.post("/api/products/addoffer", priceOfferController.addOffer);
router.put("/api/products/updateoffer/:id", priceOfferController.updateOffer);
router.delete("/api/products/deleteoffer/:id", priceOfferController.deleteOffer);
router.get("/api/products/fetchoffer/:id", priceOfferController.fetchOffer);

module.exports = router;
