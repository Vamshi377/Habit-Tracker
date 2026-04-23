const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  customDays: {
    type: [String],
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'anytime'],
    default: 'anytime'
  },
  specificTime: {
    type: String, // "HH:MM" format
    default: null
  },
  reminderEnabled: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: String, // "HH:MM" format
    default: null
  },
  streak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  completionHistory: [{
    date: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: true
    }
  }],
  active: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  xpReward: {
    type: Number,
    default: 10
  }
}, { timestamps: true });

// Virtual for checking today's completion status
HabitSchema.virtual('completedToday').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayEntry = this.completionHistory.find(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  return todayEntry ? todayEntry.completed : false;
});

module.exports = mongoose.model('Habit', HabitSchema);