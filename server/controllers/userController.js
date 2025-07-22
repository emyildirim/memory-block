const User = require('../models/User');
const Memory = require('../models/Memory');

// Get user profile with memory count
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const memoryCount = await Memory.countDocuments({ userId: req.user._id });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        createdAt: user.createdAt
      },
      memoryCount
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// Delete user account and all related memories
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all memories for this user
    await Memory.deleteMany({ userId });

    // Delete the user account
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and all memories deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error deleting account' });
  }
};

module.exports = {
  getUserProfile,
  deleteAccount
}; 