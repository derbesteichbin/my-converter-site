import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'ConvertAnyFormat';
const DEFAULT_DESC = 'Convert any file format online for free. 50+ formats supported. PDF, images, video, audio, archives and more. Fast, secure, no signup required.';
const DEFAULT_IMAGE = '/images/logo-light.png';
const SITE_URL = 'https://www.convertanyformat.com';

export default function SEO({ title, description, path = '', image, jsonLd, twitterCard = 'summary_large_image' }) {
  const fullTitle = title ? `${title} - ${SITE_NAME}` : `${SITE_NAME} - Free Online File Converter`;
  const desc = description || DEFAULT_DESC;
  const url = `${SITE_URL}${path}`;
  const img = image || `${SITE_URL}${DEFAULT_IMAGE}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      {/* Open Graph (Facebook / WhatsApp / LinkedIn) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:image:alt" content={SITE_NAME} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={SITE_NAME} />

      {/* Canonical URL prevents duplicate-content issues from query strings,
          trailing slashes, and locale variants */}
      <link rel="canonical" href={url} />

      {/* JSON-LD structured data — passed through as a script tag so search
          engines can index the entity (WebApplication, FAQPage, etc.) */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
