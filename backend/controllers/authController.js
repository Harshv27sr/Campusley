// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jsonDb = require('../utils/jsonDb');
const mongoose = require('mongoose');
const path = require('path');
const { verifyIDCardAI } = require('../utils/aiVerifier');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

exports.signup = async (req, res) => {
  try {
    const {
      name, email, password, educationLevel,
      state, city,
      college, branch, semester,
      schoolName, board, className
    } = req.body;

    const idCardUrl = req.files && req.files['idCard'] ? `/uploads/${req.files['idCard'][0].filename}` : '/uploads/placeholder_id.png';
    const liveSelfieUrl = req.files && req.files['liveSelfie'] ? `/uploads/${req.files['liveSelfie'][0].filename}` : null;

    let verificationStatus = 'Pending';
    let aiReason = '';

    if (idCardUrl !== '/uploads/placeholder_id.png' && req.files && req.files['idCard']) {
      const imagePath = path.join(__dirname, '..', 'uploads', req.files['idCard'][0].filename);
      let liveSelfiePath = null;
      if (req.files['liveSelfie']) {
        liveSelfiePath = path.join(__dirname, '..', 'uploads', req.files['liveSelfie'][0].filename);
      }
      
      const expectedInstitution = educationLevel === 'College' ? college : schoolName;
      const aiResult = await verifyIDCardAI(imagePath, name, expectedInstitution, liveSelfiePath);
      if (aiResult.isGenuine) {
        verificationStatus = 'Verified';
      } else if (aiResult.reason === 'AI analysis failed. Requires manual review.') {
        verificationStatus = 'Pending';
      } else {
        return res.status(400).json({ 
          message: `ID Verification Failed: ${aiResult.reason}. Please resubmit your application with clearer photos.` 
        });
      }
      aiReason = aiResult.reason;
      console.log('AI Verification Result:', aiResult);
    }

    if (isMongoConnected()) {
      // 1. Mongoose Database Mode
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'Email already registered. Please log in.' });
      }

      const userPayload = {
        name,
        email,
        password,
        educationLevel,
        state,
        city,
        idCardUrl,
        liveSelfieUrl,
        verificationStatus
      };

      if (educationLevel === 'College') {
        userPayload.college = college;
        userPayload.branch = branch;
        userPayload.semester = semester;
      } else {
        userPayload.schoolName = schoolName;
        userPayload.board = board;
        userPayload.className = className;
      }

      const user = await User.create(userPayload);
      const token = generateToken(user._id);

      const responseUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        educationLevel: user.educationLevel,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        schoolName: user.schoolName,
        board: user.board,
        className: user.className,
        state: user.state,
        city: user.city,
        bookmarks: user.bookmarks,
        idCardUrl: user.idCardUrl,
        liveSelfieUrl: user.liveSelfieUrl,
        verificationStatus: user.verificationStatus,
        verificationReason: aiReason
      };

      return res.status(201).json({ token, user: responseUser });
    } else {
      // 2. Local JSON DB Fallback Mode
      const db = jsonDb.readDb();
      
      const userExists = db.users.some(u => u.email === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ message: 'Email already registered. Please log in.' });
      }

      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10),
        role: 'user',
        educationLevel,
        state,
        city,
        college: educationLevel === 'College' ? college : undefined,
        branch: educationLevel === 'College' ? branch : undefined,
        semester: educationLevel === 'College' ? semester : undefined,
        schoolName: educationLevel === 'School' ? schoolName : undefined,
        board: educationLevel === 'School' ? board : undefined,
        className: educationLevel === 'School' ? className : undefined,
        bookmarks: [],
        idCardUrl,
        liveSelfieUrl,
        verificationStatus,
        verificationReason: aiReason,
        createdAt: new Date(),
      };

      db.users.push(newUser);
      jsonDb.writeDb(db);

      const token = generateToken(newUser._id);
      const { password: _, ...responseUser } = newUser;

      return res.status(201).json({ token, user: responseUser });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Signup failed. Please check inputs and try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isMongoConnected()) {
      // 1. Mongoose Database Mode
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      const responseUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        educationLevel: user.educationLevel,
        college: user.college,
        branch: user.branch,
        semester: user.semester,
        schoolName: user.schoolName,
        board: user.board,
        className: user.className,
        bookmarks: user.bookmarks,
        idCardUrl: user.idCardUrl,
        liveSelfieUrl: user.liveSelfieUrl,
        verificationStatus: user.verificationStatus,
      };

      return res.status(200).json({ token, user: responseUser });
    } else {
      // 2. Local JSON DB Fallback Mode
      const db = jsonDb.readDb();
      const user = db.users.find(u => u.email === email.toLowerCase());
      
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      const { password: _, ...responseUser } = user;

      return res.status(200).json({ token, user: responseUser });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.user._id).populate('bookmarks');
      if (!user) {
        return res.status(404).json({ message: 'User session not found' });
      }
      res.status(200).json({ user });
    } else {
      const db = jsonDb.readDb();
      const user = db.users.find(u => u._id.toString() === req.user._id.toString());
      if (!user) {
        return res.status(404).json({ message: 'User session not found' });
      }

      const { password: _, ...responseUser } = user;
      
      // Populate bookmarks from JSON DB
      const populatedBookmarks = user.bookmarks.map(bId => 
        db.notes.find(n => n._id.toString() === bId.toString())
      ).filter(Boolean);
      
      responseUser.bookmarks = populatedBookmarks;
      res.status(200).json({ user: responseUser });
    }
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: 'Failed to fetch user session info.' });
  }
};

