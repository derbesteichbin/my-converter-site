import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import { useToast } from '../components/Toast';
import SEO from '../components/SEO';

// Toggle to re-enable payments. When false, Buy buttons render as a disabled
// "Coming soon" button and a notice appears above the pricing cards.
const PAYMENTS_ENABLED = true;

// Savings vs buying `credits` × the single-conversion price (€0.99).
//   10 × 0.99 = 9.90 → 7.99 saves 19.3% (round to 19)
//   30 × 0.99 = 29.70 → 20.99 saves 29.3% (round to 29)
const PACK_IDS = [
  { id: 'pack1', credits: 1, price: '0.99' },
  { id: 'pack10', credits: 10, price: '7.99', popular: true, savings: 19 },
  { id: 'pack30', credits: 30, price: '20.99', savings: 29 },
];

// Public-facing promo code. Server has the same constant in
// server/routes/billing.js — both must agree. Comparison is case-insensitive.
const PROMO_CODE = 'convertanyformat2026';
const PROMO_DISCOUNT = 0.5; // 50% off

function applyDiscount(price) {
  return (parseFloat(price) * (1 - PROMO_DISCOUNT)).toFixed(2);
}

export default function Pricing() {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', company: '', companyEmail: '', description: '' });
  const [sending, setSending] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(''); // '' | PROMO_CODE
  const promoActive = appliedPromo === PROMO_CODE;

  function handleApplyPromo(e) {
    e.preventDefault();
    const trimmed = promoInput.trim().toLowerCase();
    if (trimmed === PROMO_CODE) {
      setAppliedPromo(PROMO_CODE);
    } else {
      setAppliedPromo('');
      toast(t('pricing.promoInvalid'), 'error');
    }
  }

  async function handleBuy(packId) {
    setLoading(packId);
    try {
      const res = await api('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack: packId, promoCode: promoActive ? PROMO_CODE : undefined }),
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
        setContactForm({ name: '', company: '', companyEmail: '', description: '' });
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
        title={t('pricing.seoTitle')}
        path="/pricing"
        description={t('pricing.seoDesc')}
      />
      <h1 style={{ textAlign: 'center' }}>{t('pricing.title')}</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        {t('pricing.subtitle')}
      </p>

      {/* Promo banner — visible on every visit until a different one is launched */}
      <div className="promo-banner" role="region" aria-label={t('pricing.promotionAria')}>
        <p className="promo-banner-text">
          {t('pricing.promoBannerText', { code: PROMO_CODE.toUpperCase() })}
        </p>
        <form className="promo-input-row" onSubmit={handleApplyPromo}>
          <label htmlFor="promo-code" className="promo-label">
            {t('pricing.promoLabel')}
          </label>
          <input
            id="promo-code"
            type="text"
            className="promo-input"
            placeholder={t('pricing.promoPlaceholder')}
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="btn-primary promo-apply-btn">
            {t('pricing.promoApply')}
          </button>
        </form>
        {promoActive && (
          <p className="promo-applied" role="status">
            ✓ {t('pricing.promoApplied')}
          </p>
        )}
      </div>

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
          {t('pricing.paymentsUnavailable')}
        </p>
      )}

      <div className="pricing-grid">
        {PACK_IDS.map((pack) => (
          <div className={`pricing-card ${pack.popular ? 'pricing-card-highlight' : ''}`} key={pack.id}>
            {pack.savings && (
              <span className="pricing-savings-badge" aria-label={t('pricing.save', { percent: pack.savings })}>
                {t('pricing.save', { percent: pack.savings })}
              </span>
            )}
            <h2>{packLabel(pack.credits)}</h2>
            {promoActive ? (
              <p className="pricing-price">
                <span className="pricing-price-original">&euro;{pack.price}</span>
                <span className="pricing-price-discounted">&euro;{applyDiscount(pack.price)}</span>
              </p>
            ) : (
              <p className="pricing-price">&euro;{pack.price}</p>
            )}
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
                ? t('pricing.comingSoonBtn')
                : loading === pack.id
                ? t('pricing.redirecting')
                : t('pricing.buyFor', { price: promoActive ? applyDiscount(pack.price) : pack.price })}
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
            <input type="text" placeholder={t('pricing.contactCompanyName')} value={contactForm.company} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} />
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
