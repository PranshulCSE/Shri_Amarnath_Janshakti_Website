const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

let GoogleGenAI = null;
try {
    ({ GoogleGenAI } = require('@google/genai'));
} catch {
    GoogleGenAI = null;
}

const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });
const fileEnv = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath, 'utf8')) : {};

const geminiApiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    fileEnv.GEMINI_API_KEY ||
    fileEnv.GOOGLE_API_KEY;

const geminiClient = GoogleGenAI && geminiApiKey
    ? new GoogleGenAI({ apiKey: geminiApiKey })
    : null;

let quotaCooldownUntil = 0;

const router = express.Router();

// ─── Topic keyword whitelist ─────────────────────────────────────────────────
const TOPIC_KEYWORDS = [
    'amarnath', 'yatra', 'यात्रा', 'darshan', 'langar', 'लंगर',
    'register', 'registration', 'रजिस्टर', 'रजिस्ट्रेशन', 'पंजीकरण',
    'medical', 'certificate', 'health', 'स्वास्थ्य', 'प्रमाणपत्र',
    'shri amarnath', 'yatri', 'यात्री', 'pahalgam', 'holy cave', 'cave',
    'route', 'मार्ग', 'रूट', 'helipad', 'domail', 'baltal', 'brari', 'camp', 'कैम्प',
    'contact', 'address', 'संपर्क', 'पता', 'कार्यालय', 'donation', 'दान',
    'office', 'janshakti', 'sewa', 'mandal', 'sajssm', 'nandi', 'नंदी',
    'bhandara', 'भंडारा', 'baba barfani', 'बर्फानी', 'shivling', 'शिवलिंग',
    'helicopter', 'हेलीकॉप्टर', 'weather', 'मौसम', 'altitude', 'ऊंचाई',
    'insurance', 'बीमा', 'rfid', 'आरएफआईडी', 'volunteer', 'स्वयंसेवक',
    'history', 'इतिहास', 'achievement', 'उपलब्धि', 'karnal', 'करनाल',
    'mukhesh', 'jagmohan', 'brij', 'secretary', 'president', 'प्रधान',
];

function isRelatedToTopic(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return TOPIC_KEYWORDS.some((k) => lower.includes(k));
}

