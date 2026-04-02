import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
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
        localStorage.removeItem('token');
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
