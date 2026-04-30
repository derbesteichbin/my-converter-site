import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';

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
  { code: 'da', label: 'Dansk' },
  { code: 'fi', label: 'Suomi' },
  { code: 'cs', label: 'Cestina' },
  { code: 'ro', label: 'Romana' },
  { code: 'hu', label: 'Magyar' },
  { code: 'el', label: 'Ελληνικα' },
  { code: 'tr', label: 'Turkce' },
];

function getInitialTheme() {
  try { return localStorage.getItem('theme') || 'light'; }
  catch { return 'light'; }
}

export default function Navbar({ scrolled = false }) {
  const { t, i18n } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [menuOpen]);

  // Close drawer on Escape
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e) { if (e.key === 'Escape') setMenuOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  async function handleLogout() {
    await api('/api/auth/logout', { method: 'POST' });
    setLoggedIn(false);
    setMenuOpen(false);
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
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

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu-drawer"
          type="button"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div
        className={`mobile-menu-overlay ${menuOpen ? 'mobile-menu-overlay-open' : ''}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <aside
        id="mobile-menu-drawer"
        className={`mobile-menu ${menuOpen ? 'mobile-menu-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">{t('nav.home')}</span>
          <button
            className="mobile-menu-close"
            onClick={closeMenu}
            aria-label="Close menu"
            type="button"
          >×</button>
        </div>

        <nav className="mobile-menu-links" aria-label="Mobile navigation">
          <Link to="/" onClick={closeMenu}>{t('nav.home')}</Link>
          <Link to="/tools" onClick={closeMenu}>{t('nav.tools')}</Link>
          <Link to="/pricing" onClick={closeMenu}>{t('nav.pricing')}</Link>
          {loggedIn ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>{t('nav.dashboard')}</Link>
              <Link to="/profile" onClick={closeMenu}>{t('nav.profile')}</Link>
              <button className="mobile-menu-logout" onClick={handleLogout} type="button">{t('nav.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>{t('nav.login')}</Link>
              <Link to="/register" onClick={closeMenu} className="mobile-menu-cta">{t('nav.register')}</Link>
            </>
          )}
        </nav>

        <div className="mobile-menu-footer">
          <button
            className="btn-ghost mobile-menu-theme"
            onClick={toggleTheme}
            type="button"
            aria-label={t('nav.toggleDark')}
          >
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            <span>{t('nav.toggleDark')}</span>
          </button>
          <select
            className="lang-select mobile-menu-lang"
            value={i18n.language}
            onChange={changeLang}
            aria-label={t('nav.language')}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
      </aside>
    </>
  );
}
