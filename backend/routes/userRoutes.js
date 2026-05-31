// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getMyProfile, getUserProfile,
  updateProfile, changePassword,
  getBookmarks, toggleBookmark,
  getNotifications, markAllNotificationsRead,
  getTopContributors,
} = require('../controllers/userController');

// ─── Public routes ─────────────────────────────────────────────────────────
router.get('/top-contributors', getTopContributors);

// ─── Protected routes (specific paths MUST come before /:id routes) ────────
router.get('/me/profile', protect, getMyProfile);       // ← must be before /:id/profile
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks/:noteId', protect, toggleBookmark);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read-all', protect, markAllNotificationsRead);

// ─── Parameterized routes last ──────────────────────────────────────────────
router.get('/:id/profile', getUserProfile);             // ← after /me/profile

module.exports = router;
