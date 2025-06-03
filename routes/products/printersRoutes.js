const express = require('express');
const router = express.Router();
const printersController = require('../../controllers/products/printersController');
const printersUpload = require('../../middlewares/Uploadprinters');

// Routes for printers image/product handling

// Upload additional images to existing product
router.post('/uploadprintersimages', printersUpload.array("images", 5), printersController.uploadprintersImages);

// Add a new printers product with images
router.post('/printers', printersUpload.array("images", 5), printersController.addprintersProduct);

// Fetch all printers products for admin view
router.get('/adminfetchprinters', printersController.fetchprintersProducts);

// Fetch only approved printers products for frontend
router.get('/fetchprinters', printersController.fetchApprovedprintersProducts);

// Update full printers product (with new images)
router.put('/updateprinters/:id', printersUpload.array("images", 5), printersController.updateprintersProduct);

// Update a single image of a product
router.put('/updateprinters/image/:id', printersUpload.single("image"), printersController.updateprintersImage);

// Delete a single image by ID
router.delete('/deleteprinters/image/:id', printersController.deleteprintersImage);

// Delete an entire printers product
router.delete('/deleteprinters/:id', printersController.deleteprintersProduct);

module.exports = router;


