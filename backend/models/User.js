const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  // Security fields
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  passwordChangedAt: {
    type: Date,
    default: null
  },
  // Password reset fields
  passwordResetToken: String,
  passwordResetExpires: Date,
  // Email verification
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  // OAuth providers
  provider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local'
  },
  providerId: String,
  // Token versioning for logout all devices
  tokenVersion: {
    type: Number,
    default: 0
  },
  // Refresh tokens stored (for logout all devices feature)
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now },
    userAgent: String,
    ip: String
  }]
}, {
  timestamps: true
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await argon2.verify(this.password, candidatePassword);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Increment failed login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  // If account is already locked, don't increment
  if (this.isLocked()) {
    throw new Error('Account is temporarily locked');
  }

  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    this.failedLoginAttempts = 1;
    this.lockUntil = null;
  } else {
    this.failedLoginAttempts += 1;
    
    // Lock account after 5 failed attempts for 15 minutes
    if (this.failedLoginAttempts >= 5) {
      this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    }
  }

  await this.save();
};

// Reset failed login attempts
userSchema.methods.resetLoginAttempts = async function() {
  this.failedLoginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

// JSON transformation
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpires;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);

