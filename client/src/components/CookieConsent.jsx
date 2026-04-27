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

  function acceptAll() { saveConsent({ analytics: true, marketing: true }); }
  function rejectAll() { saveConsent({ analytics: false, marketing: false }); }
  function savePrefs() { saveConsent({ analytics: prefs.analytics, marketing: prefs.marketing }); }

  const settingsButton = consent && !showBanner && !showManager ? (
    <button
      className="cookie-settings-btn"
      onClick={() => { setShowManager(true); setShowBanner(false); }}
      aria-label={t('cookie.settingsLabel')}
      type="button"
    >⚙</button>
  ) : null;

  if (!showBanner && !showManager) return settingsButton;

  return (
    <>
      {settingsButton}

      {showManager && (
        <div className="cookie-overlay" onClick={() => setShowManager(false)}>
          <div className="cookie-manager" onClick={(e) => e.stopPropagation()}>
            <h3>{t('cookie.settingsTitle')}</h3>
            <p className="cookie-manager-desc">{t('cookie.settingsDesc')}</p>

            <div className="cookie-toggle-group">
              <label className="cookie-toggle">
                <span className="cookie-toggle-info">
                  <strong>{t('cookie.essential')}</strong>
                  <span>{t('cookie.essentialDesc')}</span>
                </span>
                <input type="checkbox" checked disabled />
              </label>

              <label className="cookie-toggle">
                <span className="cookie-toggle-info">
                  <strong>{t('cookie.analytics')}</strong>
                  <span>{t('cookie.analyticsDesc')}</span>
                </span>
                <input type="checkbox" checked={prefs.analytics} onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })} />
              </label>

              <label className="cookie-toggle">
                <span className="cookie-toggle-info">
                  <strong>{t('cookie.marketing')}</strong>
                  <span>{t('cookie.marketingDesc')}</span>
                </span>
                <input type="checkbox" checked={prefs.marketing} onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })} />
              </label>
            </div>

            <div className="cookie-manager-actions">
              <button className="btn-primary" onClick={savePrefs} type="button">{t('cookie.savePrefs')}</button>
              <button className="btn-ghost" onClick={() => setShowManager(false)} type="button">{t('cookie.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {showBanner && !showManager && (
        <div className="cookie-banner" role="dialog" aria-label={t('cookie.settingsLabel')}>
          <p className="cookie-message">{t('cookie.message')}</p>
          <div className="cookie-actions">
            <button className="btn-primary" onClick={acceptAll} type="button">{t('cookie.acceptAll')}</button>
            <button className="btn-ghost" onClick={rejectAll} type="button">{t('cookie.rejectAll')}</button>
            <button className="btn-ghost" onClick={() => { setShowManager(true); setShowBanner(false); }} type="button">{t('cookie.manage')}</button>
          </div>
        </div>
      )}
    </>
  );
}
