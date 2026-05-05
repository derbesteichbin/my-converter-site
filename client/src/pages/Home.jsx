import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import HomeReviews from '../components/HomeReviews';
import { TOOLS, getToolBySlug, getToolLabel } from '../toolsConfig';

const POPULAR_SLUGS = ['pdf-to-word', 'jpg-to-png', 'mp4-to-mp3', 'merge-pdf', 'heic-to-jpg', 'compress-pdf'];
const POPULAR_TOOLS = TOOLS.filter((t) => POPULAR_SLUGS.includes(t.slug));

function getRecentTools() {
  try {
    const slugs = JSON.parse(localStorage.getItem('recentTools') || '[]');
    return slugs.map(getToolBySlug).filter(Boolean).slice(0, 3);
  } catch { return []; }
}

export default function Home() {
  const [recentTools, setRecentTools] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    setRecentTools(getRecentTools());
  }, []);

  const topFaqs = Array.from({ length: 5 }, (_, i) => ({
    q: t(`faq.q${i + 1}`),
    a: t(`faq.a${i + 1}`, { brand: 'ConvertAnyFormat' }),
  }));

  return (
    <div className="page">
      <SEO path="/" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'ConvertAnyFormat',
        url: 'https://www.convertanyformat.com',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        description: 'Free online file converter. Convert PDF, images, video, audio, and archives. 50+ formats supported.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      }) }} />

      {/* Hero */}
      <section className="hero">
        <h1 className="hero-gradient">{t('home.title')}</h1>
        <p className="hero-subtitle">{t('home.subtitle')}</p>
        <p className="hero-points">
          <span>{t('home.heroPoint1')}</span>
          <span className="hero-dot" />
          <span>{t('home.heroPoint2')}</span>
          <span className="hero-dot" />
          <span>{t('home.heroPoint3')}</span>
        </p>
        <Link to="/tools" className="btn-primary hero-cta">
          {t('home.browse')}
        </Link>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">✎</span>
          <span className="stat-label">{t('home.statFormats')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔒</span>
          <span className="stat-label">{t('home.statSecure')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⏱</span>
          <span className="stat-label">{t('home.statDelete')}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">✓</span>
          <span className="stat-label">{t('home.statFree')}</span>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2>{t('home.howTitle')}</h2>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>{t('home.step1Title')}</h3>
            <p>{t('home.step1Desc')}</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>{t('home.step2Title')}</h3>
            <p>{t('home.step2Desc')}</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>{t('home.step3Title')}</h3>
            <p>{t('home.step3Desc')}</p>
          </div>
        </div>
      </section>

      {/* Recently used */}
      {recentTools.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2>{t('home.recent')}</h2>
          <div className="tools-grid">
            {recentTools.map((tool) => (
              <Link to={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
                <span className="tool-card-label">{getToolLabel(tool, t)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular tools */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2>{t('home.popular')}</h2>
        <div className="tools-grid">
          {POPULAR_TOOLS.map((tool) => (
            <Link to={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
              <span className="tool-card-label">{getToolLabel(tool, t)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ preview */}
      <section className="home-faq-section">
        <h2>{t('home.faqTitle')}</h2>
        <div className="faq-list home-faq-list">
          {topFaqs.map((faq, i) => (
            <div className={`faq-item ${openFaq === i ? 'faq-open' : ''}`} key={i}>
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                type="button"
                aria-expanded={openFaq === i}
              >
                <span>{faq.q}</span>
                <span className="faq-arrow">{openFaq === i ? '−' : '+'}</span>
              </button>
              <div className="home-faq-answer-wrapper">
                <div className="home-faq-answer-inner">
                  <p className="faq-answer">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="home-faq-cta">
          <Link to="/faq" className="btn-primary">{t('home.faqViewAll')}</Link>
        </div>
      </section>

      {/* User reviews */}
      <HomeReviews />
    </div>
  );
}
