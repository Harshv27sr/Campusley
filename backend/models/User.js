// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  educationLevel: {
    type: String,
    enum: ['School', 'College'],
    required: [true, 'Education level is required'],
  },
  state: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  
  // College Academic Profile
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

  // School Academic Profile
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

  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
  }],
  avatar: {
    type: String,
    default: null,
  },
  idCardUrl: {
    type: String,
    default: '',
  },
  liveSelfieUrl: {
    type: String,
    default: null,
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending',
  },
  verificationReason: {
    type: String,
    default: '',
  },
  resetPasswordOTP: {
    type: String,
    default: null,
  },
  resetPasswordOTPExpires: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
