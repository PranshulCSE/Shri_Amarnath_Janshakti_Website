/**
 * General helper utilities
 */

/**
 * Format currency (INR)
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    switch (format) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'MM/DD/YYYY':
            return `${month}/${day}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        default:
            return d.toLocaleDateString();
    }
};

/**
 * Format time
 */
export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
    return `${formatDate(date)} ${formatTime(date)}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, length = 50) => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Convert to title case
 */
export const toTitleCase = (text) => {
    return text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Get error message from axios error
 */
export const getErrorMessage = (error) => {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An error occurred'
    );
};

/**
 * Local storage utilities
 */
export const localStorage_util = {
    setToken: (token) => localStorage.setItem('token', token),
    getToken: () => localStorage.getItem('token'),
    removeToken: () => localStorage.removeItem('token'),
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    removeUser: () => localStorage.removeItem('user'),
    clear: () => localStorage.clear(),
};

export default {
    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,
    truncateText,
    capitalize,
    toTitleCase,
    isEmpty,
    debounce,
    throttle,
    getErrorMessage,
    localStorage_util,
};
