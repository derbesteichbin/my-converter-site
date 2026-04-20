import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Espanol' },
  { code: 'fr', label: 'Francais' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Portugues' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' },
  { code: 'tr', label: 'Turkce' },
  { code: 'sv', label: 'Svenska' },
  { code: 'no', label: 'Norsk' },
  { code: 'da', label: 'Dansk' },
  { code: 'fi', label: 'Suomi' },
  { code: 'cs', label: 'Cestina' },
  { code: 'ro', label: 'Romana' },
  { code: 'hu', label: 'Magyar' },
  { code: 'el', label: 'Ελληνικα' },
  { code: 'he', label: 'עברית' },
  { code: 'th', label: 'ไทย' },
  { code: 'vi', label: 'Tieng Viet' },
  { code: 'id', label: 'Indonesia' },
  { code: 'hi', label: 'हिन्दी' },
];

function getInitialTheme() {
  try { return localStorage.getItem('theme') || 'light'; }
  catch { return 'light'; }
}

export default function Navbar({ scrolled = false }) {
  const { t, i18n } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    api('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setLoggedIn(!!data.user))
      .catch(() => setLoggedIn(false));
  }, [location.pathname]);

  async function handleLogout() {
    await api('/api/auth/logout', { method: 'POST' });
    setLoggedIn(false);
    navigate('/login');
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }

  function changeLang(e) {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-logo" aria-label="Home">
        <img
          src={theme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png'}
          alt="ConvertAnything"
          className="navbar-logo-img"
          width="44"
          height="44"
          loading="lazy"
        />
        <span>ConvertAnything</span>
      </Link>

      <div className="navbar-links">
        <Link to="/tools">{t('nav.tools')}</Link>
        <Link to="/pricing">{t('nav.pricing')}</Link>
      </div>

      <div className="navbar-auth">
        <select className="lang-select" value={i18n.language} onChange={changeLang} aria-label="Language">
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>

        <button className="btn-ghost theme-toggle" onClick={toggleTheme} title="Toggle dark mode" type="button" aria-label="Toggle dark mode">
          {theme === 'light' ? '\u263E' : '\u2600'}
        </button>

        {loggedIn ? (
          <>
            <Link to="/dashboard" className="btn-ghost">{t('nav.dashboard')}</Link>
            <Link to="/profile" className="btn-ghost" aria-label="Profile">Profile</Link>
            <button className="btn-ghost" onClick={handleLogout} aria-label="Log out">{t('nav.logout')}</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">{t('nav.login')}</Link>
            <Link to="/register" className="btn-primary">{t('nav.register')}</Link>
          </>
        )}
      </div>
    </nav>
  );
}
