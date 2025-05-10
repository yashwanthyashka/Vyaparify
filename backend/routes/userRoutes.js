const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const User = require('../models/User');
const Ad = require('../models/Ad');
const isAdmin = require('../middleware/isAdmin'); // Import the isAdmin middleware

const router = express.Router();

// Route to get user profile and their ads  
router.get('/profile', authenticate, async (req, res) => {
  try {
    console.log('Authenticated user ID:', req.user.id); // ✅ Log user ID

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const ads = await Ad.find({ user: req.user.id });

    res.status(200).json({ user, ads });
  } catch (error) {
    console.error('Error fetching profile:', error); // ✅ Log error clearly
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});


// ✅ Admin-only route to get all users and all ads
router.get('/admin/dashboard', authenticate, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.find().select('-password');
    const ads = await Ad.find().populate('user', 'name email');

    res.status(200).json({ users, ads });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin data', error: error.message });
  }
});
// DELETE route to delete a user by ID (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  });

// Get user details by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
});

router.get('/:sellerId', async (req, res) => {
  try {
    const seller = await User.findById(req.params.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seller details' });
  }
});


module.exports = router;
