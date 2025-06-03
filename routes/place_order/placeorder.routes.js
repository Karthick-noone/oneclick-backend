const express = require("express");
const router = express.Router();
const { upload7, placeOrder } = require("../../controllers/place_order/placeorder.controller");

router.post("/place-order", upload7.array("image"), placeOrder);



module.exports = router;
