// ── Minimal dependency-free PNG decode/encode ────────────────────────
//
// The project has no image toolchain (no sharp, no ImageMagick), and the icon
// generation is a one-off build step, so this implements just enough of the
// PNG spec to read the source logo and write resized icons. Node's zlib does
// the deflate work; everything else is the spec's scanline filtering.
//
// Supported on read: 8-bit, non-interlaced, colour types 0/2/4/6.
// Always written as: 8-bit RGBA (colour type 6), non-interlaced.

import zlib from 'node:zlib';

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CHANNELS = { 0: 1, 2: 3, 4: 2, 6: 4 };

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// Reverse the per-scanline filter the encoder applied. Operates in place on a
// buffer laid out as [filterByte, ...rowBytes] repeated `height` times.
function unfilter(raw, width, height, bpp) {
  const stride = width * bpp;
  const out = Buffer.alloc(stride * height);
  let pos = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const row = pos;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    raw.copy(cur, 0, row, row + stride);
    pos += stride;
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;

    switch (filter) {
      case 0:
        break;
      case 1:
        for (let i = bpp; i < stride; i++) cur[i] = (cur[i] + cur[i - bpp]) & 0xff;
        break;
      case 2:
        if (prev) for (let i = 0; i < stride; i++) cur[i] = (cur[i] + prev[i]) & 0xff;
        break;
      case 3:
        for (let i = 0; i < stride; i++) {
          const a = i >= bpp ? cur[i - bpp] : 0;
          const b = prev ? prev[i] : 0;
          cur[i] = (cur[i] + ((a + b) >> 1)) & 0xff;
        }
        break;
      case 4:
        for (let i = 0; i < stride; i++) {
          const a = i >= bpp ? cur[i - bpp] : 0;
          const b = prev ? prev[i] : 0;
          const c = prev && i >= bpp ? prev[i - bpp] : 0;
          cur[i] = (cur[i] + paeth(a, b, c)) & 0xff;
        }
        break;
      default:
        throw new Error(`Unsupported PNG filter type ${filter} on row ${y}`);
    }
  }
  return out;
}

// Returns { width, height, data } where data is RGBA, 4 bytes per pixel.
export function decodePng(buf) {
  if (!buf.subarray(0, 8).equals(PNG_SIG)) throw new Error('Not a PNG file');

  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat = [];
  let palette = null;
  let trns = null;

  let pos = 8;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const body = buf.subarray(pos + 8, pos + 8 + len);
    pos += 12 + len; // length + type + data + crc

    if (type === 'IHDR') {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      bitDepth = body[8];
      colorType = body[9];
      interlace = body[12];
    } else if (type === 'PLTE') {
      palette = Buffer.from(body);
    } else if (type === 'tRNS') {
      trns = Buffer.from(body);
    } else if (type === 'IDAT') {
      idat.push(Buffer.from(body));
    } else if (type === 'IEND') {
      break;
    }
  }

  if (bitDepth !== 8) throw new Error(`Only 8-bit PNGs are supported (got ${bitDepth})`);
  if (interlace !== 0) throw new Error('Interlaced PNGs are not supported');

  const raw = zlib.inflateSync(Buffer.concat(idat));

  // Indexed colour is expanded to RGBA up front so the rest of the pipeline
  // only ever deals with direct colour.
  if (colorType === 3) {
    if (!palette) throw new Error('Indexed PNG without a palette');
    const px = unfilter(raw, width, height, 1);
    const data = Buffer.alloc(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      const idx = px[i];
      data[i * 4] = palette[idx * 3];
      data[i * 4 + 1] = palette[idx * 3 + 1];
      data[i * 4 + 2] = palette[idx * 3 + 2];
      data[i * 4 + 3] = trns && idx < trns.length ? trns[idx] : 255;
    }
    return { width, height, data };
  }

  const ch = CHANNELS[colorType];
  if (!ch) throw new Error(`Unsupported PNG colour type ${colorType}`);
  const px = unfilter(raw, width, height, ch);

  const data = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * ch;
    const d = i * 4;
    if (colorType === 0) {
      data[d] = data[d + 1] = data[d + 2] = px[s];
      data[d + 3] = 255;
    } else if (colorType === 4) {
      data[d] = data[d + 1] = data[d + 2] = px[s];
      data[d + 3] = px[s + 1];
    } else if (colorType === 2) {
      data[d] = px[s];
      data[d + 1] = px[s + 1];
      data[d + 2] = px[s + 2];
      data[d + 3] = 255;
    } else {
      data[d] = px[s];
      data[d + 1] = px[s + 1];
      data[d + 2] = px[s + 2];
      data[d + 3] = px[s + 3];
    }
  }
  return { width, height, data };
}

