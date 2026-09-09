#!/usr/bin/env node
// ── Review edit-limit copy ───────────────────────────────────────────
//
//   node scripts/add-review-limit-copy.mjs
//
// Three keys under `home`, all 17 languages, after home.reviewsEditCta:
//
//   reviewsEditLimitReached   shown instead of the edit button once spent
//   reviewsEditsLeftSingular  "1 edit left"
//   reviewsEditsLeftPlural    "{{count}} edits left"
//
// Singular/plural are separate keys rather than an i18next plural suffix,
// matching the reviewsStarSingular / reviewsStarPlural pair already in this
// file. {{count}} is preserved in the plural form.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const I18N = path.join(ROOT, 'client', 'src', 'i18n.js');
const TRANS = path.join(ROOT, 'client', 'src', 'i18n-translations.js');
const NON_EN = ['de','fr','es','it','pt','nl','pl','sv','no','da','fi','cs','ro','hu','el','tr'];

const COPY = {
  en: { reviewsEditLimitReached: "You've reached the maximum number of edits for your review.", reviewsEditsLeftSingular: '1 edit left', reviewsEditsLeftPlural: '{{count}} edits left' },
  de: { reviewsEditLimitReached: 'Sie haben die maximale Anzahl an Änderungen für Ihre Bewertung erreicht.', reviewsEditsLeftSingular: 'Noch 1 Änderung übrig', reviewsEditsLeftPlural: 'Noch {{count}} Änderungen übrig' },
  fr: { reviewsEditLimitReached: 'Vous avez atteint le nombre maximal de modifications pour votre avis.', reviewsEditsLeftSingular: '1 modification restante', reviewsEditsLeftPlural: '{{count}} modifications restantes' },
  es: { reviewsEditLimitReached: 'Has alcanzado el número máximo de ediciones de tu reseña.', reviewsEditsLeftSingular: 'Queda 1 edición', reviewsEditsLeftPlural: 'Quedan {{count}} ediciones' },
  it: { reviewsEditLimitReached: 'Hai raggiunto il numero massimo di modifiche per la tua recensione.', reviewsEditsLeftSingular: '1 modifica rimasta', reviewsEditsLeftPlural: '{{count}} modifiche rimaste' },
  pt: { reviewsEditLimitReached: 'Atingiu o número máximo de edições da sua avaliação.', reviewsEditsLeftSingular: 'Resta 1 edição', reviewsEditsLeftPlural: 'Restam {{count}} edições' },
  nl: { reviewsEditLimitReached: 'U hebt het maximale aantal wijzigingen voor uw beoordeling bereikt.', reviewsEditsLeftSingular: 'Nog 1 wijziging over', reviewsEditsLeftPlural: 'Nog {{count}} wijzigingen over' },
  pl: { reviewsEditLimitReached: 'Osiągnięto maksymalną liczbę edycji swojej opinii.', reviewsEditsLeftSingular: 'Pozostała 1 edycja', reviewsEditsLeftPlural: 'Pozostało edycji: {{count}}' },
  sv: { reviewsEditLimitReached: 'Du har nått det högsta antalet ändringar för ditt omdöme.', reviewsEditsLeftSingular: '1 ändring kvar', reviewsEditsLeftPlural: '{{count}} ändringar kvar' },
  no: { reviewsEditLimitReached: 'Du har nådd det maksimale antallet endringer for omtalen din.', reviewsEditsLeftSingular: '1 endring igjen', reviewsEditsLeftPlural: '{{count}} endringer igjen' },
  da: { reviewsEditLimitReached: 'Du har nået det maksimale antal ændringer for din anmeldelse.', reviewsEditsLeftSingular: '1 ændring tilbage', reviewsEditsLeftPlural: '{{count}} ændringer tilbage' },
  fi: { reviewsEditLimitReached: 'Olet saavuttanut arvostelusi muokkausten enimmäismäärän.', reviewsEditsLeftSingular: '1 muokkaus jäljellä', reviewsEditsLeftPlural: '{{count}} muokkausta jäljellä' },
  cs: { reviewsEditLimitReached: 'Dosáhli jste maximálního počtu úprav své recenze.', reviewsEditsLeftSingular: 'Zbývá 1 úprava', reviewsEditsLeftPlural: 'Zbývající úpravy: {{count}}' },
  ro: { reviewsEditLimitReached: 'Ai atins numărul maxim de modificări pentru recenzia ta.', reviewsEditsLeftSingular: 'A mai rămas 1 modificare', reviewsEditsLeftPlural: 'Au mai rămas {{count}} modificări' },
  hu: { reviewsEditLimitReached: 'Elérte az értékelése módosításainak maximális számát.', reviewsEditsLeftSingular: 'Még 1 módosítás maradt', reviewsEditsLeftPlural: 'Még {{count}} módosítás maradt' },
  el: { reviewsEditLimitReached: 'Έχετε φτάσει τον μέγιστο αριθμό επεξεργασιών για την κριτική σας.', reviewsEditsLeftSingular: 'Απομένει 1 επεξεργασία', reviewsEditsLeftPlural: 'Απομένουν {{count}} επεξεργασίες' },
  tr: { reviewsEditLimitReached: 'Yorumunuz için izin verilen en fazla düzenleme sayısına ulaştınız.', reviewsEditsLeftSingular: '1 düzenleme hakkınız kaldı', reviewsEditsLeftPlural: '{{count}} düzenleme hakkınız kaldı' },
};

const ORDER = ['reviewsEditLimitReached', 'reviewsEditsLeftSingular', 'reviewsEditsLeftPlural'];
const lit = (s) => JSON.stringify(s);
let added = 0;

function insertAfter(src, anchorKey, lang, label) {
  const missing = ORDER.filter((k) => !new RegExp(`\\b${k}\\s*:`).test(src));
  if (missing.length === 0) return src;

  const re = new RegExp(`${anchorKey}:\\s*("|')(?:\\\\.|(?!\\1)[\\s\\S])*\\1,?`);
  const m = re.exec(src);
  if (!m) throw new Error(`${label}: ${anchorKey} anchor not found`);

  const anchor = m[0].endsWith(',') ? m[0] : m[0] + ',';
  const after = src.slice(m.index + m[0].length);
  const multiline = /^\s*\n/.test(after);
  added += missing.length;

  let insertion;
  if (multiline) {
    const lineStart = src.lastIndexOf('\n', m.index) + 1;
    const indent = src.slice(lineStart, m.index);
    insertion = '\n' + missing.map((k) => `${indent}${k}: ${lit(COPY[lang][k])},`).join('\n');
  } else {
    insertion = ' ' + missing.map((k) => `${k}: ${lit(COPY[lang][k])},`).join(' ');
  }
  return src.slice(0, m.index) + anchor + insertion + after;
}

fs.writeFileSync(I18N, insertAfter(fs.readFileSync(I18N, 'utf8'), 'reviewsEditCta', 'en', 'en'));

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
    const block = insertAfter(src.slice(start, end), 'reviewsEditCta', lang, lang);
    src = src.slice(0, start) + block + src.slice(end);
  }
  fs.writeFileSync(TRANS, src);
}

console.log(`Edit-limit copy: ${added} strings added (${ORDER.length} keys x 17 languages).`);
