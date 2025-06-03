const express = require('express');
const router = express.Router();
const tvController = require('../../controllers/products/tvController');
const tvUpload = require('../../middlewares/Uploadtv');

// Routes for tv image/product handling

// Upload additional images to existing product
router.post('/uploadtvimages', tvUpload.array("images", 5), tvController.uploadtvImages);

// Add a new tv product with images
router.post('/tv', tvUpload.array("images", 5), tvController.addtvProduct);

// Fetch all tv products for admin view
router.get('/adminfetchtv', tvController.fetchtvProducts);

// Fetch only approved tv products for frontend
router.get('/fetchtv', tvController.fetchApprovedtvProducts);

// Update full tv product (with new images)
router.put('/updatetv/:id', tvUpload.array("images", 5), tvController.updatetvProduct);

// Update a single image of a product
router.put('/updatetv/image/:id', tvUpload.single("image"), tvController.updatetvImage);

// Delete a single image by ID
router.delete('/deletetv/image/:id', tvController.deletetvImage);

// Delete an entire tv product
router.delete('/deletetv/:id', tvController.deletetvProduct);

module.exports = router;
