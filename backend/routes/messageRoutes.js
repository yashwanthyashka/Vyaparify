const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Message = require('../models/Message');

// POST a new message
router.post('/', authenticate, async (req, res) => {
  try {
    const { receiverId, adId, content } = req.body;

    if (!receiverId || !adId || !content) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const message = new Message({
      senderId: req.user.id, // From auth middleware
      receiverId,
      adId,
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET messages for a user (inbox)
router.get('/inbox', authenticate, async (req, res) => {
  try {
    const messages = await Message.find({ receiverId: req.user.id }).populate('senderId adId');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// GET chat between two users for an ad
router.get('/:userId/:adId', authenticate, async (req, res) => {
  try {
    const { userId, adId } = req.params;

    const messages = await Message.find({
      adId,
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
});

module.exports = router;
