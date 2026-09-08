#!/usr/bin/env node
// ── Navbar logo variants ─────────────────────────────────────────────
//
//   node scripts/generate-logos.mjs
//
// Produces small display-sized copies of the two navbar logos. Shares
// scripts/lib/png.mjs with generate-icons.mjs so no image toolchain is needed;
// run either script after changing a logo and commit the output.
//
// Unlike the app icons, these are a straight proportional resize of the whole
// 2048x2048 canvas — the artwork is NOT cropped or re-centred. The navbar uses
// `object-fit: contain` inside a square box, so the transparent padding around
// the mark is load-bearing: removing it would make the logo jump in size and
// position. The point here is purely bytes, not composition.
//
// Alpha is preserved as-is. logo-light.png is RGBA with a transparent
// background and stays that way; logo-dark.png is fully opaque with a
// near-black background baked in, and is left opaque so it renders exactly as
// it does today.

import fs from 'node:fs';
import path from 'node:path';
import { decodePng, encodePng, resize } from './lib/png.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const IMG_DIR = path.join(ROOT, 'client', 'public', 'images');

// The navbar renders the logo at 44px on desktop and 32px on mobile, so 128px
// covers even a 3x display and 64px covers 1x. Anything larger is wasted.
const SIZES = [64, 128];
const SOURCES = ['logo-light', 'logo-dark'];

let totalBefore = 0;
let totalAfter = 0;

for (const name of SOURCES) {
  const srcPath = path.join(IMG_DIR, `${name}.png`);
  const srcBytes = fs.statSync(srcPath).size;
  totalBefore += srcBytes;

  const img = decodePng(fs.readFileSync(srcPath));
  console.log(`${name}.png  ${img.width}x${img.height}  ${(srcBytes / 1024 / 1024).toFixed(2)} MB`);

  for (const size of SIZES) {
    const out = encodePng(resize(img, size, size));
    const outPath = path.join(IMG_DIR, `${name}-${size}.png`);
    fs.writeFileSync(outPath, out);
    totalAfter += out.length;
    const saving = (100 * (1 - out.length / srcBytes)).toFixed(2);
    console.log(`  -> ${name}-${size}.png`.padEnd(32) + `${String(size).padStart(3)}px  ${(out.length / 1024).toFixed(1)} kB  (-${saving}%)`);
  }
}

console.log(
  `\nOriginals ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> variants ${(totalAfter / 1024).toFixed(1)} kB total`
);
