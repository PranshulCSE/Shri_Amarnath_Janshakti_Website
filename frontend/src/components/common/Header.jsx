import React, { useEffect, useState } from 'react';
import './Header.css';

import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';
import LanguageSwitcher from './LanguageSwitcher';

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
  const [isCompact, setIsCompact] = useState(false);
  const { language } = useLanguage();
  const t = T[language];

  useEffect(() => {
    const handleScroll = () => setIsCompact(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNav = (id) => {
    navigate(id === 'home' ? '/' : `/${id}`);
    setMenuOpen(false);
  };

  return (
    <header className={`header ${isCompact ? 'compact' : ''}`}>
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
      </div>

      <div className="header-thin-strip">
        <span>{t.site_title}</span>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-inner">
          <button
            className="menu-btn nav-menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'} />
          </button>

          {menuOpen && (
            <button
              className="nav-backdrop"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
          )}

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
            <li className="nav-lang-item">
              <LanguageSwitcher inline />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
