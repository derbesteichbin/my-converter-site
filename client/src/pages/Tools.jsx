import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, getCategories, getToolBySlug } from '../toolsConfig';
import { api } from '../api';

const CATEGORY_DESCRIPTIONS = {
  Document: 'Convert between PDF, Word, Excel, PowerPoint, and more with perfect formatting preserved.',
  Image: 'Transform images between JPG, PNG, WebP, HEIC, SVG, and other formats with quality control.',
  Video: 'Convert video files between MP4, AVI, MOV, MKV, WebM, and extract audio tracks.',
  Audio: 'Transform audio between MP3, WAV, FLAC, AAC, OGG, and adjust bitrate and quality.',
  Archive: 'Convert between ZIP, RAR, 7Z, TAR, and GZ archive formats.',
  'PDF Tools': 'Merge, split, compress, rotate, protect, and unlock PDF files.',
  Utilities: 'Inspect file metadata, dimensions, duration, and more.',
};

const GRADIENTS_DARK = {
  Document: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
  Image: 'linear-gradient(135deg, #0d9488, #06b6d4)',
  Video: 'linear-gradient(135deg, #f97316, #ef4444)',
  Audio: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  Archive: 'linear-gradient(135deg, #6b7280, #475569)',
  'PDF Tools': 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  Utilities: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
};

const GRADIENTS_LIGHT = {
  Document: 'linear-gradient(135deg, #ede9fe, #c4b5fd)',
  Image: 'linear-gradient(135deg, #d1fae5, #99f6e4)',
  Video: 'linear-gradient(135deg, #fed7aa, #fdba74)',
  Audio: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
  Archive: 'linear-gradient(135deg, #f3f4f6, #d1d5db)',
  'PDF Tools': 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
  Utilities: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
};

function getTheme() {
  try { return localStorage.getItem('theme') || 'light'; }
  catch { return 'light'; }
}

function getFavorites() {
  try { return JSON.parse(localStorage.getItem('favoriteTools') || '[]'); }
  catch { return []; }
}

function saveFavorites(favs) {
  localStorage.setItem('favoriteTools', JSON.stringify(favs));
}

export default function Tools() {
  const categories = getCategories();
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState(getFavorites);
  const [popularSlugs, setPopularSlugs] = useState([]);
  const isDark = getTheme() === 'dark';

  useEffect(() => {
    api('/api/popular-tools')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { if (Array.isArray(data)) setPopularSlugs(data); })
      .catch(() => {});
  }, []);

  function toggleFavorite(e, slug) {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      saveFavorites(updated);
      return updated;
    });
  }

  const query = search.toLowerCase().trim();
  const filteredTools = query
    ? TOOLS.filter((t) => t.label.toLowerCase().includes(query) || t.category.toLowerCase().includes(query))
    : TOOLS;

  const favoriteTools = favorites.map(getToolBySlug).filter(Boolean);

  return (
    <div className="page">
      <div className="tools-header">
        <h1>All conversion tools</h1>
        <span className="tools-shortcut-hint">Press <kbd>Ctrl</kbd>+<kbd>K</kbd> to quick search</span>
      </div>

      <input
        className="tools-search"
        type="text"
        placeholder="Search tools..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Favorites section */}
      {!query && (
        <section className="favorites-section">
          <h2>Favorites</h2>
          {favoriteTools.length === 0 ? (
            <div className="favorites-empty">
              <span className="favorites-empty-icon">&#9734;</span>
              <p>No favorites yet</p>
              <p className="favorites-empty-hint">Click the heart on any tool to save it here for quick access</p>
            </div>
          ) : (
            <div className="favorites-grid">
              {favoriteTools.map((t) => {
                const gradients = isDark ? GRADIENTS_DARK : GRADIENTS_LIGHT;
                const gradient = gradients[t.category] || gradients.Utilities;
                const textColor = isDark ? '#fff' : '#1f2937';
                return (
                  <Link to={`/tools/${t.slug}`} className="fav-card" key={t.slug} style={{ background: gradient, color: textColor }}>
                    <button className="fav-heart fav-heart-active" onClick={(e) => toggleFavorite(e, t.slug)} type="button" title="Remove from favorites" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)' }}>&#9829;</button>
                    <span className="fav-card-cat" style={{ opacity: isDark ? 0.8 : 0.6 }}>{t.category}</span>
                    <span className="fav-card-label">{t.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Category sections */}
      {categories.map((cat) => {
        const tools = filteredTools.filter((t) => t.category === cat);
        if (tools.length === 0) return null;
        return (
          <section key={cat} style={{ marginBottom: '2.5rem' }}>
            <h2>{cat}</h2>
            {CATEGORY_DESCRIPTIONS[cat] && (
              <p className="category-desc">{CATEGORY_DESCRIPTIONS[cat]}</p>
            )}
            <div className="tools-grid">
              {tools.map((t) => (
                <Link to={`/tools/${t.slug}`} className="tool-card" data-category={t.category} key={t.slug}>
                  <button
                    className={`fav-btn ${favorites.includes(t.slug) ? 'fav-active' : ''}`}
                    onClick={(e) => toggleFavorite(e, t.slug)}
                    type="button"
                    title={favorites.includes(t.slug) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.includes(t.slug) ? '\u2665' : '\u2661'}
                  </button>
                  {popularSlugs.includes(t.slug) && <span className="popular-badge">Popular</span>}
                  <span className="tool-card-label">{t.label}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {filteredTools.length === 0 && (
        <p className="empty-state">No tools match "{search}"</p>
      )}
    </div>
  );
}
