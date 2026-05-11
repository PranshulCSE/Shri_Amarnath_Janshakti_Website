import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';
import SocialSection from '../../components/common/SocialSection';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = T[language];

  const SERVICES = [
    { icon: '🍲', title: t.service_langar, desc: t.service_langar_desc },
    { icon: '🏥', title: t.service_medical, desc: t.service_medical_desc },
    { icon: '🛡️', title: t.service_safety, desc: t.service_safety_desc },
    { icon: '❤️', title: t.service_community, desc: t.service_community_desc },
  ];

  const STATS = [
    { value: '2008', label: t.stats_serving },
    { value: '17+', label: t.stats_years },
    { value: 'Lakhs of', label: t.stats_pilgrims },
    { value: 'Langar ', label: t.stats_free },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero home-hero">
        <div className="hero-atmosphere hero-atmosphere-one" />
        <div className="hero-atmosphere hero-atmosphere-two" />

        <div className="home-hero-copy">
          <p className="hero-eyebrow">{t.site_title}</p>
          <h2 className="hero-title">{t.welcome}</h2>
          <p className="hero-sub">{t.serving_sub}</p>
          <p className="hero-desc">{t.hero_desc}</p>
          <div className="hero-impact-row">
            {STATS.slice(0, 3).map((s) => (
              <div className="impact-pill" key={`hero-${s.label}`}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={() => navigate('/yatra')}>
              {t.learn_yatra}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/donation')}>
              {t.donate_now}
            </button>
          </div>
        </div>
        <div className="hero-img-box">
          <div className="hero-image-badge">
            <span>{t.stats_serving}</span>
            <strong>{STATS[0].value}</strong>
          </div>
          <img
            src="/Images/Banner2026.png"
            alt="SAJSSM Yatra"
          />
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Highlight Strip */}
      <div className="highlight-strip">
        <p>
          {t.highlight_strip}
        </p>
      </div>

      {/* Services */}
      <section className="section">
        <h2 className="section-title">{t.our_services}</h2>
        <div className="cards-grid">
          {SERVICES.map((s) => (
            <div className="card" key={s.title}>
              <span className="card-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>{t.join_us}</h2>
        <p>{t.join_us_desc}</p>
        <div className="cta-btns">
          <button className="btn btn-primary" onClick={() => navigate('/donation')}>
            {t.make_donation}
          </button>
          <button className="btn btn-white" onClick={() => navigate('/contact')}>
            {t.get_in_touch}
          </button>
        </div>
      </section>

      <SocialSection heading={t.social_heading} />
    </>
  );
}
