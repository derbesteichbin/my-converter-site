#!/usr/bin/env node
// ── Referral copy: credits now land after the friend's first purchase ─
//
//   node scripts/update-referral-copy.mjs
//
// Referral credits used to be granted at signup and are now granted when the
// referred account makes its first purchase (server/lib/referral.js), so the
// copy that told users "for each friend who signs up" was no longer true.
//
// Three keys, all 17 languages:
//   dash.referBody              — the dashboard referral card
//   faq.a3                      — the pricing/credits FAQ answer
//   profile.bonusCreditsValue   — also fixes a pre-existing inaccuracy: it
//                                 said "extra conversions/day", but referral
//                                 credits are one-off, not a daily allowance.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const I18N = path.join(ROOT, 'client', 'src', 'i18n.js');
const TRANS = path.join(ROOT, 'client', 'src', 'i18n-translations.js');
const LANGS = ['en','de','fr','es','it','pt','nl','pl','sv','no','da','fi','cs','ro','hu','el','tr'];
const NON_EN = LANGS.filter((l) => l !== 'en');

const REFER_BODY = {
  en: 'Share your link and get 5 conversion credits for each friend who signs up and makes their first purchase.',
  de: 'Teilen Sie Ihren Link und erhalten Sie 5 Konvertierungs-Credits für jeden geworbenen Freund, der sich registriert und seinen ersten Kauf tätigt.',
  fr: 'Partagez votre lien et recevez 5 crédits de conversion pour chaque ami qui s’inscrit et effectue son premier achat.',
  es: 'Comparte tu enlace y consigue 5 créditos de conversión por cada amigo que se registre y haga su primera compra.',
  it: 'Condividi il tuo link e ricevi 5 crediti di conversione per ogni amico che si registra ed effettua il primo acquisto.',
  pt: 'Partilhe o seu link e receba 5 créditos de conversão por cada amigo que se registe e faça a primeira compra.',
  nl: 'Deel je link en ontvang 5 conversietegoeden voor elke vriend die zich aanmeldt en zijn eerste aankoop doet.',
  pl: 'Udostępnij swój link i otrzymaj 5 kredytów konwersji za każdego znajomego, który się zarejestruje i dokona pierwszego zakupu.',
  sv: 'Dela din länk och få 5 konverteringskrediter för varje vän som registrerar sig och gör sitt första köp.',
  no: 'Del lenken din og få 5 konverteringskreditter for hver venn som registrerer seg og gjør sitt første kjøp.',
  da: 'Del dit link, og få 5 konverteringskreditter for hver ven, der opretter sig og foretager sit første køb.',
  fi: 'Jaa linkkisi ja saat 5 muunnoskrediittiä jokaisesta ystävästä, joka rekisteröityy ja tekee ensimmäisen ostoksensa.',
  cs: 'Sdílejte svůj odkaz a získejte 5 kreditů na převod za každého přítele, který se zaregistruje a provede první nákup.',
  ro: 'Distribuie linkul tău și primești 5 credite de conversie pentru fiecare prieten care se înregistrează și face prima achiziție.',
  hu: 'Ossza meg a linkjét, és 5 átalakítási kreditet kap minden barátja után, aki regisztrál és megejti az első vásárlását.',
  el: 'Μοιραστείτε τον σύνδεσμό σας και κερδίστε 5 μονάδες μετατροπής για κάθε φίλο που εγγράφεται και κάνει την πρώτη του αγορά.',
  tr: 'Bağlantınızı paylaşın ve kaydolup ilk alışverişini yapan her arkadaşınız için 5 dönüştürme kredisi kazanın.',
};

const BONUS_VALUE = {
  en: '{{count}} extra conversions earned from referrals',
  de: '{{count}} zusätzliche Konvertierungen aus Empfehlungen',
  fr: '{{count}} conversions supplémentaires gagnées par parrainage',
  es: '{{count}} conversiones extra obtenidas por referidos',
  it: '{{count}} conversioni extra ottenute dalle segnalazioni',
  pt: '{{count}} conversões extra ganhas por indicações',
  nl: '{{count}} extra conversies verdiend met doorverwijzingen',
  pl: '{{count}} dodatkowych konwersji zdobytych z poleceń',
  sv: '{{count}} extra konverteringar från värvningar',
  no: '{{count}} ekstra konverteringer fra vervinger',
  da: '{{count}} ekstra konverteringer fra henvisninger',
  fi: '{{count}} lisämuunnosta suositteluista',
  cs: '{{count}} převodů navíc získaných z doporučení',
  ro: '{{count}} conversii suplimentare obținute din recomandări',
  hu: '{{count}} extra átalakítás ajánlásokból',
  el: '{{count}} επιπλέον μετατροπές από παραπομπές',
  tr: '{{count}} ek dönüştürme (davetlerden kazanılan)',
};

