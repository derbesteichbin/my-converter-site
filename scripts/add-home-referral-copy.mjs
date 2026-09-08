#!/usr/bin/env node
// ── Home page refer-a-friend teaser copy ─────────────────────────────
//
//   node scripts/add-home-referral-copy.mjs
//
// Five keys under `home`, in all 17 languages. Wording mirrors
// dash.referBody deliberately: the same reward (2 credits) and the same
// condition (the friend must make their first purchase), so the two places
// that advertise the programme can never say different things.
//
// Inserted after home.faqViewAll, which every language already has.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const I18N = path.join(ROOT, 'client', 'src', 'i18n.js');
const TRANS = path.join(ROOT, 'client', 'src', 'i18n-translations.js');
const NON_EN = ['de','fr','es','it','pt','nl','pl','sv','no','da','fi','cs','ro','hu','el','tr'];

const COPY = {
  en: {
    referralTitle: 'Refer a friend',
    referralBody: 'Earn 2 conversion credits for every friend who signs up and makes their first purchase.',
    referralCtaIn: 'Get your referral link',
    referralCtaOut: 'Create a free account',
    referralHint: 'Sign up to get your referral link.',
  },
  de: {
    referralTitle: 'Freunde werben',
    referralBody: 'Erhalten Sie 2 Konvertierungs-Credits für jeden geworbenen Freund, der sich registriert und seinen ersten Kauf tätigt.',
    referralCtaIn: 'Zu Ihrem Empfehlungslink',
    referralCtaOut: 'Kostenloses Konto erstellen',
    referralHint: 'Registrieren Sie sich, um Ihren Empfehlungslink zu erhalten.',
  },
  fr: {
    referralTitle: 'Parrainer un ami',
    referralBody: 'Recevez 2 crédits de conversion pour chaque ami qui s’inscrit et effectue son premier achat.',
    referralCtaIn: 'Obtenir mon lien de parrainage',
    referralCtaOut: 'Créer un compte gratuit',
    referralHint: 'Inscrivez-vous pour obtenir votre lien de parrainage.',
  },
  es: {
    referralTitle: 'Recomienda a un amigo',
    referralBody: 'Consigue 2 créditos de conversión por cada amigo que se registre y haga su primera compra.',
    referralCtaIn: 'Consigue tu enlace de invitación',
    referralCtaOut: 'Crear una cuenta gratuita',
    referralHint: 'Regístrate para obtener tu enlace de invitación.',
  },
  it: {
    referralTitle: 'Invita un amico',
    referralBody: 'Ricevi 2 crediti di conversione per ogni amico che si registra ed effettua il primo acquisto.',
    referralCtaIn: 'Ottieni il tuo link di invito',
    referralCtaOut: 'Crea un account gratuito',
    referralHint: 'Registrati per ottenere il tuo link di invito.',
  },
  pt: {
    referralTitle: 'Indique um amigo',
    referralBody: 'Receba 2 créditos de conversão por cada amigo que se registe e faça a primeira compra.',
    referralCtaIn: 'Obter o meu link de indicação',
    referralCtaOut: 'Criar uma conta gratuita',
    referralHint: 'Registe-se para obter o seu link de indicação.',
  },
  nl: {
    referralTitle: 'Nodig een vriend uit',
    referralBody: 'Ontvang 2 conversietegoeden voor elke vriend die zich aanmeldt en zijn eerste aankoop doet.',
    referralCtaIn: 'Haal je uitnodigingslink op',
    referralCtaOut: 'Maak een gratis account',
    referralHint: 'Meld je aan om je uitnodigingslink te krijgen.',
  },
  pl: {
    referralTitle: 'Poleć znajomemu',
    referralBody: 'Otrzymaj 2 kredyty konwersji za każdego znajomego, który się zarejestruje i dokona pierwszego zakupu.',
    referralCtaIn: 'Odbierz swój link polecający',
    referralCtaOut: 'Załóż darmowe konto',
    referralHint: 'Zarejestruj się, aby otrzymać swój link polecający.',
  },
  sv: {
    referralTitle: 'Värva en vän',
    referralBody: 'Få 2 konverteringskrediter för varje vän som registrerar sig och gör sitt första köp.',
    referralCtaIn: 'Hämta din värvningslänk',
    referralCtaOut: 'Skapa ett gratis konto',
    referralHint: 'Registrera dig för att få din värvningslänk.',
  },
  no: {
    referralTitle: 'Verv en venn',
    referralBody: 'Få 2 konverteringskreditter for hver venn som registrerer seg og gjør sitt første kjøp.',
    referralCtaIn: 'Hent vervelenken din',
    referralCtaOut: 'Opprett en gratis konto',
    referralHint: 'Registrer deg for å få vervelenken din.',
  },
  da: {
    referralTitle: 'Henvis en ven',
    referralBody: 'Få 2 konverteringskreditter for hver ven, der opretter sig og foretager sit første køb.',
    referralCtaIn: 'Hent dit henvisningslink',
    referralCtaOut: 'Opret en gratis konto',
    referralHint: 'Opret dig for at få dit henvisningslink.',
  },
  fi: {
    referralTitle: 'Suosittele ystävälle',
    referralBody: 'Saat 2 muunnoskrediittiä jokaisesta ystävästä, joka rekisteröityy ja tekee ensimmäisen ostoksensa.',
    referralCtaIn: 'Hae suosittelulinkkisi',
    referralCtaOut: 'Luo ilmainen tili',
    referralHint: 'Rekisteröidy saadaksesi suosittelulinkkisi.',
  },
  cs: {
    referralTitle: 'Doporučte přátelům',
    referralBody: 'Získejte 2 kredity na převod za každého přítele, který se zaregistruje a provede první nákup.',
    referralCtaIn: 'Získat doporučující odkaz',
    referralCtaOut: 'Vytvořit účet zdarma',
    referralHint: 'Zaregistrujte se a získejte svůj doporučující odkaz.',
  },
  ro: {
    referralTitle: 'Recomandă unui prieten',
    referralBody: 'Primești 2 credite de conversie pentru fiecare prieten care se înregistrează și face prima achiziție.',
    referralCtaIn: 'Obține linkul tău de recomandare',
    referralCtaOut: 'Creează un cont gratuit',
    referralHint: 'Înregistrează-te pentru a primi linkul tău de recomandare.',
  },
  hu: {
    referralTitle: 'Ajánlja egy barátjának',
    referralBody: 'Kapjon 2 átalakítási kreditet minden barátja után, aki regisztrál és megejti az első vásárlását.',
    referralCtaIn: 'Ajánlólink megszerzése',
    referralCtaOut: 'Ingyenes fiók létrehozása',
    referralHint: 'Regisztráljon, hogy megkapja az ajánlólinkjét.',
  },
  el: {
    referralTitle: 'Προτείνετε σε έναν φίλο',
    referralBody: 'Κερδίστε 2 μονάδες μετατροπής για κάθε φίλο που εγγράφεται και κάνει την πρώτη του αγορά.',
    referralCtaIn: 'Αποκτήστε τον σύνδεσμο παραπομπής σας',
    referralCtaOut: 'Δημιουργία δωρεάν λογαριασμού',
    referralHint: 'Εγγραφείτε για να αποκτήσετε τον σύνδεσμο παραπομπής σας.',
  },
  tr: {
    referralTitle: 'Bir arkadaşınızı davet edin',
    referralBody: 'Kaydolup ilk alışverişini yapan her arkadaşınız için 2 dönüştürme kredisi kazanın.',
    referralCtaIn: 'Davet bağlantınızı alın',
    referralCtaOut: 'Ücretsiz hesap oluşturun',
    referralHint: 'Davet bağlantınızı almak için kaydolun.',
  },
};

