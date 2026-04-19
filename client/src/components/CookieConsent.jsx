import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => {
    try { return !localStorage.getItem('cookieConsent'); }
    catch { return true; }
  });

  function handleChoice(choice) {
    localStorage.setItem('cookieConsent', choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <p className="cookie-message">{t('cookie.message')}</p>
      <div className="cookie-actions">
        <button className="btn-primary" onClick={() => handleChoice('accepted')} type="button">{t('cookie.accept')}</button>
        <button className="btn-ghost" onClick={() => handleChoice('declined')} type="button">{t('cookie.decline')}</button>
      </div>
    </div>
  );
}
