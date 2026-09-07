// ── Per-tool SEO content ─────────────────────────────────────────────
//
// Every tool page renders an intro paragraph, a 3-step "how to" list and a
// short FAQ below the conversion area. The text is *composed*, not templated:
//
//   1. FORMATS below is a knowledge base — one entry per file format with its
//      real characteristics (compression model, container vs codec, colour
//      depth, whether it reflows, what software reads it).
//   2. REASONS below holds one hand-written sentence per tool: the concrete
//      real-world situation that sends someone looking for that exact
//      conversion. This is the part that cannot be derived from metadata.
//   3. buildToolContent() combines them with relation rules (lossy→lossless,
//      lossless→lossy, vector→raster, container remux, audio extraction,
//      anything→GIF, …) so the quality/size/compatibility sentences and two
//      of the four FAQ answers differ by *what actually happens* in that
//      conversion rather than by name substitution.
//
// The module is pure data + pure functions (no React, no imports), so it adds
// only a few KB gzipped and does no work until a tool page renders.

// ── Format knowledge base ────────────────────────────────────────────
// codec:  'lossy' | 'lossless' | 'text' | null (container/not applicable)
// about:  one sentence stating what the format actually is
// note:   an extra characteristic used when this format is the *target*
const FORMATS = {
  // ── Documents ──
  pdf: {
    name: 'PDF', family: 'document', codec: null, fixedLayout: true,
    about: 'PDF is a fixed-layout format: it stores the exact position of every character, line and image, which is why a PDF looks identical on any screen or printer but is awkward to edit.',
    note: 'PDF keeps pagination, fonts and layout locked, so the recipient sees exactly what you sent.',
  },
  docx: {
    name: 'DOCX', family: 'document', codec: null, editable: true,
    about: 'DOCX is Microsoft Word’s modern format, where text lives in editable paragraphs and styles rather than being pinned to fixed page coordinates.',
    note: 'DOCX gives you real editable paragraphs, tracked changes and comments in Word, Google Docs or LibreOffice.',
  },
  doc: {
    name: 'DOC', family: 'document', codec: null, editable: true,
    about: 'DOC is the legacy binary Word format still produced by older versions of Microsoft Office.',
    note: 'DOC is the format to pick when the person opening the file is running a very old copy of Word.',
  },
  xlsx: {
    name: 'XLSX', family: 'document', codec: null, editable: true,
    about: 'XLSX is Excel’s spreadsheet format, where every value sits in an addressable cell that can be sorted, filtered and used in a formula.',
    note: 'Once the data is in XLSX you can sum, sort, pivot and chart it instead of retyping it.',
  },
  xls: {
    name: 'XLS', family: 'document', codec: null, editable: true,
    about: 'XLS is the older binary Excel format from Office 2003 and earlier, still common in exports from legacy business systems.',
    note: 'XLS remains readable by essentially every spreadsheet application ever shipped.',
  },
  csv: {
    name: 'CSV', family: 'document', codec: 'text',
    about: 'CSV is plain text with one row per line and values separated by commas — no formatting, no formulas, just the data.',
    note: 'CSV is the format databases, scripts and import wizards accept without complaint.',
  },
  pptx: {
    name: 'PPTX', family: 'document', codec: null, editable: true,
    about: 'PPTX stores a presentation as separate slides with editable text boxes, shapes, speaker notes and transitions.',
    note: 'PPTX gives you slides you can actually re-edit, reorder and re-present.',
  },
  ppt: {
    name: 'PPT', family: 'document', codec: null, editable: true,
    about: 'PPT is the legacy binary PowerPoint format from Office 2003 and earlier.',
    note: 'PPT is what older PowerPoint installations expect.',
  },
  txt: {
    name: 'TXT', family: 'document', codec: 'text',
    about: 'A TXT file is nothing but characters — no fonts, no images, no page structure — which makes it tiny, universally readable and trivially searchable.',
    note: 'TXT strips everything except the words, which is exactly what scripts, search indexes and text editors want.',
  },
  html: {
    name: 'HTML', family: 'document', codec: 'text',
    about: 'HTML is the markup language of the web: text wrapped in tags that a browser turns into headings, paragraphs, links and images.',
    note: 'HTML output opens in any browser and can be pasted straight into a website or CMS.',
  },
  htm: {
    name: 'HTM', family: 'document', codec: 'text',
    about: 'HTM is the same web markup as HTML, saved with the shorter three-letter extension that older Windows software used.',
    note: 'HTM is read by every browser exactly like HTML.',
  },
  rtf: {
    name: 'RTF', family: 'document', codec: null, editable: true,
    about: 'RTF is an open, plain-text-based document format that carries basic formatting — bold, italics, fonts, tables — without locking you into one word processor.',
    note: 'RTF opens in Word, Pages, LibreOffice, WordPad and almost every word processor ever written.',
  },
  odt: {
    name: 'ODT', family: 'document', codec: null, editable: true,
    about: 'ODT is the OpenDocument text format used by LibreOffice and OpenOffice, and it is an ISO standard rather than a vendor format.',
    note: 'ODT is the native, fully editable format for LibreOffice and OpenOffice.',
  },
  epub: {
    name: 'EPUB', family: 'ebook', codec: null, reflow: true,
    about: 'EPUB is a reflowable ebook format: the text has no fixed page size, so it re-wraps to whatever screen and font size the reader is using.',
    note: 'EPUB lets the reader change font size and reflow the text, which is what makes long documents comfortable on a phone or e-reader.',
  },
  mobi: {
    name: 'MOBI', family: 'ebook', codec: null, reflow: true,
    about: 'MOBI is the older Amazon Kindle ebook format, reflowable like EPUB but tied to Amazon’s ecosystem.',
    note: 'MOBI is what older Kindle devices and Kindle desktop software expect.',
  },
  azw3: {
    name: 'AZW3', family: 'ebook', codec: null, reflow: true,
    about: 'AZW3 (Kindle Format 8) is Amazon’s newer ebook format, with better typography and layout control than MOBI.',
    note: 'AZW3 gives modern Kindles proper styling, tables and embedded fonts.',
  },
  fb2: {
    name: 'FB2', family: 'ebook', codec: null, reflow: true,
    about: 'FB2 is an XML-based ebook format that describes a book by its structure — chapters, sections, epigraphs — rather than its appearance.',
    note: 'FB2 is widely used by open-source readers and keeps a book’s structure intact.',
  },
  lit: {
    name: 'LIT', family: 'ebook', codec: null, reflow: true,
    about: 'LIT is the discontinued Microsoft Reader ebook format, now readable only by a handful of legacy applications.',
    note: 'LIT is a legacy format kept only for archived libraries.',
  },
  lrf: {
    name: 'LRF', family: 'ebook', codec: null, reflow: true,
    about: 'LRF is the obsolete Sony Reader ebook format from the first generation of e-ink devices.',
    note: 'LRF is a legacy Sony Reader format.',
  },

  // ── Images ──
  jpg: {
    name: 'JPG', family: 'image', codec: 'lossy',
    about: 'JPG uses lossy compression tuned for photographs: it throws away detail the eye is least likely to notice, which makes photos small but adds soft blocky artefacts around hard edges and text.',
    note: 'JPG produces small files that open literally everywhere, at the cost of some permanently discarded detail and no transparency.',
  },
  jpeg: {
    name: 'JPEG', family: 'image', codec: 'lossy',
    about: 'JPEG is the same lossy photographic format as JPG — only the file extension differs — and it trades a little permanent detail for a much smaller file.',
    note: 'JPEG is the most universally accepted photo format there is.',
  },
  jfif: {
    name: 'JFIF', family: 'image', codec: 'lossy',
    about: 'JFIF is a JPEG image saved with a different extension; the pixels inside are ordinary JPEG data, but Windows often refuses to hand the file to the app you want.',
    note: 'JFIF is really just JPEG under another name.',
  },
  png: {
    name: 'PNG', family: 'image', codec: 'lossless', alpha: true,
    about: 'PNG is lossless: it stores every pixel exactly, supports a full alpha channel for transparency and never degrades when you re-save it, which is why it is the format of choice for screenshots, logos and UI graphics.',
    note: 'PNG keeps every pixel exactly as it is and supports true transparency, so it survives repeated editing without degrading.',
  },
  webp: {
    name: 'WebP', family: 'image', codec: 'lossy', alpha: true,
    about: 'WebP is Google’s modern web image format; it compresses noticeably smaller than JPG or PNG at similar quality and supports transparency and animation, but plenty of desktop and print software still cannot open it.',
    note: 'WebP produces the smallest files of the common web formats and supports transparency.',
  },
  bmp: {
    name: 'BMP', family: 'image', codec: 'lossless',
    about: 'BMP stores raw, essentially uncompressed pixel data, which makes it perfectly faithful and enormously wasteful — a photo can easily be ten times larger than the same image as PNG.',
    note: 'BMP is raw and uncompressed, which old Windows software and some scanners still expect.',
  },
  tiff: {
    name: 'TIFF', family: 'image', codec: 'lossless',
    about: 'TIFF is the archival and prepress format: lossless, high bit-depth, capable of holding multiple pages or layers, and correspondingly large.',
    note: 'TIFF is the format print shops and archives ask for because nothing is thrown away.',
  },
  tif: {
    name: 'TIF', family: 'image', codec: 'lossless',
    about: 'TIF is TIFF with the shorter extension — the same lossless, high-quality, high-size archival image format.',
    note: 'TIF is the lossless archival image format used in scanning and prepress.',
  },
  gif: {
    name: 'GIF', family: 'image', codec: 'lossless', animated: true, palette: 256,
    about: 'GIF is limited to a palette of 256 colours per frame, which is why photographs look banded in it, but it animates and autoplays inline almost everywhere on the internet.',
    note: 'GIF animates and autoplays inline in chat apps, issue trackers and forums, but is capped at 256 colours per frame.',
  },
  ico: {
    name: 'ICO', family: 'image', codec: 'lossless', alpha: true,
    about: 'ICO is a Windows icon container that holds the same artwork at several sizes at once, so the system can pick 16×16 for a tab and 256×256 for a desktop shortcut.',
    note: 'ICO bundles multiple resolutions into one file, which is exactly what favicons and Windows application icons need.',
  },
  heic: {
    name: 'HEIC', family: 'image', codec: 'lossy',
    about: 'HEIC is the format iPhones save photos in by default; it stores roughly the same quality as JPG in about half the space, but Windows, many web forms and a lot of older software simply refuse to open it.',
    note: 'HEIC is compact but poorly supported outside Apple devices.',
  },
  heif: {
    name: 'HEIF', family: 'image', codec: 'lossy',
    about: 'HEIF is the container standard behind Apple’s HEIC photos, offering strong compression but limited support outside recent Apple and Android devices.',
    note: 'HEIF is efficient but not widely readable.',
  },
  svg: {
    name: 'SVG', family: 'image', codec: 'vector', vector: true, alpha: true,
    about: 'SVG is not made of pixels at all — it is XML describing shapes, paths and text, so it stays perfectly sharp at any size and can be edited or restyled with code.',
    note: 'SVG scales to any size without ever becoming blurry, because it stores shapes rather than pixels.',
  },

  // ── Video ──
  mp4: {
    name: 'MP4', family: 'video', codec: 'lossy', container: true,
    about: 'MP4 is a container — usually H.264 video with AAC audio — and it is the one video format that phones, browsers, TVs, editors and social platforms all agree on.',
    note: 'MP4 plays on essentially every phone, browser, TV and editor without extra software.',
  },
  avi: {
    name: 'AVI', family: 'video', codec: 'lossy', container: true,
    about: 'AVI is a Microsoft container from the 1990s; it is still read by legacy players and editing suites, but it has no modern streaming features and its files tend to be far larger than MP4.',
    note: 'AVI is what older players, DVD authoring tools and legacy editing software expect.',
  },
  mov: {
    name: 'MOV', family: 'video', codec: 'lossy', container: true,
    about: 'MOV is Apple’s QuickTime container, the format iPhones and Macs record to and the one Final Cut Pro and iMovie handle most comfortably.',
    note: 'MOV is the container Apple’s editing tools work with most smoothly.',
  },
  mkv: {
    name: 'MKV', family: 'video', codec: 'lossy', container: true,
    about: 'MKV (Matroska) is an open container that can hold any number of video, audio and subtitle tracks in one file — excellent for archiving, but rejected by most phones, TVs and browsers.',
    note: 'MKV can carry multiple audio and subtitle tracks in a single file.',
  },
  webm: {
    name: 'WebM', family: 'video', codec: 'lossy', container: true,
    about: 'WebM is the royalty-free container built for HTML5 video, usually carrying VP9 or AV1; browsers love it, but desktop editors and Apple software often will not touch it.',
    note: 'WebM is small and streams natively in browsers.',
  },
  wmv: {
    name: 'WMV', family: 'video', codec: 'lossy', container: true,
    about: 'WMV is Microsoft’s Windows Media video format, effectively Windows-only and largely abandoned outside old corporate recordings and screen captures.',
    note: 'WMV is a Windows Media format with little support elsewhere.',
  },
  flv: {
    name: 'FLV', family: 'video', codec: 'lossy', container: true,
    about: 'FLV was the container behind Flash video, and since Flash was removed from every browser it is now effectively an unplayable archive format.',
    note: 'FLV is a dead Flash-era container.',
  },
  m4v: {
    name: 'M4V', family: 'video', codec: 'lossy', container: true,
    about: 'M4V is Apple’s MP4 variant, structurally almost identical to MP4 but sometimes carrying FairPlay copy protection.',
    note: 'M4V is Apple’s near-identical twin of MP4.',
  },
  mpeg: {
    name: 'MPEG', family: 'video', codec: 'lossy', container: true,
    about: 'MPEG-1 and MPEG-2 files are the video format of VCDs, DVDs and broadcast capture cards — reliable, but bulky by modern standards.',
    note: 'MPEG is the classic broadcast and DVD video format.',
  },
  mpg: {
    name: 'MPG', family: 'video', codec: 'lossy', container: true,
    about: 'MPG is the same MPEG-1/MPEG-2 video used by DVDs and capture hardware, saved with the shorter extension.',
    note: 'MPG is the DVD-era MPEG format.',
  },
  '3gp': {
    name: '3GP', family: 'video', codec: 'lossy', container: true,
    about: '3GP is the low-bitrate container early mobile phones recorded to, built for slow 3G networks and tiny screens.',
    note: '3GP is a legacy mobile phone video format.',
  },

  // ── Audio ──
  mp3: {
    name: 'MP3', family: 'audio', codec: 'lossy',
    about: 'MP3 is lossy: the encoder permanently deletes the parts of the signal it predicts you will not hear, which shrinks a track to roughly a tenth of its original size and is why it plays on absolutely everything.',
    note: 'MP3 is about ten times smaller than uncompressed audio and plays on every phone, car stereo and player made in the last twenty years.',
  },
  wav: {
    name: 'WAV', family: 'audio', codec: 'lossless', uncompressed: true,
    about: 'WAV stores audio uncompressed, sample for sample, exactly as it was recorded — which is why studios use it and why one minute of CD-quality stereo takes about 10 MB.',
    note: 'WAV is uncompressed and lossless, so editors and mastering tools can process it without decoding anything first.',
  },
  flac: {
    name: 'FLAC', family: 'audio', codec: 'lossless',
    about: 'FLAC compresses audio losslessly: it is roughly half the size of WAV yet decodes back to a bit-perfect copy of the original recording.',
    note: 'FLAC is bit-perfect but roughly half the size of WAV.',
  },
  aac: {
    name: 'AAC', family: 'audio', codec: 'lossy',
    about: 'AAC is the lossy codec behind Apple Music, YouTube and most streaming services; at the same bitrate it generally sounds better than MP3.',
    note: 'AAC sounds better than MP3 at the same bitrate and is the default across Apple and streaming platforms.',
  },
  ogg: {
    name: 'OGG', family: 'audio', codec: 'lossy',
    about: 'OGG Vorbis is a patent-free lossy codec favoured by games, open-source software and Wikipedia, with quality comparable to MP3 at smaller sizes.',
    note: 'OGG is free of patent restrictions, which is why game engines and open-source projects prefer it.',
  },
  m4a: {
    name: 'M4A', family: 'audio', codec: 'lossy',
    about: 'M4A is an MP4 container holding audio only, normally AAC — the format iTunes, Apple Music and iPhone voice memos produce.',
    note: 'M4A is the Apple ecosystem’s standard audio file.',
  },
  wma: {
    name: 'WMA', family: 'audio', codec: 'lossy',
    about: 'WMA is Microsoft’s lossy audio codec from the Windows Media Player era, rarely supported outside Windows and effectively discontinued.',
    note: 'WMA is a Windows-only legacy audio codec.',
  },
  aiff: {
    name: 'AIFF', family: 'audio', codec: 'lossless', uncompressed: true,
    about: 'AIFF is Apple’s uncompressed audio format, the Mac equivalent of WAV and just as large.',
    note: 'AIFF is uncompressed Apple audio, identical in quality to WAV.',
  },
  opus: {
    name: 'OPUS', family: 'audio', codec: 'lossy',
    about: 'Opus is the modern low-latency codec used by voice chat and streaming; it delivers excellent quality at very low bitrates.',
    note: 'Opus sounds remarkably good at low bitrates, which keeps voice files tiny.',
  },

  // ── Archives ──
  zip: {
    name: 'ZIP', family: 'archive', codec: 'lossless',
    about: 'ZIP is the archive format built into Windows, macOS and every phone — double-clicking one just works, with no extra software to install.',
    note: 'ZIP opens with a double-click on Windows, macOS, Linux, iOS and Android with nothing installed.',
  },
  rar: {
    name: 'RAR', family: 'archive', codec: 'lossless',
    about: 'RAR is a proprietary archive format with good compression and recovery records, but it needs WinRAR or a compatible tool to open.',
    note: 'RAR needs third-party software to extract.',
  },
  '7z': {
    name: '7Z', family: 'archive', codec: 'lossless',
    about: '7Z uses LZMA compression, which routinely produces noticeably smaller archives than ZIP — at the cost of requiring 7-Zip or a compatible tool to open.',
    note: '7Z compresses considerably tighter than ZIP, which matters for large folders and paid cloud storage.',
  },
  tar: {
    name: 'TAR', family: 'archive', codec: 'lossless',
    about: 'A TAR file bundles many files into one without compressing them; it comes from the Unix world and preserves permissions and directory structure.',
    note: 'TAR preserves Unix permissions and directory structure.',
  },
  gz: {
    name: 'GZ', family: 'archive', codec: 'lossless',
    about: 'GZ (gzip) compresses a single stream of data and is what Linux servers and command-line tools produce; on Windows it is awkward to open without extra software.',
    note: 'GZ is the standard Linux and web-server compression format.',
  },

  // ── Subtitles ──
  srt: {
    name: 'SRT', family: 'subtitle', codec: 'text',
    about: 'SRT is the plain-text subtitle format every video editor and player understands: numbered cues, a timecode range, and the line of dialogue.',
    note: 'SRT is accepted by YouTube, Vimeo, Premiere, Final Cut and every common player.',
  },
  vtt: {
    name: 'VTT', family: 'subtitle', codec: 'text',
    about: 'WebVTT is the subtitle format built for HTML5 video, with support for styling and positioning that SRT lacks.',
    note: 'VTT is the native caption format for web video players.',
  },
};

