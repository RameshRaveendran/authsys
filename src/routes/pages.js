const express = require('express');
const { 
  home,
  registerPage,
  loginPage,
  verifyPage,
  dashboard,
  profile,
  forgotPasswordPage,
  resetPasswordPage,
} = require('../controllers/pagesController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Public Pages Routes
 */

// GET / - Home page
router.get('/', home);

// GET /register - Register page
router.get('/register', registerPage);

// GET /login - Login page
router.get('/login', loginPage);

// GET /verify - Verify OTP page
router.get('/verify', verifyPage);

// GET /forgot-password - Forgot password page
router.get('/forgot-password', forgotPasswordPage);

// GET /reset-password - Reset password page
router.get('/reset-password', resetPasswordPage);

/**
 * Protected Pages Routes
 */

// GET /dashboard - Dashboard (requires authentication)
router.get('/dashboard', authenticate, dashboard);

// GET /profile - Profile (requires authentication)
router.get('/profile', authenticate, profile);

module.exports = router;
