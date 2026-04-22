const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later',
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create JWT token (24 hour expiry for production security)
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Return token
    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin._id, username: admin.username }
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-passwordHash');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    res.json({
      success: true,
      data: admin
    });
  } catch (err) {
    console.error('❌ Error fetching admin profile:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile'
    });
  }
});

// PUT /api/auth/password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    admin.passwordHash = await Admin.hashPassword(newPassword);
    await admin.save();
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (err) {
    console.error('❌ Error updating password:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update password'
    });
  }
});

module.exports = router;