import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';

// Exactly three illustrative example reviews. These are NOT real customer
// reviews — they are shown as clearly-labelled examples (see the "Example
// review" badge in the UI) so the section is transparent and legally
// compliant. Real, user-submitted reviews are loaded from the API and shown
// separately, above these, without the example label.
const EXAMPLE_REVIEWS = [
  {
    id: 'example-en-1',
    author: 'Sarah Johnson',
    language: 'en',
    rating: 5,
    comment:
      'Converted a 180 MB MOV file to MP4 in under a minute. The interface is clean, no surprise paywalls, and the file was deleted automatically afterwards. Exactly what I needed.',
    createdAt: '2026-05-02T19:11:00Z',
    isExample: true,
  },
  {
    id: 'example-de-1',
    author: 'Lukas Schneider',
    language: 'de',
    rating: 5,
    comment:
      'Endlich ein deutscher Konverter mit ordentlichem Datenschutz. Habe ein 80-seitiges PDF in Word umgewandelt – die Formatierung blieb fast perfekt erhalten. Sehr empfehlenswert!',
    createdAt: '2026-05-02T13:25:00Z',
    isExample: true,
  },
  {
    id: 'example-fr-1',
    author: 'Camille Martin',
    language: 'fr',
    rating: 5,
    comment:
      "Très pratique pour convertir des images HEIC de mon iPhone en JPG. Tout fonctionne dans le navigateur, pas besoin d'installer un logiciel. Rapide et sans inscription pour les petits fichiers.",
    createdAt: '2026-04-16T11:33:00Z',
    isExample: true,
  },
];

