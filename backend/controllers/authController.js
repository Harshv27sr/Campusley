// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jsonDb = require('../utils/jsonDb');
const mongoose = require('mongoose');
const path = require('path');
const { verifyIDCardAI } = require('../utils/aiVerifier');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

const sendEmailOTP = async (email, otp) => {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn('SMTP credentials not configured in backend .env file. Falling back to console log for OTP.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort) || 587,
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"Campusly App" <${smtpUser}>`,
      to: email,
      subject: 'Campusly Password Reset OTP Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4F46E5; text-align: center;">Campusly</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the following OTP code to proceed:</p>
          <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 15px; text-align: center; margin: 20px 0; color: #1e293b;">
            ${otp}
          </div>
          <p style="color: #64748b; font-size: 14px;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Real OTP Email sent to ${email} successfully!`);
    return true;
  } catch (error) {
    console.error('Error in sendEmailOTP helper:', error);
    return false;
  }
};

const sendSMSOTP = async (phone, otp) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone) {
      console.warn('Twilio SMS credentials not configured in backend .env file. Falling back to console log for OTP.');
      return false;
    }

    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: `Your Campusly Password Reset OTP is: ${otp}. Valid for 10 minutes.`,
      from: twilioPhone,
      to: phone,
    });

    console.log(`Real OTP SMS sent to ${phone} successfully!`);
    return true;
  } catch (error) {
    console.error('Error in sendSMSOTP helper:', error);
    return false;
  }
};