// Account verification simulation
exports.verifyAccount = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status score' });
    }

    if (isMongoConnected()) {
      const user = await User.findByIdAndUpdate(req.user._id, { verificationStatus: status }, { new: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
    } else {
      const db = jsonDb.readDb();
      const userIndex = db.users.findIndex(u => u._id.toString() === req.user._id.toString());
      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      db.users[userIndex].verificationStatus = status;
      jsonDb.writeDb(db);

      const { password: _, ...responseUser } = db.users[userIndex];
      res.status(200).json({ user: responseUser });
    }
  } catch (error) {
    console.error('VerifyAccount Error:', error);
    res.status(500).json({ message: 'Failed to simulate verification review' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (isMongoConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'No user registered with this email.' });
      }
    } else {
      const db = jsonDb.readDb();
      const user = db.users.find(u => u.email === email.toLowerCase());
      if (!user) {
        return res.status(404).json({ message: 'No user registered with this email.' });
      }
    }
    
    res.status(200).json({ message: 'Password recovery email sent successfully' });
  } catch (error) {
    console.error('ForgotPassword Error:', error);
    res.status(500).json({ message: 'Failed to send password recovery instructions.' });
  }
};

exports.resetPassword = async (req, res) => {
  res.status(200).json({ message: 'Password reset successfully' });
};

exports.googleAuth = async (req, res) => {
  try {
    const email = 'google.student@university.edu';
    
    if (isMongoConnected()) {
      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name: 'Google Student',
          email,
          password: 'google_oauth_fallback_password_12345',
          educationLevel: 'College',
          college: 'Global University',
          branch: 'Computer Science',
          semester: '5th',
          idCardUrl: '/uploads/placeholder_id.png',
          liveSelfieUrl: null,
          verificationStatus: 'Verified'
        });
      }

      const jwtToken = generateToken(user._id);
      res.status(200).json({
        token: jwtToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          educationLevel: user.educationLevel,
          college: user.college,
          branch: user.branch,
          semester: user.semester,
          schoolName: user.schoolName,
          board: user.board,
          className: user.className,
          state: user.state,
          city: user.city,
          bookmarks: user.bookmarks,
          idCardUrl: user.idCardUrl,
          liveSelfieUrl: user.liveSelfieUrl,
          verificationStatus: user.verificationStatus,
        }
      });
    } else {
      const db = jsonDb.readDb();
      let user = db.users.find(u => u.email === email);
      
      if (!user) {
        user = {
          _id: new mongoose.Types.ObjectId().toString(),
          name: 'Google Student',
          email,
          password: bcrypt.hashSync('google_oauth_fallback_password_12345', 10),
          educationLevel: 'College',
          college: 'Global University',
          branch: 'Computer Science',
          semester: '5th',
          role: 'user',
          bookmarks: [],
          idCardUrl: '/uploads/placeholder_id.png',
          liveSelfieUrl: null,
          verificationStatus: 'Verified',
          createdAt: new Date(),
        };
        db.users.push(user);
        jsonDb.writeDb(db);
      }

      const jwtToken = generateToken(user._id);
      const { password: _, ...responseUser } = user;

      res.status(200).json({
        token: jwtToken,
        user: responseUser
      });
    }
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Google Authentication failed.' });
  }
};

exports.getPublicStats = async (req, res) => {
  try {
    let totalNotes = 0;
    let totalStudents = 0;
    let totalColleges = 0;
    let totalSchools = 0;

    if (isMongoConnected()) {
      const Note = require('../models/Note');
      totalNotes = await Note.countDocuments();
      totalStudents = await User.countDocuments();
      const colleges = await User.distinct('college', { educationLevel: 'College' });
      const schools = await User.distinct('schoolName', { educationLevel: 'School' });
      
      // Filter out null/undefined/empty
      totalColleges = colleges.filter(c => c && c.trim() !== '').length;
      totalSchools = schools.filter(s => s && s.trim() !== '').length;
    } else {
      const db = jsonDb.readDb();
      totalNotes = db.notes ? db.notes.length : 0;
      totalStudents = db.users ? db.users.length : 0;
      
      const collegeSet = new Set();
      const schoolSet = new Set();
      
      if (db.users) {
        db.users.forEach(u => {
          if (u.educationLevel === 'College' && u.college && u.college.trim() !== '') {
            collegeSet.add(u.college.trim());
          }
          if (u.educationLevel === 'School' && u.schoolName && u.schoolName.trim() !== '') {
            schoolSet.add(u.schoolName.trim());
          }
        });
      }
      
      totalColleges = collegeSet.size;
      totalSchools = schoolSet.size;
    }

    res.status(200).json({
      notes: totalNotes,
      students: totalStudents,
      colleges: totalColleges,
      schools: totalSchools
    });
  } catch (error) {
    console.error('Get Public Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch public stats.' });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    if (isMongoConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      
      user.avatar = avatarUrl;
      await user.save();
      
      return res.status(200).json({ avatar: user.avatar });
    } else {
      const db = jsonDb.readDb();
      const userIndex = db.users.findIndex(u => u._id.toString() === req.user._id.toString());
      if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
      
      db.users[userIndex].avatar = avatarUrl;
      jsonDb.writeDb(db);
      
      return res.status(200).json({ avatar: avatarUrl });
    }
  } catch (error) {
    console.error('Update Avatar Error:', error);
    res.status(500).json({ message: 'Failed to update avatar' });
  }
};
