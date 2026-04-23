const mongoose = require('mongoose');

const achievementSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['streak', 'completion', 'level', 'community'],
      required: true,
    },
    requirement: {
      type: Number,
      required: true,
    },
    xpReward: {
      type: Number,
      required: true,
      default: 50,
    },
    icon: {
      type: String,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Achievement', achievementSchema);