const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/authMiddleware');
const { getStats } = require('../controllers/adminController');

// Get admin dashboard statistics
router.get('/stats', adminProtect, getStats);

module.exports = router; 