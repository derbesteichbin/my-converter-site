import { Link } from 'react-router-dom';
import { ENABLE_EMPTY_STATES } from '../featureFlags';

export function EmptyHistory() {
  if (!ENABLE_EMPTY_STATES) return <p className="empty-state">No conversions yet. Go convert a file!</p>;
  return (
    <div className="empty-state-card">
      <span className="empty-state-icon">&#128196;</span>
      <h3>No conversions yet</h3>
      <p>Your conversion history will appear here after you convert your first file.</p>
      <Link to="/tools" className="btn-primary">Browse tools</Link>
    </div>
  );
}

export function EmptyFavorites() {
  if (!ENABLE_EMPTY_STATES) {
    return (
      <div className="favorites-empty">
        <span className="favorites-empty-icon">&#9734;</span>
        <p>No favorites yet</p>
        <p className="favorites-empty-hint">Click the heart on any tool to save it here for quick access</p>
      </div>
    );
  }
  return (
    <div className="empty-state-card">
      <span className="empty-state-icon">&#9829;</span>
      <h3>No favorites yet</h3>
      <p>Click the heart icon on any tool card to save your most-used tools here for quick access.</p>
      <Link to="/tools" className="btn-primary">Explore tools</Link>
    </div>
  );
}

export function EmptySearch({ query }) {
  if (!ENABLE_EMPTY_STATES) return <p className="empty-state">No tools match "{query}"</p>;
  return (
    <div className="empty-state-card">
      <span className="empty-state-icon">&#128269;</span>
      <h3>No results for "{query}"</h3>
      <p>Try a different search term, or browse all tools by category.</p>
      <Link to="/tools" className="btn-ghost">View all tools</Link>
    </div>
  );
}
