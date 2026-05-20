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
          <Link to="/tools/pdf-to-word">{t('popularTools.pdfToWord')}</Link>
          <Link to="/tools/jpg-to-png">{t('popularTools.jpgToPng')}</Link>
          <Link to="/tools/mp4-to-mp3">{t('popularTools.mp4ToMp3')}</Link>
          <Link to="/tools/compress-pdf">{t('popularTools.compressPdf')}</Link>
          <Link to="/tools/merge-pdf">{t('popularTools.mergePdf')}</Link>
          <Link to="/tools/heic-to-jpg">{t('popularTools.heicToJpg')}</Link>
        </div>
      </div>
    </div>
  );
}
