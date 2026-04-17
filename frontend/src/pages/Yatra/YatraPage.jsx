import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SocialSection from '../../components/common/SocialSection';
import './YatraPage.css';

const FALLBACK_BTNS = [
  { href: 'https://jksasb.nic.in/', icon: 'fas fa-heartbeat', label: 'Shri Amarnath Ji Shrine Board' },
  { href: 'https://jksasb.nic.in/onlineservices/index.html', icon: 'fas fa-edit', label: 'यात्रा के लिए रजिस्टर करें' },
  { href: '/Docs/Bank_List(SANJY-26).pdf', icon: 'fas fa-university', label: 'नामित बैंक', download: true },
  { href: '/Docs/CHC.pdf', icon: 'fas fa-file-medical', label: 'चिकित्सा फॉर्म डाउनलोड करें', download: true },
  { href: '/Docs/Application-Form-2025.pdf', icon: 'fas fa-file-alt', label: 'पंजीकरण फॉर्म डाउनलोड करें', download: true },
];

const ROUTES = [
  { icon: '✈️', title: 'हवाई मार्ग से',  lines: ['निकटतम हवाई अड्डा: श्रीनगर अंतर्राष्ट्रीय', 'श्रीनगर से पहलगांव: ~89 किमी', 'श्रीनगर से बालटाल: ~97 किमी'] },
  { icon: '🚂', title: 'रेल मार्ग से',   lines: ['निकटतम स्टेशन: श्रीनगर या जम्मू', 'जम्मू से पहलगांव: 230 किमी', 'बसें और टैक्सी उपलब्ध हैं'] },
  { icon: '🚗', title: 'सड़क मार्ग से', lines: ['दो मुख्य मार्ग:', '1. पहलगांव मार्ग: 48 किमी ट्रेक (5 दिन)', '2. बालटाल मार्ग: 14 किमी ट्रेक (1 दिन)'] },
];

const TIPS = [
  { icon: '🏃', title: 'शारीरिक फिटनेस',    text: 'यात्रा से कम से कम 1.5 महीने पहले फिटनेस प्रशिक्षण शुरू करें।' },
  { icon: '❄️', title: 'उचित कपड़े',         text: 'गर्म कपड़े, जलरोधी जैकेट और मजबूत ट्रेकिंग जूते पैक करें।' },
  { icon: '💊', title: 'स्वास्थ्य सावधानियां', text: 'निर्धारित दवाएं और प्राथमिक चिकित्सा की आपूर्ति ले जाएं।' },
  { icon: '💧', title: 'हाइड्रेटेड रहें',    text: 'पूरे समय पानी पिएं। शराब और अत्यधिक कैफीन से बचें।' },
  { icon: '🧘', title: 'अभ्यस्त होना',       text: 'अपने शरीर को ऊंचाई के अनुसार धीरे-धीरे समायोजित करने दें।' },
  { icon: '🎒', title: 'हल्का पैक करें',     text: 'केवल आवश्यक वस्तुएं ले जाएं। हल्का बैकपैक बेहतर है।' },
];

const DOS = [
  'सुबह जल्दी ट्रेक शुरू करें',
  'पूरी यात्रा के दौरान हाइड्रेटेड रहें',
  'प्रशासन द्वारा निर्धारित निर्देशों का सम्मान करें',
  'सुरक्षा दिशानिर्देशों का कड़ाई से पालन करें',
  'व्यक्तिगत स्वच्छता बनाए रखें',
  'अन्य तीर्थयात्रियों के प्रति सम्मानपूर्ण रहें',
  'आर-एफ-आई-डी कार्ड हमेशा गले में पहनें',
  'जरूरत होने पर आराम लें',
  'उचित जूते पहनें',
  'आपातकालीन स्थिति में नजदीक लंगर पर पहुँचें',
];