// ─── Local FAQ bank ──────────────────────────────────────────────────────────
const FAQ_BANK = [
    {
        pattern: /when.*(yatra|start|begin|commence)|yatra.*start|starting date|start date|kab.*shuru|kab.*start|kab.*hogi|kab.*hoga|shuru.*kab|तारीख|कब शुरू|कब होगी|उद्घाटन/,
        en: 'Shri Amarnath Ji Yatra 2026 will commence on 3rd July 2026. The official inauguration date is already announced by the Shrine Board. Stay connected with our website for updates.',
        hi: 'श्री अमरनाथ जी यात्रा 2026 का शुभारंभ 3 जुलाई 2026 से होगा। श्राइन बोर्ड द्वारा आधिकारिक तिथि की घोषणा की जा चुकी है। अपडेट के लिए हमारी वेबसाइट से जुड़े रहें।',
    },
    {
        pattern: /yatra.*end|end.*yatra|last date|kab.*khatam|kab.*samapt|समाप्त|आखिरी तारीख/,
        en: 'Shri Amarnath Ji Yatra 2026 is expected to end on Shravan Purnima (Raksha Bandhan). The exact end date will be declared by the Shrine Board.',
        hi: 'श्री अमरनाथ जी यात्रा 2026 श्रावण पूर्णिमा (रक्षाबंधन) पर समाप्त होने की संभावना है। सटीक तारीख श्राइन बोर्ड द्वारा घोषित की जाएगी।',
    },
    {
        pattern: /langar.*location|location.*langar|where.*langar|langar.*where|camp.*location|baltal|domail|brari.*marg|लंगर.*कहां|लंगर.*स्थान|कैम्प.*कहां|कहां.*लंगर|कहाँ.*लंगर/,
        en: 'Shri Amarnath JanShakti Sewa Mandal serves langar at the Baltal route — at Domail, Baltal (Base Camp) and Brari Marg (the highest point on Baltal route). The base camp is located at Domail, Baltal.',
        hi: 'श्री अमरनाथ जनशक्ति सेवा मंडल बालटाल रूट पर लंगर सेवा देता है — दोमेल, बालटाल (बेस केंप) और बराड़ी मार्ग (बालटाल रूट का सर्वोच्च बिंदु) पर। बेस कैम्प दोमेल, बालटाल में स्थित है।',
    },
    {
        pattern: /langar.*time|time.*langar|when.*langar|langar.*kab|लंगर.*समय|लंगर.*कब/,
        en: 'The langar runs 24/7 during Yatra season. It is completely free of cost for all pilgrims.',
        hi: 'लंगर यात्रा सीजन के दौरान 24/7 चलता है। यह सभी तीर्थयात्रियों के लिए पूरी तरह निःशुल्क है।',
    },
    {
        pattern: /what.*langar|langar.*food|langar.*mein.*kya|लंगर.*क्या|लंगर.*भोजन|खाना.*लंगर/,
        en: 'Our langar serves nutritious hot food including dal, rice, roti, sabzi, khichdi, tea, and other items to keep pilgrims energised on the trek.',
        hi: 'हमारे लंगर में दाल, चावल, रोटी, सब्जी, खिचड़ी, चाय और अन्य पौष्टिक गर्म भोजन परोसा जाता है।',
    },
    {
        pattern: /which route|routes?|pahalgam|baltal route|how to reach|travel route|trek|मार्ग|रास्ता|कौन सा मार्ग|यात्रा मार्ग|पहलगाम|बालटाल/,
        en: 'There are two main Yatra routes:\n1️⃣ Pahalgam route — 48 km trek, approx 4–5 days (easier, scenic)\n2️⃣ Baltal route — 14 km trek, approx 1 day (shorter, steeper)\nOur camps are on the Baltal route.',
        hi: 'यात्रा के दो मुख्य मार्ग हैं:\n1️⃣ पहलगाम मार्ग — 48 किमी ट्रेक, लगभग 4-5 दिन\n2️⃣ बालटाल मार्ग — 14 किमी ट्रेक, लगभग 1 दिन\nहमारे कैम्प बालटाल मार्ग पर हैं।',
    },
    {
        pattern: /register|registration|how to apply|apply for yatra|yatra registration|रजिस्टर|रजिस्ट्रेशन|पंजीकरण|कैसे रजिस्टर|आवेदन/,
        en: 'Yatra registration is done online at jksasb.nic.in or through designated bank branches. Registration for 2026 began on 15 April 2026. A valid health certificate (CHC) is mandatory.',
        hi: 'यात्रा पंजीकरण jksasb.nic.in पर ऑनलाइन या नामित बैंक शाखाओं से किया जाता है। 2026 के लिए पंजीकरण 15 अप्रैल 2026 से शुरू हो चुका है। CHC अनिवार्य है।',
    },
    {
        pattern: /health certificate|medical certificate|fitness|chc|compulsory health|स्वास्थ्य प्रमाणपत्र|चिकित्सा प्रमाणपत्र|मेडिकल|फिटनेस/,
        en: 'A Compulsory Health Certificate (CHC) is mandatory for Yatra registration. It must be obtained from authorised government hospitals or CHC centres. Valid for current Yatra season only.',
        hi: 'CHC यात्रा पंजीकरण के लिए अनिवार्य है। अधिकृत सरकारी अस्पतालों से प्राप्त करें। केवल वर्तमान सीजन के लिए मान्य।',
    },
    {
        pattern: /rfid|radio frequency|id card|yatra card|आरएफआईडी|यात्रा कार्ड/,
        en: 'An RFID card is issued to registered pilgrims. It must be worn around your neck throughout the Yatra for safety tracking.',
        hi: 'पंजीकृत यात्रियों को RFID कार्ड जारी किया जाता है। सुरक्षा ट्रैकिंग के लिए पूरी यात्रा में गले में पहनना अनिवार्य है।',
    },
    {
        pattern: /helicopter|heli.*service|heli.*booking|helipad|हेलीकॉप्टर|हेली/,
        en: 'Helicopter services are available from Baltal and Pahalgam helipads to Panjtarni. Booking through jksasb.nic.in. Subject to weather conditions.',
        hi: 'बालटाल और पहलगाम हेलीपैड से पंजतरणी तक हेलीकॉप्टर सेवाएं उपलब्ध हैं। बुकिंग jksasb.nic.in से। मौसम पर निर्भर।',
    },
    {
        pattern: /weather|temperature|cold|climate|मौसम|तापमान|ठंड|जलवायु/,
        en: 'Weather at Amarnath cave (3,880 m) is very cold even in summer. Temperature: 0°C to 15°C in July–August. Snowfall and rain are common. Always carry warm clothes, raincoat, and trekking shoes.',
        hi: 'अमरनाथ गुफा (3,880 मीटर) पर गर्मियों में भी ठंड रहती है। जुलाई-अगस्त में 0°C से 15°C। बर्फबारी और बारिश सामान्य है। गर्म कपड़े, रेनकोट, ट्रेकिंग जूते जरूर लाएं।',
    },
    {
        pattern: /altitude.*sick|mountain sick|AMS|high altitude|ऊंचाई.*बीमारी|पहाड़.*बीमार|altitude/,
        en: 'Altitude sickness (AMS) can affect pilgrims above 3,000 m. Symptoms: headache, nausea, breathlessness. Acclimatise slowly, stay hydrated, avoid alcohol. Medical help is available at camps.',
        hi: 'ऊंचाई पर बीमारी 3,000 मीटर से ऊपर हो सकती है। लक्षण: सिरदर्द, मतली, सांस फूलना। धीरे-धीरे अभ्यस्त हों, हाइड्रेटेड रहें। कैम्पों पर चिकित्सा सहायता उपलब्ध है।',
    },
    {
        pattern: /what.*carry|what.*pack|packing|essential.*items|kya.*le|kya.*lana|क्या.*लाएं|क्या.*ले जाएं|सामान/,
        en: 'Essential items:\n• Warm clothes (thermals, jacket, gloves, woollen cap)\n• Raincoat or poncho\n• Trekking shoes (waterproof)\n• Walking stick\n• Water bottle & dry snacks\n• Medicines & first-aid kit\n• RFID card & registration slip\n• ID proof (Aadhar/Passport)',
        hi: 'आवश्यक सामान:\n• गर्म कपड़े (थर्मल, जैकेट, दस्ताने, ऊनी टोपी)\n• रेनकोट\n• वाटरप्रूफ ट्रेकिंग जूते\n• चलने की छड़ी\n• पानी और सूखा नाश्ता\n• दवाइयां और प्राथमिक चिकित्सा किट\n• RFID कार्ड और रजिस्ट्रेशन स्लिप\n• पहचान पत्र',
    },
    {
        pattern: /fitness|prepare|exercise|training|physical|फिटनेस|तैयारी|व्यायाम|प्रशिक्षण/,
        en: 'Start preparation 6–8 weeks before Yatra. Daily walking, stair climbing, and light jogging. Yoga and pranayama are very helpful for high-altitude trekking.',
        hi: 'यात्रा से 6-8 सप्ताह पहले तैयारी शुरू करें। रोज चलें, सीढ़ियां चढ़ें, हल्की जॉगिंग करें। प्राणायाम और योग बहुत सहायक हैं।',
    },
    {
        pattern: /how.*reach|reach.*baltal|reach.*srinagar|reach.*jammu|कैसे पहुंचें|पहुंचना|कैसे जाएं/,
        en: 'To reach Baltal:\n✈️ By Air — Fly to Srinagar Airport, then ~97 km drive\n🚂 By Train — Reach Jammu/Srinagar, then bus or taxi\n🚗 By Road — Via Srinagar–Sonamarg highway\n\nTransport available from Srinagar base camps.',
        hi: 'बालटाल पहुंचने के लिए:\n✈️ हवाई — श्रीनगर एयरपोर्ट, फिर ~97 किमी\n🚂 रेल — जम्मू/श्रीनगर, फिर बस/टैक्सी\n🚗 सड़क — श्रीनगर-सोनमर्ग राजमार्ग\n\nश्रीनगर से परिवहन उपलब्ध है।',
    },
    {
        pattern: /donate|donation|how.*help|contribute|bank.*account|upi|दान|कैसे.*मदद|योगदान|बैंक.*खाता/,
        en: 'Donate to support our langar seva:\n🏦 Bank: HDFC Bank\nA/C Name: SHRI AMARNATH JANSHAKTI SEWA MANDAL\nA/C No: 50200109501402\nIFSC: HDFC0003989\n📱 UPI: 9466132732@ibl\n\nYou can also donate ration, warm clothes, or medicines.',
        hi: 'लंगर सेवा के लिए दान करें:\n🏦 बैंक: HDFC Bank\nखाता: SHRI AMARNATH JANSHAKTI SEWA MANDAL\nखाता नंबर: 50200109501402\nIFSC: HDFC0003989\n📱 UPI: 9466132732@ibl\n\nराशन, गर्म कपड़े या दवाइयां भी दान कर सकते हैं।',
    },
    {
        pattern: /contact|address|where is.*office|office location|karnal|कार्यालय|पता|संपर्क|ऑफिस/,
        en: 'Shri Amarnath JanShakti Sewa Mandal\n📍 H.No. 186/5, Gandhi Nagar, Karnal, Haryana (132001)\n📞 9466132732 | 9466132733 | 7015345275 | 9996181668\n📧 shriamarnathjanshakti@gmail.com',
        hi: 'श्री अमरनाथ जनशक्ति सेवा मंडल\n📍 H.No. 186/5, गांधी नगर, करनाल, हरियाणा (132001)\n📞 9466132732 | 9466132733 | 7015345275 | 9996181668\n📧 shriamarnathjanshakti@gmail.com',
    },
    {
        pattern: /who are you|about.*society|about.*organization|janshakti sewa mandal|sewa mandal|about sajssm|sajssm|संस्था|आप कौन|मंडल|आपका परिचय/,
        en: 'Shri Amarnath JanShakti Sewa Mandal (SAJSSM) is a registered non-profit society (REG.01104) from Karnal, Haryana. Since 2011, we have been serving Amarnath Ji pilgrims with free langar, medical aid, guidance — completely selflessly.',
        hi: 'श्री अमरनाथ जनशक्ति सेवा मंडल (SAJSSM) करनाल, हरियाणा की पंजीकृत संस्था है (REG.01104)। 2011 से निःशुल्क लंगर, चिकित्सा सहायता और मार्गदर्शन प्रदान कर रहे हैं।',
    },
    {
        pattern: /history|founded|establish|when.*start.*mandal|appreciation|award|प्रशंसा|पुरस्कार|इतिहास|स्थापना/,
        en: 'SAJSSM was founded by Late Shri Mukesh Dua Ji and friends. Started with 4–5 tents at Baltal in 2011. In 2025, received an Appreciation Letter from the J&K Lt. Governor and Shrine Board for seva at Brari Marg.',
        hi: 'SAJSSM की स्थापना स्व. श्री मुकेश दुआ जी ने की। 2011 में बालटाल में 4-5 टेंट से शुरुआत। 2025 में बराड़ी मार्ग पर सेवा के लिए J&K Lt. Governor से प्रशंसा पत्र मिला।',
    },
    {
        pattern: /volunteer|join.*team|how.*join|seva.*kaise|सेवा.*कैसे|स्वयंसेवक|जुड़ना|जुड़े/,
        en: 'To volunteer with SAJSSM, contact us at 9466132732 or email shriamarnathjanshakti@gmail.com. We welcome people from all over India who wish to serve selflessly.',
        hi: 'SAJSSM के साथ जुड़ने के लिए 9466132732 पर कॉल करें या shriamarnathjanshakti@gmail.com पर ईमेल करें।',
    },
    {
        pattern: /significance|importance|why.*holy|why.*sacred|cave.*history|shivling|बर्फ.*शिवलिंग|महत्व|पवित्र|गुफा.*इतिहास/,
        en: 'The Amarnath cave (3,880 m) is one of Hinduism\'s holiest shrines. Lord Shiva revealed the secret of immortality to Goddess Parvati here. A naturally formed ice Shivalinga appears inside, growing and shrinking with the lunar cycle — a divine miracle.',
        hi: 'अमरनाथ गुफा हिंदू धर्म के सबसे पवित्र तीर्थों में से एक है। भगवान शिव ने यहां पार्वती को अमरत्व का रहस्य बताया। प्राकृतिक बर्फ शिवलिंग चंद्र चक्र के साथ बढ़ता-घटता है।',
    },
    {
        pattern: /safety|safe.*trek|danger|precaution|सुरक्षा|सावधानी|खतरा/,
        en: 'Safety tips:\n✅ Start trek early morning\n✅ Never trek alone\n✅ Wear RFID card always\n✅ Carry medicines and water\n✅ Rest if unwell\n❌ Avoid alcohol\n❌ No unknown shortcuts\n❌ Don\'t ignore bad weather warnings',
        hi: 'सुरक्षा सुझाव:\n✅ सुबह जल्दी ट्रेक करें\n✅ अकेले न जाएं\n✅ RFID कार्ड पहनें\n✅ दवाइयां और पानी साथ रखें\n✅ तबियत खराब हो तो रुकें\n❌ शराब से बचें\n❌ खराब मौसम में आगे न जाएं',
    },
    {
        pattern: /kedarnath|केदारनाथ/,
        en: 'SAJSSM served at Kedarnath Dham from 2015 to 2019 with monthly bhandaras near the temple. After COVID, permission from the Uttarakhand government was not renewed.',
        hi: 'SAJSSM ने 2015-2019 तक केदारनाथ धाम में मासिक भंडारे किए। कोविड के बाद उत्तराखंड सरकार से अनुमति नहीं मिली।',
    },
    {
        pattern: /pony|horse|palki|palanquin|घोड़ा|पालकी|खच्चर|mule/,
        en: 'Ponies, horses, mules, and palanquins are available at Pahalgam and Baltal base camps for pilgrims who cannot trek. Rates are fixed by the administration.',
        hi: 'पहलगाम और बालटाल में टट्टू, घोड़े, खच्चर और पालकी उपलब्ध हैं। दरें प्रशासन द्वारा तय होती हैं।',
    },
    {
        pattern: /shrine board|jksasb|श्राइन बोर्ड|श्री अमरनाथ जी श्राइन/,
        en: 'Shri Amarnath Ji Shrine Board (SASB) manages the Yatra. Official website: jksasb.nic.in. The Lt. Governor of J&K is the ex-officio Chairman.',
        hi: 'श्राइन बोर्ड (SASB) यात्रा का प्रबंधन करता है। वेबसाइट: jksasb.nic.in। J&K के उपराज्यपाल पदेन अध्यक्ष हैं।',
    },
    {
        pattern: /insurance|बीमा|travel insurance|yatra insurance/,
        en: 'Yatra insurance is provided to registered pilgrims covering accidental death and permanent disability. Included with registration. Additional travel insurance is recommended.',
        hi: 'पंजीकृत यात्रियों को आकस्मिक मृत्यु और स्थायी विकलांगता का बीमा मिलता है। पंजीकरण के साथ शामिल। अतिरिक्त बीमा की भी सिफारिश है।',
    },
];

