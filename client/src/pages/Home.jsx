import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    setRecentTools(getRecentTools());
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <h1>Convert any file, instantly</h1>
        <p>Free online file converter. PDF, images, audio, video and more.</p>
        <Link to="/tools" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Browse all tools
        </Link>
      </section>

      {recentTools.length > 0 && (
        <section className="recent-tools">
          <h2>Recently used</h2>
          <div className="tools-grid">
            {recentTools.map((t) => (
              <Link to={`/tools/${t.slug}`} className="tool-card" key={t.slug}>
                <span className="tool-card-label">{t.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="popular-tools">
        <h2>Popular tools</h2>
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
