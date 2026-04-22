import React, { useState } from 'react';
import SocialSection from '../../components/common/SocialSection';
import './ContactPage.css';

const CONTACT_INFO = [
  { icon: '📞', title: 'फोन नंबर',  content: <>9466132732<br />9466132733<br />7015345275<br />9896362883</> },
  { icon: '📧', title: 'ईमेल',      content: <a href="mailto:shriamarnathjanshakti@gmail.com">shriamarnathjanshakti@gmail.com</a> },
  { icon: '📍', title: 'पता',       content: <>H.No. 186/5, गांधी नगर<br />करनाल, हरियाणा (132001)<br />भारत</> },
];

const INIT = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const [form, setForm]        = useState(INIT);
  const [submitted, setSubmit] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${apiUrl}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get('content-type') || '';
      let data = {};

      if (contentType.includes('application/json')) {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      }

      if (!res.ok) {
        throw new Error(data.message || `Server error (${res.status})`);
      }

      setSubmit(true);
      setForm(INIT);
      setTimeout(() => setSubmit(false), 5000);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Backend may be down.');
      } else {
        setError(err.message || 'Failed to send message');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h2 className="hero-title">हमसे संपर्क करें</h2>
          <p className="hero-sub">हमारी टीम आपकी सेवा के लिए हमेशा तैयार है</p>
          <p className="hero-desc">
            किसी भी सवाल, सुझाव या सेवा के लिए हमसे संपर्क करें — हम जल्द ही
            आपसे संपर्क करेंगे।
          </p>
        </div>
        <div className="hero-img-box">
          <img
            src="/Images/Yatra2.jpg"
            alt="Contact Us"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="hero-placeholder">📞</div>';
            }}
          />
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section">
        <h2 className="section-title">संपर्क जानकारी</h2>
        <div className="contact-info-grid">
          {CONTACT_INFO.map((c) => (
            <div className="info-card" key={c.title}>
              <span className="info-icon">{c.icon}</span>
              <h3>{c.title}</h3>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="cta-section">
        <h2>हमें एक संदेश भेजें</h2>
        <p>
          कृपया नीचे दिए गए फॉर्म को भरें और हम जल्द ही आपसे संपर्क करेंगे
        </p>
        <div className="form-wrap contact-form-inner">
          {submitted && (
            <div className="success-msg">
              <i className="fas fa-check-circle" />
              धन्यवाद! आपका संदेश सफलतापूर्वक भेजा गया। 🙏
            </div>
          )}
          {error && (
            <div className="success-msg" style={{ background: 'rgba(255,70,70,0.1)', borderColor: 'rgba(255,70,70,0.3)', color: '#ff6b6b' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input name="name"    type="text"  placeholder="आपका नाम *"            required value={form.name}    onChange={change} />
              </div>
              <div className="form-group">
                <input name="email"   type="email" placeholder="आपका ईमेल *"            required value={form.email}   onChange={change} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input name="phone"   type="tel"   placeholder="आपका फोन नंबर *"        required value={form.phone}   onChange={change} />
              </div>
              <div className="form-group">
                <input name="subject" type="text"  placeholder="विषय (वैकल्पिक)"                  value={form.subject} onChange={change} />
              </div>
            </div>
            <div className="form-group">
              <textarea name="message" placeholder="आपका संदेश *" rows={5} required value={form.message} onChange={change} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'भेज रहे हैं...' : 'संदेश भेजें'}
            </button>
          </form>
        </div>
      </section>

      <SocialSection />
    </>
  );
}
