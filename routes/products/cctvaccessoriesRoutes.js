const express = require('express');
const router = express.Router();
const cctvaccessoriesController = require('../../controllers/products/cctvaccessoriesController');
const cctvaccessoriesUpload = require('../../middlewares/Uploadcctvaccessories');

// Routes for cctvaccessories image/product handling

// Upload additional images to existing product
router.post('/uploadcctvaccessoriesimages', cctvaccessoriesUpload.array("images", 5), cctvaccessoriesController.uploadcctvaccessoriesImages);

// Add a new cctvaccessories product with images
router.post('/cctvaccessories', cctvaccessoriesUpload.array("images", 5), cctvaccessoriesController.addcctvaccessoriesProduct);

// Fetch all cctvaccessories products for admin view
router.get('/adminfetchcctvaccessories', cctvaccessoriesController.fetchcctvaccessoriesProducts);

// Fetch only approved cctvaccessories products for frontend
router.get('/fetchcctvaccessories', cctvaccessoriesController.fetchApprovedcctvaccessoriesProducts);

// Update full cctvaccessories product (with new images)
router.put('/updatecctvaccessories/:id', cctvaccessoriesUpload.array("images", 5), cctvaccessoriesController.updatecctvaccessoriesProduct);

// Update a single image of a product
router.put('/updatecctvaccessories/image/:id', cctvaccessoriesUpload.single("image"), cctvaccessoriesController.updatecctvaccessoriesImage);

// Delete a single image by ID
router.delete('/deletecctvaccessories/image/:id', cctvaccessoriesController.deletecctvaccessoriesImage);

// Delete an entire cctvaccessories product
router.delete('/deletecctvaccessories/:id', cctvaccessoriesController.deletecctvaccessoriesProduct);

module.exports = router;