// ── Per-tool real-world reason ───────────────────────────────────────
// One hand-written sentence per tool: the concrete situation that makes
// someone search for this exact conversion. Everything else on the page is
// composed from FORMATS above.
const REASONS = {
  // Document
  'pdf-to-word': 'The usual trigger is an edit you cannot make in the PDF itself — a contract clause, a CV bullet or a report paragraph that has to change without retyping the whole document.',
  'word-to-pdf': 'People convert Word to PDF at the very end of a document’s life: sending a CV, a quote or a signed form to someone whose fonts, Word version and margins you have no control over.',
  'pdf-to-excel': 'The typical case is a bank statement, invoice or report that only exists as a PDF but whose numbers you need to sum, sort or chart.',
  'excel-to-pdf': 'This is what you do before sending a budget or price list to someone who should read it but not change it, and before printing — a PDF pins the page breaks that Excel would otherwise recalculate on every machine.',
  'pptx-to-pdf': 'Most people convert a deck to PDF before emailing it or handing it out, so the slides cannot reflow and nobody needs PowerPoint installed to open them.',
  'pdf-to-pptx': 'This is what you need when the only surviving copy of a deck is the PDF that was circulated after the meeting and you have to update or reuse the slides.',
  'pdf-to-txt': 'Common reasons: feeding a document into a script, a search index or an AI tool, or stripping a long report down to something you can search, diff and paste anywhere.',
  'pdf-to-html': 'It is the quickest way to publish an existing report, manual or brochure on a website without rebuilding the page by hand.',
  'html-to-pdf': 'People do this to archive a web page exactly as it looks today, or to turn an HTML invoice or report template into something printable and emailable.',
  'rtf-to-pdf': 'RTF usually comes out of older software or legal document templates; turning it into a PDF gives you one file that opens identically everywhere and cannot be edited by accident.',
  'pdf-to-rtf': 'This is the option to reach for when you need an editable copy of a PDF but cannot assume the recipient has Word — practically every word processor ever written opens RTF.',
  'odt-to-pdf': 'The typical case: you wrote the document in LibreOffice or OpenOffice and the person receiving it uses Microsoft Office, or nothing at all.',
  'pdf-to-epub': 'Reading a PDF on a phone means constant pinching and horizontal scrolling; this conversion is mostly about making a long document genuinely readable on a small screen or e-reader.',
  'epub-to-pdf': 'People convert EPUB to PDF when they want to print a book, annotate it against fixed page numbers, or send it to someone with no e-reader app installed.',
  'document-converter': 'It is the tool to open when you are handed a document in whatever format the sender happened to have, and you need it in the one your own software actually opens.',
  'ebook-converter': 'Ebook stores and devices each favour their own format, so this is what you use to move a book you own from one reader or app to another.',

  // Image
  'jpg-to-png': 'The usual trigger is editing: you need to cut out a background, place a logo over another image, or stop a screenshot getting blurrier every time it is re-saved.',
  'png-to-jpg': 'This is the fix for a screenshot or export that is too large to attach to an email or to get past an upload form’s size limit.',
  'webp-to-png': 'You typically need this after saving an image from a website: WebP downloads fine, but older editors, office software and some print services still refuse to open it.',
  'webp-to-jpg': 'Most people do this to get a website image into something universally accepted — an email, an older CMS, a photo print service or a colleague’s ancient software.',
  'heic-to-jpg': 'This is the classic iPhone problem: photos look fine on the phone but land on a Windows PC or a web form as unopenable .heic files.',
  'heic-to-png': 'Use this when you intend to edit the photo rather than just share it — PNG hands your editor lossless pixels instead of a freshly re-compressed copy.',
  'svg-to-png': 'The usual reason is a tool that refuses vectors: a slide deck, a marketplace listing, an email signature or an app icon pipeline that only accepts pixels.',
  'svg-to-jpg': 'This is for places that want a plain photo-style file — a document, a social post or an upload form that rejects both SVG markup and transparency.',
  'bmp-to-png': 'BMP files come out of old Windows software and scanners at absurd sizes; PNG stores exactly the same pixels in a fraction of the space.',
  'tiff-to-jpg': 'Scanners and professional cameras produce TIFFs far too large to email, so JPG is what you send once the archival copy is safely stored.',
  'gif-to-png': 'This is what you do with a static GIF — a logo, an icon or a single exported frame — that is showing colour banding or a fringed edge because of the 256-colour limit.',
  'png-to-ico': 'Almost everyone converting PNG to ICO is building a favicon or a Windows application icon, both of which expect the ICO container rather than a plain image file.',
  'jfif-to-png': 'JFIF files typically appear when a photo is saved out of Outlook or a browser, and Windows then refuses to hand it to the app you actually wanted to use.',
  'heic-to-pdf': 'Handy when you photograph documents, receipts or a whiteboard with an iPhone and have to submit them as a single file rather than a folder of images.',
  'image-compressor': 'The usual reason is a hard limit somewhere — an upload form, an email attachment cap, or a web page that loads too slowly because its images are far bigger than they need to be.',
  'jpeg-compressor': 'Photographers and site owners use this when full-resolution JPEGs are slowing a page down or will not fit through an upload limit.',
  'png-compressor': 'Screenshots and exported UI graphics are often several megabytes for no good reason; this shrinks them before they go into a document, a ticket or a web page.',

  // Video
  'mp4-to-avi': 'The reason is almost always an older device or a specific piece of software — some legacy players, DVD authoring tools and camera utilities read AVI and nothing else.',
  'mp4-to-mov': 'This is normally the first step before editing on a Mac, since Final Cut Pro and iMovie handle QuickTime files most smoothly.',
  'mov-to-mp4': 'iPhones and Macs record MOV; everything else expects MP4, so this is the conversion people run before uploading, emailing or posting a clip.',
  'mkv-to-mp4': 'MKV is excellent for storage but phones, TVs, browsers and most editors will not play it — converting to MP4 is what makes the file actually usable.',
  'webm-to-mp4': 'WebM files saved from the web often refuse to open in QuickTime, on iOS or in Premiere; MP4 is the format all of them accept.',
  'avi-to-mp4': 'This is the standard rescue for old camcorder footage and archived clips that eat gigabytes and will not play on a phone.',
  'flv-to-mp4': 'Flash is gone from every browser, so any FLV you still have is effectively unplayable — converting to MP4 is what keeps that archived footage watchable.',
  'wmv-to-mp4': 'WMV is a Windows-only leftover, so this is what you do before sending an old recording or screen capture to a Mac, an iPhone or a web platform.',
  'mp4-to-mp3': 'The point is usually the sound rather than the picture — a lecture, interview, podcast or music video you want on your phone without carrying the video around.',
  'video-to-mp3': 'People reach for this when the audio is the part worth keeping: a recorded talk, an interview, a rehearsal or a soundtrack.',
  'mp4-converter': 'It is the tool to use when a clip will not play or will not upload, because MP4 is the one video format that phones, browsers, TVs and social platforms all accept.',
  'video-converter': 'Use it when a clip needs to move between worlds — out of an editor, onto a phone, into a browser, or onto a platform that only takes one specific container.',

  // Audio
  'mp3-to-wav': 'The usual reason is editing: DAWs, mastering chains and many broadcast or game audio pipelines want uncompressed WAV so they are not decoding a compressed file on every single operation.',
  'wav-to-mp3': 'Recordings come off a field recorder or DAW as enormous WAV files; MP3 is what makes them small enough to email, upload or fit on a phone.',
  'flac-to-mp3': 'A FLAC library sounds excellent at home, but car stereos, older phones and cheap players often refuse it — MP3 is the compatibility copy you take with you.',
  'aac-to-mp3': 'This is mostly a compatibility move: AAC comes out of Apple and streaming ecosystems, while older players, car head units and DJ software expect MP3.',
  'ogg-to-mp3': 'OGG turns up in games, Wikipedia and open-source software, and almost none of the mainstream players on a phone or in a car will open it.',
  'wma-to-mp3': 'WMA is a relic of the Windows Media Player era, so this is how people rescue an old ripped music collection for a phone or a streaming library.',
  'm4a-to-mp3': 'This is the usual step when moving music or iPhone voice memos off Apple devices and into software, cars or players that only understand MP3.',
  'mp3-to-aac': 'Some devices and apps — particularly across Apple and streaming platforms — prefer AAC, so this is a compatibility conversion rather than a quality upgrade.',
  'mp3-to-ogg': 'People convert to OGG for game engines, open-source projects and platforms where a patent-free codec is required.',
  'audio-converter': 'It is the tool for the moment a file will not play: one place to move audio into whichever of the common formats your device, editor or upload form insists on.',

  // Archive
  'rar-to-zip': 'RAR needs extra software to open, so this is what you do before sending an archive to someone who is not going to install WinRAR.',
  '7z-to-zip': '7Z compresses better but requires 7-Zip to be installed; converting to ZIP means the recipient can simply double-click the file.',
  'tar-to-zip': 'TAR comes from Linux and macOS command lines, while ZIP is what a Windows colleague can open without installing anything at all.',
  'gz-to-zip': 'GZ files usually arrive from a server or a Linux tool and are awkward on Windows, where ZIP unpacks with a double-click.',
  'zip-to-7z': 'This one is about size: 7Z’s compression is meaningfully stronger, which matters when you are archiving a large folder or paying for cloud storage by the gigabyte.',

  // GIF
  'video-to-gif': 'The typical use is a short loop for a chat message, a README, a bug report or a social post — places where a GIF autoplays inline and a video file would not.',
  'mp4-to-gif': 'The typical use is a short loop for a chat, a README, a bug report or a social post, where a GIF autoplays inline and a video would just sit there as an attachment.',
  'webm-to-gif': 'WebM clips saved from the web often will not embed where you want them, whereas a GIF plays inline in chat apps, issue trackers and forums.',
  'mov-to-gif': 'This is what you do with a QuickTime screen recording that needs to appear inline in a pull request, a support ticket or a post.',
  'avi-to-gif': 'Turning a few seconds of an old AVI clip into a GIF is the easiest way to get it into a document, a chat thread or a web page.',
  'gif-to-mp4': 'Long GIFs are enormous and play choppily; MP4 shows the same animation at a fraction of the size, which is precisely why social platforms convert them behind the scenes.',
  'image-to-gif': 'Useful when a platform or an older system specifically expects a GIF, or when you need a still frame in the same format as an existing animation set.',
  'gif-compressor': 'Animated GIFs balloon quickly, and this is the fix when one is too heavy for an email, a chat upload limit or a page that has to load fast.',

  // PDF tools
  'merge-pdf': 'The classic case is an application or a claim: a form, a scan and a receipt that all have to arrive as a single document.',
  'split-pdf': 'Usually you need exactly one thing out of a much longer file — one chapter, one invoice, one signed page from a fifty-page scan.',
  'compress-pdf': 'Almost always a size limit: an email attachment cap, a government upload form, or a portal that rejects anything over a few megabytes.',
  'rotate-pdf': 'This fixes the everyday scanner problem — pages that came out sideways or upside down because of the way the sheets were fed in.',
  'protect-pdf': 'People password-protect PDFs before emailing payslips, contracts or medical letters, so the contents are not readable by whoever the message gets forwarded to next.',
  'unlock-pdf': 'Use it on documents you own when the password is known but the restriction is in the way — a bank statement you cannot print, for instance.',

  // Utilities & Smart Functions
  'view-metadata': 'It answers the questions a file will not tell you directly: what camera took this photo, how long is this recording really, what codec is inside this video, how many pages is this PDF.',
  'ocr': 'The situation is always the same: you have a document as an image, and you need the words out of it — to search it, quote it, edit it or archive it properly.',
  'pdf-compress-ai': 'Reach for it when ordinary compression has already been tried and the file is still too big for the upload limit you are fighting with.',
  'text-to-speech': 'People use it to listen to something instead of reading it — an article on a commute, a script read back to catch awkward phrasing, or a voice-over for a video.',
  'speech-to-text': 'The usual case is a recording you need in writing: a meeting, an interview, a lecture or a voice memo that has to become notes, minutes or a quotable transcript.',
  'auto-subtitle': 'Captions are what make a video watchable with the sound off and findable by search engines, and typing them by hand for even a short clip takes far longer than people expect.',
  'document-translation': 'The aim is to read or send a document in another language without losing the layout that makes it legible.',
};

