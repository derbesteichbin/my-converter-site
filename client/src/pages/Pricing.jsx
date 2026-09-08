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

// Public-facing promo code, shown in the banner. The browser deliberately
// does NOT know the discount amount: every discounted price comes from
// POST /api/billing/validate-promo, which reads the real Stripe Price and
// Coupon. That is the only way the quoted price and the charged price
// cannot drift apart.
const PROMO_CODE = 'convertanyformat2026';

export default function Pricing() {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', company: '', companyEmail: '', description: '' });
  const [sending, setSending] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [checkingPromo, setCheckingPromo] = useState(false);
  // Server-validated promo, or null. Shape mirrors the validate-promo
  // response: { code, packs: { pack1: { baseFormatted, finalFormatted } },
  // eligible, ineligibleReason, discount }.
  const [promo, setPromo] = useState(null);
  const [promoNotice, setPromoNotice] = useState('');
  // Prices are only ever discounted when the server said so AND the server
  // did not tell us this account is ineligible.
  const promoActive = Boolean(promo && promo.eligible);

  function clearPromo(message) {
    setPromo(null);
    setPromoNotice(message || '');
  }

  // Every promo rejection the server can return, resolved to one localized
  // string. All of them render in the .promo-notice pill under the input —
  // none of them are toasts, so feedback never scrolls away or times out.
  function promoMessageFor(data) {
    switch (data?.code || data?.reasonCode) {
      case 'invalid_promo':
        return t('pricing.promoInvalid', {
          defaultValue: "This promo code doesn't exist or is no longer valid.",
        });
      case 'promo_ended':
        return t('pricing.promoEnded', {
          defaultValue: 'This promotion has ended and is no longer available.',
        });
      case 'promo_already_used':
        return t('pricing.promoAlreadyUsed', {
          defaultValue: "You've already used this code — it's valid only on your first purchase.",
        });
      case 'promo_not_configured':
        return t('pricing.promoUnavailable', {
          defaultValue: 'This promotion is temporarily unavailable. Please try again later.',
        });
      default:
        return (
          data?.error ||
          t('pricing.promoInvalid', {
            defaultValue: "This promo code doesn't exist or is no longer valid.",
          })
        );
    }
  }

  // Rejections that are about the promo code itself, so they belong in the
  // pill. Anything else from checkout is a general failure and still toasts.
  const PROMO_ERROR_CODES = ['invalid_promo', 'promo_ended', 'promo_already_used', 'promo_not_configured'];

  async function handleApplyPromo(e) {
    e.preventDefault();
    const trimmed = promoInput.trim();
    if (!trimmed) return;

    setCheckingPromo(true);
    setPromoNotice('');
    try {
      const res = await api('/api/billing/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoCode: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Wrong code (400), offer ended (400), misconfiguration (503) — each
        // keeps its own wording, and all three land in the pill under the
        // input. Prices stay at full price in every case.
        clearPromo(promoMessageFor(data));
        return;
      }

      setPromo(data);
      if (data.eligible) {
        setPromoNotice('');
      } else {
        // Valid code, but this account has already bought before. Show the
        // reason and leave full prices on screen.
        setPromoNotice(
          data.reasonCode
            ? promoMessageFor(data)
            : data.ineligibleReason ||
                t('pricing.promoFirstPurchaseOnly', {
                  defaultValue: 'This code is valid for your first purchase only.',
                })
        );
      }
    } catch {
      clearPromo(t('common.connectError'));
    } finally {
      setCheckingPromo(false);
    }
  }

  // Price to show for a pack: the server's discounted figure when a promo is
  // active, otherwise the list price. Never computed here.
  function displayPrice(pack) {
    if (promoActive && promo.packs?.[pack.id]) return promo.packs[pack.id].finalFormatted;
    return pack.price;
  }

  function basePrice(pack) {
    if (promoActive && promo.packs?.[pack.id]) return promo.packs[pack.id].baseFormatted;
    return pack.price;
  }

  async function handleBuy(packId) {
    setLoading(packId);
    try {
      const res = await api('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack: packId, promoCode: promoActive ? promo.code : undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        // A promo rejection drops the discount from the UI (so a refused code
        // can never leave a discounted price on screen) and reports in the
        // same pill as every other promo message — not a toast.
        if (PROMO_ERROR_CODES.includes(data.code)) {
          clearPromo(promoMessageFor(data));
          return;
        }
        // Anything else is a general checkout failure, which still toasts.
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
          <button type="submit" className="btn-primary promo-apply-btn" disabled={checkingPromo}>
            {checkingPromo
              ? t('pricing.promoChecking', { defaultValue: 'Checking…' })
              : t('pricing.promoApply')}
          </button>
        </form>
        {promoActive && (
          <p className="promo-applied" role="status">
            ✓ {promo.discount?.percentOff
              ? t('pricing.promoAppliedPercent', {
                  percent: promo.discount.percentOff,
                  defaultValue: `${promo.discount.percentOff}% discount applied!`,
                })
              : t('pricing.promoApplied')}
          </p>
        )}
        {promoNotice && (
          <p className="promo-notice" role="alert">
            {promoNotice}
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
                <span className="pricing-price-original">&euro;{basePrice(pack)}</span>
                <span className="pricing-price-discounted">&euro;{displayPrice(pack)}</span>
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
                : t('pricing.buyFor', { price: displayPrice(pack) })}
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
