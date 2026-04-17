import React, { useState, useEffect, useCallback } from 'react';
import OverviewPanel from './panels/OverviewPanel';
import ContactsPanel from './panels/ContactsPanel';
import DonationsPanel from './panels/DonationsPanel';
import './AdminDashboard.css';

const MENU = [
  { id: 'overview', icon: '📊', label: 'Dashboard' },
  { id: 'contacts', icon: '📬', label: 'Contacts' },
  { id: 'donations', icon: '💰', label: 'Donations' },
];

export default function AdminDashboard({ token, onLogout, navigate }) {
  const [panel, setPanel] = useState('overview');
  const [sideOpen, setSideOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  // ✅ FIXED API FUNCTION
  const api = useCallback(async (url, options = {}) => {
    const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const fullUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url}`;

    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      },
    });

    if (res.status === 401) {
      onLogout();
      throw new Error('Session expired');
    }

    return res;
  }, [token, onLogout]);

  const panels = {
    overview: <OverviewPanel api={api} refreshKey={refreshKey} />,
    contacts: <ContactsPanel api={api} />,
    donations: <DonationsPanel api={api} onUpdate={triggerRefresh} />,
  };

  const handleMenuClick = (id) => {
    setPanel(id);
    setSideOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Mobile hamburger */}
      <button className="admin-hamburger" onClick={() => setSideOpen(o => !o)}>
        <i className={sideOpen ? 'fas fa-times' : 'fas fa-bars'} />
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-icon">🔱</span>
          <h2>SAJSSM Admin</h2>
        </div>
        <nav className="admin-nav">
          {MENU.map(m => (
            <button
              key={m.id}
              className={`admin-nav-btn ${panel === m.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(m.id)}
            >
              <span className="admin-nav-icon">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <button className="admin-nav-btn" onClick={() => navigate('home')}>
            <span className="admin-nav-icon">🌐</span>
            <span>View Website</span>
          </button>
          <button className="admin-nav-btn admin-logout-btn" onClick={onLogout}>
            <span className="admin-nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sideOpen && <div className="admin-overlay" onClick={() => setSideOpen(false)} />}

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1>{MENU.find(m => m.id === panel)?.label || 'Dashboard'}</h1>
        </div>
        <div className="admin-content">
          {panels[panel]}
        </div>
      </main>
    </div>
  );
}