// ── Composition helpers ──────────────────────────────────────────────

function fmt(key) {
  return FORMATS[key] || null;
}

function listNames(keys, max = 6) {
  const seen = [];
  for (const k of keys || []) {
    const f = fmt(k);
    const n = f ? f.name : String(k).toUpperCase();
    if (!seen.includes(n)) seen.push(n);
  }
  const shown = seen.slice(0, max);
  if (shown.length <= 1) return shown[0] || '';
  return `${shown.slice(0, -1).join(', ')} and ${shown[shown.length - 1]}`;
}

// How long a conversion realistically takes, by media family.
const SPEED = {
  image: 'Images are the fastest thing we convert — a single photo is normally done in under five seconds, and a folder of them takes about as long as the upload itself.',
  document: 'Most documents are finished within a few seconds. Very long files — a few hundred pages, or a scan with heavy images — can take up to a minute.',
  audio: 'A typical song converts in a few seconds. A full-length recording such as a lecture or a podcast episode usually takes well under a minute, most of which is the upload.',
  video: 'Video is the slowest category because every frame has to be re-encoded. A short clip takes seconds, while a long high-resolution file can take a few minutes.',
  archive: 'Archives convert in seconds, though a large one takes longer because every file inside has to be unpacked and repacked.',
  ebook: 'Ebooks are quick — a full novel normally converts in a few seconds.',
  subtitle: 'Transcription runs at roughly a few seconds per minute of audio, so a ten-minute video is usually captioned in well under a minute.',
};

