import React from 'react';
import SocialSection from '../common/SocialSection';
import './GalleryPage.css';

const GALLERY_ITEMS = [
  {
    src:   '/Images/Governer.jpeg',
    alt:   'प्रशंसा पत्र',
    title: 'प्रशंसा पत्र',
    desc:  'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के सेक्रेटरी बृज-मोहन पुरी जी को प्रशंसा पत्र देते उपराज्यपाल श्री मनोज सिन्हा जी।',
    fallback: '🎖️',
  },
  {
    src:   '/Images/Kanhaiya-Mittal.jpeg',
    alt:   'कन्हैया मित्तल',
    title: 'कन्हैया मित्तल जी',
    desc:  'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के सदस्य श्री मान कन्हैया मित्तल जी को बाबा बर्फानी जी का प्रसाद देते हुए।',
    fallback: '🙏',
  },
  {
    src:   '/Images/Base Camp.jpeg',
    alt:   'बेस कैम्प',
    title: 'बालटाल स्थित बेस कैम्प',
    desc:  'बाबा अमरनाथ बर्फानी जी के श्री चरणों में स्थित श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के बेस कैम्प के दर्शन।',
    fallback: '⛺',
  },
  {
    src:   '/Images/Brari-Officers.jpeg',
    alt:   'बराड़ी मार्ग',
    title: 'बराड़ी मार्ग लंगर सेवा 2025',
    desc:  'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के सेवादार बराड़ी मार्ग पर लंगर समापन के पश्चात सभी अधिकारियों से विदा लेते हुए।',
    fallback: '🍲',
  },
];

export default function GalleryPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h2 className="hero-title">हमारी गैलरी</h2>
          <p className="hero-sub">सेवा के क्षणों को देखें</p>
          <p className="hero-desc">
            पवित्र यात्रा में हमारी सेवा के अनमोल पल — हर तस्वीर एक कहानी कहती है।
          </p>
        </div>
        <div className="hero-img-box">
          <img
            src="/Images/Holy Cave.jpeg"
            alt="Holy Cave"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="hero-placeholder">🏔️</div>';
            }}
          />
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section">
        <h2 className="section-title">सेवा के पल</h2>
        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item) => (
            <div className="gallery-card" key={item.title}>
              <div className="gallery-img-wrap">
                <img
                  src={item.src}
                  alt={item.alt}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('fallback');
                    e.target.parentElement.setAttribute(
                      'data-fallback',
                      item.fallback
                    );
                    e.target.parentElement.innerHTML =
                      `<span class="gallery-fallback">${item.fallback}</span>`;
                  }}
                />
              </div>
              <div className="gallery-card-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* More Link */}
      <section className="section gallery-more">
        <h2 className="section-title">और देखें</h2>
        <div className="gallery-more-btn">
          <a
            href="https://drive.google.com/drive/folders/1H3uPef6Vf-LqKUwc7g1i3uVjCtNQuxwm?usp=sharing"
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fas fa-images" style={{ marginRight: 8 }} />
            Click here to see More Photos
          </a>
        </div>
      </section>

      <SocialSection />
    </>
  );
}
