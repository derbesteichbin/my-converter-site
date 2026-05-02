// One-shot: adds voice descriptions + microphone-recording labels to every
// non-English language section in client/src/i18n-translations.js.
//
// Run from repo root:  node scripts/add-voice-record-translations.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

// Per-language: voiceDesc.* (one per voice) + recordBtn / stopRecording /
// micPermissionDenied. Keeping voice descriptions short — they render in
// 12px text under the voice name.
const T = {
  de: {
    voiceDesc: {
      alloy: 'Neutral und ausgewogen — allgemeine Nutzung',
      echo: 'Männlich, warmer Ton — Storytelling',
      fable: 'Britischer Akzent, ausdrucksstark — Hörbücher',
      onyx: 'Tief und autoritär — Präsentationen',
      nova: 'Weiblich, freundlich und klar — Kundenservice',
      shimmer: 'Weiblich, sanft und ruhig — Meditation',
    },
    recordBtn: 'Mit Mikrofon aufnehmen',
    stopRecording: 'Aufnahme stoppen',
    micPermissionDenied: 'Mikrofonzugriff verweigert. Bitte prüfen Sie Ihre Browser-Berechtigungen.',
  },
  fr: {
    voiceDesc: {
      alloy: 'Neutre et équilibré — usage général',
      echo: 'Masculin, ton chaleureux — narration',
      fable: 'Accent britannique, expressif — livres audio',
      onyx: 'Grave et autoritaire — présentations',
      nova: 'Féminin, amical et clair — service client',
      shimmer: 'Féminin, doux et apaisant — méditation',
    },
    recordBtn: 'Enregistrer depuis le microphone',
    stopRecording: "Arrêter l'enregistrement",
    micPermissionDenied: "Accès au microphone refusé. Vérifiez les autorisations de votre navigateur.",
  },
  es: {
    voiceDesc: {
      alloy: 'Neutra y equilibrada — uso general',
      echo: 'Masculina, tono cálido — narración',
      fable: 'Acento británico, expresiva — audiolibros',
      onyx: 'Profunda y autoritaria — presentaciones',
      nova: 'Femenina, amigable y clara — atención al cliente',
      shimmer: 'Femenina, suave y serena — meditación',
    },
    recordBtn: 'Grabar desde el micrófono',
    stopRecording: 'Detener grabación',
    micPermissionDenied: 'Acceso al micrófono denegado. Verifique los permisos del navegador.',
  },
  it: {
    voiceDesc: {
      alloy: 'Neutra ed equilibrata — uso generale',
      echo: 'Maschile, tono caldo — narrazione',
      fable: 'Accento britannico, espressiva — audiolibri',
      onyx: 'Profonda e autorevole — presentazioni',
      nova: 'Femminile, amichevole e chiara — assistenza clienti',
      shimmer: 'Femminile, dolce e calma — meditazione',
    },
    recordBtn: 'Registra dal microfono',
    stopRecording: 'Interrompi registrazione',
    micPermissionDenied: 'Accesso al microfono negato. Controlla i permessi del browser.',
  },
  pt: {
    voiceDesc: {
      alloy: 'Neutra e equilibrada — uso geral',
      echo: 'Masculina, tom caloroso — narração',
      fable: 'Sotaque britânico, expressiva — audiolivros',
      onyx: 'Profunda e autoritária — apresentações',
      nova: 'Feminina, amigável e clara — atendimento ao cliente',
      shimmer: 'Feminina, suave e calma — meditação',
    },
    recordBtn: 'Gravar do microfone',
    stopRecording: 'Parar gravação',
    micPermissionDenied: 'Acesso ao microfone negado. Verifique as permissões do navegador.',
  },
  nl: {
    voiceDesc: {
      alloy: 'Neutraal en uitgebalanceerd — algemeen gebruik',
      echo: 'Mannelijk, warme toon — vertellen',
      fable: 'Brits accent, expressief — luisterboeken',
      onyx: 'Diep en gezaghebbend — presentaties',
      nova: 'Vrouwelijk, vriendelijk en helder — klantenservice',
      shimmer: 'Vrouwelijk, zacht en kalm — meditatie',
    },
    recordBtn: 'Opnemen via microfoon',
    stopRecording: 'Opname stoppen',
    micPermissionDenied: 'Microfoontoegang geweigerd. Controleer je browserinstellingen.',
  },
  pl: {
    voiceDesc: {
      alloy: 'Neutralny i wyważony — ogólne zastosowanie',
      echo: 'Męski, ciepły ton — opowiadanie historii',
      fable: 'Brytyjski akcent, ekspresyjny — audiobooki',
      onyx: 'Głęboki i autorytatywny — prezentacje',
      nova: 'Żeński, przyjazny i wyraźny — obsługa klienta',
      shimmer: 'Żeński, miękki i łagodny — medytacja',
    },
    recordBtn: 'Nagraj z mikrofonu',
    stopRecording: 'Zatrzymaj nagrywanie',
    micPermissionDenied: 'Dostęp do mikrofonu odrzucony. Sprawdź uprawnienia przeglądarki.',
  },
  sv: {
    voiceDesc: {
      alloy: 'Neutral och balanserad — allmän användning',
      echo: 'Manlig, varm ton — berättande',
      fable: 'Brittisk accent, uttrycksfull — ljudböcker',
      onyx: 'Djup och auktoritär — presentationer',
      nova: 'Kvinnlig, vänlig och tydlig — kundtjänst',
      shimmer: 'Kvinnlig, mjuk och lugn — meditation',
    },
    recordBtn: 'Spela in från mikrofonen',
    stopRecording: 'Stoppa inspelning',
    micPermissionDenied: 'Mikrofonåtkomst nekad. Kontrollera webbläsarens behörigheter.',
  },
  no: {
    voiceDesc: {
      alloy: 'Nøytral og balansert — generell bruk',
      echo: 'Mannlig, varm tone — fortelling',
      fable: 'Britisk aksent, uttrykksfull — lydbøker',
      onyx: 'Dyp og autoritativ — presentasjoner',
      nova: 'Kvinnelig, vennlig og klar — kundeservice',
      shimmer: 'Kvinnelig, myk og rolig — meditasjon',
    },
    recordBtn: 'Spill inn fra mikrofon',
    stopRecording: 'Stopp opptak',
    micPermissionDenied: 'Mikrofontilgang avvist. Sjekk nettleserens tillatelser.',
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

for (const [lang, payload] of Object.entries(T)) {
  const [start, end] = findSectionBlock(content, lang);
  let block = content.slice(start, end);

  // Build the additions string: voiceDesc nested object + flat keys.
  const voiceDescEntries = Object.entries(payload.voiceDesc)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(', ');
  const additions = [
    `voiceDesc: { ${voiceDescEntries} }`,
    `recordBtn: ${JSON.stringify(payload.recordBtn)}`,
    `stopRecording: ${JSON.stringify(payload.stopRecording)}`,
    `micPermissionDenied: ${JSON.stringify(payload.micPermissionDenied)}`,
  ].join(', ');

  block = appendKeys(block, 'tool', additions);
  content = content.slice(0, start) + block + content.slice(end);
  console.log(`✔ Updated ${lang}`);
}

fs.writeFileSync(FILE, content);
console.log(`\nDone. Wrote ${FILE}`);
