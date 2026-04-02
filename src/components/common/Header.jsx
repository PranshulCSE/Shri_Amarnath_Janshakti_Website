import React, { useState } from 'react';
import './Header.css';

import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'history', label: 'History' },
  { id: 'yatra', label: 'Yatra' },
  { id: 'donation', label: 'Donations' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    navigate(id === 'home' ? '/' : `/${id}`);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      {/* Top bar: logo + text + hamburger */}
      <div className="header-top">

        <div className="header-text">
          <div className='logobox'>
            <img
              src='/Images/SLOGO.png'
              alt="SAJSSM Logo"
              className="logo"
            />
          </div>
          <h1 className="site-title">SHRI AMARNATH JANSHAKTI SEWA MANDAL</h1>
          <p className="reg-line">REG.01104 | H.No. 186/5 Gandhi Nagar, Karnal Hry. (132001)</p>
          <p className="con-line">📞 9466132732 | 9466132733 | 7015345275 | 9896362883</p>
        </div>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <ul className={`nav-list ${menuOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map((n) => (
            <li key={n.id}>
              <button
                className={`nav-btn ${location.pathname === (n.id === 'home' ? '/' : `/${n.id}`) ? 'active' : ''}`}
                onClick={() => handleNav(n.id)}
              >
                {n.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
