require('dotenv').config();
const express = require("express");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const pagesRoutes = require('./routes/pages');
const { errorHandler } = require('./middleware/errorMiddleware');
const { requestLogger } = require('./utils/logger');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rate limiting middleware
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit 5 login attempts per minute
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit 100 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet()); // Security headers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Static files
app.use(generalLimiter); // Apply general rate limiter to all routes
app.use(requestLogger); // Logging middleware

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.render('index', { title: 'Auth System' });
});

// Page routes
app.use('/', pagesRoutes);

// API Routes
app.use('/api/auth', (req, res, next) => {
  // Apply login limiter to login endpoint
  if (req.path === '/login' || req.path === '/forgot-password') {
    loginLimiter(req, res, next);
  } else {
    next();
  }
}, authRoutes);
app.use('/api/protected', protectedRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});