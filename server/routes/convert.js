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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${unique}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

// POST /api/convert — upload a file and start conversion
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { outputFormat } = req.body;
    if (!outputFormat) {
      return res.status(400).json({ error: 'outputFormat is required' });
    }

    // Check free-tier daily limit (5 conversions per day)
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (user.plan === 'free') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayCount = await prisma.job.count({
        where: {
          userId: req.userId,
          createdAt: { gte: startOfDay },
        },
      });

      if (todayCount >= 5) {
        return res.status(429).json({
          error: 'Free plan limit reached — 5 conversions per day. Upgrade to Pro for unlimited conversions.',
        });
      }
    }

    // Create a pending job in the database
    const job = await prisma.job.create({
      data: {
        userId: req.userId,
        inputFile: req.file.filename,
        status: 'pending',
      },
    });

    // Run the CloudConvert pipeline in the background
    convertFile(job.id, req.file, outputFormat).catch((err) => {
      console.error(`Conversion failed for job ${job.id}:`, err);
    });

    res.status(201).json({ jobId: job.id, status: 'pending' });
  } catch (err) {
    console.error('Convert route error:', err);
    res.status(500).json({ error: 'Failed to start conversion' });
  }
});

// GET /api/jobs/:id — job status + download URL
router.get('/jobs/:id', protect, async (req, res) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.userId !== req.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const result = {
      id: job.id,
      status: job.status,
      inputFile: job.inputFile,
      createdAt: job.createdAt,
    };

    if (job.status === 'done' && job.outputFile) {
      result.downloadUrl = `/api/download/${job.outputFile}`;
    }

    res.json(result);
  } catch (err) {
    console.error('Job lookup error:', err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// GET /api/download/:filename — serve the converted file
router.get('/download/:filename', protect, async (req, res) => {
  const filePath = path.join(OUTPUT_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.download(filePath);
});

// GET /api/jobs — list all jobs for the logged-in user
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

async function convertFile(jobId, file, outputFormat) {
  try {
    // Update status to processing
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'processing' },
    });

    const inputExt = path.extname(file.originalname).replace('.', '');
    const filePath = path.join(UPLOAD_DIR, file.filename);

    // 1. Create a CloudConvert job: upload → convert → export
    const ccJob = await cloudConvert.jobs.create({
      tasks: {
        'upload-file': {
          operation: 'import/upload',
        },
        'convert-file': {
          operation: 'convert',
          input: ['upload-file'],
          input_format: inputExt,
          output_format: outputFormat,
        },
        'export-file': {
          operation: 'export/url',
          input: ['convert-file'],
        },
      },
    });

    // 2. Upload the local file to CloudConvert
    const uploadTask = ccJob.tasks.find((t) => t.name === 'upload-file');
    await cloudConvert.tasks.upload(uploadTask, fs.createReadStream(filePath), file.originalname);

    // 3. Wait for the job to finish
    const finished = await cloudConvert.jobs.wait(ccJob.id);

    // 4. Download the exported file
    const exportTask = finished.tasks.find(
      (t) => t.name === 'export-file' && t.status === 'finished'
    );

    if (!exportTask || !exportTask.result || !exportTask.result.files || !exportTask.result.files[0]) {
      throw new Error('CloudConvert export task failed or returned no files');
    }

    const exportedFile = exportTask.result.files[0];
    const outputFilename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${outputFormat}`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    const response = await fetch(exportedFile.url);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);

    // 5. Mark job as done
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'done', outputFile: outputFilename },
    });
  } catch (err) {
    console.error(`convertFile error for job ${jobId}:`, err);
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'failed' },
    });
  }
}

module.exports = router;
