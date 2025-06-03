const express = require("express");
const router = express.Router();
const controller = require("../../controllers/adpage/doubleAdPageController");

const upload = require("../../middlewares/uploadDoubleAdPage"); // Multer config

// Fetch all
router.get("/fetchdoubleadpage", controller.fetchAll);

// Add image
router.post("/doubleadpage", upload.single("image"), controller.addImage);

// Update image/category
router.put("/updatedoubleadpageimage/:id", upload.single("image"), controller.updateImage);

// Delete
router.delete("/deletedoubleadpageimage/:id", controller.deleteImage);

module.exports = router;
