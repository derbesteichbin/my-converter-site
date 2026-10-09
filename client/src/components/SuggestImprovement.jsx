import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';

const MAX_LEN = 1000;

// "Suggest an improvement" — the ideas counterpart to ReportProblem (bugs).
// Same pattern: a discreet footer link opening a modal that is portalled to
// document.body, so it centres in the viewport at any scroll position, with
// background scroll locked while open. Suggestions go to the owner only
// (database + email) and are never displayed anywhere on the site.
export default function SuggestImprovement() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Escape to close + lock background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape' && !submitting) setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, submitting]);

  function openModal() {
    setMessage('');
    setEmail('');
    setError('');
    setSent(false);
    setOpen(true);
  }

  async function submitSuggestion() {
    if (!message.trim()) {
      setError(t('feedback.required'));
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await api('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim().slice(0, MAX_LEN),
          contactEmail: email.trim() || null,
          // Context captured automatically. The user agent, logged-in user
          // and timestamp are added server-side.
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        // Translated rather than showing the server's English text.
        setError(res.status === 429 ? t('feedback.rateLimited') : t('feedback.error'));
        return;
      }
      setSent(true);
    } catch {
      setError(t('feedback.error'));
    } finally {
      setSubmitting(false);
    }
  }

  const charsLeft = MAX_LEN - message.length;

  return (
    <>
      <button type="button" className="footer-report-link" onClick={openModal}>
        {t('feedback.button')}
      </button>

      {open && createPortal(
        <div
          className="rev-modal-overlay"
          onClick={() => !submitting && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
          <div className="rev-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="rev-modal-title" id="feedback-title">{t('feedback.title')}</h3>
            <p className="rev-modal-subtitle">{t('feedback.intro')}</p>

            {sent ? (
              <>
                <p className="rev-modal-thanks" role="status">{t('feedback.success')}</p>
                <div className="rev-modal-actions">
                  <button className="btn-primary" type="button" onClick={() => setOpen(false)}>
                    {t('feedback.done')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="rev-modal-label" htmlFor="feedback-message">
                  {t('feedback.messageLabel')}
                </label>
                <textarea
                  id="feedback-message"
                  className="rev-modal-textarea"
                  rows={5}
                  maxLength={MAX_LEN}
                  placeholder={t('feedback.messagePlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoFocus
                />
                <div className="rev-modal-charcount" aria-live="polite">{t('feedback.charsLeft', { n: charsLeft })}</div>

                <label className="rev-modal-label" htmlFor="feedback-email">
                  {t('feedback.emailLabel')}
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  className="report-input"
                  placeholder={t('feedback.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <div className="report-email-hint">{t('feedback.emailHint')}</div>

                {error && <p className="rev-modal-error" role="alert">{error}</p>}

                <div className="rev-modal-actions">
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={submitSuggestion}
                    disabled={submitting || !message.trim()}
                  >
                    {submitting ? t('feedback.submitting') : t('feedback.submit')}
                  </button>
                  <button
                    className="rev-modal-cancel"
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                  >
                    {t('feedback.cancel')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
