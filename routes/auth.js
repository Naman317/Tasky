const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password,confirmPassword });

    const salt = await bcrypt.genSalt(10);
    user.confirmPassword = await bcrypt.hash(confirmPassword, salt);
   
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;