import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'ConvertAnything';
const DEFAULT_DESC = 'Convert any file format online for free. 50+ formats supported. PDF, images, video, audio, archives and more. Fast, secure, no signup required.';
const DEFAULT_IMAGE = '/images/logo-light.png';
const SITE_URL = 'https://my-converter-site.vercel.app';

export default function SEO({ title, description, path = '', image }) {
  const fullTitle = title ? `${title} - ${SITE_NAME}` : `${SITE_NAME} - Free Online File Converter`;
  const desc = description || DEFAULT_DESC;
  const url = `${SITE_URL}${path}`;
  const img = image || `${SITE_URL}${DEFAULT_IMAGE}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
