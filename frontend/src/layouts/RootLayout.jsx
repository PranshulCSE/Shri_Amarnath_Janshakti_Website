import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import AnnouncementPopup from '../components/common/AnnouncementPopup';
import Ticker from '../components/common/Ticker';
import ScrollToTop from '../components/common/ScrollToTop';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import NandiButton from '../components/common/NandiButton';

export default function RootLayout() {
  return (
    <>
      <AnnouncementPopup />
      <ScrollToTop />
      <LanguageSwitcher />
      <Ticker />
      {/* We will need to update Header & Footer to use react-router-dom links instead of manual navigation, but for now we pass navigate mock or fix them. Let's fix them next. */}
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <NandiButton />
    </>
  );
}
