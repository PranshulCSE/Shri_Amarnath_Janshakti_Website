import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

export default function LanguageSwitcher({ inline = false }) {
  const { language, toggleLanguage } = useLanguage();

  if (inline) {
    return (
      <div className="lang-switcher-container inline">
        <button
          className="lang-switcher-btn inline-nav-btn"
          onClick={toggleLanguage}
          aria-label="Toggle Language"
          title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
        >
          <i className="fas fa-language" aria-hidden="true" />
          <span className="inline-lang-text">{language === 'en' ? 'भाषा' : 'Language'}</span>
          <span className="inline-lang-code">{language === 'en' ? 'A->अ' : 'अ->A'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="lang-switcher-container">
      <button
        className="lang-switcher-btn"
        onClick={toggleLanguage}
        aria-label="Toggle Language"
        title={language === 'en' ? "Switch to Hindi" : "Switch to English"}
      >
        <div className={`lang-toggle ${language === 'en' ? 'en-active' : 'hi-active'}`}>
          <span className={`lang-label hi ${language === 'hi' ? 'active' : ''}`}>अ</span>
          <span className={`lang-label en ${language === 'en' ? 'active' : ''}`}>A</span>
          <div className="lang-indicator"></div>
        </div>
      </button>
    </div>
  );
}
