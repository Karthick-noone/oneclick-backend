const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Define storage config
const cctvaccessoriesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/cctvaccessories";
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

// Create multer instance
const cctvaccessoriesUpload = multer({ storage: cctvaccessoriesStorage });

// ✅ Export multer instance (not the middleware)
module.exports = cctvaccessoriesUpload;