const ORDER = ['referralTitle', 'referralBody', 'referralCtaIn', 'referralCtaOut', 'referralHint'];
const lit = (s) => JSON.stringify(s);
let added = 0;

// Insert after faqViewAll, which exists in every language's `home`.
//
// The two files are laid out differently: i18n.js puts one key per line,
// while i18n-translations.js keeps each `home: { ... }` on a single line. The
// insertion follows whichever style the anchor is already in, so neither file
// ends up reformatted. Re-runnable: keys already present are skipped.
function insertAfterFaqViewAll(src, lang, label) {
  const re = /faqViewAll:\s*("|')(?:\\.|(?!\1)[\s\S])*\1,?/;
  const m = re.exec(src);
  if (!m) throw new Error(`${label}: faqViewAll anchor not found`);

  const missing = ORDER.filter((k) => !new RegExp(`\\b${k}\\s*:`).test(src));
  if (missing.length === 0) return src;
  added += missing.length;

  const anchor = m[0].endsWith(',') ? m[0] : m[0] + ',';
  const after = src.slice(m.index + m[0].length);
  const multiline = /^\s*\n/.test(after);

  let insertion;
  if (multiline) {
    // Match the indentation of the anchor line.
    const lineStart = src.lastIndexOf('\n', m.index) + 1;
    const indent = src.slice(lineStart, m.index);
    insertion = '\n' + missing.map((k) => `${indent}${k}: ${lit(COPY[lang][k])},`).join('\n');
  } else {
    insertion = ' ' + missing.map((k) => `${k}: ${lit(COPY[lang][k])},`).join(' ');
  }

  return src.slice(0, m.index) + anchor + insertion + after;
}

// ── English ──────────────────────────────────────────────────────────
fs.writeFileSync(I18N, insertAfterFaqViewAll(fs.readFileSync(I18N, 'utf8'), 'en', 'en'));

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
    const block = insertAfterFaqViewAll(src.slice(start, end), lang, lang);
    src = src.slice(0, start) + block + src.slice(end);
  }
  fs.writeFileSync(TRANS, src);
}

console.log(`Home referral copy: ${added} strings added (${ORDER.length} keys x 17 languages).`);
