const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/chatify', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Welcome to the Chatify Online Chat App!',
        user: req.user,
    });
});

module.exports = router;
