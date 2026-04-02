import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

export default function AdminDashboardWrapper() {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
    };

    const handleNavigate = (path) => {
        if (path === 'home') {
            navigate('/', { replace: true });
        } else {
            navigate(`/${path}`, { replace: true });
        }
    };

    return (
        <AdminDashboard
            token={token}
            onLogout={handleLogout}
            navigate={handleNavigate}
        />
    );
}
