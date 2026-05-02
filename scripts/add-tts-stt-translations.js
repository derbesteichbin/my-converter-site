// One-shot: adds 4 new tool.* keys to every non-English language section
// in client/src/i18n-translations.js.
//
// Run from repo root:  node scripts/add-tts-stt-translations.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

const T = {
  de: {
    ttsTextLabel: 'Text zum Umwandeln',
    ttsPlaceholder: 'Geben Sie den Text ein, den Sie hören möchten (max. 4096 Zeichen)…',
    ttsVoiceLabel: 'Stimme',
    sttTranscriptLabel: 'Transkript',
  },
  fr: {
    ttsTextLabel: 'Texte à convertir',
    ttsPlaceholder: 'Tapez ou collez le texte que vous voulez entendre (max. 4096 caractères)…',
    ttsVoiceLabel: 'Voix',
    sttTranscriptLabel: 'Transcription',
  },
  es: {
    ttsTextLabel: 'Texto para convertir',
    ttsPlaceholder: 'Escriba o pegue el texto que quiere escuchar (máx. 4096 caracteres)…',
    ttsVoiceLabel: 'Voz',
    sttTranscriptLabel: 'Transcripción',
  },
  it: {
    ttsTextLabel: 'Testo da convertire',
    ttsPlaceholder: 'Scrivi o incolla il testo che vuoi sentire (max 4096 caratteri)…',
    ttsVoiceLabel: 'Voce',
    sttTranscriptLabel: 'Trascrizione',
  },
  pt: {
    ttsTextLabel: 'Texto para converter',
    ttsPlaceholder: 'Escreva ou cole o texto que quer ouvir (máx. 4096 caracteres)…',
    ttsVoiceLabel: 'Voz',
    sttTranscriptLabel: 'Transcrição',
  },
  nl: {
    ttsTextLabel: 'Tekst om te converteren',
    ttsPlaceholder: 'Typ of plak de tekst die je wilt horen (max. 4096 tekens)…',
    ttsVoiceLabel: 'Stem',
    sttTranscriptLabel: 'Transcriptie',
  },
  pl: {
    ttsTextLabel: 'Tekst do konwersji',
    ttsPlaceholder: 'Wpisz lub wklej tekst, który chcesz usłyszeć (maks. 4096 znaków)…',
    ttsVoiceLabel: 'Głos',
    sttTranscriptLabel: 'Transkrypcja',
  },
  sv: {
    ttsTextLabel: 'Text att konvertera',
    ttsPlaceholder: 'Skriv eller klistra in texten du vill höra (max 4096 tecken)…',
    ttsVoiceLabel: 'Röst',
    sttTranscriptLabel: 'Transkription',
  },
  no: {
    ttsTextLabel: 'Tekst til konvertering',
    ttsPlaceholder: 'Skriv eller lim inn teksten du vil høre (maks. 4096 tegn)…',
    ttsVoiceLabel: 'Stemme',
    sttTranscriptLabel: 'Transkripsjon',
  },
};

function findSectionBlock(content, langName) {
  const start = content.indexOf(`const ${langName} = {`);
  if (start === -1) throw new Error(`Section not found: ${langName}`);
  let depth = 0;
  for (let i = start; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) return [start, i + 1];
    }
  }
  throw new Error(`Unterminated section: ${langName}`);
}

function findSubObject(block, keyName) {
  const re = new RegExp(`\\b${keyName}:\\s*\\{`);
  const m = re.exec(block);
  if (!m) return null;
  const openIdx = m.index + m[0].length - 1;
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

function appendKeys(block, keyName, additions) {
  const found = findSubObject(block, keyName);
  if (!found) throw new Error(`sub-object ${keyName} not found`);
  const [, closeIdx] = found;
  const before = block.slice(0, closeIdx);
  const after = block.slice(closeIdx);
  return before.replace(/\s*$/, '') + ', ' + additions + ' ' + after;
}

for (const [lang, keys] of Object.entries(T)) {
  const [start, end] = findSectionBlock(content, lang);
  let block = content.slice(start, end);
  const additions = Object.entries(keys)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(', ');
  block = appendKeys(block, 'tool', additions);
  content = content.slice(0, start) + block + content.slice(end);
  console.log(`✔ Updated ${lang}`);
}

fs.writeFileSync(FILE, content);
console.log(`\nDone. Wrote ${FILE}`);
