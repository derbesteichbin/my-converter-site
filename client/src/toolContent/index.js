// ── Language pack loading ────────────────────────────────────────────
//
// Each language's prose lives in its own module so Vite emits one chunk per
// language and a visitor downloads only the one they read. The packs are all
// key-for-key identical (enforced by scripts/audit-tool-content.mjs), so the
// engine never needs a second pack loaded as a fallback.

export { buildToolContent, buildFaqJsonLd } from './engine.js';

const LOADERS = {
  en: () => import('./packs/en.js'),
  de: () => import('./packs/de.js'),
  fr: () => import('./packs/fr.js'),
  es: () => import('./packs/es.js'),
  it: () => import('./packs/it.js'),
  pt: () => import('./packs/pt.js'),
  nl: () => import('./packs/nl.js'),
  pl: () => import('./packs/pl.js'),
  sv: () => import('./packs/sv.js'),
  no: () => import('./packs/no.js'),
  da: () => import('./packs/da.js'),
  fi: () => import('./packs/fi.js'),
  cs: () => import('./packs/cs.js'),
  ro: () => import('./packs/ro.js'),
  hu: () => import('./packs/hu.js'),
  el: () => import('./packs/el.js'),
  tr: () => import('./packs/tr.js'),
};

export const PACK_LANGUAGES = Object.keys(LOADERS);

// Normalise "de-AT" / "pt-BR" down to the pack we actually ship.
export function packLanguage(lang) {
  const base = String(lang || 'en').toLowerCase().split('-')[0];
  return LOADERS[base] ? base : 'en';
}

const cache = new Map();

export function loadPack(lang) {
  const key = packLanguage(lang);
  if (!cache.has(key)) {
    cache.set(key, LOADERS[key]().then((m) => m.default).catch(() => LOADERS.en().then((m) => m.default)));
  }
  return cache.get(key);
}
