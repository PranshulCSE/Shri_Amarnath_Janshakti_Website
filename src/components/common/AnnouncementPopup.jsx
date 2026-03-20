import React, { useState } from 'react';
import './AnnouncementPopup.css';

export default function AnnouncementPopup() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  return (
    <div
      className={`popup-overlay ${closing ? 'closing' : ''}`}
      onClick={(e) => e.target.classList.contains('popup-overlay') && close()}
    >
      <div className="popup-box">
        {/* Header */}
        <div className="popup-header">
          <span className="bell" role="img" aria-label="bell">🔔</span>
          <h2>Shri Amarnath Ji Yatra 2026</h2>
        </div>

        {/* Body */}
        <div className="popup-body">
          <p>🙏 <strong>Jai Baba Barfani!</strong> 🙏</p>

          <div className="popup-date-badge">
            <p>📅 Inaugural date of</p>
            <p className="soon">Shri Amarnath Ji Yatra 2026</p>
            <p className="will-be">will be notified soon</p>
            <p className="sub">
              Follow us on social media for the latest updates
            </p>
          </div>

          <div className="popup-btns">
            <button className="popup-close-btn" onClick={close}>
              🙏 Jai Amarnath
            </button>
            <button className="popup-dismiss" onClick={close}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
