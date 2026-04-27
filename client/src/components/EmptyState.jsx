import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ENABLE_EMPTY_STATES } from '../featureFlags';

export function EmptyHistory() {
  const { t } = useTranslation();
  if (!ENABLE_EMPTY_STATES) return <p className="empty-state">{t('dash.noJobs')}</p>;
  return (
    <div className="empty-state-card">
      <span className="empty-state-icon">📄</span>
      <h3>{t('empty.historyTitle')}</h3>
      <p>{t('empty.historyBody')}</p>
      <Link to="/tools" className="btn-primary">{t('empty.historyBtn')}</Link>
    </div>
  );
}

export function EmptyFavorites() {
  const { t } = useTranslation();
  if (!ENABLE_EMPTY_STATES) {
    return (
      <div className="favorites-empty">
        <span className="favorites-empty-icon">☆</span>
        <p>{t('toolsPage.noFavs')}</p>
        <p className="favorites-empty-hint">{t('toolsPage.noFavsHint')}</p>
      </div>
    );
  }
  return (
    <div className="empty-state-card">
      <span className="empty-state-icon">♥</span>
      <h3>{t('empty.favTitle')}</h3>
      <p>{t('empty.favBody')}</p>
      <Link to="/tools" className="btn-primary">{t('empty.favBtn')}</Link>
    </div>
  );
}

export function EmptySearch({ query }) {
  const { t } = useTranslation();
  if (!ENABLE_EMPTY_STATES) return <p className="empty-state">{t('toolsPage.noMatch')} "{query}"</p>;
  return (
    <div className="empty-state-card">
      <span className="empty-state-icon">🔍</span>
      <h3>{t('empty.searchTitle', { query })}</h3>
      <p>{t('empty.searchBody')}</p>
      <Link to="/tools" className="btn-ghost">{t('empty.searchBtn')}</Link>
    </div>
  );
}
