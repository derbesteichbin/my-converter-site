import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="page">
      <SEO title={t('about.title', { brand: 'ConvertAnyFormat' })} path="/about" description={t('about.seoDesc', { brand: 'ConvertAnyFormat' })} />
      <h1>{t('about.title', { brand: 'ConvertAnyFormat' })}</h1>

      <section className="about-section">
        <h2>{t('about.whatTitle')}</h2>
        <p>{t('about.whatBody', { brand: 'ConvertAnyFormat' })}</p>
      </section>

      <section className="about-section">
        <h2>{t('about.whyTitle')}</h2>
        <p>{t('about.whyBody', { brand: 'ConvertAnyFormat' })}</p>
      </section>

      <section className="about-section">
        <h2>{t('about.diffTitle')}</h2>
        <ul>
          <li><strong>{t('about.diff1Title')}</strong> {t('about.diff1Body')}</li>
          <li><strong>{t('about.diff2Title')}</strong> {t('about.diff2Body')}</li>
          <li><strong>{t('about.diff3Title')}</strong> {t('about.diff3Body')}</li>
          <li><strong>{t('about.diff4Title')}</strong> {t('about.diff4Body')}</li>
          <li><strong>{t('about.diff5Title')}</strong> {t('about.diff5Body')}</li>
          <li><strong>{t('about.diff6Title')}</strong> {t('about.diff6Body')}</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>{t('about.missionTitle')}</h2>
        <p>{t('about.missionBody')}</p>
      </section>

      <section className="about-section">
        <h2>{t('about.valuesTitle')}</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>{t('about.privacyTitle')}</h3>
            <p>{t('about.privacyBody')}</p>
          </div>
          <div className="value-card">
            <h3>{t('about.simplicityTitle')}</h3>
            <p>{t('about.simplicityBody')}</p>
          </div>
          <div className="value-card">
            <h3>{t('about.transparencyTitle')}</h3>
            <p>{t('about.transparencyBody')}</p>
          </div>
          <div className="value-card">
            <h3>{t('about.qualityTitle')}</h3>
            <p>{t('about.qualityBody')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
