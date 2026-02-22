const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const messagesController = require('../controllers/messages.controller');

router.use(authMiddleware.protect);

// @route   GET /api/messages/:userId
// @desc    Get messages between logged-in user and another user
// @access  Private
router.get('/:userId', messagesController.getMessagesWithUser);

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', messagesController.sendMessage);

module.exports = router;
