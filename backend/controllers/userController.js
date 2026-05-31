// backend/controllers/userController.js
const User = require('../models/User');
const Note = require('../models/Note');
const jsonDb = require('../utils/jsonDb');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const isMongoConnected = () => mongoose.connection.readyState === 1;

// ─── GET /api/users/me/profile ──────────────────────────────────────────────
exports.getMyProfile = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      const uploadCount = await Note.countDocuments({ uploader: req.user._id });
      const notes = await Note.find({ uploader: req.user._id }).sort({ createdAt: -1 });
      const totalDownloads = notes.reduce((sum, n) => sum + (n.downloadsCount || 0), 0);
      const allRatings = notes.flatMap(n => n.ratings || []);
      const avgRating = allRatings.length
        ? Math.round((allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length) * 10) / 10
        : 0;
      res.json({ user, uploadCount, totalDownloads, avgRating, notes });
    } else {
      const db = jsonDb.readDb();
      const myId = String(req.user._id);
      const user = db.users.find(u => String(u._id) === myId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password: _, ...safeUser } = user;
      const notes = db.notes.filter(n => String(n.uploader) === myId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const uploadCount = notes.length;
      const totalDownloads = notes.reduce((s, n) => s + (n.downloadsCount || 0), 0);
      const allRatings = notes.flatMap(n => n.ratings || []);
      const avgRating = allRatings.length
        ? Math.round((allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length) * 10) / 10
        : 0;
      // populate uploader in notes
      const populatedNotes = notes.map(n => ({ ...n, uploader: { _id: user._id, name: user.name, email: user.email } }));
      res.json({ user: safeUser, uploadCount, totalDownloads, avgRating, notes: populatedNotes });
    }
  } catch (err) {
    console.error('GetMyProfile Error:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// ─── GET /api/users/:id/profile ─────────────────────────────────────────────
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected()) {
      const user = await User.findById(id).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      const notes = await Note.find({ uploader: id }).sort({ createdAt: -1 });
      const uploadCount = notes.length;
      const totalDownloads = notes.reduce((s, n) => s + (n.downloadsCount || 0), 0);
      const allRatings = notes.flatMap(n => n.ratings || []);
      const avgRating = allRatings.length
        ? Math.round((allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length) * 10) / 10
        : 0;
      res.json({ user, uploadCount, totalDownloads, avgRating, notes });
    } else {
      const db = jsonDb.readDb();
      const user = db.users.find(u => String(u._id) === String(id));
      if (!user) return res.status(404).json({ message: 'User not found' });
      const { password: _, ...safeUser } = user;
      const notes = db.notes.filter(n => String(n.uploader) === String(id)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const uploadCount = notes.length;
      const totalDownloads = notes.reduce((s, n) => s + (n.downloadsCount || 0), 0);
      const allRatings = notes.flatMap(n => n.ratings || []);
      const avgRating = allRatings.length
        ? Math.round((allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length) * 10) / 10
        : 0;
      const populatedNotes = notes.map(n => ({ ...n, uploader: { _id: user._id, name: user.name, email: user.email } }));
      res.json({ user: safeUser, uploadCount, totalDownloads, avgRating, notes: populatedNotes });
    }
  } catch (err) {
    console.error('GetUserProfile Error:', err);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

// ─── PUT /api/users/profile ──────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, college, branch, semester, schoolName, board, className } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (college !== undefined) updates.college = college;
    if (branch !== undefined) updates.branch = branch;
    if (semester !== undefined) updates.semester = semester;
    if (schoolName !== undefined) updates.schoolName = schoolName;
    if (board !== undefined) updates.board = board;
    if (className !== undefined) updates.className = className;

    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ user, message: 'Profile updated successfully' });
    } else {
      const db = jsonDb.readDb();
      const idx = db.users.findIndex(u => u._id === req.user._id.toString());
      if (idx === -1) return res.status(404).json({ message: 'User not found' });
      db.users[idx] = { ...db.users[idx], ...updates };
      jsonDb.writeDb(db);
      const { password: _, ...safeUser } = db.users[idx];
      res.json({ user: safeUser, message: 'Profile updated successfully' });
    }
  } catch (err) {
    console.error('UpdateProfile Error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// ─── PUT /api/users/password ─────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    if (isMongoConnected()) {
      const user = await User.findById(req.user._id).select('+password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password changed successfully' });
    } else {
      const db = jsonDb.readDb();
      const user = db.users.find(u => u._id === req.user._id.toString());
      if (!user) return res.status(404).json({ message: 'User not found' });
      const isMatch = bcrypt.compareSync(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });
      user.password = bcrypt.hashSync(newPassword, 10);
      jsonDb.writeDb(db);
      res.json({ message: 'Password changed successfully' });
    }
  } catch (err) {
    console.error('ChangePassword Error:', err);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

// ─── GET /api/users/bookmarks ────────────────────────────────────────────────
exports.getBookmarks = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user._id).populate('bookmarks');
      res.json(user.bookmarks || []);
    } else {
      const db = jsonDb.readDb();
      const user = db.users.find(u => u._id === req.user._id.toString());
      if (!user) return res.status(404).json({ message: 'User not found' });
      const bookmarked = (user.bookmarks || []).map(bId => {
        const note = db.notes.find(n => n._id === bId.toString());
        if (!note) return null;
        const uploader = db.users.find(u => u._id === note.uploader.toString());
        return { ...note, uploader: uploader ? { _id: uploader._id, name: uploader.name, email: uploader.email } : null };
      }).filter(Boolean);
      res.json(bookmarked);
    }
  } catch (err) {
    console.error('GetBookmarks Error:', err);
    res.status(500).json({ message: 'Failed to fetch bookmarks' });
  }
};

