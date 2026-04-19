// Server-side validation map for all supported tools.
// Mirrors client/src/toolsConfig.js — keep in sync when adding tools.

const VALID_TOOLS = {
  // Document
  'pdf-to-word':  { inputFormats: ['pdf'],         outputFormats: ['docx', 'doc'] },
  'word-to-pdf':  { inputFormats: ['docx', 'doc'], outputFormats: ['pdf'] },
  'pdf-to-excel': { inputFormats: ['pdf'],         outputFormats: ['xlsx', 'csv'] },
  'excel-to-pdf': { inputFormats: ['xlsx', 'xls'], outputFormats: ['pdf', 'csv'] },
  'pptx-to-pdf':  { inputFormats: ['pptx', 'ppt'], outputFormats: ['pdf'] },
  'pdf-to-pptx':  { inputFormats: ['pdf'],         outputFormats: ['pptx'] },
  'pdf-to-txt':   { inputFormats: ['pdf'],         outputFormats: ['txt'] },
  'pdf-to-html':  { inputFormats: ['pdf'],         outputFormats: ['html'] },
  'html-to-pdf':  { inputFormats: ['html', 'htm'], outputFormats: ['pdf'] },
  'rtf-to-pdf':   { inputFormats: ['rtf'],         outputFormats: ['pdf'] },
  'pdf-to-rtf':   { inputFormats: ['pdf'],         outputFormats: ['rtf'] },
  'odt-to-pdf':   { inputFormats: ['odt'],         outputFormats: ['pdf', 'docx'] },

  // Image
  'jpg-to-png':   { inputFormats: ['jpg', 'jpeg'], outputFormats: ['png', 'webp', 'bmp', 'tiff', 'gif', 'ico'] },
  'png-to-jpg':   { inputFormats: ['png'],         outputFormats: ['jpg', 'webp', 'bmp', 'tiff', 'gif'] },
  'webp-to-png':  { inputFormats: ['webp'],        outputFormats: ['png', 'jpg', 'bmp', 'tiff', 'gif'] },
  'webp-to-jpg':  { inputFormats: ['webp'],        outputFormats: ['jpg', 'png', 'bmp'] },
  'heic-to-jpg':  { inputFormats: ['heic', 'heif'], outputFormats: ['jpg', 'png', 'webp'] },
  'heic-to-png':  { inputFormats: ['heic', 'heif'], outputFormats: ['png', 'jpg', 'webp'] },
  'svg-to-png':   { inputFormats: ['svg'],         outputFormats: ['png', 'jpg', 'webp'] },
  'svg-to-jpg':   { inputFormats: ['svg'],         outputFormats: ['jpg', 'png', 'webp'] },
  'bmp-to-png':   { inputFormats: ['bmp'],         outputFormats: ['png', 'jpg', 'webp'] },
  'tiff-to-jpg':  { inputFormats: ['tiff', 'tif'], outputFormats: ['jpg', 'png', 'webp'] },
  'gif-to-png':   { inputFormats: ['gif'],         outputFormats: ['png', 'jpg', 'webp'] },
  'png-to-ico':   { inputFormats: ['png'],         outputFormats: ['ico'] },

  // Video
  'mp4-to-avi':   { inputFormats: ['mp4'],  outputFormats: ['avi', 'mov', 'mkv', 'webm', 'wmv'] },
  'mp4-to-mov':   { inputFormats: ['mp4'],  outputFormats: ['mov', 'avi', 'mkv', 'webm'] },
  'mov-to-mp4':   { inputFormats: ['mov'],  outputFormats: ['mp4', 'avi', 'mkv', 'webm'] },
  'mkv-to-mp4':   { inputFormats: ['mkv'],  outputFormats: ['mp4', 'avi', 'mov', 'webm'] },
  'webm-to-mp4':  { inputFormats: ['webm'], outputFormats: ['mp4', 'avi', 'mov', 'mkv'] },
  'avi-to-mp4':   { inputFormats: ['avi'],  outputFormats: ['mp4', 'mov', 'mkv', 'webm'] },
  'flv-to-mp4':   { inputFormats: ['flv'],  outputFormats: ['mp4', 'avi', 'mov', 'webm'] },
  'wmv-to-mp4':   { inputFormats: ['wmv'],  outputFormats: ['mp4', 'avi', 'mov', 'webm'] },
  'mp4-to-mp3':   { inputFormats: ['mp4'],  outputFormats: ['mp3', 'wav', 'aac', 'ogg', 'flac'] },

  // Audio
  'mp3-to-wav':   { inputFormats: ['mp3'],  outputFormats: ['wav', 'ogg', 'flac', 'aac', 'm4a'] },
  'wav-to-mp3':   { inputFormats: ['wav'],  outputFormats: ['mp3', 'ogg', 'flac', 'aac', 'm4a'] },
  'flac-to-mp3':  { inputFormats: ['flac'], outputFormats: ['mp3', 'wav', 'ogg', 'aac', 'm4a'] },
  'aac-to-mp3':   { inputFormats: ['aac'],  outputFormats: ['mp3', 'wav', 'ogg', 'flac'] },
  'ogg-to-mp3':   { inputFormats: ['ogg'],  outputFormats: ['mp3', 'wav', 'flac', 'aac'] },
  'wma-to-mp3':   { inputFormats: ['wma'],  outputFormats: ['mp3', 'wav', 'ogg', 'flac'] },
  'm4a-to-mp3':   { inputFormats: ['m4a'],  outputFormats: ['mp3', 'wav', 'ogg', 'flac'] },
  'mp3-to-aac':   { inputFormats: ['mp3'],  outputFormats: ['aac', 'wav', 'ogg', 'flac', 'm4a'] },

  // Archive
  'rar-to-zip':  { inputFormats: ['rar'], outputFormats: ['zip', '7z'] },
  '7z-to-zip':   { inputFormats: ['7z'],  outputFormats: ['zip'] },
  'tar-to-zip':  { inputFormats: ['tar'], outputFormats: ['zip', '7z'] },
  'gz-to-zip':   { inputFormats: ['gz'],  outputFormats: ['zip', '7z', 'tar'] },
  'zip-to-7z':   { inputFormats: ['zip'], outputFormats: ['7z', 'tar'] },

  // PDF Tools
  'merge-pdf':    { inputFormats: ['pdf'], outputFormats: ['pdf'], toolType: 'pdf-merge' },
  'split-pdf':    { inputFormats: ['pdf'], outputFormats: ['pdf'], toolType: 'pdf-split' },
  'compress-pdf': { inputFormats: ['pdf'], outputFormats: ['pdf'], toolType: 'pdf-compress' },
  'rotate-pdf':   { inputFormats: ['pdf'], outputFormats: ['pdf'], toolType: 'pdf-rotate' },
  'protect-pdf':  { inputFormats: ['pdf'], outputFormats: ['pdf'], toolType: 'pdf-protect' },
  'unlock-pdf':   { inputFormats: ['pdf'], outputFormats: ['pdf'], toolType: 'pdf-unlock' },
};

// Allowed advanced setting keys (whitelist for sanitizing request body)
const ALLOWED_ADVANCED_KEYS = [
  'ocr', 'ocr_language',
  'width', 'height', 'quality', 'fit',
  'resolution', 'video_codec', 'fps',
  'audio_bitrate', 'audio_frequency',
];

module.exports = { VALID_TOOLS, ALLOWED_ADVANCED_KEYS };
