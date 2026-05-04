import React, { useState, useEffect } from 'react';
import SocialSection from '../../components/common/SocialSection';
import './GalleryPage.css';

const FALLBACK_ITEMS = [
  { _id: 'f1', src: '/Images/Governer.jpeg', alt: 'प्रशंसा पत्र', title: 'प्रशंसा पत्र', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के सेक्रेटरी बृज-मोहन पुरी जी को प्रशंसा पत्र देते उपराज्यपाल श्री मनोज सिन्हा जी।', fallback: '🎖️' },
  { _id: 'f2', src: '/Images/Kanhaiya-Mittal.jpeg', alt: 'कन्हैया मित्तल', title: 'कन्हैया मित्तल जी', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के सदस्य श्री मान कन्हैया मित्तल जी को बाबा बर्फानी जी का प्रसाद देते हुए।', fallback: '🙏' },
  { _id: 'f3', src: '/Images/Base Camp.jpeg', alt: 'बेस कैम्प', title: 'बालटाल स्थित बेस कैम्प', description: 'बाबा अमरनाथ बर्फानी जी के श्री चरणों में स्थित श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के बेस कैम्प के दर्शन।', fallback: '⛺' },
  { _id: 'f4', src: '/Images/Domail-Langar.jpg', alt: 'लंगर ', title: 'दोमेल , बालटाल  लंगर सेवा 2024', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के साल 2024 के लंगर के दर्शन ', fallback: '🍲' },
  { _id: 'f5', src: '/Images/Member.jpg', alt: 'सदस्य', title: 'श्री अमरनाथ जनशक्ति सेवा मण्डल के सभी सदस्य  ', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के सभी सदस्य एक शाम भोले बाबा जी के नाम मे ', fallback: '🍲' },
  { _id: 'f6', src: '/Images/Krishna-Mandir.jpg', alt: 'सदस्य ', title: 'आस्था  ', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के सभी सदस्य प्रत्येक वर्ष आयोजित होने वाली माता राय की चोंकी मे माथा टेकते हुए।  ', fallback: '🎖️' },
  { _id: 'f7', src: '/Images/Domail-Mandir.jpg', alt: 'मंदिर ', title: 'दोमेल लंगर स्थित मंदिर के दर्शन ', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के दोमेल लंगर स्थित मंदिर के दर्शन ।', fallback: '🙏' },
  { _id: 'f8', src: '/Images/Medical.jpg', alt: 'बेस कैम्प', title: 'दोमेल स्थित लंगर मे फ्री मेडिकल कैम्प', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के लंगर मे 24 घंटे फ्री मेडिकल सेवा के दर्शन।', fallback: '⛺' },
  { _id: 'f9', src: '/Images/Brari-Officers.jpeg', alt: 'बराड़ी मार्ग', title: 'बराड़ी मार्ग लंगर सेवा 2025', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के सेवादार बराड़ी मार्ग पर लंगर समापन के पश्चात सभी अधिकारियों से विदा लेते हुए।', fallback: '🍲' },
  { _id: 'f10', src: '/Images/Aligarh.jpg', alt: 'शाखाएं ', title: 'अलीगढ़ शाखा के सदस्य  ', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के सदस्य अलीगढ़ शाखा के साथ ', fallback: '🍲' },
  { _id: 'f11', src: '/Images/Gujrat.heic ', alt: 'शाखाएं ', title: 'सूरत शाखा के सदस्य  ', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल का सूरत शाखा का परिवार बाबा के चरणों मे ', fallback: '🍲' },
  { _id: 'f12', src: '/Images/Domail-Langar2.jpg', alt: 'लंगर', title: 'दोमेल , बालटाल  लंगर सेवा 2024 ', description: 'श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल के लंगर के रात्रि सेवा दर्शन ', fallback: '🍲' },
];

export default function GalleryPage() {
  const [items, setItems] = useState(FALLBACK_ITEMS);

  useEffect(() => {
    async function load() {
      try {
        const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
        const res = await fetch(`${apiBase}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          // API actually returns { data: [...] } for paginated photos
          const photos = data.data || (Array.isArray(data) ? data : []);
          if (photos.length > 0) {
            setItems(photos.map(p => ({
              _id: p._id,
              src: p.imagePath,
              alt: p.title,
              title: p.title,
              description: p.description || '',
              fallback: '🖼️',
            })));
          }
        }
      } catch (e) {
        // keep fallback items
      }
    }
    load();
  }, []);

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
            src="/Images/Domail-Mandir2.jpg"
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
        <div className="modern-gallery-grid">
          {items.map((item) => (
            <div className="modern-gallery-card" key={item._id}>
              <img
                src={item.src}
                alt={item.alt || item.title}
                className="gallery-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('fallback');
                  e.target.parentElement.innerHTML =
                    `<span class="gallery-fallback">${item.fallback}</span>`;
                }}
              />
              <div className="gallery-overlay">
                <div className="gallery-content">
                  <h3 className="gallery-card-title">{item.title}</h3>
                  {item.description && (
                    <p className="gallery-card-desc">{item.description}</p>
                  )}
                </div>
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
