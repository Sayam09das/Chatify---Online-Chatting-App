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
    getAllUsers
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const User = require('../Models/userModels');

// Auth routes
router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticateToken, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOtp);
router.post('/users', authenticateToken, getAllUsers);

// ✅ GET current authenticated user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password -otp -otpExpires -resetVerified');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

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

router.put(
    '/update-profile-image',
    authenticateToken,
    upload.single('profileImage'),
    async (req, res) => {
        try {
            const userId = req.userId;
            const imagePath = `/uploads/profiles/${req.file.filename}`;
            const user = await User.findByIdAndUpdate(userId, { profileImage: imagePath }, { new: true });
            res.json({ message: 'Profile updated', user });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error updating profile' });
        }
    }
);

module.exports = router;
