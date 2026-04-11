/**
 * Application Messages and Strings
 * Centralized text for consistency
 */

export const MESSAGES = {
    // Success Messages
    SUCCESS: {
        LOGIN: 'Login successful!',
        LOGOUT: 'Logged out successfully!',
        CREATED: 'Created successfully!',
        UPDATED: 'Updated successfully!',
        DELETED: 'Deleted successfully!',
        VERIFIED: 'Verified successfully!',
        UPLOADED: 'File uploaded successfully!',
    },

    // Error Messages
    ERROR: {
        LOGIN_FAILED: 'Login failed. Please check your credentials.',
        INVALID_INPUT: 'Invalid input. Please check your entries.',
        FILE_TOO_LARGE: 'File size must not exceed 2MB.',
        INVALID_FILE_TYPE: 'Only JPG and PNG files are allowed.',
        REQUIRED_FIELD: 'This field is required.',
        NETWORK_ERROR: 'Network error. Please try again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        NOT_FOUND: 'Resource not found.',
    },

    // Validation Messages
    VALIDATION: {
        NAME_REQUIRED: 'Name is required.',
        NAME_MIN_LENGTH: 'Name must be at least 3 characters.',
        EMAIL_INVALID: 'Email is invalid.',
        PHONE_INVALID: 'Phone number must be 10 digits.',
        AMOUNT_INVALID: 'Amount must be at least ₹100.',
        DESCRIPTION_REQUIRED: 'Description is required.',
        PASSWORD_REQUIRED: 'Password is required.',
        PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters.',
    },

    // Confirmations
    CONFIRM: {
        DELETE: 'Are you sure you want to delete this item?',
        LOGOUT: 'Are you sure you want to logout?',
        VERIFY: 'Are you sure you want to verify this donation?',
    },

    // Info Messages
    INFO: {
        LOADING: 'Loading...',
        NO_DATA: 'No data available.',
        EMPTY_LIST: 'The list is empty.',
    },
};

export default MESSAGES;
