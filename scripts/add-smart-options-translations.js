// One-shot: adds 4 new tool.* keys for the smart-functions option selectors
// (TTS speed, language hint, auto-detect label) into all 9 non-English
// language sections.
//
// Run from repo root:  node scripts/add-smart-options-translations.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

const T = {
  de: {
    ttsSpeedLabel: 'Geschwindigkeit',
    ttsSpeedDefault: 'Standard',
    languageHintLabel: 'Sprache',
    languageAuto: 'Automatisch erkennen',
  },
  fr: {
    ttsSpeedLabel: 'Vitesse',
    ttsSpeedDefault: 'défaut',
    languageHintLabel: 'Langue',
    languageAuto: 'Détection automatique',
  },
  es: {
    ttsSpeedLabel: 'Velocidad',
    ttsSpeedDefault: 'predeterminado',
    languageHintLabel: 'Idioma',
    languageAuto: 'Detección automática',
  },
  it: {
    ttsSpeedLabel: 'Velocità',
    ttsSpeedDefault: 'predefinito',
    languageHintLabel: 'Lingua',
    languageAuto: 'Rilevamento automatico',
  },
  pt: {
    ttsSpeedLabel: 'Velocidade',
    ttsSpeedDefault: 'padrão',
    languageHintLabel: 'Idioma',
    languageAuto: 'Detecção automática',
  },
  nl: {
    ttsSpeedLabel: 'Snelheid',
    ttsSpeedDefault: 'standaard',
    languageHintLabel: 'Taal',
    languageAuto: 'Automatisch detecteren',
  },
  pl: {
    ttsSpeedLabel: 'Prędkość',
    ttsSpeedDefault: 'domyślna',
    languageHintLabel: 'Język',
    languageAuto: 'Wykrywanie automatyczne',
  },
  sv: {
    ttsSpeedLabel: 'Hastighet',
    ttsSpeedDefault: 'standard',
    languageHintLabel: 'Språk',
    languageAuto: 'Identifiera automatiskt',
  },
  no: {
    ttsSpeedLabel: 'Hastighet',
    ttsSpeedDefault: 'standard',
    languageHintLabel: 'Språk',
    languageAuto: 'Oppdag automatisk',
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
