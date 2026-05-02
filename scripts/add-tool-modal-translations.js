// One-shot: adds new tool.* keys (modals + credit pill) and the missing
// toolsPage.comingSoon* keys to every non-English language section in
// client/src/i18n-translations.js.
//
// Run from repo root:  node scripts/add-tool-modal-translations.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

// =====================================================================
// Translations table — per-language strings for the new keys.
// =====================================================================

const T = {
  de: {
    // tool.* additions
    creditPillSingular: '{{count}} Credit',
    creditPillPlural: '{{count}} Credits',
    guestModalTitle: 'Erstellen Sie ein kostenloses Konto, um zu starten',
    guestModalBody: 'Sie benötigen ein Konto, um die Konvertierungswerkzeuge zu nutzen.',
    noCreditsModalTitle: 'Sie benötigen Credits, um Dateien zu konvertieren',
    noCreditsModalBody: 'Wählen Sie ein Paket, um zu beginnen:',
    confirmModalTitle: 'Konvertierung bestätigen',
    confirmBodySingular: 'Diese Konvertierung verbraucht 1 Credit. Sie haben {{count}} Credit übrig.',
    confirmBodyPlural: 'Diese Konvertierung verbraucht 1 Credit. Sie haben {{count}} Credits übrig.',
    confirmBtn: 'Bestätigen',
    buyBtn: 'Kaufen',
    popularPackBadge: 'BELIEBT',
    packLabelSingle: 'Einzelne Konvertierung',
    packLabel10: '10 Konvertierungen',
    packLabel30: '30 Konvertierungen',
    // toolsPage.* additions
    comingSoon: 'Demnächst',
    comingSoonTooltipDefault: 'Diese Funktion kommt bald.',
    tooltips: {
      'document-translation': 'Dokumentenübersetzung kommt bald. Wir arbeiten daran, PDFs und Word-Dokumente in mehrere Sprachen zu übersetzen.',
      'text-to-speech': 'Text zu Sprache kommt bald. Wir arbeiten daran, Text in natürlich klingende MP3-Audiodateien umzuwandeln.',
      'speech-to-text': 'Sprache zu Text kommt bald. Wir arbeiten daran, MP3-, WAV- und M4A-Audio in bearbeitbare Textdateien zu transkribieren.',
      'auto-subtitle': 'Automatischer Untertitel-Generator kommt bald. Wir arbeiten daran, SRT-Untertitel aus MP4-, MOV- und AVI-Videos zu erzeugen.',
    },
  },
  fr: {
    creditPillSingular: '{{count}} crédit',
    creditPillPlural: '{{count}} crédits',
    guestModalTitle: 'Créez un compte gratuit pour commencer',
    guestModalBody: 'Vous avez besoin d\'un compte pour utiliser les outils de conversion.',
    noCreditsModalTitle: 'Vous avez besoin de crédits pour convertir des fichiers',
    noCreditsModalBody: 'Choisissez un pack pour commencer :',
    confirmModalTitle: 'Confirmer la conversion',
    confirmBodySingular: 'Cette conversion utilisera 1 crédit. Il vous reste {{count}} crédit.',
    confirmBodyPlural: 'Cette conversion utilisera 1 crédit. Il vous reste {{count}} crédits.',
    confirmBtn: 'Confirmer',
    buyBtn: 'Acheter',
    popularPackBadge: 'POPULAIRE',
    packLabelSingle: 'Conversion unique',
    packLabel10: '10 conversions',
    packLabel30: '30 conversions',
    comingSoon: 'Bientôt disponible',
    comingSoonTooltipDefault: 'Cette fonctionnalité arrive bientôt.',
    tooltips: {
      'document-translation': 'La traduction de documents arrive bientôt. Nous travaillons à la traduction de PDF et documents Word en plusieurs langues.',
      'text-to-speech': 'La synthèse vocale arrive bientôt. Nous travaillons à convertir le texte en MP3 à voix naturelle.',
      'speech-to-text': 'La transcription audio arrive bientôt. Nous travaillons à transcrire MP3, WAV et M4A en fichiers texte modifiables.',
      'auto-subtitle': 'Le générateur de sous-titres arrive bientôt. Nous travaillons à générer des sous-titres SRT depuis MP4, MOV et AVI.',
    },
  },
  es: {
    creditPillSingular: '{{count}} crédito',
    creditPillPlural: '{{count}} créditos',
    guestModalTitle: 'Crea una cuenta gratuita para empezar',
    guestModalBody: 'Necesitas una cuenta para usar las herramientas de conversión.',
    noCreditsModalTitle: 'Necesitas créditos para convertir archivos',
    noCreditsModalBody: 'Elige un paquete para empezar:',
    confirmModalTitle: 'Confirmar conversión',
    confirmBodySingular: 'Esta conversión usará 1 crédito. Te queda {{count}} crédito.',
    confirmBodyPlural: 'Esta conversión usará 1 crédito. Te quedan {{count}} créditos.',
    confirmBtn: 'Confirmar',
    buyBtn: 'Comprar',
    popularPackBadge: 'POPULAR',
    packLabelSingle: 'Conversión única',
    packLabel10: '10 conversiones',
    packLabel30: '30 conversiones',
    comingSoon: 'Próximamente',
    comingSoonTooltipDefault: 'Esta función llega pronto.',
    tooltips: {
      'document-translation': 'La traducción de documentos llega pronto. Estamos añadiendo soporte para traducir PDFs y documentos Word a varios idiomas.',
      'text-to-speech': 'Texto a voz llega pronto. Estamos añadiendo conversión de texto a MP3 con voz natural.',
      'speech-to-text': 'Voz a texto llega pronto. Estamos añadiendo transcripción de MP3, WAV y M4A a archivos de texto editables.',
      'auto-subtitle': 'El generador de subtítulos llega pronto. Estamos añadiendo generación de subtítulos SRT desde vídeos MP4, MOV y AVI.',
    },
  },
  it: {
    creditPillSingular: '{{count}} credito',
    creditPillPlural: '{{count}} crediti',
    guestModalTitle: 'Crea un account gratuito per iniziare',
    guestModalBody: 'Hai bisogno di un account per usare gli strumenti di conversione.',
    noCreditsModalTitle: 'Hai bisogno di crediti per convertire file',
    noCreditsModalBody: 'Scegli un pacchetto per iniziare:',
    confirmModalTitle: 'Conferma conversione',
    confirmBodySingular: 'Questa conversione userà 1 credito. Ti resta {{count}} credito.',
    confirmBodyPlural: 'Questa conversione userà 1 credito. Ti restano {{count}} crediti.',
    confirmBtn: 'Conferma',
    buyBtn: 'Acquista',
    popularPackBadge: 'POPOLARE',
    packLabelSingle: 'Conversione singola',
    packLabel10: '10 conversioni',
    packLabel30: '30 conversioni',
    comingSoon: 'Prossimamente',
    comingSoonTooltipDefault: 'Questa funzionalità arriva presto.',
    tooltips: {
      'document-translation': 'La traduzione di documenti arriva presto. Stiamo lavorando per tradurre PDF e documenti Word in più lingue.',
      'text-to-speech': 'Da testo a voce arriva presto. Stiamo lavorando per convertire testo in MP3 con voce naturale.',
      'speech-to-text': 'Da voce a testo arriva presto. Stiamo lavorando per trascrivere MP3, WAV e M4A in testo modificabile.',
      'auto-subtitle': 'Il generatore di sottotitoli arriva presto. Stiamo lavorando per generare sottotitoli SRT da MP4, MOV e AVI.',
    },
  },
  pt: {
    creditPillSingular: '{{count}} crédito',
    creditPillPlural: '{{count}} créditos',
    guestModalTitle: 'Crie uma conta gratuita para começar',
    guestModalBody: 'Precisa de uma conta para usar as ferramentas de conversão.',
    noCreditsModalTitle: 'Precisa de créditos para converter arquivos',
    noCreditsModalBody: 'Escolha um pacote para começar:',
    confirmModalTitle: 'Confirmar conversão',
    confirmBodySingular: 'Esta conversão usará 1 crédito. Resta-lhe {{count}} crédito.',
    confirmBodyPlural: 'Esta conversão usará 1 crédito. Restam-lhe {{count}} créditos.',
    confirmBtn: 'Confirmar',
    buyBtn: 'Comprar',
    popularPackBadge: 'POPULAR',
    packLabelSingle: 'Conversão única',
    packLabel10: '10 conversões',
    packLabel30: '30 conversões',
    comingSoon: 'Em breve',
    comingSoonTooltipDefault: 'Esta funcionalidade chega em breve.',
    tooltips: {
      'document-translation': 'A tradução de documentos chega em breve. Estamos a adicionar suporte para traduzir PDFs e documentos Word em vários idiomas.',
      'text-to-speech': 'Texto para fala chega em breve. Estamos a converter texto em MP3 com voz natural.',
      'speech-to-text': 'Fala para texto chega em breve. Estamos a transcrever MP3, WAV e M4A em arquivos de texto editáveis.',
      'auto-subtitle': 'O gerador de legendas chega em breve. Estamos a gerar legendas SRT a partir de vídeos MP4, MOV e AVI.',
    },
  },
  nl: {
    creditPillSingular: '{{count}} credit',
    creditPillPlural: '{{count}} credits',
    guestModalTitle: 'Maak een gratis account aan om te beginnen',
    guestModalBody: 'Je hebt een account nodig om de conversiehulpmiddelen te gebruiken.',
    noCreditsModalTitle: 'Je hebt credits nodig om bestanden te converteren',
    noCreditsModalBody: 'Kies een pakket om te beginnen:',
    confirmModalTitle: 'Conversie bevestigen',
    confirmBodySingular: 'Deze conversie gebruikt 1 credit. Je hebt nog {{count}} credit over.',
    confirmBodyPlural: 'Deze conversie gebruikt 1 credit. Je hebt nog {{count}} credits over.',
    confirmBtn: 'Bevestigen',
    buyBtn: 'Kopen',
    popularPackBadge: 'POPULAIR',
    packLabelSingle: 'Eén conversie',
    packLabel10: '10 conversies',
    packLabel30: '30 conversies',
    comingSoon: 'Binnenkort',
    comingSoonTooltipDefault: 'Deze functie komt binnenkort.',
    tooltips: {
      'document-translation': 'Documentvertaling komt binnenkort. We werken aan het vertalen van PDF\'s en Word-documenten in meerdere talen.',
      'text-to-speech': 'Tekst naar spraak komt binnenkort. We werken aan het omzetten van tekst naar natuurlijk klinkende MP3-audio.',
      'speech-to-text': 'Spraak naar tekst komt binnenkort. We werken aan het transcriberen van MP3, WAV en M4A naar bewerkbare tekstbestanden.',
      'auto-subtitle': 'De ondertitelgenerator komt binnenkort. We werken aan SRT-ondertitels vanuit MP4-, MOV- en AVI-video\'s.',
    },
  },
  pl: {
    creditPillSingular: '{{count}} kredyt',
    creditPillPlural: '{{count}} kredytów',
    guestModalTitle: 'Utwórz darmowe konto, aby rozpocząć',
    guestModalBody: 'Potrzebujesz konta, aby korzystać z narzędzi konwersji.',
    noCreditsModalTitle: 'Potrzebujesz kredytów, aby konwertować pliki',
    noCreditsModalBody: 'Wybierz pakiet, aby zacząć:',
    confirmModalTitle: 'Potwierdź konwersję',
    confirmBodySingular: 'Ta konwersja zużyje 1 kredyt. Zostaje Ci {{count}} kredyt.',
    confirmBodyPlural: 'Ta konwersja zużyje 1 kredyt. Zostaje Ci {{count}} kredytów.',
    confirmBtn: 'Potwierdź',
    buyBtn: 'Kup',
    popularPackBadge: 'POPULARNE',
    packLabelSingle: 'Pojedyncza konwersja',
    packLabel10: '10 konwersji',
    packLabel30: '30 konwersji',
    comingSoon: 'Wkrótce',
    comingSoonTooltipDefault: 'Ta funkcja wkrótce.',
    tooltips: {
      'document-translation': 'Tłumaczenie dokumentów wkrótce. Pracujemy nad tłumaczeniem PDF i dokumentów Word na wiele języków.',
      'text-to-speech': 'Tekst na mowę wkrótce. Pracujemy nad konwersją tekstu na naturalnie brzmiące audio MP3.',
      'speech-to-text': 'Mowa na tekst wkrótce. Pracujemy nad transkrypcją MP3, WAV i M4A na edytowalne pliki tekstowe.',
      'auto-subtitle': 'Generator napisów wkrótce. Pracujemy nad generowaniem napisów SRT z wideo MP4, MOV i AVI.',
    },
  },
  sv: {
    creditPillSingular: '{{count}} kredit',
    creditPillPlural: '{{count}} krediter',
    guestModalTitle: 'Skapa ett gratis konto för att börja',
    guestModalBody: 'Du behöver ett konto för att använda konverteringsverktygen.',
    noCreditsModalTitle: 'Du behöver krediter för att konvertera filer',
    noCreditsModalBody: 'Välj ett paket för att börja:',
    confirmModalTitle: 'Bekräfta konvertering',
    confirmBodySingular: 'Denna konvertering använder 1 kredit. Du har {{count}} kredit kvar.',
    confirmBodyPlural: 'Denna konvertering använder 1 kredit. Du har {{count}} krediter kvar.',
    confirmBtn: 'Bekräfta',
    buyBtn: 'Köp',
    popularPackBadge: 'POPULÄR',
    packLabelSingle: 'En konvertering',
    packLabel10: '10 konverteringar',
    packLabel30: '30 konverteringar',
    comingSoon: 'Kommer snart',
    comingSoonTooltipDefault: 'Den här funktionen kommer snart.',
    tooltips: {
      'document-translation': 'Dokumentöversättning kommer snart. Vi arbetar med att översätta PDF- och Word-dokument till flera språk.',
      'text-to-speech': 'Text till tal kommer snart. Vi arbetar med att konvertera text till naturligt ljudande MP3.',
      'speech-to-text': 'Tal till text kommer snart. Vi arbetar med att transkribera MP3, WAV och M4A till redigerbara textfiler.',
      'auto-subtitle': 'Undertextgeneratorn kommer snart. Vi arbetar med att generera SRT-undertexter från MP4, MOV och AVI.',
    },
  },
  no: {
    creditPillSingular: '{{count}} kreditt',
    creditPillPlural: '{{count}} kreditter',
    guestModalTitle: 'Opprett en gratis konto for å begynne',
    guestModalBody: 'Du trenger en konto for å bruke konverteringsverktøyene.',
    noCreditsModalTitle: 'Du trenger kreditter for å konvertere filer',
    noCreditsModalBody: 'Velg en pakke for å starte:',
    confirmModalTitle: 'Bekreft konvertering',
    confirmBodySingular: 'Denne konverteringen bruker 1 kreditt. Du har {{count}} kreditt igjen.',
    confirmBodyPlural: 'Denne konverteringen bruker 1 kreditt. Du har {{count}} kreditter igjen.',
    confirmBtn: 'Bekreft',
    buyBtn: 'Kjøp',
    popularPackBadge: 'POPULÆR',
    packLabelSingle: 'Én konvertering',
    packLabel10: '10 konverteringer',
    packLabel30: '30 konverteringer',
    comingSoon: 'Kommer snart',
    comingSoonTooltipDefault: 'Denne funksjonen kommer snart.',
    tooltips: {
      'document-translation': 'Dokumentoversettelse kommer snart. Vi jobber med å oversette PDF- og Word-dokumenter til flere språk.',
      'text-to-speech': 'Tekst til tale kommer snart. Vi jobber med å konvertere tekst til naturlig MP3-lyd.',
      'speech-to-text': 'Tale til tekst kommer snart. Vi jobber med å transkribere MP3, WAV og M4A til redigerbare tekstfiler.',
      'auto-subtitle': 'Undertekstgeneratoren kommer snart. Vi jobber med å lage SRT-undertekster fra MP4, MOV og AVI.',
    },
  },
};