function getLocalAnswer(message, language) {
    if (!message) return null;
    const lower = message.toLowerCase();
    for (const faq of FAQ_BANK) {
        if (faq.pattern.test(lower)) {
            return language === 'en' ? faq.en : faq.hi;
        }
    }
    return null;
}

// ─── Agentic Loop Helpers ────────────────────────────────────────────────────

/**
 * Parse Gemini response — handles both SDK object and raw fetch JSON
 */
function extractReplyText(data) {
    if (!data) return null;
    if (typeof data.text === 'string' && data.text.trim()) return data.text.trim();
    if (typeof data.text === 'function') {
        const t = data.text();
        if (typeof t === 'string' && t.trim()) return t.trim();
    }
    const fallback = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof fallback === 'string' && fallback.trim()) return fallback.trim();
    return null;
}

/**
 * Safely parse JSON out of a Gemini text response
 * Strips markdown code fences if present
 */
function parseJsonSafe(text) {
    try {
        const cleaned = text.trim().replace(/^```json\s*|^```\s*|```$/gm, '').trim();
        return JSON.parse(cleaned);
    } catch {
        return null;
    }
}

function parseGeminiError(errOrText, fallbackCode) {
    const parsed = { statusCode: Number(fallbackCode) || null, status: null, retryDelaySec: null, message: typeof errOrText === 'string' ? errOrText : (errOrText?.message || '') };
    const text = parsed.message;
    if (typeof text !== 'string' || !text.trim()) return parsed;
    try {
        const obj = JSON.parse(text);
        const top = obj?.error || obj;
        if (top?.code) parsed.statusCode = Number(top.code) || parsed.statusCode;
        if (top?.status) parsed.status = String(top.status);
        if (top?.message) parsed.message = String(top.message);
        const retry = top?.details?.find((d) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
        const retryDelay = retry?.retryDelay;
        if (typeof retryDelay === 'string' && retryDelay.endsWith('s')) {
            const sec = Number(retryDelay.replace('s', ''));
            if (!Number.isNaN(sec)) parsed.retryDelaySec = sec;
        }
    } catch { /* not JSON */ }
    return parsed;
}

const DEFAULT_GEMINI_MODELS = [
    { name: 'gemini-2.0-flash', version: 'v1beta' },
    { name: 'gemini-2.0-flash-lite', version: 'v1beta' },
    { name: 'gemini-2.5-flash', version: 'v1beta' },
];
const configuredModelNames = (process.env.GEMINI_MODELS || fileEnv.GEMINI_MODELS || '').split(',').map((s) => s.trim()).filter(Boolean);
const GEMINI_MODELS = configuredModelNames.length ? configuredModelNames.map((name) => ({ name, version: 'v1beta' })) : DEFAULT_GEMINI_MODELS;

// ─── Single Gemini call (one turn) ──────────────────────────────────────────
async function callGeminiOnce({ modelName, history, systemPrompt }) {
    if (geminiClient) {
        const response = await geminiClient.models.generateContent({
            model: modelName,
            contents: history,
            config: { systemInstruction: systemPrompt, temperature: 0.3, maxOutputTokens: 600 },
        });
        return extractReplyText(response);
    }

    // Fallback: raw fetch
    if (typeof fetch !== 'function') throw new Error('No HTTP client available');
    const { name: mn, version } = GEMINI_MODELS.find((m) => m.name === modelName) || { name: modelName, version: 'v1beta' };
    const url = `https://generativelanguage.googleapis.com/${version}/models/${mn}:generateContent?key=${geminiApiKey}`;
    const payload = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: history,
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
    };
    const fetchRes = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!fetchRes.ok) {
        const errText = await fetchRes.text();
        const parsedError = parseGeminiError(errText, fetchRes.status);
        const err = new Error(parsedError.message || `HTTP ${fetchRes.status}`);
        err.statusCode = parsedError.statusCode || fetchRes.status;
        err.status = parsedError.status;
        err.retryDelaySec = parsedError.retryDelaySec;
        throw err;
    }
    const data = await fetchRes.json();
    return extractReplyText(data);
}

