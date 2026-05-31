// backend/controllers/notesController.js
const Note = require('../models/Note');
const User = require('../models/User');
const jsonDb = require('../utils/jsonDb');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const isMongoConnected = () => mongoose.connection.readyState === 1;

exports.getNotes = async (req, res) => {
  try {
    const { branch, semester, college, schoolName, board, className, isPYQ, pyqType, search, limit, educationLevel, subject } = req.query;

    if (isMongoConnected()) {
      // 1. MongoDB Mongoose Mode
      const query = {};
      // Filter by education level: College notes have 'college' field, School notes have 'schoolName' field
      if (educationLevel === 'College') {
        query.college = { $exists: true, $ne: null };
      } else if (educationLevel === 'School') {
        query.schoolName = { $exists: true, $ne: null };
      }
      if (branch) query.branch = branch;
      if (semester) query.semester = semester;
      if (college) query.college = new RegExp(college, 'i');
      if (schoolName) query.schoolName = new RegExp(schoolName, 'i');
      if (board) query.board = board;
      if (className) query.className = className;
      if (isPYQ) query.isPYQ = isPYQ === 'true';
      if (pyqType) query.pyqType = pyqType;
      if (subject) query.subject = new RegExp(subject, 'i');

      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
        ];
      }

      let notesQuery = Note.find(query)
        .populate('uploader', 'name email role')
        .sort({ createdAt: -1 });

      if (limit) {
        notesQuery = notesQuery.limit(parseInt(limit));
      }

      const notes = await notesQuery;
      res.status(200).json(notes);
    } else {
      // 2. Local JSON DB Fallback Mode
      const db = jsonDb.readDb();
      let filtered = [...db.notes];

      // Filter by education level using presence of college vs schoolName field
      if (educationLevel === 'College') {
        filtered = filtered.filter(n => n.college != null && n.college !== '');
      } else if (educationLevel === 'School') {
        filtered = filtered.filter(n => n.schoolName != null && n.schoolName !== '');
      }

      if (branch) filtered = filtered.filter(n => n.branch === branch);
      if (semester) filtered = filtered.filter(n => n.semester === semester);
      if (college) filtered = filtered.filter(n => n.college && new RegExp(college, 'i').test(n.college));
      if (schoolName) filtered = filtered.filter(n => n.schoolName && new RegExp(schoolName, 'i').test(n.schoolName));
      if (board) filtered = filtered.filter(n => n.board === board);
      if (className) filtered = filtered.filter(n => n.className === className);
      if (isPYQ) filtered = filtered.filter(n => n.isPYQ === (isPYQ === 'true'));
      if (pyqType) filtered = filtered.filter(n => n.pyqType === pyqType);
      if (subject) { const rx = new RegExp(subject, 'i'); filtered = filtered.filter(n => rx.test(n.subject || '')); }

      if (search) {
        const regex = new RegExp(search, 'i');
        filtered = filtered.filter(n => regex.test(n.title) || regex.test(n.description));
      }

      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Populate uploader
      const populated = filtered.map(n => {
        const uploader = db.users.find(u => u._id.toString() === n.uploader.toString());
        return {
          ...n,
          uploader: uploader ? { _id: uploader._id, name: uploader.name, email: uploader.email, role: uploader.role } : null
        };
      });

      if (limit) {
        return res.status(200).json(populated.slice(0, parseInt(limit)));
      }
      res.status(200).json(populated);
    }
  } catch (error) {
    console.error('GetNotes Error:', error);
    res.status(500).json({ message: 'Failed to fetch academic notes.' });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const note = await Note.findById(req.params.id)
        .populate('uploader', 'name email college schoolName')
        .populate('comments.user', 'name role')
        .populate('ratings.user', 'name');

      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.status(200).json(note);
    } else {
      const db = jsonDb.readDb();
      const note = db.notes.find(n => n._id.toString() === req.params.id.toString());
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const uploader = db.users.find(u => u._id.toString() === note.uploader.toString());
      const populatedComments = note.comments.map(c => {
        const u = db.users.find(user => user._id.toString() === c.user.toString());
        return { ...c, user: u ? { _id: u._id, name: u.name, role: u.role } : null };
      });
      const populatedRatings = note.ratings.map(r => {
        const u = db.users.find(user => user._id.toString() === r.user.toString());
        return { ...r, user: u ? { _id: u._id, name: u.name } : null };
      });

      const populated = {
        ...note,
        uploader: uploader ? { _id: uploader._id, name: uploader.name, email: uploader.email, college: uploader.college, schoolName: uploader.schoolName } : null,
        comments: populatedComments,
        ratings: populatedRatings
      };

      res.status(200).json(populated);
    }
  } catch (error) {
    console.error('GetNoteById Error:', error);
    res.status(500).json({ message: 'Failed to fetch note details.' });
  }
};

