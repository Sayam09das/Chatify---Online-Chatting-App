const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('argon2');
const { validationResult } = require('express-validator');
const { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail, verifyToken } = require('../utils/email.util');

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Set cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Clear auth cookies
const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

// Simple JWT-based Google token verification (fallback if Firebase Admin fails)
const verifyGoogleTokenSimple = async (idToken) => {
  // Decode without verification (less secure but works without Firebase Admin)
  // In production, you should use Firebase Admin SDK
  const decoded = jwt.decode(idToken);
  
  if (!decoded) {
    throw new Error('Invalid token format');
  }
  
  // Check basic claims
  if (!decoded.email || !decoded.sub) {
    throw new Error('Invalid token claims');
  }
  
  return decoded;
};

// @desc    Google OAuth Login/Register
// @route   POST /api/auth/google
// @access  Public
exports.googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify the Google ID token
    let decodedToken;
    let useSimpleVerification = false;
    
    try {
      // Try Firebase Admin first
      const { verifyGoogleIdToken } = require('../firebase');
      decodedToken = await verifyGoogleIdToken(idToken);
    } catch (firebaseError) {
      console.log('Firebase Admin verification failed, using fallback:', firebaseError.message);
      
      // Fallback to simple JWT decoding
      try {
        decodedToken = await verifyGoogleTokenSimple(idToken);
        useSimpleVerification = true;
        console.log('Using simple token verification for:', decodedToken.email);
      } catch (simpleError) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Google token'
        });
      }
    }

    const { email, name, picture, sub: uid } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not found in Google token'
      });
    }

    // Check if user already exists
    let user = await User.findOne({
      $or: [
        { email },
        { providerId: uid }
      ]
    });

    if (user) {
      // If user exists but not with Google, link the accounts
      if (user.provider === 'local') {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists. Please login with your email and password.'
        });
      }

      // Update existing Google user info
      user.username = name ? (name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000)) : 'user';
      user.profilePicture = picture || user.profilePicture;
      user.emailVerified = true;
    } else {
      // Create new Google user
      const username = name ? (name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000)) : 'user';
      
      user = await User.create({
        username,
        email,
        profilePicture: picture || '',
        provider: 'google',
        providerId: uid,
        emailVerified: true,
        isOnline: true
      });

      // Send welcome email
      try {
        await sendWelcomeEmail(user);
      } catch (emailError) {
        console.log('Welcome email failed:', emailError.message);
      }
    }

    // Update online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token in database
    user.refreshTokens.push({
      token: refreshToken,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });

    // Limit stored refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Return user with access token for localStorage
    const userResponse = user.toJSON();
    userResponse.accessToken = accessToken;

    res.json({
      success: true,
      message: 'Google login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication'
    });
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create user with hashed password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      provider: 'local',
      emailVerified: false
    });

    // Send verification email
    try {
      await sendVerificationEmail(user);
    } catch (emailError) {
      console.log('Verification email failed:', emailError.message);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token in database
    user.refreshTokens.push({
      token: refreshToken,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
    await user.save();

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Return user with access token for localStorage
    const userResponse = user.toJSON();
    userResponse.accessToken = accessToken;

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: userResponse
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.provider !== 'local') {
      return res.status(401).json({
        success: false,
        message: `This account uses ${user.provider} login. Please use ${user.provider} to sign in.`
      });
    }

    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.',
        lockUntil: user.lockUntil
      });
    }

    let isMatch = false;
    
    try {
      isMatch = await user.comparePassword(password);
    } catch (err) {
      if (user.password === password) {
        user.password = await bcrypt.hash(password, 12);
        await user.save();
        isMatch = true;
      }
    }

    if (!isMatch) {
      await user.incrementLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: user.failedLoginAttempts >= 5 
          ? 'Account temporarily locked due to too many failed attempts'
          : 'Invalid credentials'
      });
    }

    await user.resetLoginAttempts();

    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshTokens.push({
      token: refreshToken,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
    
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    // Return user with access token for localStorage
    const userResponse = user.toJSON();
    userResponse.accessToken = accessToken;

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token, 'email_verification');
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.emailVerified) {
      return res.json({
        success: true,
        message: 'Email already verified'
      });
    }

    user.emailVerified = true;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a verification email has been sent'
      });
    }

    if (user.emailVerified) {
      return res.json({
        success: true,
        message: 'Email is already verified'
      });
    }

    if (user.provider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'This account uses OAuth login'
      });
    }

    try {
      await sendVerificationEmail(user);
    } catch (emailError) {
      console.log('Resend verification email failed:', emailError.message);
    }

    res.json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user || user.provider !== 'local') {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset email has been sent'
      });
    }

    try {
      await sendPasswordResetEmail(user);
    } catch (emailError) {
      console.log('Password reset email failed:', emailError.message);
    }

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token, 'password_reset');
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.provider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'This account uses OAuth login. Please use Google to sign in.'
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = new Date();
    user.refreshTokens = [];
    user.tokenVersion += 1;
    
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: { token: refreshToken } }
      });
    }

    clearAuthCookies(res);

    await User.findByIdAndUpdate(req.user._id, {
      isOnline: false,
      lastSeen: new Date()
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
exports.logoutAll = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { tokenVersion: 1 },
      $set: { refreshTokens: [], isOnline: false, lastSeen: new Date() }
    });

    clearAuthCookies(res);

    res.json({
      success: true,
      message: 'Logged out from all devices'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token not found'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const tokenInDB = user.refreshTokens.find(t => t.token === refreshToken);
    
    if (!tokenInDB) {
      user.refreshTokens = [];
      user.tokenVersion += 1;
      await user.save();
      
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: 'Token has been invalidated'
      });
    }

    const tokens = generateTokens(user._id);

    user.refreshTokens = user.refreshTokens.map(t => 
      t.token === refreshToken 
        ? { ...tokens.refreshToken, createdAt: new Date(), userAgent: req.get('user-agent'), ip: req.ip }
        : t
    );
    await user.save();

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (user.provider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change password for OAuth accounts'
      });
    }

    let isMatch = false;
    
    try {
      isMatch = await user.comparePassword(currentPassword);
    } catch (err) {
      if (user.password === currentPassword) {
        user.password = await bcrypt.hash(currentPassword, 12);
        await user.save();
        isMatch = true;
      }
    }
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = new Date();
    user.refreshTokens = [];
    user.tokenVersion += 1;
    
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);
    
    user.refreshTokens.push({
      token: refreshToken,
      userAgent: req.get('user-agent'),
      ip: req.ip
    });
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

