import React from 'react';
import SocialSection from '../../components/common/SocialSection';
import './AboutPage.css';

const VALUES = [
  { icon: '🙏', title: 'सेवा की भावना',      desc: 'मानवता की सेवा करना और प्रत्येक यात्री की देखभाल करना हमारा प्रमुख उद्देश्य है।' },
  { icon: '❤️', title: 'आध्यात्मिक समर्थन', desc: 'यात्रियों को उनकी पवित्र यात्रा में आध्यात्मिक मार्गदर्शन प्रदान करना।' },
  { icon: '🤝', title: 'समुदाय सहयोग',       desc: 'समाज के सभी वर्गों के साथ मिलकर काम करने का विश्वास रखते हैं।' },
  { icon: '✨', title: 'समर्पण',              desc: 'हमारे स्वयंसेवक पूरी निष्ठा और समर्पण के साथ सेवा करते हैं।' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h2 className="hero-title">Who are we?</h2>
          <p className="hero-sub">Shri Amarnath JanShakti Sewa Mandal (Regd.), Karnal</p>
          <p className="hero-desc">
            A registered non-profit society dedicated to selfless service of
            Shri Amarnath Ji pilgrims since 2011.
          </p>
        </div>
        <div className="hero-img-box">
          <img
            src="/Images/Yatra2.jpg"
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
          <h2>हम कौन हैं?</h2>
          <p>
            श्री अमरनाथ जनशक्ति सेवा मंडल एक पंजीकृत, गैर-लाभकारी, सामाजिक एवं
            धार्मिक संस्था है, जिसकी स्थापना श्री अमरनाथ जी यात्रा के दौरान
            श्रद्धालुओं की निःस्वार्थ सेवा के उद्देश्य से की गई। हमारा संगठन{' '}
            <strong>"सेवा ही धर्म है"</strong> के सिद्धांत पर कार्य करता है।
          </p>
          <p>
            हमारा मुख्य उद्देश्य हर वर्ष आयोजित होने वाली पवित्र श्री अमरनाथ जी
            यात्रा में देश-विदेश से आने वाले यात्रियों को निःशुल्क लंगर सेवा, स्वच्छ
            पेयजल, प्राथमिक चिकित्सा सहायता तथा आवश्यक मार्गदर्शन प्रदान करना है।
          </p>

          <h3>🌟 हमारी प्रेरणा</h3>
          <p>
            श्री अमरनाथ जी की पावन यात्रा केवल एक धार्मिक यात्रा नहीं है, बल्कि यह
            आस्था, त्याग, अनुशासन और आत्मबल की परीक्षा भी है। हम मानते हैं कि{' '}
            <strong>यात्री की सेवा, स्वयं भगवान शिव की सेवा के समान है।</strong>
          </p>

          <h3>🎯 हमारा उद्देश्य</h3>
          <ul>
            <li>श्री अमरनाथ जी यात्रियों को निःशुल्क, पौष्टिक एवं स्वच्छ भोजन (लंगर) उपलब्ध कराना</li>
            <li>यात्रियों को प्राथमिक चिकित्सा एवं आपातकालीन सहायता प्रदान करना</li>
            <li>बुजुर्ग, महिला एवं दिव्यांग यात्रियों को विशेष सहयोग देना</li>
            <li>यात्रा मार्ग पर स्वच्छता एवं अनुशासन बनाए रखने में सहयोग करना</li>
            <li>समाज में सेवा, सहयोग एवं भाईचारे की भावना को प्रोत्साहित करना</li>
          </ul>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <h2 className="section-title">हमारे मूल्य और उद्देश्य</h2>
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
        <h2>संगठन की जानकारी</h2>
        <div className="org-details">
          <p><strong>पंजीकरण संख्या:</strong> 01104</p>
          <p><strong>स्थापना:</strong> श्री अमरनाथ यात्रियों की सेवा के लिए</p>
          <p><strong>कार्यालय:</strong> H.No. 186/5, गांधी नगर, करनाल, हरियाणा (132001)</p>
          <p><strong>संपर्क सूत्र:</strong> 9466132732, 9466132733, 7015345275, 9996181668</p>
        </div>
      </section>

      <SocialSection />
    </>
  );
}