exports.uploadNote = async (req, res) => {
  try {
    const {
      title, description, isPYQ, pyqType,
      college, branch, semester,
      schoolName, board, className
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Document file is required' });
    }

    if (isMongoConnected()) {
      const notePayload = {
        title,
        description,
        fileUrl: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        fileType: path.extname(req.file.originalname).substring(1).toUpperCase() || 'PDF',
        uploader: req.user._id,
        isPYQ: isPYQ === 'true',
      };

      if (isPYQ === 'true') {
        notePayload.pyqType = pyqType;
      }

      if (req.user.educationLevel === 'College') {
        notePayload.college = college || req.user.college;
        notePayload.branch = branch || req.user.branch;
        notePayload.semester = semester || req.user.semester;
      } else {
        notePayload.schoolName = schoolName || req.user.schoolName;
        notePayload.board = board || req.user.board;
        notePayload.className = className || req.user.className;
      }

      const note = await Note.create(notePayload);
      const populated = await Note.findById(note._id).populate('uploader', 'name email');
      res.status(201).json(populated);
    } else {
      const db = jsonDb.readDb();

      const notePayload = {
        _id: new mongoose.Types.ObjectId().toString(),
        title,
        description,
        fileUrl: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        fileType: path.extname(req.file.originalname).substring(1).toUpperCase() || 'PDF',
        uploader: req.user._id.toString(),
        downloadsCount: 0,
        likes: [],
        ratings: [],
        averageRating: 0,
        comments: [],
        isPYQ: isPYQ === 'true',
        createdAt: new Date(),
      };

      if (isPYQ === 'true') {
        notePayload.pyqType = pyqType;
      }

      if (req.user.educationLevel === 'College') {
        notePayload.college = college || req.user.college;
        notePayload.branch = branch || req.user.branch;
        notePayload.semester = semester || req.user.semester;
      } else {
        notePayload.schoolName = schoolName || req.user.schoolName;
        notePayload.board = board || req.user.board;
        notePayload.className = className || req.user.className;
      }

      db.notes.push(notePayload);
      jsonDb.writeDb(db);

      const populated = {
        ...notePayload,
        uploader: { _id: req.user._id, name: req.user.name, email: req.user.email }
      };

      res.status(201).json(populated);
    }
  } catch (error) {
    console.error('UploadNote Error:', error);
    res.status(500).json({ message: 'Failed to upload note. Please try again.' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    if (isMongoConnected()) {
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      if (note.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to modify this document' });
      }

      note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(note);
    } else {
      const db = jsonDb.readDb();
      const noteIndex = db.notes.findIndex(n => n._id.toString() === req.params.id.toString());
      if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const note = db.notes[noteIndex];
      if (note.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to modify this document' });
      }

      const updated = { ...note, ...req.body };
      db.notes[noteIndex] = updated;
      jsonDb.writeDb(db);
      res.status(200).json(updated);
    }
  } catch (error) {
    console.error('UpdateNote Error:', error);
    res.status(500).json({ message: 'Failed to update note.' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      if (note.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this document' });
      }

      const filePath = path.join(__dirname, '..', note.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await Note.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Document deleted successfully' });
    } else {
      const db = jsonDb.readDb();
      const noteIndex = db.notes.findIndex(n => n._id.toString() === req.params.id.toString());
      if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const note = db.notes[noteIndex];
      if (note.uploader.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this document' });
      }

      const filePath = path.join(__dirname, '..', note.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      db.notes.splice(noteIndex, 1);
      jsonDb.writeDb(db);
      res.status(200).json({ message: 'Document deleted successfully' });
    }
  } catch (error) {
    console.error('DeleteNote Error:', error);
    res.status(500).json({ message: 'Failed to delete note.' });
  }
};

exports.downloadNote = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      note.downloadsCount += 1;
      await note.save();
      res.status(200).json({ downloadUrl: note.fileUrl, message: 'Download registered successfully' });
    } else {
      const db = jsonDb.readDb();
      const note = db.notes.find(n => n._id.toString() === req.params.id.toString());
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      note.downloadsCount = (note.downloadsCount || 0) + 1;
      jsonDb.writeDb(db);
      res.status(200).json({ downloadUrl: note.fileUrl, message: 'Download registered successfully' });
    }
  } catch (error) {
    console.error('DownloadNote Error:', error);
    res.status(500).json({ message: 'Download failed' });
  }
};

exports.likeNote = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const likeIndex = note.likes.indexOf(req.user._id);
      if (likeIndex > -1) {
        note.likes.splice(likeIndex, 1);
      } else {
        note.likes.push(req.user._id);
      }

      await note.save();
      res.status(200).json(note);
    } else {
      const db = jsonDb.readDb();
      const note = db.notes.find(n => n._id.toString() === req.params.id.toString());
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const uId = req.user._id.toString();
      const likeIndex = note.likes.indexOf(uId);
      if (likeIndex > -1) {
        note.likes.splice(likeIndex, 1);
      } else {
        note.likes.push(uId);
      }

      jsonDb.writeDb(db);
      res.status(200).json(note);
    }
  } catch (error) {
    console.error('LikeNote Error:', error);
    res.status(500).json({ message: 'Failed to toggle like.' });
  }
};

