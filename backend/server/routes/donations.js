const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const DonationController = require('../controllers/DonationController');
const {
  validateCreateDonation,
  validateVerifyDonation,
  validateGetDonations,
} = require('../validations/DonationValidator'); // ✅ correct import

const auth = require('../middleware/auth');

// ================= MULTER CONFIG =================
const uploadDir = path.join(__dirname, '../uploads/donation-screenshots');

// create folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.random().toString(36).substring(2, 9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// file filter
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG files allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

// ================= ROUTES =================


// STATS
router.get('/stats', auth, DonationController.getDonationStats);

// PENDING
router.get(
  '/pending',
  auth,
  validateGetDonations,
  DonationController.getPendingDonations
);

// VERIFIED
router.get(
  '/verified',
  auth,
  validateGetDonations,
  DonationController.getVerifiedDonations
);


// BY PHONE
router.get('/by-phone/:phone', auth, DonationController.getDonationsByPhone);


// ✅ CREATE DONATION (FIXED)
router.post(
  '/',
  (req, res, next) => {
    upload.single('screenshot')(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
        });
      }
      next();
    });
  },
  validateCreateDonation,
  DonationController.createDonation
);

// ✅ GENERIC ROUTES LAST
router.get(
  '/',
  auth,
  validateGetDonations,
  DonationController.getAllDonations
);

// SINGLE
router.get('/:id', DonationController.getDonationById);

// VERIFY
router.put(
  '/:id/verify',
  auth,
  validateVerifyDonation,
  DonationController.verifyDonation
);

module.exports = router;