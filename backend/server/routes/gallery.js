const express = require('express');
const GalleryPhoto = require('../models/GalleryPhoto');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Gallery Routes
 * Manage gallery photos
 */

// GET /api/gallery — Public (active only)
router.get('/', async (req, res) => {
    try {
        const photos = await GalleryPhoto.find({ isActive: true })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: photos });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/gallery — Admin (all)
router.get('/admin/all', auth, async (req, res) => {
    try {
        const photos = await GalleryPhoto.find().sort({ createdAt: -1 });
        res.json({ success: true, data: photos });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/gallery — Admin
router.post('/', auth, async (req, res) => {
    try {
        const { title, imageUrl, description, category } = req.body;

        // Input validation
        if (!title || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Title and image URL are required'
            });
        }

        if (title.length > 200) {
            return res.status(400).json({
                success: false,
                message: 'Title must be less than 200 characters'
            });
        }

        const photo = await GalleryPhoto.create({ title, imageUrl, description, category });
        res.status(201).json({ success: true, data: photo });
    } catch (err) {
        console.error('Error creating gallery photo:', err.message);
        res.status(500).json({ success: false, message: 'Failed to create gallery photo' });
    }
});

// PUT /api/gallery/:id — Admin
router.put('/:id', auth, async (req, res) => {
    try {
        const photo = await GalleryPhoto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!photo) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: photo });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/gallery/:id — Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const photo = await GalleryPhoto.findByIdAndDelete(req.params.id);
        if (!photo) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
