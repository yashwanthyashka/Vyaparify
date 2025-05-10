const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Get full user
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user; // Attach full user object to request
    next();
  } catch (err) {
    console.log('JWT error:', err.message);
    return res.status(401).json({ error: 'Token is invalid' });
  }
};

module.exports = authenticate;
