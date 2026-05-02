// Smart Functions — OpenAI-powered tools.
//
// Three endpoints, all dispatched via POST /api/smart with `toolSlug`:
//   - text-to-speech: TTS-1, accepts {text} JSON or .txt file upload, returns MP3
//   - speech-to-text: Whisper-1, accepts audio file, returns TXT (transcript
//     also accessible by fetching the output file)
//   - auto-subtitle:  Whisper-1 with response_format=srt, accepts video file,
//     returns SRT. Non-MP4 video formats (MOV/AVI/MKV) are first converted
//     to MP3 via CloudConvert because Whisper doesn't accept them natively.
//
// Job lifecycle mirrors convert.js — create Job, dispatch async, poll via
// GET /api/jobs/:id which already lives in convert.js.

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const CloudConvert = require('cloudconvert');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const OUTPUT_DIR = path.join(__dirname, '..', 'outputs');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Whisper has a hard 25 MB file-size limit. TTS input is text so this
// only really constrains the speech-to-text and auto-subtitle endpoints,
// but applying it here gives a friendlier error than OpenAI's 413.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${unique}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

const cloudConvert = process.env.CLOUDCONVERT_API_KEY
  ? new CloudConvert(process.env.CLOUDCONVERT_API_KEY)
  : null;

const OPENAI_BASE = 'https://api.openai.com/v1';
const TTS_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
const TTS_MAX_CHARS = 4096;
// Formats Whisper accepts directly (per OpenAI docs).
const WHISPER_NATIVE = new Set(['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm', 'ogg', 'flac']);

// ── Helpers ──────────────────────────────────────────────────────────

async function checkCredits(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { code: 'unauthorized', message: 'User not found.' };
  if (user.plan === 'business') return null;
  if (user.credits <= 0) {
    return { code: 'no_credits', message: 'You need credits to use Smart Functions. Buy a pack to continue.' };
  }
  return null;
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

// Read a file from disk and return a Blob suitable for OpenAI multipart upload.
function fileToBlob(filePath, mime) {
  const buf = fs.readFileSync(filePath);
  return new Blob([buf], { type: mime });
}

// Convert a non-Whisper video to MP3 via CloudConvert. Returns the path of
// the resulting MP3 in UPLOAD_DIR.
async function videoToMp3(file) {
  if (!cloudConvert) throw new Error('CloudConvert is not configured — cannot extract audio from this format.');
  const inputExt = path.extname(file.originalname).replace('.', '');
  const ccJob = await cloudConvert.jobs.create({
    tasks: {
      'upload-file': { operation: 'import/upload' },
      'convert-file': {
        operation: 'convert',
        input: ['upload-file'],
        input_format: inputExt,
        output_format: 'mp3',
        audio_codec: 'mp3',
        audio_bitrate: 128,
      },
      'export-file': { operation: 'export/url', input: ['convert-file'] },
    },
  });
  const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-file');
  await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(path.join(UPLOAD_DIR, file.filename)), file.originalname);
  const finished = await cloudConvert.jobs.wait(ccJob.id);
  const exportTask = finished.tasks.find((t) => t.name === 'export-file' && t.status === 'finished');
  if (!exportTask?.result?.files?.[0]) throw new Error('CloudConvert audio extraction failed.');
  const url = exportTask.result.files[0].url;
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  const outName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.mp3`;
  const outPath = path.join(UPLOAD_DIR, outName);
  fs.writeFileSync(outPath, buffer);
  return { path: outPath, originalname: outName };
}

// ── Single dispatch endpoint ─────────────────────────────────────────

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!requireOpenAIKey(res)) return;
    const { toolSlug } = req.body;
    if (!['text-to-speech', 'speech-to-text', 'auto-subtitle'].includes(toolSlug)) {
      return res.status(400).json({ error: 'Unknown smart tool' });
    }

    const limitError = await checkCredits(req.userId);
    if (limitError) return res.status(429).json({ error: limitError.message, code: limitError.code });

    const inputDescriptor =
      toolSlug === 'text-to-speech' && !req.file
        ? '(typed text)'
        : req.file?.filename || '';

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: inputDescriptor, status: 'pending' },
    });

    // Deduct credit and track usage (fire and forget — same pattern as convert.js)
    prisma.user.update({ where: { id: req.userId }, data: { credits: { decrement: 1 } } }).catch(() => {});
    prisma.toolUsage.upsert({
      where: { toolSlug },
      create: { toolSlug, count: 1 },
      update: { count: { increment: 1 } },
    }).catch(() => {});

    // Snapshot anything off req that the async handler needs — req gets
    // reused/disposed once the response is sent.
    const handlerArgs = {
      toolSlug,
      file: req.file,
      text: req.body.text,
      voice: req.body.voice,
    };

    runSmartJob(job.id, handlerArgs).catch((err) => {
      console.error(`Smart job ${job.id} failed:`, err);
      prisma.job.update({ where: { id: job.id }, data: { status: 'failed' } }).catch(() => {});
    });

    res.status(201).json({ jobId: job.id, status: 'pending' });
  } catch (err) {
    console.error('Smart route error:', err);
    res.status(500).json({ error: 'Failed to start smart conversion' });
  }
});

// ── Async handler ────────────────────────────────────────────────────

async function runSmartJob(jobId, { toolSlug, file, text, voice }) {
  await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });

  let outputFilename;
  if (toolSlug === 'text-to-speech') {
    outputFilename = await runTextToSpeech({ file, text, voice });
  } else if (toolSlug === 'speech-to-text') {
    outputFilename = await runSpeechToText({ file });
  } else if (toolSlug === 'auto-subtitle') {
    outputFilename = await runAutoSubtitle({ file });
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'done', outputFile: outputFilename },
  });
}

// ── Text to Speech ───────────────────────────────────────────────────

async function runTextToSpeech({ file, text, voice }) {
  // Resolve the input text — either from typed input or an uploaded .txt file.
  let input = (text || '').toString().trim();
  if (!input && file) {
    input = fs.readFileSync(path.join(UPLOAD_DIR, file.filename), 'utf8').trim();
  }
  if (!input) throw new Error('No text provided.');
  if (input.length > TTS_MAX_CHARS) {
    throw new Error(`Text is too long (${input.length} chars; max ${TTS_MAX_CHARS}).`);
  }

  const chosenVoice = TTS_VOICES.includes((voice || '').toLowerCase()) ? voice.toLowerCase() : 'alloy';

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
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`OpenAI TTS error ${response.status}: ${errBody.slice(0, 200)}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const outName = newOutputFilename('mp3');
  fs.writeFileSync(path.join(OUTPUT_DIR, outName), buffer);
  return outName;
}

