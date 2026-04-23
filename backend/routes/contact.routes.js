// backend/routes/contact.routes.js
const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

// ── POST /api/contact ─────────────────────────────────────────
// Public — any guest can submit the contact form
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const doc = await ContactMessage.create({ name, email, message });
    res.status(201).json({ message: 'Message sent successfully', data: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/contact ──────────────────────────────────────────
// Admin only — fetch all messages (newest first)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/contact/:id/read ─────────────────────────────────
// Admin only — mark a message as read
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/contact/:id ───────────────────────────────────
// Admin only — delete a message
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;