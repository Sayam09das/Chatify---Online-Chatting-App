// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const Message = require('../Models/Message');

// Get messages between two users
router.get('/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

module.exports = router;
