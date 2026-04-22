import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

      // AbortController gives us a 15-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // Safely parse JSON — avoids "Unexpected end of JSON input" / "Unexpected token '<'"
      const contentType = res.headers.get('content-type') || '';
      let data = {};
      if (contentType.includes('application/json')) {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } else {
        // Server returned HTML or empty body — surface a clear message
        throw new Error('Server returned an unexpected response. Please check backend health.');
      }

      if (!res.ok) throw new Error(data.message || 'Login failed');
      try {
        localStorage.setItem('adminToken', data.data.token);
      } catch (err) {
        console.error('Error storing token:', err);
        throw new Error('Failed to save authentication. Please clear browser storage and try again.');
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. The backend may be starting up — try again in 30 seconds.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <span className="admin-login-icon">🔱</span>
          <h1>SAJSSM Admin</h1>
          <p>Shri Amarnath JanShakti Sewa Mandal</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoFocus
            />
          </div>
          <div className="admin-input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Logging in...' : '🔐 Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
