import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

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
