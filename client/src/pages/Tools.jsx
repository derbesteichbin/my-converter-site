import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS, getCategories, getToolBySlug, getToolLabel } from '../toolsConfig';
import { api } from '../api';
import { EmptyFavorites, EmptySearch } from '../components/EmptyState';
import { SkeletonCard } from '../components/Skeleton';
import SEO from '../components/SEO';

const GRADIENTS_DARK = {
  Document: 'linear-gradient(135deg, #4c1d95, #3730a3)',
  Image: 'linear-gradient(135deg, #134e4a, #065f46)',
  Video: 'linear-gradient(135deg, #7c2d12, #991b1b)',
  Audio: 'linear-gradient(135deg, #831843, #9f1239)',
  Archive: 'linear-gradient(135deg, #1f2937, #111827)',
  'PDF Tools': 'linear-gradient(135deg, #4a1d96, #5b21b6)',
  Utilities: 'linear-gradient(135deg, #312e81, #4c1d95)',
  'Smart Functions': 'linear-gradient(135deg, #b45309, #c2410c)',
};

const GRADIENTS_LIGHT = {
  Document: 'linear-gradient(135deg, #ede9fe, #c4b5fd)',
  Image: 'linear-gradient(135deg, #d1fae5, #99f6e4)',
  Video: 'linear-gradient(135deg, #fed7aa, #fdba74)',
  Audio: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
  Archive: 'linear-gradient(135deg, #f3f4f6, #d1d5db)',
  'PDF Tools': 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
  Utilities: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
  'Smart Functions': 'linear-gradient(135deg, #fef9c3, #fde9b8)',
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
  const { t } = useTranslation();
  const categories = getCategories();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState(getFavorites);
  const [popularSlugs, setPopularSlugs] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [isDark, setIsDark] = useState(getTheme() === 'dark');

  // Watch for theme changes via MutationObserver on <html> data-theme
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    api('/api/popular-tools')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { if (Array.isArray(data)) setPopularSlugs(data); })
      .catch(() => {})
      .finally(() => setLoadingPopular(false));
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
  let filteredTools = query
    ? TOOLS.filter((t) => t.label.toLowerCase().includes(query) || t.category.toLowerCase().includes(query))
    : TOOLS;
  if (activeCategory !== 'All') {
    filteredTools = filteredTools.filter((t) => t.category === activeCategory);
  }
  const filterCategories = ['All', ...categories];
  const catLabel = (cat) => cat === 'All' ? t('toolsPage.all') : t(`categories.${cat}`, { defaultValue: cat });
  const catDesc = (cat) => t(`categoryDescriptions.${cat}`, { defaultValue: '' });

  const favoriteTools = favorites.map(getToolBySlug).filter(Boolean);

  return (
    <div className="page">
      <SEO
        title="All Conversion Tools"
        path="/tools"
        description="Browse 50+ free online file conversion tools. PDF, Word, Excel, JPG, PNG, MP4, MP3 and more. Fast, secure conversions with no installation. Files deleted after 24 hours."
      />
      <div className="tools-header">
        <h1>{t('toolsPage.title')}</h1>
        <span className="tools-shortcut-hint">{t('toolsPage.shortcutHint', { shortcut: 'Ctrl+K' })}</span>
      </div>

      <input
        className="tools-search"
        type="text"
        placeholder={t('toolsPage.search')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="category-filters">
        {filterCategories.map((cat) => (
          <button
            key={cat}
            className={`category-filter-btn ${activeCategory === cat ? 'category-filter-active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            type="button"
          >{catLabel(cat)}</button>
        ))}
      </div>

      {/* Favorites section */}
      {!query && (
        <section className="favorites-section">
          <h2>{t('toolsPage.favorites')}</h2>
          {favoriteTools.length === 0 ? (
            <EmptyFavorites />
          ) : (
            <div className="favorites-grid">
              {favoriteTools.map((tool) => {
                const gradients = isDark ? GRADIENTS_DARK : GRADIENTS_LIGHT;
                const gradient = gradients[tool.category] || gradients.Utilities;
                const textColor = isDark ? '#fff' : '#1f2937';
                return (
                  <Link to={`/tools/${tool.slug}`} className="fav-card" key={tool.slug} style={{ background: gradient, color: textColor }}>
                    <button className="fav-heart fav-heart-active" onClick={(e) => toggleFavorite(e, tool.slug)} type="button" title={t('toolsPage.removeFromFav')} style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)' }}>&#9829;</button>
                    <span className="fav-card-cat" style={{ opacity: isDark ? 0.8 : 0.6 }}>{catLabel(tool.category)}</span>
                    <span className="fav-card-label">{getToolLabel(tool, t)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Category sections */}
      {categories.map((cat) => {
        const tools = filteredTools.filter((tool) => tool.category === cat);
        if (tools.length === 0) return null;
        const desc = catDesc(cat);
        return (
          <section key={cat} style={{ marginBottom: '2.5rem' }}>
            <h2>{catLabel(cat)}</h2>
            {desc && <p className="category-desc">{desc}</p>}
            <div className="tools-grid">
              {tools.map((tool) => {
                const label = getToolLabel(tool, t);
                if (tool.comingSoon) {
                  const tooltip = t(`toolsPage.comingSoonTooltip.${tool.slug}`, {
                    defaultValue: t('toolsPage.comingSoonTooltipDefault'),
                  });
                  return (
                    <div
                      className="tool-card tool-card-coming-soon"
                      data-category={tool.category}
                      key={tool.slug}
                      tabIndex={0}
                      role="button"
                      aria-disabled="true"
                      aria-label={`${label} \u2014 ${t('toolsPage.comingSoon')}`}
                    >
                      <span className="coming-soon-badge">{t('toolsPage.comingSoon')}</span>
                      <span className="tool-card-label">{label}</span>
                      <span className="coming-soon-tooltip" role="tooltip">{tooltip}</span>
                    </div>
                  );
                }
                return (
                  <Link to={`/tools/${tool.slug}`} className="tool-card" data-category={tool.category} key={tool.slug}>
                    <button
                      className={`fav-btn ${favorites.includes(tool.slug) ? 'fav-active' : ''}`}
                      onClick={(e) => toggleFavorite(e, tool.slug)}
                      type="button"
                      title={favorites.includes(tool.slug) ? t('toolsPage.removeFromFav') : t('toolsPage.addToFav')}
                    >
                      {favorites.includes(tool.slug) ? '\u2665' : '\u2661'}
                    </button>
                    {popularSlugs.includes(tool.slug) && <span className="popular-badge">{t('toolsPage.popularBadge')}</span>}
                    <span className="tool-card-label">{label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {loadingPopular && <SkeletonCard count={6} />}

      {filteredTools.length === 0 && (
        <EmptySearch query={search} />
      )}
    </div>
  );
}
