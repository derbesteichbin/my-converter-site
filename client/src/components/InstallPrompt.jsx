import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DISMISSED_KEY = 'pwaInstallDismissed';

// Re-offer the prompt after a while rather than never again — someone who
// dismisses it on a first visit may well want it a month later.
const SNOOZE_MS = 30 * 24 * 60 * 60 * 1000;

function wasDismissed() {
  try {
    const at = Number(localStorage.getItem(DISMISSED_KEY));
    return Boolean(at) && Date.now() - at < SNOOZE_MS;
  } catch {
    return false;
  }
}

// The cookie banner sits bottom-centre and goes full width on phones, so while
// it is still showing the install pill lifts above it instead of overlapping.
function consentPending() {
  try {
    return !localStorage.getItem('cookieConsent');
  } catch {
    return false;
  }
}

/**
 * One-tap install for browsers that fire `beforeinstallprompt` (Chrome, Edge
 * and other Chromium browsers on Android and desktop).
 *
 * iOS Safari never fires the event and gives no programmatic install API, so
 * nothing is rendered there — iPhone users take the standard Share → "Add to
 * Home Screen" route, which the apple-* meta tags in index.html configure.
 */
export default function InstallPrompt() {
  const { t } = useTranslation();
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);
  const [raised, setRaised] = useState(false);

  useEffect(() => {
    // Already running as an installed app — never advertise installing again.
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    if (standalone || wasDismissed()) return undefined;

    function onBeforeInstallPrompt(e) {
      // Suppress Chrome's own mini-infobar so this button is the only prompt.
      e.preventDefault();
      setDeferred(e);
      setRaised(consentPending());
      setVisible(true);
    }

    function onInstalled() {
      setVisible(false);
      setDeferred(null);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  async function install() {
    if (!deferred) return;
    setVisible(false);
    deferred.prompt();
    try {
      const { outcome } = await deferred.userChoice;
      // A dismissed native dialog counts as a dismissal, otherwise the pill
      // would reappear on the next navigation and start to nag.
      if (outcome !== 'accepted') dismiss(false);
    } catch {
      /* the browser closed the dialog itself */
    }
    setDeferred(null);
  }

  function dismiss(hide = true) {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      /* private mode — the pill simply reappears next visit */
    }
    if (hide) setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={`install-prompt${raised ? ' install-prompt-raised' : ''}`} role="region" aria-label={t('install.aria', { defaultValue: 'Install app' })}>
      <img className="install-prompt-icon" src="/icons/icon-192.png" alt="" width="28" height="28" />
      <span className="install-prompt-text">
        {t('install.text', { defaultValue: 'Add ConvertAnyFormat to your home screen' })}
      </span>
      <button type="button" className="install-prompt-btn" onClick={install}>
        {t('install.action', { defaultValue: 'Install' })}
      </button>
      <button
        type="button"
        className="install-prompt-close"
        onClick={() => dismiss()}
        aria-label={t('install.dismiss', { defaultValue: 'Dismiss' })}
      >
        &times;
      </button>
    </div>
  );
}
