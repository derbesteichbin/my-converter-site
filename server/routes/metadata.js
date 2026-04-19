const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const exifr = require('exifr');
const { PDFDocument } = require('pdf-lib');
const mm = require('music-metadata');
const { protect } = require('../middleware/auth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `meta-${Date.now()}-${unique}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

// POST /api/metadata — extract metadata from an uploaded file
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(UPLOAD_DIR, req.file.filename);
    const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const stat = fs.statSync(filePath);

    const metadata = {
      fileName: req.file.originalname,
      fileSize: stat.size,
      fileSizeFormatted: formatBytes(stat.size),
      format: ext.toUpperCase(),
      mimeType: req.file.mimetype,
      lastModified: stat.mtime.toISOString(),
    };

    // PDF metadata
    if (ext === 'pdf') {
      try {
        const pdfBytes = fs.readFileSync(filePath);
        const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        metadata.pageCount = pdf.getPageCount();
        metadata.title = pdf.getTitle() || null;
        metadata.author = pdf.getAuthor() || null;
        metadata.subject = pdf.getSubject() || null;
        metadata.creator = pdf.getCreator() || null;
        metadata.producer = pdf.getProducer() || null;
        metadata.creationDate = pdf.getCreationDate()?.toISOString() || null;
        metadata.modificationDate = pdf.getModificationDate()?.toISOString() || null;

        const firstPage = pdf.getPage(0);
        const { width, height } = firstPage.getSize();
        metadata.pageWidth = Math.round(width);
        metadata.pageHeight = Math.round(height);
      } catch (err) {
        metadata.pdfError = 'Could not read PDF metadata';
      }
    }

    // Image metadata (EXIF)
    if (['jpg', 'jpeg', 'png', 'tiff', 'tif', 'heic', 'heif', 'webp', 'avif'].includes(ext)) {
      try {
        const exif = await exifr.parse(filePath, { translateValues: true, translateKeys: true });
        if (exif) {
          if (exif.ImageWidth) metadata.width = exif.ImageWidth;
          if (exif.ImageHeight) metadata.height = exif.ImageHeight;
          if (exif.ExifImageWidth) metadata.width = metadata.width || exif.ExifImageWidth;
          if (exif.ExifImageHeight) metadata.height = metadata.height || exif.ExifImageHeight;
          if (exif.Make) metadata.cameraMake = exif.Make;
          if (exif.Model) metadata.cameraModel = exif.Model;
          if (exif.DateTimeOriginal) metadata.dateTaken = exif.DateTimeOriginal;
          if (exif.ISO || exif.ISOSpeedRatings) metadata.iso = exif.ISO || exif.ISOSpeedRatings;
          if (exif.FocalLength) metadata.focalLength = exif.FocalLength;
          if (exif.ExposureTime) metadata.exposureTime = exif.ExposureTime;
          if (exif.FNumber) metadata.aperture = `f/${exif.FNumber}`;
          if (exif.GPSLatitude) metadata.gpsLatitude = exif.GPSLatitude;
          if (exif.GPSLongitude) metadata.gpsLongitude = exif.GPSLongitude;
          if (exif.ColorSpace) metadata.colorSpace = exif.ColorSpace;
          if (exif.BitsPerSample) metadata.bitDepth = exif.BitsPerSample;
        }
      } catch {
        // No EXIF data available
      }
    }

    // Audio/video metadata via music-metadata
    const mediaExts = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'm4a'];
    if (mediaExts.includes(ext)) {
      const audioExts = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'm4a'];
      metadata.mediaType = audioExts.includes(ext) ? 'Audio' : 'Video';
      try {
        const mmData = await mm.parseFile(filePath);
        if (mmData.format.duration) {
          const secs = Math.round(mmData.format.duration);
          const mins = Math.floor(secs / 60);
          const rem = secs % 60;
          metadata.duration = `${mins}:${rem.toString().padStart(2, '0')}`;
          metadata.durationSeconds = secs;
        }
        if (mmData.format.sampleRate) metadata.sampleRate = mmData.format.sampleRate;
        if (mmData.format.bitrate) metadata.bitrate = Math.round(mmData.format.bitrate / 1000) + ' kbps';
        if (mmData.format.numberOfChannels) metadata.channels = mmData.format.numberOfChannels === 2 ? 'Stereo' : 'Mono';
        if (mmData.format.codec) metadata.codec = mmData.format.codec;
        if (mmData.common.title) metadata.title = mmData.common.title;
        if (mmData.common.artist) metadata.artist = mmData.common.artist;
        if (mmData.common.album) metadata.album = mmData.common.album;
        if (mmData.common.year) metadata.year = mmData.common.year;
        if (mmData.common.genre?.length) metadata.genre = mmData.common.genre.join(', ');
      } catch {
        // Could not parse media metadata
      }
    }

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.json(metadata);
  } catch (err) {
    console.error('Metadata extraction error:', err);
    res.status(500).json({ error: 'Failed to extract metadata' });
  }
});

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

module.exports = router;
