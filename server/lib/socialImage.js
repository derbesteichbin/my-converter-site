// Social Media image tools, processed locally with sharp:
//   * social-resize    — reframe to a platform aspect ratio (crop or pad)
//   * profile-picture  — square (or round) avatar at a standard size
//   * social-compress  — downsize to the platform's display size and save as
//                        a high-quality JPG, so the platform has no reason to
//                        recompress it heavily on upload
//
// Every option a request may carry is listed here; anything else is
// rejected before a credit is charged. The client mirrors these lists in
// client/src/toolsConfig.js (SOCIAL_OPTIONS).

const sharp = require('sharp');

const OPTIONS = {
  'social-resize': {
    preset: ['9:16', '1:1', '4:5', '16:9'],
    fit: ['cover', 'contain'],
    background: ['blur', 'white', 'black'],
  },
  'profile-picture': {
    shape: ['square', 'circle'],
    size: ['400', '800', '1080'],
  },
  'social-compress': {
    target: ['instagram', 'facebook', 'x'],
  },
};

const DEFAULTS = {
  'social-resize': { preset: '9:16', fit: 'cover', background: 'blur' },
  'profile-picture': { shape: 'square', size: '800' },
  'social-compress': { target: 'instagram' },
};

// Pixel size of each aspect-ratio preset — the sizes the platforms
// themselves recommend for uploads.
const PRESET_SIZE = {
  '9:16': [1080, 1920],
  '1:1': [1080, 1080],
  '4:5': [1080, 1350],
  '16:9': [1920, 1080],
};

// Longest edge each platform displays; anything larger is downscaled (and
// recompressed harder) by the platform itself.
const TARGET_LONG_EDGE = { instagram: 1080, facebook: 2048, x: 4096 };

const COLORS = { white: '#ffffff', black: '#000000' };

// Pick the tool's options out of a request body. Returns { options } or
// { error } with a code the client translates.
function parseOptions(toolType, body) {
  const allowed = OPTIONS[toolType];
  if (!allowed) return { error: 'social_bad_tool' };
  const options = { ...DEFAULTS[toolType] };
  for (const [key, values] of Object.entries(allowed)) {
    const v = body[key];
    if (v === undefined || v === '') continue;
    if (!values.includes(String(v))) return { error: 'social_bad_option' };
    options[key] = String(v);
  }
  return { options };
}

