const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const {
  uploadComputerImages,
  addComputerProduct,
  fetchAllComputers,
  fetchComputers,
  updateComputerImage,
  deleteComputerImage,
  updateComputer,
  deleteComputer,
} = require("../../controllers/products/computersController");

// Multer storage for computers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/computers";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const sanitized = name.replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    cb(null, `${sanitized}${ext}`);
  },
});
const upload = multer({ storage });

// Routes
router.post("/uploadcomputersimages", upload.array("images", 5), uploadComputerImages);
router.post("/computers", upload.array("images", 5), addComputerProduct);
router.get("/adminfetchcomputers", fetchAllComputers);
router.get("/fetchcomputers", fetchComputers);
router.put("/updatecomputers/image/:id", upload.single("image"), updateComputerImage);
router.delete("/deletecomputers/image/:id", deleteComputerImage);
router.put("/updatecomputers/:id", updateComputer);
router.delete("/deletecomputers/:id", deleteComputer);

module.exports = router;
