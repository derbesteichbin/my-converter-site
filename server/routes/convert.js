const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const CloudConvert = require('cloudconvert');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');
const { VALID_TOOLS, ALLOWED_ADVANCED_KEYS } = require('../toolsConfig');
const { Resend } = require('resend');
const archiver = require('archiver');
const { LAYOUTS, validateCollage, buildCollage } = require('../lib/collage');
const { OPTIONS: SOCIAL_OPTIONS, parseOptions: parseSocialOptions, resolveFormat: resolveSocialFormat, runSocialImage } = require('../lib/socialImage');

const router = express.Router();

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

async function sendCompletionEmail(userId, jobId, downloadUrl) {
  const resend = getResend();
  if (!resend) return;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    // The download API lives on the BACKEND. This used to build the link from
    // CLIENT_URL, but client/vercel.json rewrites every path to the SPA, so
    // /api/download/... on the frontend host returned index.html rather than
    // the file — the emailed link was simply broken.
    const apiBase = (process.env.SERVER_URL || '').replace(/\/$/, '');
    const clientBase = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const fullUrl = apiBase ? `${apiBase}${downloadUrl}` : null;

    if (!fullUrl) {
      console.warn('[convert] SERVER_URL is not set — completion email will link to the dashboard only');
    }

    // GET /api/download/:filename is behind `protect` and an ownership check,
    // so the direct link only works in a browser that already holds the
    // session cookie for the API host. The dashboard link is the fallback for
    // anyone opening the mail elsewhere: they sign in and download from there.
    const html = [
      '<p>Your file has been converted successfully.</p>',
      fullUrl ? `<p><a href="${fullUrl}">Download your file</a></p>` : '',
      `<p style="font-size:0.875rem;color:#666;">If the link asks you to sign in, open your <a href="${clientBase}/dashboard">dashboard</a> and download it from there.</p>`,
      '<p>This link will expire in 24 hours.</p>',
    ].join('');

    await resend.emails.send({
      from: 'ConvertAnyFormat <noreply@convertanyformat.com>',
      to: user.email,
      subject: 'Your file conversion is ready',
      html,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
}

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
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } }); // 200 MB

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);
// Presence only — never any part of the key itself.
console.log('CloudConvert initialized, sandbox: false, API key: ' + (process.env.CLOUDCONVERT_API_KEY ? 'SET' : 'MISSING'));

// ── Helpers ──────────────────────────────────────────────────────────

// Resolve a user-supplied output filename to a real path inside OUTPUT_DIR.
// Returns null if the name is unusable or escapes the directory.
//
// Express URI-decodes route params AFTER routing, so a request for
// "..%2F..%2Findex.js" arrives here as "../../index.js". path.basename()
// strips the traversal; the containment check that follows is a second,
// independent guard so this stays safe even if the input shape changes.
function resolveOutputFile(filename) {
  if (typeof filename !== 'string' || !filename) return null;
  const base = path.basename(filename);
  if (!base || base === '.' || base === '..') return null;

  const root = path.resolve(OUTPUT_DIR);
  const full = path.resolve(root, base);
  if (full !== path.join(root, base) || !full.startsWith(root + path.sep)) return null;

  return { base, full };
}

// A user may only download output files produced by their own jobs. Mirrors
// the ownership check on GET /jobs/:id. Returns the subset of `basenames`
// that belong to this user.
//
// Multi-output jobs (PDF to Images) list their per-page files in
// extraOutputs, so those are owned too.
async function ownedOutputFiles(userId, basenames) {
  const jobs = await prisma.job.findMany({
    where: {
      userId,
      OR: [{ outputFile: { in: basenames } }, { extraOutputs: { hasSome: basenames } }],
    },
    select: { outputFile: true, extraOutputs: true },
  });
  const wanted = new Set(basenames);
  const owned = new Set();
  for (const job of jobs) {
    for (const name of [job.outputFile, ...(job.extraOutputs || [])]) {
      if (name && wanted.has(name)) owned.add(name);
    }
  }
  return owned;
}

