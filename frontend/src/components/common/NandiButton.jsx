import React, { useState, useEffect } from 'react';
import './NandiButton.css';
import NandiChat from './NandiChat';
import { useLanguage } from '../../context/LanguageContext';

export default function NandiButton() {
    const [open, setOpen] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const { language } = useLanguage();

    useEffect(() => {
        // show pulse for first 8 seconds
        const t = setTimeout(() => setShowPulse(false), 8000);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <div className={`nandi-fab ${open ? 'open' : ''}`} onClick={() => setOpen((s) => !s)} title={language === 'en' ? 'Ask Nandi' : 'नंदी से पूछें'}>
                <img src="/Images/nandi.svg" alt="Nandi" />
                {showPulse && <span className="nandi-pulse" />}
            </div>
            {open && <NandiChat onClose={() => setOpen(false)} />}
        </>
    );
}
