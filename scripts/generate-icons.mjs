#!/usr/bin/env node
// ── PWA icon generation ──────────────────────────────────────────────
//
//   node scripts/generate-icons.mjs
//
// Regenerates every icon in client/public/icons/ from the source logo. Run it
// whenever the logo changes; the outputs are committed so a normal build needs
// no image toolchain.
//
// The source logo is a 2048x2048 RGBA PNG whose artwork is a wide two-ring
// mark occupying only the middle ~25% of the canvas, so every icon is built by
// cropping to the artwork's real bounding box and re-centring it on the brand
// background. Scaling the raw file instead would leave the mark small and
// off-centre inside a sea of transparency.

import fs from 'node:fs';
import path from 'node:path';
import { decodePng, encodePng, resize, solid, composite, flatten } from './lib/png.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'client', 'public', 'images', 'logo-light.png');
const OUT_DIR = path.join(ROOT, 'client', 'public', 'icons');

// Brand background, matching manifest background_color / theme_color.
const BG = [0x0a, 0x0a, 0x0a, 255];

// Crop transparent padding so the artwork's true extent is known.
function trim(img, threshold = 16) {
  let minX = img.width, minY = img.height, maxX = -1, maxY = -1;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      if (img.data[(y * img.width + x) * 4 + 3] > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error('Source image is fully transparent');
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const data = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    img.data.copy(data, y * w * 4, ((minY + y) * img.width + minX) * 4, ((minY + y) * img.width + minX + w) * 4);
  }
  return { width: w, height: h, data };
}

// Fit `art` inside `size` so its longest edge spans `coverage` of the canvas,
// centred on the brand background.
function build(art, size, coverage) {
  const scale = (size * coverage) / Math.max(art.width, art.height);
  const w = Math.max(1, Math.round(art.width * scale));
  const h = Math.max(1, Math.round(art.height * scale));
  const scaled = resize(art, w, h);
  const canvas = solid(size, size, BG);
  return composite(canvas, scaled, Math.round((size - w) / 2), Math.round((size - h) / 2));
}

const source = decodePng(fs.readFileSync(SRC));
const art = trim(source);
console.log(`source ${source.width}x${source.height} -> artwork ${art.width}x${art.height}`);

// coverage notes:
//  any        0.84 — normal launcher icon, a little breathing room
//  maskable   0.62 — Android crops maskable icons to a shape inscribed in the
//                    middle 80%. A 1.67:1 mark only stays inside that circle if
//                    its diagonal does, which caps the long edge near 0.68.
//                    0.62 leaves margin for aggressive launcher shapes.
//  apple      0.74 — iOS applies its own squircle mask and drops the corners
//  favicon    0.92 — tiny, needs to fill the space to stay legible
const TARGETS = [
  { file: 'icon-192.png', size: 192, coverage: 0.84 },
  { file: 'icon-512.png', size: 512, coverage: 0.84 },
  { file: 'icon-maskable-192.png', size: 192, coverage: 0.62 },
  { file: 'icon-maskable-512.png', size: 512, coverage: 0.62 },
  // iOS ignores PNG alpha on home-screen icons and composites onto black, so
  // this one is flattened explicitly to guarantee the intended background.
  { file: 'apple-touch-icon.png', size: 180, coverage: 0.74, opaque: true },
  { file: 'favicon-32.png', size: 32, coverage: 0.92 },
  { file: 'favicon-16.png', size: 16, coverage: 0.92 },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const { file, size, coverage, opaque } of TARGETS) {
  let img = build(art, size, coverage);
  if (opaque) img = flatten(img, BG);
  const buf = encodePng(img);
  fs.writeFileSync(path.join(OUT_DIR, file), buf);
  console.log(`  ${file.padEnd(24)} ${String(size).padStart(3)}px  ${(buf.length / 1024).toFixed(1)} kB`);
}

console.log(`\nWrote ${TARGETS.length} icons to client/public/icons/`);
