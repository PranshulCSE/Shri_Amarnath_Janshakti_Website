import React, { useState } from 'react';
import './Header.css';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';

const NAV_ITEMS = [
  { id: 'home', labelKey: 'nav_home' },
  { id: 'about', labelKey: 'nav_about' },
  { id: 'history', labelKey: 'nav_history' },
  { id: 'yatra', labelKey: 'nav_yatra' },
  { id: 'donation', labelKey: 'nav_donation' },
  { id: 'gallery', labelKey: 'nav_gallery' },
  { id: 'contact', labelKey: 'nav_contact' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = T[language];

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
          <h1 className="site-title">{t.site_title}</h1>
          <p className="reg-line">{t.reg_line}</p>
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
                {t[n.labelKey]}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