// =====================================================================
// Walk a language section, find a named sub-object (`tool:` or
// `toolsPage:`) and append the new keys before its closing brace.
// =====================================================================

function findSectionBlock(content, langName) {
  const startMarker = `const ${langName} = {`;
  const start = content.indexOf(startMarker);
  if (start === -1) throw new Error(`Section not found: ${langName}`);
  let depth = 0;
  let i = start;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) return [start, i + 1];
    }
    i++;
  }
  throw new Error(`Unterminated section: ${langName}`);
}

// Find a named sub-object inside a section: `keyName: { ... }`. Returns the
// [openBraceIdx, closeBraceIdx] within `block`.
function findSubObject(block, keyName) {
  const re = new RegExp(`\\b${keyName}:\\s*\\{`);
  const m = re.exec(block);
  if (!m) return null;
  const openIdx = m.index + m[0].length - 1;  // points at the {
  let depth = 0;
  for (let i = openIdx; i < block.length; i++) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') {
      depth--;
      if (depth === 0) return [openIdx, i];
    }
  }
  return null;
}

function appendKeysToSubObject(block, keyName, additions) {
  const found = findSubObject(block, keyName);
  if (!found) {
    console.warn(`  ! sub-object ${keyName} not found in block`);
    return block;
  }
  const [openIdx, closeIdx] = found;
  const before = block.slice(0, closeIdx);
  const after = block.slice(closeIdx);
  // Append: comma + space + key list, before the closing }.
  // Trim trailing whitespace inside the object so we don't double-space.
  return before.replace(/\s*$/, '') + ', ' + additions + ' ' + after;
}

