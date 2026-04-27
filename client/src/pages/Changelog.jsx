import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const ENTRIES = [
  { date: '2026-04-20', key: 'e1' },
  { date: '2026-04-20', key: 'e2' },
  { date: '2026-04-20', key: 'e3' },
  { date: '2026-04-19', key: 'e4' },
  { date: '2026-04-19', key: 'e5' },
  { date: '2026-04-19', key: 'e6' },
  { date: '2026-04-19', key: 'e7' },
  { date: '2026-04-19', key: 'e8' },
  { date: '2026-04-19', key: 'e9' },
  { date: '2026-04-19', key: 'e10' },
  { date: '2026-04-19', key: 'e11' },
  { date: '2026-04-06', key: 'e12' },
  { date: '2026-04-06', key: 'e13' },
];

export default function Changelog() {
  const { t } = useTranslation();
  return (
    <div className="page">
      <SEO title={t('changelog.title')} path="/changelog" description={t('changelog.seoDesc', { brand: 'ConvertAnyFormat' })} />
      <h1>{t('changelog.title')}</h1>
      <p className="page-subtitle">{t('changelog.subtitle', { brand: 'ConvertAnyFormat' })}</p>

      <div className="changelog-list">
        {ENTRIES.map((entry, i) => (
          <div className="changelog-entry" key={i}>
            <span className="changelog-date">{entry.date}</span>
            <div>
              <h3 className="changelog-title">{t(`changelog.${entry.key}Title`)}</h3>
              <p className="changelog-desc">{t(`changelog.${entry.key}Desc`, { brand: 'ConvertAnyFormat' })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
