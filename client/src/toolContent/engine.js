// ── Per-tool content composition engine (language-agnostic) ──────────
//
// The engine decides *which* sentence a given conversion needs by branching on
// the structural facts in formats.js — lossy vs lossless, vector vs raster,
// fixed-layout vs reflowable, container remux, audio extraction, and so on.
// It never contains prose itself: every string comes from the language pack
// passed in, so a translated pack produces the same per-tool reasoning in
// another language rather than a translated blob.
//
// Pack shape:
//   { formats: { <ext>: { about, note } },
//     reasons: { <tool slug>: string },
//     t:       { <template key>: string } }
//
// Templates interpolate {{name}} placeholders. File format names are supplied
// as-is (PDF stays PDF), so packs must leave them untouched.

import { FORMATS, SHAPES } from './formats.js';

function interpolate(str, vars) {
  if (!str) return '';
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] === undefined ? '' : String(vars[k])));
}

// Resolve a template from the active pack, falling back to the reference pack
// so a partially translated language still renders complete text.
function makeT(pack, fallback) {
  return function t(key, vars = {}) {
    const raw = (pack.t && pack.t[key]) || (fallback && fallback.t && fallback.t[key]) || '';
    return interpolate(raw, vars);
  };
}

function fmt(key) {
  return FORMATS[key] || null;
}

// "A, B and C" — only the final joiner is a word, so only it is translated.
function listNames(keys, joiner, max = 12) {
  const seen = [];
  for (const k of keys || []) {
    const f = fmt(k);
    const n = f ? f.name : String(k).toUpperCase();
    if (!seen.includes(n)) seen.push(n);
  }
  const shown = seen.slice(0, max);
  if (shown.length <= 1) return shown[0] || '';
  return shown.slice(0, -1).join(', ') + ' ' + joiner + ' ' + shown[shown.length - 1];
}

// ── FAQ 2: fidelity, chosen by what the conversion actually does ─────
function qualityFaq(t, f, tv, fn, tn) {
  const v = { fn, tn };

  if (f && f.vector && tv && !tv.vector) {
    return { q: t('quality.vectorRaster.q', v), a: t('quality.vectorRaster.a', v) };
  }

  if (f && tv && (f.family === 'document' || f.family === 'ebook') && (tv.family === 'document' || tv.family === 'ebook')) {
    if (tv.name === 'TXT') return { q: t('quality.docToTxt.q', v), a: t('quality.docToTxt.a', v) };
    if (tv.name === 'CSV' || tv.name === 'XLSX' || tv.name === 'XLS') {
      return { q: t('quality.docToSheet.q', v), a: t('quality.docToSheet.a', v) };
    }
    if (tv.reflow && f.fixedLayout) return { q: t('quality.docToReflow.q', v), a: t('quality.docToReflow.a', v) };
    if (tv.fixedLayout) return { q: t('quality.docToFixed.q', v), a: t('quality.docToFixed.a', v) };
    if (f.fixedLayout && tv.editable) return { q: t('quality.docToEditable.q', v), a: t('quality.docToEditable.a', v) };
    return { q: t('quality.docGeneric.q', v), a: t('quality.docGeneric.a', v) };
  }

  if (f && tv && f.family === 'archive' && tv.family === 'archive') {
    const clause = tv.name === '7Z' ? t('quality.archive.clause.to7z', v)
      : tn === 'ZIP' ? t('quality.archive.clause.toZip', v)
        : t('quality.archive.clause.other', v);
    return { q: t('quality.archive.q', v), a: t('quality.archive.a', { fn, tn, clause }) };
  }

  if (f && tv && f.family === 'image' && tv.family === 'document') {
    return { q: t('quality.imageToDoc.q', v), a: t('quality.imageToDoc.a', v) };
  }

  if (tv && tv.name === 'GIF') {
    return { q: t('quality.toGif.q', v), a: t('quality.toGif.a', v) };
  }

  if (f && tv && f.codec === 'lossy' && tv.codec === 'lossless') {
    const clause = f.family === 'audio'
      ? t('quality.lossyToLossless.edit.audio', v)
      : t('quality.lossyToLossless.edit.image', v);
    return { q: t('quality.lossyToLossless.q', v), a: t('quality.lossyToLossless.a', { fn, tn, clause }) };
  }

  if (f && tv && (f.codec === 'lossless' || f.codec === 'vector') && tv.codec === 'lossy') {
    const key = f.family === 'audio' ? 'quality.losslessToLossy.a.audio' : 'quality.losslessToLossy.a.visual';
    return { q: t('quality.losslessToLossy.q', v), a: t(key, v) };
  }

  if (f && tv && f.codec === 'lossy' && tv.codec === 'lossy') {
    const key = f.family === 'audio' ? 'quality.lossyToLossy.a.audio' : 'quality.lossyToLossy.a.visual';
    return { q: t('quality.lossyToLossy.q', v), a: t(key, v) };
  }

  if (f && tv && f.codec === 'lossless' && tv.codec === 'lossless') {
    const unit = f.family === 'audio' ? t('unit.sample', v) : t('unit.pixel', v);
    const key = f.uncompressed || f.name === 'BMP'
      ? 'quality.losslessToLossless.a.bulky'
      : 'quality.losslessToLossless.a.plain';
    return { q: t('quality.losslessToLossless.q', v), a: t(key, { fn, tn, unit }) };
  }

  return { q: t('quality.fallback.q', v), a: t('quality.fallback.a', v) };
}

