// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  adminGetUsers, adminVerifyUser, adminDeleteUser,
  adminGetStats, adminGetNotes, adminDeleteNote,
} = require('../controllers/userController');

// All admin routes require login + admin role
router.use(protect, adminOnly);

router.get('/stats', adminGetStats);
router.get('/users', adminGetUsers);
router.put('/users/:id/verify', adminVerifyUser);
router.delete('/users/:id', adminDeleteUser);
router.get('/notes', adminGetNotes);
router.delete('/notes/:id', adminDeleteNote);

module.exports = router;
