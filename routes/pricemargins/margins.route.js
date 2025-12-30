// routes/pricemargins/margins.route.js

const express = require("express");
const router = express.Router();
const MarginController = require("../../controllers/pricemargins/margins.controller");

// Routes
router.get("/get-margins", MarginController.getMargins);
router.post("/add-margin", MarginController.addMargin);
router.put("/update-margin/:id", MarginController.updateMargin);

router.delete("/delete-margin/:id", MarginController.deleteMargin);

module.exports = router;
