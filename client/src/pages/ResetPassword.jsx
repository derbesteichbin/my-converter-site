import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { api } from '../api';
import PasswordInput from '../components/PasswordInput';

export default function ResetPassword() {
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
      setError('Password does not meet all requirements');
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match');
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
        setError(data.error || 'Failed to reset password');
        return;
      }

      setDone(true);
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-form">
          <h1>Invalid link</h1>
          <p style={{ color: 'var(--text-muted)' }}>This reset link is missing or invalid.</p>
          <Link to="/forgot-password" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <SEO title="Reset Password" path="/reset-password" />
      <div className="auth-form">
        <h1>Reset password</h1>

        {done ? (
          <div className="forgot-success">
            <p>Your password has been reset successfully.</p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Log in with new password
            </Link>
          </div>
        ) : (
          <>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label htmlFor="password">New password</label>
              <PasswordInput
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="New password"
              />

              {password.length > 0 && (
                <ul className="password-checklist">
                  <li className={hasMinLength ? 'check-pass' : 'check-fail'}>At least 6 characters</li>
                  <li className={hasUppercase ? 'check-pass' : 'check-fail'}>At least one uppercase letter (A-Z)</li>
                  <li className={hasNumber ? 'check-pass' : 'check-fail'}>At least one number (0-9)</li>
                  <li className={hasSpecial ? 'check-pass' : 'check-fail'}>At least one special character (!@#$%^&*)</li>
                </ul>
              )}

              <label htmlFor="confirmPassword">Confirm password</label>
              <PasswordInput
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm new password"
              />

              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="password-mismatch">Passwords do not match</p>
              )}

              <button type="submit" disabled={loading || !isStrong || !passwordsMatch}>
                {loading ? 'Resetting...' : 'Reset password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
