const express = require('express');
const router = express.Router();
const editHomePageController = require('../../controllers/adpage/editHomePageController');
const multer = require('multer');
const path = require("path")
// Serve static files
editHomePageController.serveStaticFiles(router);

// Multer setup for image upload
const edithomepagestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/edithomepage/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload13 = multer({
  storage: edithomepagestorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
});

// Routes
router.get('/fetchedithomepage', editHomePageController.fetchImages);
router.post('/edithomepage', upload13.single("image"), editHomePageController.addImage);
router.put('/updateedithomepageimage/:id', upload13.single("image"), editHomePageController.updateImage);
router.delete('/deleteedithomepageimage/:id', editHomePageController.deleteImage);

module.exports = router;
