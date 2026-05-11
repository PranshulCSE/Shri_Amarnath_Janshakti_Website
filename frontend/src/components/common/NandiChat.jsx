import React, { useState, useEffect, useRef } from 'react';
import './NandiChat.css';
import API from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function NandiChat({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { language } = useLanguage();
    const listRef = useRef(null);

    useEffect(() => {
        const welcome = language === 'en' ? 'I am Nandi. Ask me about Amarnath Ji Yatra or langar.' : 'मैं नंदी हूँ। अमरनाथ जी यात्रा या लंगर से संबंधित प्रश्न पूछें।';
        setMessages([{ from: 'bot', text: welcome }]);
    }, [language]);

    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, loading]);

    const send = async () => {
        if (!input.trim()) return;
        const text = input.trim();
        setMessages((m) => [...m, { from: 'user', text }]);
        setInput('');
        setLoading(true);
        try {
            const res = await API.post('/gemini', { message: text, language });
            const reply = res.data?.reply || (language === 'en' ? 'Sorry, no answer' : 'क्षमा करें, उत्तर उपलब्ध नहीं है');
            setMessages((m) => [...m, { from: 'bot', text: reply }]);
        } catch (err) {
            console.error(err);
            setMessages((m) => [...m, { from: 'bot', text: language === 'en' ? 'There was an error contacting the AI service.' : 'AI सेवा से संपर्क में त्रुटि हुई।' }]);
        } finally {
            setLoading(false);
        }
    };

    const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

    return (
        <div className="nandi-chat-window">
            <div className="nandi-chat-header">
                <div className="nandi-title">{language === 'en' ? 'Nandi — Amarnath Guide' : 'नंदी — अमरनाथ गाइड'}</div>
                <button className="nandi-close" onClick={onClose}>×</button>
            </div>
            <div className="nandi-chat-list" ref={listRef}>
                {messages.map((m, idx) => (
                    <div key={idx} className={`nandi-msg ${m.from}`}>
                        <div className="nandi-text">{m.text}</div>
                    </div>
                ))}
                {loading && <div className="nandi-msg bot"><div className="nandi-text">{language === 'en' ? 'Nandi is thinking...' : 'नंदी सोच रहा है...'}</div></div>}
            </div>
            <div className="nandi-chat-input">
                <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} placeholder={language === 'en' ? 'Ask about Amarnath Yatra or langar...' : 'अमरनाथ यात्रा या लंगर के बारे में पूछें...'} />
                <button onClick={send} disabled={loading || !input.trim()}>{language === 'en' ? 'Send' : 'भेजें'}</button>
            </div>
        </div>
    );
}
