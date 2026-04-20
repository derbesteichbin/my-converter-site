import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function getStoredConsent() {
  try {
    const stored = localStorage.getItem('cookieConsent');
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export default function CookieConsent() {
  const { t } = useTranslation();
  const [consent, setConsent] = useState(getStoredConsent);
  const [showBanner, setShowBanner] = useState(!consent);
  const [showManager, setShowManager] = useState(false);
  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: consent?.analytics ?? false,
    marketing: consent?.marketing ?? false,
  });

  function saveConsent(choices) {
    const data = { essential: true, ...choices, timestamp: Date.now() };
    localStorage.setItem('cookieConsent', JSON.stringify(data));
    setConsent(data);
    setShowBanner(false);
    setShowManager(false);
  }

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true });
  }

  function rejectAll() {
    saveConsent({ analytics: false, marketing: false });
  }

  function savePrefs() {
    saveConsent({ analytics: prefs.analytics, marketing: prefs.marketing });
  }

  // Floating settings button (always visible after consent)
  const settingsButton = consent && !showBanner && !showManager ? (
    <button
      className="cookie-settings-btn"
      onClick={() => { setShowManager(true); setShowBanner(false); }}
      aria-label="Cookie settings"
      type="button"
    >
      &#9881;
    </button>
  ) : null;

  if (!showBanner && !showManager) return settingsButton;

  return (
    <>
      {settingsButton}

      {/* Manager panel */}
      {showManager && (
        <div className="cookie-overlay" onClick={() => setShowManager(false)}>
          <div className="cookie-manager" onClick={(e) => e.stopPropagation()}>
            <h3>Cookie Settings</h3>
            <p className="cookie-manager-desc">
              Choose which cookies you want to allow. Essential cookies are required for the site to function.
            </p>

            <div className="cookie-toggle-group">
              <label className="cookie-toggle">
                <span className="cookie-toggle-info">
                  <strong>Essential</strong>
                  <span>Required for the site to work. Cannot be disabled.</span>
                </span>
                <input type="checkbox" checked disabled />
              </label>

              <label className="cookie-toggle">
                <span className="cookie-toggle-info">
                  <strong>Analytics</strong>
                  <span>Help us understand how you use the site to improve it.</span>
                </span>
                <input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })} />
              </label>

              <label className="cookie-toggle">
                <span className="cookie-toggle-info">
                  <strong>Marketing</strong>
                  <span>Used for personalized ads and promotions.</span>
                </span>
                <input type="checkbox" checked={prefs.marketing} onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })} />
              </label>
            </div>

            <div className="cookie-manager-actions">
              <button className="btn-primary" onClick={savePrefs} type="button">Save preferences</button>
              <button className="btn-ghost" onClick={() => setShowManager(false)} type="button">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      {showBanner && !showManager && (
        <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
          <p className="cookie-message">{t('cookie.message')}</p>
          <div className="cookie-actions">
            <button className="btn-primary" onClick={acceptAll} type="button">Accept All</button>
            <button className="btn-ghost" onClick={rejectAll} type="button">Reject All</button>
            <button className="btn-ghost" onClick={() => { setShowManager(true); setShowBanner(false); }} type="button">Manage Cookies</button>
          </div>
        </div>
      )}
    </>
  );
}
