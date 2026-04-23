const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  getRewards,
  collectReward
} = require('../controllers/rewardController');

router.route('/')
  .get(protect, getRewards)
  .post(protect, collectReward);

module.exports = router;