// backend/models/Note.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL/Path is required'],
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloadsCount: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  ratings: [ratingSchema],
  averageRating: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  
  // Previous Year Paper specifics
  isPYQ: {
    type: Boolean,
    default: false,
  },
  pyqType: {
    type: String,
    enum: ['Mid-Sem', 'End-Sem', 'Board Exam'],
    required: function() { return this.isPYQ; },
  },

  // Academic categorization for College
  college: {
    type: String,
    trim: true,
  },
  branch: {
    type: String,
    trim: true,
  },
  semester: {
    type: String,
    trim: true,
  },

  // Academic categorization for School
  schoolName: {
    type: String,
    trim: true,
  },
  board: {
    type: String,
    trim: true,
  },
  className: {
    type: String,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate average rating dynamically when ratings are added
noteSchema.pre('save', function (next) {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
  }
  next();
});

module.exports = mongoose.model('Note', noteSchema);