// ── FAQ 3: a second format-specific question where one applies ───────
function relationFaq(t, f, tv, fn, tn) {
  if (!f || !tv) return null;
  const v = { fn, tn };

  if (tv.uncompressed) return { q: t('relation.uncompressed.q', v), a: t('relation.uncompressed.a', v) };

  if (f.family === 'video' && tv.family === 'audio') {
    return { q: t('relation.extractAudio.q', v), a: t('relation.extractAudio.a', v) };
  }

  if (f.family === 'video' && tv.family === 'video') {
    const key = tn === 'MP4' ? 'relation.videoContainer.a.mp4' : 'relation.videoContainer.a.other';
    return { q: t('relation.videoContainer.q', v), a: t(key, { fn, tn, note: tv.noteText || '' }) };
  }

  if (f.family === 'image' && tv.family === 'image') {
    if (f.alpha && !tv.alpha) return { q: t('relation.alphaLost.q', v), a: t('relation.alphaLost.a', v) };
    if (!f.alpha && tv.alpha) return { q: t('relation.alphaGained.q', v), a: t('relation.alphaGained.a', v) };
  }

  if (tv.reflow && !f.reflow) {
    const key = tn === 'EPUB' ? 'relation.reflow.a.epub' : 'relation.reflow.a.kindle';
    return { q: t('relation.reflow.q', v), a: t(key, v) };
  }

  return null;
}

// ── Steps ────────────────────────────────────────────────────────────
const ACTION_STEP_SHAPES = [
  'pdf-merge', 'pdf-split', 'pdf-compress', 'pdf-rotate', 'pdf-protect',
  'pdf-unlock', 'metadata', 'ocr', 'tts', 'stt', 'subtitle', 'soon',
];

function buildSteps(t, shape, tool, fn, tn, family, isSmart, inputs, categoryNoun) {
  const stepShape = shape === 'pdf-compress-ai' ? 'pdf-compress' : shape;
  if (ACTION_STEP_SHAPES.indexOf(stepShape) !== -1) {
    return [1, 2, 3].map((n) => t('steps.' + stepShape + '.' + n, { fn, tn }));
  }
  if (shape === 'compress') {
    const key = fn === 'GIF' ? 'steps.compress.1.gif' : 'steps.compress.1';
    return [t(key, { fn }), t('steps.compress.2', { fn }), t('steps.compress.3', { fn })];
  }

  const isHub = shape.indexOf('hub') === 0;
  const batch = isSmart ? 'single' : 'batch';
  const multiOut = (tool.outputFormats || []).length > 1;
  const media = family === 'image' || family === 'video' || family === 'audio';
  const variant = (multiOut ? 'dropdown' : 'direct') + (media ? 'Media' : '');

  if (isHub) {
    return [
      t('steps.hub.1.' + batch, { inputs, category: categoryNoun }),
      t('steps.hub.2.' + variant, {}),
      t('steps.hub.3', {}),
    ];
  }
  return [
    t('steps.convert.1.' + batch, { fn }),
    t('steps.convert.2.' + variant, { tn }),
    t('steps.convert.3', { tn }),
  ];
}

