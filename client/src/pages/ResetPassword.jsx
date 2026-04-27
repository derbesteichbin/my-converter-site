import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { api } from '../api';
import PasswordInput from '../components/PasswordInput';

export default function ResetPassword() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  const isStrong = hasMinLength && hasUppercase && hasNumber && hasSpecial;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isStrong) {
      setError(t('auth.pwWeak'));
      return;
    }
    if (!passwordsMatch) {
      setError(t('auth.pwMismatch'));
      return;
    }

    setLoading(true);

    try {
      const res = await api('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('reset.failed'));
        return;
      }

      setDone(true);
    } catch {
      setError(t('common.connectError'));
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-form">
          <h1>{t('reset.invalidTitle')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('reset.invalidBody')}</p>
          <Link to="/forgot-password" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            {t('reset.requestNew')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <SEO title={t('reset.title')} path="/reset-password" />
      <div className="auth-form">
        <h1>{t('reset.title')}</h1>

        {done ? (
          <div className="forgot-success">
            <p>{t('reset.doneBody')}</p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              {t('reset.loginNew')}
            </Link>
          </div>
        ) : (
          <>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label htmlFor="password">{t('reset.newPassword')}</label>
              <PasswordInput
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label={t('reset.newPassword')}
              />

              {password.length > 0 && (
                <ul className="password-checklist">
                  <li className={hasMinLength ? 'check-pass' : 'check-fail'}>{t('auth.pwMinLength')}</li>
                  <li className={hasUppercase ? 'check-pass' : 'check-fail'}>{t('auth.pwUppercase')}</li>
                  <li className={hasNumber ? 'check-pass' : 'check-fail'}>{t('auth.pwNumber')}</li>
                  <li className={hasSpecial ? 'check-pass' : 'check-fail'}>{t('auth.pwSpecial')}</li>
                </ul>
              )}

              <label htmlFor="confirmPassword">{t('reset.confirmPassword')}</label>
              <PasswordInput
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label={t('reset.confirmPassword')}
              />

              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="password-mismatch">{t('auth.pwMismatch')}</p>
              )}

              <button type="submit" disabled={loading || !isStrong || !passwordsMatch}>
                {loading ? t('reset.resetting') : t('reset.resetBtn')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
