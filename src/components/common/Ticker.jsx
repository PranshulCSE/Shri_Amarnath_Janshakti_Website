import React from 'react';
import './Ticker.css';

const messages = [
  { icon: 'fas fa-om', text: 'Inaugural date of Shri Amarnath Ji Yatra 2026 will be notified soon — Stay tuned!' },
  { icon: 'fas fa-om',   text: 'Jai Baba Barfani! Free Langar services for all pilgrims during Shri Amarnath Ji Yatra 2026' },
  { icon: 'fas fa-om',text: 'Register on jksasb.nic.in for Yatra 2026 updates' },
  { icon: 'fas fa-om', text: 'Inaugural date of Shri Amarnath Ji Yatra 2026 will be notified soon — Stay tuned!' },
  { icon: 'fas fa-om', text: 'Jai Baba Barfani! Free Langar services for all pilgrims during Shri Amarnath Ji Yatra 2026' },
  { icon: 'fas fa-om', text: 'Register on jksasb.nic.in for Yatra 2026 updates' },
  { icon: 'fas fa-om', text: 'Follow us on Instagram, Facebook & Youtube!!' }
 
 
];

export default function Ticker() {
  return (
    <div className="ticker">
      <div className="ticker-track">
        {messages.map((m, i) => (
          <span key={i}>
            <i className={m.icon} />
            {m.text}
          </span>
        ))}
      </div>
    </div>
  );
}
