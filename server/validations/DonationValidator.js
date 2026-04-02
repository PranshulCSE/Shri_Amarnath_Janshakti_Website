const joi = require('joi');

/**
 * Donation Validation Schemas (Using Joi)
 * Validates all donation-related requests
 */

/**
 * Schema for creating a new donation
 * Required: name, phone, amount, transactionId, screenshot (file)
 */
const createDonationSchema = joi.object({
    name: joi
        .string()
        .required()
        .trim()
        .min(3)
        .max(100)
        .messages({
            'string.empty': 'Donor name is required',
            'string.min': 'Name must be at least 3 characters',
            'string.max': 'Name must not exceed 100 characters',
        }),

    phone: joi
        .string()
        .required()
        .pattern(/^\d{10}$/)
        .messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Phone number must be 10 digits',
        }),

    amount: joi
        .number()
        .required()
        .min(100)
        .messages({
            'number.base': 'Amount must be a number',
            'number.min': 'Minimum donation amount is ₹100',
        }),

    transactionId: joi
        .string()
        .required()
        .trim()
        .alphanum()
        .min(5)
        .max(50)
        .messages({
            'string.empty': 'Transaction ID is required',
            'string.alphanum': 'Transaction ID must contain only letters and numbers',
            'string.min': 'Transaction ID must be at least 5 characters',
            'string.max': 'Transaction ID must not exceed 50 characters',
        }),

    // Note: screenshot field is handled by multer middleware
    // File validation rules:
    // - Required: yes
    // - Max size: 2MB
    // - Type: jpg, png
});

/**
 * Schema for verifying a donation (admin only)
 */
const verifyDonationSchema = joi.object({
    notes: joi
        .string()
        .optional()
        .trim()
        .max(500)
        .messages({
            'string.max': 'Notes must not exceed 500 characters',
        }),
});

/**
 * Schema for querying donations
 */
const getDonationsSchema = joi.object({
    page: joi
        .number()
        .optional()
        .min(1)
        .default(1)
        .messages({
            'number.min': 'Page must be at least 1',
        }),

    limit: joi
        .number()
        .optional()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit must not exceed 100',
        }),

    status: joi
        .string()
        .optional()
        .valid('pending', 'verified')
        .messages({
            'any.only': 'Status must be either "pending" or "verified"',
        }),
});

/**
 * Middleware to validate donation creation
 */
const validateCreateDonation = async (req, res, next) => {
    try {
        // Convert amount to number if it's a string (from FormData)
        if (req.body.amount && typeof req.body.amount === 'string') {
            req.body.amount = parseInt(req.body.amount, 10);
        }

        const value = await createDonationSchema.validateAsync(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        req.validatedBody = value;
        next();
    } catch (error) {
        const messages = error.details ? error.details.map((d) => d.message) : [error.message];
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: messages,
        });
    }
};

/**
 * Middleware to validate donation verification
 */
const validateVerifyDonation = (req, res, next) => {
    const { error, value } = verifyDonationSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const messages = error.details.map((d) => d.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: messages,
        });
    }

    req.validatedBody = value;
    next();
};

/**
 * Middleware to validate query parameters
 */
const validateGetDonations = (req, res, next) => {
    const { error, value } = getDonationsSchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const messages = error.details.map((d) => d.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: messages,
        });
    }

    req.validatedQuery = value;
    next();
};

module.exports = {
    createDonationSchema,
    verifyDonationSchema,
    getDonationsSchema,
    validateCreateDonation,
    validateVerifyDonation,
    validateGetDonations,
};
