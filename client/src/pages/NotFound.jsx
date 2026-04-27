import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="page not-found-page">
      <SEO title={t('notFound.title')} />
      <h1>404</h1>
      <h2>{t('notFound.title')}</h2>
      <p>{t('notFound.body')}</p>

      <div className="not-found-actions">
        <Link to="/" className="btn-primary">{t('notFound.goHome')}</Link>
        <Link to="/tools" className="btn-ghost">{t('notFound.browseTools')}</Link>
      </div>

      <div className="not-found-popular">
        <h3>{t('notFound.popular')}</h3>
        <div className="not-found-links">
          <Link to="/tools/pdf-to-word">PDF to Word</Link>
          <Link to="/tools/jpg-to-png">JPG to PNG</Link>
          <Link to="/tools/mp4-to-mp3">MP4 to MP3</Link>
          <Link to="/tools/compress-pdf">Compress PDF</Link>
          <Link to="/tools/merge-pdf">Merge PDF</Link>
          <Link to="/tools/heic-to-jpg">HEIC to JPG</Link>
        </div>
      </div>
    </div>
  );
}
