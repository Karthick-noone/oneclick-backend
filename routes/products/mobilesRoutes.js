const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mobilesController = require("../../controllers/products/mobilesController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/mobiles";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const name = path.parse(file.originalname).name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    cb(null, `${name}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

router.post("/uploadmobilesimages", upload.array("images", 5), mobilesController.uploadMobileImages);
router.post("/mobiles", upload.array("images", 5), mobilesController.addMobile);
router.get("/fetchmobiles", mobilesController.fetchMobiles);
router.put("/updatemobiles/image/:id", upload.single("image"), mobilesController.updateMobileImage);
router.delete("/deletemobiles/image/:id", mobilesController.deleteMobileImage);
router.put("/updatemobiles/:id", mobilesController.updateMobile);
router.delete("/deletemobiles/:id", mobilesController.deleteMobile);
router.get("/adminfetchmobiles", mobilesController.adminFetchMobiles);

module.exports = router;