const DONTS = [
  'अकेले या रात में ट्रेक न करें',
  'चेतावनी के संकेतों को अनदेखा न करें',
  'शराब का सेवन न करें',
  'पर्यावरण को प्रदूषित न करें',
  'उचित फिटनेस के बिना ट्रेक न करें',
  'ऊंचाई की बीमारी के लक्षणों को अनदेखा न करें',
  'अपरिचित शॉर्टकट न लें',
  'अपनी सीमा से अधिक जोर न लगाएं',
  'मूल्यवान वस्तुओं को बिना निगरानी न छोड़ें',
  'स्थानीय संस्कृति का अनादर न करें',
];

const LANGAR_POINTS = [
  ['पोषण और ऊर्जा',   'तीर्थयात्रियों को गर्म, पौष्टिक भोजन प्रदान करना'],
  ['स्वास्थ्य और ऊर्जा', 'पूरी ट्रेक में तीर्थयात्रियों का स्वास्थ्य स्तर बनाए रखना'],
  ['सामुदायिक सेवा',  'सामूहिक जिम्मेदारी और करुणा की भावना को प्रदर्शित करना'],
  ['वित्तीय सुलभता',  'यात्रा को सभी आर्थिक पृष्ठभूमि के तीर्थयात्रियों के लिए सुलभ बनाना'],
  ['आतिथ्य और देखभाल', 'अपने घर से दूर यात्रियों को गर्मजोशी और आतिथ्य प्रदान करना'],
  ['सामाजिक बंधन',   'तीर्थयात्रियों को आध्यात्मिक यात्रा साझा करने के अवसर देना'],
];

