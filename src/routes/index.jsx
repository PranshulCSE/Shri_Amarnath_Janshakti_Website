import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import RootLayout from '../layouts/RootLayout';

// Public Pages
import HomePage from '../pages/Home/HomePage';
import AboutPage from '../pages/About/AboutPage';
import HistoryPage from '../pages/History/HistoryPage';
import YatraPage from '../pages/Yatra/YatraPage';
import DonationPage from '../pages/Donations/DonationPage';
import GalleryPage from '../pages/Gallery/GalleryPage';
import ContactPage from '../pages/Contact/ContactPage';

// Admin Pages
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboardWrapper from '../pages/Admin/AdminDashboardWrapper';

export default function AppRoutes() {
  const adminToken = localStorage.getItem('adminToken');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Header/Footer/Popups */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="yatra" element={<YatraPage />} />
          <Route path="donation" element={<DonationPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Admin Routes (No public layout wrapper) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            adminToken ? <AdminDashboardWrapper /> : <Navigate to="/admin/login" replace />
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