exports.rateNote = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating score. Must be 1-5' });
    }

    if (isMongoConnected()) {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const ratingIndex = note.ratings.findIndex(r => r.user.toString() === req.user._id.toString());
      if (ratingIndex > -1) {
        note.ratings[ratingIndex].rating = rating;
      } else {
        note.ratings.push({ user: req.user._id, rating });
      }

      await note.save();
      res.status(200).json(note);
    } else {
      const db = jsonDb.readDb();
      const note = db.notes.find(n => n._id.toString() === req.params.id.toString());
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const uId = req.user._id.toString();
      const ratingIndex = note.ratings.findIndex(r => r.user.toString() === uId);
      if (ratingIndex > -1) {
        note.ratings[ratingIndex].rating = rating;
      } else {
        note.ratings.push({ user: uId, rating });
      }

      const sum = note.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      note.averageRating = Math.round((sum / note.ratings.length) * 10) / 10;

      jsonDb.writeDb(db);
      res.status(200).json(note);
    }
  } catch (error) {
    console.error('RateNote Error:', error);
    res.status(500).json({ message: 'Failed to submit rating.' });
  }
};

exports.commentNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    if (isMongoConnected()) {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      note.comments.push({ user: req.user._id, content });
      await note.save();
      
      const populated = await Note.findById(note._id).populate('comments.user', 'name role');
      res.status(200).json(populated.comments[populated.comments.length - 1]);
    } else {
      const db = jsonDb.readDb();
      const note = db.notes.find(n => n._id.toString() === req.params.id.toString());
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const newComment = {
        _id: new mongoose.Types.ObjectId().toString(),
        user: req.user._id.toString(),
        content,
        createdAt: new Date(),
      };

      note.comments.push(newComment);
      jsonDb.writeDb(db);

      const responseComment = {
        ...newComment,
        user: { _id: req.user._id, name: req.user.name, role: req.user.role }
      };

      res.status(200).json(responseComment);
    }
  } catch (error) {
    console.error('CommentNote Error:', error);
    res.status(500).json({ message: 'Failed to post comment.' });
  }
};

