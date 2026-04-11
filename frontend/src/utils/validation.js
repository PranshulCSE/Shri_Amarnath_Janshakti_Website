/**
 * Validation utilities for form and data validation
 */

export const VALIDATION_RULES = {
    name: /^[a-zA-Z\s]{3,}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\d{10}$/,
    amount: /^\d+(\.\d{1,2})?$/,
    url: /^https?:\/\/.+/,
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    return VALIDATION_RULES.email.test(email);
};

/**
 * Validate phone number (10 digits)
 */
export const validatePhone = (phone) => {
    return VALIDATION_RULES.phone.test(phone.replace(/\D/g, ''));
};

/**
 * Validate name (at least 3 characters)
 */
export const validateName = (name) => {
    return name.length >= 3;
};

/**
 * Validate amount (positive number)
 */
export const validateAmount = (amount) => {
    return !isNaN(amount) && amount > 0;
};

/**
 * Validate file size (2MB max)
 */
export const validateFileSize = (file, maxSizeMB = 2) => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
};

/**
 * Validate file type
 */
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png']) => {
    return allowedTypes.includes(file.type);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Comprehensive form validation
 */
export const validateFormData = (data, rules) => {
    const errors = {};

    for (const [field, rule] of Object.entries(rules)) {
        const value = data[field];

        if (rule.required && (!value || value.toString().trim() === '')) {
            errors[field] = `${field} is required`;
            continue;
        }

        if (value && rule.pattern && !rule.pattern.test(value)) {
            errors[field] = rule.message || `${field} is invalid`;
        }

        if (value && rule.minLength && value.length < rule.minLength) {
            errors[field] = `${field} must be at least ${rule.minLength} characters`;
        }

        if (value && rule.maxLength && value.length > rule.maxLength) {
            errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
        }

        if (value && rule.min && Number(value) < rule.min) {
            errors[field] = `${field} must be at least ${rule.min}`;
        }

        if (value && rule.max && Number(value) > rule.max) {
            errors[field] = `${field} must not exceed ${rule.max}`;
        }

        if (rule.custom && !rule.custom(value)) {
            errors[field] = rule.customMessage || `${field} is invalid`;
        }
    }

    return Object.keys(errors).length === 0 ? null : errors;
};

export default {
    validateEmail,
    validatePhone,
    validateName,
    validateAmount,
    validateFileSize,
    validateFileType,
    formatFileSize,
    validateFormData,
};
