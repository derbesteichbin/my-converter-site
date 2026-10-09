// Smart Functions — OpenAI-powered tools.
//
// Three endpoints, all dispatched via POST /api/smart with `toolSlug`:
//   - text-to-speech: TTS-1, accepts {text} JSON or .txt file upload, returns
//     MP3/OPUS/AAC at chosen speed. Cost: 1 credit per 1000 chars (round up).
//   - speech-to-text: Whisper-1, accepts audio file (max 25 MB), returns TXT
//     or DOCX (DOCX produced by chaining CloudConvert TXT→DOCX). Cost: 1
//     credit per started 5 minutes of audio.
//   - auto-subtitle: Whisper-1 transcription of a video (max 500 MB), output
//     as one of three `subtitleMode`s, priced per started 5 minutes:
//       file  — SRT/VTT subtitle file only          1 credit,  max 30 min
//       soft  — MP4 with a switchable subtitle track 2 credits, max 10 min
//       burn  — MP4 with subtitles burned in         3 credits, max 10 min
//     The video outputs are made by CloudConvert (convert with
//     subtitles_mode soft/hard). Optional ISO-639-1 language hint.
//
// Pricing runs BEFORE charging, from the length in the file's own header
// (lib/videoDuration.js). Every limit — type, size, length, options — is
// checked before a credit is taken. The one exception is a file whose length
// cannot be read (notably browser microphone recordings, whose WebM header
// has no duration): if it is small enough to go straight to Whisper and only
// text is wanted, the minimum is charged up front and the exact length that
// Whisper reports settles the rest — see settleMeasuredCost(). Video output
// is never produced for a file whose length is unknown.

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const CloudConvert = require('cloudconvert');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');
const { mediaDuration } = require('../lib/videoDuration');
const { logCloudConvertCost } = require('../lib/ccCost');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const OUTPUT_DIR = path.join(__dirname, '..', 'outputs');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${unique}${ext}`);
  },
});

// Whisper's own upload limit, and the cap for TTS/STT files. Subtitle videos
// may be larger: their audio is extracted (and shrunk) by CloudConvert first.
const WHISPER_MAX_BYTES = 25 * 1024 * 1024;
const SUBTITLE_MAX_BYTES = 500 * 1024 * 1024;
const upload = multer({ storage, limits: { fileSize: SUBTITLE_MAX_BYTES } });

const cloudConvert = process.env.CLOUDCONVERT_API_KEY
  ? new CloudConvert(process.env.CLOUDCONVERT_API_KEY)
  : null;

const OPENAI_BASE = 'https://api.openai.com/v1';

const TTS_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
const TTS_FORMATS = ['mp3', 'opus', 'aac'];
const TTS_SPEEDS = [0.75, 1.0, 1.25, 1.5];
const TTS_MAX_CHARS = 4096;

const STT_FORMATS = ['txt', 'docx'];
const SUBTITLE_FORMATS = ['srt', 'vtt'];
const WHISPER_LANGUAGES = ['en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'sv', 'no'];

const WHISPER_NATIVE = new Set(['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm', 'ogg', 'flac']);

// Video containers whose length lib/videoDuration.js can read, so subtitle
// jobs can be priced before charging. Mirrors the client's toolsConfig.
const SUBTITLE_INPUTS = ['mp4', 'mov', 'm4v', '3gp', 'webm'];

// Credits per started 5 minutes, and the longest video accepted, per output.
const SUBTITLE_MODES = {
  file: { rate: 1, maxSeconds: 30 * 60 },
  soft: { rate: 2, maxSeconds: 10 * 60 },
  burn: { rate: 3, maxSeconds: 10 * 60 },
};

// Name of the task that imports the SRT into the CloudConvert job, which the
// convert task's `subtitles` option refers to.
const SUBTITLE_IMPORT_TASK = 'import-subtitles';

const SECONDS_PER_CREDIT = 5 * 60;       // 5 minutes
const CHARS_PER_CREDIT = 1000;

// ── Helpers ──────────────────────────────────────────────────────────

// Delete uploads and intermediates as soon as they are done with, rather
// than leaving them for the 24h sweep. Mirrors discardUploads() in
// convert.js. Output files are NOT touched here — the user still has to
// download those.
function discardUploads(files) {
  for (const file of [].concat(files || [])) {
    if (!file || !file.filename) continue;
    fs.promises.unlink(path.join(UPLOAD_DIR, file.filename)).catch(() => {});
  }
}

// Same, for a bare path (the MP3 extracted from a video container).
function discardPath(filePath) {
  if (!filePath) return;
  fs.promises.unlink(filePath).catch(() => {});
}

function requireOpenAIKey(res) {
  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({ error: 'OpenAI API key is not configured on the server.' });
    return false;
  }
  return true;
}

function newOutputFilename(ext) {
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
}

function fileToBlob(filePath, mime) {
  const buf = fs.readFileSync(filePath);
  return new Blob([buf], { type: mime });
}

const fileExt = (file) => path.extname(file.originalname).replace('.', '').toLowerCase();
const blocksOf = (seconds) => Math.max(1, Math.ceil(seconds / SECONDS_PER_CREDIT));

// Refuse hopeless requests BEFORE multer streams up to 500 MB to disk —
// same advisory check as convert.js; the atomic charge is the real gate.
async function preflightCredits(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { plan: true, credits: true },
    });
    if (!user) return res.status(401).json({ error: 'Not authorized', code: 'unauthorized' });
    if (user.plan !== 'business' && user.credits <= 0) {
      return res.status(429).json({ error: 'You need credits to use this tool.', code: 'no_credits' });
    }
    next();
  } catch (err) {
    console.error('Smart credit preflight error:', err);
    next();
  }
}

// multer's rejections as JSON (unhandled, they became an HTML 500). multer
// has already removed any partial file by the time it reports.
function smartUpload(req, res, next) {
  upload.single('file')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File is larger than 500 MB', code: 'subtitle_too_large' });
    }
    return next(err);
  });
}

// Work out what a request costs, or why it must be refused — all before any
// credit is charged. Returns { error, status } or
// { required, seconds, measured, rate, mode }.
async function priceRequest({ toolSlug, file, body }) {
  if (toolSlug === 'text-to-speech') {
    let len = (body.text || '').length;
    if (!len && file) {
      try {
        len = fs.readFileSync(path.join(UPLOAD_DIR, file.filename), 'utf8').length;
      } catch { len = 0; }
    }
    return { required: Math.max(1, Math.ceil(len / CHARS_PER_CREDIT)), measured: true, rate: 1 };
  }

  if (!file) return { status: 400, error: { error: 'No file uploaded', code: 'smart_no_file' } };
  const ext = fileExt(file);
  const filePath = path.join(UPLOAD_DIR, file.filename);

  if (toolSlug === 'speech-to-text') {
    if (!WHISPER_NATIVE.has(ext)) return { status: 400, error: { error: `Unsupported audio format: ${ext}`, code: 'smart_bad_type' } };
    if (file.size > WHISPER_MAX_BYTES) return { status: 413, error: { error: 'File is larger than 25 MB', code: 'smart_file_too_large' } };
    const seconds = await mediaDuration(filePath, ext);
    // Unknown length (e.g. a microphone recording): charge the minimum now,
    // settle from Whisper's measured length afterwards.
    return { required: seconds === null ? 1 : blocksOf(seconds), seconds, measured: seconds !== null, rate: 1 };
  }

  // auto-subtitle
  if (!SUBTITLE_INPUTS.includes(ext)) {
    return { status: 400, error: { error: `"${file.originalname}" is not a supported video`, code: 'subtitle_bad_type' } };
  }
  const mode = body.subtitleMode || 'file';
  const def = SUBTITLE_MODES[mode];
  if (!def) return { status: 400, error: { error: 'Unknown subtitle output', code: 'subtitle_bad_option' } };
  if (mode === 'file' && body.subtitleFormat && !SUBTITLE_FORMATS.includes(String(body.subtitleFormat).toLowerCase())) {
    return { status: 400, error: { error: 'Unknown subtitle format', code: 'subtitle_bad_option' } };
  }
  if (mode !== 'file' && !cloudConvert) {
    return { status: 503, error: { error: 'Video output is not available right now.', code: 'subtitle_unavailable' } };
  }

  const seconds = await mediaDuration(filePath, ext);
  if (seconds === null) {
    // Only a text result from a file Whisper can take as-is may be priced
    // after the fact; anything needing CloudConvert must be priced first.
    const direct = WHISPER_NATIVE.has(ext) && file.size <= WHISPER_MAX_BYTES;
    if (mode !== 'file' || !direct) {
      return { status: 400, error: { error: 'Could not read the video length', code: 'subtitle_unreadable' } };
    }
    return { required: def.rate, seconds: null, measured: false, rate: def.rate, mode };
  }
  if (seconds > def.maxSeconds) {
    return {
      status: 400,
      error: {
        error: `Video is longer than ${def.maxSeconds / 60} minutes`,
        code: mode === 'file' ? 'subtitle_too_long_file' : 'subtitle_too_long_video',
        seconds: Math.round(seconds),
        maxSeconds: def.maxSeconds,
      },
    };
  }
  return { required: blocksOf(seconds) * def.rate, seconds, measured: true, rate: def.rate, mode };
}

// Charge `required` credits atomically.
//
// Returns { charged: n } when the request may proceed — n is what was actually
// deducted, which is 0 for business plans — or { error } for the 429 response.
// Reporting the real amount matters because refunds are driven by it: a
// business plan is never debited, so a failed job must not credit it either.
//
// The guard and the decrement are one conditional UPDATE, so parallel
// requests cannot all pass a check before any of them writes, and the
// balance can never go negative. `count === 0` means the guard failed.
async function chargeCreditsFor(userId, required) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, credits: true },
  });
  if (!user) return { error: { code: 'unauthorized', message: 'User not found.' } };
  if (user.plan === 'business') return { charged: 0, business: true }; // unlimited — nothing to charge

  const { count } = await prisma.user.updateMany({
    where: { id: userId, credits: { gte: required } },
    data: { credits: { decrement: required } },
  });

  if (count === 0) {
    return {
      error: {
        code: 'no_credits',
        message: `This conversion needs ${required} credit${required === 1 ? '' : 's'} but you have ${user.credits}.`,
        required,
        available: user.credits,
      },
    };
  }
  return { charged: required };
}

// Give back credits for a job that produced nothing, exactly once.
//
// The job's status transition is the guard: updateMany reports a row only if
// the job was not already marked failed, so a failure path that somehow runs
// twice refunds once. Mirrors convertFile/optimizeFile in convert.js, which
// already refund on failure — and which the tool-page FAQ promises in all 17
// languages ("a conversion that fails never costs you anything").
async function failJobAndRefund(jobId, userId, amount) {
  try {
    const { count } = await prisma.job.updateMany({
      where: { id: jobId, status: { not: 'failed' } },
      data: { status: 'failed' },
    });
    if (count > 0 && amount > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: amount } },
      });
    }
  } catch (err) {
    console.error(`Smart job ${jobId}: could not mark failed / refund:`, err.message);
  }
}

// For a file whose length could not be read up front (only ever a small
// file, text output), Whisper's measured length decides the real price. The
// minimum was charged at request time; charge any difference now, atomically.
// If the user cannot cover it, the job fails and everything is refunded —
// so nobody is ever billed below the published rate.
async function settleMeasuredCost(billing, measuredSeconds, maxSeconds) {
  if (billing.measured) return;
  if (maxSeconds && measuredSeconds > maxSeconds) {
    throw new Error(`Measured length ${Math.round(measuredSeconds)} s is over the ${maxSeconds} s limit`);
  }
  if (billing.business) return;
  const required = blocksOf(measuredSeconds || 0) * billing.rate;
  const extra = required - billing.charged;
  if (extra <= 0) return;
  const { count } = await prisma.user.updateMany({
    where: { id: billing.userId, credits: { gte: extra } },
    data: { credits: { decrement: extra } },
  });
  if (count === 0) {
    throw new Error(`Measured length needs ${required} credits; could not charge the remaining ${extra}`);
  }
  billing.charged += extra;
}

// Download a CloudConvert export, refusing an HTTP error page as a "result".
async function fetchExport(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Export download failed: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

// CloudConvert: extract the audio track as MP3 for Whisper. 64 kbps mono is
// ample for speech and keeps 30 minutes under Whisper's 25 MB limit
// (64 kbit/s × 1800 s ≈ 14 MB).
async function videoToMp3(file, costMeta = {}) {
  if (!cloudConvert) throw new Error('CloudConvert is not configured — cannot extract audio from this format.');
  const inputExt = path.extname(file.originalname).replace('.', '');
  const ccJob = await cloudConvert.jobs.create({
    tasks: {
      'upload-file': { operation: 'import/upload' },
      'convert-file': {
        operation: 'convert', input: ['upload-file'],
        input_format: inputExt, output_format: 'mp3',
        audio_codec: 'mp3', audio_bitrate: 64, channels: 1,
      },
      'export-file': { operation: 'export/url', input: ['convert-file'] },
    },
  });
  const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-file');
  await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(path.join(UPLOAD_DIR, file.filename)), file.originalname);
  const finished = await cloudConvert.jobs.wait(ccJob.id);
  logCloudConvertCost(finished, { ...costMeta, step: 'extract-audio' });
  const exportTask = finished.tasks.find((t) => t.name === 'export-file' && t.status === 'finished');
  if (!exportTask?.result?.files?.[0]) throw new Error('CloudConvert audio extraction failed.');
  const buffer = await fetchExport(exportTask.result.files[0].url);
  const outName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.mp3`;
  const outPath = path.join(UPLOAD_DIR, outName);
  fs.writeFileSync(outPath, buffer);
  return { path: outPath, originalname: outName };
}

