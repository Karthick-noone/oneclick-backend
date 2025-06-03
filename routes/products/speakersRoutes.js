const express = require('express');
const router = express.Router();
const speakersController = require('../../controllers/products/speakersController');
const speakersUpload = require('../../middlewares/UploadSpeakers');

// Routes for speakers image/product handling

// Upload additional images to existing product
router.post('/uploadspeakersimages', speakersUpload.array("images", 5), speakersController.uploadspeakersImages);

// Add a new speakers product with images
router.post('/speakers', speakersUpload.array("images", 5), speakersController.addspeakersProduct);

// Fetch all speakers products for admin view
router.get('/adminfetchspeakers', speakersController.fetchspeakersProducts);

// Fetch only approved speakers products for frontend
router.get('/fetchspeakers', speakersController.fetchApprovedspeakersProducts);

// Update full speakers product (with new images)
router.put('/updatespeakers/:id', speakersUpload.array("images", 5), speakersController.updatespeakersProduct);

// Update a single image of a product
router.put('/updatespeakers/image/:id', speakersUpload.single("image"), speakersController.updatespeakersImage);

// Delete a single image by ID
router.delete('/deletespeakers/image/:id', speakersController.deletespeakersImage);

// Delete an entire speakers product
router.delete('/deletespeakers/:id', speakersController.deletespeakersProduct);

module.exports = router;
