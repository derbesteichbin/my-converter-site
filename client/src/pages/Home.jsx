import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { TOOLS, getToolBySlug } from '../toolsConfig';

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
  const { t } = useTranslation();

  useEffect(() => {
    setRecentTools(getRecentTools());
  }, []);

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
                <span className="tool-card-label">{tool.label}</span>
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
              <span className="tool-card-label">{tool.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
