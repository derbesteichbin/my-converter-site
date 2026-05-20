import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <strong>ConvertAnyFormat</strong>
          <p>{t('footer.tagline')}</p>
          <div className="footer-social">
            <a href="https://www.twitter.com/convert_format" target="_blank" rel="noopener noreferrer" aria-label={t('footer.twitter')} className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.instagram.com/convertanyformat" target="_blank" rel="noopener noreferrer" aria-label={t('footer.instagram')} className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.tiktok.com/@convertanyformat" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/></svg>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>{t('footer.toolsCol')}</h4>
            <Link to="/tools">{t('footer.allTools')}</Link>
            <Link to="/tools/pdf-to-word">{t('popularTools.pdfToWord')}</Link>
            <Link to="/tools/jpg-to-png">{t('popularTools.jpgToPng')}</Link>
            <Link to="/tools/mp4-to-mp3">{t('popularTools.mp4ToMp3')}</Link>
            <Link to="/tools/compress-pdf">{t('popularTools.compressPdf')}</Link>
          </div>
          <div className="footer-col">
            <h4>{t('footer.company')}</h4>
            <Link to="/about">{t('footer.about')}</Link>
            <Link to="/contact">{t('footer.contact')}</Link>
            <Link to="/changelog">{t('footer.changelog')}</Link>
            <Link to="/api-docs">{t('footer.apiDocs')}</Link>
          </div>
          <div className="footer-col">
            <h4>{t('footer.legal')}</h4>
            <Link to="/terms">{t('footer.terms')}</Link>
            <Link to="/privacy">{t('footer.privacy')}</Link>
            <Link to="/impressum">Impressum</Link>
            <Link to="/faq">{t('footer.faq')}</Link>
          </div>
          <div className="footer-col">
            <h4>{t('footer.support')}</h4>
            <Link to="/faq">{t('footer.helpCenter')}</Link>
            <Link to="/contact">{t('footer.contactUs')}</Link>
            <Link to="/pricing">{t('footer.pricing')}</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t('footer.copyright', { year: new Date().getFullYear(), brand: 'ConvertAnyFormat' })}</p>
        <p className="footer-made">{t('footer.made')}</p>
      </div>
    </footer>
  );
}
