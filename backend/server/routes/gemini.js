const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });
const fileEnv = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath, 'utf8')) : {};

const geminiApiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    fileEnv.GEMINI_API_KEY ||
    fileEnv.GOOGLE_API_KEY;

const router = express.Router();

// ─── Topic keyword whitelist ────────────────────────────────────────────────
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

// ─── Local FAQ bank ─────────────────────────────────────────────────────────
// Each entry: { pattern: RegExp, en: string, hi: string }
const FAQ_BANK = [

    // ── Yatra dates ────────────────────────────────────────────────────────────
    {
        pattern: /when.*(yatra|start|begin|commence)|yatra.*start|starting date|start date|kab.*shuru|kab.*start|kab.*hogi|kab.*hoga|shuru.*kab|तारीख|कब शुरू|कब होगी|उद्घाटन/,
        en: 'Shri Amarnath Ji Yatra 2026 is will commence on 3rd July 2026. The official inauguration date is already announced by the Shrine Board. Stay connected with our website for updates.',
        hi: 'श्री अमरनाथ जी यात्रा 2026 का शुभारंभ 3 जुलाई 2026 से होगा। श्राइन बोर्ड द्वारा आधिकारिक तिथि की घोषणा की जा चुकी है। अपडेट के लिए हमारी वेबसाइट से जुड़े रहें।',
    },

    // ── Yatra end date ─────────────────────────────────────────────────────────
    {
        pattern: /yatra.*end|end.*yatra|last date|kab.*khatam|kab.*samapt|समाप्त|आखिरी तारीख/,
        en: 'Shri Amarnath Ji Yatra 2026 is expected to end on Shravan Purnima (Raksha Bandhan). The exact end date will be declared by the Shrine Board.',
        hi: 'श्री अमरनाथ जी यात्रा 2026 श्रावण पूर्णिमा (रक्षाबंधन) पर समाप्त होने की संभावना है। सटीक तारीख श्राइन बोर्ड द्वारा घोषित की जाएगी।',
    },

    // ── Langar location ────────────────────────────────────────────────────────
    {
        pattern: /langar.*location|location.*langar|where.*langar|langar.*where|camp.*location|baltal|domail|brari.*marg|लंगर.*कहां|लंगर.*स्थान|कैम्प.*कहां|कहां.*लंगर|कहाँ.*लंगर/,
        en: 'Shri Amarnath JanShakti Sewa Mandal serves langar at the Baltal route — at Domail, Baltal (Base Camp)and Brari Marg (the highest point on Baltal route). The base camp is located at Domail,Baltal.',
        hi: 'श्री अमरनाथ जनशक्ति सेवा मंडल बालटाल रूट पर लंगर सेवा देता है — दोमेल,बालटाल (बेस केंप) और बराड़ी  मार्ग (बालटाल रूट का सर्वोच्च बिंदु) पर। बेस कैम्प दोमेल,बालटाल में स्थित है।',
    },

    // ── Langar timing ──────────────────────────────────────────────────────────
    {
        pattern: /langar.*time|time.*langar|when.*langar|langar.*kab|लंगर.*समय|लंगर.*कब/,
        en: 'The langar runs 24/7 during Yatra season. It is completely free of cost for all pilgrims.',
        hi: 'लंगर यात्रा सीजन के दौरान 24/7 चलता है। यह सभी तीर्थयात्रियों के लिए पूरी तरह निःशुल्क है।',
    },

    // ── Langar items served ────────────────────────────────────────────────────
    {
        pattern: /what.*langar|langar.*food|langar.*mein.*kya|लंगर.*क्या|लंगर.*भोजन|खाना.*लंगर/,
        en: 'Our langar serves nutritious hot food including dal, rice, roti, sabzi, khichdi, tea, and other items to keep pilgrims energised on the trek.',
        hi: 'हमारे लंगर में दाल, चावल, रोटी, सब्जी, खिचड़ी, चाय और अन्य पौष्टिक गर्म भोजन परोसा जाता है ताकि यात्री ट्रेक पर ऊर्जावान रहें।',
    },

    // ── Routes ────────────────────────────────────────────────────────────────
    {
        pattern: /which route|routes?|pahalgam|baltal route|how to reach|travel route|trek|मार्ग|रास्ता|कौन सा मार्ग|यात्रा मार्ग|पहलगाम|बालटाल/,
        en: 'There are two main Yatra routes:\n1️⃣ Pahalgam route — 48 km trek, approx 4–5 days (easier, scenic)\n2️⃣ Baltal route — 14 km trek, approx 1 day (shorter, steeper)\nOur camps are on the Baltal route.',
        hi: 'यात्रा के दो मुख्य मार्ग हैं:\n1️⃣ पहलगाम मार्ग — 48 किमी ट्रेक, लगभग 4-5 दिन (आसान, सुंदर)\n2️⃣ बालटाल मार्ग — 14 किमी ट्रेक, लगभग 1 दिन (छोटा, खड़ा)\nहमारे कैम्प बालटाल मार्ग पर हैं।',
    },

    // ── Registration ──────────────────────────────────────────────────────────
    {
        pattern: /register|registration|how to apply|apply for yatra|yatra registration|रजिस्टर|रजिस्ट्रेशन|पंजीकरण|कैसे रजिस्टर|आवेदन/,
        en: 'Yatra registration is done online at jksasb.nic.in or through designated bank branches. Registration for 2026 is already began on 15 April 2026. A valid health certificate (CHC) is mandatory.',
        hi: 'यात्रा पंजीकरण jksasb.nic.in पर ऑनलाइन या नामित बैंक शाखाओं के माध्यम से किया जाता है। 2026 के लिए पंजीकरण 15 अप्रैल 2026 से शुरू हो चुका है। वैध स्वास्थ्य प्रमाणपत्र (CHC) अनिवार्य है।',
    },

    // ── Health certificate ─────────────────────────────────────────────────────
    {
        pattern: /health certificate|medical certificate|fitness|chc|compulsory health|स्वास्थ्य प्रमाणपत्र|चिकित्सा प्रमाणपत्र|मेडिकल|फिटनेस/,
        en: 'A Compulsory Health Certificate (CHC) is mandatory for Yatra registration. It must be obtained from authorised government hospitals or CHC centres. The certificate is valid for the current Yatra season only.',
        hi: 'यात्रा पंजीकरण के लिए अनिवार्य स्वास्थ्य प्रमाणपत्र (CHC) आवश्यक है। यह अधिकृत सरकारी अस्पतालों या CHC केंद्रों से प्राप्त करना होता है। प्रमाणपत्र केवल वर्तमान यात्रा सीजन के लिए मान्य होता है।',
    },

    // ── RFID card ─────────────────────────────────────────────────────────────
    {
        pattern: /rfid|radio frequency|id card|yatra card|आरएफआईडी|यात्रा कार्ड/,
        en: 'An RFID card is issued to registered pilgrims. It must be worn around your neck throughout the Yatra. It is used for tracking pilgrim safety and is checked at various points on the route.',
        hi: 'पंजीकृत तीर्थयात्रियों को RFID कार्ड जारी किया जाता है। इसे पूरी यात्रा के दौरान गले में पहनना अनिवार्य है। यह यात्री सुरक्षा ट्रैकिंग के लिए उपयोग होता है और मार्ग पर विभिन्न जगह चेक किया जाता है।',
    },

    // ── Helicopter ────────────────────────────────────────────────────────────
    {
        pattern: /helicopter|heli.*service|heli.*booking|helipad|हेलीकॉप्टर|हेली/,
        en: 'Helicopter services are available for Yatra from Baltal and Pahalgam helipads to Panjtarni (near the cave). Booking is done through the Shrine Board website jksasb.nic.in. Helicopters are subject to weather conditions.',
        hi: 'यात्रा के लिए (नीलग्रथ )बालटाल और पहलगाम हेलीपैड से पंजतरणी (गुफा के पास) तक हेलीकॉप्टर सेवाएं उपलब्ध हैं। बुकिंग श्राइन बोर्ड की वेबसाइट jksasb.nic.in से की जाती है। हेलीकॉप्टर सेवा मौसम पर निर्भर करती है।',
    },

    // ── Weather ───────────────────────────────────────────────────────────────
    {
        pattern: /weather|temperature|cold|climate|मौसम|तापमान|ठंड|जलवायु/,
        en: 'The weather at Amarnath cave (3,880 m altitude) is very cold even in summer. Temperature ranges from 0°C to 15°C during July–August. Snowfall and rain are common. Always carry warm clothes, raincoat, and trekking shoes.',
        hi: 'अमरनाथ गुफा (3,880 मीटर ऊंचाई) पर गर्मियों में भी मौसम बहुत ठंडा होता है। जुलाई-अगस्त में तापमान 0°C से 15°C के बीच रहता है। बर्फबारी और बारिश सामान्य है। हमेशा गर्म कपड़े, रेनकोट और ट्रेकिंग जूते साथ रखें।',
    },

    // ── Altitude sickness ──────────────────────────────────────────────────────
    {
        pattern: /altitude.*sick|mountain sick|AMS|high altitude|ऊंचाई.*बीमारी|पहाड़.*बीमार|altitude/,
        en: 'Altitude sickness (AMS) can affect pilgrims above 3,000 m. Symptoms include headache, nausea, and breathlessness. Acclimatise slowly, stay hydrated, avoid alcohol, and rest if you feel unwell. Medical help is available at camps.',
        hi: 'ऊंचाई पर बीमारी (AMS) 3,000 मीटर से ऊपर तीर्थयात्रियों को प्रभावित कर सकती है। लक्षणों में सिरदर्द, मतली और सांस फूलना शामिल हैं। धीरे-धीरे अभ्यस्त हों, हाइड्रेटेड रहें, शराब से बचें। कैम्पों पर चिकित्सा सहायता उपलब्ध है।',
    },

    // ── Packing list ──────────────────────────────────────────────────────────
    {
        pattern: /what.*carry|what.*pack|packing|essential.*items|kya.*le|kya.*lana|क्या.*लाएं|क्या.*ले जाएं|सामान/,
        en: 'Essential items to carry:\n• Warm clothes (thermals, jacket, gloves, woollen cap)\n• Raincoat or poncho\n• Trekking shoes (waterproof)\n• Walking stick or trekking pole\n• Water bottle & dry snacks\n• Medicines & first-aid kit\n• RFID card & registration slip\n• ID proof (Aadhar/Passport)',
        hi: 'आवश्यक सामान:\n• गर्म कपड़े (थर्मल, जैकेट, दस्ताने, ऊनी टोपी)\n• रेनकोट या पोंचो\n• ट्रेकिंग जूते (वाटरप्रूफ)\n• चलने की छड़ी या ट्रेकिंग पोल\n• पानी की बोतल और सूखा नाश्ता\n• दवाइयां और प्राथमिक चिकित्सा किट\n• RFID कार्ड और रजिस्ट्रेशन स्लिप\n• पहचान पत्र (आधार/पासपोर्ट)',
    },

    // ── Fitness preparation ────────────────────────────────────────────────────
    {
        pattern: /fitness|prepare|exercise|training|physical|फिटनेस|तैयारी|व्यायाम|प्रशिक्षण/,
        en: 'Start physical preparation at least 6–8 weeks before Yatra. Do daily walking, climbing stairs, and light jogging. Yoga and breathing exercises (pranayama) are very helpful for high-altitude trekking.',
        hi: 'यात्रा से कम से कम 6-8 सप्ताह पहले शारीरिक तैयारी शुरू करें। रोज चलें, सीढ़ियां चढ़ें और हल्की जॉगिंग करें। उच्च ऊंचाई ट्रेकिंग के लिए योग और प्राणायाम बहुत सहायक हैं।',
    },

    // ── How to reach Baltal ────────────────────────────────────────────────────
    {
        pattern: /how.*reach|reach.*baltal|reach.*srinagar|reach.*jammu|कैसे पहुंचें|पहुंचना|कैसे जाएं/,
        en: 'To reach Baltal:\n✈️ By Air — Fly to Srinagar Airport, then drive ~97 km to Baltal\n🚂 By Train — Reach Jammu/Srinagar, then take bus or taxi\n🚗 By Road — Drive via Srinagar–Sonamarg highway to Baltal\n\nBase camps and transport are available from Srinagar.',
        hi: 'बालटाल पहुंचने के लिए:\n✈️ हवाई मार्ग — श्रीनगर एयरपोर्ट, फिर ~97 किमी ड्राइव\n🚂 रेल मार्ग — जम्मू/श्रीनगर तक, फिर बस या टैक्सी\n🚗 सड़क मार्ग — श्रीनगर-सोनमर्ग राजमार्ग से बालटाल\n\nश्रीनगर से बेस कैम्प और परिवहन उपलब्ध हैं।',
    },

    // ── Donation ──────────────────────────────────────────────────────────────
    {
        pattern: /donate|donation|how.*help|contribute|bank.*account|upi|दान|कैसे.*मदद|योगदान|बैंक.*खाता/,
        en: 'You can donate to support our langar seva:\n🏦 Bank: HDFC Bank\nA/C: SHRI AMARNATH JANSHAKTI SEWA MANDAL\nA/C No: 50200109501402\nIFSC: HDFC0003989\n📱 UPI: 9466132732@ibl\n\nYou can also donate ration items, warm clothes, or medicines directly.',
        hi: 'आप हमारी लंगर सेवा को सहयोग देने के लिए दान कर सकते हैं:\n🏦 बैंक: HDFC Bank\nखाता: SHRI AMARNATH JANSHAKTI SEWA MANDAL\nखाता नंबर: 50200109501402\nIFSC: HDFC0003989\n📱 UPI: 9466132732@ibl\n\nआप राशन, गर्म कपड़े या दवाइयां भी सीधे दान कर सकते हैं।',
    },

    // ── Contact / office ──────────────────────────────────────────────────────
    {
        pattern: /contact|address|where is.*office|office location|karnal|कार्यालय|पता|संपर्क|ऑफिस/,
        en: 'Shri Amarnath JanShakti Sewa Mandal\n📍 H.No. 186/5, Gandhi Nagar, Karnal, Haryana (132001)\n📞 9466132732 | 9466132733 | 7015345275 | 9996181668\n📧 shriamarnathjanshakti@gmail.com',
        hi: 'श्री अमरनाथ जनशक्ति सेवा मंडल\n📍 H.No. 186/5, गांधी नगर, करनाल, हरियाणा (132001)\n📞 9466132732 | 9466132733 | 7015345275 | 9996181668\n📧 shriamarnathjanshakti@gmail.com',
    },

    // ── About society ─────────────────────────────────────────────────────────
    {
        pattern: /who are you|about.*society|about.*organization|janshakti sewa mandal|sewa mandal|about sajssm|sajssm|संस्था|आप कौन|मंडल|आपका परिचय/,
        en: 'Shri Amarnath JanShakti Sewa Mandal (SAJSSM) is a registered non-profit society (REG.01104) from Karnal, Haryana. Since 2011, we have been serving Amarnath Ji pilgrims with free langar, medical aid, guidance, and social services — completely selflessly.',
        hi: 'श्री अमरनाथ जनशक्ति सेवा मंडल (SAJSSM) करनाल, हरियाणा की एक पंजीकृत गैर-लाभकारी संस्था है (REG.01104)। 2011 से हम अमरनाथ जी तीर्थयात्रियों को निःशुल्क लंगर, चिकित्सा सहायता, मार्गदर्शन और सेवा — पूरी तरह निःस्वार्थ भाव से प्रदान कर रहे हैं।',
    },

    // ── History of society ────────────────────────────────────────────────────
    {
        pattern: /history|founded|establish|when.*start.*mandal|appreciation|award|प्रशंसा|पुरस्कार|इतिहास|स्थापना/,
        en: 'SAJSSM was founded by Late Shri Mukesh Dua Ji and friends. We started with 4–5 tents at Baltal in 2011. In 2025, we received an Appreciation Letter from the J&K Lt. Governor and Shrine Board for our seva at Brari Marg — the highest point on the Baltal route.',
        hi: 'SAJSSM की स्थापना स्व. श्री मुकेश दुआ जी और उनके मित्रों ने की थी। 2011 में बालटाल में 4-5 टेंट से शुरुआत हुई। 2025 में बराड़ी  मार्ग पर सेवा के लिए जम्मू-कश्मीर के लेफ्टिनेंट गवर्नर और श्राइन बोर्ड से प्रशंसा पत्र मिला।',
    },

    // ── Volunteer ────────────────────────────────────────────────────────────
    {
        pattern: /volunteer|join.*team|how.*join|seva.*kaise|सेवा.*कैसे|स्वयंसेवक|जुड़ना|जुड़े/,
        en: 'To join as a volunteer with SAJSSM, contact us at 9466132732 or email shriamarnathjanshakti@gmail.com. We welcome people from all over India who wish to serve Amarnath Ji Yatris selflessly.',
        hi: 'SAJSSM के साथ स्वयंसेवक के रूप में जुड़ने के लिए 9466132732 पर संपर्क करें या shriamarnathjanshakti@gmail.com पर ईमेल करें। हम पूरे भारत से उन लोगों का स्वागत करते हैं जो निःस्वार्थ भाव से अमरनाथ जी यात्रियों की सेवा करना चाहते हैं।',
    },

    // ── Amarnath cave significance ────────────────────────────────────────────
    {
        pattern: /significance|importance|why.*holy|why.*sacred|cave.*history|shivling|बर्फ.*शिवलिंग|महत्व|पवित्र|गुफा.*इतिहास/,
        en: 'The Amarnath cave (3,880 m) is one of Hinduism\'s holiest shrines. Legend says Lord Shiva revealed the secret of immortality to Goddess Parvati here. A naturally formed ice Shivalinga appears inside the cave, growing and shrinking with the lunar cycle — considered a divine miracle.',
        hi: 'अमरनाथ गुफा (3,880 मीटर) हिंदू धर्म के सबसे पवित्र तीर्थस्थलों में से एक है। किंवदंती है कि भगवान शिव ने यहां देवी पार्वती को अमरत्व का रहस्य बताया था। गुफा के अंदर प्राकृतिक रूप से बर्फ का शिवलिंग बनता है जो चंद्र चक्र के साथ बढ़ता-घटता है — इसे दिव्य चमत्कार माना जाता है।',
    },

    // ── Safety tips ────────────────────────────────────────────────────────────
    {
        pattern: /safety|safe.*trek|danger|precaution|सुरक्षा|सावधानी|खतरा/,
        en: 'Safety tips for Yatra:\n✅ Start trek early morning\n✅ Never trek alone\n✅ Wear RFID card at all times\n✅ Carry medicines and water\n✅ Rest if unwell — don\'t push limits\n❌ Avoid alcohol\n❌ Don\'t take unknown shortcuts\n❌ Don\'t ignore bad weather warnings',
        hi: 'यात्रा के लिए सुरक्षा सुझाव:\n✅ सुबह जल्दी ट्रेक शुरू करें\n✅ कभी अकेले ट्रेक न करें\n✅ हमेशा RFID कार्ड पहनें\n✅ दवाइयां और पानी साथ रखें\n✅ तबियत खराब हो तो रुकें — सीमा पार न करें\n❌ शराब से बचें\n❌ अज्ञात शॉर्टकट न लें\n❌ खराब मौसम की चेतावनी को अनदेखा न करें',
    },

    // ── Kedarnath seva ─────────────────────────────────────────────────────────
    {
        pattern: /kedarnath|केदारनाथ/,
        en: 'SAJSSM also served at Kedarnath Dham from 2015 to 2019 — organising monthly bhandaras at the Pravachan Hall near the Kedarnath temple. After the COVID period, permission from the Uttarakhand government was not renewed.',
        hi: 'SAJSSM ने 2015 से 2019 तक केदारनाथ धाम में भी सेवा दी — केदारनाथ मंदिर के पास प्रवचन हॉल में मासिक भंडारे आयोजित किए। कोविड काल के बाद उत्तराखंड सरकार से अनुमति नहीं मिल पाई।',
    },

    // ── Pony / Horse riding ────────────────────────────────────────────────────
    {
        pattern: /pony|horse|palki|palanquin|घोड़ा|पालकी|खच्चर|mule/,
        en: 'Ponies, horses, mules, and palanquins (palkis) are available for hire at Pahalgam and Baltal base camps for pilgrims who cannot trek. Rates are fixed by the administration every year.',
        hi: 'जो तीर्थयात्री ट्रेक नहीं कर सकते, उनके लिए पहलगाम और बालटाल बेस कैम्प पर टट्टू, घोड़े, खच्चर और पालकी उपलब्ध हैं। दरें प्रशासन द्वारा हर साल तय की जाती हैं।',
    },

    // ── Shrine Board ──────────────────────────────────────────────────────────
    {
        pattern: /shrine board|jksasb|श्राइन बोर्ड|श्री अमरनाथ जी श्राइन/,
        en: 'Shri Amarnath Ji Shrine Board (SASB) manages the Yatra. Official website: jksasb.nic.in. The Lt. Governor of J&K is the ex-officio Chairman of the Shrine Board.',
        hi: 'श्री अमरनाथ जी श्राइन बोर्ड (SASB) यात्रा का प्रबंधन करता है। आधिकारिक वेबसाइट: jksasb.nic.in। जम्मू-कश्मीर के उपराज्यपाल श्राइन बोर्ड के पदेन अध्यक्ष हैं।',
    },

    // ── Insurance ─────────────────────────────────────────────────────────────
    {
        pattern: /insurance|बीमा|travel insurance|yatra insurance/,
        en: 'Yatra insurance is provided to registered pilgrims by the Shrine Board — covering accidental death and permanent disability. It is included with registration. Additional travel insurance is recommended for medical expenses.',
        hi: 'श्राइन बोर्ड द्वारा पंजीकृत तीर्थयात्रियों को यात्रा बीमा प्रदान किया जाता है — जिसमें आकस्मिक मृत्यु और स्थायी विकलांगता शामिल है। यह पंजीकरण के साथ शामिल है। चिकित्सा खर्चों के लिए अतिरिक्त यात्रा बीमा की सिफारिश की जाती है।',
    },
];

