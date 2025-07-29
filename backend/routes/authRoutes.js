const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    resendOtp,
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // Import the upload middleware

// Auth routes
router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticateToken, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOtp);

// Example protected route
router.get('/', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
});
router.post('/verify-token', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        res.status(200).json({ user: decodedToken });
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
});
module.exports = router;
