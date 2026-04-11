
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

export default function AdminDashboardWrapper() {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!token) {
            navigate('/admin/login', { replace: true });
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
    };

    const handleNavigate = (path) => {
        navigate(path === 'home' ? '/' : `/${path}`, { replace: true });
    };

    if (!token) return null; // ✅ Prevent rendering while redirecting

    return (
        <AdminDashboard
            token={token}
            onLogout={handleLogout}
            navigate={handleNavigate}
        />
    );
}