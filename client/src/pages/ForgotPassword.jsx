import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';

export default function ForgotPassword() {
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
        setError(data.error || 'Something went wrong');
        return;
      }

      setSent(true);
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <Helmet><title>Forgot Password - Converter</title></Helmet>
      <div className="auth-form">
        <h1>Forgot password</h1>

        {sent ? (
          <div className="forgot-success">
            <p>If an account exists with that email, we've sent a password reset link.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Check your inbox and spam folder. The link expires in 1 hour.
            </p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            {error && <p className="auth-error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
            <p className="auth-switch">
              Remember your password? <Link to="/login">Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
