// ── Structural format metadata (language-independent) ────────────────
//
// Everything here is a *fact* about the format, not prose: what family it
// belongs to, whether its compression is lossy or lossless, whether it can
// carry transparency, whether text reflows in it. The engine branches on
// these flags to decide which sentence to compose; the prose that fills those
// sentences lives in the per-language packs under ./packs/.
//
// `name` is deliberately not translated — PDF is PDF in every language.

export const FORMATS = {
  // ── Documents ──
  pdf:  { name: 'PDF',  family: 'document', codec: null,   fixedLayout: true },
  docx: { name: 'DOCX', family: 'document', codec: null,   editable: true },
  doc:  { name: 'DOC',  family: 'document', codec: null,   editable: true },
  xlsx: { name: 'XLSX', family: 'document', codec: null,   editable: true },
  xls:  { name: 'XLS',  family: 'document', codec: null,   editable: true },
  csv:  { name: 'CSV',  family: 'document', codec: 'text' },
  pptx: { name: 'PPTX', family: 'document', codec: null,   editable: true },
  ppt:  { name: 'PPT',  family: 'document', codec: null,   editable: true },
  txt:  { name: 'TXT',  family: 'document', codec: 'text' },
  html: { name: 'HTML', family: 'document', codec: 'text' },
  htm:  { name: 'HTM',  family: 'document', codec: 'text' },
  rtf:  { name: 'RTF',  family: 'document', codec: null,   editable: true },
  odt:  { name: 'ODT',  family: 'document', codec: null,   editable: true },

  // ── Ebooks ──
  epub: { name: 'EPUB', family: 'ebook', codec: null, reflow: true },
  mobi: { name: 'MOBI', family: 'ebook', codec: null, reflow: true },
  azw3: { name: 'AZW3', family: 'ebook', codec: null, reflow: true },
  fb2:  { name: 'FB2',  family: 'ebook', codec: null, reflow: true },
  lit:  { name: 'LIT',  family: 'ebook', codec: null, reflow: true },
  lrf:  { name: 'LRF',  family: 'ebook', codec: null, reflow: true },

  // ── Images ──
  jpg:  { name: 'JPG',  family: 'image', codec: 'lossy' },
  jpeg: { name: 'JPEG', family: 'image', codec: 'lossy' },
  jfif: { name: 'JFIF', family: 'image', codec: 'lossy' },
  png:  { name: 'PNG',  family: 'image', codec: 'lossless', alpha: true },
  webp: { name: 'WebP', family: 'image', codec: 'lossy',    alpha: true },
  bmp:  { name: 'BMP',  family: 'image', codec: 'lossless' },
  tiff: { name: 'TIFF', family: 'image', codec: 'lossless' },
  tif:  { name: 'TIF',  family: 'image', codec: 'lossless' },
  gif:  { name: 'GIF',  family: 'image', codec: 'lossless', animated: true, palette: 256 },
  ico:  { name: 'ICO',  family: 'image', codec: 'lossless', alpha: true },
  heic: { name: 'HEIC', family: 'image', codec: 'lossy' },
  heif: { name: 'HEIF', family: 'image', codec: 'lossy' },
  svg:  { name: 'SVG',  family: 'image', codec: 'vector',   vector: true, alpha: true },

  // ── Video ──
  mp4:  { name: 'MP4',  family: 'video', codec: 'lossy', container: true },
  avi:  { name: 'AVI',  family: 'video', codec: 'lossy', container: true },
  mov:  { name: 'MOV',  family: 'video', codec: 'lossy', container: true },
  mkv:  { name: 'MKV',  family: 'video', codec: 'lossy', container: true },
  webm: { name: 'WebM', family: 'video', codec: 'lossy', container: true },
  wmv:  { name: 'WMV',  family: 'video', codec: 'lossy', container: true },
  flv:  { name: 'FLV',  family: 'video', codec: 'lossy', container: true },
  m4v:  { name: 'M4V',  family: 'video', codec: 'lossy', container: true },
  mpeg: { name: 'MPEG', family: 'video', codec: 'lossy', container: true },
  mpg:  { name: 'MPG',  family: 'video', codec: 'lossy', container: true },
  '3gp':{ name: '3GP',  family: 'video', codec: 'lossy', container: true },

  // ── Audio ──
  mp3:  { name: 'MP3',  family: 'audio', codec: 'lossy' },
  wav:  { name: 'WAV',  family: 'audio', codec: 'lossless', uncompressed: true },
  flac: { name: 'FLAC', family: 'audio', codec: 'lossless' },
  aac:  { name: 'AAC',  family: 'audio', codec: 'lossy' },
  ogg:  { name: 'OGG',  family: 'audio', codec: 'lossy' },
  m4a:  { name: 'M4A',  family: 'audio', codec: 'lossy' },
  wma:  { name: 'WMA',  family: 'audio', codec: 'lossy' },
  aiff: { name: 'AIFF', family: 'audio', codec: 'lossless', uncompressed: true },
  opus: { name: 'OPUS', family: 'audio', codec: 'lossy' },

  // ── Archives ──
  zip:  { name: 'ZIP',  family: 'archive', codec: 'lossless' },
  rar:  { name: 'RAR',  family: 'archive', codec: 'lossless' },
  '7z': { name: '7Z',   family: 'archive', codec: 'lossless' },
  tar:  { name: 'TAR',  family: 'archive', codec: 'lossless' },
  gz:   { name: 'GZ',   family: 'archive', codec: 'lossless' },

  // ── Subtitles ──
  srt:  { name: 'SRT',  family: 'subtitle', codec: 'text' },
  vtt:  { name: 'VTT',  family: 'subtitle', codec: 'text' },
};

// Which composition shape each non-plain-conversion tool uses. Everything not
// listed here is an ordinary "format A to format B" conversion.
export const SHAPES = {
  'merge-pdf': 'pdf-merge',
  'split-pdf': 'pdf-split',
  'compress-pdf': 'pdf-compress',
  'rotate-pdf': 'pdf-rotate',
  'protect-pdf': 'pdf-protect',
  'unlock-pdf': 'pdf-unlock',
  'view-metadata': 'metadata',
  'pdf-compress-ai': 'pdf-compress-ai',
  'ocr': 'ocr',
  'text-to-speech': 'tts',
  'speech-to-text': 'stt',
  'auto-subtitle': 'subtitle',
  'document-translation': 'soon',
  'image-compressor': 'compress',
  'jpeg-compressor': 'compress',
  'png-compressor': 'compress',
  'gif-compressor': 'compress',
  'audio-converter': 'hub',
  'video-converter': 'hub',
  'mp4-converter': 'hub',
  'document-converter': 'hub',
  'ebook-converter': 'hub',
  'video-to-mp3': 'hub-extract',
  'video-to-gif': 'hub-gif',
  'image-to-gif': 'hub-gif',
};
