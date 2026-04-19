import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, getCategories, getToolBySlug } from '../toolsConfig';
import { api } from '../api';

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
      <h1>All conversion tools</h1>

      <input
        className="tools-search"
        type="text"
        placeholder="Search tools..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Favorites section */}
      {favoriteTools.length > 0 && !query && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Favorites</h2>
          <div className="tools-grid">
            {favoriteTools.map((t) => (
              <Link to={`/tools/${t.slug}`} className="tool-card" key={t.slug}>
                <button className="fav-btn fav-active" onClick={(e) => toggleFavorite(e, t.slug)} type="button" title="Remove from favorites">&#9733;</button>
                <span className="tool-card-label">{t.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Category sections */}
      {categories.map((cat) => {
        const tools = filteredTools.filter((t) => t.category === cat);
        if (tools.length === 0) return null;
        return (
          <section key={cat} style={{ marginBottom: '2rem' }}>
            <h2>{cat}</h2>
            <div className="tools-grid">
              {tools.map((t) => (
                <Link to={`/tools/${t.slug}`} className="tool-card" key={t.slug}>
                  <button
                    className={`fav-btn ${favorites.includes(t.slug) ? 'fav-active' : ''}`}
                    onClick={(e) => toggleFavorite(e, t.slug)}
                    type="button"
                    title={favorites.includes(t.slug) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.includes(t.slug) ? '\u2605' : '\u2606'}
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
