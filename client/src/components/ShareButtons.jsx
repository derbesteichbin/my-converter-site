import { useTranslation } from 'react-i18next';
import { useToast } from './Toast';

export default function ShareButtons({ url }) {
  const { t } = useTranslation();
  const toast = useToast();
  const text = t('share.text', { brand: 'ConvertAnyFormat' });

  return (
    <div className="share-buttons">
      <a href={`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`} target="_blank" rel="noopener noreferrer" className="share-btn share-whatsapp" aria-label={t('share.whatsapp')}>WhatsApp</a>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="share-btn share-twitter" aria-label={t('share.twitter')}>X</a>
      <button className="share-btn share-copy" onClick={() => { navigator.clipboard.writeText(url); toast(t('share.linkCopied'), 'success'); }} type="button" aria-label={t('share.copy')}>{t('share.copy')}</button>
    </div>
  );
}
