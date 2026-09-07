#!/usr/bin/env node
// ── Tool-content i18n audit ──────────────────────────────────────────
//
// Every language pack under client/src/toolContent/packs/ must mirror the
// English reference pack key for key, and every one of the 81 tools must
// render complete content in every language.
//
//   node scripts/audit-tool-content.mjs          report
//   node scripts/audit-tool-content.mjs --json   machine-readable summary
//
// Checks, per language:
//   1. formats / reasons / t key sets identical to English (no missing, no extra)
//   2. no empty or untranslated-identical-to-English strings (reported, not fatal
//      for strings that are legitimately the same, e.g. "GIF")
//   3. {{placeholder}} sets match English exactly in every template
//   4. all 81 tools build an intro, 3 steps and 5 complete FAQ entries
//   5. intro and FAQ text is unique per tool within the language
//   6. no leftover {{placeholder}} in rendered output
//   7. format names (PDF, MP3, ...) survive translation where English has them

import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const ROOT = path.resolve(import.meta.dirname, '..');
const PACK_DIR = path.join(ROOT, 'client', 'src', 'toolContent', 'packs');
const asUrl = (p) => pathToFileURL(p).href;

const { TOOLS } = await import(asUrl(path.join(ROOT, 'client', 'src', 'toolsConfig.js')));
const { buildToolContent } = await import(asUrl(path.join(ROOT, 'client', 'src', 'toolContent', 'engine.js')));