// The quality/fidelity question, chosen by what actually happens between the
// two formats rather than by their names.
function qualityFaq(from, to, tool) {
  const f = fmt(from);
  const t = fmt(to);
  const fn = f ? f.name : String(from || '').toUpperCase();
  const tn = t ? t.name : String(to || '').toUpperCase();

  // Vector → raster
  if (f && f.vector && t && !t.vector) {
    return {
      q: `Will my ${fn} stay sharp as a ${tn}?`,
      a: `Up to the size you export it at, yes. ${fn} stores shapes rather than pixels, so it is infinitely scalable, but a ${tn} is a fixed grid of pixels and will blur if it is later enlarged beyond that grid. Set the width and height you actually need in the advanced settings before converting — exporting at two or three times the display size is the usual trick for screens with high pixel density. Keep the original ${fn} file: it stays the master copy you can re-export at any resolution.`,
    };
  }

  // Documents: the real question is layout, not pixels
  if (f && t && (f.family === 'document' || f.family === 'ebook') && (t.family === 'document' || t.family === 'ebook')) {
    if (t.name === 'TXT') {
      return {
        q: `Will I lose formatting converting ${fn} to ${tn}?`,
        a: `Yes, and deliberately so — a ${tn} file holds characters and nothing else. Fonts, colours, images, tables, columns and page breaks are all dropped; what you get back is the readable text of the document in reading order. That is exactly what you want for searching, scripting or feeding the text into another program, and exactly what you do not want if you were hoping to keep the design. Note that a ${fn} which is really a scanned image contains no text to extract at all — run it through the OCR tool instead.`,
      };
    }
    if (t.name === 'CSV' || t.name.startsWith('Excel')) {
      return {
        q: `How accurate is table extraction from ${fn}?`,
        a: `Clean, ruled tables with consistent columns — statements, invoices, exported reports — come through reliably, with each value landing in its own cell so you can sum and sort it. Tables without visible borders, cells that span several rows, or figures split across a page break are the cases worth checking by eye afterwards. ${fn} stores position rather than table structure, so the conversion has to infer where one column ends and the next begins.`,
      };
    }
    if (t.reflow && f.fixedLayout) {
      return {
        q: `Will the layout survive the ${fn} to ${tn} conversion?`,
        a: `Not exactly, and that is the point. ${fn} pins text to fixed page coordinates; ${tn} reflows it to fit the reader’s screen and font size, so fixed page numbers, headers, footers and multi-column layouts are reinterpreted rather than reproduced. Body text, headings, paragraph order and images come through well. Documents that are mostly prose convert beautifully; heavily designed pages, forms and complex tables are the ones that need a look afterwards.`,
      };
    }
    if (t.fixedLayout) {
      return {
        q: `Will my formatting be preserved in the ${tn}?`,
        a: `Yes — this direction is the safe one. ${tn} records the final rendered page, so fonts, spacing, tables, images and page breaks are frozen exactly as laid out and will look the same on every device and printer. That is also the trade-off: the result is no longer freely editable, which is usually exactly why people convert to ${tn} before sending a document out.`,
      };
    }
    if (f.fixedLayout && t.editable) {
      return {
        q: `How accurate is the ${fn} to ${tn} conversion?`,
        a: `Text, headings, lists, images and simple tables come through reliably and stay fully editable. Because ${fn} stores position rather than structure, the conversion has to reconstruct that structure, so heavily designed pages — multiple columns, text wrapped around images, complex nested tables — may need light tidying afterwards. If the PDF is a scan with no text layer at all, use the OCR tool instead: it recognises the characters in the image rather than looking for text that is not there.`,
      };
    }
    return {
      q: `Will I lose anything converting ${fn} to ${tn}?`,
      a: `The words, headings, lists and images carry over intact. ${tn} supports a different formatting vocabulary from ${fn}, so very specific styling can be simplified in the process, but the content itself is preserved.`,
    };
  }

  // Archives are lossless by definition
  if (f && t && f.family === 'archive' && t.family === 'archive') {
    return {
      q: `Will the files inside my ${fn} be changed?`,
      a: `No. Archive formats are lossless containers: the ${fn} is unpacked and the identical files are repacked as a ${tn}, byte for byte. Only the compression method and the container change. What does change is the archive’s own size — ${t.name === '7Z' ? '7Z generally produces a smaller archive than ZIP thanks to LZMA compression' : tn === 'ZIP' ? 'ZIP is usually slightly larger than 7Z or RAR, which is the price of being openable everywhere without extra software' : 'the new format compresses differently, so the file size may shift in either direction'}.`,
    };
  }

  // Images collected into a document
  if (f && t && f.family === 'image' && t.family === 'document') {
    return {
      q: `Will my photos lose quality inside the ${tn}?`,
      a: `No. Each ${fn} image is placed into the ${tn} as it is, one per page, rather than being re-compressed, so what you see in the document is what came off the camera. The ${tn} will be roughly the combined size of the images, which is worth knowing before you email it — run the result through Compress PDF if it needs to be smaller.`,
    };
  }

  // Anything → GIF
  if (t && t.name === 'GIF') {
    return {
      q: `Why does my GIF look worse than the original ${fn}?`,
      a: `Because GIF is limited to 256 colours per frame. A video or photo contains millions, so the encoder has to pick a palette and approximate everything else, which shows up as banding in gradients and skies. GIF also carries no audio track at all. Both are inherent to the format, not to the conversion — keep the clip short, and if the colour loss matters more than inline autoplay, an MP4 will look far better at a smaller size.`,
    };
  }

  // Lossy → lossless (audio/image)
  if (f && t && f.codec === 'lossy' && t.codec === 'lossless') {
    return {
      q: `Does converting ${fn} to ${tn} improve the quality?`,
      a: `No — and this is the single most common misunderstanding about this conversion. ${fn} is lossy: the detail its encoder discarded is gone permanently, and nothing can reconstruct it. What ${tn} gives you is a lossless container for what remains, so the file stops degrading with every subsequent save or edit. That is genuinely useful when you are about to edit, ${f.family === 'audio' ? 'master or process the audio' : 'retouch or composite the image'}, but it will not recover quality that was already lost.`,
    };
  }

  // Lossless → lossy
  if (f && t && (f.codec === 'lossless' || f.codec === 'vector') && t.codec === 'lossy') {
    return {
      q: `Will I lose quality converting ${fn} to ${tn}?`,
      a: `Some, by design — that is how the file gets smaller. ${tn} is lossy, so the encoder discards information it judges least noticeable. At sensible settings the difference is very hard to spot${f.family === 'audio' ? ' by ear' : ' by eye'}, and you can raise the ${f.family === 'audio' ? 'bitrate' : 'quality value'} in the advanced settings if you would rather trade size for fidelity. Keep your original ${fn} file: it stays the master copy, and re-encoding the ${tn} again later would compound the loss.`,
    };
  }

  // Lossy → lossy (transcode)
  if (f && t && f.codec === 'lossy' && t.codec === 'lossy') {
    return {
      q: `Will I lose quality converting ${fn} to ${tn}?`,
      a: `A little. Both formats are lossy, so the ${fn} is decoded and then re-encoded as ${tn}, and each generation of lossy encoding sheds a small amount of detail. At normal settings it is not something most people notice${f.family === 'audio' ? ' when listening' : ''}, and you can raise the ${f.family === 'audio' ? 'bitrate' : 'quality'} in the advanced settings. What you should avoid is converting the same file back and forth repeatedly — that is what makes the loss audible or visible.`,
    };
  }

  // Lossless → lossless
  if (f && t && f.codec === 'lossless' && t.codec === 'lossless') {
    return {
      q: `Will I lose quality converting ${fn} to ${tn}?`,
      a: `No. Both ${fn} and ${tn} are lossless, so every ${f.family === 'audio' ? 'sample' : 'pixel'} is preserved exactly and the result is identical to the original. Only the file size changes${f.name === 'BMP' || f.name === 'WAV' ? `, usually dramatically downwards, because ${fn} stores its data essentially uncompressed` : ''}. You can convert back later without any degradation at all.`,
    };
  }

  // Fallback
  return {
    q: `Will I lose quality converting ${fn} to ${tn}?`,
    a: `For normal files the result is visually and functionally equivalent to the original. Where the two formats support different features, the conversion keeps everything ${tn} is capable of representing. The advanced settings let you raise quality if the default trade-off is not the one you want.`,
  };
}

