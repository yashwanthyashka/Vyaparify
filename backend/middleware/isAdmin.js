// backend/middleware/isAdmin.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

module.exports = isAdmin;
