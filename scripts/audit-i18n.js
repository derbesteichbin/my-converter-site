// i18n coverage audit. Compares every non-English language section in
// i18n-translations.js against the English source in i18n.js, reports
// missing keys grouped by top-level page/section.
//
// Run from repo root:  node scripts/audit-i18n.js

const fs = require('fs');
const path = require('path');

const I18N = path.join(__dirname, '..', 'client', 'src', 'i18n.js');
const TRANS = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');

// Languages explicitly in scope per project policy
const TARGET_LANGS = ['de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'cs', 'ro', 'hu', 'el', 'tr'];

// =====================================================================
// Source-parse the `const en = { ... };` literal from i18n.js using a
// depth-tracked brace walk, then eval to a plain object. Avoids having
// to mock i18next/react-i18next just to read the data.
// =====================================================================

function extractEnglishSource() {
  const src = fs.readFileSync(I18N, 'utf8');
  const startMarker = 'const en = {';
  const startIdx = src.indexOf(startMarker);
  if (startIdx === -1) throw new Error('Could not find `const en = {` in i18n.js');
  const openBrace = startIdx + startMarker.length - 1;
  let depth = 0;
  for (let i = openBrace; i < src.length; i++) {
    const c = src[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        const literal = src.slice(openBrace, i + 1);
        // eslint-disable-next-line no-eval
        return eval('(' + literal + ')');
      }
    }
  }
  throw new Error('Unterminated en object literal');
}

// =====================================================================
// Flatten a nested object into a Map of dot-path → value (string).
// Stringified values aren't compared in this audit, only key presence.
// =====================================================================

function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out.set(key, v);
    }
  }
  return out;
}

// Group a flat list of dot-paths by their first segment (top-level key).
function groupBySection(paths) {
  const sections = new Map();
  for (const p of paths) {
    const top = p.split('.')[0];
    if (!sections.has(top)) sections.set(top, []);
    sections.get(top).push(p);
  }
  return sections;
}

// =====================================================================
// Run audit
// =====================================================================

const enObj = extractEnglishSource();
const enFlat = flatten(enObj);
const enKeys = new Set(enFlat.keys());

const transModule = require(TRANS);
const langData = transModule.translations;

console.log('='.repeat(72));
console.log('  i18n COVERAGE AUDIT');
console.log('='.repeat(72));
console.log();
console.log(`English source keys (from i18n.js):  ${enKeys.size}`);
console.log(`Languages in scope:                  ${TARGET_LANGS.join(', ')}`);
console.log();

// Per-section English key counts (for percentages)
const enBySection = groupBySection([...enKeys]);
const sectionSizes = new Map();
for (const [section, paths] of enBySection) sectionSizes.set(section, paths.length);

// Per-language audit
const summary = [];
const detailedMisses = new Map();

for (const lang of TARGET_LANGS) {
  if (!langData[lang]) {
    summary.push({ lang, total: 0, missing: enKeys.size, coverage: 0 });
    detailedMisses.set(lang, [...enKeys]);
    continue;
  }
  const langFlat = flatten(langData[lang]);
  const langKeys = new Set(langFlat.keys());
  const missing = [...enKeys].filter((k) => !langKeys.has(k));
  const coverage = ((enKeys.size - missing.length) / enKeys.size) * 100;
  summary.push({
    lang,
    total: langKeys.size,
    missing: missing.length,
    coverage: coverage.toFixed(1),
  });
  detailedMisses.set(lang, missing);
}

// =====================================================================
// Top-level coverage table
// =====================================================================

console.log('OVERALL COVERAGE');
console.log('─'.repeat(72));
console.log('  Lang | EN keys | Missing |  Cov  | Status');
console.log('  ─────┼─────────┼─────────┼───────┼' + '─'.repeat(20));
console.log(`  en   | ${String(enKeys.size).padStart(7)} |       0 | 100.0% | ✓ source`);
for (const r of summary) {
  const status = r.coverage === '100.0' ? '✓ complete'
    : parseFloat(r.coverage) >= 95 ? '○ near-complete'
    : parseFloat(r.coverage) >= 75 ? '◐ partial'
    : '× sparse';
  console.log(`  ${r.lang.padEnd(4)} | ${String(enKeys.size).padStart(7)} | ${String(r.missing).padStart(7)} | ${String(r.coverage).padStart(5)}% | ${status}`);
}
console.log();

// =====================================================================
// Per-section, per-language breakdown
// =====================================================================

const sectionList = [...sectionSizes.keys()].sort();
console.log('PER-SECTION COVERAGE  (cell = missing/total per language)');
console.log('─'.repeat(72));
console.log(
  '  Section'.padEnd(22) +
  TARGET_LANGS.map((l) => l.padStart(6)).join('') + '  Total',
);
console.log('  ' + '─'.repeat(70));
for (const section of sectionList) {
  const total = sectionSizes.get(section);
  const cells = [];
  for (const lang of TARGET_LANGS) {
    const missing = detailedMisses.get(lang).filter((k) => k.startsWith(section + '.') || k === section).length;
    if (missing === 0) cells.push('  ✓  ');
    else cells.push((missing + '/' + total).padStart(6));
  }
  console.log(
    '  ' + section.padEnd(20) + cells.join('') + '  ' + String(total).padStart(5),
  );
}
console.log();

// =====================================================================
// Detailed missing-keys list, grouped by section per language
// =====================================================================

console.log('MISSING KEYS (only languages with gaps shown)');
console.log('─'.repeat(72));

let anyGaps = false;
for (const lang of TARGET_LANGS) {
  const missing = detailedMisses.get(lang);
  if (missing.length === 0) continue;
  anyGaps = true;
  console.log();
  console.log(`▶ ${lang}  — ${missing.length} key${missing.length === 1 ? '' : 's'} missing`);
  const grouped = groupBySection(missing);
  for (const [section, paths] of [...grouped.entries()].sort()) {
    console.log(`    ${section}  (${paths.length})`);
    // Show all paths if ≤ 10, otherwise first 8 + "...and N more"
    const display = paths.length <= 10 ? paths : [...paths.slice(0, 8), `... and ${paths.length - 8} more`];
    for (const p of display) console.log(`      - ${p}`);
  }
}
if (!anyGaps) {
  console.log();
  console.log('  No gaps. Every target language is at 100% coverage.');
}

console.log();
console.log('='.repeat(72));