// Box/area resample. Alpha is premultiplied while averaging so semi-transparent
// edges do not pull the colour of fully transparent pixels into the result
// (which is what produces dark halos around a logo).
export function resize(src, targetW, targetH) {
  const { width: sw, height: sh, data: sd } = src;
  const out = Buffer.alloc(targetW * targetH * 4);
  const xRatio = sw / targetW;
  const yRatio = sh / targetH;

  for (let y = 0; y < targetH; y++) {
    const y0 = Math.floor(y * yRatio);
    const y1 = Math.max(y0 + 1, Math.ceil((y + 1) * yRatio));
    for (let x = 0; x < targetW; x++) {
      const x0 = Math.floor(x * xRatio);
      const x1 = Math.max(x0 + 1, Math.ceil((x + 1) * xRatio));

      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = y0; sy < y1 && sy < sh; sy++) {
        for (let sx = x0; sx < x1 && sx < sw; sx++) {
          const i = (sy * sw + sx) * 4;
          const alpha = sd[i + 3];
          r += sd[i] * alpha;
          g += sd[i + 1] * alpha;
          b += sd[i + 2] * alpha;
          a += alpha;
          n++;
        }
      }

      const d = (y * targetW + x) * 4;
      if (a === 0) {
        out[d] = out[d + 1] = out[d + 2] = out[d + 3] = 0;
      } else {
        out[d] = Math.round(r / a);
        out[d + 1] = Math.round(g / a);
        out[d + 2] = Math.round(b / a);
        out[d + 3] = Math.round(a / n);
      }
    }
  }
  return { width: targetW, height: targetH, data: out };
}

export function solid(width, height, [r, g, b, a = 255]) {
  const data = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    data[i * 4] = r;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = a;
  }
  return { width, height, data };
}

// Source-over composite of `src` onto `dst` at (dx, dy). Mutates dst.
export function composite(dst, src, dx, dy) {
  for (let y = 0; y < src.height; y++) {
    const ty = dy + y;
    if (ty < 0 || ty >= dst.height) continue;
    for (let x = 0; x < src.width; x++) {
      const tx = dx + x;
      if (tx < 0 || tx >= dst.width) continue;
      const s = (y * src.width + x) * 4;
      const d = (ty * dst.width + tx) * 4;
      const sa = src.data[s + 3] / 255;
      if (sa === 0) continue;
      const da = dst.data[d + 3] / 255;
      const oa = sa + da * (1 - sa);
      for (let c = 0; c < 3; c++) {
        dst.data[d + c] = Math.round(
          (src.data[s + c] * sa + dst.data[d + c] * da * (1 - sa)) / oa
        );
      }
      dst.data[d + 3] = Math.round(oa * 255);
    }
  }
  return dst;
}

// Drop the alpha channel by compositing onto an opaque background. iOS ignores
// PNG transparency on home-screen icons and fills it with black, so the
// apple-touch-icon has to be flattened deliberately rather than left to chance.
export function flatten(img, bg) {
  const out = solid(img.width, img.height, bg);
  return composite(out, img, 0, 0);
}

function crc32(buf) {
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c;
    }
    return t;
  })());
  c = -1;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// Try every filter per scanline and keep the one with the smallest sum of
// absolute differences — the standard heuristic, and the difference between a
// ~90 KB and a ~300 KB 512px icon.
function filterScanlines(img) {
  const bpp = 4;
  const stride = img.width * bpp;
  const out = Buffer.alloc((stride + 1) * img.height);
  const cand = Buffer.alloc(stride);
  let pos = 0;

  for (let y = 0; y < img.height; y++) {
    const cur = img.data.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? img.data.subarray((y - 1) * stride, y * stride) : null;
    let bestType = 0;
    let bestScore = Infinity;
    let best = null;

    for (let type = 0; type <= 4; type++) {
      let score = 0;
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? cur[i - bpp] : 0;
        const b = prev ? prev[i] : 0;
        const c = prev && i >= bpp ? prev[i - bpp] : 0;
        let v;
        if (type === 0) v = cur[i];
        else if (type === 1) v = cur[i] - a;
        else if (type === 2) v = cur[i] - b;
        else if (type === 3) v = cur[i] - ((a + b) >> 1);
        else v = cur[i] - paeth(a, b, c);
        v &= 0xff;
        cand[i] = v;
        score += v < 128 ? v : 256 - v;
      }
      if (score < bestScore) {
        bestScore = score;
        bestType = type;
        best = Buffer.from(cand);
      }
    }

    out[pos++] = bestType;
    best.copy(out, pos);
    pos += stride;
  }
  return out;
}

export function encodePng(img) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.width, 0);
  ihdr.writeUInt32BE(img.height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const idat = zlib.deflateSync(filterScanlines(img), { level: 9 });

  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
