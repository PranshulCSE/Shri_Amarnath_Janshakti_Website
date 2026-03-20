import React, { useState } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AnnouncementPopup from './components/common/AnnouncementPopup';
import Ticker from './components/common/Ticker';
import ScrollToTop from './components/common/ScrollToTop';

import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import HistoryPage from './components/pages/HistoryPage';
import YatraPage from './components/pages/YatraPage';
import DonationPage from './components/pages/DonationPage';
import GalleryPage from './components/pages/GalleryPage';
import ContactPage from './components/pages/ContactPage';

export default function App() {
  const [page, setPage] = useState('home');

  const navigate = (id) => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pages = {
    home:     <HomePage     navigate={navigate} />,
    about:    <AboutPage    navigate={navigate} />,
    history:  <HistoryPage  navigate={navigate} />,
    yatra:    <YatraPage    navigate={navigate} />,
    donation: <DonationPage navigate={navigate} />,
    gallery:  <GalleryPage  navigate={navigate} />,
    contact:  <ContactPage  navigate={navigate} />,
  };

  return (
    <>
      <AnnouncementPopup />
      <ScrollToTop />
      <Ticker />
      <Header activePage={page} navigate={navigate} />
      <main>{pages[page]}</main>
      <Footer navigate={navigate} />
    </>
  );
}