// CloudConvert: convert a TXT file to DOCX. Used for Speech-to-Text DOCX output.
async function txtToDocx(txtPath, costMeta = {}) {
  if (!cloudConvert) throw new Error('CloudConvert is not configured — cannot produce DOCX output.');
  const ccJob = await cloudConvert.jobs.create({
    tasks: {
      'upload-file': { operation: 'import/upload' },
      'convert-file': {
        operation: 'convert', input: ['upload-file'],
        input_format: 'txt', output_format: 'docx',
      },
      'export-file': { operation: 'export/url', input: ['convert-file'] },
    },
  });
  const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-file');
  await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(txtPath), path.basename(txtPath));
  const finished = await cloudConvert.jobs.wait(ccJob.id);
  logCloudConvertCost(finished, { ...costMeta, step: 'txt-to-docx' });
  const exportTask = finished.tasks.find((t) => t.name === 'export-file' && t.status === 'finished');
  if (!exportTask?.result?.files?.[0]) throw new Error('CloudConvert TXT→DOCX failed.');
  return fetchExport(exportTask.result.files[0].url);
}

// ── Subtitle text from Whisper segments ──────────────────────────────

function timecode(seconds, sep) {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)}${sep}${pad(ms % 1000, 3)}`;
}

function toSrt(segments) {
  return segments
    .map((s, i) => `${i + 1}\n${timecode(s.start, ',')} --> ${timecode(s.end, ',')}\n${String(s.text).trim()}\n`)
    .join('\n');
}

function toVtt(segments) {
  return 'WEBVTT\n\n' + segments
    .map((s) => `${timecode(s.start, '.')} --> ${timecode(s.end, '.')}\n${String(s.text).trim()}\n`)
    .join('\n');
}

// ── Single dispatch endpoint ─────────────────────────────────────────

router.post('/', protect, preflightCredits, smartUpload, async (req, res) => {
  // `charged` covers only the window before the job is dispatched; once the
  // async job owns the work, `billing.charged` is what its failure refunds.
  let charged = 0;
  // Once the async job is running it owns the upload's lifetime; before that
  // this route does.
  let dispatched = false;
  // Every early return discards the upload instead of leaving it for the
  // 24h sweep.
  const reject = (status, payload) => {
    discardUploads(req.file);
    return res.status(status).json(payload);
  };
  try {
    if (!requireOpenAIKey(res)) {
      discardUploads(req.file); // requireOpenAIKey already sent the 503
      return;
    }
    const { toolSlug } = req.body;
    if (!['text-to-speech', 'speech-to-text', 'auto-subtitle'].includes(toolSlug)) {
      return reject(400, { error: 'Unknown smart tool' });
    }

    // Price (and validate) BEFORE charging.
    const price = await priceRequest({ toolSlug, file: req.file, body: req.body });
    if (price.error) return reject(price.status, price.error);

    // Reserve the credits atomically before any work starts.
    const charge = await chargeCreditsFor(req.userId, price.required);
    if (charge.error) return reject(429, { ...charge.error });
    charged = charge.charged;

    // What has actually been deducted (0 on a business plan) — this, not the
    // price, is what any refund gives back. settleMeasuredCost() may add to it.
    const billing = {
      userId: req.userId,
      charged: charge.charged,
      business: !!charge.business,
      measured: price.measured,
      rate: price.rate,
      seconds: price.seconds ?? null,
    };

    const inputDescriptor =
      toolSlug === 'text-to-speech' && !req.file
        ? '(typed text)'
        : req.file?.filename || '';

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: inputDescriptor, status: 'pending' },
    });

    // Track usage. (Credits were already reserved above.)
    prisma.toolUsage.upsert({
      where: { toolSlug },
      create: { toolSlug, count: 1 },
      update: { count: { increment: 1 } },
    }).catch(() => {});

    const handlerArgs = {
      toolSlug,
      jobId: job.id,
      file: req.file,
      text: req.body.text,
      voice: req.body.voice,
      ttsFormat: req.body.ttsFormat,
      ttsSpeed: req.body.ttsSpeed,
      sttFormat: req.body.sttFormat,
      subtitleFormat: req.body.subtitleFormat,
      subtitleMode: price.mode || 'file',
      languageHint: req.body.languageHint,
    };

    const userId = req.userId;
    dispatched = true;
    runSmartJob(job.id, handlerArgs, billing).catch((err) => {
      console.error(`Smart job ${job.id} failed:`, err);
      // Mark failed AND refund everything taken, including any amount
      // settled after measuring.
      failJobAndRefund(job.id, userId, billing.charged);
    });

    charged = 0; // handed off to the async job, which now owns the refund
    res.status(201).json({ jobId: job.id, status: 'pending', creditsCharged: billing.charged, priced: price.measured });
  } catch (err) {
    console.error('Smart route error:', err);
    // Only covers failures before the job was dispatched — credits reserved
    // for work that never started must not be kept.
    if (charged > 0) {
      prisma.user
        .update({ where: { id: req.userId }, data: { credits: { increment: charged } } })
        .catch(() => {});
    }
    // If the job never started, nothing else will clean the upload up.
    // Once dispatched, runSmartJob's finally owns it.
    if (!dispatched) discardUploads(req.file);
    res.status(500).json({ error: 'Failed to start smart conversion' });
  }
});

// ── Async dispatch ───────────────────────────────────────────────────

async function runSmartJob(jobId, args, billing) {
  try {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });

    let outputFilename;
    if (args.toolSlug === 'text-to-speech') {
      outputFilename = await runTextToSpeech(args);
    } else if (args.toolSlug === 'speech-to-text') {
      outputFilename = await runSpeechToText(args, billing);
    } else if (args.toolSlug === 'auto-subtitle') {
      outputFilename = await runAutoSubtitle(args, billing);
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done', outputFile: outputFilename },
    });
  } finally {
    // The upload has been sent to OpenAI/CloudConvert and is not needed
    // again, on success or failure. The OUTPUT stays for the normal
    // retention window so the user can download it.
    discardUploads(args.file);
  }
}

// ── Text to Speech ───────────────────────────────────────────────────

async function runTextToSpeech({ file, text, voice, ttsFormat, ttsSpeed }) {
  let input = (text || '').toString().trim();
  if (!input && file) {
    input = fs.readFileSync(path.join(UPLOAD_DIR, file.filename), 'utf8').trim();
  }
  if (!input) throw new Error('No text provided.');
  if (input.length > TTS_MAX_CHARS) {
    throw new Error(`Text is too long (${input.length} chars; max ${TTS_MAX_CHARS}).`);
  }

  const chosenVoice = TTS_VOICES.includes((voice || '').toLowerCase()) ? voice.toLowerCase() : 'alloy';
  const chosenFormat = TTS_FORMATS.includes((ttsFormat || '').toLowerCase()) ? ttsFormat.toLowerCase() : 'mp3';
  const parsedSpeed = parseFloat(ttsSpeed);
  const chosenSpeed = TTS_SPEEDS.includes(parsedSpeed) ? parsedSpeed : 1.0;

  const response = await fetch(`${OPENAI_BASE}/audio/speech`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input,
      voice: chosenVoice,
      response_format: chosenFormat,
      speed: chosenSpeed,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`OpenAI TTS error ${response.status}: ${errBody.slice(0, 200)}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const outName = newOutputFilename(chosenFormat);
  fs.writeFileSync(path.join(OUTPUT_DIR, outName), buffer);
  return outName;
}

