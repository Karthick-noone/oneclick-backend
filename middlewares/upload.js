const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/offerspage");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    const timestamp = Date.now();
    cb(null, `${name.split(".")[0]}_${timestamp}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/jfif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and JFIF are allowed."), false);
  }
};

// Init multer upload for multiple files
const offerspageUploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).array("images", 10); // field name = "images"

// Init multer upload for single file
const mobileofferspageUploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image"); // field name = "image"

module.exports = {
  offerspageUploadMultiple,
  mobileofferspageUploadSingle,
};
