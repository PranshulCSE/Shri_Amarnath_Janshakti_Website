import React, { useState, useEffect, useRef } from 'react';
import './NandiChat.css';
import API from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const QUICK_QUESTIONS = {
    en: [
        'Yatra 2026 start date?',
        'Where is the langar?',
        'How to register?',
        'Donate to SAJSSM',
    ],
    hi: [
        'यात्रा 2026 कब शुरू होगी?',
        'लंगर कहां है?',
        'रजिस्ट्रेशन कैसे करें?',
        'दान कैसे करें?',
    ],
};

export default function NandiChat({ onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { language } = useLanguage();
    const listRef = useRef(null);
    const inputRef = useRef(null);

    // Welcome message on mount / language change
    useEffect(() => {
        const welcome = language === 'en'
            ? '🙏 Jai Baba Barfani! I am Nandi, your Amarnath Yatra guide.\n\nAsk me about the Yatra, langar seva, registration, or how to donate.'
            : '🙏 जय बाबा बर्फानी! मैं नंदी हूं, आपका अमरनाथ यात्रा गाइड।\n\nयात्रा, लंगर सेवा, रजिस्ट्रेशन या दान के बारे में पूछें।';
        setMessages([{ from: 'bot', text: welcome, id: 'welcome' }]);
    }, [language]);

    // Auto-scroll on new messages
    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, loading]);

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || loading) return;

        setInput('');
        setMessages((prev) => [...prev, { from: 'user', text: trimmed, id: Date.now() }]);
        setLoading(true);

        try {
            const res = await API.post('/gemini', { message: trimmed, language });
            const reply = res.data?.reply;

            if (!reply) throw new Error('Empty response');

            setMessages((prev) => [...prev, { from: 'bot', text: reply, id: Date.now() + 1 }]);
        } catch (err) {
            console.error('[NandiChat] Error:', err);
            const errorMsg = language === 'en'
                ? '⚠️ Could not reach the server. Please try again or call 9466132732.'
                : '⚠️ सर्वर से कनेक्ट नहीं हो पाया। दोबारा प्रयास करें या 9466132732 पर कॉल करें।';
            setMessages((prev) => [...prev, { from: 'bot', text: errorMsg, id: Date.now() + 1, isError: true }]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleQuickQuestion = (q) => {
        if (!loading) sendMessage(q);
    };

    return (
        <div className="nandi-chat-window" role="dialog" aria-label={language === 'en' ? 'Nandi Chat' : 'नंदी चैट'}>

            {/* Header */}
            <div className="nandi-chat-header">
                <div className="nandi-header-info">
                    <div className="nandi-avatar-small">🕉️</div>
                    <div>
                        <div className="nandi-title">
                            {language === 'en' ? 'Nandi — Amarnath Guide' : 'नंदी — अमरनाथ गाइड'}
                        </div>
                        <div className="nandi-subtitle">
                            {loading
                                ? (language === 'en' ? 'Thinking...' : 'सोच रहा है...')
                                : (language === 'en' ? 'Online' : 'ऑनलाइन')}
                        </div>
                    </div>
                </div>
                <button className="nandi-close" onClick={onClose} aria-label="Close">×</button>
            </div>

            {/* Message List */}
            <div className="nandi-chat-list" ref={listRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`nandi-msg ${msg.from}${msg.isError ? ' error' : ''}`}>
                        {msg.from === 'bot' && <div className="nandi-bot-avatar">🕉️</div>}
                        <div className="nandi-bubble">
                            {/* Preserve line breaks from bot replies */}
                            {msg.text.split('\n').map((line, i) => (
                                <span key={i}>
                                    {line}
                                    {i < msg.text.split('\n').length - 1 && <br />}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div className="nandi-msg bot">
                        <div className="nandi-bot-avatar">🕉️</div>
                        <div className="nandi-bubble nandi-typing">
                            <span /><span /><span />
                        </div>
                    </div>
                )}

                {/* Quick question chips — shown after welcome, before any user message */}
                {messages.length === 1 && !loading && (
                    <div className="nandi-quick-questions">
                        {QUICK_QUESTIONS[language]?.map((q) => (
                            <button key={q} className="nandi-chip" onClick={() => handleQuickQuestion(q)}>
                                {q}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="nandi-chat-input">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={language === 'en'
                        ? 'Ask about Amarnath Yatra or langar...'
                        : 'अमरनाथ यात्रा या लंगर के बारे में पूछें...'}
                    rows={1}
                    disabled={loading}
                    aria-label={language === 'en' ? 'Message input' : 'संदेश टाइप करें'}
                />
                <button
                    className="nandi-send-btn"
                    onClick={() => sendMessage()}
                    disabled={loading || !input.trim()}
                    aria-label={language === 'en' ? 'Send' : 'भेजें'}
                >
                    {loading ? '⌛' : '➤'}
                </button>
            </div>
        </div>
    );
}
