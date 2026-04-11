import React, { useState, useEffect } from 'react';
import './AnnouncementPopup.css';

export default function AnnouncementPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/announcements/active`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.body) {
            setAnnouncement(data);
            setVisible(true);
          }
        }
      } catch (e) {
        // use default
      }
    }
    
    // Slight delay for dramatic entry
    setTimeout(() => {
      load();
    }, 800);
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  const title = announcement?.title || 'Shri Amarnath Ji Yatra';
  const body = announcement?.body || 'Registartion for Shri Amrnath Ji Yatra 2026 will begin on 15 April';
  const icon = announcement?.icon || '🔔';
  const color = announcement?.color || '#ff6b35';

  return (
    <div
      className={`popup-overlay ${closing ? 'closing' : ''}`}
      onClick={(e) => e.target.classList.contains('popup-overlay') && close()}
    >
      <div 
        className="popup-box" 
        style={{ '--popup-color': color }}
      >
        {/* Header */}
        <div className="popup-header">
          <div className="popup-header-icon" role="img" aria-label="announcement">
            {icon}
          </div>
          <h2>{title}</h2>
          <button className="popup-close-x" onClick={close}>&times;</button>
        </div>

        {/* Body */}
        <div className="popup-body">
          <div className="popup-message">
            {body}
          </div>

          <div className="popup-btns">
            <button className="popup-btn-primary" onClick={close}>
              🙏 Jai Baba Barfani
            </button>
            <button className="popup-btn-secondary" onClick={close}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
