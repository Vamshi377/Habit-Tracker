const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// Route for AI chat
router.route('/chat')
  .post(protect, chatWithAI);

module.exports = router;