// ─── POST /api/users/bookmarks/:noteId ──────────────────────────────────────
exports.toggleBookmark = async (req, res) => {
  try {
    const { noteId } = req.params;
    if (isMongoConnected()) {
      const user = await User.findById(req.user._id);
      const idx = user.bookmarks.indexOf(noteId);
      let action;
      if (idx > -1) { user.bookmarks.splice(idx, 1); action = 'removed'; }
      else { user.bookmarks.push(noteId); action = 'added'; }
      await user.save();
      res.json({ message: `Bookmark ${action}`, bookmarks: user.bookmarks, action });
    } else {
      const db = jsonDb.readDb();
      const user = db.users.find(u => u._id === req.user._id.toString());
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (!user.bookmarks) user.bookmarks = [];
      const idx = user.bookmarks.indexOf(noteId);
      let action;
      if (idx > -1) { user.bookmarks.splice(idx, 1); action = 'removed'; }
      else { user.bookmarks.push(noteId); action = 'added'; }
      jsonDb.writeDb(db);
      res.json({ message: `Bookmark ${action}`, bookmarks: user.bookmarks, action });
    }
  } catch (err) {
    console.error('ToggleBookmark Error:', err);
    res.status(500).json({ message: 'Failed to toggle bookmark' });
  }
};

// ─── GET /api/users/notifications ───────────────────────────────────────────
exports.getNotifications = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user._id).select('notifications');
      res.json(user?.notifications || []);
    } else {
      const db = jsonDb.readDb();
      const user = db.users.find(u => u._id === req.user._id.toString());
      res.json(user?.notifications || []);
    }
  } catch (err) {
    console.error('GetNotifications Error:', err);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// ─── PUT /api/users/notifications/read-all ──────────────────────────────────
exports.markAllNotificationsRead = async (req, res) => {
  try {
    if (isMongoConnected()) {
      await User.findByIdAndUpdate(req.user._id, { $set: { 'notifications.$[].read': true } });
      res.json({ message: 'All notifications marked as read' });
    } else {
      const db = jsonDb.readDb();
      const user = db.users.find(u => u._id === req.user._id.toString());
      if (user?.notifications) {
        user.notifications = user.notifications.map(n => ({ ...n, read: true }));
        jsonDb.writeDb(db);
      }
      res.json({ message: 'All notifications marked as read' });
    }
  } catch (err) {
    console.error('MarkAllRead Error:', err);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
};

// ─── GET /api/users/top-contributors ────────────────────────────────────────
exports.getTopContributors = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const contributors = await Note.aggregate([
        { $group: { _id: '$uploader', totalUploads: { $sum: 1 }, totalDownloads: { $sum: '$downloadsCount' } } },
        { $sort: { totalDownloads: -1 } },
        { $limit: 6 },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { 'user.password': 0 } }
      ]);
      res.json(contributors);
    } else {
      const db = jsonDb.readDb();
      const uploaderMap = {};
      db.notes.forEach(n => {
        const uid = n.uploader.toString();
        if (!uploaderMap[uid]) uploaderMap[uid] = { totalUploads: 0, totalDownloads: 0 };
        uploaderMap[uid].totalUploads++;
        uploaderMap[uid].totalDownloads += n.downloadsCount || 0;
      });
      const result = Object.entries(uploaderMap)
        .map(([uid, stats]) => {
          const user = db.users.find(u => u._id === uid);
          if (!user) return null;
          const { password: _, ...safeUser } = user;
          return { _id: uid, ...stats, user: safeUser };
        })
        .filter(Boolean)
        .sort((a, b) => b.totalDownloads - a.totalDownloads)
        .slice(0, 6);
      res.json(result);
    }
  } catch (err) {
    console.error('GetTopContributors Error:', err);
    res.status(500).json({ message: 'Failed to fetch top contributors' });
  }
};

