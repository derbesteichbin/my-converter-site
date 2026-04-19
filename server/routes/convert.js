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
    const fullUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}${downloadUrl}`;
    await resend.emails.send({
      from: 'Converter <noreply@resend.dev>',
      to: user.email,
      subject: 'Your file conversion is ready',
      html: `<p>Your file has been converted successfully.</p><p><a href="${fullUrl}">Download your file</a></p><p>This link will expire in 24 hours.</p>`,
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

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY, { sandbox: true });

// ── Helpers ──────────────────────────────────────────────────────────

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

async function checkCredits(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user.plan === 'business') return null; // unlimited

  if (user.credits <= 0) {
    return 'No conversion credits remaining. Purchase more credits to continue converting.';
  }
  return null;
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

// ── Standard file conversion ─────────────────────────────────────────

router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { outputFormat, toolSlug } = req.body;
    if (!outputFormat) {
      return res.status(400).json({ error: 'outputFormat is required' });
    }

    // Validate tool + format
    if (toolSlug) {
      const toolDef = VALID_TOOLS[toolSlug];
      if (!toolDef) {
        return res.status(400).json({ error: 'Unknown tool' });
      }
      if (!toolDef.outputFormats.includes(outputFormat)) {
        return res.status(400).json({ error: `Format .${outputFormat} is not supported for this tool` });
      }
    }

    // Check free-tier limit
    const limitError = await checkCredits(req.userId);
    if (limitError) {
      return res.status(429).json({ error: limitError });
    }

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: req.file.filename, status: 'pending' },
    });

    // Deduct credit
    prisma.user.update({
      where: { id: req.userId },
      data: { credits: { decrement: 1 } },
    }).catch(() => {});

    // Track tool usage
    if (toolSlug) {
      prisma.toolUsage.upsert({
        where: { toolSlug },
        create: { toolSlug, count: 1 },
        update: { count: { increment: 1 } },
      }).catch(() => {});
    }

    const advancedOptions = extractAdvancedOptions(req.body);

    const notifyEmail = req.body.notifyEmail === 'true';

    convertFile(job.id, req.file, outputFormat, advancedOptions, notifyEmail ? req.userId : null).catch((err) => {
      console.error(`Conversion failed for job ${job.id}:`, err);
    });

    res.status(201).json({ jobId: job.id, status: 'pending' });
  } catch (err) {
    console.error('Convert route error:', err);
    res.status(500).json({ error: 'Failed to start conversion' });
  }
});

async function convertFile(jobId, file, outputFormat, advancedOptions = {}, notifyUserId = null) {
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
  }
}

// ── PDF tool conversion (merge, split, compress, rotate, protect, unlock) ──

router.post('/pdf-tool', protect, upload.array('files', 20), async (req, res) => {
  try {
    const uploadedFiles = req.files || [];
    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { toolSlug } = req.body;
    const toolDef = VALID_TOOLS[toolSlug];
    if (!toolDef || !toolDef.toolType) {
      return res.status(400).json({ error: 'Unknown PDF tool' });
    }

    const limitError = await checkCredits(req.userId);
    if (limitError) {
      return res.status(429).json({ error: limitError });
    }

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: uploadedFiles.map((f) => f.filename).join(','), status: 'pending' },
    });

    // Deduct credit
    prisma.user.update({
      where: { id: req.userId },
      data: { credits: { decrement: 1 } },
    }).catch(() => {});

    // Track tool usage
    prisma.toolUsage.upsert({
      where: { toolSlug },
      create: { toolSlug, count: 1 },
      update: { count: { increment: 1 } },
    }).catch(() => {});

    convertPdfTool(job.id, uploadedFiles, toolDef.toolType, req.body).catch((err) => {
      console.error(`PDF tool failed for job ${job.id}:`, err);
    });

    res.status(201).json({ jobId: job.id, status: 'pending' });
  } catch (err) {
    console.error('PDF tool route error:', err);
    res.status(500).json({ error: 'Failed to start PDF operation' });
  }
});

async function convertPdfTool(jobId, files, toolType, body) {
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
    }
    res.json(result);
  } catch (err) {
    console.error('Job lookup error:', err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.get('/download/:filename', protect, async (req, res) => {
  const filePath = path.join(OUTPUT_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.download(filePath);
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

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=converted-files.zip');

    const archive = archiver('zip', { zlib: { level: 5 } });
    archive.pipe(res);

    for (const filename of filenames) {
      // Sanitize filename to prevent path traversal
      const safe = path.basename(filename);
      const filePath = path.join(OUTPUT_DIR, safe);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: safe });
      }
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
