const express = require('express');
const router = express.Router();
const mobileaccessoriesController = require('../../controllers/products/mobileaccessoriesController');
const mobileaccessoriesUpload = require('../../middlewares/Uploadmobileaccessories');

// Routes for mobileaccessories image/product handling

// Upload additional images to existing product
router.post('/uploadmobileaccessoriesimages', mobileaccessoriesUpload.array("images", 5), mobileaccessoriesController.uploadmobileaccessoriesImages);

// Add a new mobileaccessories product with images
router.post('/mobileaccessories', mobileaccessoriesUpload.array("images", 5), mobileaccessoriesController.addmobileaccessoriesProduct);

// Fetch all mobileaccessories products for admin view
router.get('/adminfetchmobileaccessories', mobileaccessoriesController.fetchmobileaccessoriesProducts);

// Fetch only approved mobileaccessories products for frontend
router.get('/fetchmobileaccessories', mobileaccessoriesController.fetchApprovedmobileaccessoriesProducts);

// Update full mobileaccessories product (with new images)
router.put('/updatemobileaccessories/:id', mobileaccessoriesUpload.array("images", 5), mobileaccessoriesController.updatemobileaccessoriesProduct);

// Update a single image of a product
router.put('/updatemobileaccessories/image/:id', mobileaccessoriesUpload.single("image"), mobileaccessoriesController.updatemobileaccessoriesImage);

// Delete a single image by ID
router.delete('/deletemobileaccessories/image/:id', mobileaccessoriesController.deletemobileaccessoriesImage);

// Delete an entire mobileaccessories product
router.delete('/deletemobileaccessories/:id', mobileaccessoriesController.deletemobileaccessoriesProduct);

module.exports = router;
