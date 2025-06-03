const express = require('express');
const router = express.Router();
const watchController = require('../../controllers/products/watchController');
const watchUpload = require('../../middlewares/Uploadwatch');

// Routes for watch image/product handling

// Upload additional images to existing product
router.post('/uploadwatchimages', watchUpload.array("images", 5), watchController.uploadwatchImages);

// Add a new watch product with images
router.post('/watch', watchUpload.array("images", 5), watchController.addwatchProduct);

// Fetch all watch products for admin view
router.get('/adminfetchwatch', watchController.fetchwatchProducts);

// Fetch only approved watch products for frontend
router.get('/fetchwatch', watchController.fetchApprovedwatchProducts);

// Update full watch product (with new images)
router.put('/updatewatch/:id', watchUpload.array("images", 5), watchController.updatewatchProduct);

// Update a single image of a product
router.put('/updatewatch/image/:id', watchUpload.single("image"), watchController.updatewatchImage);

// Delete a single image by ID
router.delete('/deletewatch/image/:id', watchController.deletewatchImage);

// Delete an entire watch product
router.delete('/deletewatch/:id', watchController.deletewatchProduct);

module.exports = router;