const LANGS = ['en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'cs', 'ro', 'hu', 'el', 'tr'];

const packs = {};
for (const lang of LANGS) {
  const file = path.join(PACK_DIR, `${lang}.js`);
  if (!fs.existsSync(file)) continue;
  packs[lang] = (await import(asUrl(file))).default;
}

const en = packs.en;
const placeholders = (s) => [...String(s).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort().join(',');
// Format names that must survive translation untouched.
const FORMAT_TOKENS = /\b(PDF|DOCX|XLSX|PPTX|DOC|XLS|PPT|RTF|ODT|TXT|HTML|CSV|EPUB|MOBI|AZW3|FB2|JPG|JPEG|JFIF|PNG|WebP|BMP|TIFF|GIF|ICO|HEIC|SVG|MP4|AVI|MOV|MKV|WebM|WMV|FLV|MP3|WAV|FLAC|AAC|OGG|M4A|WMA|ZIP|RAR|7Z|TAR|GZ|SRT|VTT)\b/g;

const report = {};
let fatal = 0;

for (const lang of LANGS) {
  const pack = packs[lang];
  const r = { missing: [], extra: [], empty: [], placeholderMismatch: [], sameAsEnglish: [], tokenLoss: [], render: [], duplicates: [], strings: 0, words: 0 };
  report[lang] = r;

  if (!pack) { r.render.push('PACK MISSING'); fatal++; continue; }

  // ── 1-3. key parity, emptiness, placeholders ──
  const sections = [
    ['formats', Object.keys(en.formats).flatMap((k) => [`${k}.about`, `${k}.note`]),
      (p, key) => { const [ext, field] = key.split('.'); return p.formats?.[ext]?.[field]; }],
    ['reasons', Object.keys(en.reasons), (p, key) => p.reasons?.[key]],
    ['t', Object.keys(en.t), (p, key) => p.t?.[key]],
  ];

  for (const [name, enKeys, get] of sections) {
    for (const key of enKeys) {
      const enVal = get(en, key);
      const val = get(pack, key);
      if (val === undefined || val === null) { r.missing.push(`${name}:${key}`); continue; }
      if (typeof val !== 'string' || !val.trim()) { r.empty.push(`${name}:${key}`); continue; }
      r.strings++;
      r.words += val.split(/\s+/).length;
      if (placeholders(enVal) !== placeholders(val)) r.placeholderMismatch.push(`${name}:${key}`);
      // Templates that are nothing but placeholders are identical in every
      // language by definition, so they are not an untranslated string.
      const hasProse = String(enVal).replace(/\{\{\w+\}\}/g, '').replace(/[^\p{L}]/gu, '').length > 0;
      if (lang !== 'en' && hasProse && val === enVal) r.sameAsEnglish.push(`${name}:${key}`);
      // Format names present in English must still be present after translation.
      const enTokens = [...new Set(String(enVal).match(FORMAT_TOKENS) || [])];
      const missingTokens = enTokens.filter((tok) => !val.includes(tok));
      if (missingTokens.length) r.tokenLoss.push(`${name}:${key} -> lost ${missingTokens.join(',')}`);
    }
    // Extra keys the reference does not have.
    const packKeys = name === 'formats'
      ? Object.keys(pack.formats || {}).flatMap((k) => [`${k}.about`, `${k}.note`])
      : Object.keys(pack[name] || {});
    for (const key of packKeys) if (!enKeys.includes(key)) r.extra.push(`${name}:${key}`);
  }

  // ── 4-6. render every tool ──
  const seenIntro = new Map();
  const seenFaq = new Map();
  for (const tool of TOOLS) {
    const c = buildToolContent(tool, pack);
    const where = `${tool.slug}`;
    if (!c) { r.render.push(`${where}: null`); continue; }
    if (!c.intro || c.intro.length < 80) r.render.push(`${where}: intro too short (${c.intro?.length || 0})`);
    if (c.steps.length !== 3 || c.steps.some((s) => !s || s.length < 15)) r.render.push(`${where}: bad steps`);
    if (c.faq.length !== 5) r.render.push(`${where}: ${c.faq.length} FAQ entries`);
    for (const item of c.faq) {
      if (!item.q.trim() || !item.a.trim() || item.a.length < 60) r.render.push(`${where}: thin FAQ "${item.q.slice(0, 40)}"`);
    }
    const all = [c.intro, ...c.steps, ...c.faq.flatMap((x) => [x.q, x.a])].join(' ');
    if (/\{\{|\}\}/.test(all)) r.render.push(`${where}: unresolved placeholder`);
    if (/ {2,}| ,| \.(\s|$)/.test(all)) r.render.push(`${where}: spacing artefact`);

    if (seenIntro.has(c.intro)) r.duplicates.push(`intro: ${where} == ${seenIntro.get(c.intro)}`);
    else seenIntro.set(c.intro, where);
    const faqKey = c.faq.map((x) => x.q + x.a).join('|');
    if (seenFaq.has(faqKey)) r.duplicates.push(`faq: ${where} == ${seenFaq.get(faqKey)}`);
    else seenFaq.set(faqKey, where);
  }

  const problems = r.missing.length + r.extra.length + r.empty.length +
    r.placeholderMismatch.length + r.tokenLoss.length + r.render.length + r.duplicates.length;
  r.ok = problems === 0;
  if (!r.ok) fatal++;
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(pad('lang', 6) + pad('strings', 9) + pad('words', 8) + pad('missing', 9) + pad('extra', 7) +
    pad('empty', 7) + pad('placehold', 11) + pad('tokenLoss', 11) + pad('sameAsEn', 10) + pad('render', 8) + pad('dupes', 7) + 'status');
  console.log('-'.repeat(100));
  for (const [lang, r] of Object.entries(report)) {
    console.log(pad(lang, 6) + pad(r.strings, 9) + pad(r.words, 8) + pad(r.missing.length, 9) + pad(r.extra.length, 7) +
      pad(r.empty.length, 7) + pad(r.placeholderMismatch.length, 11) + pad(r.tokenLoss.length, 11) +
      pad(r.sameAsEnglish.length, 10) + pad(r.render.length, 8) + pad(r.duplicates.length, 7) +
      (r.ok ? 'OK' : 'FAIL'));
  }
  console.log();
  for (const [lang, r] of Object.entries(report)) {
    const issues = [
      ...r.missing.map((x) => `missing ${x}`),
      ...r.extra.map((x) => `extra ${x}`),
      ...r.empty.map((x) => `empty ${x}`),
      ...r.placeholderMismatch.map((x) => `placeholders ${x}`),
      ...r.tokenLoss.map((x) => `token ${x}`),
      ...r.render.map((x) => `render ${x}`),
      ...r.duplicates.map((x) => `duplicate ${x}`),
    ];
    if (issues.length) {
      console.log(`── ${lang}: ${issues.length} issue(s)`);
      for (const i of issues.slice(0, 25)) console.log('   ' + i);
      if (issues.length > 25) console.log(`   ...and ${issues.length - 25} more`);
    }
  }
  console.log(fatal ? `\n${fatal} language(s) FAILED` : `\nAll ${Object.keys(report).length} languages OK`);
}

process.exit(fatal ? 1 : 0);
