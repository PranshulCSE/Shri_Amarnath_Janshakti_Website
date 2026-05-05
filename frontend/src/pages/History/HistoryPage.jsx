import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';
import SocialSection from '../../components/common/SocialSection';
import './HistoryPage.css';

export default function HistoryPage() {
  const { language } = useLanguage();
  const t = T[language];
  
  const TIMELINE = [
    { color: '#ff6b35', icon: '🏛️', title: t.tl_org, text: t.tl_org_desc },
    { color: '#f7931e', icon: '🍲', title: t.tl_langar, text: t.tl_langar_desc },
    { color: '#25c916', icon: '🕌', title: t.tl_kedar, text: t.tl_kedar_desc },
    { color: '#004e89', icon: '🎯', title: t.tl_new, text: t.tl_new_desc },
    { color: '#ff6b35', icon: '🏛️', title: t.tl_loss, text: t.tl_loss_desc },
    { color: '#06a77d', icon: '⭐', title: t.tl_achieve, text: t.tl_achieve_desc },
    { color: '#f97316', icon: '🚀', title: t.tl_future, text: t.tl_future_desc },
  ];

  const ACHIEVEMENTS = [
    { icon: '🎖️', title: t.ach_lakhs, desc: t.ach_lakhs_desc },
    { icon: '👥', title: t.ach_family, desc: t.ach_family_desc },
    { icon: '🏗️', title: t.ach_facilities, desc: t.ach_facilities_desc },
    { icon: '🌟', title: t.ach_honor, desc: t.ach_honor_desc },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h2 className="hero-title">{t.hist_hero}</h2>
          <p className="hero-sub">{t.hist_sub}</p>
          <p className="hero-desc">{t.hist_desc}</p>
        </div>
        <div className="hero-img-box">
          <img
            src="/Images/Card_front-cropped.jpg"
            alt="History"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="hero-placeholder">📜</div>';
            }}
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <h2 className="section-title">{t.our_journey}</h2>
        <div className="timeline-box">
          {TIMELINE.map((t, i) => (
            <div
              key={i}
              className="tl-item"
              style={{ borderLeft: `4px solid ${t.color}` }}
            >
              <h3 style={{ color: t.color }}>
                {t.icon} {t.title}
              </h3>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="section">
        <h2 className="section-title">{t.our_achievements}</h2>
        <div className="cards-grid">
          {ACHIEVEMENTS.map((a) => (
            <div className="card" key={a.title}>
              <span className="card-icon">{a.icon}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SocialSection />
    </>
  );
}
