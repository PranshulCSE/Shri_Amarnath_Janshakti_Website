const express = require('express');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/contacts — Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!message) missingFields.push('message');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Basic phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be 10 digits'
      });
    }

    const contact = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      id: contact._id
    });
  } catch (err) {
    console.error('❌ Error creating contact:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
});

// GET /api/contacts — Admin
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Contact.countDocuments(),
    ]);

    const unreadCount = await Contact.countDocuments({ isRead: false });
    res.json({
      success: true,
      data: {
        contacts,
        total,
        unreadCount,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('❌ Error fetching contacts:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
});

// PATCH /api/contacts/:id/read — Admin
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error('❌ Error updating contact:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
});

// DELETE /api/contacts/:id — Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (err) {
    console.error('❌ Error deleting contact:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
});

module.exports = router;
