// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { signup, login, logout, getMe, forgotPassword, resetPassword, googleAuth, verifyAccount, getPublicStats, updateAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

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
router.post('/signup', upload.fields([{ name: 'idCard', maxCount: 1 }, { name: 'liveSelfie', maxCount: 1 }]), signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile/avatar', protect, upload.single('avatar'), updateAvatar);
router.put('/verify', protect, verifyAccount);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/google', googleAuth);

module.exports = router;