function newOutputBase() {
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

// Shared failure path for the background workers: mark the job failed and
// give back what was charged. chargedAmount is 0 on a business plan, which is
// never debited and so must never be credited back.
async function failJob(jobId, chargedUserId, chargedAmount) {
  await prisma.job.update({ where: { id: jobId }, data: { status: 'failed' } }).catch(() => {});
  if (chargedUserId && chargedAmount > 0) refundCredits(chargedUserId, chargedAmount);
}

function extractAdvancedOptions(body) {
  const opts = {};
  for (const key of ALLOWED_ADVANCED_KEYS) {
    if (body[key] !== undefined && body[key] !== '') {
      if (key === 'ocr') {
        opts.ocr = body.ocr === 'true' || body.ocr === true;
      } else if (['width', 'height', 'quality', 'fps'].includes(key)) {
        const n = parseInt(body[key], 10);
        if (!isNaN(n)) opts[key] = n;
      } else {
        opts[key] = body[key];
      }
    }
  }
  return opts;
}

// Charge `amount` credits atomically. Returns null when the request may
// proceed, or an error descriptor for the 429 response.
//
// The deduction is a single conditional UPDATE: the `credits: { gte: amount }`
// guard and the decrement happen in one statement, so concurrent requests
// cannot all pass a check before any of them writes, and the balance can
// never go negative. `count === 0` means the guard failed — insufficient
// credits — which is the only way to be refused.
async function chargeCredits(userId, amount = 1) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, credits: true },
  });
  // A valid token for a deleted account used to throw here.
  if (!user) return { error: { code: 'unauthorized', message: 'User not found.' } };
  // Unlimited — nothing is deducted, so `charged: 0` must be reported or the
  // refund path would credit an account that never paid.
  if (user.plan === 'business') return { charged: 0 };

  const { count } = await prisma.user.updateMany({
    where: { id: userId, credits: { gte: amount } },
    data: { credits: { decrement: amount } },
  });

  if (count === 0) {
    return {
      error: {
        code: 'no_credits',
        message: 'You need credits to convert files. Buy a pack to continue.',
        required: amount,
        available: user.credits,
      },
    };
  }
  return { charged: amount };
}

// Give back credits charged for work that never started. Same shape as the
// refunds in convertFile/optimizeFile/convertPdfTool.
function refundCredits(userId, amount = 1) {
  prisma.user
    .update({ where: { id: userId }, data: { credits: { increment: amount } } })
    .catch(() => {});
}

// Delete uploads immediately instead of waiting for the 24h sweep. Called on
// every rejection path and once each job finishes, so an input file lives
// only as long as the conversion that needs it.
function discardUploads(files) {
  for (const file of [].concat(files || [])) {
    if (!file || !file.filename) continue;
    fs.promises
      .unlink(path.join(UPLOAD_DIR, file.filename))
      .catch(() => {}); // already gone, or swept — nothing to do
  }
}

// Refuse hopeless requests BEFORE multer streams a 200 MB body to disk.
//
// multer runs as middleware, so it used to write the whole upload and only
// then discover the user had no credits — an unauthenticated-adjacent way to
// fill the Railway volume, since the file then sat there for 24 hours. This
// is a cheap advisory read; the authoritative gate is still the atomic
// chargeCredits() after the upload, which is what makes the race impossible.
async function preflightCredits(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { plan: true, credits: true },
    });
    if (!user) {
      return res.status(401).json({ error: 'Not authorized', code: 'unauthorized' });
    }
    if (user.plan !== 'business' && user.credits <= 0) {
      return res.status(429).json({
        error: 'You need credits to convert files. Buy a pack to continue.',
        code: 'no_credits',
      });
    }
    next();
  } catch (err) {
    console.error('Credit preflight error:', err);
    next(); // never block a paying user on a transient read failure
  }
}

