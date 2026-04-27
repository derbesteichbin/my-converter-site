import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';

// Languages currently exposed in the picker. To re-enable da, fi, cs, ro, hu,
// el, or tr, add them back here — translation files in i18n-translations.js
// already include them.
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Francais' },
  { code: 'es', label: 'Espanol' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Portugues' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'sv', label: 'Svenska' },
  { code: 'no', label: 'Norsk' },
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
      <Link to="/" className="navbar-logo" aria-label={t('nav.home')}>
        <img
          src={theme === 'dark' ? '/images/logo-dark.png' : '/images/logo-light.png'}
          alt="ConvertAnyFormat"
          className="navbar-logo-img"
          width="44"
          height="44"
          loading="lazy"
        />
        <span>ConvertAnyFormat</span>
      </Link>

      <div className="navbar-links">
        <Link to="/tools">{t('nav.tools')}</Link>
        <Link to="/pricing">{t('nav.pricing')}</Link>
      </div>

      <div className="navbar-auth">
        <select className="lang-select" value={i18n.language} onChange={changeLang} aria-label={t('nav.language')}>
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>

        <button className="btn-ghost theme-toggle" onClick={toggleTheme} title={t('nav.toggleDark')} type="button" aria-label={t('nav.toggleDark')}>
          {theme === 'light' ? '☾' : '☀'}
        </button>

        {loggedIn ? (
          <>
            <Link to="/dashboard" className="btn-ghost">{t('nav.dashboard')}</Link>
            <Link to="/profile" className="btn-ghost" aria-label={t('nav.profile')}>{t('nav.profile')}</Link>
            <button className="btn-ghost" onClick={handleLogout} aria-label={t('nav.logout')}>{t('nav.logout')}</button>
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
