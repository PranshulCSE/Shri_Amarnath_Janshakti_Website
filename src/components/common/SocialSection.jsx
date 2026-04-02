import React from 'react';

const SOCIALS = [
  {
    href: 'https://www.facebook.com/people/Shri-amarnath-jan-shakti-sewa-mandal-ram-nagar-karnal/100067520252003/',
    icon: 'fab fa-facebook',
    title: 'Facebook',
  },
  {
    href: 'https://www.instagram.com/shri_amarnath_janshakti/',
    icon: 'fab fa-instagram',
    title: 'Instagram',
  },
  {
    href: 'https://youtube.com/@shriamarnathjanshakti',
    icon: 'fab fa-youtube',
    title: 'YouTube',
  },
  {
    href: 'mailto:shriamarnathjanshakti@gmail.com',
    icon: 'fas fa-envelope',
    title: 'Email',
  },
];

export default function SocialSection({ heading = 'हमें सोशल मीडिया पर फॉलो करें' }) {
  return (
    <section className="social-section">
      <h3>{heading}</h3>
      <div className="social-links">
        {SOCIALS.map((s) => (
          <a
            key={s.title}
            href={s.href}
            className="social-icon"
            title={s.title}
            target="_blank"
            rel="noreferrer"
          >
            <i className={s.icon} />
          </a>
        ))}
      </div>
    </section>
  );
}
