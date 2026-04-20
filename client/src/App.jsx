import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';
import useScrolled from './hooks/useScrolled.js';

export default function App() {
  const { t } = useTranslation();
  const scrolled = useScrolled();

  return (
    <>
      <a href="#main-content" className="skip-link">{t('skip')}</a>
      <Navbar scrolled={scrolled} />
      <CommandPalette />
      <main id="main-content">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