// faq.a3 is one long paragraph and only its closing referral clause changes,
// so the clause is swapped rather than the whole answer retranslated. Greek
// has no referral clause in this answer at all, hence no entry.
const FAQ_A3_CLAUSE = {
  en: ['earn 5 bonus credits for each friend who signs up using your referral link',
       'earn 5 bonus credits for each friend who signs up with your referral link and makes their first purchase'],
  de: ['erhalten 5 Bonus-Credits pro geworbenen Freund.',
       'erhalten 5 Bonus-Credits pro geworbenem Freund, der seinen ersten Kauf tätigt.'],
  fr: ['5 crédits bonus par filleul.',
       ' 5 crédits bonus par filleul qui effectue son premier achat.'.trim()],
  es: ['5 créditos bonus por amigo referido.',
       '5 créditos bonus por cada amigo referido que haga su primera compra.'],
  it: ['5 crediti bonus per ogni amico invitato.',
       '5 crediti bonus per ogni amico invitato che effettua il primo acquisto.'],
  pt: ['5 créditos bónus por amigo referido.',
       '5 créditos bónus por cada amigo referido que faça a primeira compra.'],
  nl: ['5 bonus-credits per doorverwezen vriend.',
       '5 bonus-credits per doorverwezen vriend die zijn eerste aankoop doet.'],
  pl: ['5 kredytów bonusowych za każdego poleconego znajomego.',
       '5 kredytów bonusowych za każdego poleconego znajomego, który dokona pierwszego zakupu.'],
  sv: ['5 bonuskrediter per värvad vän.',
       '5 bonuskrediter per värvad vän som gör sitt första köp.'],
  no: ['5 bonuskreditter per vervet venn.',
       '5 bonuskreditter per vervet venn som gjør sitt første kjøp.'],
  da: ['5 bonuskreditter pr. henvist ven.',
       '5 bonuskreditter pr. henvist ven, der foretager sit første køb.'],
  fi: ['ansaita 5 bonuskreditiä jokaisesta ystävästä, joka rekisteröityy suosittelulinkilläsi.',
       'ansaita 5 bonuskreditiä jokaisesta ystävästä, joka rekisteröityy suosittelulinkilläsi ja tekee ensimmäisen ostoksensa.'],
  cs: ['5 bonusových kreditů za doporučeného přítele.',
       '5 bonusových kreditů za doporučeného přítele, který provede první nákup.'],
  ro: ['5 credite bonus pentru fiecare prieten recomandat.',
       '5 credite bonus pentru fiecare prieten recomandat care face prima achiziție.'],
  hu: ['5 bónusz kreditet szerezhetsz minden barátért, aki regisztrál az ajánlólinkeddel.',
       '5 bónusz kreditet szerezhetsz minden barátért, aki regisztrál az ajánlólinkeddel és megejti az első vásárlását.'],
  tr: ['Yönlendirilen arkadaş başına 5 bonus kredi.',
       'İlk alışverişini yapan yönlendirilen arkadaş başına 5 bonus kredi.'],
};

const lit = (s) => JSON.stringify(s);
let edits = 0;

function replaceKeyedString(src, key, value) {
  const re = new RegExp(`(\\b${key}\\s*:\\s*)("|'|\`)(?:\\\\.|(?!\\2)[\\s\\S])*\\2`);
  if (!re.test(src)) return null;
  return src.replace(re, (_m, head) => head + lit(value));
}

// ── English ──────────────────────────────────────────────────────────
{
  let src = fs.readFileSync(I18N, 'utf8');

  let next = replaceKeyedString(src, 'referBody', REFER_BODY.en);
  if (next === null) throw new Error('en: referBody not found');
  src = next; edits++;

  next = replaceKeyedString(src, 'bonusCreditsValue', BONUS_VALUE.en);
  if (next === null) throw new Error('en: bonusCreditsValue not found');
  src = next; edits++;

  const [from, to] = FAQ_A3_CLAUSE.en;
  if (!src.includes(from)) throw new Error('en: faq.a3 referral clause not found');
  src = src.split(from).join(to); edits++;

  fs.writeFileSync(I18N, src);
}

// ── The other 16 ─────────────────────────────────────────────────────
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
    let block = src.slice(start, end);

    let next = replaceKeyedString(block, 'referBody', REFER_BODY[lang]);
    if (next === null) throw new Error(`${lang}: referBody not found`);
    block = next; edits++;

    next = replaceKeyedString(block, 'bonusCreditsValue', BONUS_VALUE[lang]);
    if (next === null) throw new Error(`${lang}: bonusCreditsValue not found`);
    block = next; edits++;

    const clause = FAQ_A3_CLAUSE[lang];
    if (clause) {
      const [from, to] = clause;
      if (!block.includes(from)) throw new Error(`${lang}: faq.a3 referral clause not found: ${from}`);
      block = block.split(from).join(to); edits++;
    }

    src = src.slice(0, start) + block + src.slice(end);
  }

  fs.writeFileSync(TRANS, src);
}

console.log(`Referral copy updated: ${edits} strings.`);
console.log('(el has no referral clause in faq.a3, so 16 of 17 were rewritten there.)');
