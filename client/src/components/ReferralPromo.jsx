import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';

/**
 * Compact refer-a-friend teaser for the Home page.
 *
 * Advertises the programme only — a referral code belongs to an account, so
 * it lives in the dashboard and is never rendered here. Logged-in visitors
 * get a link to it; logged-out visitors get a link to register, because they
 * have no code to share yet.
 *
 * The copy states the real mechanics (2 credits, paid once the friend makes
 * their first purchase) so it matches the dashboard and cannot become a
 * claim the server does not honour.
 */
export default function ReferralPromo() {
  const { t } = useTranslation();

  // 'loading' | 'in' | 'out'. The call to action differs, so it renders only
  // once known rather than flashing the wrong one; the card reserves its
  // height so nothing shifts when it resolves.
  const [auth, setAuth] = useState('loading');

  useEffect(() => {
    let live = true;
    api('/api/auth/me')
      .then((r) => r.json())
      .then((data) => { if (live) setAuth(data.user ? 'in' : 'out'); })
      .catch(() => { if (live) setAuth('out'); });
    return () => { live = false; };
  }, []);

  return (
    <section className="referral-promo" aria-labelledby="referral-promo-title">
      <div className="referral-promo-card">
        <h2 id="referral-promo-title" className="referral-promo-title">
          {t('home.referralTitle')}
        </h2>
        <p className="referral-promo-body">{t('home.referralBody')}</p>

        <div className="referral-promo-cta">
          {auth === 'in' && (
            <Link to="/dashboard" className="btn-primary">
              {t('home.referralCtaIn')}
            </Link>
          )}
          {auth === 'out' && (
            <>
              <Link to="/register" className="btn-primary">
                {t('home.referralCtaOut')}
              </Link>
              <span className="referral-promo-hint">{t('home.referralHint')}</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
