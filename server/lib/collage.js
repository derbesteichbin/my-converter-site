// Photo Collage: arrange several images in one grid image with sharp.
//
// Runs locally rather than through CloudConvert — there is no collage
// operation there, and composing a grid is cheap enough to do in-process.

const sharp = require('sharp');

// Layouts the UI offers. `max` is how many photos fit; `auto` picks the
// smallest near-square grid that holds every photo.
const LAYOUTS = {
  auto: { max: 16 },
  '2x2': { cols: 2, rows: 2, max: 4 },
  '3x3': { cols: 3, rows: 3, max: 9 },
};
const FITS = ['cover', 'contain'];
const MIN_PHOTOS = 2;

// Target width of the finished collage. Comfortably above the 1080px most
// social platforms display, without producing huge files.
const CANVAS_WIDTH = 2160;
const GAP = 12;
const BACKGROUND = { r: 255, g: 255, b: 255 };

function gridFor(layout, count) {
  const def = LAYOUTS[layout];
  if (def.cols) return { cols: def.cols, rows: def.rows };
  const cols = Math.ceil(Math.sqrt(count));
  return { cols, rows: Math.ceil(count / cols) };
}

// Returns null when the request is acceptable, otherwise an error code the
// client can translate.
function validateCollage({ layout, fit, count }) {
  if (!LAYOUTS[layout]) return 'collage_bad_layout';
  if (!FITS.includes(fit)) return 'collage_bad_fit';
  if (count < MIN_PHOTOS) return 'collage_too_few';
  if (count > LAYOUTS[layout].max) return 'collage_too_many';
  return null;
}

async function buildCollage(inputPaths, { layout, fit, format }, outputPath) {
  const { cols, rows } = gridFor(layout, inputPaths.length);
  const cell = Math.floor((CANVAS_WIDTH - GAP * (cols + 1)) / cols);
  const width = cols * cell + GAP * (cols + 1);
  const height = rows * cell + GAP * (rows + 1);

  // Sequential, not Promise.all: each decode can be large, and a 16-photo
  // collage in parallel would hold every full-size bitmap at once.
  const tiles = [];
  for (let i = 0; i < inputPaths.length; i++) {
    const input = await sharp(inputPaths[i], { failOn: 'error' })
      .rotate() // honour EXIF orientation from phone cameras
      .resize(cell, cell, {
        fit,
        // Crop towards the interesting part of the photo; strategies are
        // only valid for cover, so "fit whole photo" just centres it.
        position: fit === 'cover' ? sharp.strategy.attention : 'centre',
        background: BACKGROUND,
      })
      .flatten({ background: BACKGROUND })
      .toBuffer();
    const col = i % cols;
    const row = Math.floor(i / cols);
    tiles.push({ input, left: GAP + col * (cell + GAP), top: GAP + row * (cell + GAP) });
  }

  let canvas = sharp({
    create: { width, height, channels: 3, background: BACKGROUND },
  }).composite(tiles);
  canvas = format === 'png' ? canvas.png({ compressionLevel: 9 }) : canvas.jpeg({ quality: 90, mozjpeg: true });
  await canvas.toFile(outputPath);
  return { width, height };
}

module.exports = { LAYOUTS, FITS, MIN_PHOTOS, validateCollage, buildCollage };
