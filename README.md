# Shri Amarnath JanShakti Sewa Mandal — React Website

A fully responsive React website for SAJSSM (REG.01104), Karnal.

---

## 📁 Project Structure

```
sajssm/
├── public/
│   └── index.html              ← HTML shell + Font Awesome CDN
│   └── Images/                 ← ⚠️ Copy your Images folder here
│   └── Docs/                   ← ⚠️ Copy your Docs folder here
│
├── src/
│   ├── index.js                ← React DOM entry point
│   ├── App.js                  ← Root router — manages active page state
│   │
│   ├── styles/
│   │   └── global.css          ← CSS variables, animations, shared classes
│   │
│   └── components/
│       ├── common/             ← Shared layout components
│       │   ├── Header.jsx / .css
│       │   ├── Footer.jsx / .css
│       │   ├── AnnouncementPopup.jsx / .css   ← Yatra 2026 popup
│       │   ├── Ticker.jsx / .css              ← Scrolling news ticker
│       │   ├── ScrollToTop.jsx / .css
│       │   └── SocialSection.jsx              ← Reusable social links block
│       │
│       └── pages/              ← One file per page
│           ├── HomePage.jsx / .css
│           ├── AboutPage.jsx / .css
│           ├── HistoryPage.jsx / .css
│           ├── YatraPage.jsx / .css
│           ├── DonationPage.jsx / .css
│           ├── GalleryPage.jsx / .css
│           └── ContactPage.jsx / .css
│
└── package.json
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Copy your assets
```
public/Images/    ← logo.png.png, Yatra2.jpg, Visiting_SAJSSM.jpg,
                     Holy Cave.jpeg, Governer.jpeg, Kanhaiya-Mittal.jpeg,
                     Base Camp.jpeg, Brari-Officers.jpeg,
                     Base-Camp_mandir.jpeg, Card_front-cropped.jpg,
                     image.png, qr.png.jpg

public/Docs/      ← List of Bank Branches 2025.pdf,
                     CHC English 2025.pdf, Application-Form-2025.pdf
```

### 3. Start development server
```bash
npm start
```
Opens at **http://localhost:3000**

### 4. Build for production
```bash
npm run build
```
Upload the `build/` folder to your web hosting.

---

## 🎨 Color Theme

| Variable      | Value     | Usage            |
|---------------|-----------|------------------|
| `--primary`   | `#ff6b35` | Orange — buttons, borders |
| `--secondary` | `#f7931e` | Gold — gradients, accents |
| `--accent`    | `#004e89` | Navy — headings, nav |
| `--success`   | `#06a77d` | Green — success messages |
| `--danger`    | `#d62828` | Red — don'ts section |

---

## ✨ Features

- **Announcement Popup** — Yatra 2026 inauguration notice on every visit
- **Scrolling News Ticker** — Live announcement strip below header
- **Scroll-to-Top Button** — Appears after scrolling 300px
- **Stats Bar** — Serving Since 2011, 14+ Years, Lakhs Served
- **7 Full Pages** — Home, About, History, Yatra, Donations, Gallery, Contact
- **Responsive Design** — Mobile hamburger menu, stacked layouts
- **Form Handling** — Controlled React forms with success feedback
- **Image Fallbacks** — Emoji placeholders if images are missing

---

## 📞 Organization Details

- **Reg. No.:** 01104
- **Address:** H.No. 186/5, Gandhi Nagar, Karnal, Haryana (132001)
- **Phone:** 9466132732 | 9466132733 | 7015345275 | 9996181668
- **Email:** shriamarnathjanshakti@gmail.com
