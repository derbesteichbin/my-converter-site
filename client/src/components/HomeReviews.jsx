import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api';

const SEED_REVIEWS = [
  {
    id: 'seed-en-1',
    author: 'Sarah Johnson',
    language: 'en',
    rating: 5,
    comment:
      'Converted a 180 MB MOV file to MP4 in under a minute. The interface is clean, no surprise paywalls, and the file was deleted automatically afterwards. Exactly what I needed.',
    createdAt: '2026-03-12T09:14:00Z',
  },
  {
    id: 'seed-de-1',
    author: 'Lukas Schneider',
    language: 'de',
    rating: 5,
    comment:
      'Endlich ein deutscher Konverter mit ordentlichem Datenschutz. Habe ein 80-seitiges PDF in Word umgewandelt – die Formatierung blieb fast perfekt erhalten. Sehr empfehlenswert!',
    createdAt: '2026-03-04T17:22:00Z',
  },
  {
    id: 'seed-fr-1',
    author: 'Camille Martin',
    language: 'fr',
    rating: 4,
    comment:
      "Très pratique pour convertir des images HEIC de mon iPhone en JPG. Tout fonctionne dans le navigateur, pas besoin d'installer un logiciel. Le seul reproche : j'aimerais un mode batch plus rapide.",
    createdAt: '2026-02-21T11:48:00Z',
  },
  {
    id: 'seed-es-1',
    author: 'Diego Fernández',
    language: 'es',
    rating: 5,
    comment:
      'Lo uso casi cada semana para comprimir PDFs antes de enviarlos por correo. Calidad impecable y los archivos se eliminan en 24 horas, lo que me da mucha tranquilidad con documentos confidenciales.',
    createdAt: '2026-02-15T08:03:00Z',
  },
  {
    id: 'seed-it-1',
    author: 'Giulia Rossi',
    language: 'it',
    rating: 5,
    comment:
      'Ho convertito un MP4 in MP3 per estrarre l’audio di una conferenza, in pochi secondi. Niente filigrane, niente registrazioni obbligatorie. Davvero un ottimo strumento.',
    createdAt: '2026-02-08T14:35:00Z',
  },
  {
    id: 'seed-pt-1',
    author: 'André Silva',
    language: 'pt',
    rating: 4,
    comment:
      'Excelente para juntar PDFs antes de assinar digitalmente. A função de mesclar manteve a ordem das páginas perfeitamente. Só faltava uma opção para reordenar com arrastar e soltar.',
    createdAt: '2026-01-30T19:12:00Z',
  },
  {
    id: 'seed-en-2',
    author: 'James Carter',
    language: 'en',
    rating: 5,
    comment:
      'Tried four different sites before this one. ConvertAnyFormat just works — fast, no signup wall for small files, and the OCR on a scanned PDF was surprisingly accurate. Bookmarked.',
    createdAt: '2026-01-22T13:07:00Z',
  },
  {
    id: 'seed-de-2',
    author: 'Hannah Müller',
    language: 'de',
    rating: 4,
    comment:
      'Die Smart-Funktionen sparen mir richtig Zeit, vor allem die automatischen Untertitel für meine YouTube-Videos. Hin und wieder dauert die Verarbeitung etwas länger, aber das Ergebnis stimmt.',
    createdAt: '2026-01-14T10:41:00Z',
  },
];

function Stars({ value, size = 18, ariaLabel }) {
  const full = Math.round(value);
  return (
    <span className="rev-stars" aria-label={ariaLabel || `${value} out of 5`} role="img">
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
            aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
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

  const allReviews = useMemo(() => {
    const fromDb = dbReviews.map((r) => ({
      id: r.id,
      author: r.author,
      language: r.language || null,
      rating: r.rating,
      comment: r.comment || '',
      createdAt: r.createdAt,
    }));
    return [...fromDb, ...SEED_REVIEWS];
  }, [dbReviews]);

  const total = allReviews.length;
  const average = useMemo(() => {
    if (!total) return 0;
    const sum = allReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / total;
  }, [allReviews, total]);

  // Close modal on Escape
  useEffect(() => {
    if (!modalOpen) return;
    function onKey(e) {
      if (e.key === 'Escape') setModalOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
      if (!res.ok) throw new Error('failed');
      setThanks(true);
      const refreshed = await api('/api/reviews?limit=50&offset=0').then((r) => r.json()).catch(() => null);
      if (refreshed) {
        setDbReviews(refreshed.items || []);
        setDbAvg(refreshed.average || null);
        setDbTotal(refreshed.total || 0);
      }
      setTimeout(() => setModalOpen(false), 1500);
    } catch {
      setSubmitError(t('home.reviewsError'));
    } finally {
      setSubmitting(false);
    }
  }

  const shown = allReviews.slice(0, visible);
  const charsLeft = 280 - comment.length;

  return (
    <section className="reviews-section">
      <h2>{t('home.reviewsTitle')}</h2>

      <div className="reviews-summary">
        <div className="reviews-summary-rating">{average.toFixed(1)}</div>
        <div className="reviews-summary-meta">
          <Stars value={average} size={22} />
          <p className="reviews-summary-count">
            {total === 1 ? t('home.reviewsBasedOnOne') : t('home.reviewsBasedOn', { count: total })}
          </p>
        </div>
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

      {visible < total && (
        <div className="reviews-loadmore">
          <button className="btn-primary" type="button" onClick={() => setVisible((v) => v + 6)}>
            {t('home.reviewsLoadMore')}
          </button>
        </div>
      )}

      {modalOpen && (
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
        </div>
      )}
    </section>
  );
}
