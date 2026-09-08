#!/usr/bin/env node
// ── Referral reward: 5 credits -> 2 ──────────────────────────────────
//
//   node scripts/set-referral-reward-2.mjs
//
// A single credit sells for €0.99, so a 5-credit reward left farming
// profitable even with purchase-gating: a throwaway buying pack1 for €0.99
// returned 5 credits to the referrer, cheaper per credit than any pack. At 2
// credits the trade is no longer worth making.
//
// Two copy carriers, and neither can take a blind "5" -> "2":
//   dash.referBody — one "5", safe on its own
//   faq.a3         — ALSO contains "1 credit per 5 minutes", so only the
//                    referral clause is swapped, by exact substring
//
// Polish and Czech additionally need the noun to change case: both take the
// genitive plural after 5 and the nominative plural after 2 ("5 kredytów" ->
// "2 kredyty", "5 kreditů" -> "2 kredity"). A digit-only replacement would
// leave both languages ungrammatical.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const I18N = path.join(ROOT, 'client', 'src', 'i18n.js');
const TRANS = path.join(ROOT, 'client', 'src', 'i18n-translations.js');
const NON_EN = ['de','fr','es','it','pt','nl','pl','sv','no','da','fi','cs','ro','hu','el','tr'];

// dash.referBody: [from, to] fragments.
const REFER_BODY = {
  en: ['get 5 conversion credits', 'get 2 conversion credits'],
  de: ['erhalten Sie 5 Konvertierungs-Credits', 'erhalten Sie 2 Konvertierungs-Credits'],
  fr: ['recevez 5 crédits de conversion', 'recevez 2 crédits de conversion'],
  es: ['consigue 5 créditos de conversión', 'consigue 2 créditos de conversión'],
  it: ['ricevi 5 crediti di conversione', 'ricevi 2 crediti di conversione'],
  pt: ['receba 5 créditos de conversão', 'receba 2 créditos de conversão'],
  nl: ['ontvang 5 conversietegoeden', 'ontvang 2 conversietegoeden'],
  // Polish: 5 takes the genitive plural, 2 the nominative plural.
  pl: ['otrzymaj 5 kredytów konwersji', 'otrzymaj 2 kredyty konwersji'],
  sv: ['få 5 konverteringskrediter', 'få 2 konverteringskrediter'],
  no: ['få 5 konverteringskreditter', 'få 2 konverteringskreditter'],
  da: ['få 5 konverteringskreditter', 'få 2 konverteringskreditter'],
  fi: ['saat 5 muunnoskrediittiä', 'saat 2 muunnoskrediittiä'],
  // Czech: same numeral-case rule as Polish.
  cs: ['získejte 5 kreditů na převod', 'získejte 2 kredity na převod'],
  ro: ['primești 5 credite de conversie', 'primești 2 credite de conversie'],
  hu: ['és 5 átalakítási kreditet kap', 'és 2 átalakítási kreditet kap'],
  el: ['κερδίστε 5 μονάδες μετατροπής', 'κερδίστε 2 μονάδες μετατροπής'],
  tr: ['için 5 dönüştürme kredisi kazanın', 'için 2 dönüştürme kredisi kazanın'],
};

// faq.a3: only the referral clause. "5 minutes" elsewhere must survive.
// Greek has no referral clause in this answer.
const FAQ_A3 = {
  en: ['earn 5 bonus credits for each friend', 'earn 2 bonus credits for each friend'],
  de: ['erhalten 5 Bonus-Credits pro geworbenem Freund', 'erhalten 2 Bonus-Credits pro geworbenem Freund'],
  fr: ['5 crédits bonus par filleul', '2 crédits bonus par filleul'],
  es: ['5 créditos bonus por cada amigo referido', '2 créditos bonus por cada amigo referido'],
  it: ['5 crediti bonus per ogni amico invitato', '2 crediti bonus per ogni amico invitato'],
  pt: ['5 créditos bónus por cada amigo referido', '2 créditos bónus por cada amigo referido'],
  nl: ['5 bonus-credits per doorverwezen vriend', '2 bonus-credits per doorverwezen vriend'],
  pl: ['5 kredytów bonusowych za każdego poleconego znajomego', '2 kredyty bonusowe za każdego poleconego znajomego'],
  sv: ['5 bonuskrediter per värvad vän', '2 bonuskrediter per värvad vän'],
  no: ['5 bonuskreditter per vervet venn', '2 bonuskreditter per vervet venn'],
  da: ['5 bonuskreditter pr. henvist ven', '2 bonuskreditter pr. henvist ven'],
  fi: ['ansaita 5 bonuskreditiä jokaisesta ystävästä', 'ansaita 2 bonuskreditiä jokaisesta ystävästä'],
  cs: ['5 bonusových kreditů za doporučeného přítele', '2 bonusové kredity za doporučeného přítele'],
  ro: ['5 credite bonus pentru fiecare prieten recomandat', '2 credite bonus pentru fiecare prieten recomandat'],
  hu: ['5 bónusz kreditet szerezhetsz minden barátért', '2 bónusz kreditet szerezhetsz minden barátért'],
  tr: ['başına 5 bonus kredi', 'başına 2 bonus kredi'],
};

let edits = 0;

function swapOnce(src, [from, to], label) {
  const hits = src.split(from).length - 1;
  if (hits === 0) throw new Error(`${label}: fragment not found: "${from}"`);
  if (hits > 1) throw new Error(`${label}: fragment is ambiguous (${hits} matches): "${from}"`);
  edits++;
  return src.split(from).join(to);
}

// ── English ──────────────────────────────────────────────────────────
{
  let src = fs.readFileSync(I18N, 'utf8');
  src = swapOnce(src, REFER_BODY.en, 'en.referBody');
  src = swapOnce(src, FAQ_A3.en, 'en.faq.a3');
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
    block = swapOnce(block, REFER_BODY[lang], `${lang}.referBody`);
    if (FAQ_A3[lang]) block = swapOnce(block, FAQ_A3[lang], `${lang}.faq.a3`);
    src = src.slice(0, start) + block + src.slice(end);
  }

  fs.writeFileSync(TRANS, src);
}

console.log(`Referral reward copy updated: ${edits} fragments (5 -> 2).`);
console.log('(el has no referral clause in faq.a3.)');
