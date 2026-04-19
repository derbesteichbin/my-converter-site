// ── Tool Definitions ─────────────────────────────────────────────────
// Single source of truth for all conversion tools.

export const TOOLS = [
  // ── Document ──
  { slug: 'pdf-to-word',  label: 'PDF to Word',        category: 'Document', inputFormats: ['pdf'],         outputFormats: ['docx', 'doc'],       acceptMime: '.pdf' },
  { slug: 'word-to-pdf',  label: 'Word to PDF',        category: 'Document', inputFormats: ['docx', 'doc'], outputFormats: ['pdf'],               acceptMime: '.docx,.doc' },
  { slug: 'pdf-to-excel', label: 'PDF to Excel',       category: 'Document', inputFormats: ['pdf'],         outputFormats: ['xlsx', 'csv'],       acceptMime: '.pdf' },
  { slug: 'excel-to-pdf', label: 'Excel to PDF',       category: 'Document', inputFormats: ['xlsx', 'xls'], outputFormats: ['pdf', 'csv'],        acceptMime: '.xlsx,.xls' },
  { slug: 'pptx-to-pdf',  label: 'PowerPoint to PDF',  category: 'Document', inputFormats: ['pptx', 'ppt'], outputFormats: ['pdf'],               acceptMime: '.pptx,.ppt' },
  { slug: 'pdf-to-pptx',  label: 'PDF to PowerPoint',  category: 'Document', inputFormats: ['pdf'],         outputFormats: ['pptx'],              acceptMime: '.pdf' },
  { slug: 'pdf-to-txt',   label: 'PDF to TXT',         category: 'Document', inputFormats: ['pdf'],         outputFormats: ['txt'],               acceptMime: '.pdf' },
  { slug: 'pdf-to-html',  label: 'PDF to HTML',        category: 'Document', inputFormats: ['pdf'],         outputFormats: ['html'],              acceptMime: '.pdf' },
  { slug: 'html-to-pdf',  label: 'HTML to PDF',        category: 'Document', inputFormats: ['html', 'htm'], outputFormats: ['pdf'],               acceptMime: '.html,.htm' },
  { slug: 'rtf-to-pdf',   label: 'RTF to PDF',         category: 'Document', inputFormats: ['rtf'],         outputFormats: ['pdf'],               acceptMime: '.rtf' },
  { slug: 'pdf-to-rtf',   label: 'PDF to RTF',         category: 'Document', inputFormats: ['pdf'],         outputFormats: ['rtf'],               acceptMime: '.pdf' },
  { slug: 'odt-to-pdf',   label: 'ODT to PDF',         category: 'Document', inputFormats: ['odt'],         outputFormats: ['pdf', 'docx'],       acceptMime: '.odt' },

  // ── Image ──
  { slug: 'jpg-to-png',   label: 'JPG to PNG',   category: 'Image', inputFormats: ['jpg', 'jpeg'], outputFormats: ['png', 'webp', 'bmp', 'tiff', 'gif', 'ico'], acceptMime: '.jpg,.jpeg' },
  { slug: 'png-to-jpg',   label: 'PNG to JPG',   category: 'Image', inputFormats: ['png'],         outputFormats: ['jpg', 'webp', 'bmp', 'tiff', 'gif'],        acceptMime: '.png' },
  { slug: 'webp-to-png',  label: 'WebP to PNG',  category: 'Image', inputFormats: ['webp'],        outputFormats: ['png', 'jpg', 'bmp', 'tiff', 'gif'],          acceptMime: '.webp' },
  { slug: 'webp-to-jpg',  label: 'WebP to JPG',  category: 'Image', inputFormats: ['webp'],        outputFormats: ['jpg', 'png', 'bmp'],                         acceptMime: '.webp' },
  { slug: 'heic-to-jpg',  label: 'HEIC to JPG',  category: 'Image', inputFormats: ['heic', 'heif'], outputFormats: ['jpg', 'png', 'webp'],                       acceptMime: '.heic,.heif' },
  { slug: 'heic-to-png',  label: 'HEIC to PNG',  category: 'Image', inputFormats: ['heic', 'heif'], outputFormats: ['png', 'jpg', 'webp'],                       acceptMime: '.heic,.heif' },
  { slug: 'svg-to-png',   label: 'SVG to PNG',   category: 'Image', inputFormats: ['svg'],         outputFormats: ['png', 'jpg', 'webp'],                        acceptMime: '.svg' },
  { slug: 'svg-to-jpg',   label: 'SVG to JPG',   category: 'Image', inputFormats: ['svg'],         outputFormats: ['jpg', 'png', 'webp'],                        acceptMime: '.svg' },
  { slug: 'bmp-to-png',   label: 'BMP to PNG',   category: 'Image', inputFormats: ['bmp'],         outputFormats: ['png', 'jpg', 'webp'],                        acceptMime: '.bmp' },
  { slug: 'tiff-to-jpg',  label: 'TIFF to JPG',  category: 'Image', inputFormats: ['tiff', 'tif'], outputFormats: ['jpg', 'png', 'webp'],                        acceptMime: '.tiff,.tif' },
  { slug: 'gif-to-png',   label: 'GIF to PNG',   category: 'Image', inputFormats: ['gif'],         outputFormats: ['png', 'jpg', 'webp'],                        acceptMime: '.gif' },
  { slug: 'png-to-ico',   label: 'PNG to ICO',   category: 'Image', inputFormats: ['png'],         outputFormats: ['ico'],                                       acceptMime: '.png' },

  // ── Video ──
  { slug: 'mp4-to-avi',   label: 'MP4 to AVI',   category: 'Video', inputFormats: ['mp4'],  outputFormats: ['avi', 'mov', 'mkv', 'webm', 'wmv'],  acceptMime: '.mp4' },
  { slug: 'mp4-to-mov',   label: 'MP4 to MOV',   category: 'Video', inputFormats: ['mp4'],  outputFormats: ['mov', 'avi', 'mkv', 'webm'],          acceptMime: '.mp4' },
  { slug: 'mov-to-mp4',   label: 'MOV to MP4',   category: 'Video', inputFormats: ['mov'],  outputFormats: ['mp4', 'avi', 'mkv', 'webm'],          acceptMime: '.mov' },
  { slug: 'mkv-to-mp4',   label: 'MKV to MP4',   category: 'Video', inputFormats: ['mkv'],  outputFormats: ['mp4', 'avi', 'mov', 'webm'],          acceptMime: '.mkv' },
  { slug: 'webm-to-mp4',  label: 'WebM to MP4',  category: 'Video', inputFormats: ['webm'], outputFormats: ['mp4', 'avi', 'mov', 'mkv'],           acceptMime: '.webm' },
  { slug: 'avi-to-mp4',   label: 'AVI to MP4',   category: 'Video', inputFormats: ['avi'],  outputFormats: ['mp4', 'mov', 'mkv', 'webm'],          acceptMime: '.avi' },
  { slug: 'flv-to-mp4',   label: 'FLV to MP4',   category: 'Video', inputFormats: ['flv'],  outputFormats: ['mp4', 'avi', 'mov', 'webm'],          acceptMime: '.flv' },
  { slug: 'wmv-to-mp4',   label: 'WMV to MP4',   category: 'Video', inputFormats: ['wmv'],  outputFormats: ['mp4', 'avi', 'mov', 'webm'],          acceptMime: '.wmv' },
  { slug: 'mp4-to-mp3',   label: 'MP4 to MP3',   category: 'Video', inputFormats: ['mp4'],  outputFormats: ['mp3', 'wav', 'aac', 'ogg', 'flac'],   acceptMime: '.mp4' },

  // ── Audio ──
  { slug: 'mp3-to-wav',   label: 'MP3 to WAV',   category: 'Audio', inputFormats: ['mp3'],  outputFormats: ['wav', 'ogg', 'flac', 'aac', 'm4a'],  acceptMime: '.mp3' },
  { slug: 'wav-to-mp3',   label: 'WAV to MP3',   category: 'Audio', inputFormats: ['wav'],  outputFormats: ['mp3', 'ogg', 'flac', 'aac', 'm4a'],  acceptMime: '.wav' },
  { slug: 'flac-to-mp3',  label: 'FLAC to MP3',  category: 'Audio', inputFormats: ['flac'], outputFormats: ['mp3', 'wav', 'ogg', 'aac', 'm4a'],   acceptMime: '.flac' },
  { slug: 'aac-to-mp3',   label: 'AAC to MP3',   category: 'Audio', inputFormats: ['aac'],  outputFormats: ['mp3', 'wav', 'ogg', 'flac'],          acceptMime: '.aac' },
  { slug: 'ogg-to-mp3',   label: 'OGG to MP3',   category: 'Audio', inputFormats: ['ogg'],  outputFormats: ['mp3', 'wav', 'flac', 'aac'],          acceptMime: '.ogg' },
  { slug: 'wma-to-mp3',   label: 'WMA to MP3',   category: 'Audio', inputFormats: ['wma'],  outputFormats: ['mp3', 'wav', 'ogg', 'flac'],          acceptMime: '.wma' },
  { slug: 'm4a-to-mp3',   label: 'M4A to MP3',   category: 'Audio', inputFormats: ['m4a'],  outputFormats: ['mp3', 'wav', 'ogg', 'flac'],          acceptMime: '.m4a' },
  { slug: 'mp3-to-aac',   label: 'MP3 to AAC',   category: 'Audio', inputFormats: ['mp3'],  outputFormats: ['aac', 'wav', 'ogg', 'flac', 'm4a'],   acceptMime: '.mp3' },

  // ── Archive ──
  { slug: 'rar-to-zip',  label: 'RAR to ZIP',  category: 'Archive', inputFormats: ['rar'], outputFormats: ['zip', '7z'],        acceptMime: '.rar' },
  { slug: '7z-to-zip',   label: '7Z to ZIP',   category: 'Archive', inputFormats: ['7z'],  outputFormats: ['zip'],              acceptMime: '.7z' },
  { slug: 'tar-to-zip',  label: 'TAR to ZIP',  category: 'Archive', inputFormats: ['tar'], outputFormats: ['zip', '7z'],        acceptMime: '.tar' },
  { slug: 'gz-to-zip',   label: 'GZ to ZIP',   category: 'Archive', inputFormats: ['gz'],  outputFormats: ['zip', '7z', 'tar'], acceptMime: '.gz' },
  { slug: 'zip-to-7z',   label: 'ZIP to 7Z',   category: 'Archive', inputFormats: ['zip'], outputFormats: ['7z', 'tar'],        acceptMime: '.zip' },

  // ── PDF Tools ──
  { slug: 'merge-pdf',    label: 'Merge PDF',    category: 'PDF Tools', inputFormats: ['pdf'], outputFormats: ['pdf'], acceptMime: '.pdf', toolType: 'pdf-merge',    multipleFiles: true },
  { slug: 'split-pdf',    label: 'Split PDF',    category: 'PDF Tools', inputFormats: ['pdf'], outputFormats: ['pdf'], acceptMime: '.pdf', toolType: 'pdf-split',    extraFields: ['pageRanges'] },
  { slug: 'compress-pdf', label: 'Compress PDF', category: 'PDF Tools', inputFormats: ['pdf'], outputFormats: ['pdf'], acceptMime: '.pdf', toolType: 'pdf-compress' },
  { slug: 'rotate-pdf',   label: 'Rotate PDF',   category: 'PDF Tools', inputFormats: ['pdf'], outputFormats: ['pdf'], acceptMime: '.pdf', toolType: 'pdf-rotate',   extraFields: ['rotation'] },
  { slug: 'protect-pdf',  label: 'Protect PDF',  category: 'PDF Tools', inputFormats: ['pdf'], outputFormats: ['pdf'], acceptMime: '.pdf', toolType: 'pdf-protect',  extraFields: ['password'] },
  { slug: 'unlock-pdf',   label: 'Unlock PDF',   category: 'PDF Tools', inputFormats: ['pdf'], outputFormats: ['pdf'], acceptMime: '.pdf', toolType: 'pdf-unlock',   extraFields: ['password'] },

  // ── Utilities ──
  { slug: 'view-metadata', label: 'File Info', category: 'Utilities', toolType: 'metadata' },
];

