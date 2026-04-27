import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function Privacy() {
  const { t } = useTranslation();
  const brand = 'ConvertAnyFormat';

  return (
    <div className="page legal-page">
      <SEO title={t('privacy.title')} path="/privacy" description={t('privacy.seoDesc', { brand })} />
      <h1>{t('privacy.title')}</h1>
      <p className="legal-updated">{t('privacy.updated')}</p>

      <section><h2>{t('privacy.s1Title')}</h2><p>{t('privacy.s1Body', { brand })}</p></section>

      <section><h2>{t('privacy.s2Title')}</h2>
        <p><strong>{t('privacy.s2Account')}</strong>{t('privacy.s2AccountBody')}</p>
        <p><strong>{t('privacy.s2Usage')}</strong>{t('privacy.s2UsageBody')}</p>
        <p><strong>{t('privacy.s2Payment')}</strong>{t('privacy.s2PaymentBody')}</p>
        <p><strong>{t('privacy.s2File')}</strong>{t('privacy.s2FileBody')}</p>
        <p><strong>{t('privacy.s2Tech')}</strong>{t('privacy.s2TechBody')}</p>
      </section>

      <section><h2>{t('privacy.s3Title')}</h2><p>{t('privacy.s3Body')}</p></section>

      <section><h2>{t('privacy.s4Title')}</h2>
        <p><strong>{t('privacy.s4ContractTitle')}</strong>{t('privacy.s4ContractBody')}</p>
        <p><strong>{t('privacy.s4InterestTitle')}</strong>{t('privacy.s4InterestBody')}</p>
        <p><strong>{t('privacy.s4ConsentTitle')}</strong>{t('privacy.s4ConsentBody')}</p>
        <p><strong>{t('privacy.s4LegalTitle')}</strong>{t('privacy.s4LegalBody')}</p>
      </section>

      <section><h2>{t('privacy.s5Title')}</h2>
        <p><strong>{t('privacy.s5EssentialTitle')}</strong>{t('privacy.s5EssentialBody')}</p>
        <p><strong>{t('privacy.s5AnalyticsTitle')}</strong>{t('privacy.s5AnalyticsBody')}</p>
        <p><strong>{t('privacy.s5MarketingTitle')}</strong>{t('privacy.s5MarketingBody')}</p>
        <p>{t('privacy.s5Manage')}</p>
      </section>

      <section><h2>{t('privacy.s6Title')}</h2><p>{t('privacy.s6Body')}</p></section>

      <section><h2>{t('privacy.s7Title')}</h2>
        <p><strong>{t('privacy.s7Files')}</strong>{t('privacy.s7FilesBody')}</p>
        <p><strong>{t('privacy.s7Account')}</strong>{t('privacy.s7AccountBody')}</p>
        <p><strong>{t('privacy.s7Payment')}</strong>{t('privacy.s7PaymentBody')}</p>
        <p><strong>{t('privacy.s7Logs')}</strong>{t('privacy.s7LogsBody')}</p>
      </section>

      <section><h2>{t('privacy.s8Title')}</h2>
        <p>{t('privacy.s8Intro')}</p>
        <ul>
          <li><strong>{t('privacy.s8Access')}</strong>{t('privacy.s8AccessBody')}</li>
          <li><strong>{t('privacy.s8Rect')}</strong>{t('privacy.s8RectBody')}</li>
          <li><strong>{t('privacy.s8Erase')}</strong>{t('privacy.s8EraseBody')}</li>
          <li><strong>{t('privacy.s8Port')}</strong>{t('privacy.s8PortBody')}</li>
          <li><strong>{t('privacy.s8Restrict')}</strong>{t('privacy.s8RestrictBody')}</li>
          <li><strong>{t('privacy.s8Object')}</strong>{t('privacy.s8ObjectBody')}</li>
          <li><strong>{t('privacy.s8Withdraw')}</strong>{t('privacy.s8WithdrawBody')}</li>
        </ul>
        <p>{t('privacy.s8Outro')}</p>
      </section>

      <section><h2>{t('privacy.s9Title')}</h2><p>{t('privacy.s9Body')}</p></section>
      <section><h2>{t('privacy.s10Title')}</h2><p>{t('privacy.s10Body')}</p></section>
      <section><h2>{t('privacy.s11Title')}</h2><p>{t('privacy.s11Body')}</p></section>
      <section><h2>{t('privacy.s12Title')}</h2><p>{t('privacy.s12Body')}</p></section>
      <section><h2>{t('privacy.s13Title')}</h2><p>{t('privacy.s13Body')}</p></section>
    </div>
  );
}
