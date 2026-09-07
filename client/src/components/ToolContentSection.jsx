import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { buildToolContent, buildFaqJsonLd } from '../toolContent';

// Per-tool SEO content rendered below the conversion area.
//
// This component is loaded lazily by ToolPage (see the React.lazy call there)
// so the format knowledge base in toolContent.js lands in its own chunk and
// never delays the converter itself becoming interactive.
//
// The body copy is composed in toolContent.js from format metadata; only the
// section headings come from i18n, so they localise while the body stays in
// English for now.
export default function ToolContentSection({ tool }) {
  const { t, i18n } = useTranslation();
  const content = useMemo(() => buildToolContent(tool), [tool]);
  const faqJsonLd = useMemo(() => buildFaqJsonLd(content), [content]);

  if (!content) return null;

  const { pair, from, to, label, intro, steps, faq } = content;
  const aboutTitle = pair
    ? t('toolContent.aboutTitle', { from, to, defaultValue: `About ${from} to ${to} conversion` })
    : t('toolContent.aboutTitleTool', { tool: label, defaultValue: `About ${label}` });
  const howToTitle = pair
    ? t('toolContent.howToTitle', { from, to, defaultValue: `How to convert ${from} to ${to}` })
    : t('toolContent.howToTitleTool', { tool: label, defaultValue: `How to use ${label}` });

  // The body copy is English regardless of the interface language, so mark it
  // up as such for search engines and screen readers.
  const uiIsEnglish = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('en');
  const bodyLang = uiIsEnglish ? undefined : 'en';

  return (
    <section className="tool-seo" aria-labelledby="tool-seo-about">
      <div className="tool-seo-block">
        <h2 id="tool-seo-about">{aboutTitle}</h2>
        <p className="tool-seo-intro" lang={bodyLang}>{intro}</p>
      </div>

      <div className="tool-seo-block">
        <h2>{howToTitle}</h2>
        <ol className="tool-seo-steps" lang={bodyLang}>
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
        <div className="tool-seo-faq" lang={bodyLang}>
          {faq.map((item, i) => (
            <div className="tool-seo-faq-item" key={i}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {!uiIsEnglish && (
        <p className="tool-seo-lang-note">
          {t('toolContent.englishOnly', {
            defaultValue: 'This guide is currently available in English only.',
          })}
        </p>
      )}

      {/* FAQPage structured data, so these questions can surface as rich
          results. Google reads JSON-LD anywhere in the document, and keeping
          it next to the markup it describes means the two cannot drift. */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </section>
  );
}