// ── Intro ────────────────────────────────────────────────────────────
const LEAD_SHAPES = [
  'pdf-merge', 'pdf-split', 'pdf-compress', 'pdf-compress-ai', 'pdf-rotate',
  'pdf-protect', 'pdf-unlock', 'metadata', 'ocr', 'tts', 'stt', 'subtitle',
];

function buildIntro(t, shape, tool, f, tv, fn, tn, reason, inputs, outputs, categoryNoun) {
  if (shape === 'hub') return t('intro.hub', { category: categoryNoun, inputs, outputs, reason });
  if (shape === 'hub-extract') return t('intro.hubExtract', { inputs, outputs, reason });
  if (shape === 'hub-gif') return t('intro.hubGif', { inputs, gifAbout: t('intro.hubGif.gifAbout'), reason });
  if (shape === 'compress') {
    const extra = f && f.codec === 'lossless' && fn !== 'GIF' ? t('intro.compress.lossless', { fn }) : '';
    return t('intro.compress', { fn, about: (f && f.aboutText) || '', reason, extra });
  }
  if (shape === 'soon') return t('intro.soon', { reason });
  if (LEAD_SHAPES.indexOf(shape) !== -1) {
    return t('intro.lead', { lead: t('intro.lead.' + shape, { fn, tn }), reason });
  }
  return t('intro.convert', {
    fromAbout: (f && f.aboutText) || t('intro.convert.noSource', { fn }),
    toAbout: (tv && tv.aboutText) || '',
    reason,
    toNote: (tv && tv.noteText) || '',
  });
}

// ── Shape-specific replacements for FAQ questions 2 and 3 ────────────
const SHAPE_FAQ_SHAPES = [
  'pdf-merge', 'pdf-split', 'pdf-compress', 'pdf-compress-ai', 'pdf-rotate',
  'pdf-protect', 'pdf-unlock', 'metadata', 'ocr', 'tts', 'stt', 'subtitle',
  'soon', 'compress', 'hub', 'hub-extract', 'hub-gif',
];

function shapeFaq(t, shape, fn, inputs, outputs) {
  if (SHAPE_FAQ_SHAPES.indexOf(shape) === -1) return null;
  if (shape === 'compress') {
    const alpha = fn === 'PNG' || fn === 'GIF' ? t('shapeFaq.compress.alpha', { fn }) : '';
    const source = fn === 'PNG' ? t('shapeFaq.compress.source.png', { fn })
      : fn === 'GIF' ? t('shapeFaq.compress.source.gif', { fn })
        : t('shapeFaq.compress.source.other', { fn });
    return [
      { q: t('shapeFaq.compress.q1', { fn }), a: t('shapeFaq.compress.a1', { fn, alpha, source }) },
      { q: t('shapeFaq.compress.q2', { fn }), a: t('shapeFaq.compress.a2', { fn }) },
    ];
  }
  const v = { fn, inputs, outputs };
  return [
    { q: t('shapeFaq.' + shape + '.q1', v), a: t('shapeFaq.' + shape + '.a1', v) },
    { q: t('shapeFaq.' + shape + '.q2', v), a: t('shapeFaq.' + shape + '.a2', v) },
  ];
}

