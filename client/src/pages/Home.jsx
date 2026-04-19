import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
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
      <Helmet>
        <title>Converter - Free Online File Converter</title>
        <meta name="description" content="Convert any file format online for free. 50+ formats supported. PDF, images, video, audio, archives and more. Fast, secure, no signup required." />
      </Helmet>

      {/* Hero */}
      <section className="hero">
        <h1 className="hero-gradient">{t('home.title')}</h1>
        <p className="hero-subtitle">{t('home.subtitle')}</p>
        <p className="hero-points">
          <span>50+ formats supported</span>
          <span className="hero-dot" />
          <span>No installation needed</span>
          <span className="hero-dot" />
          <span>Files deleted after 24 hours</span>
        </p>
        <Link to="/tools" className="btn-primary hero-cta">
          {t('home.browse')}
        </Link>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">&#9998;</span>
          <span className="stat-label">50+ Formats</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">&#128274;</span>
          <span className="stat-label">100% Secure</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">&#128337;</span>
          <span className="stat-label">Deleted in 24h</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">&#10003;</span>
          <span className="stat-label">Free to Start</span>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Upload your file</h3>
            <p>Drag and drop any file or click to browse. We support PDF, images, video, audio, archives, and documents up to 200 MB.</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>Choose your format</h3>
            <p>Select the output format you need. Adjust quality, resolution, or enable OCR with our advanced settings.</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Download instantly</h3>
            <p>Your converted file is ready in seconds. Download it directly or share the link. Files are auto-deleted after 24 hours for your privacy.</p>
          </div>
        </div>
      </section>

      {/* Recently used */}
      {recentTools.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <h2>{t('home.recent')}</h2>
          <div className="tools-grid">
            {recentTools.map((t) => (
              <Link to={`/tools/${t.slug}`} className="tool-card" key={t.slug}>
                <span className="tool-card-label">{t.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Popular tools */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2>{t('home.popular')}</h2>
        <div className="tools-grid">
          {POPULAR_TOOLS.map((t) => (
            <Link to={`/tools/${t.slug}`} className="tool-card" key={t.slug}>
              <span className="tool-card-label">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
