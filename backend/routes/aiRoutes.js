const express = require('express');
const router = express.Router();
const { summarizeNotes, chatWithTutor, generateQuiz } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// Protected AI Routes
router.post('/summarize', protect, summarizeNotes);
router.post('/chat', protect, chatWithTutor);
router.post('/quiz', protect, generateQuiz);

module.exports = router;