// ── Speech to Text ───────────────────────────────────────────────────

async function runSpeechToText({ file }) {
  if (!file) throw new Error('No audio file provided.');
  const inputExt = path.extname(file.originalname).replace('.', '').toLowerCase();
  if (!WHISPER_NATIVE.has(inputExt)) {
    throw new Error(`Unsupported audio format: ${inputExt}`);
  }

  const filePath = path.join(UPLOAD_DIR, file.filename);
  const blob = fileToBlob(filePath, file.mimetype || 'audio/mpeg');

  const formData = new FormData();
  formData.append('file', blob, file.originalname);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'text');

  const response = await fetch(`${OPENAI_BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`OpenAI Whisper error ${response.status}: ${errBody.slice(0, 200)}`);
  }

  const transcript = await response.text();
  const outName = newOutputFilename('txt');
  fs.writeFileSync(path.join(OUTPUT_DIR, outName), transcript, 'utf8');
  return outName;
}

// ── Auto Subtitle Generator ──────────────────────────────────────────

async function runAutoSubtitle({ file }) {
  if (!file) throw new Error('No video file provided.');
  const inputExt = path.extname(file.originalname).replace('.', '').toLowerCase();

  // Files Whisper accepts directly: pass through. Otherwise extract audio
  // first via CloudConvert (one extra round trip, but means we support
  // MOV/AVI/MKV without needing ffmpeg installed).
  let blobSource;
  let sourceName;
  if (WHISPER_NATIVE.has(inputExt)) {
    blobSource = path.join(UPLOAD_DIR, file.filename);
    sourceName = file.originalname;
  } else {
    const extracted = await videoToMp3(file);
    blobSource = extracted.path;
    sourceName = extracted.originalname;
  }

  const blob = fileToBlob(blobSource, 'audio/mpeg');

  const formData = new FormData();
  formData.append('file', blob, sourceName);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'srt');

  const response = await fetch(`${OPENAI_BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`OpenAI Whisper SRT error ${response.status}: ${errBody.slice(0, 200)}`);
  }

  const srt = await response.text();
  const outName = newOutputFilename('srt');
  fs.writeFileSync(path.join(OUTPUT_DIR, outName), srt, 'utf8');
  return outName;
}

module.exports = router;
