import { useNavigate } from 'react-router-dom';
import SocialSection from '../../components/common/SocialSection';
import './HomePage.css';

const SERVICES = [
  { icon: '🍲', title: 'Free Langar Services', desc: 'Providing nutritious meals to all pilgrims during their sacred journey to Amarnath Ji — completely free of cost.' },
  { icon: '🏥', title: 'Medical Support',       desc: 'Basic medicines and first-aid are available for pilgrims at our camps throughout the yatra route.' },
  { icon: '🛡️', title: 'Safety & Guidance',    desc: 'Our volunteers provide guidance and safety support to ensure a secure and smooth pilgrimage experience.' },
  { icon: '❤️', title: 'Community Service',     desc: 'Dedicated selfless volunteers work tirelessly to serve pilgrims — elderly, women, and differently-abled get special care.' },
];

const STATS = [
  { value: '2008',   label: 'Serving Since' },
  { value: '17+',    label: 'Years of Service' },
  { value: 'Lakhs of',  label: 'Pilgrims Served' },
  { value: 'Langar ',   label: 'Free Service' },
];

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h2 className="hero-title">🙏 Welcome to SAJSSM 🙏</h2>
          <p className="hero-sub">Serving Pilgrims with Love &amp; Compassion</p>
          <p className="hero-desc">
            Providing free Langar services to Shri Amarnath Ji Yatris since 2011.
            Dedicated volunteers ensure every pilgrim's journey is safe, nourished,
            and spiritually uplifting.
          </p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={() => navigate('/yatra')}>
              Learn About Yatra
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/donation')}>
              Donate Now
            </button>
          </div>
        </div>
        <div className="hero-img-box">
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
          "सेवा ही धर्म है" —{' '}
          <span>
            Providing Support & Free Langar Services to Shri Amarnath Ji Yatris Selflessly.
          </span>
        </p>
      </div>

      {/* Services */}
      <section className="section">
        <h2 className="section-title">Our Services</h2>
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
        <h2>Join Us in Serving the Pilgrims</h2>
        <p>
          Your support helps us provide better services to thousands of pilgrims
          every year. Every contribution makes a difference.
        </p>
        <div className="cta-btns">
          <button className="btn btn-primary" onClick={() => navigate('/donation')}>
            Make a Donation
          </button>
          <button className="btn btn-white" onClick={() => navigate('/contact')}>
            Get in Touch
          </button>
        </div>
      </section>

      <SocialSection heading="Follow Us On Social Media" />
    </>
  );
}
