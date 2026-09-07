import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildToolContent, buildFaqJsonLd, loadPack, packLanguage } from '../toolContent';

// Per-tool SEO content rendered below the conversion area.
//
// This component is loaded lazily by ToolPage, and the language pack holding
// the prose is loaded lazily again from here — so a visitor downloads exactly
// one language's text and the converter above never waits for it.
//
// The body copy is composed by the engine from format metadata in the active
// language, so headings, intro, steps, FAQ and the FAQPage JSON-LD are all in
// the same language as the rest of the interface.
export default function ToolContentSection({ tool }) {
  const { t, i18n } = useTranslation();
  const lang = packLanguage(i18n.resolvedLanguage || i18n.language);
  const [pack, setPack] = useState(null);

  useEffect(() => {
    let live = true;
    loadPack(lang).then((p) => { if (live) setPack(p); });
    return () => { live = false; };
  }, [lang]);

  const content = useMemo(() => (pack ? buildToolContent(tool, pack) : null), [tool, pack]);
  const faqJsonLd = useMemo(() => buildFaqJsonLd(content), [content]);

  if (!content) return null;

  const { pair, from, to, label, intro, steps, faq } = content;
  const aboutTitle = pair
    ? t('toolContent.aboutTitle', { from, to, defaultValue: `About ${from} to ${to} conversion` })
    : t('toolContent.aboutTitleTool', { tool: label, defaultValue: `About ${label}` });
  const howToTitle = pair
    ? t('toolContent.howToTitle', { from, to, defaultValue: `How to convert ${from} to ${to}` })
    : t('toolContent.howToTitleTool', { tool: label, defaultValue: `How to use ${label}` });

  return (
    <section className="tool-seo" aria-labelledby="tool-seo-about">
      <div className="tool-seo-block">
        <h2 id="tool-seo-about">{aboutTitle}</h2>
        <p className="tool-seo-intro">{intro}</p>
      </div>

      <div className="tool-seo-block">
        <h2>{howToTitle}</h2>
        <ol className="tool-seo-steps">
          {steps.map((step, i) => (
            <li key={i}>
              <span className="tool-seo-step-num" aria-hidden="true">{i + 1}</span>
              <span className="tool-seo-step-text">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="tool-seo-block">
        <h2>{t('toolContent.faqTitle', { defaultValue: 'Frequently asked questions' })}</h2>
        <div className="tool-seo-faq">
          {faq.map((item, i) => (
            <div className="tool-seo-faq-item" key={i}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQPage structured data, in the same language as the markup above —
          it is built from the very same objects, so the two cannot diverge. */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </section>
  );
}