// ── Whisper transcription (shared by Speech to Text and Auto Subtitle) ──

// Returns Whisper's verbose result: { text, duration, segments }. Files that
// Whisper accepts as-is and that fit its 25 MB limit are sent directly;
// anything else has its audio extracted by CloudConvert first.
async function transcribe(file, languageHint, costMeta) {
  const ext = fileExt(file);
  const direct = WHISPER_NATIVE.has(ext) && file.size <= WHISPER_MAX_BYTES;
  // Set only when we had to transcode: an extra MP3 in UPLOAD_DIR that
  // nothing else knows about, so this function has to clean it up itself.
  let extractedPath = null;
  try {
    let blob;
    let sourceName;
    if (direct) {
      blob = fileToBlob(path.join(UPLOAD_DIR, file.filename), file.mimetype || 'application/octet-stream');
      sourceName = file.originalname;
    } else {
      const extracted = await videoToMp3(file, costMeta);
      extractedPath = extracted.path;
      blob = fileToBlob(extracted.path, 'audio/mpeg');
      sourceName = extracted.originalname;
    }

    const formData = new FormData();
    formData.append('file', blob, sourceName);
    formData.append('model', 'whisper-1');
    // verbose_json: the text, timed segments AND the measured duration, which
    // settles the price when the file's header did not give one.
    formData.append('response_format', 'verbose_json');
    if (WHISPER_LANGUAGES.includes((languageHint || '').toLowerCase())) {
      formData.append('language', languageHint.toLowerCase());
    }

    const response = await fetch(`${OPENAI_BASE}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    });
    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      throw new Error(`OpenAI Whisper error ${response.status}: ${errBody.slice(0, 200)}`);
    }
    const result = await response.json();
    return {
      text: result.text || '',
      duration: Number(result.duration) || 0,
      segments: Array.isArray(result.segments) ? result.segments : [],
    };
  } finally {
    discardPath(extractedPath);
  }
}

// ── Speech to Text ───────────────────────────────────────────────────

async function runSpeechToText({ file, sttFormat, languageHint, jobId }, billing) {
  if (!file) throw new Error('No audio file provided.');
  const costMeta = { tool: 'speech-to-text', jobId, seconds: billing.seconds };
  const { text, duration } = await transcribe(file, languageHint, costMeta);
  await settleMeasuredCost(billing, duration);

  const chosenFormat = STT_FORMATS.includes((sttFormat || '').toLowerCase()) ? sttFormat.toLowerCase() : 'txt';

  // Write the transcript as TXT first; DOCX path passes through CloudConvert.
  const txtName = newOutputFilename('txt');
  const txtPath = path.join(OUTPUT_DIR, txtName);
  fs.writeFileSync(txtPath, text, 'utf8');

  if (chosenFormat === 'docx') {
    try {
      const docxBuffer = await txtToDocx(txtPath, { ...costMeta, creditsCharged: billing.charged });
      const docxName = newOutputFilename('docx');
      fs.writeFileSync(path.join(OUTPUT_DIR, docxName), docxBuffer);
      return docxName;
    } finally {
      fs.promises.unlink(txtPath).catch(() => {}); // intermediate, success or not
    }
  }
  return txtName;
}

// ── Auto Subtitle Generator ──────────────────────────────────────────

async function runAutoSubtitle({ file, subtitleFormat, subtitleMode, languageHint, jobId }, billing) {
  if (!file) throw new Error('No video file provided.');
  const mode = SUBTITLE_MODES[subtitleMode] ? subtitleMode : 'file';
  const costMeta = { tool: 'auto-subtitle', mode, jobId, seconds: billing.seconds };

  const { duration, segments } = await transcribe(file, languageHint, costMeta);
  await settleMeasuredCost(billing, duration, SUBTITLE_MODES[mode].maxSeconds);

  if (mode === 'file') {
    const fmt = SUBTITLE_FORMATS.includes((subtitleFormat || '').toLowerCase()) ? subtitleFormat.toLowerCase() : 'srt';
    const outName = newOutputFilename(fmt);
    fs.writeFileSync(path.join(OUTPUT_DIR, outName), fmt === 'vtt' ? toVtt(segments) : toSrt(segments), 'utf8');
    return outName;
  }

  // A video with nothing to caption would be charged for no visible result.
  if (segments.length === 0) throw new Error('No speech found to turn into subtitles.');
  return addSubtitlesToVideo(file, toSrt(segments), mode, { ...costMeta, creditsCharged: billing.charged });
}

// CloudConvert: the original video plus the generated SRT in, one MP4 out.
// "soft" adds a switchable subtitle track and, for MP4/MOV/M4V, copies the
// video and audio streams untouched (fast, cheap). "burn" draws the text
// into every frame, which means re-encoding the whole video.
async function addSubtitlesToVideo(file, srt, mode, costMeta) {
  if (!cloudConvert) throw new Error('CloudConvert is not configured — cannot produce subtitled video.');
  const ext = fileExt(file);
  // WebM (VP9/Opus) and 3GP (AMR audio) streams do not all fit an MP4 as-is,
  // so those are re-encoded even for soft subtitles.
  const copyStreams = mode === 'soft' && ['mp4', 'mov', 'm4v'].includes(ext);
  const ccJob = await cloudConvert.jobs.create({
    tasks: {
      'upload-video': { operation: 'import/upload' },
      [SUBTITLE_IMPORT_TASK]: { operation: 'import/raw', file: srt, filename: 'subtitles.srt' },
      'add-subtitles': {
        operation: 'convert',
        input: ['upload-video'],
        input_format: ext,
        output_format: 'mp4',
        subtitles_mode: mode === 'burn' ? 'hard' : 'soft',
        subtitles: SUBTITLE_IMPORT_TASK,
        video_codec: copyStreams ? 'copy' : 'x264',
        audio_codec: copyStreams ? 'copy' : 'aac',
      },
      'export-file': { operation: 'export/url', input: ['add-subtitles'] },
    },
  });
  const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-video');
  await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(path.join(UPLOAD_DIR, file.filename)), file.originalname);
  const finished = await cloudConvert.jobs.wait(ccJob.id);
  logCloudConvertCost(finished, { ...costMeta, step: mode === 'burn' ? 'burn-in' : 'soft-track' });
  const exportTask = finished.tasks.find((t) => t.name === 'export-file' && t.status === 'finished');
  if (!exportTask?.result?.files?.[0]) throw new Error('CloudConvert could not add the subtitles.');
  const buffer = await fetchExport(exportTask.result.files[0].url);
  const outName = newOutputFilename('mp4');
  fs.writeFileSync(path.join(OUTPUT_DIR, outName), buffer);
  return outName;
}

module.exports = router;
// Exposed for tests only.
module.exports._test = { priceRequest, toSrt, toVtt, timecode, SUBTITLE_MODES };
