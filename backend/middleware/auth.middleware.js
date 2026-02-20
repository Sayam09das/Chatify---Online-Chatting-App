const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let accessToken;

    // Check for token in cookies first, then Authorization header
    if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      accessToken = req.headers.authorization.split(' ')[1];
    }

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      // Token expired - try to refresh
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // Check if user is deleted
    if (!user.username) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
};

// Optional auth - attaches user if token exists but doesn't require it
exports.optionalAuth = async (req, res, next) => {
  try {
    let accessToken;

    if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      accessToken = req.headers.authorization.split(' ')[1];
    }

    if (!accessToken) {
      return next();
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid - continue without user
    }

    next();
  } catch (error) {
    next();
  }
};

// Check if user is online (for Socket.IO)
exports.checkOnlineStatus = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? user.isOnline : false;
  } catch (error) {
    return false;
  }
};

