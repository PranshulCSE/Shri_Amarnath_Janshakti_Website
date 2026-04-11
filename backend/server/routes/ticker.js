const express = require('express');
const Ticker = require('../models/Ticker');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * Ticker Routes
 * Manage ticker messages
 */

// GET /api/ticker — Public (active only)
router.get('/', async (req, res) => {
    try {
        const tickers = await Ticker.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: tickers });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/ticker — Admin (all)
router.get('/admin/all', auth, async (req, res) => {
    try {
        const tickers = await Ticker.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: tickers });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/ticker — Admin
router.post('/', auth, async (req, res) => {
    try {
        const { text, order } = req.body;
        const ticker = await Ticker.create({ text, order });
        res.status(201).json({ success: true, data: ticker });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/ticker/:id — Admin
router.put('/:id', auth, async (req, res) => {
    try {
        const ticker = await Ticker.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!ticker) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: ticker });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/ticker/:id — Admin
router.delete('/:id', auth, async (req, res) => {
    try {
        const ticker = await Ticker.findByIdAndDelete(req.params.id);
        if (!ticker) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
