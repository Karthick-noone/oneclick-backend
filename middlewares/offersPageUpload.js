const multer = require("multer");
const fs = require("fs");
const path = require("path");

const dir = "uploads/offerspage";

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = (multiple = false) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext).replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      cb(null, `${name}${ext}`);
    },
  });

exports.uploadMultiple = multer({ storage: storage(true) }).array("images");
exports.uploadSingle = multer({ storage: storage(false) }).single("image");