// ─── Match FAQ ───────────────────────────────────────────────────────────────
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

// ─── Gemini model list with correct API versions ─────────────────────────────
// ⚠️  gemini-2.0-* and gemini-1.5-* need v1beta; gemini-1.0-pro uses v1
const GEMINI_MODELS = [
    { name: 'gemini-2.0-flash', version: 'v1beta' },
    { name: 'gemini-1.5-flash', version: 'v1beta' },
    { name: 'gemini-1.5-pro', version: 'v1beta' },
    { name: 'gemini-1.0-pro', version: 'v1' },
];

// ─── Main route ──────────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
    try {
        const { message, language = 'hi' } = req.body || {};

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, message: 'Missing message' });
        }

        // ── Topic gate (English only; Hindi is more permissive) ──────────────────
        if (language === 'en' && !isRelatedToTopic(message)) {
            return res.json({
                success: true,
                reply: 'Please ask questions related to Amarnath Ji Yatra or our langar seva. I am Nandi, your spiritual guide for the Yatra! 🙏',
            });
        }

        // ── 1. Try local FAQ first (instant, no API needed) ─────────────────────
        const localAnswer = getLocalAnswer(message, language);
        if (localAnswer) {
            return res.json({ success: true, reply: localAnswer, source: 'faq' });
        }

        // ── 2. No API key → graceful fallback ────────────────────────────────────
        if (!geminiApiKey) {
            return res.json({
                success: true,
                reply: language === 'en'
                    ? 'I am Nandi 🙏 AI services are temporarily unavailable. For help, please call 9466132732 or email shriamarnathjanshakti@gmail.com.'
                    : 'मैं नंदी हूं 🙏 AI सेवाएं अभी उपलब्ध नहीं हैं। सहायता के लिए कृपया 9466132732 पर कॉल करें या shriamarnathjanshakti@gmail.com पर ईमेल करें।',
                degraded: true,
            });
        }

        // ── 3. Call Gemini API ────────────────────────────────────────────────────
        const systemPrompt = `You are Nandi, a warm and knowledgeable spiritual assistant for Shri Amarnath JanShakti Sewa Mandal (SAJSSM), Karnal. 
Your role is to help pilgrims with questions about:
- Shri Amarnath Ji Yatra (routes, registration, dates, tips)
- SAJSSM's langar seva at Domail(Baltal), and Brari Marg
- Yatra preparation, health, packing, safety
- Donations and volunteering for SAJSSM

Respond ONLY in ${language === 'en' ? 'English' : 'Hindi'}. Keep answers concise (under 150 words). Be warm, respectful, and spiritually uplifting. If the question is completely unrelated to Yatra or SAJSSM, politely decline and redirect.

Key facts:
- SAJSSM serves free langar at Baltal route since 2011
- Office: H.No. 186/5, Gandhi Nagar, Karnal, Haryana (132001)
- Phone: 9466132732
- Registration at: jksasb.nic.in
- Yatra 2026 expected from 3rd July 2026`;

        const payload = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: systemPrompt },
                        { text: `\nUser question: ${message}` },
                    ],
                },
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 500,
            },
        };

        // Try each model in order until one works
        for (const { name, version } of GEMINI_MODELS) {
            try {
                const url = `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${geminiApiKey}`;

                const fetchRes = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!fetchRes.ok) {
                    const errText = await fetchRes.text();
                    console.warn(`[Nandi] ${name} failed (${fetchRes.status}):`, errText);
                    continue; // try next model
                }

                const data = await fetchRes.json();
                const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (reply) {
                    console.log(`[Nandi] answered using ${name}`);
                    return res.json({ success: true, reply: reply.trim(), model: name });
                }

                console.warn(`[Nandi] ${name} returned no text:`, JSON.stringify(data));
            } catch (modelErr) {
                console.warn(`[Nandi] ${name} threw error:`, modelErr.message);
            }
        }

        // ── All models failed → graceful fallback ─────────────────────────────────
        return res.json({
            success: true,
            reply: language === 'en'
                ? 'I am Nandi 🙏 I could not connect to AI right now. Please call us at 9466132732 or email shriamarnathjanshakti@gmail.com for assistance. Jai Baba Barfani!'
                : 'मैं नंदी हूं 🙏 अभी AI से कनेक्ट नहीं हो पाया। कृपया 9466132732 पर कॉल करें या shriamarnathjanshakti@gmail.com पर ईमेल करें। जय बाबा बर्फानी!',
            degraded: true,
        });

    } catch (err) {
        console.error('[Nandi] Unexpected error:', err);
        next(err);
    }
});

module.exports = router;