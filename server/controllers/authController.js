const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose'); // Added missing import

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register user
const register = async (req, res) => {
  try {
    console.log('Registration attempt:', { 
      username: req.body.username,
      body: req.body,
      contentType: req.headers['content-type']
    });

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    console.log('Checking if user exists:', username);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Username already exists');
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    console.log('Creating new user');
    const user = new User({ username, password });
    
    // Log MongoDB connection status
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    await user.save();
    console.log('User saved successfully');

    // Generate token
    const token = generateToken(user._id);
    console.log('Token generated');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Register error details:', error.message);
    console.error('Register error stack:', error.stack);
    
    // Check for MongoDB specific errors
    if (error.name === 'MongoServerError') {
      console.error('MongoDB error code:', error.code);
      
      // Duplicate key error
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log('Login attempt:', { username: req.body.username });
    
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('Login successful');

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    console.error('Login error stack:', error.stack);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

module.exports = {
  register,
  login
}; 