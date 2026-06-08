// backend/scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Note = require('../models/Note');
const jsonDb = require('../utils/jsonDb');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper to write dummy document placeholders
const createMockFile = (filename, content) => {
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, content);
  console.log(`Created mock file: ${filename}`);
};

const seedJson = async () => {
  try {
    console.log('⚠️ MongoDB offline. Seeding local JSON database...');
    const db = {
      users: [],
      notes: []
    };

    // Seed Users
    const collegeStudent = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Rohan Verma',
      email: 'college.student@university.edu',
      password: bcrypt.hashSync('password123', 10),
      educationLevel: 'College',
      college: 'Delhi Technological University',
      branch: 'Computer Science',
      semester: '5th',
      role: 'user',
      bookmarks: [],
      idCardUrl: '/uploads/placeholder_id.png',
      verificationStatus: 'Verified',
      createdAt: new Date()
    };

    const schoolStudent = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Aditi Sharma',
      email: 'school.student@university.edu',
      password: bcrypt.hashSync('password123', 10),
      educationLevel: 'School',
      schoolName: 'St. Xavier High School',
      board: 'CBSE',
      className: 'Class 10',
      role: 'user',
      bookmarks: [],
      idCardUrl: '/uploads/placeholder_id.png',
      verificationStatus: 'Verified',
      createdAt: new Date()
    };

    const adminUser = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: 'Campusley Administrator',
      email: 'admin@campusley.com',
      password: bcrypt.hashSync('password123', 10),
      educationLevel: 'College',
      college: 'System Operations Group',
      branch: 'Infrastructure',
      semester: 'N/A',
      role: 'admin',
      bookmarks: [],
      idCardUrl: '/uploads/placeholder_id.png',
      verificationStatus: 'Verified',
      createdAt: new Date()
    };

    db.users.push(collegeStudent, schoolStudent, adminUser);

    // Seed Notes
    const note1 = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: 'Database Management Systems Complete Notes',
      description: 'Comprehensive hand-written notes covering ER diagrams, Normalization, SQL queries, indexing, and transaction management. Highly useful for end-sem preparations.',
      fileUrl: '/uploads/dbms_notes.pdf',
      fileSize: 4520900,
      fileType: 'PDF',
      uploader: collegeStudent._id,
      downloadsCount: 154,
      likes: [schoolStudent._id, adminUser._id],
      ratings: [
        { user: schoolStudent._id, rating: 5 },
        { user: adminUser._id, rating: 4 }
      ],
      averageRating: 4.5,
      comments: [
        { user: schoolStudent._id, content: 'These notes are absolutely beautiful! Helped me clear all queries regarding normalization.', createdAt: new Date() },
        { user: adminUser._id, content: 'Excellent handwriting and very well structured index.', createdAt: new Date() }
      ],
      isPYQ: false,
      college: 'Delhi Technological University',
      branch: 'Computer Science',
      semester: '5th Semester',
      createdAt: new Date()
    };

    const note2 = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: 'Operating Systems Mid-Sem Exam Paper 2025',
      description: 'Previous year mid-semester exam paper covering CPU Scheduling, Process Synchronization, Semaphores, and Deadlock Avoidance questions.',
      fileUrl: '/uploads/os_paper_2025.pdf',
      fileSize: 1048500,
      fileType: 'PDF',
      uploader: collegeStudent._id,
      downloadsCount: 320,
      likes: [adminUser._id],
      ratings: [{ user: adminUser._id, rating: 5 }],
      averageRating: 5,
      comments: [{ user: adminUser._id, content: 'Perfect photocopy. Exactly matches the questions set in the 2025 exam.', createdAt: new Date() }],
      isPYQ: true,
      pyqType: 'Mid-Sem',
      college: 'Delhi Technological University',
      branch: 'Computer Science',
      semester: '5th Semester',
      createdAt: new Date()
    };

    const note3 = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: 'Electrostatics Complete Chapter Revision Notes',
      description: 'Hand-written board-focused revision notes for Class 12 Physics Chapter 1 Electrostatics. Covers Coulombs law, Gauss theorem derivation, and capacitor formulas.',
      fileUrl: '/uploads/electrostatics_class12.pdf',
      fileSize: 3120500,
      fileType: 'PDF',
      uploader: schoolStudent._id,
      downloadsCount: 95,
      likes: [collegeStudent._id],
      ratings: [{ user: collegeStudent._id, rating: 4 }],
      averageRating: 4,
      comments: [{ user: collegeStudent._id, content: 'Formula cheatsheets at the end are extremely high quality!', createdAt: new Date() }],
      isPYQ: false,
      schoolName: 'St. Xavier High School',
      board: 'CBSE',
      className: 'Class 12',
      createdAt: new Date()
    };

    const note4 = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: 'Quadratic Equations Board Exam Prep Sheets',
      description: 'Formula revision cheatsheet, quadratic formula derivations, and top 20 repeating CBSE Board exam questions for Class 10 Maths.',
      fileUrl: '/uploads/maths_quadratics_class10.pdf',
      fileSize: 1540800,
      fileType: 'PDF',
      uploader: schoolStudent._id,
      downloadsCount: 215,
      likes: [],
      ratings: [],
      averageRating: 0,
      comments: [],
      isPYQ: false,
      schoolName: 'St. Xavier High School',
      board: 'CBSE',
      className: 'Class 10',
      createdAt: new Date()
    };

    const note5 = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: 'Organic Chemistry Important Reaction Mechanisms',
      description: 'MP Board Class 12 chemistry cheatsheet covering Aldol Condensation, Cannizzaro Reaction, and Sandmeyer Mechanism with step-by-step conversions.',
      fileUrl: '/uploads/organic_chemistry_mpboard.docx',
      fileSize: 2048500,
      fileType: 'DOCX',
      uploader: schoolStudent._id,
      downloadsCount: 64,
      likes: [],
      ratings: [],
      averageRating: 0,
      comments: [],
      isPYQ: false,
      schoolName: 'St. Xavier High School',
      board: 'MP Board',
      className: 'Class 12',
      createdAt: new Date()
    };

    db.notes.push(note1, note2, note3, note4, note5);
    jsonDb.writeDb(db);

    console.log('🎉 Seeded local JSON database successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ JSON Seeding failed:', err);
    process.exit(1);
  }
};

