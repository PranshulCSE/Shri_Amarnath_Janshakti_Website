import React, { useState, useRef } from 'react';
import SocialSection from '../../components/common/SocialSection';
import './DonationPage.css';

const WHAT_TO_DONATE = [
  { icon: '🍚', title: 'राशन सामग्री',         desc: 'आटा, चावल, दालें, चीनी, रिफाइंड तेल, देसी घी, मसाले, सूखा दूध पाउडर, ड्राई फ्रूट्स।' },
  { icon: '🧥', title: 'कंबल एवं गर्म कपड़े',  desc: 'कंबल, गर्म जैकेट, स्वेटर, ऊनी कपड़े, दस्ताने, मोज़े और टोपी।' },
  { icon: '🥾', title: 'जूते एवं अन्य वस्तुएँ', desc: 'मजबूत जूते, चप्पल, रेनकोट, रेन कवर और अन्य दैनिक उपयोग की वस्तुएँ।' },
  { icon: '💰', title: 'आर्थिक सहयोग',          desc: 'आपका योगदान सीधे राशन, चिकित्सा सहायता और सेवा व्यवस्थाओं में उपयोग किया जाता है।' },
];

const DIGITAL = [
  { icon: '📱', title: 'UPI ट्रांसफर', desc: <><strong>UPI ID:</strong> 9466132732@ibl<br />किसी भी UPI ऐप से तुरंत भुगतान करें</> },
  { icon: '💳', title: 'Google Pay',   desc: <><strong>नंबर:</strong> 9466132732<br />Google Pay ऐप के जरिए दान करें</> },
  { icon: '🏧', title: 'चेक द्वारा',  desc: <>संस्था के नाम से चेक भेजें<br />H.No. 186/5, गांधी नगर, करनाल</> },
  { icon: '🎁', title: 'सीधे दान',    desc: <>हमारे कार्यालय में व्यक्तिगत रूप से दान दें<br />📞 9466132732</> },
];

const INIT = { name: '', email: '', phone: '', amount: '', message: '', transactionId: '' };

export default function DonationPage() {
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
          <h2 className="hero-title">आपका सहयोग – हमारी शक्ति</h2>
          <p className="hero-sub">यात्रियों की सहायता के लिए आपका योगदान</p>
          <p className="hero-desc">
            आपका छोटा-सा योगदान भी श्री अमरनाथ जी यात्रियों की सेवा में बड़ा परिवर्तन ला सकता है। 
            आपके दान से हम निःशुल्क लंगर सेवा और आवश्यक सुविधाएँ निरंतर प्रदान कर पाते हैं।
          </p>
          <a href="#donation-methods" className="btn btn-primary">
            अभी दान करें
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
        <h2 className="section-title">आप क्या दान कर सकते हैं</h2>
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
        <h2>QR कोड स्कैन करके दान करें</h2>
        <p>नीचे दिए गए QR कोड को स्कैन करके तुरंत दान कर सकते हैं</p>
        
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
            <h3>🏦 Bank Transfer Details</h3>
            <div className="bank-details">
              <p><span>Account Name</span> SHRI AMARNATH JANSHAKTI SEWA MANDAL</p>
              <p><span>Bank Name</span> HDFC BANK</p>
              <p><span>Account No.</span> 50200109501402</p>
              <p><span>IFSC Code</span> HDFC0003989</p>
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
        <h2 className="section-title">दान विवरण दर्ज करें</h2>
        <p style={{textAlign: 'center', marginBottom: 30, color: 'rgba(255,255,255,0.7)'}}>दान करने के पश्चात कृपया स्क्रीनशॉट के साथ नीचे दिया गया प्रपत्र भरें।</p>
        
        <div className="form-wrap donation-form-wrap">
          {submitted && (
            <div className="success-msg">
              <i className="fas fa-check-circle" />
              <div>
                <strong>धन्यवाद!</strong>
                <p>आपका दान प्रपत्र सफलतापूर्वक प्राप्त हुआ। हम शीघ्र ही इसकी पुष्टि करेंगे। 🙏</p>
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
                <label>आपका नाम *</label>
                <input name="name" type="text" placeholder="e.g. Rahul Kumar" required value={form.name} onChange={change} />
              </div>
              <div className="form-group">
                <label>ईमेल *</label>
                <input name="email" type="email" placeholder="e.g. rahul@example.com" required value={form.email} onChange={change} />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>फोन नंबर *</label>
                <input name="phone" type="tel" placeholder="10-digit mobile number" required value={form.phone} onChange={change} />
              </div>
              <div className="form-group">
                <label>दान की राशि (₹) *</label>
                <input name="amount" type="number" min="100" placeholder="Minimum ₹100" required value={form.amount} onChange={change} />
              </div>
            </div>

            <div className="form-group">
              <label>ट्रांजैक्शन आईडी / UTR नंबर *</label>
              <input name="transactionId" type="text" placeholder="12-digit UTR Number" required value={form.transactionId} onChange={change} />
              <p className="field-hint">पेमेंट के बाद प्राप्त होने वाला 12-अंकों का UTR नंबर यहाँ दर्ज करें।</p>
            </div>
            
            <div className="form-group">
              <label>पेमेंट का स्क्रीनशॉट * <span className="file-hint">(Max 2MB, JPG/PNG)</span></label>
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
              <label>आपका संदेश (वैकल्पिक)</label>
              <textarea name="message" placeholder="Optional message..." rows={3} value={form.message} onChange={change} />
            </div>
            
            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin"></i> Details Sending...</>
              ) : (
                <><i className="fas fa-paper-plane"></i> Submit Details</>
              )}
            </button>
          </form>
        </div>
      </section>

      <SocialSection />
    </>
  );
}
