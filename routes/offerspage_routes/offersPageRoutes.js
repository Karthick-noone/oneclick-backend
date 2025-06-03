const express = require("express");
const router = express.Router();
const controller = require("../../controllers/offerspage/offersPageController");
const { uploadSingle, uploadMultiple } = require("../../middlewares/offersPageUpload");

router.get("/fetchcomputersofferspage", controller.fetchAll);
router.post("/computersofferspage", uploadMultiple, controller.createWithMultipleImages);
router.put("/computersupdateofferspage/:id", uploadSingle, controller.updateWithSingleImage);
router.put("/updatecomputersofferspageimage/:id", uploadSingle, controller.updateImageOnly);
router.put("/deletecomputersofferspageimage/:id", controller.deleteImage);
router.delete("/api/deletecomputersofferspage/:id", controller.deleteProduct);

module.exports = router;
