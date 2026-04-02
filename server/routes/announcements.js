const express = require('express');
const Announcement = require('../models/Announcement');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Announcements Routes
 * Manage announcements and notifications
 */

// GET /api/announcements — Public (active only)
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: announcements });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/announcements — Admin (all)
router.get('/admin/all', auth, async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json({ success: true, data: announcements });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/announcements — Admin
router.post('/', auth, async (req, res) => {
    try {
        const { title, message, type } = req.body;
        const announcement = await Announcement.create({ title, message, type });
        res.status(201).json({ success: true, data: announcement });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/announcements/:id — Admin
router.put('/:id', auth, async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!announcement) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: announcement });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/announcements/:id — Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
