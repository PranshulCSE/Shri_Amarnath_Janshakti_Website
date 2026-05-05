import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';
import SocialSection from '../../components/common/SocialSection';
import './GalleryPage.css';

export default function GalleryPage() {
  const { language } = useLanguage();
  const t = T[language];

  const FALLBACK_ITEMS = [
    { _id: 'f1', src: '/Images/Governer.jpeg', alt: 'प्रशंसा पत्र', title: t.gal_1_title, description: t.gal_1_desc, fallback: '🎖️' },
    { _id: 'f2', src: '/Images/Kanhaiya-Mittal.jpeg', alt: 'कन्हैया मित्तल', title: t.gal_2_title, description: t.gal_2_desc, fallback: '🙏' },
    { _id: 'f3', src: '/Images/Base Camp.jpeg', alt: 'बेस कैम्प', title: t.gal_3_title, description: t.gal_3_desc, fallback: '⛺' },
    { _id: 'f4', src: '/Images/Domail-Langar.jpg', alt: 'लंगर ', title: t.gal_4_title, description: t.gal_4_desc, fallback: '🍲' },
    { _id: 'f5', src: '/Images/Member.jpg', alt: 'सदस्य', title: t.gal_5_title, description: t.gal_5_desc, fallback: '🍲' },
    { _id: 'f6', src: '/Images/Krishna-Mandir.jpg', alt: 'सदस्य ', title: t.gal_6_title, description: t.gal_6_desc, fallback: '🎖️' },
    { _id: 'f7', src: '/Images/Domail-Mandir.jpg', alt: 'मंदिर ', title: t.gal_7_title, description: t.gal_7_desc, fallback: '🙏' },
    { _id: 'f8', src: '/Images/Medical.jpg', alt: 'बेस कैम्प', title: t.gal_8_title, description: t.gal_8_desc, fallback: '⛺' },
    { _id: 'f9', src: '/Images/Brari-Officers.jpeg', alt: 'बराड़ी मार्ग', title: t.gal_9_title, description: t.gal_9_desc, fallback: '🍲' },
    { _id: 'f10', src: '/Images/Aligarh.jpg', alt: 'शाखाएं ', title: t.gal_10_title, description: t.gal_10_desc, fallback: '🍲' },
    { _id: 'f11', src: '/Images/Domail-Mandir3.jpg ', alt: 'लंगर', title: t.gal_11_title, description: t.gal_11_desc, fallback: '🍲' },
    { _id: 'f12', src: '/Images/Domail-Langar2.jpg', alt: 'लंगर', title: t.gal_12_title, description: t.gal_12_desc, fallback: '🍲' },
  ];

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
          <h2 className="hero-title">{t.our_gallery}</h2>
          <p className="hero-sub">{t.moments_of_seva}</p>
          <p className="hero-desc">
            {t.gallery_hero_desc}
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
        <h2 className="section-title">{t.moments}</h2>
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
        <h2 className="section-title">{t.see_more}</h2>
        <div className="gallery-more-btn">
          <a
            href="https://drive.google.com/drive/folders/1H3uPef6Vf-LqKUwc7g1i3uVjCtNQuxwm?usp=sharing"
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fas fa-images" style={{ marginRight: 8 }} />
            {t.more_photos_btn}
          </a>
        </div>
      </section>

      <SocialSection heading={t.social_heading} />
    </>
  );
}
