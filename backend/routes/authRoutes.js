// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const { signup, login, logout, getMe, forgotPassword, resetPassword, googleAuth, verifyAccount, getPublicStats, updateAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rate limiters
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many login attempts. Please try again after 15 minutes.' }, standardHeaders: true, legacyHeaders: false });
const signupLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 100, message: { message: 'Too many signup attempts. Please try again after 1 hour.' }, standardHeaders: true, legacyHeaders: false });

// Ensure upload folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit for images
});

router.get('/public/stats', getPublicStats);
router.post('/signup', signupLimiter, upload.fields([{ name: 'idCard', maxCount: 1 }, { name: 'liveSelfie', maxCount: 1 }]), signup);
router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile/avatar', protect, upload.single('avatar'), updateAvatar);
router.put('/verify', protect, verifyAccount);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);

module.exports = router;
