const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  getNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
  deleteReadNotifications,
  createNotification
} = require('../controllers/notificationController');

// Verify route with a test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Notifications route is working' });
});

// Protected notification routes
router.get('/', protect, getNotifications);
router.put('/mark-read', protect, markAllAsRead);
router.put('/:id/mark-read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);
router.delete('/read', protect, deleteReadNotifications);

// Add this new route:

// Create notification
router.post('/', protect, createNotification);

module.exports = router;