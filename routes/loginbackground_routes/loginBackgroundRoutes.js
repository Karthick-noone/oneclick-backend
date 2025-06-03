const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const loginBgController = require("../../controllers/loginbackground/loginBackgroundController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/singleadpage/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.use(
  "/uploads/singleadpage",
  express.static(path.join(__dirname, "../../uploads/singleadpage"))
);

router.get("/fetchloginbg", loginBgController.fetchLoginBg);
router.post("/loginbg", upload.single("image"), loginBgController.addLoginBg);
router.put("/updateloginbgimage/:id", upload.single("image"), loginBgController.updateLoginBg);
router.delete("/deleteloginbgimage/:id", loginBgController.deleteLoginBg);

module.exports = router;
