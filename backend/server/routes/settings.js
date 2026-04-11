const express = require('express');
const SiteSetting = require('../models/SiteSetting');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/settings/:key — Public
router.get('/:key', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: req.params.key });
    res.json(setting || { key: req.params.key, value: '' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/settings — Admin
router.get('/', auth, async (req, res) => {
  try {
    const settings = await SiteSetting.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/settings/:key — Admin
router.put('/:key', auth, async (req, res) => {
  try {
    const setting = await SiteSetting.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
