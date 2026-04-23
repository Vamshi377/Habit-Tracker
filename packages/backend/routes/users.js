const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const authRoutes = require('./auth');
const habitRoutes = require('./habits');
const userRoutes = require('./users');
const achievementRoutes = require('./achievements');
const notificationRoutes = require('./notifications');
const communityRoutes = require('./community');
const User = require('../models/User'); 
router.get('/test', (req, res) => {
  res.json({ message: 'Users route is working' });
});

// Add this route to your existing users.js routes file
// router.get('/leaderboard', async (req, res) => {
//   try {
//     const users = await User.find({})
//       .select('name email totalExperience level completedTasks')
//       .sort({ totalExperience: -1 })
//       .limit(50);
//       console.log("user",users)
    
//     res.status(200).json(users);
//   } catch (error) {
//     console.error('Error fetching leaderboard data:', error);
//     res.status(500).json({ message: 'Failed to fetch leaderboard data' });
//   }
// });

router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ totalExperience: -1 })
      .limit(50);

    // console.log("users", users);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard data' });
  }
});


module.exports = router;