/**
 * ─── AGENTIC LOOP ────────────────────────────────────────────────────────────
 *
 * How it works:
 * 1. First turn: Gemini gets user message + system prompt.
 *    It responds with either:
 *      a) { action: "answer", reply: "..." }   → direct answer, we're done
 *      b) { action: "fetch_info", type: "weather"|"news"|..., params: {...} }
 *         → we fetch real data, push it back into history, loop again
 *
 * For Nandi (Amarnath-only bot), the only "tool" currently is live weather
 * at Baltal/Sonamarg via wttr.in (no API key needed).
 * The loop exits after a direct answer OR after max 3 tool calls (safety).
 */
async function runAgentLoop({ userMessage, language, modelName }) {
    const systemPrompt = buildSystemPrompt(language);

    // Conversation history in Gemini format
    const history = [
        {
            role: 'user',
            parts: [{ text: buildAgentPrompt(userMessage, language) }],
        },
    ];

    const MAX_TOOL_CALLS = 3;
    let toolCallCount = 0;

    while (toolCallCount <= MAX_TOOL_CALLS) {
        const raw = await callGeminiOnce({ modelName, history, systemPrompt });
        if (!raw) throw new Error('Empty response from Gemini');

        // Try to parse as agent JSON
        const parsed = parseJsonSafe(raw);

        // ── Direct answer (or non-JSON response) ────────────────────────────
        if (!parsed || parsed.action === 'answer') {
            // If it's JSON with a reply field, use that; otherwise use raw text
            return parsed?.reply || raw;
        }

        // ── Tool call ────────────────────────────────────────────────────────
        if (parsed.action === 'fetch_info') {
            toolCallCount++;
            history.push({ role: 'model', parts: [{ text: raw }] });

            let toolResult;
            try {
                toolResult = await executeTool(parsed.type, parsed.params || {});
            } catch (toolErr) {
                toolResult = `Tool error: ${toolErr.message}`;
            }

            // Push tool result back as user turn (Gemini doesn't have a "tool" role in basic API)
            history.push({
                role: 'user',
                parts: [{ text: `Tool result for "${parsed.type}":\n${JSON.stringify(toolResult)}\n\nNow give the final answer to the user using this data. Respond in JSON: { "action": "answer", "reply": "..." }` }],
            });
            continue;
        }

        // Unexpected action — treat raw as final answer
        return raw;
    }

    throw new Error('Agent loop exceeded max tool calls');
}

