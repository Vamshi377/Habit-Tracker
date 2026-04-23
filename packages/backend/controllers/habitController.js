const Habit = require('../models/Habit');
const User = require('../models/User');
const Achievement = require('../models/Achievement');
const Notification = require('../models/Notification');

// Helper function to update achievements
const checkAndUpdateAchievements = async (userId, habitId) => {
  try {
    const user = await User.findById(userId);
    const habits = await Habit.find({ user: userId });
    
    // Get streak achievements
    const streakAchievements = await Achievement.find({ type: 'streak' });
    
    // Check for streak achievements
    for (const habit of habits) {
      for (const achievement of streakAchievements) {
        if (habit.streak >= achievement.requirement) {
          // Check if user already has this achievement
          const hasAchievement = user.achievements.includes(achievement._id);
          
          if (!hasAchievement) {
            // Add achievement to user
            user.achievements.push(achievement._id);
            
            // Add XP for achievement
            user.experience += achievement.xpReward;
            user.totalExperience += achievement.xpReward;
            
            // Create notification
            await Notification.create({
              user: userId,
              type: 'achievement',
              title: 'New Achievement Unlocked!',
              message: `You've earned the "${achievement.title}" achievement!`,
              relatedHabit: habitId,
              relatedAchievement: achievement._id
            });
            
            // Check for level up
            checkForLevelUp(user);
          }
        }
      }
    }
    
    await user.save();
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};

// Helper function to check for level up
const checkForLevelUp = async (user) => {
  const requiredXP = calculateRequiredXP(user.level);
  
  if (user.experience >= requiredXP) {
    user.experience -= requiredXP;
    user.level += 1;
    
    // Create notification for level up - changed type from 'level' to 'achievement'
    await Notification.create({
      user: user._id,
      type: 'achievement',  // Changed from 'level' to 'achievement'
      title: 'Level Up!',
      message: `Congratulations! You've reached level ${user.level}!`
    });
  }
};

// Helper function to calculate required XP for level up
const calculateRequiredXP = (level) => {
  // Simple formula: 100 * level
  return 100 * level;
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      frequency,
      customDays,
      timeOfDay,
      specificTime,
      reminderEnabled,
      reminderTime,
      difficulty
    } = req.body;
    
    // Set XP reward based on difficulty
    let xpReward = 10; // default medium
    if (difficulty === 'easy') xpReward = 5;
    if (difficulty === 'hard') xpReward = 15;
    
    const habit = await Habit.create({
      user: req.user._id,
      title,
      description,
      category,
      frequency,
      customDays: customDays || [],
      timeOfDay,
      specificTime,
      reminderEnabled,
      reminderTime,
      difficulty,
      xpReward
    });
    
    res.status(201).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all habits for a user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get habit by ID
// @route   GET /api/habits/:id
// @access  Private
const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Habit.findByIdAndDelete(req.params.id);

    res.json({ message: 'Habit removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    Mark habit as complete for today
// @route   POST /api/habits/:id/complete
// @access  Private
const completeHabit = async (req, res) => {
  try {
    // console.log('Completing habit:', req.params.id);
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    // Check if habit belongs to user
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntry = habit.completionHistory.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
    
    if (todayEntry) {
      return res.status(400).json({ message: 'Habit already completed today' });
    }
    
    // Add today's completion
    habit.completionHistory.push({
      date: today,
      completed: true
    });
    
    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const yesterdayEntry = habit.completionHistory.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === yesterday.getTime();
    });
    
    if (yesterdayEntry && yesterdayEntry.completed) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }
    
    // Update longest streak if current streak is longer
    if (habit.streak > habit.longestStreak) {
      habit.longestStreak = habit.streak;
    }
    
    await habit.save();
    
    // Update user XP
    const user = await User.findById(req.user._id);
    user.experience += habit.xpReward;
    user.totalExperience += habit.xpReward;
    
    // Check for level up
    checkForLevelUp(user);
    await user.save();
    
    // Check for achievements
    await checkAndUpdateAchievements(req.user._id, habit._id);
    
    res.json({
      habit,
      xpGained: habit.xpReward,
      currentXP: user.experience,
      level: user.level
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get habit stats (streaks, completion rate, etc.)
// @route   GET /api/habits/stats
// @access  Private
const getHabitStats = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    
    // Calculate daily completion rate
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyStats = {
      total: habits.length,
      completed: 0,
      completion_rate: 0
    };
    
    habits.forEach(habit => {
      const todayEntry = habit.completionHistory.find(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });
      
      if (todayEntry && todayEntry.completed) {
        dailyStats.completed += 1;
      }
    });
    
    if (dailyStats.total > 0) {
      dailyStats.completion_rate = (dailyStats.completed / dailyStats.total) * 100;
    }
    
    // Calculate weekly stats
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyCompletions = {};
    const weeklyTotal = {};
    
    habits.forEach(habit => {
      const weekEntries = habit.completionHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= oneWeekAgo && entryDate <= today;
      });
      
      weekEntries.forEach(entry => {
        const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' });
        weeklyTotal[day] = (weeklyTotal[day] || 0) + 1;
        
        if (entry.completed) {
          weeklyCompletions[day] = (weeklyCompletions[day] || 0) + 1;
        }
      });
    });
    
    const weeklyStats = {
      labels: Object.keys(weeklyTotal),
      completions: Object.values(weeklyCompletions),
      totals: Object.values(weeklyTotal),
      rates: Object.keys(weeklyTotal).map(day => {
        return weeklyTotal[day] > 0
          ? (weeklyCompletions[day] || 0) / weeklyTotal[day] * 100
          : 0;
      })
    };
    
    // Get streak data
    const streakStats = {
      current_longest_streak: Math.max(...habits.map(h => h.longestStreak), 0),
      average_streak: habits.length > 0
        ? habits.reduce((sum, h) => sum + h.streak, 0) / habits.length
        : 0
    };
    
    res.json({
      daily: dailyStats,
      weekly: weeklyStats,
      streaks: streakStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get habits formatted for AI analysis
// @route   GET /api/habits/ai-data
// @access  Private
const getHabitsForAI = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get user's habits
    const habits = await Habit.find({ user: req.user._id });
    
    // Get user data
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Count active and completed habits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Format habits for AI
    const formattedHabits = habits.map(habit => {
      // Check if habit was completed today
      const completedToday = habit.completionHistory && Array.isArray(habit.completionHistory) ? 
        habit.completionHistory.some(log => {
          if (!log || !log.date) return false;
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          return logDate.getTime() === today.getTime();
        }) : false;
      
      return {
        name: habit.title,
        description: habit.description || 'No description',
        category: habit.category || 'General',
        frequency: habit.frequency || 'Daily',
        difficulty: habit.difficulty || 'Medium',
        streak: habit.streak || 0,
        longestStreak: habit.longestStreak || 0,
        completedToday: completedToday,
        durationDays: habit.durationDays || 0,
        active: habit.active !== false
      };
    });

    // Count stats
    const habitCount = habits.length;
    const activeHabits = habits.filter(habit => habit.active !== false).length;
    const completedToday = habits.filter(habit => {
      if (!habit.completionHistory || !Array.isArray(habit.completionHistory)) return false;
      return habit.completionHistory.some(log => {
        if (!log || !log.date) return false;
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === today.getTime();
      });
    }).length;

    // Get user stats
    const stats = {
      totalHabits: habitCount,
      activeHabits,
      completedToday,
      streakCount: user.streakCount || 0,
      longestStreak: user.longestStreak || 0,
      level: user.level || 1,
      experience: user.experience || 0
    };

    // Prepare response
    const response = {
      user: {
        username: user.username || 'User',
        level: user.level || 1,
        experience: user.experience || 0,
        streakCount: user.streakCount || 0,
        longestStreak: user.longestStreak || 0
      },
      habits: formattedHabits,
      habitCount,
      activeHabits,
      completedToday,
      stats
    };

    console.log('AI Habit Data prepared:', JSON.stringify(response, null, 2));
    
    res.json(response);
  } catch (error) {
    console.error('Error in getHabitsForAI:', error);
    res.status(500).json({ 
      message: 'Error retrieving habit data for AI',
      error: error.message
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  completeHabit,
  getHabitStats,
  getHabitsForAI
};