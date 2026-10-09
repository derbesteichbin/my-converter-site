// Read a video's duration from its container header, without decoding it
// and without ffprobe — enough to enforce a length cap before charging.
//
// MP4, MOV, M4V and 3GP are all ISO base media files: the duration sits in
// the `mvhd` box inside `moov`, which may come before or after the media
// data, so we walk box headers and seek rather than read the whole file.
// WebM is Matroska; music-metadata reads its duration reliably.
//
// Returns seconds, or null when the duration cannot be determined — callers
// treat that as "unreadable" rather than guessing.

const fs = require('fs');

const ISO_BMFF = new Set(['mp4', 'mov', 'm4v', '3gp', 'm4a']);

async function readAt(fd, position, length) {
  const buf = Buffer.alloc(length);
  const { bytesRead } = await fd.read(buf, 0, length, position);
  return bytesRead === length ? buf : null;
}

// Walk the boxes in [start, end) and return { start, end } of the first box
// of `type`, or null.
async function findBox(fd, start, end, type) {
  let pos = start;
  while (pos + 8 <= end) {
    const head = await readAt(fd, pos, 16);
    if (!head) return null;
    let size = head.readUInt32BE(0);
    const boxType = head.toString('latin1', 4, 8);
    let headerLen = 8;
    if (size === 1) {
      size = Number(head.readBigUInt64BE(8));
      headerLen = 16;
    } else if (size === 0) {
      size = end - pos; // box runs to the end of its parent
    }
    if (size < headerLen) return null; // corrupt
    if (boxType === type) return { start: pos + headerLen, end: pos + size };
    pos += size;
  }
  return null;
}

async function isoDuration(filePath) {
  const fd = await fs.promises.open(filePath, 'r');
  try {
    const { size } = await fd.stat();
    const moov = await findBox(fd, 0, size, 'moov');
    if (!moov) return null;
    const mvhd = await findBox(fd, moov.start, moov.end, 'mvhd');
    if (!mvhd) return null;
    const body = await readAt(fd, mvhd.start, 32);
    if (!body) return null;
    const version = body[0];
    // version 0: 4-byte times; version 1: 8-byte times.
    const timescale = version === 1 ? body.readUInt32BE(20) : body.readUInt32BE(12);
    const duration = version === 1 ? Number(body.readBigUInt64BE(24)) : body.readUInt32BE(16);
    if (!timescale || !duration) return null;
    return duration / timescale;
  } finally {
    await fd.close();
  }
}

async function webmDuration(filePath) {
  const mm = require('music-metadata');
  const meta = await mm.parseFile(filePath, { duration: true, skipCovers: true });
  return meta.format.duration || null;
}

async function videoDuration(filePath, ext) {
  try {
    if (ISO_BMFF.has(ext)) return await isoDuration(filePath);
    if (ext === 'webm') return await webmDuration(filePath);
    return null;
  } catch {
    return null;
  }
}

// Any audio or video file the Smart Functions accept: ISO media via the
// mvhd box, everything else (MP3, WAV, OGG, FLAC, WebM, …) via
// music-metadata. Same contract: seconds, or null when unknown — notably for
// browser microphone recordings, whose WebM header carries no duration.
async function mediaDuration(filePath, ext) {
  try {
    if (ISO_BMFF.has(ext)) return await isoDuration(filePath);
    const mm = require('music-metadata');
    const meta = await mm.parseFile(filePath, { duration: true, skipCovers: true });
    return meta.format.duration || null;
  } catch {
    return null;
  }
}

module.exports = { videoDuration, mediaDuration };