export default function YatraPage() {
  const navigate = useNavigate();
  const [actionBtns, setActionBtns] = useState(FALLBACK_BTNS);

  useEffect(() => {
    async function loadDocs() {
      try {
        const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '');
        const res = await fetch(`${apiBase}/api/yatra/documents`);
        if (res.ok) {
          const docs = await res.json();
          if (Array.isArray(docs) && docs.length > 0) {
            setActionBtns(docs.map(d => ({
              href: d.isExternal ? d.externalUrl : d.filePath,
              icon: d.icon,
              label: d.label,
              download: d.download,
            })));
          }
        }
      } catch (e) {
        // keep fallback
      }
    }
    loadDocs();
  }, []);

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <h1>🙏 Shri Amarnath Yatra Guide 🙏</h1>
        <p>Complete Information for Your Sacred Journey</p>
      </div>

      <div className="section">
        {/* Quick Action Buttons */}
        <h2 className="yatra-sub-heading">महत्वपूर्ण लिंक और संसाधन</h2>
        <div className="action-grid">
          {actionBtns.map((a) => (
            <a
              key={a.label}
              href={a.href}
              className="action-btn"
              target="_blank"
              rel="noreferrer"
              download={a.download || undefined}
            >
              {a.icon && a.icon.startsWith('fa') ? (
                <i className={a.icon} />
              ) : (
                <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{a.icon}</span>
              )}
              <span>{a.label}</span>
            </a>
          ))}
        </div>

        {/* About Yatra */}
        <YatraSection title="श्री अमरनाथ यात्रा के बारे में">
          <div className="yatra-2col">
            <div className="yatra-text">
              <p>श्री अमरनाथ यात्रा हिंदू धर्म की सबसे पवित्र तीर्थ यात्रा है। भगवान शिव को समर्पित, यह यात्रा हर साल लाखों भक्तों को आकर्षित करती है।</p>
              <p>अमरनाथ गुफा 3,880 मीटर की ऊंचाई पर स्थित है और कश्मीर घाटी में हिमालय पर्वत श्रृंखला पर अवस्थित है। गुफा भगवान शिव के प्राकृतिक रूप से निर्मित बर्फ के लिंग के लिए प्रसिद्ध है।</p>
              <p>हर साल, जुलाई से अगस्त तक, हजारों तीर्थयात्री इस चुनौतीपूर्ण यात्रा पर जाते हैं।</p>
            </div>
            <div className="hero-img-box">
              <img
                src="/Images/image.png"
                alt="Amarnath Cave"
                style={{ height: 'auto', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="hero-placeholder" style="height:210px">🏔️</div>';
                }}
              />
            </div>
          </div>
        </YatraSection>

        {/* History */}
        <YatraSection title="अमरनाथ यात्रा का इतिहास">
          <div className="yatra-text">
            <p>अमरनाथ यात्रा हिंदू धर्म के पौराणिक कथाओं में गहरी जड़ें रखती है। किंवदंतियों के अनुसार, यह अमरनाथ गुफा में ही भगवान शिव ने देवी पार्वती को अमरता की कथा (अमर कथा) सुनाई थी।</p>
            <p>यह तीर्थ यात्रा सदियों से की जाती रही है और समय के साथ हिंदू धर्म की सबसे महत्वपूर्ण तीर्थ यात्राओं में से एक बन गई है।</p>
            <p><strong>बर्फ के लिंग की घटना:</strong> प्राकृतिक रूप से होने वाली बर्फ की स्तूप चंद्र कैलेंडर के साथ बढ़ती और सिकुड़ती है।</p>
          </div>
        </YatraSection>

        {/* How to Reach */}
        <YatraSection title="अमरनाथ धाम तक कैसे पहुंचें">
          <div className="routes-grid">
            {ROUTES.map((r) => (
              <div className="route-card" key={r.title}>
                <h3>{r.icon} {r.title}</h3>
                {r.lines.map((l, i) => <p key={i}>{l}</p>)}
              </div>
            ))}
          </div>
        </YatraSection>

        {/* Langar Importance */}
        <YatraSection title="यात्रा में लंगर का महत्व">
          <div className="langar-box">
            <ul>
              {LANGAR_POINTS.map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
            <div className="langar-note">
              श्री अमरनाथ जनशक्ति सेवा मंडल यात्रा के पड़ाव{' '}
              <strong>बराड़ी मार्ग एवं बालटाल-दोमेल</strong> में भंडारा
              संचालित करता है, जहां हजारों तीर्थयात्रियों को निःशुल्क भोजन,
              स्वच्छ पानी और अन्य सहायता सेवाएं प्रदान की जाती हैं।
            </div>
          </div>
        </YatraSection>

        {/* Tips */}
        <YatraSection title="यात्रियों के लिए यात्रा सुझाव">
          <div className="tips-grid">
            {TIPS.map((t) => (
              <div className="tip-card" key={t.title}>
                <span className="tip-icon">{t.icon}</span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </YatraSection>

        {/* Dos and Don'ts */}
        <YatraSection title="यात्रा के लिए सुझाव और मनाही">
          <div className="dos-grid">
            <div className="dos-box">
              <h3>✅ करने योग्य बातें</h3>
              <ul>{DOS.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
            <div className="donts-box">
              <h3>❌ न करने योग्य बातें</h3>
              <ul>{DONTS.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
          </div>
        </YatraSection>

        {/* CTA */}
        <section className="cta-section">
          <h2>अपनी पवित्र यात्रा के लिए तैयार हैं?</h2>
          <p>अभी रजिस्टर करें और अपनी तीर्थ यात्रा की योजना बनाना शुरू करें</p>
          <div className="cta-btns">
            <a
              href="https://jksasb.nic.in/onlineservices/index.html"
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              यात्रा के लिए रजिस्टर करें
            </a>
            <button className="btn btn-white" onClick={() => navigate('/contact')}>
              हमसे संपर्क करें
            </button>
          </div>
        </section>
      </div>

      <SocialSection heading="Follow Us On Social Media" />
    </>
  );
}

function YatraSection({ title, children }) {
  return (
    <section className="yatra-section">
      <div className="yatra-divider" />
      <h2 className="yatra-section-title">{title}</h2>
      {children}
    </section>
  );
}
