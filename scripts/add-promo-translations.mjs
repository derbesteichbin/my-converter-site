#!/usr/bin/env node
// ── Promo-code UI translations ───────────────────────────────────────
//
//   node scripts/add-promo-translations.mjs
//
// Adds/updates the promo-code strings in the `pricing` section of every
// non-English language in client/src/i18n-translations.js.
//
// Two of these keys already existed and are REWORDED rather than added:
//   promoApplied  — dropped the hardcoded "50%", since the real percentage
//                   now comes from Stripe and is rendered via
//                   promoAppliedPercent.
//   promoInvalid  — the old text ("Invalid promo code") did not say whether
//                   the code was wrong or expired; the new wording does.
//
// Translations follow each language's existing promo block rather than the
// site-wide register: the German and Dutch promo copy already addresses the
// user informally (du / je) while the rest of those languages use the formal
// form, so the new strings match their neighbours, not the file average.
// Terminology for "promo code" and "discount" is likewise taken from the
// strings already present in each language.
//
// {{percent}} is preserved verbatim. Percent-sign placement follows local
// convention: a space before % in sv/no/da/fi/cs, and %NN order in Turkish.

import fs from 'node:fs';
import path from 'node:path';

const FILE = path.join(import.meta.dirname, '..', 'client', 'src', 'i18n-translations.js');

const LANGS = ['de','fr','es','it','pt','nl','pl','sv','no','da','fi','cs','ro','hu','el','tr'];

