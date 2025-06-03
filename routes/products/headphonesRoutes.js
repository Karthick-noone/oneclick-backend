const express = require('express');
const router = express.Router();
const headphonesController = require('../../controllers/products/headphonesController');
const headphonesUpload = require('../../middlewares/uploadheadphones');

// Routes for headphones image/product handling

// Upload additional images to existing product
router.post('/uploadheadphonesimages', headphonesUpload.array("images", 5), headphonesController.uploadHeadphonesImages);

// Add a new headphones product with images
router.post('/headphones', headphonesUpload.array("images", 5), headphonesController.addHeadphonesProduct);

// Fetch all headphones products for admin view
router.get('/adminfetchheadphones', headphonesController.fetchHeadphonesProducts);

// Fetch only approved headphones products for frontend
router.get('/fetchheadphones', headphonesController.fetchApprovedHeadphonesProducts);

// Update full headphones product (with new images)
router.put('/updateheadphones/:id', headphonesUpload.array("images", 5), headphonesController.updateHeadphonesProduct);

// Update a single image of a product
router.put('/updateheadphones/image/:id', headphonesUpload.single("image"), headphonesController.updateHeadphonesImage);

// Delete a single image by ID
router.delete('/deleteheadphones/image/:id', headphonesController.deleteHeadphonesImage);

// Delete an entire headphones product
router.delete('/deleteheadphones/:id', headphonesController.deleteHeadphonesProduct);

module.exports = router;
