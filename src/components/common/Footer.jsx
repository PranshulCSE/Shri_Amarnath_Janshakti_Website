import React from 'react';
import './Footer.css';

export default function Footer({ navigate }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>About SAJSSM</h4>
          <p>
            Shri Amarnath JanShakti Sewa Mandal is dedicated to serving
            pilgrims with free langar services during their sacred yatra of
            Baba Barfani Ji.
          </p>
          <p className="footer-tagline">"सेवा ही धर्म है"</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            {[
              ['home',     '🏠 Home'],
              ['about',    '🙏 About Us'],
              ['yatra',    '🏔️ Yatra Info'],
              ['donation', '💰 Donations'],
              ['gallery',  '📸 Gallery'],
              ['contact',  '📞 Contact'],
            ].map(([id, label]) => (
              <li key={id}>
                <button onClick={() => navigate(id)}>{label}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Contact Info</h4>
          <p>📍 H.No. 186/5 Gandhi Nagar, Karnal, Haryana 132001</p>
          <p>📞 9466132732, 9466132733</p>
          <p>📞 7015345275, 9896362883</p>
          <p>✉️ shriamarnathjanshakti@gmail.com</p>
          <p className="footer-notice">🔔 Yatra 2026 date — Coming Soon!</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {year} Shri Amarnath JanShakti Sewa Mandal — All rights
        reserved. | 🙏 Jai Baba Barfani
      </div>
    </footer>
  );
}
