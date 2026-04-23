const Post = require('../models/Post');
const User = require('../models/User');

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    console.log("hhhhhhh")
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar');

    
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get post by ID
// @route   GET /api/community/posts/:id
// @access  Public
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new post
// @route   POST /api/community/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content, tags, imageUrl } = req.body;
    
    const newPost = new Post({
      title,
      content,
      tags,
      image: imageUrl,
      user: req.user._id
    });
    
    const post = await newPost.save();
    
    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/community/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check user
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await post.remove();
    
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Like a post
// @route   POST /api/community/posts/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if already liked
    if (post.likes.includes(req.user._id)) {
      // Remove like
      post.likes = post.likes.filter(
        like => like.toString() !== req.user._id.toString()
      );
    } else {
      // Add like
      post.likes.push(req.user._id);
    }
    
    await post.save();
    
    res.json({
      likes: post.likes,
      isLiked: post.likes.includes(req.user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add comment to post
// @route   POST /api/community/posts/:id/comments
// @access  Private
const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const newComment = {
      user: req.user._id,
      text: req.body.text
    };
    
    post.comments.unshift(newComment);
    
    await post.save();
    
    // Return the new comment with user info
    const populatedPost = await Post.findById(req.params.id)
      .populate('comments.user', 'username avatar');
    
    res.json(populatedPost.comments[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  likePost,
  commentOnPost
};