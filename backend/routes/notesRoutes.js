// backend/routes/notesRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getNotes, getNoteById, uploadNote, updateNote, deleteNote,
  downloadNote, likeNote, rateNote, commentNote, getComments,
  reportNote, getTrendingNotes, getPreviousYearPapers
} = require('../controllers/notesController');
const { protect } = require('../middleware/auth');

// Make sure upload folder exists
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
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB size limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx|ppt|pptx|png|jpg|jpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only document files (PDF, Word, Powerpoint, Images) are allowed'));
  }
});

router.get('/', getNotes);
router.get('/trending', getTrendingNotes);
router.get('/pyq', getPreviousYearPapers);
router.get('/search', getNotes); // reuse getNotes for general searches
router.get('/:id', getNoteById);

// Protected Actions
router.post('/upload', protect, upload.single('file'), uploadNote);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

router.post('/:id/download', downloadNote);
router.post('/:id/like', protect, likeNote);
router.post('/:id/rate', protect, rateNote);
router.post('/:id/comment', protect, commentNote);
router.get('/:id/comments', getComments);
router.post('/:id/report', protect, reportNote);

module.exports = router;
