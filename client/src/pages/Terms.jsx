import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function Terms() {
  const { t } = useTranslation();
  const brand = 'ConvertAnyFormat';
  const sections = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <div className="page legal-page">
      <SEO title={t('terms.title')} path="/terms" description={t('terms.seoDesc', { brand })} />
      <h1>{t('terms.title')}</h1>
      <p className="legal-updated">{t('terms.updated')}</p>

      {sections.map((n) => (
        <section key={n}>
          <h2>{t(`terms.s${n}Title`)}</h2>
          <p>{t(`terms.s${n}Body`, { brand })}</p>
        </section>
      ))}
    </div>
  );
}
