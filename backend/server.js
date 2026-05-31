// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// ─── Critical Env Check ───────────────────────────────────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusly')
  .then(() => console.log('✅ Connected to MongoDB successfully'))
  .catch((error) => console.error('❌ MongoDB Connection Error:', error));

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many signup attempts. Please try again after 1 hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Export limiters to use in routes
app.locals.loginLimiter = loginLimiter;
app.locals.signupLimiter = signupLimiter;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(uploadsDir));

// API Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Root endpoint so visiting localhost:5000 directly doesn't show "Cannot GET /"
app.get('/', (req, res) => {
  res.send('<h1>Campusly API is Running! 🚀</h1><p>Frontend should be running on <a href="http://localhost:5173">http://localhost:5173</a></p>');
});

// Basic Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Campusly API Server is fully operational' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err.message);
  res.status(res.statusCode === 200 ? 500 : res.statusCode)
    .json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Live API Server running on port http://localhost:${PORT}`);
});
