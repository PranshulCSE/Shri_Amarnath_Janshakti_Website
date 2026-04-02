import React, { useState } from 'react';
import SocialSection from '../common/SocialSection';
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

const INIT = { name: '', email: '', phone: '', amount: '', message: '' };

export default function DonationPage() {
  const [form, setForm]       = useState(INIT);
  const [submitted, setSubmit] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmit(true);
    setForm(INIT);
    setTimeout(() => setSubmit(false), 5000);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h2 className="hero-title">आपका सहयोग – हमारी शक्ति</h2>
          <p className="hero-sub">यात्रियों की सहायता के लिए आपका योगदान</p>
          <p className="hero-desc">
            आपका छोटा-सा योगदान भी श्री अमरनाथ जी यात्रियों की सेवा में बड़ा
            परिवर्तन ला सकता है। आपके दान से हम निःशुल्क लंगर सेवा और आवश्यक
            सुविधाएँ निरंतर प्रदान कर पाते हैं।
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

      {/* Bank Transfer */}
      <section className="cta-section" id="donation-methods">
        <h2>Ways to Donate</h2>
        <p>You can Donate to us by following ways</p>
        <div className="bank-box">
          <h3>🏦 Bank Transfer</h3>
          <p><strong>A/C Name:</strong> SHRI AMARNATH JANSHAKTI SEWA MANDAL</p>
          <p><strong>Bank:</strong> HDFC BANK</p>
          <p><strong>A/C No.:</strong> 50200109501402</p>
          <p><strong>IFSC Code:</strong> HDFC0003989</p>
        </div>
      </section>

      {/* Digital Methods */}
      <section className="section">
        <h2 className="section-title">डिजिटल भुगतान विकल्प</h2>
        <div className="cards-grid">
          {DIGITAL.map((d) => (
            <div className="card" key={d.title}>
              <span className="card-icon">{d.icon}</span>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR Code */}
      <section className="cta-section">
        <h2>QR कोड स्कैन करके दान करें</h2>
        <p>नीचे दिए गए QR कोड को स्कैन करके तुरंत दान कर सकते हैं</p>
        <img
          src="/Images/qr.png.jpg"
          alt="Donation QR Code"
          className="qr-img"
          onError={(e) => {
            e.target.outerHTML =
              '<div class="qr-fallback">📱<p>UPI: 9466132732@ibl</p></div>';
          }}
        />
        <p className="qr-label">UPI ID: 9466132732@ibl</p>
      </section>

      {/* Donation Form */}
      <section className="section don-form-section">
        <h2 className="section-title">ऑनलाइन दान फॉर्म</h2>
        <div className="form-wrap">
          {submitted && (
            <div className="success-msg">
              <i className="fas fa-check-circle" />
              धन्यवाद! आपका दान प्रपत्र सफलतापूर्वक भेजा गया। 🙏
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input name="name"  type="text"  placeholder="आपका नाम *"         required value={form.name}   onChange={change} />
              </div>
              <div className="form-group">
                <input name="email" type="email" placeholder="आपका ईमेल *"         required value={form.email}  onChange={change} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <input name="phone"  type="tel"    placeholder="आपका फोन नंबर *"   required value={form.phone}  onChange={change} />
              </div>
              <div className="form-group">
                <input name="amount" type="number" placeholder="दान की राशि (₹) *" required value={form.amount} onChange={change} />
              </div>
            </div>
            <div className="form-group">
              <textarea name="message" placeholder="आपका संदेश (वैकल्पिक)" rows={4} value={form.message} onChange={change} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              दान पूरा करें
            </button>
          </form>
        </div>
      </section>

      <SocialSection />
    </>
  );
}
