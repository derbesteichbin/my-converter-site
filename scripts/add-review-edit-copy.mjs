#!/usr/bin/env node
// ── Review edit-flow copy ────────────────────────────────────────────
//
//   node scripts/add-review-edit-copy.mjs
//
// Five keys under `home`, all 17 languages, inserted after
// home.reviewsWriteCta which every language already has:
//
//   reviewsEditCta        button/link that opens the pre-filled form
//   reviewsYours          badge marking the signed-in user's own review
//   reviewsEditModalTitle modal heading in edit mode
//   reviewsEditSubmit     save button in edit mode
//   reviewsEditThanks     confirmation after an edit
//
// Wording follows each language's existing review block: the German and
// Dutch review copy addresses the user formally (Sie / u), unlike the promo
// banner, so these match their neighbours rather than the file average.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const I18N = path.join(ROOT, 'client', 'src', 'i18n.js');
const TRANS = path.join(ROOT, 'client', 'src', 'i18n-translations.js');
const NON_EN = ['de','fr','es','it','pt','nl','pl','sv','no','da','fi','cs','ro','hu','el','tr'];

const COPY = {
  en: { reviewsEditCta: 'Edit review', reviewsYours: 'Your review', reviewsEditModalTitle: 'Edit your review', reviewsEditSubmit: 'Save changes', reviewsEditThanks: 'Your review has been updated.' },
  de: { reviewsEditCta: 'Bewertung bearbeiten', reviewsYours: 'Ihre Bewertung', reviewsEditModalTitle: 'Bewertung bearbeiten', reviewsEditSubmit: 'Änderungen speichern', reviewsEditThanks: 'Ihre Bewertung wurde aktualisiert.' },
  fr: { reviewsEditCta: "Modifier l'avis", reviewsYours: 'Votre avis', reviewsEditModalTitle: 'Modifier votre avis', reviewsEditSubmit: 'Enregistrer les modifications', reviewsEditThanks: 'Votre avis a été mis à jour.' },
  es: { reviewsEditCta: 'Editar reseña', reviewsYours: 'Tu reseña', reviewsEditModalTitle: 'Edita tu reseña', reviewsEditSubmit: 'Guardar cambios', reviewsEditThanks: 'Tu reseña se ha actualizado.' },
  it: { reviewsEditCta: 'Modifica recensione', reviewsYours: 'La tua recensione', reviewsEditModalTitle: 'Modifica la tua recensione', reviewsEditSubmit: 'Salva le modifiche', reviewsEditThanks: 'La tua recensione è stata aggiornata.' },
  pt: { reviewsEditCta: 'Editar avaliação', reviewsYours: 'A sua avaliação', reviewsEditModalTitle: 'Edite a sua avaliação', reviewsEditSubmit: 'Guardar alterações', reviewsEditThanks: 'A sua avaliação foi atualizada.' },
  nl: { reviewsEditCta: 'Beoordeling bewerken', reviewsYours: 'Uw beoordeling', reviewsEditModalTitle: 'Uw beoordeling bewerken', reviewsEditSubmit: 'Wijzigingen opslaan', reviewsEditThanks: 'Uw beoordeling is bijgewerkt.' },
  pl: { reviewsEditCta: 'Edytuj opinię', reviewsYours: 'Twoja opinia', reviewsEditModalTitle: 'Edytuj swoją opinię', reviewsEditSubmit: 'Zapisz zmiany', reviewsEditThanks: 'Twoja opinia została zaktualizowana.' },
  sv: { reviewsEditCta: 'Redigera omdöme', reviewsYours: 'Ditt omdöme', reviewsEditModalTitle: 'Redigera ditt omdöme', reviewsEditSubmit: 'Spara ändringar', reviewsEditThanks: 'Ditt omdöme har uppdaterats.' },
  no: { reviewsEditCta: 'Rediger omtale', reviewsYours: 'Din omtale', reviewsEditModalTitle: 'Rediger omtalen din', reviewsEditSubmit: 'Lagre endringer', reviewsEditThanks: 'Omtalen din er oppdatert.' },
  da: { reviewsEditCta: 'Rediger anmeldelse', reviewsYours: 'Din anmeldelse', reviewsEditModalTitle: 'Rediger din anmeldelse', reviewsEditSubmit: 'Gem ændringer', reviewsEditThanks: 'Din anmeldelse er opdateret.' },
  fi: { reviewsEditCta: 'Muokkaa arvostelua', reviewsYours: 'Sinun arvostelusi', reviewsEditModalTitle: 'Muokkaa arvosteluasi', reviewsEditSubmit: 'Tallenna muutokset', reviewsEditThanks: 'Arvostelusi on päivitetty.' },
  cs: { reviewsEditCta: 'Upravit recenzi', reviewsYours: 'Vaše recenze', reviewsEditModalTitle: 'Upravte svou recenzi', reviewsEditSubmit: 'Uložit změny', reviewsEditThanks: 'Vaše recenze byla aktualizována.' },
  ro: { reviewsEditCta: 'Editează recenzia', reviewsYours: 'Recenzia ta', reviewsEditModalTitle: 'Editează-ți recenzia', reviewsEditSubmit: 'Salvează modificările', reviewsEditThanks: 'Recenzia ta a fost actualizată.' },
  hu: { reviewsEditCta: 'Értékelés szerkesztése', reviewsYours: 'Az Ön értékelése', reviewsEditModalTitle: 'Értékelés szerkesztése', reviewsEditSubmit: 'Módosítások mentése', reviewsEditThanks: 'Az értékelését frissítettük.' },
  el: { reviewsEditCta: 'Επεξεργασία κριτικής', reviewsYours: 'Η κριτική σας', reviewsEditModalTitle: 'Επεξεργαστείτε την κριτική σας', reviewsEditSubmit: 'Αποθήκευση αλλαγών', reviewsEditThanks: 'Η κριτική σας ενημερώθηκε.' },
  tr: { reviewsEditCta: 'Yorumu düzenle', reviewsYours: 'Yorumunuz', reviewsEditModalTitle: 'Yorumunuzu düzenleyin', reviewsEditSubmit: 'Değişiklikleri kaydet', reviewsEditThanks: 'Yorumunuz güncellendi.' },
};

const ORDER = ['reviewsEditCta', 'reviewsYours', 'reviewsEditModalTitle', 'reviewsEditSubmit', 'reviewsEditThanks'];
const lit = (s) => JSON.stringify(s);
let added = 0;

// i18n.js is one key per line; i18n-translations.js keeps each `home: {...}`
// on a single line. Follow whichever the anchor uses so neither file is
// reformatted. Keys already present are skipped, so this is re-runnable.
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

fs.writeFileSync(I18N, insertAfter(fs.readFileSync(I18N, 'utf8'), 'reviewsWriteCta', 'en', 'en'));

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
    const block = insertAfter(src.slice(start, end), 'reviewsWriteCta', lang, lang);
    src = src.slice(0, start) + block + src.slice(end);
  }
  fs.writeFileSync(TRANS, src);
}

console.log(`Review edit copy: ${added} strings added (${ORDER.length} keys x 17 languages).`);
