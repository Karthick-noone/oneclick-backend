const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/offerspage");
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]+/g, "_");
    cb(null, `product_banner_${Date.now()}_${sanitizedName}`);
  },
});

const upload = multer({ storage });

exports.uploadMultiple = upload.array("images", 10); // For multiple image uploads
exports.uploadSingle = upload.single("image"); // For single image upload
