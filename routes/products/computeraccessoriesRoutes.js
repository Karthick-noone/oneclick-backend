const express = require('express');
const router = express.Router();
const computeraccessoriesController = require('../../controllers/products/computeraccessoriesController');
const computeraccessoriesUpload = require('../../middlewares/Uploadcomputeraccessories');

// Routes for computeraccessories image/product handling

// Upload additional images to existing product
router.post('/uploadcomputeraccessoriesimages', computeraccessoriesUpload.array("images", 5), computeraccessoriesController.uploadcomputeraccessoriesImages);

// Add a new computeraccessories product with images
router.post('/computeraccessories', computeraccessoriesUpload.array("images", 5), computeraccessoriesController.addcomputeraccessoriesProduct);

// Fetch all computeraccessories products for admin view
router.get('/adminfetchcomputeraccessories', computeraccessoriesController.fetchcomputeraccessoriesProducts);

// Fetch only approved computeraccessories products for frontend
router.get('/fetchcomputeraccessories', computeraccessoriesController.fetchApprovedcomputeraccessoriesProducts);

// Update full computeraccessories product (with new images)
router.put('/updatecomputeraccessories/:id', computeraccessoriesUpload.array("images", 5), computeraccessoriesController.updatecomputeraccessoriesProduct);

// Update a single image of a product
router.put('/updatecomputeraccessories/image/:id', computeraccessoriesUpload.single("image"), computeraccessoriesController.updatecomputeraccessoriesImage);

// Delete a single image by ID
router.delete('/deletecomputeraccessories/image/:id', computeraccessoriesController.deletecomputeraccessoriesImage);

// Delete an entire computeraccessories product
router.delete('/deletecomputeraccessories/:id', computeraccessoriesController.deletecomputeraccessoriesProduct);

module.exports = router;
