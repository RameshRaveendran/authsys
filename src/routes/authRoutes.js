const express = require('express');
const { register, verifyOTP, resendOTP, login } = require('../controllers/authController');

const router = express.Router();

/**
 * Authentication Routes
 */

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/verify-otp - Verify OTP
router.post('/verify-otp', verifyOTP);

// POST /api/auth/resend-otp - Resend OTP
router.post('/resend-otp', resendOTP);

// POST /api/auth/login - Login user
router.post('/login', login);

module.exports = router;
