const express = require('express');
const router = express.Router();
const {admin, getProfile, adminLogin} = require('../controllers/authController');
const {register,login} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.get('/profile', protect, getProfile);

module.exports = router; 