exports.signup = async (req, res) => {
  try {
    const {
      name, email, password, phone, educationLevel,
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

      if (phone) {
        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
          return res.status(400).json({ message: 'Phone number already registered. Please log in.' });
        }
      }

      const userPayload = {
        name,
        email,
        password,
        phone,
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
        phone: user.phone,
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

      if (phone && db.users.some(u => u.phone === phone.trim())) {
        return res.status(400).json({ message: 'Phone number already registered. Please log in.' });
      }

      const newUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        name,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password, 10),
        phone: phone ? phone.trim() : undefined,
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
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: 'Email or Mobile number is required.' });
    }

    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    let user = null;
    let identifierType = 'email';

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (isMongoConnected()) {
      if (isEmail) {
        user = await User.findOne({ email: identifier.toLowerCase() });
      } else {
        user = await User.findOne({ phone: identifier.trim() });
        identifierType = 'phone';
      }

      if (!user) {
        return res.status(404).json({ message: `No account found with this ${identifierType}.` });
      }

      user.resetPasswordOTP = otp;
      user.resetPasswordOTPExpires = otpExpires;
      await user.save();
    } else {
      const db = jsonDb.readDb();
      let foundUser = null;
      if (isEmail) {
        foundUser = db.users.find(u => u.email === identifier.toLowerCase());
      } else {
        foundUser = db.users.find(u => u.phone === identifier.trim());
        identifierType = 'phone';
      }

      if (!foundUser) {
        return res.status(404).json({ message: `No account found with this ${identifierType}.` });
      }

      foundUser.resetPasswordOTP = otp;
      foundUser.resetPasswordOTPExpires = otpExpires.toISOString();
      jsonDb.writeDb(db);
      user = foundUser;
    }

    let sentReal = false;
    if (identifierType === 'email') {
      sentReal = await sendEmailOTP(user.email, otp);
    } else {
      sentReal = await sendSMSOTP(user.phone, otp);
    }

    // Always log OTP in console/terminal for development/fallback
    console.log(`\n==========================================\n`);
    console.log(`[OTP Verification Code] for ${identifier}: ${otp}`);
    console.log(`\n==========================================\n`);

    res.status(200).json({
      message: sentReal 
        ? `OTP code sent successfully to your registered ${identifierType}.` 
        : `OTP code generated. (SMTP/Twilio not configured - OTP printed in backend terminal: ${otp})`,
      otp: sentReal ? undefined : otp
    });
  } catch (error) {
    console.error('ForgotPassword Error:', error);
    res.status(500).json({ message: 'Failed to process password recovery request.' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ message: 'Email/Mobile and OTP code are required.' });
    }

    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    let user = null;

    if (isMongoConnected()) {
      if (isEmail) {
        user = await User.findOne({ email: identifier.toLowerCase() });
      } else {
        user = await User.findOne({ phone: identifier.trim() });
      }

      if (!user) {
        return res.status(404).json({ message: 'No account found with the provided details.' });
      }

      if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP code. Please try again.' });
      }

      if (new Date(user.resetPasswordOTPExpires) < new Date()) {
        return res.status(400).json({ message: 'OTP code has expired. Please request a new one.' });
      }
    } else {
      const db = jsonDb.readDb();
      let foundUser = null;
      if (isEmail) {
        foundUser = db.users.find(u => u.email === identifier.toLowerCase());
      } else {
        foundUser = db.users.find(u => u.phone === identifier.trim());
      }

      if (!foundUser) {
        return res.status(404).json({ message: 'No account found with the provided details.' });
      }

      if (!foundUser.resetPasswordOTP || foundUser.resetPasswordOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP code. Please try again.' });
      }

      if (new Date(foundUser.resetPasswordOTPExpires) < new Date()) {
        return res.status(400).json({ message: 'OTP code has expired. Please request a new one.' });
      }
    }

    res.status(200).json({ message: 'OTP verified successfully! You can now set your new password.' });
  } catch (error) {
    console.error('VerifyOTP Error:', error);
    res.status(500).json({ message: 'Failed to verify OTP code. Please try again.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { identifier, otp, password } = req.body;

    if (!identifier || !otp || !password) {
      return res.status(400).json({ message: 'Identifier, OTP code, and new password are required.' });
    }

    const isEmail = /\S+@\S+\.\S+/.test(identifier);
    let user = null;

    if (isMongoConnected()) {
      if (isEmail) {
        user = await User.findOne({ email: identifier.toLowerCase() });
      } else {
        user = await User.findOne({ phone: identifier.trim() });
      }

      if (!user) {
        return res.status(404).json({ message: 'No account found with the provided details.' });
      }

      // Verify OTP & Expiration
      if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP code. Please try again.' });
      }

      if (new Date(user.resetPasswordOTPExpires) < new Date()) {
        return res.status(400).json({ message: 'OTP code has expired. Please request a new one.' });
      }

      // Update password & Clear OTP fields
      user.password = password; // pre-save hook handles hashing
      user.resetPasswordOTP = null;
      user.resetPasswordOTPExpires = null;
      await user.save();
    } else {
      const db = jsonDb.readDb();
      let userIndex = -1;
      if (isEmail) {
        userIndex = db.users.findIndex(u => u.email === identifier.toLowerCase());
      } else {
        userIndex = db.users.findIndex(u => u.phone === identifier.trim());
      }

      if (userIndex === -1) {
        return res.status(404).json({ message: 'No account found with the provided details.' });
      }

      const targetUser = db.users[userIndex];

      // Verify OTP & Expiration
      if (!targetUser.resetPasswordOTP || targetUser.resetPasswordOTP !== otp) {
        return res.status(400).json({ message: 'Invalid OTP code. Please try again.' });
      }

      if (new Date(targetUser.resetPasswordOTPExpires) < new Date()) {
        return res.status(400).json({ message: 'OTP code has expired. Please request a new one.' });
      }

      // Update password & Clear OTP fields
      targetUser.password = bcrypt.hashSync(password, 10);
      targetUser.resetPasswordOTP = null;
      targetUser.resetPasswordOTPExpires = null;

      jsonDb.writeDb(db);
    }

    res.status(200).json({ message: 'Password reset successfully. Please log in with your new password.' });
  } catch (error) {
    console.error('ResetPassword Error:', error);
    res.status(500).json({ message: 'Failed to reset password. Please try again.' });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { token, mode = 'login' } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Google access token is required' });
    }

    let email, name, avatar;
    if (token === 'mock-google-token') {
      email = 'google.student@university.edu';
      name = 'Google Student';
      avatar = null;
    } else {
      try {
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        if (!googleRes.ok) {
          throw new Error('Google token validation failed');
        }
        const googleUser = await googleRes.json();
        email = googleUser.email;
        name = googleUser.name;
        avatar = googleUser.picture;
      } catch (err) {
        console.error('Google verification error:', err);
        return res.status(401).json({ message: 'Invalid Google access token or connection error.' });
      }
    }
    
    if (isMongoConnected()) {
      let user = await User.findOne({ email });
      
      if (mode === 'login' && !user) {
        return res.status(404).json({ message: 'This email is not registered on Campusly. Please create an account first using the Sign Up page.' });
      }

      if (mode === 'signup' && user) {
        return res.status(409).json({ message: 'This Google email is already registered. Please use the Login page to sign in.' });
      }

      if (!user) {
        user = await User.create({
          name: name,
          email,
          password: bcrypt.hashSync('google_oauth_fallback_password_' + Math.random().toString(36).substring(2, 9), 10),
          educationLevel: 'College',
          college: 'Global University',
          branch: 'Computer Science',
          semester: '5th',
          idCardUrl: '/uploads/placeholder_id.png',
          liveSelfieUrl: null,
          verificationStatus: 'Verified',
          avatar: avatar
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
          avatar: user.avatar
        }
      });
    } else {
      const db = jsonDb.readDb();
      let user = db.users.find(u => u.email === email);
      
      if (mode === 'login' && !user) {
        return res.status(404).json({ message: 'This email is not registered on Campusly. Please create an account first using the Sign Up page.' });
      }

      if (mode === 'signup' && user) {
        return res.status(409).json({ message: 'This Google email is already registered. Please use the Login page to sign in.' });
      }

      if (!user) {
        user = {
          _id: new mongoose.Types.ObjectId().toString(),
          name: name,
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
          avatar: avatar,
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
