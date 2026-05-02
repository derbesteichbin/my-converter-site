import { useState, useEffect, useRef } from 'react';
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

function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

export default function Navbar({ scrolled = false }) {
  const { t, i18n } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  // Single source of truth for "are we on mobile?" — drives every inline
  // style that bypasses the stylesheet. Initialised from window.innerWidth
  // so the first paint is correct.
  const [isMobile, setIsMobile] = useState(() => isMobileViewport());
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Track viewport size. Inline styles derived from `isMobile` win over any
  // stylesheet rule, including !important — which sidesteps whatever was
  // overriding the media-query display toggle.
  useEffect(() => {
    function update() { setIsMobile(isMobileViewport()); }
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  // Inline styles authoritatively control display/visibility on mobile.
  const hamburgerStyle = { display: isMobile ? 'flex' : 'none' };
  const panelStyle = !isMobile
    ? { display: 'none' }
    : {
        display: 'flex',
        opacity: menuOpen ? 1 : 0,
        transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
        pointerEvents: menuOpen ? 'auto' : 'none',
        visibility: menuOpen ? 'visible' : 'hidden',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
      };
  const backdropStyle = isMobile && menuOpen
    ? { display: 'block' }
    : { display: 'none' };

  // Refresh auth state on route change AND when the mobile menu opens.
  useEffect(() => {
    api('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setLoggedIn(!!data.user))
      .catch(() => setLoggedIn(false));
  }, [location.pathname, menuOpen]);

  // Close menu on route change.
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Close menu on Escape.
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
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-logo" aria-label={t('nav.home')} onClick={closeMenu}>
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

      {/* ---- Mobile hamburger ----
          Placed immediately after the logo per request. Logo uses
          margin-right: auto, so on mobile (where the desktop sections are
          hidden) the hamburger ends up on the right edge anyway. The
          display value is controlled by an inline style driven by a
          window.innerWidth listener — bypasses any CSS specificity
          conflicts that could hide it. */}
      <button
        className="mobile-nav-toggle"
        style={hamburgerStyle}
        onClick={() => {
          // Diagnostic log — confirms the click is reaching React.
          // eslint-disable-next-line no-console
          console.log('[Navbar] hamburger clicked, current menuOpen =', menuOpen);
          setMenuOpen((prev) => !prev);
        }}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-panel"
        type="button"
      >
        {menuOpen ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        )}
      </button>

      {/* ---- Desktop nav (hidden on mobile via CSS) ---- */}
      <div className="navbar-desktop-links">
        <Link to="/tools">{t('nav.tools')}</Link>
        <Link to="/pricing">{t('nav.pricing')}</Link>
      </div>

      <div className="navbar-desktop-actions">
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

      {/* ---- Mobile dropdown panel (full-width, drops down from navbar) ----
          Inline styles authoritatively control display + visibility so no
          stylesheet rule can hide them. The CSS class is kept for visual
          styling (size, padding, colors). */}
      <div
        className="mobile-nav-backdrop"
        style={backdropStyle}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        id="mobile-nav-panel"
        ref={panelRef}
        className={`mobile-nav-panel ${menuOpen ? 'mobile-nav-panel-open' : ''}`}
        style={panelStyle}
        role="menu"
        aria-hidden={!menuOpen}
      >
        <Link to="/tools" onClick={closeMenu} role="menuitem">{t('nav.tools')}</Link>
        <Link to="/pricing" onClick={closeMenu} role="menuitem">{t('nav.pricing')}</Link>

        {loggedIn ? (
          <>
            <Link to="/dashboard" onClick={closeMenu} role="menuitem">{t('nav.dashboard')}</Link>
            <Link to="/profile" onClick={closeMenu} role="menuitem">{t('nav.profile')}</Link>
            <button
              type="button"
              role="menuitem"
              className="mobile-nav-logout"
              onClick={handleLogout}
            >{t('nav.logout')}</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu} role="menuitem">{t('nav.login')}</Link>
            <Link to="/register" onClick={closeMenu} role="menuitem" className="mobile-nav-cta">{t('nav.register')}</Link>
          </>
        )}

        <div className="mobile-nav-divider" aria-hidden="true" />

        <button
          type="button"
          role="menuitem"
          className="mobile-nav-theme"
          onClick={toggleTheme}
          aria-label={t('nav.toggleDark')}
        >
          <span className="mobile-nav-theme-icon" aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
          <span>{t('nav.toggleDark')}</span>
        </button>

        <label className="mobile-nav-lang-row">
          <span>{t('nav.language')}</span>
          <select
            className="mobile-nav-lang"
            value={i18n.language}
            onChange={changeLang}
            aria-label={t('nav.language')}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </label>
      </div>
    </nav>
  );
}
