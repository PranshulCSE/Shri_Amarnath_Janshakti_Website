
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function AdminDashboardWrapper() {
    const navigate = useNavigate();
    let token = null;
    try {
        token = localStorage.getItem('adminToken');
    } catch (err) {
        console.error('Error accessing localStorage:', err);
    }

    useEffect(() => {
        if (!token) {
            navigate('/admin/login', { replace: true });
        }
    }, [token, navigate]);

    const handleLogout = () => {
        try {
            localStorage.removeItem('adminToken');
        } catch (err) {
            console.error('Error clearing localStorage:', err);
        }
        navigate('/admin/login', { replace: true });
    };

    const handleNavigate = (path) => {
        navigate(path === 'home' ? '/' : `/${path}`, { replace: true });
    };

    if (!token) return null; // ✅ Prevent rendering while redirecting

    return (
        <ErrorBoundary>
            <AdminDashboard
                token={token}
                onLogout={handleLogout}
                navigate={handleNavigate}
            />
        </ErrorBoundary>
    );
}