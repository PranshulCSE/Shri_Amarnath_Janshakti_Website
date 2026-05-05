import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';
import SocialSection from '../../components/common/SocialSection';
import './ContactPage.css';

const INIT = { name: '', email: '', phone: '', subject: '', message: '' };

export default function ContactPage() {
  const { language } = useLanguage();
  const t = T[language];

  const CONTACT_INFO = [
    { icon: '📞', title: t.contact_phone,  content: <>9466132732<br />9466132733<br />7015345275<br />9896362883</> },
    { icon: '📧', title: t.contact_email,      content: <a href="mailto:shriamarnathjanshakti@gmail.com">shriamarnathjanshakti@gmail.com</a> },
    { icon: '📍', title: t.contact_address,       content: <span dangerouslySetInnerHTML={{ __html: t.contact_address_val }} /> },
  ];

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
          <h2 className="hero-title">{t.contact_us}</h2>
          <p className="hero-sub">{t.contact_sub}</p>
          <p className="hero-desc">{t.contact_hero_desc}</p>
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
        <h2 className="section-title">{t.contact_info_title}</h2>
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
        <h2>{t.send_msg}</h2>
        <p>{t.send_msg_sub}</p>
        <div className="form-wrap contact-form-inner">
          {submitted && (
            <div className="success-msg">
              <i className="fas fa-check-circle" />
              {t.msg_success}
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
                <input name="name"    type="text"  placeholder={t.form_name} required value={form.name}    onChange={change} />
              </div>
              <div className="form-group">
                <input name="email"   type="email" placeholder={t.form_email} required value={form.email}   onChange={change} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input name="phone"   type="tel"   placeholder={t.form_phone} required value={form.phone}   onChange={change} />
              </div>
              <div className="form-group">
                <input name="subject" type="text"  placeholder={t.form_subject} value={form.subject} onChange={change} />
              </div>
            </div>
            <div className="form-group">
              <textarea name="message" placeholder={t.form_msg} rows={5} required value={form.message} onChange={change} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? t.form_sending : t.form_send}
            </button>
          </form>
        </div>
      </section>

      <SocialSection />
    </>
  );
}