// ─── ADMIN: GET /api/admin/users ────────────────────────────────────────────
exports.adminGetUsers = async (req, res) => {
  try {
    const { search } = req.query;
    if (isMongoConnected()) {
      const query = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
      const users = await User.find(query).select('-password').sort({ createdAt: -1 });
      res.json(users);
    } else {
      const db = jsonDb.readDb();
      let users = db.users.map(({ password: _, ...u }) => u);
      if (search) {
        const rx = new RegExp(search, 'i');
        users = users.filter(u => rx.test(u.name) || rx.test(u.email));
      }
      // Attach upload counts
      const withCounts = users.map(u => ({
        ...u,
        uploadCount: db.notes.filter(n => n.uploader === u._id).length
      }));
      res.json(withCounts);
    }
  } catch (err) {
    console.error('AdminGetUsers Error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// ─── ADMIN: PUT /api/admin/users/:id/verify ─────────────────────────────────
exports.adminVerifyUser = async (req, res) => {
  try {
    const { status } = req.body; // 'Verified' | 'Rejected' | 'Pending'
    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(req.params.id, { verificationStatus: status }, { new: true }).select('-password');
      res.json({ user, message: `User ${status}` });
    } else {
      const db = jsonDb.readDb();
      const idx = db.users.findIndex(u => u._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'User not found' });
      db.users[idx].verificationStatus = status;
      jsonDb.writeDb(db);
      const { password: _, ...safeUser } = db.users[idx];
      res.json({ user: safeUser, message: `User ${status}` });
    }
  } catch (err) {
    console.error('AdminVerifyUser Error:', err);
    res.status(500).json({ message: 'Failed to update user verification' });
  }
};

// ─── ADMIN: DELETE /api/admin/users/:id ─────────────────────────────────────
exports.adminDeleteUser = async (req, res) => {
  try {
    if (isMongoConnected()) {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted' });
    } else {
      const db = jsonDb.readDb();
      db.users = db.users.filter(u => u._id !== req.params.id);
      jsonDb.writeDb(db);
      res.json({ message: 'User deleted' });
    }
  } catch (err) {
    console.error('AdminDeleteUser Error:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// ─── ADMIN: GET /api/admin/stats ─────────────────────────────────────────────
exports.adminGetStats = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const [totalUsers, totalNotes, totalDownloads] = await Promise.all([
        User.countDocuments(),
        Note.countDocuments(),
        Note.aggregate([{ $group: { _id: null, total: { $sum: '$downloadsCount' } } }])
      ]);
      res.json({ totalUsers, totalNotes, totalDownloads: totalDownloads[0]?.total || 0 });
    } else {
      const db = jsonDb.readDb();
      const totalUsers = db.users.length;
      const totalNotes = db.notes.length;
      const totalDownloads = db.notes.reduce((s, n) => s + (n.downloadsCount || 0), 0);
      const pendingVerifications = db.users.filter(u => u.verificationStatus === 'Pending').length;
      res.json({ totalUsers, totalNotes, totalDownloads, pendingVerifications });
    }
  } catch (err) {
    console.error('AdminGetStats Error:', err);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
};

// ─── ADMIN: GET /api/admin/notes ─────────────────────────────────────────────
exports.adminGetNotes = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const notes = await Note.find({}).populate('uploader', 'name email').sort({ createdAt: -1 }).limit(50);
      res.json(notes);
    } else {
      const db = jsonDb.readDb();
      const notes = [...db.notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 50);
      const populated = notes.map(n => {
        const uploader = db.users.find(u => u._id === n.uploader.toString());
        return { ...n, uploader: uploader ? { _id: uploader._id, name: uploader.name, email: uploader.email } : null };
      });
      res.json(populated);
    }
  } catch (err) {
    console.error('AdminGetNotes Error:', err);
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

// ─── ADMIN: DELETE /api/admin/notes/:id ──────────────────────────────────────
exports.adminDeleteNote = async (req, res) => {
  try {
    if (isMongoConnected()) {
      await Note.findByIdAndDelete(req.params.id);
      res.json({ message: 'Note deleted' });
    } else {
      const db = jsonDb.readDb();
      db.notes = db.notes.filter(n => n._id !== req.params.id);
      jsonDb.writeDb(db);
      res.json({ message: 'Note deleted' });
    }
  } catch (err) {
    console.error('AdminDeleteNote Error:', err);
    res.status(500).json({ message: 'Failed to delete note' });
  }
};
