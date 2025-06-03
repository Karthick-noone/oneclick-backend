const express = require('express');
const router = express.Router();
const searchSuggestionsController = require('../../controllers/search_suggestions/searchSuggestionsController');

// Web API route for search suggestions
router.get('/suggestions', searchSuggestionsController.getSuggestions);

// App API route for search suggestions
router.get('/api/suggestions', searchSuggestionsController.getSuggestedCategory);

module.exports = router;
