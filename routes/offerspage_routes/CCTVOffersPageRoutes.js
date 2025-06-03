const express = require("express");
const router = express.Router();
const CCTVOffersPageController = require("../../controllers/offerspage/CCTVOffersPageController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Set up multer for file uploads (multiple files)
const cctvofferspageStorageMultiple = multer.diskStorage({
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

const cctvofferspageUploadMultiple = multer({
  storage: cctvofferspageStorageMultiple,
}).array("images");

const cctvofferspageStorageSingle = multer.diskStorage({
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

const cctvofferspageUploadSingle = multer({
  storage: cctvofferspageStorageSingle,
}).single("image");

router.get("/fetchcctvofferspage", CCTVOffersPageController.getCctvOffers);
router.post(
  "/cctvofferspage",
  cctvofferspageUploadMultiple,
  CCTVOffersPageController.addCctvOffer
);
router.put(
  "/cctvupdateofferspage/:id",
  cctvofferspageUploadSingle,
  CCTVOffersPageController.updateCctvOffer
);
router.delete("/api/deletecctvofferspage/:id", CCTVOffersPageController.deleteCctvOffer);

// Update image
router.put(
  "/updatecctvofferspageimage/:id",
  cctvofferspageUploadSingle,
  CCTVOffersPageController.updateImage
);

// Delete image
router.put(
  "/deletecctvofferspageimage/:id",
  CCTVOffersPageController.deleteImage
);


module.exports = router;
