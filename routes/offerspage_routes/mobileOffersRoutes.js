const express = require("express");
const router = express.Router();
const controller = require("../../controllers/offerspage/mobileOffersController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
// const express = require("express");
const { uploadSingle, uploadMultiple } = require("../../middlewares/offersPageUpload");

router.get("/fetchmobileofferspage", controller.fetchAll);
router.post("/mobileofferspage", uploadMultiple, controller.createWithMultipleImages);
router.put("/mobileupdateofferspage/:id", uploadSingle, controller.updateWithSingleImage);
router.put("/updatemobileofferspageimage/:id", uploadSingle, controller.updateImageOnly);
router.put("/deletemobileofferspageimage/:id", controller.deleteImage);
router.delete("/api/deletemobileofferspage/:id", controller.deleteProduct);

module.exports = router;
