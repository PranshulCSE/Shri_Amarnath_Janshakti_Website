const DonationService = require('../services/DonationService');

/**
 * Donation Controller
 * Handles all HTTP requests related to donations
 * SECURITY: No DELETE endpoint for donations
 */
class DonationController {
    /**
     * POST /donations
     * Create a new donation
     * Required: name, phone, amount, transactionId, screenshot (file)
     */
    static async createDonation(req, res) {
        try {
            const { validatedBody } = req;

            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment screenshot is required',
                });
            }

            // Check if transaction ID already exists
            const exists = await DonationService.transactionExists(validatedBody.transactionId);
            if (exists) {
                return res.status(409).json({
                    success: false,
                    message: 'Transaction ID already exists',
                });
            }

            // Create donation
            const screenshotPath = `/uploads/donation-screenshots/${req.file.filename}`;
            const donation = await DonationService.createDonation(validatedBody, screenshotPath);

            res.status(201).json({
                success: true,
                message: 'Donation created successfully. Awaiting admin verification.',
                data: donation,
            });
        } catch (error) {
            console.error('Error creating donation:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error creating donation',
            });
        }
    }

    /**
     * GET /donations
     * Get all donations (with pagination and filters)
     * Query: page, limit, status
     */
    static async getAllDonations(req, res) {
        try {
            const { page, limit, status } = req.validatedQuery;

            const result = await DonationService.getAllDonations(page, limit, status);

            res.status(200).json({
                success: true,
                message: 'Donations retrieved successfully',
                data: result.donations,
                pagination: result.pagination,
            });
        } catch (error) {
            console.error('Error fetching donations:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching donations',
            });
        }
    }

    /**
     * GET /donations/pending
     * Get pending donations only
     */
    static async getPendingDonations(req, res) {
        try {
            const { page = 1, limit = 10 } = req.validatedQuery;

            const result = await DonationService.getPendingDonations(page, limit);

            res.status(200).json({
                success: true,
                message: 'Pending donations retrieved successfully',
                data: result.donations,
                pagination: result.pagination,
            });
        } catch (error) {
            console.error('Error fetching pending donations:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching pending donations',
            });
        }
    }

    /**
     * GET /donations/verified
     * Get verified donations only
     */
    static async getVerifiedDonations(req, res) {
        try {
            const { page, limit, status } = req.validatedQuery;

            const result = await DonationService.getVerifiedDonations(page, limit);

            res.status(200).json({
                success: true,
                message: 'Verified donations retrieved successfully',
                data: result.donations,
                pagination: result.pagination,
            });
        } catch (error) {
            console.error('Error fetching verified donations:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching verified donations',
            });
        }
    }

    /**
     * GET /donations/:id
     * Get single donation by ID
     */
    static async getDonationById(req, res) {
        try {
            const { id } = req.params;

            const donation = await DonationService.getDonationById(id);

            res.status(200).json({
                success: true,
                message: 'Donation retrieved successfully',
                data: donation,
            });
        } catch (error) {
            console.error('Error fetching donation:', error);

            if (error.message === 'Donation not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Donation not found',
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error fetching donation',
            });
        }
    }

    /**
     * PUT /donations/:id/verify (Admin Only)
     * Verify a donation
     * Required: admin authentication
     */
    static async verifyDonation(req, res) {
        try {
            const { id } = req.params;
            const { validatedBody } = req;
            const adminId = req.adminId; // From auth middleware

            if (!adminId) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized - admin authentication required',
                });
            }

            const donation = await DonationService.verifyDonation(
                id,
                adminId,
                validatedBody.notes
            );

            res.status(200).json({
                success: true,
                message: 'Donation verified successfully',
                data: donation,
            });
        } catch (error) {
            console.error('Error verifying donation:', error);

            if (error.message === 'Donation not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Donation not found',
                });
            }

            if (error.message === 'Donation is already verified') {
                return res.status(400).json({
                    success: false,
                    message: 'Donation is already verified',
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error verifying donation',
            });
        }
    }

    /**
     * GET /donations/stats
     * Get donation statistics
     */
    static async getDonationStats(req, res) {
        try {
            const stats = await DonationService.getDonationStats();

            res.status(200).json({
                success: true,
                message: 'Donation statistics retrieved successfully',
                data: stats,
            });
        } catch (error) {
            console.error('Error fetching donation stats:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching donation statistics',
            });
        }
    }

    /**
     * GET /donations/by-phone/:phone
     * Get all donations by phone number
     */
    static async getDonationsByPhone(req, res) {
        try {
            const { phone } = req.params;
            const normalizedPhone = typeof phone === 'string' ? phone.trim() : '';
            const phoneRegex = /^\+?[0-9]{7,15}$/;

            if (!normalizedPhone || !phoneRegex.test(normalizedPhone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid phone number format',
                });
            }

            const donations = await DonationService.getDonationsByPhone(normalizedPhone);
            res.status(200).json({
                success: true,
                message: 'Donations retrieved successfully',
                data: donations,
            });
        } catch (error) {
            console.error('Error fetching donations:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching donations',
            });
        }
    }

    /**
     * SECURITY: NO DELETE ENDPOINT FOR DONATIONS
     * Donations are immutable records and should never be deleted
     * Only verification status can be updated
     */
}

module.exports = DonationController;
