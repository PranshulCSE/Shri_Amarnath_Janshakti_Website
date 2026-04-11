import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from "../layouts/RootLayout"; 

// Pages - Update paths to match folder structure
import HomePage from '../pages/Home/HomePage';
import AboutPage from '../pages/About/AboutPage';
import HistoryPage from '../pages/History/HistoryPage';
import YatraPage from '../pages/Yatra/YatraPage';
import ContactPage from '../pages/Contact/ContactPage';
import DonationPage from '../pages/Donations/DonationPage';  // ✅ PLURAL
import GalleryPage from '../pages/Gallery/GalleryPage';

// Admin
import AdminDashboardWrapper from '../pages/Admin/AdminDashboardWrapper';
import AdminLogin from '../pages/Admin/AdminLogin';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Layout */}
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/yatra" element={<YatraPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/donation" element={<DonationPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboardWrapper />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}