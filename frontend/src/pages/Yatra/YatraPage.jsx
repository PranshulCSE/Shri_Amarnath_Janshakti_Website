import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { T } from '../../constants/translations';
import SocialSection from '../../components/common/SocialSection';
import './YatraPage.css';

export default function YatraPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = T[language];

  const FALLBACK_BTNS = [
    { href: 'https://jksasb.nic.in/', icon: 'fas fa-heartbeat', label: t.btn_sasb },
    { href: 'https://jksasb.nic.in/onlineservices/index.html', icon: 'fas fa-edit', label: t.btn_reg },
    { href: '/Docs/Bank_List(SANJY-26).pdf', icon: 'fas fa-university', label: t.btn_banks, download: true },
    { href: '/Docs/CHC.pdf', icon: 'fas fa-file-medical', label: t.btn_chc, download: true },
    { href: '/Docs/Application-Form-2025.pdf', icon: 'fas fa-file-alt', label: t.btn_form, download: true },
  ];

  const ROUTES = [
    { icon: '✈️', title: t.reach_air,  lines: [t.reach_air_1, t.reach_air_2, t.reach_air_3] },
    { icon: '🚂', title: t.reach_train,   lines: [t.reach_train_1, t.reach_train_2, t.reach_train_3] },
    { icon: '🚗', title: t.reach_road, lines: [t.reach_road_1, t.reach_road_2, t.reach_road_3] },
  ];

  const TIPS = [
    { icon: '🏃', title: t.tip_1_t,    text: t.tip_1_d },
    { icon: '❄️', title: t.tip_2_t,         text: t.tip_2_d },
    { icon: '💊', title: t.tip_3_t, text: t.tip_3_d },
    { icon: '💧', title: t.tip_4_t,    text: t.tip_4_d },
    { icon: '🧘', title: t.tip_5_t,       text: t.tip_5_d },
    { icon: '🎒', title: t.tip_6_t,     text: t.tip_6_d },
  ];

  const DOS = [
    t.do_1, t.do_2, t.do_3, t.do_4, t.do_5, t.do_6, t.do_7, t.do_8, t.do_9, t.do_10
  ];

  const DONTS = [
    t.dont_1, t.dont_2, t.dont_3, t.dont_4, t.dont_5, t.dont_6, t.dont_7, t.dont_8, t.dont_9, t.dont_10
  ];

  const LANGAR_POINTS = [
    [t.langar_1_k, t.langar_1_v],
    [t.langar_2_k, t.langar_2_v],
    [t.langar_3_k, t.langar_3_v],
    [t.langar_4_k, t.langar_4_v],
    [t.langar_5_k, t.langar_5_v],
    [t.langar_6_k, t.langar_6_v],
  ];

  const [actionBtns, setActionBtns] = useState(FALLBACK_BTNS);

  useEffect(() => {
    async function loadDocs() {
      try {
        const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
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
        <h1>{t.yatra_hero}</h1>
        <p>{t.yatra_sub}</p>
      </div>

      <div className="section">
        {/* Quick Action Buttons */}
        <h2 className="yatra-sub-heading">{t.yatra_links}</h2>
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
        <YatraSection title={t.yatra_about}>
          <div className="yatra-2col">
            <div className="yatra-text">
              <p>{t.ya_p1}</p>
              <p>{t.ya_p2}</p>
              <p>{t.ya_p3}</p>
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
        <YatraSection title={t.yatra_history}>
          <div className="yatra-text">
            <p>{t.yh_p1}</p>
            <p>{t.yh_p2}</p>
            <p dangerouslySetInnerHTML={{ __html: t.yh_p3 }} />
          </div>
        </YatraSection>

        {/* How to Reach */}
        <YatraSection title={t.yatra_reach}>
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
        <YatraSection title={t.yatra_langar}>
          <div className="langar-box">
            <ul>
              {LANGAR_POINTS.map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
            <div className="langar-note" dangerouslySetInnerHTML={{ __html: t.langar_note }} />
          </div>
        </YatraSection>

        {/* Tips */}
        <YatraSection title={t.yatra_tips}>
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
        <YatraSection title={t.yatra_dos}>
          <div className="dos-grid">
            <div className="dos-box">
              <h3>{t.do_title}</h3>
              <ul>{DOS.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
            <div className="donts-box">
              <h3>{t.dont_title}</h3>
              <ul>{DONTS.map((d, i) => <li key={i}>{d}</li>)}</ul>
            </div>
          </div>
        </YatraSection>

        {/* CTA */}
        <section className="cta-section">
          <h2>{t.yatra_cta}</h2>
          <p>{t.yatra_cta_desc}</p>
          <div className="cta-btns">
            <a
              href="https://jksasb.nic.in/onlineservices/index.html"
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
            >
              {t.btn_reg}
            </a>
            <button className="btn btn-white" onClick={() => navigate('/contact')}>
              {t.btn_contact}
            </button>
          </div>
        </section>
      </div>

      <SocialSection heading={t.social_heading} />
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