exports.getComments = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const note = await Note.findById(req.params.id).populate('comments.user', 'name role');
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      res.status(200).json(note.comments);
    } else {
      const db = jsonDb.readDb();
      const note = db.notes.find(n => n._id.toString() === req.params.id.toString());
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      const populated = note.comments.map(c => {
        const u = db.users.find(user => user._id.toString() === c.user.toString());
        return { ...c, user: u ? { _id: u._id, name: u.name, role: u.role } : null };
      });

      res.status(200).json(populated);
    }
  } catch (error) {
    console.error('GetComments Error:', error);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
};

exports.reportNote = async (req, res) => {
  res.status(200).json({ message: 'Document reported successfully to admins' });
};

exports.getTrendingNotes = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const notes = await Note.find({})
        .populate('uploader', 'name email college schoolName')
        .sort({ downloadsCount: -1, averageRating: -1 })
        .limit(6);
      res.status(200).json(notes);
    } else {
      const db = jsonDb.readDb();
      const notes = [...db.notes];
      
      notes.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));

      const populated = notes.slice(0, 6).map(n => {
        const uploader = db.users.find(u => u._id.toString() === n.uploader.toString());
        return {
          ...n,
          uploader: uploader ? { _id: uploader._id, name: uploader.name, email: uploader.email, college: uploader.college, schoolName: uploader.schoolName } : null
        };
      });

      res.status(200).json(populated);
    }
  } catch (error) {
    console.error('GetTrendingNotes Error:', error);
    res.status(500).json({ message: 'Failed to fetch trending notes.' });
  }
};

exports.getPreviousYearPapers = async (req, res) => {
  try {
    const { branch, semester, college, board, className, pyqType, search } = req.query;

    if (isMongoConnected()) {
      const query = { isPYQ: true };
      if (branch) query.branch = branch;
      if (semester) query.semester = semester;
      if (college) query.college = new RegExp(college, 'i');
      if (board) query.board = board;
      if (className) query.className = className;
      if (pyqType) query.pyqType = pyqType;

      if (search) {
        query.$or = [
          { title: new RegExp(search, 'i') },
          { description: new RegExp(search, 'i') },
        ];
      }

      const papers = await Note.find(query)
        .populate('uploader', 'name email role')
        .sort({ createdAt: -1 });

      res.status(200).json(papers);
    } else {
      const db = jsonDb.readDb();
      let filtered = db.notes.filter(n => n.isPYQ === true);

      if (branch) filtered = filtered.filter(n => n.branch === branch);
      if (semester) filtered = filtered.filter(n => n.semester === semester);
      if (college) filtered = filtered.filter(n => n.college && new RegExp(college, 'i').test(n.college));
      if (board) filtered = filtered.filter(n => n.board === board);
      if (className) filtered = filtered.filter(n => n.className === className);
      if (pyqType) filtered = filtered.filter(n => n.pyqType === pyqType);

      if (search) {
        const regex = new RegExp(search, 'i');
        filtered = filtered.filter(n => regex.test(n.title) || regex.test(n.description));
      }

      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const populated = filtered.map(n => {
        const uploader = db.users.find(u => u._id.toString() === n.uploader.toString());
        return {
          ...n,
          uploader: uploader ? { _id: uploader._id, name: uploader.name, email: uploader.email, role: uploader.role } : null
        };
      });

      res.status(200).json(populated);
    }
  } catch (error) {
    console.error('GetPreviousYearPapers Error:', error);
    res.status(500).json({ message: 'Failed to fetch PYQ papers.' });
  }
};
