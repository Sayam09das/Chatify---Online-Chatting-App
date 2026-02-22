const mongoose = require('mongoose');
const Message = require('../models/Message');

exports.getMessagesWithUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id',
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages',
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const sender = req.user._id;
    const { receiver, text } = req.body;

    if (!receiver || !text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'receiver and text are required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid receiver id',
      });
    }

    const message = await Message.create({
      sender,
      receiver,
      text: text.trim(),
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message',
    });
  }
};
