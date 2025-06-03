const express = require('express');
const router = express.Router();
const printeraccessoriesController = require('../../controllers/products/printeraccessoriesController');
const printeraccessoriesUpload = require('../../middlewares/Uploadprinteraccessories');

// Routes for printeraccessories image/product handling

// Upload additional images to existing product
router.post('/uploadprinteraccessoriesimages', printeraccessoriesUpload.array("images", 5), printeraccessoriesController.uploadprinteraccessoriesImages);

// Add a new printeraccessories product with images
router.post('/printeraccessories', printeraccessoriesUpload.array("images", 5), printeraccessoriesController.addprinteraccessoriesProduct);

// Fetch all printeraccessories products for admin view
router.get('/adminfetchprinteraccessories', printeraccessoriesController.fetchprinteraccessoriesProducts);

// Fetch only approved printeraccessories products for frontend
router.get('/fetchprinteraccessories', printeraccessoriesController.fetchApprovedprinteraccessoriesProducts);

// Update full printeraccessories product (with new images)
router.put('/updateprinteraccessories/:id', printeraccessoriesUpload.array("images", 5), printeraccessoriesController.updateprinteraccessoriesProduct);

// Update a single image of a product
router.put('/updateprinteraccessories/image/:id', printeraccessoriesUpload.single("image"), printeraccessoriesController.updateprinteraccessoriesImage);

// Delete a single image by ID
router.delete('/deleteprinteraccessories/image/:id', printeraccessoriesController.deleteprinteraccessoriesImage);

// Delete an entire printeraccessories product
router.delete('/deleteprinteraccessories/:id', printeraccessoriesController.deleteprinteraccessoriesProduct);

module.exports = router;
