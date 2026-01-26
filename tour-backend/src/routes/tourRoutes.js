const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const auth = require('../middlewares/auth');

// Public routes
router.get('/tours', tourController.getAllTours);
router.get('/tours/:id', tourController.getTourById);

// Admin routes (cần authentication)
router.post('/tours', auth.isAdmin, tourController.createTour);
router.put('/tours/:id', auth.isAdmin, tourController.updateTour);

module.exports = router;