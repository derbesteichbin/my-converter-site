// Smart Functions — OpenAI-powered tools.
//
// Three endpoints, all dispatched via POST /api/smart with `toolSlug`:
//   - text-to-speech: TTS-1, accepts {text} JSON or .txt file upload, returns
//     MP3/OPUS/AAC at chosen speed. Cost: 1 credit per 1000 chars (round up).
//   - speech-to-text: Whisper-1, accepts audio file, returns TXT or DOCX
//     (DOCX produced by chaining CloudConvert TXT→DOCX). Cost: 1 credit
//     per 5 minutes of audio (round up).
//   - auto-subtitle: Whisper-1 with response_format=srt|vtt, accepts video,
//     returns SRT or VTT. Optional ISO-639-1 language hint. Non-MP4 video
//     is first converted to MP3 via CloudConvert. Cost: 1 credit per 5
//     minutes (round up).
//
// Credit calculation runs BEFORE charging — duration is parsed locally
// with music-metadata so we never overcharge. Insufficient credits return
// 429 with `required` and `available` fields the client can show.

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const CloudConvert = require('cloudconvert');
const mm = require('music-metadata');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');

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
const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

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

const SECONDS_PER_CREDIT = 5 * 60;       // 5 minutes
const CHARS_PER_CREDIT = 1000;

// ── Helpers ──────────────────────────────────────────────────────────

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

// Returns duration in whole seconds, or null if it can't be parsed.
async function getDurationSeconds(filePath) {
  try {
    const data = await mm.parseFile(filePath);
    return data.format.duration ? Math.round(data.format.duration) : null;
  } catch {
    return null;
  }
}

// Compute the credit cost for a smart-functions request. Returns at least 1.
// Falls back to 1 if duration can't be measured (rare; benefit-of-doubt to
// the user).
async function computeRequiredCredits({ toolSlug, file, text }) {
  if (toolSlug === 'text-to-speech') {
    let len = (text || '').length;
    if (!len && file) {
      try {
        len = fs.readFileSync(path.join(UPLOAD_DIR, file.filename), 'utf8').length;
      } catch { len = 0; }
    }
    return Math.max(1, Math.ceil(len / CHARS_PER_CREDIT));
  }
  if (toolSlug === 'speech-to-text' || toolSlug === 'auto-subtitle') {
    if (!file) return 1;
    const seconds = await getDurationSeconds(path.join(UPLOAD_DIR, file.filename));
    if (!seconds) return 1;
    return Math.max(1, Math.ceil(seconds / SECONDS_PER_CREDIT));
  }
  return 1;
}

async function checkCreditsFor(userId, required) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { code: 'unauthorized', message: 'User not found.' };
  if (user.plan === 'business') return null;
  if (user.credits < required) {
    return {
      code: 'no_credits',
      message: `This conversion needs ${required} credit${required === 1 ? '' : 's'} but you have ${user.credits}.`,
      required,
      available: user.credits,
    };
  }
  return null;
}

