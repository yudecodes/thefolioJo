// backend/routes/post.routes.js
const express = require('express');
const Post    = require('../models/Post');
const Comment = require('../models/Comment');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const upload  = require('../middleware/upload');

const router = express.Router();

// ── GET /api/posts ─────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePic role')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/posts ────────────────────────────────────────────
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim())
      return res.status(400).json({ message: 'Post content is required' });

    const post = await Post.create({
      author:  req.user._id,
      content: content.trim(),
      image:   req.file ? req.file.filename : '',
    });

    const populated = await post.populate('author', 'name profilePic role');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/posts/:id ─────────────────────────────────────────
// Edit a post — owner OR admin can edit content
router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: 'Not authorized to edit this post' });

    const { content } = req.body;
    if (!content || !content.trim())
      return res.status(400).json({ message: 'Content cannot be empty' });

    post.content = content.trim();
    await post.save();

    const populated = await post.populate('author', 'name profilePic role');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/posts/:id ──────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: 'Not authorized to delete this post' });

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;