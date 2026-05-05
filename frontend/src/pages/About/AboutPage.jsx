import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';
import SocialSection from '../../components/common/SocialSection';
import './AboutPage.css';

export default function AboutPage() {
  const { language } = useLanguage();
  const t = T[language];
  
  const VALUES = [
    { icon: '🙏', title: t.val_spirit,      desc: t.val_spirit_desc },
    { icon: '❤️', title: t.val_spiritual, desc: t.val_spiritual_desc },
    { icon: '🤝', title: t.val_community,       desc: t.val_community_desc },
    { icon: '✨', title: t.val_dedication,              desc: t.val_dedication_desc },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h2 className="hero-title">{t.who_are_we}</h2>
          <p className="hero-sub">{t.about_sub}</p>
          <p className="hero-desc">{t.about_hero_desc}</p>
        </div>
        <div className="hero-img-box">
          <img
            src="/Images/Visiting_SAJSSM.jpg"
            alt="Amarnath Yatra"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="hero-placeholder">🏔️</div>';
            }}
          />
        </div>
      </section>

      {/* About Content */}
      <section className="section">
        <div className="about-box">
          <h2>{t.about_title_2}</h2>
          <p>{t.about_p1}</p>
          <p>{t.about_p2}</p>

          <h3>{t.about_inspiration}</h3>
          <p>{t.about_inspiration_p}</p>

          <h3>{t.about_objective}</h3>
          <ul>
            <li>{t.about_obj_1}</li>
            <li>{t.about_obj_2}</li>
            <li>{t.about_obj_3}</li>
            <li>{t.about_obj_4}</li>
            <li>{t.about_obj_5}</li>
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <h2 className="section-title">{t.values_title}</h2>
        <div className="cards-grid">
          {VALUES.map((v) => (
            <div className="card" key={v.title}>
              <span className="card-icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Org Details CTA */}
      <section className="cta-section">
        <h2>{t.org_details_title}</h2>
        <div className="org-details">
          <p><strong>{t.org_reg}</strong> 01104</p>
          <p><strong>{t.org_est}</strong> {t.org_est_val}</p>
          <p><strong>{t.org_office}</strong> {t.contact_address_val}</p>
          <p><strong>{t.org_contact}</strong> 9466132732, 9466132733, 7015345275, 9996181668</p>
        </div>
      </section>

      <SocialSection />
    </>
  );
}
