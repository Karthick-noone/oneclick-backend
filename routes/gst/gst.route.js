// routes/gst/gst.route.js
const express = require("express");
const router = express.Router();
const gstController = require("../../controllers/gst/gst.controller");

// Example: GET /api/gstinfo?gstin=33ABCDE1234F1Z5
router.get("/gstinfo", gstController.fetchGSTDetails);

module.exports = router;
