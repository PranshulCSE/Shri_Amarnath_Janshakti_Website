import React, { useState, useEffect } from 'react';
import './Ticker.css';

const FALLBACK_MESSAGES = [
  { icon: '📌', text: 'Shri Amarnath Ji Yatra 2026 will Commence on 3rd July!!', speed: 50 },
  { icon: '📌', text: 'Registrations for Shri Amarnath Ji Yatra 2026 will start from 15 April !!', speed: 50 },
  { icon: '📌', text: 'Get Compulsory Health Certificate from Yatra Tab!!', speed: 50 },
  { icon: '📌', text: 'Jai Baba Barfani! Free Langar services for all pilgrims during Shri Amarnath Ji Yatra 2026', speed: 50 },
  { icon: '📌', text: 'Register on jksasb.nic.in for Yatra 2026 updates', speed: 50 },
  { icon: '📌', text: 'Follow us on Instagram, Facebook & Youtube!!', speed: 50 },
];

export default function Ticker() {
  const [messages, setMessages] = useState(FALLBACK_MESSAGES);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
        const res = await fetch(`${apiBase}/api/ticker`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data);
          }
        }
      } catch (e) {
        // keep fallback
      }
    }
    load();
  }, []);

  // Calculate average speed for animation duration
  const avgSpeed = messages.length > 0
    ? Math.round(messages.reduce((sum, m) => sum + (m.speed || 50), 0) / messages.length)
    : 50;

  // Duration in seconds (lower speed = slower animation)
  const duration = (101 - avgSpeed) * 0.3 + 15;

  return (
    <div
      className="ticker"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        '--ticker-duration': `${duration}s`,
        '--ticker-play-state': hovering ? 'paused' : 'running',
      }}
    >
      <div className="ticker-track">
        {messages.map((m, i) => (
          <div key={m._id || i} className="ticker-item">
            <span className="ticker-icon">{m.icon || '📌'}</span>
            <span className="ticker-text">{m.text}</span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {messages.map((m, i) => (
          <div key={`dup-${m._id || i}`} className="ticker-item">
            <span className="ticker-icon">{m.icon || '📌'}</span>
            <span className="ticker-text">{m.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
