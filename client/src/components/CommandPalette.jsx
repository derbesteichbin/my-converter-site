import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS, getToolLabel } from '../toolsConfig';

export default function CommandPalette() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const available = TOOLS.filter((tool) => !tool.comingSoon);
  const q = query.trim().toLowerCase();
  const results = q
    ? available.filter((tool) => {
        const label = getToolLabel(tool, t).toLowerCase();
        const category = t(`categories.${tool.category}`, { defaultValue: tool.category }).toLowerCase();
        return label.includes(q) || category.includes(q) || tool.label.toLowerCase().includes(q);
      }).slice(0, 8)
    : available.slice(0, 8);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function handleNav(slug) {
    setOpen(false);
    navigate(`/tools/${slug}`);
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selected]) {
      handleNav(results[selected].slug);
    }
  }

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={() => setOpen(false)}>
      <div className="cmd-palette" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmd-input"
          type="text"
          placeholder={t('cmd.placeholder')}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
          onKeyDown={handleKeyDown}
        />
        <div className="cmd-results">
          {results.length === 0 && (
            <div className="cmd-empty">{t('cmd.empty')}</div>
          )}
          {results.map((tool, i) => (
            <button
              key={tool.slug}
              className={`cmd-item ${i === selected ? 'cmd-item-selected' : ''}`}
              onClick={() => handleNav(tool.slug)}
              onMouseEnter={() => setSelected(i)}
              type="button"
            >
              <span className="cmd-item-label">{getToolLabel(tool, t)}</span>
              <span className="cmd-item-cat">{t(`categories.${tool.category}`, { defaultValue: tool.category })}</span>
            </button>
          ))}
        </div>
        <div className="cmd-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> {t('cmd.navigate')}</span>
          <span><kbd>Enter</kbd> {t('cmd.select')}</span>
          <span><kbd>Esc</kbd> {t('cmd.close')}</span>
        </div>
      </div>
    </div>
  );
}
