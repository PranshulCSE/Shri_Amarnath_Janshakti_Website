import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';
import SocialSection from '../../components/common/SocialSection';
import './DonationPage.css';

export default function DonationPage() {
  const { language } = useLanguage();
  const t = T[language];

  const WHAT_TO_DONATE = [
    { icon: '🍚', title: t.donate_ration,         desc: t.donate_ration_desc },
    { icon: '🧥', title: t.donate_clothes,  desc: t.donate_clothes_desc },
    { icon: '🥾', title: t.donate_shoes, desc: t.donate_shoes_desc },
    { icon: '💰', title: t.donate_money,          desc: t.donate_money_desc },
  ];

  const DIGITAL = [
    { icon: '📱', title: 'UPI Transfer', desc: <span dangerouslySetInnerHTML={{ __html: t.upi_desc }} /> },
    { icon: '💳', title: 'Google Pay',   desc: <span dangerouslySetInnerHTML={{ __html: t.gpay_desc }} /> },
    { icon: '🏧', title: t.by_cheque,  desc: <span dangerouslySetInnerHTML={{ __html: t.cheque_desc }} /> },
    { icon: '🎁', title: t.direct_donation,    desc: <span dangerouslySetInnerHTML={{ __html: t.direct_desc }} /> },
  ];

  const INIT = { name: '', email: '', phone: '', amount: '', message: '', transactionId: '' };

  const [form, setForm]        = useState(INIT);
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview]  = useState(null);
  
  const [submitted, setSubmit] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState('');
  const [copyMsg, setCopyMsg]  = useState('');
  const fileRef = useRef(null);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Maximum file size is 10MB.');
        setScreenshot(null);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
        return;
      }
      setScreenshot(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText('9466132732@ibl');
    setCopyMsg('Copied!');
    setTimeout(() => setCopyMsg(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!screenshot) {
      setError('Please upload the payment screenshot to proceed.');
      setLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => fd.append(k, form[k]));
      fd.append('screenshot', screenshot);

      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
      const res = await fetch(`${apiBase}/api/donations`, { 
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit');
      }

      setSubmit(true);
      setForm(INIT);
      setScreenshot(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h2 className="hero-title">{t.donation_title}</h2>
          <p className="hero-sub">{t.donation_sub}</p>
          <p className="hero-desc">
            {t.donation_hero_desc}
          </p>
          <a href="#donation-methods" className="btn btn-primary">
            {t.donate_now_btn}
          </a>
        </div>
        <div className="hero-img-box">
          <img
            src="/Images/Base-Camp_mandir.jpeg"
            alt="Donation"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="hero-placeholder">💰</div>';
            }}
          />
        </div>
      </section>

      {/* What to Donate */}
      <section className="section">
        <h2 className="section-title">{t.what_to_donate}</h2>
        <div className="cards-grid">
          {WHAT_TO_DONATE.map((d) => (
            <div className="card" key={d.title}>
              <span className="card-icon">{d.icon}</span>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UPI Section */}
      <section className="cta-section" id="donation-methods">
        <h2>{t.scan_qr_title}</h2>
        <p>{t.scan_qr_sub}</p>
        
        <div className="upi-box">
          <div className="qr-wrapper">
            <img
              src="/Images/qr.png.jpg"
              alt="Donation QR Code"
              className="qr-img"
              onError={(e) => {
                e.target.outerHTML = '<div class="qr-fallback">📱<p>UPI: 9466132732@ibl</p></div>';
              }}
            />
          </div>
          
          <div className="upi-text">
            <h3>UPI ID</h3>
            <div className="upi-copy-box">
              <span>9466132732@ibl</span>
              <button className="copy-btn" onClick={copyUpi} title="Copy UPI ID">
                <i className={copyMsg ? "fas fa-check" : "far fa-copy"}></i> {copyMsg || 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Details & Digital options */}
      <section className="section">
        <div className="donation-methods-grid">
          <div className="bank-card">
            <h3>🏦 {t.bank_transfer_title}</h3>
            <div className="bank-details">
              <p><span>{t.account_name}</span> SHRI AMARNATH JANSHAKTI SEWA MANDAL</p>
              <p><span>{t.bank_name}</span> HDFC BANK</p>
              <p><span>{t.account_no}</span> 50200109501402</p>
              <p><span>{t.ifsc_code}</span> HDFC0003989</p>
            </div>
          </div>
          
          <div className="digital-grid">
            {DIGITAL.map((d) => (
              <div className="digital-card" key={d.title}>
                <span className="digital-icon">{d.icon}</span>
                <div>
                  <h4>{d.title}</h4>
                  <p>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section don-form-section" id="donation-form">
        <h2 className="section-title">{t.enter_donation_details}</h2>
        <p style={{textAlign: 'center', marginBottom: 30, color: 'rgba(255,255,255,0.7)'}}>{t.form_note}</p>
        
        <div className="form-wrap donation-form-wrap">
          {submitted && (
            <div className="success-msg">
              <i className="fas fa-check-circle" />
              <div>
                <strong>{t.thank_you}</strong>
                <p>{t.donation_success}</p>
              </div>
            </div>
          )}
          {error && (
            <div className="error-msg">
              <i className="fas fa-exclamation-circle" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>{t.form_name} *</label>
                <input name="name" type="text" placeholder="e.g. Rahul Kumar" required value={form.name} onChange={change} />
              </div>
              <div className="form-group">
                <label>{t.form_email} *</label>
                <input name="email" type="email" placeholder="e.g. rahul@example.com" required value={form.email} onChange={change} />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>{t.form_phone} *</label>
                <input name="phone" type="tel" placeholder="10-digit mobile number" required value={form.phone} onChange={change} />
              </div>
              <div className="form-group">
                <label>{t.form_amount} *</label>
                <input name="amount" type="number" min="100" placeholder="Minimum ₹100" required value={form.amount} onChange={change} />
              </div>
            </div>

            <div className="form-group">
              <label>{t.form_utr} *</label>
              <input name="transactionId" type="text" placeholder="12-digit UTR Number" required value={form.transactionId} onChange={change} />
              <p className="field-hint">{t.utr_hint}</p>
            </div>
            
            <div className="form-group">
              <label>{t.form_screenshot} * <span className="file-hint">(Max 2MB, JPG/PNG)</span></label>
              <div className="file-upload-box">
                <input type="file" ref={fileRef} accept="image/jpeg, image/png" required onChange={handleFile} id="screenshot-upload" />
                <label htmlFor="screenshot-upload" className="file-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{screenshot ? screenshot.name : 'Choose File or Drag & Drop'}</span>
                </label>
              </div>
              {preview && (
                <div className="screenshot-preview">
                  <img src={preview} alt="Payment Screenshot" />
                  <button type="button" onClick={() => { setScreenshot(null); setPreview(null); if(fileRef.current) fileRef.current.value=''; }}>
                    <i className="fas fa-times"></i> Remove
                  </button>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label>{t.form_msg}</label>
              <textarea name="message" placeholder="Optional message..." rows={3} value={form.message} onChange={change} />
            </div>
            
            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Details Sending...</>
              ) : (
                <><i className="fas fa-paper-plane"></i> {t.form_submit_details}</>
              )}
            </button>
          </form>
        </div>
      </section>

      <SocialSection />
    </>
  );
}
