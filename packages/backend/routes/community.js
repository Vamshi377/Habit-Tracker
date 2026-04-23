const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  likePost,
  commentOnPost
} = require('../controllers/communityController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Community route is working' });
});

// Post routes
router.route('/posts')
  .get(getPosts)
  .post(protect, createPost);

router.route('/posts/:id')
  .get(getPostById)
  .delete(protect, deletePost);

router.post('/posts/:id/like', protect, likePost);
router.post('/posts/:id/comments', protect, commentOnPost);

module.exports = router;