function Stars({ value, size = 18, ariaLabel }) {
  const { t } = useTranslation();
  const full = Math.round(value);
  return (
    <span className="rev-stars" aria-label={ariaLabel || t('home.reviewsStarsAria', { value })} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={n <= full ? 'rev-star rev-star-on' : 'rev-star'}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  const { t } = useTranslation();
  const [hover, setHover] = useState(0);
  return (
    <div className="rev-picker" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= (hover || value);
        return (
          <button
            key={n}
            type="button"
            className={`rev-picker-btn ${active ? 'rev-picker-on' : ''}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            aria-label={n === 1 ? t('home.reviewsStarSingular', { n }) : t('home.reviewsStarPlural', { n })}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function formatDate(iso, locale) {
  try {
    return new Date(iso).toLocaleDateString(locale || undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function HomeReviews() {
  const { t, i18n } = useTranslation();
  const [dbReviews, setDbReviews] = useState([]);
  const [dbAvg, setDbAvg] = useState(null);
  const [dbTotal, setDbTotal] = useState(0);
  const [visible, setVisible] = useState(6);
  const [loggedIn, setLoggedIn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [thanks, setThanks] = useState(false);

  // Load reviews + auth status
  useEffect(() => {
    let cancel = false;
    api('/api/reviews?limit=50&offset=0')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancel || !data) return;
        setDbReviews(Array.isArray(data.items) ? data.items : []);
        setDbAvg(typeof data.average === 'number' ? data.average : null);
        setDbTotal(typeof data.total === 'number' ? data.total : 0);
      })
      .catch(() => {});
    api('/api/auth/me')
      .then((r) => r.json())
      .then((data) => !cancel && setLoggedIn(!!data?.user))
      .catch(() => !cancel && setLoggedIn(false));
    return () => {
      cancel = true;
    };
  }, []);

  // Real, user-submitted reviews only. The headline rating and count are
  // based exclusively on these — the example reviews are never counted, so
  // the aggregate we display is never inflated by illustrative content.
  const realReviews = useMemo(
    () =>
      dbReviews.map((r) => ({
        id: r.id,
        author: r.author,
        language: r.language || null,
        rating: r.rating,
        comment: r.comment || '',
        createdAt: r.createdAt,
      })),
    [dbReviews]
  );

  const total = dbTotal;
  const average = useMemo(() => {
    if (typeof dbAvg === 'number' && dbTotal > 0) return dbAvg;
    if (!realReviews.length) return 0;
    const sum = realReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / realReviews.length;
  }, [dbAvg, dbTotal, realReviews]);

  // Close modal on Escape, and lock background scroll while it is open so the
  // page behind the overlay stays put. Restored when the modal closes/unmounts.
  useEffect(() => {
    if (!modalOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') setModalOpen(false);
    }
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalOpen]);

  function openModal() {
    setRating(0);
    setComment('');
    setSubmitError('');
    setThanks(false);
    setModalOpen(true);
  }

  async function submitReview() {
    if (rating < 1 || rating > 5) {
      setSubmitError(t('home.reviewsPickRating'));
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await api('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: comment.trim().slice(0, 280),
          language: i18n.language || null,
        }),
      });

      // Read the JSON body regardless of status so we can surface the exact
      // reason a submission failed (e.g. not signed in, validation error).
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          res.status === 401
            ? t('home.reviewsAuthError', {
                defaultValue: 'Your session has expired. Please sign in again to post your review.',
              })
            : (data && data.error) || t('home.reviewsError');
        setSubmitError(msg);
        return;
      }

      // Append the newly created review to the top of the list immediately,
      // so it shows without a page reload, and bump the aggregate rating.
      if (data && data.review) {
        const prevTotal = dbTotal || 0;
        const prevSum = (typeof dbAvg === 'number' ? dbAvg : 0) * prevTotal;
        const nextTotal = prevTotal + 1;
        setDbReviews((prev) => [data.review, ...prev]);
        setDbTotal(nextTotal);
        setDbAvg((prevSum + data.review.rating) / nextTotal);
      }

      setThanks(true);
      setTimeout(() => setModalOpen(false), 1500);
    } catch {
      // Network / CORS / server-unreachable failures land here.
      setSubmitError(t('home.reviewsError'));
    } finally {
      setSubmitting(false);
    }
  }

  const shown = realReviews.slice(0, visible);
  const charsLeft = 280 - comment.length;

  return (
    <section className="reviews-section">
      <h2>{t('home.reviewsTitle')}</h2>

      <div className="reviews-summary">
        {total > 0 ? (
          <>
            <div className="reviews-summary-rating">{average.toFixed(1)}</div>
            <div className="reviews-summary-meta">
              <Stars value={average} size={22} />
              <p className="reviews-summary-count">
                {total === 1 ? t('home.reviewsBasedOnOne') : t('home.reviewsBasedOn', { count: total })}
              </p>
            </div>
          </>
        ) : (
          <div className="reviews-summary-meta">
            <p className="reviews-summary-count">
              {t('home.reviewsNoneYet', { defaultValue: 'No customer reviews yet — be the first to leave one.' })}
            </p>
          </div>
        )}
        <div className="reviews-summary-cta">
          {loggedIn ? (
            <button className="btn-primary" type="button" onClick={openModal}>
              {t('home.reviewsWriteCta')}
            </button>
          ) : (
            <Link className="btn-primary" to="/login">
              {t('home.reviewsSignInCta')}
            </Link>
          )}
        </div>
      </div>

      {/* Real, user-submitted reviews — shown normally, no example label */}
      {shown.length > 0 && (
        <div className="reviews-grid">
          {shown.map((r) => (
            <article className="review-card" key={r.id}>
              <Stars value={r.rating} size={16} />
              {r.comment && <p className="review-comment">{r.comment}</p>}
              <footer className="review-meta">
                <span className="review-author">{r.author}</span>
                <span className="review-date">{formatDate(r.createdAt, i18n.language)}</span>
              </footer>
            </article>
          ))}
        </div>
      )}

      {visible < total && (
        <div className="reviews-loadmore">
          <button className="btn-primary" type="button" onClick={() => setVisible((v) => v + 6)}>
            {t('home.reviewsLoadMore')}
          </button>
        </div>
      )}

      {/* Example reviews — clearly labelled as illustrative, not verified
          customer reviews, and kept separate from the real ones above. */}
      <div className="reviews-examples">
        <h3 className="reviews-examples-heading">
          {t('home.reviewsExamplesHeading', { defaultValue: 'Example reviews' })}
        </h3>
        <p className="reviews-examples-note">
          {t('home.reviewsExamplesNote', {
            defaultValue:
              'The reviews below are illustrative examples to show how feedback appears here. They are not verified customer reviews and are not included in the rating above.',
          })}
        </p>
        <div className="reviews-grid">
          {EXAMPLE_REVIEWS.map((r) => (
            <article className="review-card review-card-example" key={r.id}>
              <span className="review-example-badge">
                {t('home.reviewsExampleBadge', { defaultValue: 'Example review' })}
              </span>
              <Stars value={r.rating} size={16} />
              {r.comment && <p className="review-comment">{r.comment}</p>}
              <footer className="review-meta">
                <span className="review-author">{r.author}</span>
                <span className="review-date">{formatDate(r.createdAt, i18n.language)}</span>
              </footer>
            </article>
          ))}
        </div>
      </div>

      {modalOpen && createPortal(
        <div
          className="rev-modal-overlay"
          onClick={() => !submitting && setModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="rev-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="rev-modal-title">{t('home.reviewsModalTitle')}</h3>
            <p className="rev-modal-subtitle">
              {t('home.reviewsModalSubtitle', { brand: 'ConvertAnyFormat' })}
            </p>

            {thanks ? (
              <p className="rev-modal-thanks">{t('home.reviewsThanks')}</p>
            ) : (
              <>
                <label className="rev-modal-label">{t('home.reviewsRatingLabel')}</label>
                <StarPicker value={rating} onChange={setRating} />

                <label className="rev-modal-label" htmlFor="rev-comment">
                  {t('home.reviewsCommentLabel')}
                </label>
                <textarea
                  id="rev-comment"
                  className="rev-modal-textarea"
                  rows={4}
                  maxLength={280}
                  placeholder={t('home.reviewsCommentPlaceholder')}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="rev-modal-charcount">
                  {t('home.reviewsCharsLeft', { n: charsLeft })}
                </div>

                {submitError && <p className="rev-modal-error">{submitError}</p>}

                <div className="rev-modal-actions">
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={submitReview}
                    disabled={submitting || rating < 1}
                  >
                    {submitting ? t('home.reviewsSubmitting') : t('home.reviewsSubmit')}
                  </button>
                  <button
                    className="rev-modal-cancel"
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={submitting}
                  >
                    {t('home.reviewsCancel')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
