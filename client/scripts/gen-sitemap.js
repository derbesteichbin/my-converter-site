// Regenerate public/sitemap.xml from the canonical tool list.
//
// Runs automatically as the `prebuild` npm script, so every deploy ships a
// sitemap matching the tools that are actually in the build. It can also be
// run by hand from the client directory:  node scripts/gen-sitemap.js
//
// Lives here rather than in the repo-root scripts/ directory for two
// reasons, both of which used to make an automated run fragile:
//   * Vercel's Root Directory is client/ (vercel.json sits here), so files
//     outside it are not guaranteed to be in the build context.
//   * Both the input (src/toolsConfig.js) and the output (public/sitemap.xml)
//     are inside client/ anyway, and toolsConfig is ESM — reaching it from a
//     CommonJS script at the repo root relied on require(esm), which needs
//     Node 22.12+. As an ES module here, that constraint disappears.

import fs from 'node:fs';
import path from 'node:path';
import { TOOLS } from '../src/toolsConfig.js';

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

const outPath = path.join(import.meta.dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log(`Wrote ${outPath}: ${allPages.length} URLs (${staticPages.length} static + ${toolPages.length} tool pages)`);
