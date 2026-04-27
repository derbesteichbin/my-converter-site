import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { api } from '../api';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t('forgot.somethingWrong'));
        return;
      }

      setSent(true);
    } catch {
      setError(t('common.connectError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <SEO title={t('forgot.title')} path="/forgot-password" />
      <div className="auth-form">
        <h1>{t('forgot.title')}</h1>

        {sent ? (
          <div className="forgot-success">
            <p>{t('forgot.sentMain')}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {t('forgot.sentHint')}
            </p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              {t('forgot.backToLogin')}
            </Link>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              {t('forgot.instruction')}
            </p>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">{t('auth.email')}</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label={t('auth.email')}
              />
              <button type="submit" disabled={loading}>
                {loading ? t('forgot.sending') : t('forgot.sendLink')}
              </button>
            </form>
            <p className="auth-switch">
              {t('forgot.remember')} <Link to="/login">{t('auth.logIn')}</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
