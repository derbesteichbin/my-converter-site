// Regenerate client/public/sitemap.xml from the canonical tool list.
// Run from repo root:  node scripts/gen-sitemap.js

const fs = require('fs');
const path = require('path');

const { TOOLS } = require('../client/src/toolsConfig.js');

const SITE = 'https://www.convertanyformat.com';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  ['/',           '1.0', 'weekly'],
  ['/tools',      '0.9', 'weekly'],
  ['/pricing',    '0.8', 'monthly'],
  ['/about',      '0.7', 'monthly'],
  ['/faq',        '0.7', 'monthly'],
  ['/contact',    '0.6', 'monthly'],
  ['/api-docs',   '0.6', 'monthly'],
  ['/changelog',  '0.5', 'monthly'],
  ['/login',      '0.5', 'yearly'],
  ['/register',   '0.5', 'yearly'],
  ['/terms',      '0.4', 'yearly'],
  ['/privacy',    '0.4', 'yearly'],
  ['/impressum',  '0.3', 'yearly'],
];

// Tool pages: priority 0.8 each, exclude coming-soon (no real content).
const toolPages = TOOLS
  .filter((t) => !t.comingSoon)
  .map((t) => [`/tools/${t.slug}`, '0.8', 'monthly']);

const allPages = [...staticPages, ...toolPages];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...allPages.map(([loc, priority, changefreq]) => (
    `  <url>` +
    `<loc>${SITE}${loc}</loc>` +
    `<lastmod>${today}</lastmod>` +
    `<changefreq>${changefreq}</changefreq>` +
    `<priority>${priority}</priority>` +
    `</url>`
  )),
  '</urlset>',
  '',
].join('\n');

const outPath = path.join(__dirname, '..', 'client', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log(`Wrote ${outPath}: ${allPages.length} URLs (${staticPages.length} static + ${toolPages.length} tool pages)`);
