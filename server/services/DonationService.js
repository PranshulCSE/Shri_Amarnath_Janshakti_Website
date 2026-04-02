const Donation = require('../models/Donation');
const fs = require('fs');
const path = require('path');

/**
 * Donation Service
 * Handles all donation-related business logic
 * SECURITY: No delete operation available
 */
class DonationService {
    /**
     * Create a new donation
     * @param {Object} data - Donation data (name, phone, amount, transactionId)
     * @param {String} screenshotPath - Path to uploaded screenshot
     * @returns {Promise<Object>} Created donation document
     */
    static async createDonation(data, screenshotPath) {
        try {
            // Check if transaction already exists (prevent duplicates)
            const existing = await Donation.findOne({
                transactionId: data.transactionId,
            });
            if (existing) {
                throw new Error('Transaction ID already exists');
            }

            const donation = new Donation({
                ...data,
                screenshot: screenshotPath,
                status: 'pending',
            });

            await donation.save();
            return donation;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get all donations with pagination
     * @param {Number} page - Page number (default: 1)
     * @param {Number} limit - Items per page (default: 10)
     * @param {String} status - Filter by status ('pending', 'verified', or both)
     * @returns {Promise<Object>} { donations, total, pages }
     */
    static async getAllDonations(page = 1, limit = 10, status = null) {
        try {
            const skip = (page - 1) * limit;
            const query = status ? { status } : {};

            const donations = await Donation.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const total = await Donation.countDocuments(query);
            const pages = Math.ceil(total / limit);

            return {
                donations,
                pagination: {
                    total,
                    pages,
                    currentPage: page,
                    perPage: limit,
                },
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get pending donations only
     * @param {Number} page - Page number (default: 1)
     * @param {Number} limit - Items per page (default: 10)
     * @returns {Promise<Object>} { donations, total, pages }
     */
    static async getPendingDonations(page = 1, limit = 10) {
        return this.getAllDonations(page, limit, 'pending');
    }

    /**
     * Get verified donations only
     * @param {Number} page - Page number (default: 1)
     * @param {Number} limit - Items per page (default: 10)
     * @returns {Promise<Object>} { donations, total, pages }
     */
    static async getVerifiedDonations(page = 1, limit = 10) {
        return this.getAllDonations(page, limit, 'verified');
    }

    /**
     * Get single donation by ID
     * @param {String} id - Donation ID
     * @returns {Promise<Object>} Donation document
     */
    static async getDonationById(id) {
        try {
            const donation = await Donation.findById(id).lean();
            if (!donation) {
                throw new Error('Donation not found');
            }
            return donation;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get donation by transaction ID
     * @param {String} transactionId - Transaction ID
     * @returns {Promise<Object>} Donation document
     */
    static async getDonationByTransactionId(transactionId) {
        try {
            const donation = await Donation.findOne({ transactionId }).lean();
            if (!donation) {
                throw new Error('Donation not found');
            }
            return donation;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verify a donation (Admin Only)
     * SECURITY: Only updates status, does NOT modify immutable fields
     * @param {String} id - Donation ID
     * @param {String} adminId - Admin ID who is verifying
     * @param {String} notes - Optional verification notes
     * @returns {Promise<Object>} Updated donation document
     */
    static async verifyDonation(id, adminId, notes = '') {
        try {
            const donation = await Donation.findById(id);
            if (!donation) {
                throw new Error('Donation not found');
            }

            if (donation.status === 'verified') {
                throw new Error('Donation is already verified');
            }

            // Update status and verification details
            donation.status = 'verified';
            donation.verifiedAt = new Date();
            donation.verifiedBy = adminId;
            donation.notes = notes;
            donation.updatedAt = new Date();

            await donation.save();
            return donation;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get donation statistics
     * @returns {Promise<Object>} Statistics of all donations
     */
    static async getDonationStats() {
        try {
            const stats = await Donation.getStats();
            return stats;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get donations by phone number
     * @param {String} phone - Phone number
     * @returns {Promise<Array>} Donations list
     */
    static async getDonationsByPhone(phone) {
        try {
            const donations = await Donation.find({ phone })
                .sort({ createdAt: -1 })
                .lean();
            return donations;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check if transaction ID exists
     * @param {String} transactionId - Transaction ID
     * @returns {Promise<Boolean>} true if exists, false otherwise
     */
    static async transactionExists(transactionId) {
        try {
            const donation = await Donation.findOne({ transactionId });
            return !!donation;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get donations in date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Promise<Array>} Donations list
     */
    static async getDonationsByDateRange(startDate, endDate) {
        try {
            const donations = await Donation.find({
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            })
                .sort({ createdAt: -1 })
                .lean();
            return donations;
        } catch (error) {
            throw error;
        }
    }

    /**
     * SECURITY: NO DELETE METHOD
     * Donations are immutable records and should never be deleted
     * Only verification status can be updated
     */
}

module.exports = DonationService;
