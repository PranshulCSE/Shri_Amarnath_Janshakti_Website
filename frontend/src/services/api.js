import axios from 'axios';

// Construct API base URL - use env variable or fallback to localhost
const getBaseURL = () => {
    const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    return rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/+$/, '')}/api`;
};

// Create axios instance with base URL
const API = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
API.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        console.error('Error accessing localStorage:', err);
    }
    return config;
});

// Handle response errors globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            status: error.response?.status || null,
            url: error.config?.url || null,
            message: error.message,
        });

        //  Handle 401 Unauthorized
        if (error.response?.status === 401) {
            try {
                localStorage.removeItem('adminToken');
            } catch (err) {
                console.error('Error clearing localStorage:', err);
            }
            window.location.href = '/admin/login';
        }

        return Promise.reject(error);
    }
);

// ============= AUTH APIs =============
export const authAPI = {
    login: (username, password) =>
        API.post('/auth/login', { username, password }),
    logout: () => {
        localStorage.removeItem('adminToken');
    },
};

// ============= DONATIONS APIs =============
export const donationAPI = {
    getAll: () => API.get('/donations'),
    getById: (id) => API.get(`/donations/${id}`),
    create: (formData) =>
        API.post('/donations', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    verify: (id) => API.put(`/donations/${id}/verify`, {}),
    getStats: () => API.get('/donations/stats'),
};

// ============= CONTACTS APIs =============
export const contactAPI = {
    getAll: () => API.get('/contacts'),
    create: (data) => API.post('/contacts', data),
    delete: (id) => API.delete(`/contacts/${id}`),
};

// ============= SETTINGS APIs =============
export const settingsAPI = {
    getAll: () => API.get('/settings'),
    update: (data) => API.put('/settings', data),
};

export default API;