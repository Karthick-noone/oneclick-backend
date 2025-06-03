const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const singleAdController = require("../../controllers/adpage/singleAdPageController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/singleadpage/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.use(
  "/uploads/singleadpage",
  express.static(path.join(__dirname, "../../uploads/singleadpage"))
);

router.get("/fetchsingleadpage", singleAdController.fetchSingleAd);
router.post("/singleadpage", upload.single("image"), singleAdController.addSingleAd);
router.put("/updatesingleadpageimage/:id", upload.single("image"), singleAdController.updateSingleAd);
router.delete("/deletesingleadpageimage/:id", singleAdController.deleteSingleAd);

module.exports = router;
