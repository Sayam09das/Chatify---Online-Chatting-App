const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware.protect);

// @route   POST /api/users
// @desc    Get all users with their online status
// @access  Private
router.post('/', usersController.getUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID with online status
// @access  Private
router.get('/:id', usersController.getUserById);

// @route   POST /api/users/status
// @desc    Get online status of multiple users
// @access  Private
router.post('/status', usersController.getUsersStatus);

module.exports = router;

