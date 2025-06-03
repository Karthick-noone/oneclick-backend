const express = require('express');
const router = express.Router();
const secondhandproductsController = require('../../controllers/products/secondhandproductsController');
const secondhandproductsUpload = require('../../middlewares/Uploadsecondhandproducts');

// Routes for secondhandproducts image/product handling

// Upload additional images to existing product
router.post('/uploadsecondhandproductsimages', secondhandproductsUpload.array("images", 5), secondhandproductsController.uploadsecondhandproductsImages);

// Add a new secondhandproducts product with images
router.post('/secondhandproducts', secondhandproductsUpload.array("images", 5), secondhandproductsController.addsecondhandproductsProduct);

// Fetch all secondhandproducts products for admin view
router.get('/adminfetchsecondhandproducts', secondhandproductsController.fetchsecondhandproductsProducts);

// Fetch only approved secondhandproducts products for frontend
router.get('/fetchsecondhandproducts', secondhandproductsController.fetchApprovedsecondhandproductsProducts);

// Update full secondhandproducts product (with new images)
router.put('/updatesecondhandproducts/:id', secondhandproductsUpload.array("images", 5), secondhandproductsController.updatesecondhandproductsProduct);

// Update a single image of a product
router.put('/updatesecondhandproducts/image/:id', secondhandproductsUpload.single("image"), secondhandproductsController.updatesecondhandproductsImage);

// Delete a single image by ID
router.delete('/deletesecondhandproducts/image/:id', secondhandproductsController.deletesecondhandproductsImage);

// Delete an entire secondhandproducts product
router.delete('/deletesecondhandproducts/:id', secondhandproductsController.deletesecondhandproductsProduct);

module.exports = router;
