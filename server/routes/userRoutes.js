const express = require('express');
const User = require('../models/Account');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get all users (with authentication)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Fetch all users, excluding sensitive information
    const users = await User.find({}, {
      password: 0, 
      connections: 0
    }).lean();

    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
});

module.exports = router;