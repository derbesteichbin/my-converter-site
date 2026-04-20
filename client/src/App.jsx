import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { t } = useTranslation();

  return (
    <>
      <a href="#main-content" className="skip-link">{t('skip')}</a>
      <Navbar />
      <CommandPalette />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
