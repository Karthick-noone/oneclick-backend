const express = require('express');
const router = express.Router();
const cctvController = require('../../controllers/products/cctvController');
const cctvUpload = require('../../middlewares/uploadCCTV');

// Routes for CCTV image/product handling

// Upload additional images to existing product
router.post('/uploadcctvimages', cctvUpload.array("images", 5), cctvController.uploadCCTVImages);

// Add a new CCTV product with images
router.post('/cctv', cctvUpload.array("images", 5), cctvController.addCCTVProduct);

// Fetch all CCTV products for admin view
router.get('/adminfetchcctv', cctvController.fetchCCTVProducts);

// Fetch only approved CCTV products for frontend
router.get('/fetchcctv', cctvController.fetchApprovedCCTVProducts);

// Update full CCTV product (with new images)
router.put('/updatecctv/:id', cctvUpload.array("images", 5), cctvController.updateCCTVProduct);

// Update a single image of a product
router.put('/updatecctv/image/:id', cctvUpload.single("image"), cctvController.updateCCTVImage);

// Delete a single image by ID
router.delete('/deletecctv/image/:id', cctvController.deleteCCTVImage);

// Delete an entire CCTV product
router.delete('/deletecctv/:id', cctvController.deleteCCTVProduct);

module.exports = router;