// CloudConvert: extract MP3 audio track from a non-Whisper video container.
async function videoToMp3(file) {
  if (!cloudConvert) throw new Error('CloudConvert is not configured — cannot extract audio from this format.');
  const inputExt = path.extname(file.originalname).replace('.', '');
  const ccJob = await cloudConvert.jobs.create({
    tasks: {
      'upload-file': { operation: 'import/upload' },
      'convert-file': {
        operation: 'convert', input: ['upload-file'],
        input_format: inputExt, output_format: 'mp3',
        audio_codec: 'mp3', audio_bitrate: 128,
      },
      'export-file': { operation: 'export/url', input: ['convert-file'] },
    },
  });
  const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-file');
  await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(path.join(UPLOAD_DIR, file.filename)), file.originalname);
  const finished = await cloudConvert.jobs.wait(ccJob.id);
  const exportTask = finished.tasks.find((t) => t.name === 'export-file' && t.status === 'finished');
  if (!exportTask?.result?.files?.[0]) throw new Error('CloudConvert audio extraction failed.');
  const response = await fetch(exportTask.result.files[0].url);
  const buffer = Buffer.from(await response.arrayBuffer());
  const outName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.mp3`;
  const outPath = path.join(UPLOAD_DIR, outName);
  fs.writeFileSync(outPath, buffer);
  return { path: outPath, originalname: outName };
}

// CloudConvert: convert a TXT file to DOCX. Used for Speech-to-Text DOCX output.
async function txtToDocx(txtPath) {
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
  const exportTask = finished.tasks.find((t) => t.name === 'export-file' && t.status === 'finished');
  if (!exportTask?.result?.files?.[0]) throw new Error('CloudConvert TXT→DOCX failed.');
  const response = await fetch(exportTask.result.files[0].url);
  return Buffer.from(await response.arrayBuffer());
}

// ── Single dispatch endpoint ─────────────────────────────────────────

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!requireOpenAIKey(res)) return;
    const { toolSlug } = req.body;
    if (!['text-to-speech', 'speech-to-text', 'auto-subtitle'].includes(toolSlug)) {
      return res.status(400).json({ error: 'Unknown smart tool' });
    }

    // Compute credit cost from input parameters BEFORE charging.
    const required = await computeRequiredCredits({
      toolSlug,
      file: req.file,
      text: req.body.text,
    });

    const limitError = await checkCreditsFor(req.userId, required);
    if (limitError) return res.status(429).json({ ...limitError });

    const inputDescriptor =
      toolSlug === 'text-to-speech' && !req.file
        ? '(typed text)'
        : req.file?.filename || '';

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: inputDescriptor, status: 'pending' },
    });

    // Deduct the right amount; track usage. Same fire-and-forget pattern
    // as convert.js.
    prisma.user.update({ where: { id: req.userId }, data: { credits: { decrement: required } } }).catch(() => {});
    prisma.toolUsage.upsert({
      where: { toolSlug },
      create: { toolSlug, count: 1 },
      update: { count: { increment: 1 } },
    }).catch(() => {});

    const handlerArgs = {
      toolSlug,
      file: req.file,
      text: req.body.text,
      voice: req.body.voice,
      ttsFormat: req.body.ttsFormat,
      ttsSpeed: req.body.ttsSpeed,
      sttFormat: req.body.sttFormat,
      subtitleFormat: req.body.subtitleFormat,
      languageHint: req.body.languageHint,
    };

    runSmartJob(job.id, handlerArgs).catch((err) => {
      console.error(`Smart job ${job.id} failed:`, err);
      prisma.job.update({ where: { id: job.id }, data: { status: 'failed' } }).catch(() => {});
    });

    res.status(201).json({ jobId: job.id, status: 'pending', creditsCharged: required });
  } catch (err) {
    console.error('Smart route error:', err);
    res.status(500).json({ error: 'Failed to start smart conversion' });
  }
});

// ── Async dispatch ───────────────────────────────────────────────────

async function runSmartJob(jobId, args) {
  await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });

  let outputFilename;
  if (args.toolSlug === 'text-to-speech') {
    outputFilename = await runTextToSpeech(args);
  } else if (args.toolSlug === 'speech-to-text') {
    outputFilename = await runSpeechToText(args);
  } else if (args.toolSlug === 'auto-subtitle') {
    outputFilename = await runAutoSubtitle(args);
  }

  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'done', outputFile: outputFilename },
  });
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

// ── Speech to Text ───────────────────────────────────────────────────

async function runSpeechToText({ file, sttFormat, languageHint }) {
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

  const transcript = await response.text();
  const chosenFormat = STT_FORMATS.includes((sttFormat || '').toLowerCase()) ? sttFormat.toLowerCase() : 'txt';

  // Write the transcript as TXT first; DOCX path passes through CloudConvert.
  const txtName = newOutputFilename('txt');
  const txtPath = path.join(OUTPUT_DIR, txtName);
  fs.writeFileSync(txtPath, transcript, 'utf8');

  if (chosenFormat === 'docx') {
    const docxBuffer = await txtToDocx(txtPath);
    const docxName = newOutputFilename('docx');
    fs.writeFileSync(path.join(OUTPUT_DIR, docxName), docxBuffer);
    fs.unlinkSync(txtPath); // tidy intermediate
    return docxName;
  }
  return txtName;
}

// ── Auto Subtitle Generator ──────────────────────────────────────────

async function runAutoSubtitle({ file, subtitleFormat, languageHint }) {
  if (!file) throw new Error('No video file provided.');
  const inputExt = path.extname(file.originalname).replace('.', '').toLowerCase();

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
  const chosenFormat = SUBTITLE_FORMATS.includes((subtitleFormat || '').toLowerCase()) ? subtitleFormat.toLowerCase() : 'srt';

  const formData = new FormData();
  formData.append('file', blob, sourceName);
  formData.append('model', 'whisper-1');
  formData.append('response_format', chosenFormat);
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
    throw new Error(`OpenAI Whisper subtitle error ${response.status}: ${errBody.slice(0, 200)}`);
  }

  const subtitle = await response.text();
  const outName = newOutputFilename(chosenFormat);
  fs.writeFileSync(path.join(OUTPUT_DIR, outName), subtitle, 'utf8');
  return outName;
}

module.exports = router;