// ── Main entry point ─────────────────────────────────────────────────
export function buildToolContent(tool, pack, fallbackPack) {
  if (!tool || !pack) return null;

  const t = makeT(pack, fallbackPack);
  const prose = (ext) => (pack.formats && pack.formats[ext]) ||
    (fallbackPack && fallbackPack.formats && fallbackPack.formats[ext]) || null;

  const shape = SHAPES[tool.slug] || 'convert';
  const fromKey = (tool.inputFormats || [])[0];
  const toKey = (tool.outputFormats || [])[0];

  // Merge the structural facts with this language's prose for the two formats
  // that actually drive the page.
  const withProse = (key) => {
    const base = fmt(key);
    if (!base) return null;
    const p = prose(key) || {};
    return { ...base, aboutText: p.about || '', noteText: p.note || '' };
  };
  const f = withProse(fromKey);
  const tv = withProse(toKey);

  // Headings reuse the tool's own label when it reads "X to Y" so they match
  // the page title.
  const labelMatch = /^(.+?) to (.+)$/.exec(tool.label || '');
  const isPair = shape === 'convert' && !!labelMatch;
  const from = labelMatch ? labelMatch[1] : (f ? f.name : '');
  const to = labelMatch ? labelMatch[2] : (tv ? tv.name : '');
  const fn = f ? f.name : from;
  const tn = tv ? tv.name : to;

  const joiner = t('list.and') || 'and';
  const inputs = listNames(tool.inputFormats, joiner);
  const outputs = listNames(tool.outputFormats, joiner);
  const categoryNoun = t('family.' + ((f && f.family) || 'none')) || t('family.none');

  const reason = (pack.reasons && pack.reasons[tool.slug]) ||
    (fallbackPack && fallbackPack.reasons && fallbackPack.reasons[tool.slug]) || '';

  const family = (f && f.family) || (tv && tv.family) || 'document';
  const isSmart = tool.category === 'Smart Functions';

  const clean = (s) => String(s || '').replace(/\s+/g, ' ').trim();

  const intro = clean(buildIntro(t, shape, tool, f, tv, fn, tn, reason, inputs, outputs, categoryNoun));
  const steps = buildSteps(t, shape, tool, fn, tn, family, isSmart, inputs, categoryNoun).map(clean);

  // ── FAQ ──
  const costKey = isSmart
    ? (tool.slug === 'text-to-speech' ? 'faq.cost.a.smartTts' : 'faq.cost.a.smartAv')
    : (isPair ? 'faq.cost.a.pair' : 'faq.cost.a.tool');
  const timeSuffix = isSmart ? t('faq.time.suffix.smart') : t('faq.time.suffix.standard');

  const faq = [
    {
      q: isPair ? t('faq.cost.q.pair', { from, to }) : t('faq.cost.q.tool', { label: tool.label }),
      a: t(costKey, { from, to, label: tool.label }),
    },
    qualityFaq(t, f, tv, fn, tn),
    relationFaq(t, f, tv, fn, tn) || {
      q: t('compatibility.q', { fn, tn }),
      a: t('compatibility.a', {
        fn,
        tn,
        note: (tv && tv.noteText) || t('compatibility.noteFallback', { tn }),
      }),
    },
    {
      q: isPair ? t('faq.time.q.pair', { from, to }) : t('faq.time.q.tool', { label: tool.label }),
      a: t('faq.time.a', { speed: t('faq.time.speed.' + family), suffix: timeSuffix }),
    },
    {
      q: isPair ? t('faq.safety.q.pair', { from }) : t('faq.safety.q.tool'),
      a: isPair ? t('faq.safety.a.pair', { from, to }) : t('faq.safety.a.tool'),
    },
  ];

  const overrides = shapeFaq(t, shape, fn, inputs, outputs);
  if (overrides) {
    if (overrides[0]) faq[1] = overrides[0];
    if (overrides[1]) faq[2] = overrides[1];
  }

  // The two tools that never run a conversion need different cost and timing
  // answers from everything else.
  if (shape === 'metadata') {
    faq[0] = { q: t('faq.cost.q.metadata', { label: tool.label }), a: t('faq.cost.a.metadata') };
    faq[3] = { q: t('faq.time.q.metadata'), a: t('faq.time.a.metadata') };
  }
  if (shape === 'soon') {
    faq[0] = { q: t('faq.cost.q.soon', { label: tool.label }), a: t('faq.cost.a.soon') };
    faq[3] = { q: t('faq.time.q.soon'), a: t('faq.time.a.soon') };
  }

  return {
    pair: isPair,
    from,
    to,
    label: tool.label,
    intro,
    steps,
    faq: faq
      .filter((item) => item && item.q && item.a)
      .map((item) => ({ q: clean(item.q), a: clean(item.a) })),
  };
}

// FAQPage structured data. Built from the same object that renders the visible
// markup, in whatever language that markup is in, so the two cannot diverge.
export function buildFaqJsonLd(content) {
  if (!content || !content.faq || !content.faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
