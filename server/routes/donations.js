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
} = require('../validations/DonationValidator');
const auth = require('../middleware/auth');

/**
 * Donation Routes
 * UPI Payment Processing & Verification System
 * SECURITY: No DELETE operation for donations (immutable records)
 */

// ============= MULTER FILE UPLOAD CONFIGURATION =============
const donationUploadDir = path.join(__dirname, '../uploads/donation-screenshots');

// Ensure upload directory exists
if (!fs.existsSync(donationUploadDir)) {
  fs.mkdirSync(donationUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, donationUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter: only allow JPG and PNG
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max
  },
});

// ============= MIDDLEWARE ERROR HANDLER =============
/**
 * Wrapper for multer to properly handle errors
 * Ensures validation middleware is only called if file upload succeeds
 */
const handleMulterUpload = (req, res, next) => {
  upload.single('screenshot')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size must not exceed 2MB',
          error: 'LIMIT_FILE_SIZE',
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Only one file is allowed',
          error: 'LIMIT_FILE_COUNT',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
        error: 'MULTER_ERROR',
      });
    } else if (err) {
      // Custom file filter error or other errors
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
        error: 'FILE_UPLOAD_ERROR',
      });
    }
    // File upload successful, proceed to validation
    next();
  });
};

// ============= PUBLIC ROUTES =============

/**
 * POST /api/donations
 * Create a new donation with UPI payment screenshot
 * Required: name, phone, amount, transactionId, screenshot (file)
 */
router.post(
  '/',
  handleMulterUpload,
  validateCreateDonation,
  DonationController.createDonation
);

// ============= ADMIN ROUTES (require auth) =============

/**
 * GET /api/donations
 * Get all donations with pagination and filters
 * Query: page, limit, status (pending/verified)
 * Admin endpoint
 */
router.get(
  '/',
  auth,
  validateGetDonations,
  DonationController.getAllDonations
);

/**
 * GET /api/donations/pending
 * Get all pending donations (awaiting verification)
 * Admin endpoint
 * MUST come before /:id route to avoid being treated as an ID parameter
 */
router.get(
  '/pending',
  auth,
  validateGetDonations,
  DonationController.getPendingDonations
);

/**
 * GET /api/donations/verified
 * Get all verified donations
 * Admin endpoint
 */
router.get(
  '/verified',
  auth,
  validateGetDonations,
  DonationController.getVerifiedDonations
);

/**
 * GET /api/donations/stats
 * Get donation statistics
 * Returns: verified stats, pending stats, overall stats
 * Admin endpoint
 */
router.get(
  '/stats',
  auth,
  DonationController.getDonationStats
);

/**
 * GET /api/donations/by-phone/:phone
 * Get all donations by a phone number
 * MUST come before /:id route
 */
router.get(
  '/by-phone/:phone',
  DonationController.getDonationsByPhone
);

/**
 * GET /api/donations/:id
 * Get single donation details by ID
 * MUST be LAST to avoid matching other routes
 */
router.get(
  '/:id',
  DonationController.getDonationById
);

/**
 * PUT /api/donations/:id/verify
 * Verify a donation (Admin Only)
 * Body: notes (optional verification notes)
 * SECURITY: Only updates status, does NOT delete or modify immutable fields
 */
router.put(
  '/:id/verify',
  auth,
  validateVerifyDonation,
  DonationController.verifyDonation
);

// ============= ERROR HANDLING =============
// Multer error handler
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({
        success: false,
        message: 'File size must not exceed 2MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error && error.message) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

/**
 * SECURITY NOTES:
 * ===============
 * 1. NO DELETE ENDPOINT for donations
 * 2. Donations are immutable financial records
 * 3. createdAt field cannot be modified
 * 4. Only verification status can be updated
 * 5. File upload limited to 2MB JPG/PNG only
 * 6. All admin endpoints require auth middleware
 * 7. Transaction ID uniqueness enforced at DB level
 */

module.exports = router;
