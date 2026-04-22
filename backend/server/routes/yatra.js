const express = require('express');
const YatraDocument = require('../models/YatraDocument');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Yatra Routes
 * Manage Yatra documents and information
 */

// GET /api/yatra — Public (active only)
router.get('/', async (req, res) => {
    try {
        const documents = await YatraDocument.find({ isActive: true })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: documents });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/yatra — Admin (all)
router.get('/admin/all', auth, async (req, res) => {
    try {
        const documents = await YatraDocument.find().sort({ createdAt: -1 });
        res.json({ success: true, data: documents });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/yatra — Admin
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, documentUrl } = req.body;

        // Input validation
        if (!title || !documentUrl) {
            return res.status(400).json({
                success: false,
                message: 'Title and document URL are required'
            });
        }

        if (title.length > 200) {
            return res.status(400).json({
                success: false,
                message: 'Title must be less than 200 characters'
            });
        }

        if (description && description.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Description must be less than 1000 characters'
            });
        }

        const doc = await YatraDocument.create({ title, description, documentUrl });
        res.status(201).json({ success: true, data: doc });
    } catch (err) {
        console.error('Error creating yatra document:', err.message);
        res.status(500).json({ success: false, message: 'Failed to create yatra document' });
    }
});

// PUT /api/yatra/:id — Admin
router.put('/:id', auth, async (req, res) => {
    try {
        const doc = await YatraDocument.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: doc });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/yatra/:id — Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const doc = await YatraDocument.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
