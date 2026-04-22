const Joi = require('joi');

// ================= SCHEMAS =================

// CREATE
const createDonationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().trim().messages({
        'string.empty': 'Donor name is required',
    }),

    phone: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Phone must be 10 digits',
    }),

    amount: Joi.number().min(100).required().messages({
        'number.min': 'Minimum donation is ₹100',
    }),

    transactionId: Joi.string().min(5).max(50).required().trim().messages({
        'string.empty': 'Transaction ID is required',
    }),

    email: Joi.string().email().optional(),

    message: Joi.string().optional().allow(''),
});

// VERIFY
const verifyDonationSchema = Joi.object({
    notes: Joi.string().max(500).optional().allow(''),
});

// QUERY
const getDonationsSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    status: Joi.string().valid('pending', 'verified').optional(),
});

// ================= MIDDLEWARE =================

// CREATE VALIDATION 
const validateCreateDonation = (req, res, next) => {
    try {
        if (req.body.amount && typeof req.body.amount === 'string') {
            req.body.amount = parseInt(req.body.amount, 10);
        }

        const { error, value } = createDonationSchema.validate(req.body, {
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
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

// VERIFY VALIDATION
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

// QUERY VALIDATION
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
    validateCreateDonation,
    validateVerifyDonation,
    validateGetDonations,
};