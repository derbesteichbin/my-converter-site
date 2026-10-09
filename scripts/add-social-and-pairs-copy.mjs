#!/usr/bin/env node
// ── Copy for the October 2026 tool batch ─────────────────────────────
//
//   node scripts/add-social-and-pairs-copy.mjs [data-folder]
//
// data-folder defaults to scripts/data/new-tools-2026-10 (the first batch);
// later batches pass their own folder, e.g. scripts/data/social-tools-2026-10.
//
// Adds, in all 17 languages, everything the new tools need:
//   * the "Social Media" category name and description
//   * toolNames for the two named tools (PDF to Images, Photo Collage)
//   * toolDescriptions for every new tool
//   * the Photo Collage / PDF to Images UI strings under `tool`
//   * the SEO content pack entries: new format prose, one reason per tool,
//     and the templates for the rename / pdf-images / collage shapes
//
// The copy itself lives in scripts/data/<batch>/<lang>.json, one file per
// language with identical keys. Keys that already exist are left
// alone, so the script is safe to re-run — except keys listed under
// "replace" in a data file, whose existing value is deliberately updated.
// Every section is optional in a data file.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const DATA = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'scripts', 'data', 'new-tools-2026-10');
const I18N = path.join(ROOT, 'client', 'src', 'i18n.js');
const TRANS = path.join(ROOT, 'client', 'src', 'i18n-translations.js');
const PACKS = path.join(ROOT, 'client', 'src', 'toolContent', 'packs');
const NON_EN = ['de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'cs', 'ro', 'hu', 'el', 'tr'];
const ALL = ['en', ...NON_EN];

const lit = (s) => JSON.stringify(s);
const load = (lang) => JSON.parse(fs.readFileSync(path.join(DATA, `${lang}.json`), 'utf8'));
let added = 0;

// Does `key: ...` already exist inside `text`? Keys may be quoted or bare.
function hasKey(text, key) {
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[\\s{,])(["']${esc}["']|${esc})\\s*:`).test(text);
}

// Index of the `}` closing the object literal that opens at `openIdx`, found
// by a brace walk that skips over strings and comments (an apostrophe in a
// comment must not be read as the start of a string).
function objectEnd(src, openIdx) {
  let depth = 0;
  let quote = null;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === '/' && src[i + 1] === '/') { i = src.indexOf('\n', i); if (i === -1) break; continue; }
    if (c === '/' && src[i + 1] === '*') { i = src.indexOf('*/', i) + 1; continue; }
    if (c === '"' || c === "'" || c === '`') quote = c;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return i;
  }
  throw new Error('unterminated object');
}

// Insert `entries` (key → value) at the start of the top-level section
// `section` within `block`. Follows the section's layout: one key per line
// in i18n.js, everything on one line in i18n-translations.js.
function addToSection(block, section, entries, label) {
  if (!entries || !Object.keys(entries).length) return block;
  const re = new RegExp(`\\n  ${section}: \\{`);
  const m = re.exec(block);
  if (!m) throw new Error(`${label}: section ${section} not found`);
  const open = m.index + m[0].length - 1;
  const close = objectEnd(block, open);
  const body = block.slice(open, close);
  const multiline = /^\{\s*\n/.test(body);

  let insertion = '';
  for (const [key, value] of Object.entries(entries)) {
    if (hasKey(body, key)) continue;
    insertion += multiline ? `\n    ${lit(key)}: ${lit(value)},` : ` ${lit(key)}: ${lit(value)},`;
    added++;
  }
  return block.slice(0, open + 1) + insertion + block.slice(open + 1);
}

// Overwrite the value of keys that already exist in `section`. Only used for
// keys this tooling wrote itself, which are always "double-quoted".
function replaceInSection(block, section, entries, label) {
  if (!entries) return block;
  const marker = `\n  ${section}: {`;
  const at = block.indexOf(marker);
  if (at === -1) throw new Error(`${label}: section ${section} not found`);
  const open = at + marker.length - 1;
  const close = objectEnd(block, open);
  let body = block.slice(open, close);
  for (const [key, value] of Object.entries(entries)) {
    // The original site wrote its entries single-quoted, this script writes
    // them double-quoted; accept either for the key and the value.
    const keyText = [lit(key) + ':', `'${key}':`].find((k) => body.includes(k));
    if (!keyText) throw new Error(`${label}: ${section}.${key} not found to replace`);
    const keyAt = body.indexOf(keyText);
    // The value is the next string literal; walk it to its closing quote.
    const dq = body.indexOf('"', keyAt + keyText.length);
    const sq = body.indexOf("'", keyAt + keyText.length);
    const start = [dq, sq].filter((i) => i !== -1).sort((a, b) => a - b)[0];
    const quote = body[start];
    let end = start + 1;
    while (body[end] !== quote) end += body[end] === '\\' ? 2 : 1;
    body = body.slice(0, start) + lit(value) + body.slice(end + 1);
    added++;
  }
  return block.slice(0, open) + body + block.slice(close);
}

// Add a whole new top-level section right before `beforeSection`.
function addSection(block, section, entries, beforeSection, multiline, label) {
  if (!entries || !Object.keys(entries).length) return block;
  if (new RegExp(`\\n  ${section}: \\{`).test(block)) {
    return addToSection(block, section, entries, label);
  }
  const m = new RegExp(`\\n  ${beforeSection}: \\{`).exec(block);
  if (!m) throw new Error(`${label}: anchor ${beforeSection} not found`);
  const pairs = Object.entries(entries).map(([k, v]) => `${lit(k)}: ${lit(v)}`);
  added += pairs.length;
  const text = multiline
    ? `\n  ${section}: {\n${pairs.map((p) => `    ${p},`).join('\n')}\n  },\n`
    : `\n  ${section}: { ${pairs.join(', ')} },`;
  return block.slice(0, m.index) + text + block.slice(m.index);
}

function applyI18n(block, copy, label, multiline) {
  block = addToSection(block, 'categories', copy.categories, label);
  block = addToSection(block, 'categoryDescriptions', copy.categoryDescriptions, label);
  block = addToSection(block, 'tool', copy.tool, label);
  block = addToSection(block, 'toolDescriptions', copy.toolDescriptions, label);
  block = addSection(block, 'toolNames', copy.toolNames, 'toolDescriptions', multiline, label);
  for (const [section, entries] of Object.entries(copy.replace || {})) {
    block = replaceInSection(block, section, entries, label);
  }
  // Whole new top-level sections (e.g. the feedback modal's strings), placed
  // just before the 'report' section.
  for (const [section, entries] of Object.entries(copy.sections || {})) {
    block = addSection(block, section, entries, 'report', multiline, label);
  }
  return block;
}

// ── i18n.js (English source) ──
{
  const src = fs.readFileSync(I18N, 'utf8');
  const start = src.indexOf('const en = {');
  const end = objectEnd(src, src.indexOf('{', start)) + 1;
  const block = applyI18n(src.slice(start, end), load('en'), 'en', true);
  fs.writeFileSync(I18N, src.slice(0, start) + block + src.slice(end));
}

// ── i18n-translations.js ──
{
  let src = fs.readFileSync(TRANS, 'utf8');
  for (const lang of NON_EN) {
    const start = src.indexOf(`\nconst ${lang} = {`);
    if (start === -1) throw new Error(`block not found: ${lang}`);
    const end = objectEnd(src, src.indexOf('{', start)) + 1;
    const block = applyI18n(src.slice(start, end), load(lang), lang, false);
    src = src.slice(0, start) + block + src.slice(end);
  }
  fs.writeFileSync(TRANS, src);
}

// ── Tool content packs ──
// Each pack has `formats`, `reasons` and `t` sections, one entry per line;
// new entries go just before each section's closing brace.
function appendToPackSection(src, section, lines, label) {
  if (!lines.length) return src;
  const m = new RegExp(`\\n  ${section}: \\{`).exec(src);
  if (!m) throw new Error(`${label}: pack section ${section} not found`);
  const open = m.index + m[0].length - 1;
  const close = objectEnd(src, open);
  const body = src.slice(open, close);
  const fresh = lines.filter(([key]) => !hasKey(body, key));
  if (!fresh.length) return src;
  added += fresh.length;
  // Back up over the indentation in front of the closing brace.
  const lineStart = src.lastIndexOf('\n', close);
  const text = fresh.map(([, line]) => `\n${line}`).join('');
  return src.slice(0, lineStart) + text + src.slice(lineStart);
}

for (const lang of ALL) {
  const file = path.join(PACKS, `${lang}.js`);
  let src = fs.readFileSync(file, 'utf8');
  const { formats = {}, reasons = {}, t = {}, replace = {} } = load(lang).pack || {};
  src = appendToPackSection(src, 'formats', Object.entries(formats).map(([k, v]) => [
    k,
    `    ${/^[a-z]\w*$/.test(k) ? k : lit(k)}: {\n      about: ${lit(v.about)},\n      note: ${lit(v.note)},\n    },`,
  ]), lang);
  src = appendToPackSection(src, 'reasons', Object.entries(reasons).map(([k, v]) => [k, `    ${lit(k)}: ${lit(v)},`]), lang);
  src = appendToPackSection(src, 't', Object.entries(t).map(([k, v]) => [k, `    ${lit(k)}: ${lit(v)},`]), lang);
  // pack.replace: { reasons: {...}, t: {...} } updates entries an earlier
  // batch added (all written double-quoted by this script).
  for (const [section, entries] of Object.entries(replace)) {
    src = replaceInSection(src, section, entries, lang);
  }
  fs.writeFileSync(file, src);
}

console.log(`Added ${added} entries across ${ALL.length} languages.`);
