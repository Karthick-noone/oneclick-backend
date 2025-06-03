// staffRoutes.js

const express = require("express");
const router = express.Router();
const controller = require("../../controllers/staffs/staffs.controller"); // Adjust the path

// Get all staff
router.get("/api/fetchstaff", controller.getAllStaff);

// Add new staff
router.post("/api/addstaff", controller.addStaff);

// Update staff
router.put("/api/updatestaff/:id", controller.updateStaff);

// Delete staff
router.delete("/api/deletestaff/:id", controller.deleteStaff);

module.exports = router;
