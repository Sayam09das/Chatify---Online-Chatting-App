const User = require('../models/User');

// Helper to format last seen
const formatLastSeen = (date) => {
  if (!date) return 'unknown';
  
  const now = new Date();
  const lastSeen = new Date(date);
  const diffMs = now - lastSeen;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  
  return lastSeen.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short',
    year: lastSeen.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

// @desc    Get all users with their online status
// @route   POST /api/users
// @access  Private
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -refreshTokens -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires');
    
    // Add formatted last seen to each user
    const usersWithStatus = users.map(user => {
      const userObj = user.toObject();
      userObj.lastSeenFormatted = formatLastSeen(user.lastSeen);
      return userObj;
    });
    
    res.json(usersWithStatus);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user by ID with online status
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshTokens -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const userObj = user.toObject();
    userObj.lastSeenFormatted = formatLastSeen(user.lastSeen);
    
    res.json(userObj);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get online status of multiple users
// @route   POST /api/users/status
// @access  Private
exports.getUsersStatus = async (req, res) => {
  try {
    const { userIds } = req.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        message: 'userIds array is required'
      });
    }
    
    const users = await User.find({ _id: { $in: userIds } })
      .select('isOnline lastSeen')
      .lean();
    
    const statuses = {};
    users.forEach(user => {
      statuses[user._id.toString()] = {
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        lastSeenFormatted: formatLastSeen(user.lastSeen)
      };
    });
    
    res.json(statuses);
  } catch (error) {
    console.error('Get users status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

