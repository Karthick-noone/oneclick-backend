const express = require("express");
const router = express.Router();
const MobileOffersPageController = require("../../controllers/offerspage/mobileOffersController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Common storage logic
const commonStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/offerspage";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const sanitizedFileName = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    cb(null, `${sanitizedFileName}${ext}`);
  },
});

const uploadMultiple = multer({ storage: commonStorage }).array("images");
const uploadSingle = multer({ storage: commonStorage }).single("image");

// Mobile Offers APIs
router.get("/fetchmobileofferspage", MobileOffersPageController.getMobileOffers);
router.post("/mobileofferspage", uploadMultiple, MobileOffersPageController.addMobileOffer);
router.put("/mobileupdateofferspage/:id", uploadSingle, MobileOffersPageController.updateMobileOffer);
router.delete("/api/deletemobileofferspage/:id", MobileOffersPageController.deleteMobileOffer);

// Image update/delete
router.put("/updatemobileofferspageimage/:id", uploadSingle, MobileOffersPageController.updateImage);
router.put("/deletemobileofferspageimage/:id", MobileOffersPageController.deleteImage);

// Product Details Offers APIs (same logic as mobile offers)
router.get("/fetchproductdetailsofferspage", MobileOffersPageController.getProductDetailsOffers);
router.post("/add-productdetails-offerspage-banner", uploadMultiple, MobileOffersPageController.addProductDetailsOffer);

module.exports = router;
