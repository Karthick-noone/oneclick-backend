const express = require('express');
const router = express.Router();
const mostPopularProductsController = require('../../controllers/most_popular_products/mostPopularProductsController');

// Route to fetch most popular products
router.get('/mostpopular', mostPopularProductsController.fetchMostPopular);

// Route to fetch products
router.get('/products', mostPopularProductsController.fetchProducts);

module.exports = router;