// A second format-specific question, again picked by relation. Returns null
// when nothing interesting applies, in which case the caller falls back to a
// compatibility question.
function relationFaq(from, to, tool) {
  const f = fmt(from);
  const t = fmt(to);
  if (!f || !t) return null;
  const fn = f.name;
  const tn = t.name;

  // Uncompressed target — the "why is it huge?" question
  if (t.uncompressed) {
    return {
      q: `Why is the ${tn} file so much larger than the ${fn}?`,
      a: `Because ${tn} is uncompressed. ${fn} shrinks audio by discarding data and by encoding what is left efficiently; ${tn} writes out every sample at full size, which works out at roughly 10 MB per minute of CD-quality stereo. A ten-to-one size increase is normal and expected — it is the price of a file that editing software can process without decoding anything first. If you want lossless audio at about half the size, convert to FLAC instead.`,
    };
  }

  // Audio extraction from video
  if (f.family === 'video' && t.family === 'audio') {
    return {
      q: `Does this keep the video, or only the sound?`,
      a: `Only the sound. The audio track is extracted from the ${fn} file and saved as ${tn}; the video track is discarded, which is why the result is a small fraction of the original size. The audio itself is not re-recorded from scratch, so it retains the quality it had inside the ${fn} — extracting from a low-bitrate video cannot produce high-bitrate audio.`,
    };
  }

  // Video container change
  if (f.family === 'video' && t.family === 'video') {
    return {
      q: `Will my ${tn} play on phones, TVs and social media?`,
      a: tn === 'MP4'
        ? `That is exactly what this conversion is for. MP4 with H.264 video is the closest thing to a universal video format: iPhones, Android phones, smart TVs, every browser, Instagram, YouTube, TikTok and every mainstream editor accept it without extra codecs. ${fn} is the format that was giving you trouble; MP4 is the one that does not.`
        : `${tn} is more specialised than MP4. ${t.note} If your goal is simply "play everywhere", MP4 is the safer choice — pick ${tn} when a specific piece of software or hardware has asked for it.`,
    };
  }

  // Transparency gained or lost
  if (f.family === 'image' && t.family === 'image') {
    if (f.alpha && !t.alpha) {
      return {
        q: `What happens to transparency when converting ${fn} to ${tn}?`,
        a: `${tn} has no alpha channel, so transparent areas cannot be carried over — they are filled with a solid background (white by default) during conversion. If the transparent background is doing real work in your design, convert to PNG or WebP instead, both of which preserve it. If the image is a photograph with no transparency in the first place, this makes no difference at all.`,
      };
    }
    if (!f.alpha && t.alpha) {
      return {
        q: `Does converting ${fn} to ${tn} make the background transparent?`,
        a: `No — and this catches a lot of people out. ${tn} *supports* transparency, but a ${fn} file has no transparency information to carry over, so the background stays exactly as it was. What the conversion gives you is a file that can hold transparency once you cut the background out in an image editor, plus lossless pixels that will not degrade while you work.`,
      };
    }
  }

  // Ebook direction
  if (t.reflow && !f.reflow) {
    return {
      q: `Will the ${tn} work on my e-reader?`,
      a: `${tn} is read by ${tn === 'EPUB' ? 'Apple Books, Kobo, Google Play Books, Calibre and essentially every e-reader except Kindle, which wants MOBI or AZW3 (Kindle also accepts EPUB by email these days)' : 'the Kindle devices and apps it was designed for'}. Because the text reflows, you can change the font size on the device without ending up scrolling sideways — which is the whole reason for converting a ${fn} in the first place.`,
    };
  }

  return null;
}

