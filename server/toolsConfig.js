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

  // Smart Functions
  'ocr':             { inputFormats: ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'tif'], outputFormats: ['pdf', 'txt'] },
  'pdf-compress-ai': { inputFormats: ['pdf'], outputFormats: ['pdf'], toolType: 'pdf-compress' },
  'text-to-speech':  { inputFormats: ['txt'], outputFormats: ['mp3', 'opus', 'aac'], toolType: 'smart' },
  'speech-to-text':  { inputFormats: ['mp3', 'wav', 'm4a', 'ogg', 'mp4', 'webm'], outputFormats: ['txt', 'docx'], toolType: 'smart' },
  'auto-subtitle':   { inputFormats: ['mp4', 'mov', 'avi', 'mkv'], outputFormats: ['srt', 'vtt'], toolType: 'smart' },

  // Added: Audio
  'mp3-to-ogg':      { inputFormats: ['mp3'], outputFormats: ['ogg', 'wav', 'flac', 'aac'] },
  'audio-converter': { inputFormats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'aiff'], outputFormats: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'] },

  // Added: Video
  'video-to-mp3':    { inputFormats: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v'], outputFormats: ['mp3', 'wav', 'aac', 'ogg', 'flac'] },
  'mp4-converter':   { inputFormats: ['mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v', 'mpeg', 'mpg', '3gp'], outputFormats: ['mp4'] },
  'video-converter': { inputFormats: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'm4v'], outputFormats: ['mp4', 'avi', 'mov', 'mkv', 'webm'] },

  // Added: Image
  'jfif-to-png':      { inputFormats: ['jfif'], outputFormats: ['png', 'jpg', 'webp'] },
  'heic-to-pdf':      { inputFormats: ['heic', 'heif'], outputFormats: ['pdf'] },
  'image-compressor': { inputFormats: ['jpg', 'jpeg', 'png', 'gif'], outputFormats: ['jpg'], toolType: 'compress' },
  'jpeg-compressor':  { inputFormats: ['jpg', 'jpeg'], outputFormats: ['jpg'], toolType: 'compress' },
  'png-compressor':   { inputFormats: ['png'], outputFormats: ['png'], toolType: 'compress' },

  // Added: Document / Ebook
  'pdf-to-epub':        { inputFormats: ['pdf'], outputFormats: ['epub'] },
  'epub-to-pdf':        { inputFormats: ['epub'], outputFormats: ['pdf', 'docx'] },
  'document-converter': { inputFormats: ['docx', 'doc', 'odt', 'rtf', 'txt', 'html', 'pdf'], outputFormats: ['pdf', 'docx', 'txt', 'html', 'rtf'] },
  'ebook-converter':    { inputFormats: ['epub', 'mobi', 'azw3', 'fb2', 'lit', 'lrf'], outputFormats: ['epub', 'pdf', 'mobi', 'azw3', 'fb2'] },

  // Added: GIF
  'video-to-gif':   { inputFormats: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'], outputFormats: ['gif'] },
  'mp4-to-gif':     { inputFormats: ['mp4'], outputFormats: ['gif'] },
  'webm-to-gif':    { inputFormats: ['webm'], outputFormats: ['gif'] },
  'mov-to-gif':     { inputFormats: ['mov'], outputFormats: ['gif'] },
  'avi-to-gif':     { inputFormats: ['avi'], outputFormats: ['gif'] },
  'gif-to-mp4':     { inputFormats: ['gif'], outputFormats: ['mp4', 'webm'] },
  'image-to-gif':   { inputFormats: ['jpg', 'jpeg', 'png', 'webp', 'bmp'], outputFormats: ['gif'] },
  'gif-compressor': { inputFormats: ['gif'], outputFormats: ['gif'], toolType: 'compress' },

  // Added: everyday pairs (image). JPEG and JPG are one format, so those two
  // are a lossless rename on our side rather than a CloudConvert re-encode.
  'jpeg-to-jpg':  { inputFormats: ['jpeg'], outputFormats: ['jpg'],  toolType: 'rename' },
  'jpg-to-jpeg':  { inputFormats: ['jpg'],  outputFormats: ['jpeg'], toolType: 'rename' },
  'jpg-to-webp':  { inputFormats: ['jpg', 'jpeg'], outputFormats: ['webp', 'png'] },
  'png-to-webp':  { inputFormats: ['png'],  outputFormats: ['webp', 'jpg'] },
  'avif-to-jpg':  { inputFormats: ['avif'], outputFormats: ['jpg', 'png', 'webp'] },
  'avif-to-png':  { inputFormats: ['avif'], outputFormats: ['png', 'jpg', 'webp'] },
  'bmp-to-jpg':   { inputFormats: ['bmp'],  outputFormats: ['jpg', 'png', 'webp'] },
  'tiff-to-png':  { inputFormats: ['tiff', 'tif'], outputFormats: ['png', 'jpg', 'webp'] },
  'ico-to-png':   { inputFormats: ['ico'],  outputFormats: ['png', 'jpg'] },
  'gif-to-jpg':   { inputFormats: ['gif'],  outputFormats: ['jpg', 'png', 'webp'] },
  'jpg-to-pdf':   { inputFormats: ['jpg', 'jpeg'], outputFormats: ['pdf'] },
  'png-to-pdf':   { inputFormats: ['png'],  outputFormats: ['pdf'] },

  // Added: everyday pairs (document)
  'txt-to-pdf':      { inputFormats: ['txt'], outputFormats: ['pdf', 'docx'] },
  'markdown-to-pdf': { inputFormats: ['md'], outputFormats: ['pdf', 'html', 'docx'] },
  'csv-to-excel':    { inputFormats: ['csv'], outputFormats: ['xlsx', 'pdf'] },
  'excel-to-csv':    { inputFormats: ['xlsx', 'xls'], outputFormats: ['csv'] },
  'word-to-txt':     { inputFormats: ['docx', 'doc'], outputFormats: ['txt'] },

  // Added: everyday pairs (video)
  'mp4-to-webm':  { inputFormats: ['mp4'],  outputFormats: ['webm', 'mkv', 'mov'] },
  'mp4-to-mkv':   { inputFormats: ['mp4'],  outputFormats: ['mkv', 'webm', 'mov'] },
  'm4v-to-mp4':   { inputFormats: ['m4v'],  outputFormats: ['mp4', 'mov'] },
  '3gp-to-mp4':   { inputFormats: ['3gp'],  outputFormats: ['mp4', 'avi'] },
  'mpeg-to-mp4':  { inputFormats: ['mpeg', 'mpg'], outputFormats: ['mp4', 'avi'] },

  // Added: everyday pairs (audio)
  'm4a-to-wav':   { inputFormats: ['m4a'],  outputFormats: ['wav', 'flac', 'mp3'] },
  'flac-to-wav':  { inputFormats: ['flac'], outputFormats: ['wav', 'mp3'] },
  'wav-to-flac':  { inputFormats: ['wav'],  outputFormats: ['flac', 'mp3'] },
  'aiff-to-mp3':  { inputFormats: ['aiff', 'aif'], outputFormats: ['mp3', 'wav', 'flac'] },
  'opus-to-mp3':  { inputFormats: ['opus'], outputFormats: ['mp3', 'wav', 'ogg'] },
  'mp3-to-m4a':   { inputFormats: ['mp3'],  outputFormats: ['m4a', 'aac'] },

  // Added: everyday pairs (archive)
  'zip-to-tar':   { inputFormats: ['zip'], outputFormats: ['tar', '7z'] },
  'rar-to-7z':    { inputFormats: ['rar'], outputFormats: ['7z', 'zip'] },

  // Social Media. pdf-to-images returns one image per page plus a ZIP;
  // photo-collage is composed locally with sharp (no CloudConvert).
  'pdf-to-images': { inputFormats: ['pdf'], outputFormats: ['jpg', 'png'], toolType: 'pdf-images' },
  'photo-collage': { inputFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'tiff', 'tif'], outputFormats: ['jpg', 'png'], toolType: 'collage' },
};

// Allowed advanced setting keys (whitelist for sanitizing request body)
const ALLOWED_ADVANCED_KEYS = [
  'ocr', 'ocr_language',
  'width', 'height', 'quality', 'fit',
  'resolution', 'video_codec', 'fps',
  'audio_bitrate', 'audio_frequency',
];

module.exports = { VALID_TOOLS, ALLOWED_ADVANCED_KEYS };
