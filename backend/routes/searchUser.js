const express = require('express');
const router = express.Router();
const User = require('../Models/userModels');

router.get('/', async (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.status(400).json({ message: 'Search query missing' });
  }

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { fullName: { $regex: searchQuery, $options: 'i' } }
      ]
    }).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search users' });
  }
});

module.exports = router;
