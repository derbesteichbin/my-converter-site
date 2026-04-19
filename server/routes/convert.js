const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const CloudConvert = require('cloudconvert');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');
const { VALID_TOOLS, ALLOWED_ADVANCED_KEYS } = require('../toolsConfig');

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
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } }); // 200 MB

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

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

async function checkDailyLimit(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user.plan !== 'free') return null;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayCount = await prisma.job.count({
    where: { userId, createdAt: { gte: startOfDay } },
  });

  if (todayCount >= 5) {
    return 'Free plan limit reached — 5 conversions per day. Upgrade to Pro for unlimited conversions.';
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
    const limitError = await checkDailyLimit(req.userId);
    if (limitError) {
      return res.status(429).json({ error: limitError });
    }

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: req.file.filename, status: 'pending' },
    });

    const advancedOptions = extractAdvancedOptions(req.body);

    convertFile(job.id, req.file, outputFormat, advancedOptions).catch((err) => {
      console.error(`Conversion failed for job ${job.id}:`, err);
    });

    res.status(201).json({ jobId: job.id, status: 'pending' });
  } catch (err) {
    console.error('Convert route error:', err);
    res.status(500).json({ error: 'Failed to start conversion' });
  }
});

async function convertFile(jobId, file, outputFormat, advancedOptions = {}) {
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

    const limitError = await checkDailyLimit(req.userId);
    if (limitError) {
      return res.status(429).json({ error: limitError });
    }

    const job = await prisma.job.create({
      data: { userId: req.userId, inputFile: uploadedFiles.map((f) => f.filename).join(','), status: 'pending' },
    });

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

module.exports = router;
