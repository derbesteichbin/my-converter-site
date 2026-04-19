import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS } from '../toolsConfig';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim()
    ? TOOLS.filter((t) =>
        t.label.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : TOOLS.slice(0, 8);

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
          placeholder="Search tools..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
          onKeyDown={handleKeyDown}
        />
        <div className="cmd-results">
          {results.length === 0 && (
            <div className="cmd-empty">No tools found</div>
          )}
          {results.map((t, i) => (
            <button
              key={t.slug}
              className={`cmd-item ${i === selected ? 'cmd-item-selected' : ''}`}
              onClick={() => handleNav(t.slug)}
              onMouseEnter={() => setSelected(i)}
              type="button"
            >
              <span className="cmd-item-label">{t.label}</span>
              <span className="cmd-item-cat">{t.category}</span>
            </button>
          ))}
        </div>
        <div className="cmd-footer">
          <span><kbd>&#8593;</kbd><kbd>&#8595;</kbd> navigate</span>
          <span><kbd>Enter</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
