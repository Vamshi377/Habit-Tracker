const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String
  },
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  },
  habit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  reported: {
    count: { type: Number, default: 0 },
    by: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);