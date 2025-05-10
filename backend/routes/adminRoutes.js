const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getAllAds, deleteAd } = require('../controllers/adminController');
const authenticate = require('../middleware/authMiddleware');

// Protect routes - only admin can access
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

router.get('/users', authenticate, isAdmin, getAllUsers);
router.delete('/users/:id', authenticate, isAdmin, deleteUser);
router.get('/ads', authenticate, isAdmin, getAllAds);
router.delete('/ads/:id', authenticate, isAdmin, deleteAd);

module.exports = router;
