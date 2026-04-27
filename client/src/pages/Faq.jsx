import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function Faq() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = Array.from({ length: 12 }, (_, i) => ({ q: t(`faq.q${i + 1}`), a: t(`faq.a${i + 1}`, { brand: 'ConvertAnyFormat' }) }));

  return (
    <div className="page">
      <SEO title={t('faq.title')} path="/faq" description={t('faq.seoDesc', { brand: 'ConvertAnyFormat' })} />
      <h1>{t('faq.title')}</h1>
      <p className="page-subtitle">{t('faq.subtitle', { brand: 'ConvertAnyFormat' })}</p>

      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div className={`faq-item ${openIndex === i ? 'faq-open' : ''}`} key={i}>
            <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)} type="button" aria-expanded={openIndex === i}>
              <span>{faq.q}</span>
              <span className="faq-arrow">{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && <p className="faq-answer">{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
