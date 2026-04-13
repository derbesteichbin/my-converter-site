import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  async function handleGetPro() {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to start checkout');
        return;
      }

      window.location.href = data.url;
    } catch {
      alert('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1 style={{ textAlign: 'center' }}>Pricing</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
        Simple pricing, no hidden fees.
      </p>

      <div className="pricing-grid">
        <div className="pricing-card">
          <h2>Free</h2>
          <p className="pricing-price">$0</p>
          <ul className="pricing-features">
            <li>5 conversions per day</li>
            <li>Max 10 MB files</li>
            <li>Standard speed</li>
          </ul>
          <Link to="/register" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
            Get started
          </Link>
        </div>

        <div className="pricing-card pricing-card-highlight">
          <h2>Pro</h2>
          <p className="pricing-price">$9<span className="pricing-period">/mo</span></p>
          <ul className="pricing-features">
            <li>Unlimited conversions</li>
            <li>Max 500 MB files</li>
            <li>Priority speed</li>
            <li>Batch convert</li>
          </ul>
          <button
            className="btn-primary"
            style={{ display: 'block', width: '100%', textAlign: 'center' }}
            disabled={loading}
            onClick={handleGetPro}
          >
            {loading ? 'Redirecting...' : 'Get Pro'}
          </button>
        </div>
      </div>
    </div>
  );
}
