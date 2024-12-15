const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');

// Get upcoming events
router.get('/upcoming', protect, eventController.getUpcomingEvents);

// Get all events
router.get('/', protect, eventController.getAllEvents);

// Create new event (admin only)
router.post('/', adminProtect, eventController.createEvent);

// Delete event (admin only)
router.delete('/:id', adminProtect, eventController.deleteEvent);

module.exports = router; 