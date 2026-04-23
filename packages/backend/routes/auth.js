const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, forgotPassword, validateResetToken, resetPassword, updatePassword, updateProfile, updateSettings } = require('../controllers/authController');
const { protect } = require('../middleware/auth'); // Changed from '../middleware/authMiddleware'

// Remove all these route imports - they should be in server.js
// const authRoutes = require('./routes/auth');
// const habitRoutes = require('./routes/habits');
// const userRoutes = require('./routes/users');
// const achievementRoutes = require('./routes/achievements');
// const notificationRoutes = require('./routes/notifications');
// const communityRoutes = require('./routes/community');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

router.post('/forgot-password', forgotPassword);
router.get('/reset-password/validate/:token', validateResetToken);
router.post('/reset-password/:token', resetPassword);

// Protected routes (require authentication)
router.put('/update-password', protect, updatePassword);
router.put('/settings', protect, updateSettings);
// Add this to your auth routes
router.put('/update-profile', protect, updateProfile);
module.exports = router;