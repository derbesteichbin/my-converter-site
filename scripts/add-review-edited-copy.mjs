#!/usr/bin/env node
// ── "(edited)" marker on review cards ────────────────────────────────
//
//   node scripts/add-review-edited-copy.mjs
//
// One key, home.reviewsEdited, in all 17 languages. Inserted after
// home.reviewsLoadMore, which every language already has.
//
// Kept in parentheses in every language, matching the convention other
// platforms use for edited comments, so the marker reads as an aside rather
// than part of the date next to it.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const I18N = path.join(ROOT, 'client', 'src', 'i18n.js');
const TRANS = path.join(ROOT, 'client', 'src', 'i18n-translations.js');
const NON_EN = ['de','fr','es','it','pt','nl','pl','sv','no','da','fi','cs','ro','hu','el','tr'];

const COPY = {
  en: '(edited)',
  de: '(bearbeitet)',
  fr: '(modifié)',
  es: '(editado)',
  it: '(modificato)',
  pt: '(editado)',
  nl: '(bewerkt)',
  pl: '(edytowano)',
  sv: '(redigerad)',
  no: '(redigert)',
  da: '(redigeret)',
  fi: '(muokattu)',
  cs: '(upraveno)',
  ro: '(editat)',
  hu: '(szerkesztve)',
  el: '(επεξεργάστηκε)',
  tr: '(düzenlendi)',
};

const KEY = 'reviewsEdited';
const lit = (s) => JSON.stringify(s);
let added = 0;

// i18n.js puts one key per line; i18n-translations.js keeps each `home: {...}`
// on a single line. Follow whichever layout the anchor is already in so
// neither file gets reformatted. Skips the key if it is already present.
function insertAfter(src, anchorKey, lang, label) {
  if (new RegExp(`\\b${KEY}\\s*:`).test(src)) return src;

  const re = new RegExp(`${anchorKey}:\\s*("|')(?:\\\\.|(?!\\1)[\\s\\S])*\\1,?`);
  const m = re.exec(src);
  if (!m) throw new Error(`${label}: ${anchorKey} anchor not found`);

  const anchor = m[0].endsWith(',') ? m[0] : m[0] + ',';
  const after = src.slice(m.index + m[0].length);
  const multiline = /^\s*\n/.test(after);

  let insertion;
  if (multiline) {
    const lineStart = src.lastIndexOf('\n', m.index) + 1;
    const indent = src.slice(lineStart, m.index);
    insertion = `\n${indent}${KEY}: ${lit(COPY[lang])},`;
  } else {
    insertion = ` ${KEY}: ${lit(COPY[lang])},`;
  }
  added++;
  return src.slice(0, m.index) + anchor + insertion + after;
}

fs.writeFileSync(I18N, insertAfter(fs.readFileSync(I18N, 'utf8'), 'reviewsLoadMore', 'en', 'en'));

{
  let src = fs.readFileSync(TRANS, 'utf8');
  const blockRange = (lang) => {
    const start = src.indexOf(`\nconst ${lang} = {`);
    if (start === -1) throw new Error(`block not found: ${lang}`);
    const later = NON_EN.map((l) => src.indexOf(`\nconst ${l} = {`)).filter((i) => i > start).sort((a, b) => a - b);
    const end = later.length ? later[0] : src.indexOf('\nexport const translations');
    return [start, end === -1 ? src.length : end];
  };
  for (const lang of NON_EN) {
    const [start, end] = blockRange(lang);
    const block = insertAfter(src.slice(start, end), 'reviewsLoadMore', lang, lang);
    src = src.slice(0, start) + block + src.slice(end);
  }
  fs.writeFileSync(TRANS, src);
}

console.log(`home.${KEY} added to ${added} languages.`);