// Compatibility question, used when no relation-specific question applies.
function compatibilityFaq(from, to) {
  const f = fmt(from);
  const t = fmt(to);
  const fn = f ? f.name : String(from || '').toUpperCase();
  const tn = t ? t.name : String(to || '').toUpperCase();
  return {
    q: `What can open the ${tn} file afterwards?`,
    a: `${t ? t.note : `${tn} is widely supported.`} Nothing has to be installed to do the conversion — it runs on our servers, and the finished ${tn} comes back in your browser ready to open, edit or send on. Your original ${fn} is never modified; we only ever return a new file.`,
  };
}

// ── Tool shape detection ─────────────────────────────────────────────

const ACTION_SHAPES = {
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

// Steps for the specialised tools. Ordinary format conversions get their
// three steps generated from the format pair instead.
function actionSteps(shape, tool, fn, tn) {
  switch (shape) {
    case 'pdf-merge':
      return [
        'Add every PDF you want to combine — drop them onto the upload area together, or click to select them one after another.',
        'Drag the files into the order you want them to appear in the finished document.',
        'Click Merge and download the single combined PDF.',
      ];
    case 'pdf-split':
      return [
        'Upload the PDF you want to take pages out of.',
        'Type the pages or ranges you need in the page-ranges box — for example 1-3, 5, 7-10.',
        'Click Convert and download the extracted pages.',
      ];
    case 'pdf-compress':
    case 'pdf-compress-ai':
      return [
        'Drop your PDF onto the upload area, or click to browse for it.',
        'Click Convert — the file is analysed and its images and embedded data are re-encoded at a smaller size.',
        'Download the compressed PDF and check the size saving shown next to it.',
      ];
    case 'pdf-rotate':
      return [
        'Upload the PDF whose pages are the wrong way round.',
        'Choose how far to turn them — 90°, 180° or 270°.',
        'Click Convert and download the corrected PDF.',
      ];
    case 'pdf-protect':
      return [
        'Upload the PDF you want to secure.',
        'Enter the password that will be required to open it, and keep a copy somewhere safe.',
        'Click Convert and download the encrypted PDF.',
      ];
    case 'pdf-unlock':
      return [
        'Upload the password-protected PDF.',
        'Enter its current password so the file can be decrypted.',
        'Click Convert and download the unlocked PDF.',
      ];
    case 'metadata':
      return [
        'Drop any file onto the upload area — an image, video, audio file or document.',
        'The file is inspected rather than converted, so nothing about it is changed.',
        'Read the metadata directly on the page: dimensions, duration, codec, camera details, page count and more.',
      ];
    case 'ocr':
      return [
        'Upload the scanned PDF or the photo of the text.',
        'Pick the language of the document and whether you want a searchable PDF or plain text.',
        'Click Convert and download the result, with the recognised text now selectable and searchable.',
      ];
    case 'tts':
      return [
        'Type or paste your text into the box — up to 4096 characters per conversion.',
        'Choose a voice, a speaking speed and an output format.',
        'Click Convert and download the finished audio file.',
      ];
    case 'stt':
      return [
        'Upload your recording, or record straight from your microphone using the button on the page.',
        'Optionally set the spoken language to improve accuracy, and choose TXT or DOCX output.',
        'Click Convert, read the transcript on the page, then download it.',
      ];
    case 'subtitle':
      return [
        'Upload the video you want captioned.',
        'Choose SRT or VTT, and set the spoken language if you know it.',
        'Click Convert and download the timed subtitle file, ready to drop into your player or editor.',
      ];
    case 'compress':
      return [
        `Drop your ${fn} ${fn === 'GIF' ? 'animation' : 'image'}${fn === 'GIF' ? '' : 's'} onto the upload area, or click to browse. You can add a whole folder at once.`,
        'Click Convert — the file is re-encoded at a smaller size while staying in the same format.',
        'Download the result and compare it against the original size shown on the page.',
      ];
    default:
      return null;
  }
}

// Replacement middle questions for tools that are not a plain format pair.
// Each entry supplies [questionTwo, questionThree]; either may be null to keep
// the generated one.
const SHAPE_FAQ = {
  'pdf-merge': [
    {
      q: 'Will merging reduce the quality of my PDFs?',
      a: 'No. The pages are copied into the new document exactly as they are rather than re-rendered, so text stays selectable and images keep their original resolution. The merged file is roughly the combined size of the originals — run it through Compress PDF afterwards if that matters.',
    },
    {
      q: 'How many PDFs can I merge at once, and does the order matter?',
      a: 'You can add as many files as you need in one go, and the order absolutely matters: the finished document follows the order shown in the list, which you can drag to rearrange before merging. Set the order first, then merge — it is quicker than fixing it afterwards.',
    },
  ],
  'pdf-split': [
    {
      q: 'How do I choose which pages to extract?',
      a: 'Type them into the page-ranges box using commas and hyphens: "1-3, 5, 7-10" gives you pages one to three, page five, and pages seven to ten in a single output document. Page numbers refer to the PDF’s own pages, counting from one, which is not always the number printed on the page itself.',
    },
    {
      q: 'Does splitting change the original PDF?',
      a: 'No. Your uploaded file is never modified — the extracted pages are written to a new document and the original is left untouched, then deleted from our servers within 24 hours along with the result.',
    },
  ],
  'pdf-compress': [
    {
      q: 'How much smaller will my PDF get?',
      a: 'It depends entirely on what is inside. PDFs dominated by scans or photographs often shrink by 50–90%, because that is where nearly all the size lives. A text-only PDF is already compact and may barely change. Text and vector graphics stay sharp either way — the saving comes from re-encoding images and dropping redundant embedded data.',
    },
    {
      q: 'Will the text still be selectable and searchable?',
      a: 'Yes. Compression works on the embedded images and on redundant internal data; the text layer, fonts, links and bookmarks are left intact, so you can still search, select and copy from the compressed file exactly as before.',
    },
  ],
  'pdf-compress-ai': [
    {
      q: 'How is this different from ordinary PDF compression?',
      a: 'Ordinary compression applies one setting to the whole file. This tool looks at what each page actually contains first, so photographic images, flat diagrams and text-only pages are each handled the way that saves the most space without visibly degrading them. On mixed documents that usually means a smaller file at the same apparent quality.',
    },
    {
      q: 'Will the text still be selectable and searchable?',
      a: 'Yes. The text layer, fonts, links and bookmarks are preserved — only the embedded images and redundant internal data are re-encoded, so the compressed PDF stays fully searchable and copyable.',
    },
  ],
  'pdf-rotate': [
    {
      q: 'Does rotating a PDF lose any quality?',
      a: 'None at all. Rotation changes the page geometry recorded in the file rather than re-rendering anything, so text stays vector-sharp, images are untouched and the file size barely moves. You can rotate again later without any cumulative damage.',
    },
    {
      q: 'Can I rotate only some of the pages?',
      a: 'The rotation you choose — 90°, 180° or 270° — is applied to the document. If different pages are wrong in different directions, the usual approach is to split the PDF, rotate each part by the angle it needs, and merge the results back together with the Merge PDF tool.',
    },
  ],
  'pdf-protect': [
    {
      q: 'What happens if I forget the password?',
      a: 'The file cannot be opened. Encryption is applied to the PDF itself, so there is no reset link and no back door — not for you and not for us. Store the password somewhere safe before you send the document on, and send it through a different channel from the file.',
    },
    {
      q: 'How strong is the protection?',
      a: 'The PDF is encrypted with the industry-standard scheme built into the format, so its contents cannot be read without the password by any compliant reader. The practical weak point is never the algorithm but the password itself — a short or obvious one is quick to guess, so use a long one for anything genuinely confidential.',
    },
  ],
  'pdf-unlock': [
    {
      q: 'Can this remove a password I do not know?',
      a: 'No. You have to supply the current password; the tool decrypts the file with it rather than breaking the encryption. It is meant for documents you own or are authorised to open — a statement from your own bank, for instance — where the restriction is simply getting in the way.',
    },
    {
      q: 'What can I do with the file afterwards?',
      a: 'Everything the protection was blocking: opening it without a prompt, printing it, copying text out of it and editing it in other software. The page content itself is unchanged — only the encryption layer and its usage restrictions are removed.',
    },
  ],
  metadata: [
    {
      q: 'Does this change my file in any way?',
      a: 'No. The file is read, not converted — nothing is written back and nothing new is produced except the information shown on screen. It is the safest tool here to point at a file you are unsure about.',
    },
    {
      q: 'What kind of information will I see?',
      a: 'It depends on the file. Images show dimensions, colour depth and EXIF data such as camera model, lens, exposure and, when the camera recorded it, GPS coordinates. Audio shows duration, bitrate, sample rate and channel count. Video adds codec, resolution and frame rate. Documents show page count, author, producer and creation date.',
    },
  ],
  ocr: [
    {
      q: 'How accurate is the text recognition?',
      a: 'A clean, straight scan of printed text at a reasonable resolution recognises very accurately. Accuracy drops with skewed or blurred pages, low-contrast photographs, unusual fonts and handwriting. Choosing the right language matters, because recognition uses it to resolve ambiguous characters.',
    },
    {
      q: 'What is the difference between the searchable PDF and the plain text output?',
      a: 'The searchable PDF keeps the original page image exactly as it looks and adds an invisible text layer underneath, so the document appears unchanged but can now be searched and copied from — this is what you want for archiving. Plain text throws the layout away and gives you just the words, which is what you want for editing, scripting or feeding into another program.',
    },
  ],
  tts: [
    {
      q: 'How natural do the voices sound?',
      a: 'These are neural voices rather than the older stitched-together speech synthesis, so they carry sentence-level intonation and natural pauses instead of reading word by word. Six voices are available, from neutral to warm to authoritative, and the speaking rate is adjustable. Punctuation matters more than people expect: commas and full stops shape the phrasing, so well-punctuated text reads back noticeably better.',
    },
    {
      q: 'How much text can I convert at once?',
      a: 'Up to 4096 characters per conversion — roughly 600 to 700 words, or about five minutes of speech. For anything longer, split the text at a natural break such as a chapter or section heading and convert each part separately; the voice and speed settings stay consistent between runs, so the pieces join up cleanly.',
    },
  ],
  stt: [
    {
      q: 'How accurate is the transcription?',
      a: 'Clear speech in a reasonably quiet setting transcribes very accurately, including across a wide range of accents. Accuracy falls with heavy background noise, several people talking over one another, or very specialised jargon and proper nouns. Setting the spoken language rather than leaving it on auto-detect helps noticeably.',
    },
    {
      q: 'Can I record straight from my microphone?',
      a: 'Yes — the recorder on this page captures audio directly in the browser, which is often quicker than finding a recording app first. Your browser will ask for microphone permission the first time. You can also upload an existing file, and the transcript appears on the page so you can read it before downloading it as TXT or DOCX.',
    },
  ],
  subtitle: [
    {
      q: 'How accurate are the generated subtitles?',
      a: 'Clear speech transcribes very accurately, including across accents. Background music, crosstalk and specialised terminology are where errors creep in, and setting the spoken language rather than auto-detecting it helps. The output is a plain text subtitle file, so fixing the occasional word takes seconds in any text editor.',
    },
    {
      q: 'Should I choose SRT or VTT?',
      a: 'SRT is the safer default: YouTube, Vimeo, Premiere, Final Cut, VLC and virtually every player accept it. Choose VTT if the subtitles are for an HTML5 video player on a website, since WebVTT is the format the browser’s native caption track expects and it supports styling and positioning that SRT cannot express.',
    },
  ],
  soon: [
    {
      q: 'When will this be available?',
      a: 'It is in active development. The tool will appear here and start accepting files as soon as it is ready — nothing needs to be installed or enabled on your side.',
    },
    {
      q: 'What can I use in the meantime?',
      a: 'The rest of the converter is fully available: documents, images, audio, video, archives, GIFs and the PDF toolkit all work today, as do the Smart Functions for OCR, transcription and subtitles.',
    },
  ],
  compress: (fn) => [
    {
      q: `Will the compressed file still be a ${fn}?`,
      a: `Yes — the format does not change, only the size. What you download is an ordinary ${fn} that opens anywhere the original did.${fn === 'PNG' || fn === 'GIF' ? ' Transparency and animation are preserved.' : ''} How much you save depends on the source: ${fn === 'PNG' ? 'screenshots and flat interface graphics compress dramatically, while photographs saved as PNG have less to give' : fn === 'GIF' ? 'long animations and noisy footage compress the most, because there is more redundancy to remove' : 'photographs compress well, while images that were already heavily compressed have less left to give'}.`,
    },
    {
      q: 'How much smaller will the file get?',
      a: 'Typically somewhere between a third and a tenth of the original, depending entirely on what the file contains and how it was saved in the first place. The page shows the before and after sizes side by side once the conversion finishes, so you can see the actual saving rather than guess at it.',
    },
  ],
  hub: (fn, tn, tool) => [
    {
      q: `Which formats can I convert between?`,
      a: `Input: ${listNames(tool.inputFormats, 10)}. Output: ${listNames(tool.outputFormats, 10)}. Any input can go to any output, so you do not need to find a separate page for each combination — pick the file, pick the target format, convert.`,
    },
    {
      q: 'Will I lose quality?',
      a: 'It depends on the pair. Moving into a lossless format keeps everything but produces a larger file; moving into a compressed format discards some data by design in exchange for size, and the advanced settings let you decide where on that trade-off to sit. Converting between two compressed formats sheds a little detail each time, so it is worth keeping the original as your master copy.',
    },
  ],
  'hub-extract': [
    {
      q: 'Does this keep the video as well?',
      a: 'No — only the sound. The audio track is lifted out of the video and saved on its own, which is why the result is a small fraction of the original file size. The audio is not re-recorded, so it keeps the quality it already had inside the video; extracting from a low-bitrate clip cannot produce high-bitrate audio.',
    },
    {
      q: 'Which output format should I pick?',
      a: 'MP3 for maximum compatibility — it plays on every phone, car stereo and player. AAC or M4A if the destination is an Apple device or a modern app, since they sound slightly better at the same bitrate. WAV or FLAC only if you are going to edit the audio, because both are lossless and correspondingly large.',
    },
  ],
  'hub-gif': [
    {
      q: 'Why does the GIF look worse than the original?',
      a: 'Because GIF allows only 256 colours per frame, while video and photographs contain millions. The encoder picks a palette and approximates the rest, which shows up as banding in gradients and skies. GIF also carries no audio at all. Both limits are inherent to the format rather than to the conversion.',
    },
    {
      q: 'Why is my GIF file so large?',
      a: 'GIF compresses far less efficiently than modern video codecs, so file size grows quickly with length, resolution and frame rate. A few seconds is the sweet spot. If the result is too heavy, trim the clip shorter, and if size matters more than autoplaying inline, an MP4 will show the same animation at a fraction of the size.',
    },
  ],
};

// ── Main entry point ─────────────────────────────────────────────────
//
// Returns { pair, from, to, intro, steps, faq } for a tool definition, or
// null if the tool is unknown.
export function buildToolContent(tool) {
  if (!tool) return null;

  const shape = ACTION_SHAPES[tool.slug] || 'convert';
  const fromKey = (tool.inputFormats || [])[0];
  const toKey = (tool.outputFormats || [])[0];
  const f = fmt(fromKey);
  const t = fmt(toKey);

  // Heading names come from the tool's own label when it reads "X to Y",
  // so the headings match the page title exactly ("PDF to Word", not
  // "PDF to Word (DOCX)").
  const labelMatch = /^(.+?) to (.+)$/.exec(tool.label || '');
  const isPair = shape === 'convert' && !!labelMatch;
  const from = labelMatch ? labelMatch[1] : (f ? f.name : '');
  const to = labelMatch ? labelMatch[2] : (t ? t.name : '');
  const fn = f ? f.name : from;
  const tn = t ? t.name : to;

  const reason = REASONS[tool.slug] || '';
  const family = (f && f.family) || (t && t.family) || 'document';
  const speed = SPEED[family] || SPEED.document;
  const isSmart = tool.category === 'Smart Functions';

  // ── Intro ──
  let intro;
  if (shape === 'hub' || shape === 'hub-extract' || shape === 'hub-gif') {
    const ins = listNames(tool.inputFormats, 12);
    const outs = listNames(tool.outputFormats, 12);
    intro = shape === 'hub-extract'
      ? `This tool pulls the audio track out of a video file and saves it on its own, turning a video file into a plain audio file you can play anywhere. It accepts ${ins} and writes ${outs}. The video track is simply discarded, which is why the result is a small fraction of the original size. ${reason}`
      : shape === 'hub-gif'
        ? `This tool turns ${ins} files into animated GIFs. ${FORMATS.gif.about} ${reason}`
        : `This is the general-purpose ${(tool.category || '').toLowerCase()} converter: it accepts ${ins} and writes ${outs}, so you do not have to hunt for the one specific tool that matches your pair of formats. ${reason} Pick your output format from the dropdown above and the conversion is handled server-side — nothing to install.`;
  } else if (shape === 'compress') {
    intro = `${f ? f.about : ''} This tool re-encodes your ${fn} at a smaller file size without changing the format, so what you download is still an ordinary ${fn} that opens exactly where the original did. ${reason}${f && f.codec === 'lossless' && fn !== 'GIF' ? ` Because ${fn} is lossless, most of the saving comes from smarter encoding and palette reduction rather than from throwing detail away.` : ''}`;
  } else if (shape === 'soon') {
    intro = `${reason} This tool is not live yet — it is in active development and will appear here as soon as it is ready.`;
  } else if (shape !== 'convert') {
    // PDF actions, metadata and Smart Functions: the source format is the
    // subject, so lead with what it is and what the action does to it.
    const lead = {
      'pdf-merge': `Merging combines several PDFs into one file, in the order you choose, without re-rendering the pages — text stays selectable and images keep their original quality. ${FORMATS.pdf.about}`,
      'pdf-split': `Splitting extracts the pages you name from a PDF and saves them as a new document, leaving the original untouched. ${FORMATS.pdf.about}`,
      'pdf-compress': `Compressing a PDF re-encodes the images inside it and strips redundant embedded data, which is where nearly all of the size in a large PDF actually lives. Text and vector graphics are left sharp.`,
      'pdf-compress-ai': `This tool analyses what is inside the PDF before compressing it, so photographic images, flat graphics and text pages can each be handled the way that saves the most space without visibly degrading them.`,
      'pdf-rotate': `Rotating changes the orientation flag and page geometry of a PDF so the pages display and print the right way up. Nothing is re-rendered, so no quality is lost.`,
      'pdf-protect': `Protecting a PDF encrypts its contents so it cannot be opened without the password you set. The encryption is applied to the file itself, not to a wrapper around it.`,
      'pdf-unlock': `Unlocking removes the password and the usage restrictions from a PDF you already have the password for, so it can be opened, printed and copied from normally again.`,
      'metadata': `Every file carries information about itself that is not visible when you open it: image dimensions and camera settings, audio duration and bitrate, video codec and frame rate, document author and page count. This tool reads that metadata and shows it to you.`,
      'ocr': `Optical character recognition looks at an image of text — a scan, a photo, a PDF page with no text layer — and works out what the characters are, turning a picture of words into words a computer can search, copy and edit.`,
      'tts': `Text to speech generates spoken audio from written text using neural voices, so you get a natural-sounding recording rather than the flat robotic output older systems produced.`,
      'stt': `Speech to text transcribes spoken audio into written words. It handles natural speech, accents and background noise far better than dictation software used to, and returns a transcript you can edit.`,
      'subtitle': `The subtitle generator transcribes the speech in a video and writes it out with timecodes, producing a standard subtitle file rather than a plain transcript.`,
    }[shape] || '';
    intro = `${lead} ${reason}`;
  } else {
    // The ordinary case: an honest description of both formats, then why
    // anyone moves between them, then what changes on the way.
    const bridge = t && t.note ? ` ${t.note}` : '';
    intro = `${f ? f.about : `${fn} is the source format for this conversion.`} ${t ? t.about : ''} ${reason}${bridge}`;
  }
  intro = intro.replace(/\s+/g, ' ').trim();

  // ── Steps ──
  let steps = actionSteps(shape, tool, fn, tn);
  if (shape === 'soon') {
    steps = [
      'Choose the tool you need from the Tools page — everything except this one is live today.',
      'Upload your file and pick an output format.',
      'Download the result, or check back here once document translation goes live.',
    ];
  }
  if (!steps) {
    const isHub = shape.startsWith('hub');
    const inLabel = isHub
      ? `${(tool.category || 'source').toLowerCase()} file (${listNames(tool.inputFormats, 12)} are all accepted)`
      : `${fn} file`;
    const outChoice = isHub
      ? `Pick the output format you need${(tool.outputFormats || []).length > 1 ? ' from the dropdown' : ''}`
      : `Choose ${tn} as the output format${(tool.outputFormats || []).length > 1 ? ' from the dropdown' : ''}`;
    const tuning = (family === 'image' || family === 'video' || family === 'audio')
      ? ', adjust quality or size under advanced settings if you need to,'
      : '';
    steps = [
      `Drop your ${inLabel} onto the upload area at the top of this page, or click it to browse your device.${isSmart ? '' : ' You can add several files — or a whole folder — and convert them all in one go.'}`,
      `${outChoice}${tuning} and click Convert.`,
      `Download your finished ${isHub ? '' : tn + ' '}file. The download link stays live for 24 hours, after which both files are deleted automatically.`,
    ];
  }

  // ── FAQ ──
  const costAnswer = isSmart
    ? `New accounts get a free conversion credit so you can try it, and Smart Functions are billed by usage rather than per file — ${tool.slug === 'text-to-speech' ? '1 credit per 1000 characters of text' : '1 credit per 5 minutes of audio or video'}, rounded up. There is no subscription: credits are bought in small prepaid packs, they never expire, and a conversion that fails never costs you anything.`
    : `New accounts get a free conversion credit, so your first ${isPair ? `${from} to ${to} conversion` : 'file'} costs nothing. After that each conversion uses one credit from a small prepaid pack — there is no subscription, credits never expire, and if a conversion fails you are not charged for it.`;

  const faq = [
    {
      q: isPair ? `Is converting ${from} to ${to} free?` : `Is ${tool.label} free to use?`,
      a: costAnswer,
    },
    qualityFaq(fromKey, toKey, tool),
    relationFaq(fromKey, toKey, tool) || compatibilityFaq(fromKey, toKey),
    {
      q: isPair ? `How long does the ${from} to ${to} conversion take?` : `How long does ${tool.label} take?`,
      a: `${speed} Upload speed is usually the limiting factor, so a large file on a slow connection takes longer than the conversion itself does.${isSmart ? ' Smart Functions accept files up to 25 MB; standard conversions accept up to 200 MB.' : ' Files up to 200 MB are accepted.'}`,
    },
    {
      q: isPair ? `Is it safe to upload my ${from} file?` : `Is my file safe?`,
      a: `Files travel over an encrypted TLS connection and are used for nothing except the conversion you asked for. Both your original ${isPair ? from + ' file' : 'file'} and the ${isPair ? to + ' file' : 'result'} we hand back are deleted automatically within 24 hours — permanently, with no backups kept — and the contents are never read, analysed or shared. The service is operated from Germany under the GDPR.`,
    },
  ];

  // Specialised shapes: the generic lossy/lossless questions do not apply, so
  // both middle questions are replaced with ones that do.
  const overrides = SHAPE_FAQ[shape];
  if (overrides) {
    const pair = typeof overrides === 'function' ? overrides(fn, tn, tool) : overrides;
    if (pair[0]) faq[1] = pair[0];
    if (pair[1]) faq[2] = pair[1];
  }

  if (shape === 'metadata') {
    faq[3] = {
      q: 'How long does it take to read a file’s metadata?',
      a: 'A second or two once the file has uploaded. Nothing is converted or re-encoded — the headers are parsed and the result is printed straight to the page — so the wait is essentially the upload itself.',
    };
    faq[0] = {
      q: 'Is the File Info tool free?',
      a: 'Yes. Reading a file’s metadata is not a conversion, so it does not use a credit — you can inspect as many files as you like. Credits are only spent when a tool actually produces a new file for you.',
    };
  }

  if (shape === 'soon') {
    faq[0] = {
      q: `Is ${tool.label} available yet?`,
      a: 'Not yet — this page is a placeholder while the tool is being built, so there is nothing to upload here today. Pricing will follow the same prepaid credit model as the rest of the site: no subscription, credits that never expire, and no charge for a conversion that fails.',
    };
    faq[3] = {
      q: 'Will it cost extra?',
      a: 'It will use the same credits as everything else on the site. There is no separate plan or subscription to sign up for, and any credits already in your account will work with it the moment it goes live.',
    };
  }

  return {
    pair: isPair,
    from,
    to,
    label: tool.label,
    intro,
    steps,
    faq: faq.filter(Boolean),
  };
}

// FAQPage structured data for Google rich results. Kept next to the content
// so the markup on the page and the markup in the JSON-LD can never drift.
export function buildFaqJsonLd(content) {
  if (!content || !content.faq || !content.faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

// HowTo structured data. Google no longer shows HowTo rich results on
// desktop or mobile search, so this is deliberately *not* emitted — the
// steps are marked up semantically in HTML instead.
