const express = require('express');
const router = express.Router();
const {
  generateTripRecommendations,
  generatePlaceDetails,
  optimizeBudget
} = require('../controllers/geminiController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.post('/trip-recommendations', protect, generateTripRecommendations);
router.post('/place-details', protect, generatePlaceDetails);
router.post('/optimize-budget', protect, optimizeBudget);

module.exports = router;
