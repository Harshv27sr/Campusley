// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jsonDb = require('../utils/jsonDb');
const mongoose = require('mongoose');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (mongoose.connection.readyState === 1) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      const db = jsonDb.readDb();
      const user = db.users.find(u => u._id.toString() === decoded.id.toString());
      if (user) {
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      }
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not found in active session' });
    }
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden, admin access only required' });
  }
};

module.exports = { protect, adminOnly };
