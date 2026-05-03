import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import { useToast } from '../components/Toast';
import SEO from '../components/SEO';

// Toggle to re-enable payments. When false, Buy buttons render as a disabled
// "Coming soon" button and a notice appears above the pricing cards.
const PAYMENTS_ENABLED = true;

const PACK_IDS = [
  { id: 'pack1', credits: 1, price: '0.99' },
  { id: 'pack10', credits: 10, price: '7.99', popular: true },
  { id: 'pack30', credits: 30, price: '20.99' },
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
        toast(data.error || t('pricing.checkoutFail'), 'error');
        return;
      }
      window.location.href = data.url;
    } catch {
      toast(t('common.connectError'), 'error');
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
        toast(t('pricing.messageSent'), 'success');
        setShowContact(false);
        setContactForm({ name: '', companyEmail: '', description: '' });
      } else {
        toast(t('pricing.messageFail'), 'error');
      }
    } catch {
      toast(t('common.connectError'), 'error');
    } finally {
      setSending(false);
    }
  }

  function packLabel(credits) {
    if (credits === 1) return t('pricing.pack1Label');
    if (credits === 10) return t('pricing.pack10Label');
    return t('pricing.pack30Label');
  }
  function packDesc(credits) {
    if (credits === 1) return t('pricing.pack1Desc');
    if (credits === 10) return t('pricing.pack10Desc');
    return t('pricing.pack30Desc');
  }

  return (
    <div className="page">
      <SEO
        title="Pricing - Affordable Credit Packs"
        path="/pricing"
        description="Affordable conversion credit packs from €0.99. Pay-as-you-go file conversion with no subscription. Credits never expire."
      />
      <h1 style={{ textAlign: 'center' }}>{t('pricing.title')}</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {t('pricing.subtitle')}
      </p>

      {!PAYMENTS_ENABLED && (
        <p
          role="status"
          style={{
            textAlign: 'center',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            background: 'var(--surface-2, rgba(124, 58, 237, 0.08))',
            border: '1px solid var(--border, rgba(124, 58, 237, 0.2))',
            borderRadius: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.9375rem',
          }}
        >
          Payments are temporarily unavailable. Check back soon.
        </p>
      )}

      <div className="pricing-grid">
        {PACK_IDS.map((pack) => (
          <div className={`pricing-card ${pack.popular ? 'pricing-card-highlight' : ''}`} key={pack.id}>
            <h2>{packLabel(pack.credits)}</h2>
            <p className="pricing-price">&euro;{pack.price}</p>
            <p className="pricing-desc">{packDesc(pack.credits)}</p>
            <ul className="pricing-features">
              <li>{pack.credits === 1 ? t('pricing.featCreditSingular', { count: pack.credits }) : t('pricing.featCreditPlural', { count: pack.credits })}</li>
              <li>{t('pricing.feat50')}</li>
              <li>{t('pricing.feat200')}</li>
              <li>{t('pricing.featPriority')}</li>
              <li>{t('pricing.featNeverExpire')}</li>
              {pack.credits >= 10 && <li>{t('pricing.featBatch')}</li>}
              {pack.credits >= 30 && <li>{t('pricing.featAdvanced')}</li>}
            </ul>
            <button
              className="btn-primary"
              style={{ display: 'block', width: '100%', textAlign: 'center' }}
              disabled={!PAYMENTS_ENABLED || loading === pack.id}
              onClick={() => handleBuy(pack.id)}
              type="button"
            >
              {!PAYMENTS_ENABLED
                ? 'Coming soon'
                : loading === pack.id
                ? t('pricing.redirecting')
                : t('pricing.buyFor', { price: pack.price })}
            </button>
          </div>
        ))}
      </div>

      <div className="business-plan">
        <h2>{t('pricing.business')}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('pricing.businessDesc')}</p>
        {!showContact ? (
          <button className="btn-primary" onClick={() => setShowContact(true)} type="button">
            {t('pricing.contactUs')}
          </button>
        ) : (
          <form className="contact-form" onSubmit={handleContact}>
            <input type="text" placeholder={t('pricing.contactName')} required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
            <input type="email" placeholder={t('pricing.contactCompany')} required value={contactForm.companyEmail} onChange={(e) => setContactForm({ ...contactForm, companyEmail: e.target.value })} />
            <textarea placeholder={t('pricing.contactNeeds')} required rows={4} value={contactForm.description} onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })} />
            <div className="contact-form-actions">
              <button className="btn-primary" type="submit" disabled={sending}>{sending ? t('contact.sending') : t('pricing.sendMessage')}</button>
              <button className="btn-ghost" type="button" onClick={() => setShowContact(false)}>{t('common.cancel')}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