// ── Advanced Settings (per category) ─────────────────────────────────
export const ADVANCED_SETTINGS = {
  Document: [
    { key: 'ocr',          label: 'Enable OCR',   type: 'checkbox', default: false },
    { key: 'ocr_language', label: 'OCR Language',  type: 'select',   options: ['english', 'german', 'french', 'spanish', 'italian', 'portuguese', 'chinese', 'japanese', 'korean'], dependsOn: 'ocr' },
  ],
  Image: [
    { key: 'width',   label: 'Width (px)',     type: 'number', placeholder: 'Auto' },
    { key: 'height',  label: 'Height (px)',    type: 'number', placeholder: 'Auto' },
    { key: 'quality', label: 'Quality (1-100)', type: 'number', min: 1, max: 100, placeholder: '85' },
    { key: 'fit',     label: 'Resize mode',    type: 'select', options: ['max', 'crop', 'stretch'] },
  ],
  Video: [
    { key: 'resolution',  label: 'Resolution',   type: 'select', options: ['original', '1080p', '720p', '480p', '360p'] },
    { key: 'video_codec', label: 'Video Codec',   type: 'select', options: ['auto', 'h264', 'h265', 'vp9'] },
    { key: 'fps',         label: 'Frame Rate',    type: 'number', placeholder: 'Auto' },
  ],
  Audio: [
    { key: 'audio_bitrate',   label: 'Bitrate',     type: 'select', options: ['auto', '128k', '192k', '256k', '320k'] },
    { key: 'audio_frequency', label: 'Sample Rate',  type: 'select', options: ['auto', '44100', '48000'] },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────
export function getToolBySlug(slug) {
  return TOOLS.find((t) => t.slug === slug) || null;
}

export const CATEGORY_ORDER = ['Document', 'Image', 'Video', 'Audio', 'Archive', 'PDF Tools', 'Utilities'];

export function getCategories() {
  return CATEGORY_ORDER.filter((cat) => TOOLS.some((t) => t.category === cat));
}
