const express = require('express');
const SiteSetting = require('../models/SiteSetting');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/settings/:key — Public
router.get('/:key', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: req.params.key });
    res.json({
      success: true,
      data: setting || { key: req.params.key, value: '' }
    });
  } catch (err) {
    console.error('Error fetching setting:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch setting'
    });
  }
});

// GET /api/settings — Admin
router.get('/', auth, async (req, res) => {
  try {
    const settings = await SiteSetting.find();
    res.json({
      success: true,
      data: settings
    });
  } catch (err) {
    console.error('Error fetching settings:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// PUT /api/settings/:key — Admin
router.put('/:key', auth, async (req, res) => {
  try {
    // Validate input
    if (!req.body.value) {
      return res.status(400).json({
        success: false,
        message: 'Value is required'
      });
    }

    const setting = await SiteSetting.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json({
      success: true,
      data: setting
    });
  } catch (err) {
    console.error('Error updating setting:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update setting'
    });
  }
});

module.exports = router;
