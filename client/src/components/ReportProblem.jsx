import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';

const MAX_LEN = 1000;

// "Report a problem" feedback. The trigger is a discreet footer link; the
// modal is rendered via a portal to document.body so it centres in the
// viewport at any scroll position (same approach as the review modal).
// Reports are sent to the owner only and are never displayed anywhere.
export default function ReportProblem() {
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
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  function openModal() {
    setMessage('');
    setEmail('');
    setError('');
    setSent(false);
    setOpen(true);
  }

  async function submitReport() {
    if (!message.trim()) {
      setError(t('report.required'));
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await api('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim().slice(0, MAX_LEN),
          contactEmail: email.trim() || null,
          // Technical context captured automatically. The user agent, logged-in
          // user and timestamp are added server-side.
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError((data && data.error) || t('report.error'));
        return;
      }
      setSent(true);
    } catch {
      setError(t('report.error'));
    } finally {
      setSubmitting(false);
    }
  }

  const charsLeft = MAX_LEN - message.length;

  return (
    <>
      <button type="button" className="footer-report-link" onClick={openModal}>
        {t('report.button')}
      </button>

      {open && createPortal(
        <div
          className="rev-modal-overlay"
          onClick={() => !submitting && setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="rev-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="rev-modal-title">{t('report.title')}</h3>
            <p className="rev-modal-subtitle">{t('report.intro')}</p>

            {sent ? (
              <>
                <p className="rev-modal-thanks">{t('report.success')}</p>
                <div className="rev-modal-actions">
                  <button className="btn-primary" type="button" onClick={() => setOpen(false)}>
                    {t('report.done')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="rev-modal-label" htmlFor="report-message">
                  {t('report.messageLabel')}
                </label>
                <textarea
                  id="report-message"
                  className="rev-modal-textarea"
                  rows={4}
                  maxLength={MAX_LEN}
                  placeholder={t('report.messagePlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoFocus
                />
                <div className="rev-modal-charcount">{t('report.charsLeft', { n: charsLeft })}</div>

                <label className="rev-modal-label" htmlFor="report-email">
                  {t('report.emailLabel')}
                </label>
                <input
                  id="report-email"
                  type="email"
                  className="report-input"
                  placeholder={t('report.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="report-email-hint">{t('report.emailHint')}</div>

                {error && <p className="rev-modal-error">{error}</p>}

                <div className="rev-modal-actions">
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={submitReport}
                    disabled={submitting || !message.trim()}
                  >
                    {submitting ? t('report.submitting') : t('report.submit')}
                  </button>
                  <button
                    className="rev-modal-cancel"
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                  >
                    {t('report.cancel')}
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
