import React from 'react';
import SocialSection from '../../components/common/SocialSection';
import './HistoryPage.css';

const TIMELINE = [
  {
    color: '#ff6b35',
    icon: '🏛️',
    title: 'संगठन की स्थापना',
    text: 'श्री अमरनाथ यात्रियों की सेवा के लिए एक समर्पित संस्था की स्थापना की गई। हमारे पूर्व प्रधान स्व. श्री मुकेश दुआ जी ने अपने मित्रों के साथ लंगर सेवा, चिकित्सा सहायता और अन्य सामाजिक कार्यों के माध्यम से समाज की सेवा का संकल्प लिया। पंजीकरण संख्या: REG.01104',
  },
  {
    color: '#f7931e',
    icon: '🍲',
    title: 'लंगर सेवा की शुरुआत (2011)',
    text: 'पहली बार बालटाल में हमने 4-5 कैम्पिंग टेंट की स्थापना करके श्री अमरनाथ यात्रियों को विभिन्न सेवाएं प्रदान करनी शुरू कीं। यह सेवा प्रतिवर्ष बढ़ती गई और आज लाखों यात्रियों को लाभान्वित कर रही है।',
  },
  {
    color: '#25c916',
    icon: '🕌',
    title: 'श्री केदारनाथ धाम में सेवा (2015-19)',
    text: 'श्री अमरनाथ जनशक्ति सेवा मण्डल द्वारा प्रधान श्री मुकेश दुआ जी की अगुवाई में सन् 2015 से 2019 तक बाबा केदारनाथ धाम में प्रतिवर्ष 1 महीने हेतु भंडारे का आयोजन किया। साल 2020-21 के कोरोना काल के पश्चात उत्तराखंड सरकार द्वारा अनुमति न मिलने पर यह संभव नहीं हो पाया।',
  },
  {
    color: '#004e89',
    icon: '🎯',
    title: 'नई शुरुआत (2023)',
    text: 'बाबा बर्फानी जी के आशीर्वाद से मई 2023 में हमें दोमेल, बालटाल में लंगर स्थापित करने की अनुमति मिली। गांदरबल जिले के उप-आयुक्त द्वारा जारी इस अनुमति के तहत हमने 2023 और 2024 में यात्रियों को निःस्वार्थ सेवाएं प्रदान कीं।',
  },
  {
    color: '#ff6b35',
    icon: '🏛️',
    title: 'संस्था के अनमोल रत्न का निधन (2024)',
    text: 'समर्पित प्रधान श्री मुकेश दुआ जी ने श्री अमरनाथ यात्रा 2024 के प्रथम दिन बाबा बर्फानी जी के श्री चरणों में नमन करते हुए अपने अंतिम श्वास लिए। उनके वचन "सेवा कभी नहीं रुकनी चाहिए!!" का पालन करते हुए सेवादार यात्रा के समापन तक सेवा में लगे रहे। तत्पश्चात श्री जगमोहन शर्मा जी को प्रधान नियुक्त किया गया।',
  },
  {
    color: '#06a77d',
    icon: '⭐',
    title: 'प्रमुख उपलब्धि (2025)',
    text: '2025 में श्री अमरनाथ जी श्राइन बोर्ड ने हमें बराड़ी-मार्ग (बालटाल रूट के सर्वोच्च बिंदु) पर लंगर स्थापित करने का अवसर दिया। माननीय लेफ्टिनेंट गवर्नर मनोज सिन्हा जी द्वारा प्रशंसा पत्र प्राप्त हुआ।',
  },
  {
    color: '#f97316',
    icon: '🚀',
    title: 'आज और भविष्य (2026)',
    text: 'आज श्री अमरनाथ जनशक्ति सेवा मण्डल, करनाल अगली यात्रा 2026 के लिए अपनी सेवाओं को बेहतर बनाने के लिए काम कर रहा है। यात्रा 2026 की उद्घाटन तिथि शीघ्र सूचित की जाएगी।',
  },
];

const ACHIEVEMENTS = [
  { icon: '🎖️', title: 'लाखों यात्रियों की सेवा', desc: 'अब तक लाखों श्री अमरनाथ यात्रियों को निःशुल्क भोजन और सेवाएं प्रदान की गई हैं।' },
  { icon: '👥', title: 'बड़ा परिवार',              desc: 'हमारा परिवार केवल करनाल तक ही सीमित नहीं, अपितु समग्र भारत से व्यक्ति हमसे जुड़े हुए हैं।' },
  { icon: '🏗️', title: 'उचत्तम सुविधाएं',         desc: 'प्रतिवर्ष पंडाल को इस प्रकार सुसज्जित किया जाता है जिससे अधिकतम सेवाएं प्रदान की जा सकें।' },
  { icon: '🌟', title: 'आदर-सम्मान',              desc: 'श्री अमरनाथ जी श्राइन बोर्ड की ओर से 20 अगस्त 2025 को प्रशंसा पत्र प्राप्त हुआ।' },
];

export default function HistoryPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h2 className="hero-title">Our History</h2>
          <p className="hero-sub">Journey of SAJSSM</p>
          <p className="hero-desc">
            A remarkable story of selfless service, devotion, and dedication
            spanning over a decade.
          </p>
        </div>
        <div className="hero-img-box">
          <img
            src="/Images/Card_front-cropped.jpg"
            alt="History"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="hero-placeholder">📜</div>';
            }}
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <h2 className="section-title">हमारी यात्रा</h2>
        <div className="timeline-box">
          {TIMELINE.map((t, i) => (
            <div
              key={i}
              className="tl-item"
              style={{ borderLeft: `4px solid ${t.color}` }}
            >
              <h3 style={{ color: t.color }}>
                {t.icon} {t.title}
              </h3>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="section">
        <h2 className="section-title">हमारी उपलब्धियाँ</h2>
        <div className="cards-grid">
          {ACHIEVEMENTS.map((a) => (
            <div className="card" key={a.title}>
              <span className="card-icon">{a.icon}</span>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SocialSection />
    </>
  );
}
