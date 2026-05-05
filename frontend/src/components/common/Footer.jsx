import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';
import './Footer.css';

export default function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const { language } = useLanguage();
  const t = T[language];

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>{t.about_sajssm}</h4>
          <p>{t.footer_about_text}</p>
          <p className="footer-tagline">{t.seva_tagline}</p>
        </div>

        <div>
          <h4>{t.quick_links}</h4>
          <ul>
            {[
              ['home',     `🏠 ${t.nav_home}`],
              ['about',    `🙏 ${t.nav_about}`],
              ['yatra',    `🏔️ ${t.nav_yatra}`],
              ['donation', `💰 ${t.nav_donation}`],
              ['gallery',  `📸 ${t.nav_gallery}`],
              ['contact',  `📞 ${t.nav_contact}`],
            ].map(([id, label]) => (
              <li key={id}>
                <button onClick={() => navigate(id === 'home' ? '/' : `/${id}`)}>{label}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>{t.contact_info}</h4>
          <p>📍 {t.contact_address_val}</p>
          <p>📞 9466132732, 9466132733</p>
          <p>📞 7015345275, 9896362883</p>
          <p>✉️ shriamarnathjanshakti@gmail.com</p>
          <p className="footer-notice">{t.yatra_notice}</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {year} {t.rights_reserved} | 🙏 Jai Baba Barfani |{' '}
        <button
          onClick={() => navigate('/admin/login')}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}
        >
          {t.admin}
        </button>
      </div>
    </footer>
  );
}