// ─── Available Tools ─────────────────────────────────────────────────────────

async function executeTool(type, params) {
    switch (type) {
        case 'live_weather':
            return await fetchLiveWeather(params.location || 'Baltal,Jammu and Kashmir');
        default:
            return `Tool "${type}" is not available.`;
    }
}

/**
 * Live weather using wttr.in — completely free, no API key needed
 */
async function fetchLiveWeather(location) {
    const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'NandiBot/1.0' } });
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`);
    const data = await res.json();
    const current = data.current_condition?.[0];
    if (!current) throw new Error('No weather data returned');
    return {
        location,
        temp_c: current.temp_C,
        feels_like_c: current.FeelsLikeC,
        description: current.weatherDesc?.[0]?.value,
        humidity: current.humidity,
        wind_kmph: current.windspeedKmph,
        visibility_km: current.visibility,
        cloud_cover: current.cloudcover,
    };
}

// ─── Prompt Builders ──────────────────────────────────────────────────────────

function buildSystemPrompt(language) {
    return `You are Nandi 🙏, a warm and knowledgeable spiritual assistant for Shri Amarnath JanShakti Sewa Mandal (SAJSSM), Karnal.

You help pilgrims with questions about:
- Shri Amarnath Ji Yatra (routes, registration, dates, tips, safety)
- SAJSSM's langar seva at Domail (Baltal) and Brari Marg
- Yatra preparation, health, packing
- Donations and volunteering for SAJSSM

