const express = require('express');
const { getUserProfile, deleteAccount } = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/user/profile - Get user profile with memory count
router.get('/profile', getUserProfile);

// DELETE /api/user/account - Delete account and all memories
router.delete('/account', deleteAccount);

module.exports = router; 