// key -> { lang: translation }
const T = {
  promoApplied: {
    de: 'Rabatt angewendet!',
    fr: 'Remise appliquée !',
    es: '¡Descuento aplicado!',
    it: 'Sconto applicato!',
    pt: 'Desconto aplicado!',
    nl: 'Korting toegepast!',
    pl: 'Zniżka zastosowana!',
    sv: 'Rabatt tillämpad!',
    no: 'Rabatt brukt!',
    da: 'Rabat anvendt!',
    fi: 'Alennus käytössä!',
    cs: 'Sleva uplatněna!',
    ro: 'Reducere aplicată!',
    hu: 'Kedvezmény alkalmazva!',
    el: 'Η έκπτωση εφαρμόστηκε!',
    tr: 'İndirim uygulandı!',
  },
  promoAppliedPercent: {
    de: '{{percent}}% Rabatt angewendet!',
    fr: 'Remise de {{percent}} % appliquée !',
    es: '¡{{percent}}% de descuento aplicado!',
    it: 'Sconto del {{percent}}% applicato!',
    pt: 'Desconto de {{percent}}% aplicado!',
    nl: '{{percent}}% korting toegepast!',
    pl: 'Zastosowano zniżkę {{percent}}%!',
    sv: '{{percent}} % rabatt tillämpad!',
    no: '{{percent}} % rabatt brukt!',
    da: '{{percent}} % rabat anvendt!',
    fi: '{{percent}} % alennus käytössä!',
    cs: 'Sleva {{percent}} % uplatněna!',
    ro: 'Reducere de {{percent}}% aplicată!',
    hu: '{{percent}}% kedvezmény alkalmazva!',
    el: 'Εφαρμόστηκε έκπτωση {{percent}}%!',
    tr: '%{{percent}} indirim uygulandı!',
  },
  promoChecking: {
    de: 'Wird geprüft...',
    fr: 'Vérification...',
    es: 'Comprobando...',
    it: 'Verifica in corso...',
    pt: 'A verificar...',
    nl: 'Controleren...',
    pl: 'Sprawdzanie...',
    sv: 'Kontrollerar...',
    no: 'Sjekker...',
    da: 'Kontrollerer...',
    fi: 'Tarkistetaan...',
    cs: 'Ověřování...',
    ro: 'Se verifică...',
    hu: 'Ellenőrzés...',
    el: 'Έλεγχος...',
    tr: 'Kontrol ediliyor...',
  },
  promoInvalid: {
    de: 'Diesen Aktionscode gibt es nicht oder er ist nicht mehr gültig.',
    fr: "Ce code promo n'existe pas ou n'est plus valide.",
    es: 'Este código promocional no existe o ya no es válido.',
    it: 'Questo codice promo non esiste o non è più valido.',
    pt: 'Este código promocional não existe ou já não é válido.',
    nl: 'Deze promocode bestaat niet of is niet meer geldig.',
    pl: 'Ten kod promocyjny nie istnieje lub nie jest już ważny.',
    sv: 'Den här kampanjkoden finns inte eller är inte längre giltig.',
    no: 'Denne kampanjekoden finnes ikke eller er ikke lenger gyldig.',
    da: 'Denne rabatkode findes ikke eller er ikke længere gyldig.',
    fi: 'Tätä alennuskoodia ei ole olemassa tai se ei ole enää voimassa.',
    cs: 'Tento propagační kód neexistuje nebo již není platný.',
    ro: 'Acest cod promoțional nu există sau nu mai este valabil.',
    hu: 'Ez a promóciós kód nem létezik, vagy már nem érvényes.',
    el: 'Αυτός ο προωθητικός κωδικός δεν υπάρχει ή δεν ισχύει πλέον.',
    tr: 'Bu promosyon kodu mevcut değil veya artık geçerli değil.',
  },
  promoUnavailable: {
    de: 'Diese Aktion ist vorübergehend nicht verfügbar. Bitte versuche es später noch einmal.',
    fr: 'Cette promotion est temporairement indisponible. Veuillez réessayer plus tard.',
    es: 'Esta promoción no está disponible temporalmente. Inténtalo de nuevo más tarde.',
    it: 'Questa promozione non è temporaneamente disponibile. Riprova più tardi.',
    pt: 'Esta promoção está temporariamente indisponível. Tente novamente mais tarde.',
    nl: 'Deze actie is tijdelijk niet beschikbaar. Probeer het later opnieuw.',
    pl: 'Ta promocja jest tymczasowo niedostępna. Spróbuj ponownie później.',
    sv: 'Den här kampanjen är tillfälligt otillgänglig. Försök igen senare.',
    no: 'Denne kampanjen er midlertidig utilgjengelig. Prøv igjen senere.',
    da: 'Denne kampagne er midlertidigt utilgængelig. Prøv igen senere.',
    fi: 'Tämä tarjous ei ole tilapäisesti käytettävissä. Yritä myöhemmin uudelleen.',
    cs: 'Tato akce je dočasně nedostupná. Zkuste to prosím později.',
    ro: 'Această promoție este temporar indisponibilă. Încercați din nou mai târziu.',
    hu: 'Ez az akció átmenetileg nem érhető el. Kérjük, próbálja meg később.',
    el: 'Αυτή η προσφορά δεν είναι προσωρινά διαθέσιμη. Δοκιμάστε ξανά αργότερα.',
    tr: 'Bu promosyon geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
  },
  promoAlreadyUsed: {
    de: 'Du hast diesen Code bereits verwendet — er gilt nur für deinen ersten Kauf.',
    fr: "Vous avez déjà utilisé ce code — il n'est valable que pour votre premier achat.",
    es: 'Ya has usado este código: solo es válido en tu primera compra.',
    it: 'Hai già utilizzato questo codice: è valido solo per il primo acquisto.',
    pt: 'Já utilizou este código — só é válido na sua primeira compra.',
    nl: 'Je hebt deze code al gebruikt — hij geldt alleen bij je eerste aankoop.',
    pl: 'Ten kod został już wykorzystany — obowiązuje tylko przy pierwszym zakupie.',
    sv: 'Du har redan använt den här koden — den gäller bara vid ditt första köp.',
    no: 'Du har allerede brukt denne koden — den gjelder bare ved ditt første kjøp.',
    da: 'Du har allerede brugt denne kode — den gælder kun ved dit første køb.',
    fi: 'Olet jo käyttänyt tämän koodin — se on voimassa vain ensimmäisessä ostoksessasi.',
    cs: 'Tento kód jste již použili — platí pouze pro první nákup.',
    ro: 'Ați folosit deja acest cod — este valabil doar la prima achiziție.',
    hu: 'Ezt a kódot már felhasználta — csak az első vásárlásnál érvényes.',
    el: 'Έχετε ήδη χρησιμοποιήσει αυτόν τον κωδικό — ισχύει μόνο για την πρώτη σας αγορά.',
    tr: 'Bu kodu zaten kullandınız — yalnızca ilk alışverişinizde geçerlidir.',
  },
  promoEnded: {
    de: 'Diese Aktion ist beendet und nicht mehr verfügbar.',
    fr: "Cette promotion est terminée et n'est plus disponible.",
    es: 'Esta promoción ha finalizado y ya no está disponible.',
    it: 'Questa promozione è terminata e non è più disponibile.',
    pt: 'Esta promoção terminou e já não está disponível.',
    nl: 'Deze actie is afgelopen en niet meer beschikbaar.',
    pl: 'Ta promocja zakończyła się i nie jest już dostępna.',
    sv: 'Den här kampanjen har avslutats och är inte längre tillgänglig.',
    no: 'Denne kampanjen er avsluttet og er ikke lenger tilgjengelig.',
    da: 'Denne kampagne er afsluttet og er ikke længere tilgængelig.',
    fi: 'Tämä tarjous on päättynyt eikä ole enää käytettävissä.',
    cs: 'Tato akce skončila a již není dostupná.',
    ro: 'Această promoție s-a încheiat și nu mai este disponibilă.',
    hu: 'Ez az akció véget ért, és már nem érhető el.',
    el: 'Αυτή η προσφορά έχει λήξει και δεν είναι πλέον διαθέσιμη.',
    tr: 'Bu promosyon sona erdi ve artık kullanılamıyor.',
  },
  promoFirstPurchaseOnly: {
    de: 'Dieser Code gilt nur für deinen ersten Kauf.',
    fr: "Ce code n'est valable que pour votre premier achat.",
    es: 'Este código solo es válido en tu primera compra.',
    it: 'Questo codice è valido solo per il primo acquisto.',
    pt: 'Este código só é válido na sua primeira compra.',
    nl: 'Deze code geldt alleen bij je eerste aankoop.',
    pl: 'Ten kod obowiązuje tylko przy pierwszym zakupie.',
    sv: 'Den här koden gäller bara vid ditt första köp.',
    no: 'Denne koden gjelder bare ved ditt første kjøp.',
    da: 'Denne kode gælder kun ved dit første køb.',
    fi: 'Tämä koodi on voimassa vain ensimmäisessä ostoksessasi.',
    cs: 'Tento kód platí pouze pro první nákup.',
    ro: 'Acest cod este valabil doar la prima achiziție.',
    hu: 'Ez a kód csak az első vásárlásnál érvényes.',
    el: 'Αυτός ο κωδικός ισχύει μόνο για την πρώτη σας αγορά.',
    tr: 'Bu kod yalnızca ilk alışverişinizde geçerlidir.',
  },
};