function encode(pipeline, format) {
  if (format === 'png') return pipeline.png({ compressionLevel: 9 });
  if (format === 'webp') return pipeline.webp({ quality: 88 });
  // Progressive, 4:4:4 chroma: the settings that survive a platform's own
  // re-encode best.
  return pipeline.jpeg({ quality: 88, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4' });
}

// failOn 'error' rejects truncated/corrupt files instead of returning a
// half-grey image; rotate() applies EXIF orientation from phone cameras.
const load = (input) => sharp(input, { failOn: 'error' }).rotate();

// The user's chosen crop for Resize ("crop to fill"): the centre of the
// frame as fractions of the displayed image, { x, y } in 0..1. Both or
// neither must be sent. Returns { focus } (null = automatic) or { error }.
function parseFocus(body) {
  const has = (v) => v !== undefined && v !== '';
  if (!has(body.cropX) && !has(body.cropY)) return { focus: null };
  const x = Number(body.cropX);
  const y = Number(body.cropY);
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 1 || y < 0 || y > 1) {
    return { error: 'social_bad_option' };
  }
  return { focus: { x, y } };
}

// The largest rectangle of the target aspect ratio that fits the image,
// centred on the focus point and pushed back inside the edges. The page
// draws its crop frame with the same rule, so what the user framed is what
// they get. width/height are the image's displayed (EXIF-rotated) size.
function cropRect(width, height, targetW, targetH, focus) {
  const ratio = targetW / targetH;
  let w = width;
  let h = Math.round(width / ratio);
  if (h > height) {
    h = height;
    w = Math.round(height * ratio);
  }
  const clamp = (v, max) => Math.min(Math.max(v, 0), max);
  const left = clamp(Math.round(focus.x * width - w / 2), width - w);
  const top = clamp(Math.round(focus.y * height - h / 2), height - h);
  return { left, top, width: w, height: h };
}

async function socialResize(input, output, { preset, fit, background }, format, focus = null) {
  const [width, height] = PRESET_SIZE[preset];

  if (fit === 'cover' && focus) {
    // EXIF orientations 5–8 are rotated by 90°, so the displayed width and
    // height are the stored ones swapped.
    const meta = await sharp(input).metadata();
    const turned = (meta.orientation || 1) >= 5;
    const rect = cropRect(turned ? meta.height : meta.width, turned ? meta.width : meta.height, width, height, focus);
    await encode(
      sharp(input, { failOn: 'error' }).autoOrient().extract(rect).resize(width, height, { fit: 'cover' }).flatten({ background: '#ffffff' }),
      format
    ).toFile(output);
    return;
  }

  if (fit === 'cover') {
    // Crop towards the most interesting region rather than dead centre.
    await encode(
      load(input).resize(width, height, { fit: 'cover', position: sharp.strategy.attention }).flatten({ background: '#ffffff' }),
      format
    ).toFile(output);
    return;
  }

  // Fit: the whole picture, centred, on a background filling the frame.
  const fg = await load(input)
    .resize(width, height, { fit: 'inside' })
    .flatten({ background: background === 'black' ? '#000000' : '#ffffff' })
    .toBuffer({ resolveWithObject: true });

  let base;
  if (background === 'blur') {
    // The same picture, scaled to fill and heavily blurred — the familiar
    // "blurred bars" look, which reads better on phones than flat colour.
    const blurred = await load(input)
      .resize(width, height, { fit: 'cover' })
      .flatten({ background: '#000000' })
      .blur(40)
      .modulate({ brightness: 0.85 })
      .toBuffer();
    base = sharp(blurred);
  } else {
    base = sharp({ create: { width, height, channels: 3, background: COLORS[background] } });
  }

  const left = Math.round((width - fg.info.width) / 2);
  const top = Math.round((height - fg.info.height) / 2);
  await encode(base.composite([{ input: fg.data, left, top }]).removeAlpha(), format).toFile(output);
}

async function profilePicture(input, output, { shape, size }, format) {
  const px = Number(size);
  const square = load(input).resize(px, px, { fit: 'cover', position: sharp.strategy.attention });

  if (shape === 'square') {
    await encode(square.flatten({ background: '#ffffff' }), format).toFile(output);
    return;
  }

  // Circle: cut the square with a round mask. Needs an alpha channel, so a
  // round avatar is always PNG (enforced in resolveFormat).
  const mask = Buffer.from(`<svg width="${px}" height="${px}"><circle cx="${px / 2}" cy="${px / 2}" r="${px / 2}"/></svg>`);
  await square.ensureAlpha().composite([{ input: mask, blend: 'dest-in' }]).png({ compressionLevel: 9 }).toFile(output);
}

async function socialCompress(input, output, { target }) {
  const edge = TARGET_LONG_EDGE[target];
  await encode(
    load(input)
      .resize(edge, edge, { fit: 'inside', withoutEnlargement: true })
      // Platforms assume sRGB; a wide-gamut (e.g. Display P3) photo shown
      // without conversion looks washed out.
      .toColourspace('srgb')
      .flatten({ background: '#ffffff' }),
    'jpg'
  ).toFile(output);
}

// Some option combinations dictate the output format. Returns the format to
// actually write.
function resolveFormat(toolType, options, requested) {
  if (toolType === 'profile-picture' && options.shape === 'circle') return 'png';
  if (toolType === 'social-compress') return 'jpg';
  return requested;
}

async function runSocialImage(toolType, input, output, options, format, focus = null) {
  if (toolType === 'social-resize') return socialResize(input, output, options, format, focus);
  if (toolType === 'profile-picture') return profilePicture(input, output, options, format);
  if (toolType === 'social-compress') return socialCompress(input, output, options);
  throw new Error(`Unknown social image tool: ${toolType}`);
}

module.exports = { OPTIONS, parseOptions, parseFocus, cropRect, resolveFormat, runSocialImage, PRESET_SIZE };
