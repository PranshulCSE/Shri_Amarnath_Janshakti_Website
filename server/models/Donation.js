const mongoose = require('mongoose');

/**
 * Donation Schema
 * Records all UPI donations with verification status
 * SECURITY: No delete operation allowed - donations are immutable records
 */
const donationSchema = new mongoose.Schema(
  {
    // Donor Information
    name: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\d{10}$/, 'Phone number must be 10 digits'],
    },

    // Donation Details
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [100, 'Minimum donation amount is ₹100'],
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
      trim: true,
    },

    // Proof of Payment
    screenshot: {
      type: String, // File path to uploaded screenshot
      required: [true, 'Payment screenshot is required'],
    },

    // Status Management
    status: {
      type: String,
      enum: {
        values: ['pending', 'verified'],
        message: 'Status must be either "pending" or "verified"',
      },
      default: 'pending',
    },

    // Metadata
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // Cannot be modified after creation
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: 'donations' }
);

/**
 * Index for efficient queries
 */
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ phone: 1 });

/**
 * Methods
 */

/**
 * Mark donation as verified
 * @param {Object} adminId - Admin ID who verified
 * @param {String} notes - Optional verification notes
 */
donationSchema.methods.verify = function (adminId, notes = '') {
  this.status = 'verified';
  this.verifiedAt = new Date();
  this.verifiedBy = adminId;
  this.notes = notes;
  return this.save();
};

/**
 * Get donation with all details
 */
donationSchema.methods.toJSON = function () {
  const obj = this.toObject();
  return {
    ...obj,
    amountFormatted: `₹${obj.amount}`,
  };
};

/**
 * Static Methods
 */

/**
 * Get all donations (paginated)
 */
donationSchema.statics.getPaginated = function (page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/**
 * Get donation statistics
 */
donationSchema.statics.getStats = async function () {
  const result = await this.aggregate([
    {
      $facet: {
        verified: [
          { $match: { status: 'verified' } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' },
            },
          },
        ],
        pending: [
          { $match: { status: 'pending' } },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalAmount: { $sum: '$amount' },
            },
          },
        ],
        overall: [
          {
            $group: {
              _id: null,
              totalCount: { $sum: 1 },
              totalAmount: { $sum: '$amount' },
              avgAmount: { $avg: '$amount' },
            },
          },
        ],
      },
    },
  ]);

  return {
    verified: result[0].verified[0] || { count: 0, totalAmount: 0 },
    pending: result[0].pending[0] || { count: 0, totalAmount: 0 },
    overall: result[0].overall[0] || { totalCount: 0, totalAmount: 0, avgAmount: 0 },
  };
};

/**
 * Get all pending donations
 */
donationSchema.statics.getPending = function (page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

/**
 * Check if transaction ID already exists
 */
donationSchema.statics.transactionExists = function (transactionId) {
  return this.findOne({ transactionId });
};

/**
 * Pre-save hook
 */
donationSchema.pre('save', function (next) {
  // Ensure createdAt is never modified
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

/**
 * Create model
 */
const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
