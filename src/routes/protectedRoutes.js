const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Protected Routes - All require authentication
 */

// GET /api/protected/profile - User profile
router.get('/profile', authenticate, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/protected/dashboard - User dashboard
router.get('/dashboard', authenticate, (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Dashboard accessed successfully',
      data: {
        userId: req.user.id,
        email: req.user.email,
        role: req.user.role,
        message: `Welcome to your dashboard, ${req.user.email}!`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/protected/admin - Admin only endpoint
router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Admin panel accessed successfully',
      data: {
        userId: req.user.id,
        role: req.user.role,
        message: 'You have admin access',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/protected/analytics - Admin analytics
router.get('/analytics', authenticate, authorize(['admin']), (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Analytics data retrieved',
      data: {
        totalUsers: 100,
        activeUsers: 25,
        loginAttempts: 500,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
