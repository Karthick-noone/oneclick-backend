const express = require("express");
const router = express.Router();
const controller = require("../../controllers/offerspage/CCTVOffersPageController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const express = require("express");
const { uploadSingle, uploadMultiple } = require("../../middlewares/offersPageUpload");

router.get("/fetchcctvofferspage", controller.fetchAll);
router.post("/cctvofferspage", uploadMultiple, controller.createWithMultipleImages);
router.put("/cctvupdateofferspage/:id", uploadSingle, controller.updateWithSingleImage);
router.put("/updatecctvofferspageimage/:id", uploadSingle, controller.updateImageOnly);
router.put("/deletecctvofferspageimage/:id", controller.deleteImage);
router.delete("/api/deletecctvofferspage/:id", controller.deleteProduct);

module.exports = router;
