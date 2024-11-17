const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authmiddleware');

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    res.status(500).json({ message: 'Failed to fetch user info', error: error.message });
  }
});

router.get('/search', async (req, res) => {
  const { query } = req.query; 

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const users = await User.find({
      name: new RegExp(query, 'i'), 
    }).limit(10); 

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  const { search } = req.query;

  try {
    const users = await User.find({
      name: new RegExp(search, 'i'),
      _id: { $ne: req.user.id } 
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});
module.exports = router;