const ORDER = [
  'promoApplied',
  'promoAppliedPercent',
  'promoChecking',
  'promoInvalid',
  'promoUnavailable',
  'promoAlreadyUsed',
  'promoEnded',
  'promoFirstPurchaseOnly',
];

// Double-quoted JS string literal; the values contain apostrophes but no
// double quotes, so only backslashes and quotes need escaping.
const lit = (s) => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';

let src = fs.readFileSync(FILE, 'utf8');

// Byte offset where each language's `const xx = {` begins, so a key is only
// ever rewritten inside its own language block.
function blockRange(lang) {
  const start = src.indexOf(`\nconst ${lang} = {`);
  if (start === -1) throw new Error(`Language block not found: ${lang}`);
  const laterStarts = LANGS.map((l) => src.indexOf(`\nconst ${l} = {`))
    .filter((i) => i > start)
    .sort((a, b) => a - b);
  const end = laterStarts.length ? laterStarts[0] : src.indexOf('\nexport const translations');
  return [start, end === -1 ? src.length : end];
}

let updated = 0;
let inserted = 0;

for (const lang of LANGS) {
  const [start, end] = blockRange(lang);
  let block = src.slice(start, end);

  // Anchor on promoInvalid, which every language already has, and which sits
  // inside the multi-line tail of the `pricing` object.
  const anchorRe = /^(\s*)promoInvalid:\s*("|')((?:\\.|(?!\2).)*)\2,?\s*$/m;
  const anchor = anchorRe.exec(block);
  if (!anchor) throw new Error(`promoInvalid anchor not found for ${lang}`);
  const indent = anchor[1];

  // Rewrite the two keys that already exist, then append the rest after the
  // anchor line so all promo keys stay grouped together.
  for (const key of ['promoApplied', 'promoInvalid']) {
    const re = new RegExp(`(^\\s*${key}:\\s*)("|')(?:\\\\.|(?!\\2).)*\\2`, 'm');
    if (!re.test(block)) throw new Error(`${key} not found for ${lang}`);
    block = block.replace(re, (_m, head) => head + lit(T[key][lang]));
    updated++;
  }

  const additions = ORDER.filter((k) => k !== 'promoApplied' && k !== 'promoInvalid');
  const newLines = additions
    .filter((k) => !new RegExp(`^\\s*${k}:`, 'm').test(block))
    .map((k) => `${indent}${k}: ${lit(T[k][lang])},`);
  inserted += newLines.length;

  if (newLines.length) {
    block = block.replace(anchorRe, (line) => line.replace(/\s*$/, '') + '\n' + newLines.join('\n'));
  }

  src = src.slice(0, start) + block + src.slice(end);
}

fs.writeFileSync(FILE, src);
console.log(`Rewrote ${updated} existing values, inserted ${inserted} new keys across ${LANGS.length} languages.`);
