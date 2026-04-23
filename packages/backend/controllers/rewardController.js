const Reward = require('../models/Reward');

// @desc    Get all rewards for a user
// @route   GET /api/rewards
// @access  Private
const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a new reward for a user
// @route   POST /api/rewards
// @access  Private
const collectReward = async (req, res) => {
  try {
    const { type, title, description, icon } = req.body;
    
    if (!type || !title || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const reward = new Reward({
      user: req.user._id,
      type,
      title,
      description,
      icon: icon || '🎁'
    });
    
    await reward.save();
    
    res.status(201).json(reward);
  } catch (error) {
    console.error('Error collecting reward:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getRewards,
  collectReward
};