async function downloadExportedFile(ccJob, outputFormat) {
  const finished = await cloudConvert.jobs.wait(ccJob.id);

  const exportTask = finished.tasks.find(
    (t) => t.name === 'export-file' && t.status === 'finished'
  );

  if (!exportTask?.result?.files?.[0]) {
    throw new Error('CloudConvert export task failed or returned no files');
  }

  const exportedFile = exportTask.result.files[0];
  const outputFilename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${outputFormat}`;
  const outputPath = path.join(OUTPUT_DIR, outputFilename);

  const response = await fetch(exportedFile.url);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);

  return outputFilename;
}

// Like downloadExportedFile, but keeps every exported file — a PDF converted
// to images comes back as one file per page. Returned in page order.
async function downloadAllExportedFiles(ccJob, outputFormat) {
  const finished = await cloudConvert.jobs.wait(ccJob.id);
  const exportTask = finished.tasks.find(
    (t) => t.name === 'export-file' && t.status === 'finished'
  );
  const files = exportTask?.result?.files || [];
  if (files.length === 0) {
    throw new Error('CloudConvert export task failed or returned no files');
  }

  // CloudConvert names pages "<name>-1.jpg", "<name>-2.jpg", … — a numeric
  // compare keeps page 10 after page 9.
  const ordered = [...files].sort((a, b) =>
    String(a.filename).localeCompare(String(b.filename), undefined, { numeric: true })
  );

  const base = newOutputBase();
  const saved = [];
  for (let i = 0; i < ordered.length; i++) {
    const outputFilename = `${base}-p${i + 1}.${outputFormat}`;
    const response = await fetch(ordered[i].url);
    if (!response.ok) throw new Error(`Failed to fetch exported page ${i + 1}`);
    fs.writeFileSync(path.join(OUTPUT_DIR, outputFilename), Buffer.from(await response.arrayBuffer()));
    saved.push(outputFilename);
  }
  return { base, files: saved };
}

// Zip already-written output files into OUTPUT_DIR/<zipName>.
function zipOutputs(zipName, entries) {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(path.join(OUTPUT_DIR, zipName));
    const archive = archiver('zip', { zlib: { level: 5 } });
    out.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(out);
    for (const { file, name } of entries) archive.file(path.join(OUTPUT_DIR, file), { name });
    archive.finalize();
  });
}

// Display name for page N of a PDF-to-images job, zero-padded so the ZIP
// lists pages in order in every file manager.
function pageName(index, total, ext) {
  const width = Math.max(2, String(total).length);
  return `page-${String(index + 1).padStart(width, '0')}.${ext}`;
}

// ── Standard file conversion ─────────────────────────────────────────

router.post('/', protect, preflightCredits, upload.single('file'), async (req, res) => {
  let charged = 0;
  let chargedAmount = 0;
  // Every early return below discards the upload rather than leaving it for
  // the 24h sweep.
  const reject = (status, payload) => {
    discardUploads(req.file);
    return res.status(status).json(payload);
  };
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { outputFormat, toolSlug } = req.body;
    if (!outputFormat) {
      return reject(400, { error: 'outputFormat is required' });
    }

    // Validate tool + format
    if (toolSlug) {
      const toolDef = VALID_TOOLS[toolSlug];
      if (!toolDef) {
        return reject(400, { error: 'Unknown tool' });
      }
      if (!toolDef.outputFormats.includes(outputFormat)) {
        return reject(400, { error: `Format .${outputFormat} is not supported for this tool` });
      }
      // The sharp tools decode the file themselves, so check the type and
      // the options up front — a bad request must not cost a credit.
      if (SOCIAL_OPTIONS[toolDef.toolType]) {
        const ext = path.extname(req.file.originalname).replace('.', '').toLowerCase();
        if (!toolDef.inputFormats.includes(ext)) {
          return reject(400, { error: `"${req.file.originalname}" is not a supported image type`, code: 'social_bad_type' });
        }
        const parsed = parseSocialOptions(toolDef.toolType, req.body);
        if (parsed.error) return reject(400, { error: 'Invalid options', code: parsed.error });
        req.socialOptions = parsed.options;
      }
    }

    // Reserve a conversion credit before any work starts. Atomically checks
    // and deducts in one statement, so parallel requests cannot share one
    // credit. Refunded below if the job fails (or never starts).
    const charge = await chargeCredits(req.userId, 1);
    if (charge.error) {
      return reject(429, { error: charge.error.message, code: charge.error.code });
    }
    // What was actually deducted — 0 on a business plan. This, not a hardcoded
    // 1, is what any refund must give back.
    chargedAmount = charge.charged;
    charged = chargedAmount;

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: req.file.filename, status: 'pending' },
    });

    // Track tool usage
    if (toolSlug) {
      prisma.toolUsage.upsert({
        where: { toolSlug },
        create: { toolSlug, count: 1 },
        update: { count: { increment: 1 } },
      }).catch(() => {});
    }

    const advancedOptions = extractAdvancedOptions(req.body);

    // Smart Functions: OCR tool always runs CloudConvert with OCR enabled.
    if (toolSlug === 'ocr') {
      advancedOptions.ocr = true;
    }

    const notifyEmail = req.body.notifyEmail === 'true';

    // Compressor tools ("image-compressor", "jpeg-compressor", …) run the
    // CloudConvert optimize task and keep the input format. Everything else
    // is a straightforward format conversion.
    const toolDef = toolSlug ? VALID_TOOLS[toolSlug] : null;
    if (toolDef && toolDef.toolType === 'compress') {
      optimizeFile(job.id, req.file, req.userId, chargedAmount).catch((err) => {
        console.error(`Compression failed for job ${job.id}:`, err);
      });
    } else if (toolDef && toolDef.toolType === 'rename') {
      renameJpeg(job.id, req.file, outputFormat, req.userId, chargedAmount).catch((err) => {
        console.error(`Rename failed for job ${job.id}:`, err);
      });
    } else if (toolDef && SOCIAL_OPTIONS[toolDef.toolType]) {
      socialImageJob(job.id, req.file, toolDef.toolType, req.socialOptions, outputFormat, notifyEmail ? req.userId : null, req.userId, chargedAmount).catch((err) => {
        console.error(`Social image tool failed for job ${job.id}:`, err);
      });
    } else if (toolDef && toolDef.toolType === 'pdf-images') {
      pdfToImages(job.id, req.file, outputFormat, notifyEmail ? req.userId : null, req.userId, chargedAmount).catch((err) => {
        console.error(`PDF to images failed for job ${job.id}:`, err);
      });
    } else {
      convertFile(job.id, req.file, outputFormat, advancedOptions, notifyEmail ? req.userId : null, req.userId, chargedAmount).catch((err) => {
        console.error(`Conversion failed for job ${job.id}:`, err);
      });
    }

    // The worker owns the refund from here on (see convertFile/optimizeFile),
    // so the route-level fallback below must not fire as well.
    charged = 0;
    res.status(201).json({ jobId: job.id, status: 'pending' });
  } catch (err) {
    console.error('Convert route error:', err);
    if (charged > 0) refundCredits(req.userId, charged);
    discardUploads(req.file);
    res.status(500).json({ error: 'Failed to start conversion' });
  }
});

async function convertFile(jobId, file, outputFormat, advancedOptions = {}, notifyUserId = null, chargedUserId = null, chargedAmount = 0) {
  try {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });

    const inputExt = path.extname(file.originalname).replace('.', '');
    const filePath = path.join(UPLOAD_DIR, file.filename);

    const ccJob = await cloudConvert.jobs.create({
      tasks: {
        'upload-file': { operation: 'import/upload' },
        'convert-file': {
          operation: 'convert',
          input: ['upload-file'],
          input_format: inputExt,
          output_format: outputFormat,
          ...advancedOptions,
        },
        'export-file': { operation: 'export/url', input: ['convert-file'] },
      },
    });

    const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-file');
    await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(filePath), file.originalname);

    const outputFilename = await downloadExportedFile(ccJob, outputFormat);

    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done', outputFile: outputFilename },
    });

    if (notifyUserId) {
      sendCompletionEmail(notifyUserId, jobId, `/api/download/${outputFilename}`);
    }
  } catch (err) {
    console.error(`convertFile error for job ${jobId}:`, err);
    await prisma.job.update({ where: { id: jobId }, data: { status: 'failed' } });
    // Refund the credit reserved at request time: a failed conversion must
    // not be charged, so credits charged always equal successful conversions.
    // chargedAmount is 0 on a business plan, which is never debited and so
    // must never be credited back.
    if (chargedUserId && chargedAmount > 0) {
      prisma.user.update({
        where: { id: chargedUserId },
        data: { credits: { increment: chargedAmount } },
      }).catch(() => {});
    }
  } finally {
    // The upload has been sent to CloudConvert and is not needed again,
    // whether the job succeeded or failed. The output stays until the 24h
    // sweep so the user can still download it.
    discardUploads(file);
  }
}

// ── Compression via CloudConvert optimize (image/jpeg/png/gif) ─────────
// Keeps the input format and shrinks the file. The optimize task supports
// png, jpg, gif (and pdf/svg); jpeg is normalised to jpg.
async function optimizeFile(jobId, file, chargedUserId = null, chargedAmount = 0) {
  try {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });

    let fmt = path.extname(file.originalname).replace('.', '').toLowerCase();
    if (fmt === 'jpeg') fmt = 'jpg';
    const filePath = path.join(UPLOAD_DIR, file.filename);

    const ccJob = await cloudConvert.jobs.create({
      tasks: {
        'upload-file': { operation: 'import/upload' },
        'optimize-file': { operation: 'optimize', input: ['upload-file'], input_format: fmt },
        'export-file': { operation: 'export/url', input: ['optimize-file'] },
      },
    });

    const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-file');
    await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(filePath), file.originalname);

    const outputFilename = await downloadExportedFile(ccJob, fmt);

    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done', outputFile: outputFilename },
    });
  } catch (err) {
    console.error(`optimizeFile error for job ${jobId}:`, err);
    await prisma.job.update({ where: { id: jobId }, data: { status: 'failed' } });
    // Refund the reserved credit on failure (see convertFile).
    // chargedAmount is 0 on a business plan, which is never debited and so
    // must never be credited back.
    if (chargedUserId && chargedAmount > 0) {
      prisma.user.update({
        where: { id: chargedUserId },
        data: { credits: { increment: chargedAmount } },
      }).catch(() => {});
    }
  } finally {
    discardUploads(file);
  }
}

// ── JPEG ↔ JPG ───────────────────────────────────────────────────────
// The two extensions name the same format, so re-encoding would only lose
// quality. Copy the bytes unchanged under the new extension — after checking
// they really are a JPEG, so the tool cannot be used to relabel other files.
async function renameJpeg(jobId, file, outputFormat, chargedUserId = null, chargedAmount = 0) {
  try {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });

    const filePath = path.join(UPLOAD_DIR, file.filename);
    const fd = await fs.promises.open(filePath, 'r');
    const magic = Buffer.alloc(3);
    try { await fd.read(magic, 0, 3, 0); } finally { await fd.close(); }
    if (magic[0] !== 0xff || magic[1] !== 0xd8 || magic[2] !== 0xff) {
      throw new Error('Input is not a JPEG file');
    }

    const outputFilename = `${newOutputBase()}.${outputFormat}`;
    await fs.promises.copyFile(filePath, path.join(OUTPUT_DIR, outputFilename));

    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done', outputFile: outputFilename },
    });
  } catch (err) {
    console.error(`renameJpeg error for job ${jobId}:`, err);
    await failJob(jobId, chargedUserId, chargedAmount);
  } finally {
    discardUploads(file);
  }
}

// ── Social Media image tools (resize, profile picture, compress) ─────
// Single image in, single image out, processed with sharp. Options were
// validated in the route before the credit was charged.
async function socialImageJob(jobId, file, toolType, options, requestedFormat, notifyUserId = null, chargedUserId = null, chargedAmount = 0) {
  const format = resolveSocialFormat(toolType, options, requestedFormat);
  const outputFilename = `${newOutputBase()}.${format}`;
  try {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });
    await runSocialImage(toolType, path.join(UPLOAD_DIR, file.filename), path.join(OUTPUT_DIR, outputFilename), options, format);
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done', outputFile: outputFilename },
    });
    if (notifyUserId) {
      sendCompletionEmail(notifyUserId, jobId, `/api/download/${outputFilename}`);
    }
  } catch (err) {
    console.error(`socialImageJob error for job ${jobId}:`, err);
    fs.promises.unlink(path.join(OUTPUT_DIR, outputFilename)).catch(() => {});
    await failJob(jobId, chargedUserId, chargedAmount);
  } finally {
    discardUploads(file);
  }
}

// ── PDF to Images ────────────────────────────────────────────────────
// CloudConvert renders every page as its own image. Each page is kept as an
// individual download (extraOutputs) and also zipped; the ZIP is the job's
// primary outputFile so the dashboard and email link still have one file.
async function pdfToImages(jobId, file, outputFormat, notifyUserId = null, chargedUserId = null, chargedAmount = 0) {
  let pages = [];
  try {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });

    const filePath = path.join(UPLOAD_DIR, file.filename);
    const ccJob = await cloudConvert.jobs.create({
      tasks: {
        'upload-file': { operation: 'import/upload' },
        'convert-file': {
          operation: 'convert',
          input: ['upload-file'],
          input_format: 'pdf',
          output_format: outputFormat,
        },
        'export-file': { operation: 'export/url', input: ['convert-file'] },
      },
    });

    const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-file');
    await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(filePath), file.originalname);

    const { base, files } = await downloadAllExportedFiles(ccJob, outputFormat);
    pages = files;

    const zipName = `${base}.zip`;
    await zipOutputs(zipName, files.map((f, i) => ({ file: f, name: pageName(i, files.length, outputFormat) })));

    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done', outputFile: zipName, extraOutputs: files },
    });

    if (notifyUserId) {
      sendCompletionEmail(notifyUserId, jobId, `/api/download/${zipName}`);
    }
  } catch (err) {
    console.error(`pdfToImages error for job ${jobId}:`, err);
    // Pages written before the failure are not attached to the job, so
    // nobody could download them — remove them now rather than at the sweep.
    for (const f of pages) fs.promises.unlink(path.join(OUTPUT_DIR, f)).catch(() => {});
    await failJob(jobId, chargedUserId, chargedAmount);
  } finally {
    discardUploads(file);
  }
}

// ── PDF tool conversion (merge, split, compress, rotate, protect, unlock) ──

router.post('/pdf-tool', protect, preflightCredits, upload.array('files', 20), async (req, res) => {
  let charged = 0;
  let chargedAmount = 0;
  const reject = (status, payload) => {
    discardUploads(req.files);
    return res.status(status).json(payload);
  };
  try {
    const uploadedFiles = req.files || [];
    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { toolSlug } = req.body;
    const toolDef = VALID_TOOLS[toolSlug];
    if (!toolDef || !toolDef.toolType) {
      return reject(400, { error: 'Unknown PDF tool' });
    }

    // Reserve a credit atomically before any work starts (see chargeCredits).
    const charge = await chargeCredits(req.userId, 1);
    if (charge.error) {
      return reject(429, { error: charge.error.message, code: charge.error.code });
    }
    // What was actually deducted — 0 on a business plan. This, not a hardcoded
    // 1, is what any refund must give back.
    chargedAmount = charge.charged;
    charged = chargedAmount;

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: uploadedFiles.map((f) => f.filename).join(','), status: 'pending' },
    });

    // Track tool usage
    prisma.toolUsage.upsert({
      where: { toolSlug },
      create: { toolSlug, count: 1 },
      update: { count: { increment: 1 } },
    }).catch(() => {});

    convertPdfTool(job.id, uploadedFiles, toolDef.toolType, req.body, req.userId, chargedAmount).catch((err) => {
      console.error(`PDF tool failed for job ${job.id}:`, err);
    });

    // convertPdfTool owns the refund from here on.
    charged = 0;
    res.status(201).json({ jobId: job.id, status: 'pending' });
  } catch (err) {
    console.error('PDF tool route error:', err);
    if (charged > 0) refundCredits(req.userId, charged);
    discardUploads(req.files);
    res.status(500).json({ error: 'Failed to start PDF operation' });
  }
});

async function convertPdfTool(jobId, files, toolType, body, chargedUserId = null, chargedAmount = 0) {
  try {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });

    const tasks = {};

    if (toolType === 'pdf-merge') {
      files.forEach((_, i) => {
        tasks[`upload-${i}`] = { operation: 'import/upload' };
      });
      tasks['merge'] = {
        operation: 'merge',
        input: files.map((_, i) => `upload-${i}`),
        output_format: 'pdf',
      };
      tasks['export-file'] = { operation: 'export/url', input: ['merge'] };
    } else if (toolType === 'pdf-compress') {
      tasks['upload-file'] = { operation: 'import/upload' };
      tasks['convert-file'] = {
        operation: 'optimize',
        input: ['upload-file'],
        input_format: 'pdf',
      };
      tasks['export-file'] = { operation: 'export/url', input: ['convert-file'] };
    } else {
      // split, rotate, protect, unlock — all use convert with specific options
      tasks['upload-file'] = { operation: 'import/upload' };
      const convertTask = {
        operation: 'convert',
        input: ['upload-file'],
        input_format: 'pdf',
        output_format: 'pdf',
      };

      if (toolType === 'pdf-split' && body.pageRanges) {
        convertTask.pages = body.pageRanges;
      }
      if (toolType === 'pdf-rotate' && body.rotation) {
        convertTask.rotate = parseInt(body.rotation, 10);
      }
      if (toolType === 'pdf-protect' && body.password) {
        convertTask.password = body.password;
      }
      if (toolType === 'pdf-unlock' && body.password) {
        convertTask.input_password = body.password;
      }

      tasks['convert-file'] = convertTask;
      tasks['export-file'] = { operation: 'export/url', input: ['convert-file'] };
    }

    const ccJob = await cloudConvert.jobs.create({ tasks });

    // Upload file(s)
    if (toolType === 'pdf-merge') {
      for (let i = 0; i < files.length; i++) {
        const uploadTask = ccJob.tasks.find((t) => t.name === `upload-${i}`);
        const filePath = path.join(UPLOAD_DIR, files[i].filename);
        await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(filePath), files[i].originalname);
      }
    } else {
      const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-file');
      const filePath = path.join(UPLOAD_DIR, files[0].filename);
      await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(filePath), files[0].originalname);
    }

    const outputFilename = await downloadExportedFile(ccJob, 'pdf');

    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done', outputFile: outputFilename },
    });
  } catch (err) {
    console.error(`convertPdfTool error for job ${jobId}:`, err);
    await prisma.job.update({ where: { id: jobId }, data: { status: 'failed' } });
    // Refund the reserved credit on failure (see convertFile).
    // chargedAmount is 0 on a business plan, which is never debited and so
    // must never be credited back.
    if (chargedUserId && chargedAmount > 0) {
      prisma.user.update({
        where: { id: chargedUserId },
        data: { credits: { increment: chargedAmount } },
      }).catch(() => {});
    }
  } finally {
    // Merge takes up to 20 uploads; drop them all.
    discardUploads(files);
  }
}

// ── Photo Collage ────────────────────────────────────────────────────
// Several photos in, one grid image out. Composed locally with sharp (see
// lib/collage.js), but charged, tracked and cleaned up exactly like the
// CloudConvert tools: one credit per collage, refunded if it fails.

router.post('/collage', protect, preflightCredits, upload.array('files', LAYOUTS.auto.max), async (req, res) => {
  let charged = 0;
  const reject = (status, payload) => {
    discardUploads(req.files);
    return res.status(status).json(payload);
  };
  try {
    const uploadedFiles = req.files || [];
    const toolDef = VALID_TOOLS['photo-collage'];
    const { outputFormat } = req.body;
    const layout = req.body.layout || 'auto';
    const fit = req.body.fit || 'cover';

    if (!toolDef.outputFormats.includes(outputFormat)) {
      return reject(400, { error: `Format .${outputFormat} is not supported for this tool` });
    }
    const badType = uploadedFiles.find((f) => {
      const ext = path.extname(f.originalname).replace('.', '').toLowerCase();
      return !toolDef.inputFormats.includes(ext);
    });
    if (badType) {
      return reject(400, { error: `"${badType.originalname}" is not a supported image type`, code: 'collage_bad_type' });
    }
    const invalid = validateCollage({ layout, fit, count: uploadedFiles.length });
    if (invalid) {
      return reject(400, { error: 'Invalid collage request', code: invalid });
    }

    const charge = await chargeCredits(req.userId, 1);
    if (charge.error) {
      return reject(429, { error: charge.error.message, code: charge.error.code });
    }
    charged = charge.charged;

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: uploadedFiles.map((f) => f.filename).join(','), status: 'pending' },
    });

    prisma.toolUsage.upsert({
      where: { toolSlug: 'photo-collage' },
      create: { toolSlug: 'photo-collage', count: 1 },
      update: { count: { increment: 1 } },
    }).catch(() => {});

    const notifyUserId = req.body.notifyEmail === 'true' ? req.userId : null;
    makeCollage(job.id, uploadedFiles, { layout, fit, format: outputFormat }, notifyUserId, req.userId, charged).catch((err) => {
      console.error(`Collage failed for job ${job.id}:`, err);
    });

    // makeCollage owns the refund from here on.
    charged = 0;
    res.status(201).json({ jobId: job.id, status: 'pending' });
  } catch (err) {
    console.error('Collage route error:', err);
    if (charged > 0) refundCredits(req.userId, charged);
    discardUploads(req.files);
    res.status(500).json({ error: 'Failed to start collage' });
  }
});

async function makeCollage(jobId, files, options, notifyUserId = null, chargedUserId = null, chargedAmount = 0) {
  const outputFilename = `${newOutputBase()}.${options.format}`;
  try {
    await prisma.job.update({ where: { id: jobId }, data: { status: 'processing' } });
    await buildCollage(
      files.map((f) => path.join(UPLOAD_DIR, f.filename)),
      options,
      path.join(OUTPUT_DIR, outputFilename)
    );
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done', outputFile: outputFilename },
    });
    if (notifyUserId) {
      sendCompletionEmail(notifyUserId, jobId, `/api/download/${outputFilename}`);
    }
  } catch (err) {
    console.error(`makeCollage error for job ${jobId}:`, err);
    fs.promises.unlink(path.join(OUTPUT_DIR, outputFilename)).catch(() => {});
    await failJob(jobId, chargedUserId, chargedAmount);
  } finally {
    discardUploads(files);
  }
}

// ── Job status + download routes ─────────────────────────────────────

router.get('/jobs/:id', protect, async (req, res) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.userId !== req.userId) return res.status(403).json({ error: 'Forbidden' });

    const result = { id: job.id, status: job.status, inputFile: job.inputFile, createdAt: job.createdAt };
    if (job.status === 'done' && job.outputFile) {
      result.downloadUrl = `/api/download/${job.outputFile}`;
      // Include output file size for compression comparison
      const outputPath = path.join(OUTPUT_DIR, job.outputFile);
      try {
        const stat = fs.statSync(outputPath);
        result.outputSize = stat.size;
      } catch { /* file may have been cleaned up */ }

      // Multi-output jobs: list each file so the UI can offer them one by
      // one. Names are display names; the URL carries the real file.
      const ext = (job.extraOutputs[0] || '').split('.').pop();
      result.files = job.extraOutputs.map((f, i) => {
        const entry = { name: pageName(i, job.extraOutputs.length, ext), downloadUrl: `/api/download/${f}` };
        try { entry.size = fs.statSync(path.join(OUTPUT_DIR, f)).size; } catch { /* swept */ }
        return entry;
      });
    }
    res.json(result);
  } catch (err) {
    console.error('Job lookup error:', err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.get('/download/:filename', protect, async (req, res) => {
  try {
    const resolved = resolveOutputFile(req.params.filename);
    if (!resolved) return res.status(404).json({ error: 'File not found' });

    // The file must belong to a job owned by the requesting user. 404 rather
    // than 403 so this cannot be used to probe which filenames exist.
    const owned = await ownedOutputFiles(req.userId, [resolved.base]);
    if (!owned.has(resolved.base)) return res.status(404).json({ error: 'File not found' });

    if (!fs.existsSync(resolved.full)) return res.status(404).json({ error: 'File not found' });
    res.download(resolved.full);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

router.get('/jobs', protect, async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(jobs);
  } catch (err) {
    console.error('Jobs list error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/popular-tools — top 3 most used tools (public)
router.get('/popular-tools', async (req, res) => {
  try {
    const top = await prisma.toolUsage.findMany({
      orderBy: { count: 'desc' },
      take: 3,
    });
    res.json(top.map((t) => t.toolSlug));
  } catch {
    res.json([]);
  }
});

// POST /api/download-zip — download multiple files as a ZIP
router.post('/download-zip', protect, express.json(), async (req, res) => {
  try {
    const { filenames } = req.body;
    if (!Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ error: 'No filenames provided' });
    }

    // Sanitize every name and drop anything that escapes OUTPUT_DIR, then
    // keep only the files that belong to this user's own jobs. Resolved
    // before any bytes are written so a rejection can still be JSON.
    const resolved = filenames.map(resolveOutputFile).filter(Boolean);
    const owned = await ownedOutputFiles(req.userId, resolved.map((r) => r.base));
    const allowed = resolved.filter((r) => owned.has(r.base) && fs.existsSync(r.full));

    if (allowed.length === 0) {
      return res.status(404).json({ error: 'No matching files found' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=converted-files.zip');

    const archive = archiver('zip', { zlib: { level: 5 } });
    archive.pipe(res);

    for (const { base, full } of allowed) {
      archive.file(full, { name: base });
    }

    await archive.finalize();
  } catch (err) {
    console.error('ZIP download error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to create ZIP' });
    }
  }
});

module.exports = router;