function processLanguage(content, lang) {
  const t = T[lang];
  if (!t) return content;
  const [start, end] = findSectionBlock(content, lang);
  let block = content.slice(start, end);

  // 1. Extend toolsPage with comingSoon, comingSoonTooltipDefault, comingSoonTooltip
  const tooltipsObj = Object.entries(t.tooltips)
    .map(([k, v]) => `'${k}': ${JSON.stringify(v)}`)
    .join(', ');
  const toolsPageAdditions =
    `comingSoon: ${JSON.stringify(t.comingSoon)}, ` +
    `comingSoonTooltipDefault: ${JSON.stringify(t.comingSoonTooltipDefault)}, ` +
    `comingSoonTooltip: { ${tooltipsObj} }`;
  block = appendKeysToSubObject(block, 'toolsPage', toolsPageAdditions);

  // 2. Extend tool with the new modal/credit keys
  const toolKeys = [
    'creditPillSingular', 'creditPillPlural',
    'guestModalTitle', 'guestModalBody',
    'noCreditsModalTitle', 'noCreditsModalBody',
    'confirmModalTitle', 'confirmBodySingular', 'confirmBodyPlural',
    'confirmBtn', 'buyBtn', 'popularPackBadge',
    'packLabelSingle', 'packLabel10', 'packLabel30',
  ];
  const toolAdditions = toolKeys
    .map((k) => `${k}: ${JSON.stringify(t[k])}`)
    .join(', ');
  block = appendKeysToSubObject(block, 'tool', toolAdditions);

  return content.slice(0, start) + block + content.slice(end);
}

// =====================================================================
// Run
// =====================================================================

for (const lang of Object.keys(T)) {
  content = processLanguage(content, lang);
  console.log(`✔ Updated ${lang}`);
}

fs.writeFileSync(FILE, content);
console.log(`\nDone. Wrote ${FILE}`);
