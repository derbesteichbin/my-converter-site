import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import { useToast } from '../components/Toast';

const PACKS = [
  { id: 'pack1', label: '1 Conversion', price: '0.99', credits: 1 },
  { id: 'pack10', label: '10 Conversions', price: '7.99', credits: 10, popular: true },
  { id: 'pack30', label: '30 Conversions', price: '20.99', credits: 30 },
];

export default function Pricing() {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', companyEmail: '', description: '' });
  const [sending, setSending] = useState(false);

  async function handleBuy(packId) {
    setLoading(packId);
    try {
      const res = await api('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack: packId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || 'Failed to start checkout', 'error');
        return;
      }
      window.location.href = data.url;
    } catch {
      toast('Could not connect to server', 'error');
    } finally {
      setLoading('');
    }
  }

  async function handleContact(e) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api('/api/billing/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        toast('Message sent! We will get back to you soon.', 'success');
        setShowContact(false);
        setContactForm({ name: '', companyEmail: '', description: '' });
      } else {
        toast('Failed to send message', 'error');
      }
    } catch {
      toast('Could not connect to server', 'error');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page">
      <h1 style={{ textAlign: 'center' }}>{t('pricing.title')}</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {t('pricing.subtitle')}
      </p>

      <div className="pricing-grid pricing-grid-4">
        {/* Free tier */}
        <div className="pricing-card">
          <h2>{t('pricing.free')}</h2>
          <p className="pricing-price">&euro;0</p>
          <p className="pricing-desc">Try it out with no commitment. Perfect for a quick one-time conversion.</p>
          <ul className="pricing-features">
            <li>1 free conversion credit</li>
            <li>All 50+ file formats</li>
            <li>Up to 200 MB per file</li>
            <li>Files deleted after 24h</li>
            <li>No credit card required</li>
          </ul>
          <Link to="/register" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
            {t('pricing.getStarted')}
          </Link>
        </div>

        {/* Credit packs */}
        {PACKS.map((pack) => (
          <div className={`pricing-card ${pack.popular ? 'pricing-card-highlight' : ''}`} key={pack.id}>
            <h2>{pack.label}</h2>
            <p className="pricing-price">&euro;{pack.price}</p>
            <p className="pricing-desc">
              {pack.credits === 1 ? 'Need just one more conversion? Pay as you go.' :
               pack.credits === 10 ? 'Best value for regular use. Credits never expire.' :
               'Our best deal — ideal for batch projects and teams.'}
            </p>
            <ul className="pricing-features">
              <li>{pack.credits} conversion credit{pack.credits > 1 ? 's' : ''}</li>
              <li>All 50+ file formats</li>
              <li>Up to 200 MB per file</li>
              <li>Priority processing speed</li>
              <li>Credits never expire</li>
              {pack.credits >= 10 && <li>Batch convert multiple files</li>}
              {pack.credits >= 30 && <li>Advanced settings (OCR, resize)</li>}
            </ul>
            <button
              className="btn-primary"
              style={{ display: 'block', width: '100%', textAlign: 'center' }}
              disabled={loading === pack.id}
              onClick={() => handleBuy(pack.id)}
              type="button"
            >
              {loading === pack.id ? 'Redirecting...' : `Buy for \u20AC${pack.price}`}
            </button>
          </div>
        ))}
      </div>

      {/* Business plan */}
      <div className="business-plan">
        <h2>Business</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Need unlimited conversions, API access, or a custom solution? Contact us for a tailored plan.
        </p>
        {!showContact ? (
          <button className="btn-primary" onClick={() => setShowContact(true)} type="button">
            Contact us
          </button>
        ) : (
          <form className="contact-form" onSubmit={handleContact}>
            <input type="text" placeholder="Your name" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
            <input type="email" placeholder="Company email" required value={contactForm.companyEmail} onChange={(e) => setContactForm({ ...contactForm, companyEmail: e.target.value })} />
            <textarea placeholder="Tell us about your needs..." required rows={4} value={contactForm.description} onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })} />
            <div className="contact-form-actions">
              <button className="btn-primary" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send message'}</button>
              <button className="btn-ghost" type="button" onClick={() => setShowContact(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