Always respond in ${language === 'en' ? 'English' : 'Hindi'}.
Keep answers concise (under 150 words). Be warm, respectful, and spiritually uplifting.
If the question is completely unrelated to Yatra or SAJSSM, politely decline and redirect.

Key facts:
- SAJSSM serves free langar at Baltal route since 2011
- Office: H.No. 186/5, Gandhi Nagar, Karnal, Haryana (132001)
- Phone: 9466132732
- Registration: jksasb.nic.in
- Yatra 2026 starts 3rd July 2026

You are an agent. Respond ONLY in valid JSON (no markdown, no extra text):
- To answer directly: { "action": "answer", "reply": "your answer here" }
- To fetch live weather: { "action": "fetch_info", "type": "live_weather", "params": { "location": "Baltal,Jammu and Kashmir" } }

Only call live_weather if the user specifically asks for CURRENT/LIVE/TODAY's weather at the Amarnath route or cave.`;
}

function buildAgentPrompt(userMessage, language) {
    return `User message: "${userMessage}"

Respond in JSON only. If this needs live weather data, use the fetch_info action. Otherwise, answer directly.`;
}

// ─── Main Route ───────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
    try {
        const { message, language = 'hi' } = req.body || {};
        const lang = language === 'en' ? 'en' : 'hi';

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, message: 'Missing message' });
        }

        // Topic gate (English only; Hindi is more permissive)
        if (lang === 'en' && !isRelatedToTopic(message)) {
            return res.json({
                success: true,
                reply: 'Please ask questions related to Amarnath Ji Yatra or our langar seva. I am Nandi, your spiritual guide for the Yatra! 🙏',
            });
        }

        // 1. Try local FAQ first (instant, no API needed)
        const localAnswer = getLocalAnswer(message, lang);
        if (localAnswer) {
            return res.json({ success: true, reply: localAnswer, source: 'faq' });
        }

        // 2. No API key → graceful fallback
        if (!geminiApiKey) {
            return res.json({
                success: true,
                reply: lang === 'en'
                    ? 'I am Nandi 🙏 AI services are temporarily unavailable. Please call 9466132732 or email shriamarnathjanshakti@gmail.com.'
                    : 'मैं नंदी हूं 🙏 AI सेवाएं उपलब्ध नहीं हैं। कृपया 9466132732 पर कॉल करें।',
                degraded: true,
            });
        }

        // 2b. Quota cooldown
        if (Date.now() < quotaCooldownUntil) {
            const waitSec = Math.max(1, Math.ceil((quotaCooldownUntil - Date.now()) / 1000));
            return res.json({
                success: true,
                reply: lang === 'en'
                    ? `I am Nandi 🙏 AI quota is temporarily exhausted. Please retry in about ${waitSec} seconds.`
                    : `मैं नंदी हूं 🙏 AI कोटा अस्थायी रूप से समाप्त है। कृपया ${waitSec} सेकंड बाद प्रयास करें।`,
                degraded: true,
                reason: 'quota_cooldown',
            });
        }

        // 3. Run agentic loop — try each model in order
        let quotaExceeded = false;
        let retryAfterSec = null;

        for (const { name } of GEMINI_MODELS) {
            try {
                const reply = await runAgentLoop({ userMessage: message, language: lang, modelName: name });
                if (reply) {
                    console.log(`[Nandi] answered using ${name} (agentic loop)`);
                    return res.json({ success: true, reply: reply.trim(), model: name });
                }
                console.warn(`[Nandi] ${name} returned no usable text.`);
            } catch (modelErr) {
                const parsedError = parseGeminiError(modelErr);
                if (parsedError.statusCode === 429 || parsedError.status === 'RESOURCE_EXHAUSTED' || modelErr.statusCode === 429) {
                    quotaExceeded = true;
                    retryAfterSec = parsedError.retryDelaySec || modelErr.retryDelaySec;
                    quotaCooldownUntil = Date.now() + Math.max(5, Math.ceil(retryAfterSec || 15)) * 1000;
                    console.warn(`[Nandi] ${name} quota exhausted.`);
                    break;
                }
                if (parsedError.statusCode === 404 || parsedError.status === 'NOT_FOUND' || modelErr.statusCode === 404) {
                    console.warn(`[Nandi] ${name} not available for this API key.`);
                    continue;
                }
                console.warn(`[Nandi] ${name} error:`, parsedError.message || modelErr.message);
            }
        }

        // All models failed
        if (quotaExceeded) {
            const retryTextEn = retryAfterSec ? ` Please retry in about ${Math.ceil(retryAfterSec)} seconds.` : ' Please retry after a short while.';
            const retryTextHi = retryAfterSec ? ` कृपया ${Math.ceil(retryAfterSec)} सेकंड बाद प्रयास करें।` : ' थोड़ी देर बाद प्रयास करें।';
            return res.json({
                success: true,
                reply: lang === 'en' ? `I am Nandi 🙏 AI quota exhausted.${retryTextEn}` : `मैं नंदी हूं 🙏 AI कोटा समाप्त।${retryTextHi}`,
                degraded: true,
                reason: 'quota_exhausted',
            });
        }

        return res.json({
            success: true,
            reply: lang === 'en'
                ? 'I am Nandi 🙏 Could not connect to AI right now. Please call 9466132732. Jai Baba Barfani!'
                : 'मैं नंदी हूं 🙏 AI से कनेक्ट नहीं हो पाया। कृपया 9466132732 पर कॉल करें। जय बाबा बर्फानी!',
            degraded: true,
        });

    } catch (err) {
        console.error('[Nandi] Unexpected error:', err);
        next(err);
    }
});

module.exports = router;