const seed = async () => {
  // Create mock document placeholders
  createMockFile('dbms_notes.pdf', 'Campusley PDF Content - Database Management Systems Comprehensive Notes');
  createMockFile('electrostatics_class12.pdf', 'Campusley PDF Content - CBSE Class 12 Physics Electrostatics Notes');
  createMockFile('os_paper_2025.pdf', 'Campusley PDF Content - Mid-Sem Exam Paper for Operating Systems (2025)');
  createMockFile('maths_quadratics_class10.pdf', 'Campusley PDF Content - Class 10 Quadratic Equations Revision Guide');
  createMockFile('organic_chemistry_mpboard.docx', 'Campusley Word Content - MP Board Organic Chemistry Reactions Sheet');

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusley', {
      serverSelectionTimeoutMS: 2000 // Time out quickly if local MongoDB daemon is offline
    });
    console.log('✅ Connected to MongoDB database for seeding...');

    // 1. Clear database
    await User.deleteMany({});
    await Note.deleteMany({});
    console.log('🗑️  Cleared old MongoDB collections.');

    // 2. Seed Users
    const collegeStudent = await User.create({
      name: 'Rohan Verma',
      email: 'college.student@university.edu',
      password: 'password123',
      educationLevel: 'College',
      college: 'Delhi Technological University',
      branch: 'Computer Science',
      semester: '5th',
      idCardUrl: '/uploads/placeholder_id.png',
      verificationStatus: 'Verified'
    });

    const schoolStudent = await User.create({
      name: 'Aditi Sharma',
      email: 'school.student@university.edu',
      password: 'password123',
      educationLevel: 'School',
      schoolName: 'St. Xavier High School',
      board: 'CBSE',
      className: 'Class 10',
      idCardUrl: '/uploads/placeholder_id.png',
      verificationStatus: 'Verified'
    });

    const adminUser = await User.create({
      name: 'Campusley Administrator',
      email: 'admin@campusley.com',
      password: 'password123',
      educationLevel: 'College',
      college: 'System Operations Group',
      branch: 'Infrastructure',
      semester: 'N/A',
      role: 'admin',
      idCardUrl: '/uploads/placeholder_id.png',
      verificationStatus: 'Verified'
    });

    console.log('👥 Seeded college, school, and administrator accounts to MongoDB.');

    // 3. Seed College Notes & PYQs
    const note1 = await Note.create({
      title: 'Database Management Systems Complete Notes',
      description: 'Comprehensive hand-written notes covering ER diagrams, Normalization, SQL queries, indexing, and transaction management. Highly useful for end-sem preparations.',
      fileUrl: '/uploads/dbms_notes.pdf',
      fileSize: 4520900,
      fileType: 'PDF',
      uploader: collegeStudent._id,
      downloadsCount: 154,
      college: 'Delhi Technological University',
      branch: 'Computer Science',
      semester: '5th Semester',
    });

    const note2 = await Note.create({
      title: 'Operating Systems Mid-Sem Exam Paper 2025',
      description: 'Previous year mid-semester exam paper covering CPU Scheduling, Process Synchronization, Semaphores, and Deadlock Avoidance questions.',
      fileUrl: '/uploads/os_paper_2025.pdf',
      fileSize: 1048500,
      fileType: 'PDF',
      uploader: collegeStudent._id,
      downloadsCount: 320,
      isPYQ: true,
      pyqType: 'Mid-Sem',
      college: 'Delhi Technological University',
      branch: 'Computer Science',
      semester: '5th Semester',
    });

    // 4. Seed School Notes & PYQs
    const note3 = await Note.create({
      title: 'Electrostatics Complete Chapter Revision Notes',
      description: 'Hand-written board-focused revision notes for Class 12 Physics Chapter 1 Electrostatics. Covers Coulombs law, Gauss theorem derivation, and capacitor formulas.',
      fileUrl: '/uploads/electrostatics_class12.pdf',
      fileSize: 3120500,
      fileType: 'PDF',
      uploader: schoolStudent._id,
      downloadsCount: 95,
      schoolName: 'St. Xavier High School',
      board: 'CBSE',
      className: 'Class 12',
    });

    const note4 = await Note.create({
      title: 'Quadratic Equations Board Exam Prep Sheets',
      description: 'Formula revision cheatsheet, quadratic formula derivations, and top 20 repeating CBSE Board exam questions for Class 10 Maths.',
      fileUrl: '/uploads/maths_quadratics_class10.pdf',
      fileSize: 1540800,
      fileType: 'PDF',
      uploader: schoolStudent._id,
      downloadsCount: 215,
      schoolName: 'St. Xavier High School',
      board: 'CBSE',
      className: 'Class 10',
    });

    const note5 = await Note.create({
      title: 'Organic Chemistry Important Reaction Mechanisms',
      description: 'MP Board Class 12 chemistry cheatsheet covering Aldol Condensation, Cannizzaro Reaction, and Sandmeyer Mechanism with step-by-step conversions.',
      fileUrl: '/uploads/organic_chemistry_mpboard.docx',
      fileSize: 2048500,
      fileType: 'DOCX',
      uploader: schoolStudent._id,
      downloadsCount: 64,
      schoolName: 'St. Xavier High School',
      board: 'MP Board',
      className: 'Class 12',
    });

    console.log('📚 Seeded school and college study notes, cheatsheets, and papers to MongoDB.');

    // 5. Seed Interactions
    note1.likes.push(schoolStudent._id, adminUser._id);
    note1.ratings.push({ user: schoolStudent._id, rating: 5 }, { user: adminUser._id, rating: 4 });
    note1.comments.push(
      { user: schoolStudent._id, content: 'These notes are absolutely beautiful! Helped me clear normalization.' },
      { user: adminUser._id, content: 'Excellent handwriting and structural organization.' }
    );
    await note1.save();

    note2.likes.push(adminUser._id);
    note2.ratings.push({ user: adminUser._id, rating: 5 });
    note2.comments.push({ user: adminUser._id, content: 'Perfect photocopy. Exactly matches the 2025 mid-sem questions.' });
    await note2.save();

    note3.likes.push(collegeStudent._id);
    note3.ratings.push({ user: collegeStudent._id, rating: 4 });
    note3.comments.push({ user: collegeStudent._id, content: 'Super helpful capacitor cheatsheets at the end!' });
    await note3.save();

    console.log('💬 Seeded user likes, ratings, and comments to MongoDB.');
    console.log('🎉 Seeding successfully finished!');
    process.exit(0);
  } catch (error) {
    console.warn('⚠️ Mongoose DB seeding failed. Falling back to local JSON database...');
    await seedJson();
  }
};

seed();
