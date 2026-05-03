// One-shot: rewrites FAQ (20 Q&A) and About content in all 10 supported
// languages. Replaces the `faq` and `about` blocks in i18n.js (English
// source) and the matching blocks in each non-English language section
// in i18n-translations.js.
//
// Run from repo root:  node scripts/rewrite-faq-about.js

const fs = require('fs');
const path = require('path');

const I18N = path.join(__dirname, '..', 'client', 'src', 'i18n.js');
const TRANS = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');

// =====================================================================
// English: FAQ — 20 detailed Q&A
// =====================================================================
const enFaq = {
  title: 'Frequently asked questions',
  subtitle: 'Everything you need to know about {{brand}} — conversions, pricing, security, Smart Functions, and more.',
  seoDesc: 'Frequently asked questions about {{brand}}. Conversions, pricing, security, Smart Functions, languages, refunds and contact.',

  q1: 'How does the conversion work, step by step?',
  a1: 'Conversion is a four-step process. First, drag and drop your file onto the upload area, or click to browse — most browsers accept files up to 200 MB. Second, choose your output format from the dropdown (we only show formats compatible with your input). Third, optionally adjust advanced settings such as quality, resolution, or OCR language. Fourth, click Convert: we send the file securely to our processing provider, deduct the appropriate credits, and return a download link within seconds for most files. Larger video files can take a few minutes; you can leave the page and we will email you when the result is ready if you opt in.',

  q2: 'What file formats are supported?',
  a2: 'Over 50 formats across six categories. Documents: PDF, Word (DOCX, DOC), Excel (XLSX, XLS), PowerPoint (PPTX, PPT), RTF, ODT, HTML. Images: JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO. Audio: MP3, WAV, FLAC, AAC, OGG, WMA, M4A. Video: MP4, AVI, MOV, MKV, WebM, FLV, WMV. Archives: ZIP, RAR, 7Z, TAR, GZ. Plus dedicated PDF tools for merging, splitting, compressing, rotating, password-protecting, and unlocking. The full list of every supported conversion combination is on the Tools page; if you do not see your format combination, send us a request and we will consider adding it.',

  q3: 'How does the credit system work?',
  a3: '{{brand}} uses a prepaid credit model — no subscriptions, no recurring charges. Each standard conversion costs 1 credit. Smart Functions are priced by usage: Text-to-Speech costs 1 credit per 1000 input characters (rounded up), and Speech-to-Text plus Auto Subtitle Generator cost 1 credit per 5 minutes of audio or video duration (rounded up). Failed conversions are always free — if our processor returns an error, no credit is deducted. Credits never expire and roll over indefinitely. You can view your balance and full transaction history in your Dashboard, and earn 5 bonus credits for each friend who signs up using your referral link.',

  q4: 'What does each pricing pack include and how do I buy?',
  a4: 'Three credit packs: 1 credit for €0.99 (great for a one-off conversion), 10 credits for €7.99 (best for occasional use, ~19% discount versus single-credit pricing), and 30 credits for €20.99 (best for power users, ~30% discount). All prices include 19% German VAT. To purchase, visit the Pricing page, click your chosen pack, and complete checkout via Stripe — we accept all major credit and debit cards plus SEPA Direct Debit where supported. You will receive a tax-compliant invoice by email immediately, and credits appear in your account within seconds of payment confirmation.',

  q5: 'How long are files stored before they are deleted?',
  a5: 'Both your uploaded source file and the converted output are automatically and permanently deleted within 24 hours of upload. There are no exceptions and no manual extensions — deletion is enforced by an automated cleanup job that runs continuously. After deletion the download link stops working. We retain no copies, backups, thumbnails, or cached versions on our infrastructure or with our sub-processors. If you need a converted file beyond the 24-hour window, please download it and store it locally yourself. This 24-hour rule supports your GDPR right to data minimisation.',

  q6: 'Is the website secure and GDPR compliant?',
  a6: 'Yes. {{brand}} is operated from Germany and fully subject to the GDPR. All data transfers use TLS 1.2 or higher; passwords are hashed with bcrypt (we never see or store your plain-text password); session cookies are httpOnly with the SameSite=Strict attribute. We have signed Data Processing Agreements with every sub-processor under Art. 28 GDPR. Transfers outside the EEA rely on EU Standard Contractual Clauses or, for Google, the EU-US Data Privacy Framework. We never sell your data. You retain all GDPR rights including access, rectification, erasure, and the right to lodge a complaint with the Landesbeauftragte NRW.',

  q7: 'What happens to my files after the conversion?',
  a7: 'When you click Convert your file is uploaded to our server, then forwarded over an encrypted connection to our processing provider — CloudConvert for standard format conversions and OpenAI for Smart Functions. The provider performs only the conversion you requested and returns the result. We do not access, read, analyse, or share the content of your files for any other purpose, ever. Both files (input and output) are removed from our servers and from sub-processor caches within 24 hours. Stripe never sees your file content; only payment metadata.',

  q8: 'Can files be recovered after deletion?',
  a8: 'No. Deletion is permanent and irreversible. We do not maintain backups of user files (database backups exclude file data on purpose). Once the 24-hour window expires the files are removed from primary storage and from any backup snapshots within minutes. This is intentional design: it minimises your data exposure, it supports your GDPR right to erasure under Art. 17, and it lets us promise that no third party can subpoena old files we no longer have. Always download your converted files within 24 hours and store them somewhere safe locally.',

  q9: 'What is the maximum file size?',
  a9: 'Standard format conversions accept files up to 200 MB each. Smart Functions tools (OCR, Text-to-Speech, Speech-to-Text, Auto Subtitle Generator) are limited to 25 MB per file because that is the hard limit imposed by the OpenAI API. If your file exceeds these limits you have a few options: split it locally first (most video editors and the ffmpeg command-line tool can do this), convert each piece separately, then merge afterwards. For very large enterprise needs — recurring multi-gigabyte transcoding, batch processing, or higher rate limits — please contact us at support@convertanyformat.com to discuss custom arrangements.',

  q10: 'Which browsers are supported?',
  a10: 'All modern browsers updated within the last two years: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, plus most mobile browsers including Samsung Internet, Opera, and Brave. JavaScript and cookies must be enabled. For the Speech-to-Text microphone recording feature you will need to grant browser microphone permission when prompted. We do not officially support Internet Explorer or browsers that have not received security updates in over two years; the site may still work but we cannot guarantee correct behaviour.',

  q11: 'Does it work on mobile?',
  a11: 'Yes — {{brand}} is fully mobile-optimised. The interface adapts to phone screens from 320 px upwards, tool cards display in a comfortable 2-column grid on small screens, and every feature including upload, conversion, download, and Smart Functions works on iOS Safari and Android Chrome. For audio you can record directly from your phone microphone using the in-page recorder rather than uploading a file. The site is also installable as a Progressive Web App, so you can add it to your home screen and launch it like a native app, with offline-friendly caching of the interface.',

  q12: 'How do I cancel or get a refund?',
  a12: 'There are no recurring subscriptions, so there is nothing to cancel — credits are one-time prepaid purchases that never expire. To request a refund on unused credits, email support@convertanyformat.com from your account email within 14 days of purchase, in line with the German Fernabsatzgesetz. Refunds are processed within 5 to 10 business days back to the original payment method. Used credits are normally non-refundable, but if a conversion failed because of a problem on our side and we did not auto-credit you, mention it in your message and we will refund or re-credit on a case-by-case basis. To delete your account entirely, visit your Profile page and use the Delete Account button in the Danger Zone.',

  q13: 'What are the Smart Functions tools?',
  a13: 'Smart Functions are AI-powered tools that go beyond pure format conversion. The current line-up: OCR (extracts editable text from scanned PDFs and images), PDF Compress with AI (intelligently reduces PDF file size while preserving readability), Text to Speech (generates natural-sounding MP3, OPUS, or AAC audio from typed or uploaded text using OpenAI TTS-1), Speech to Text (transcribes audio to TXT or DOCX using OpenAI Whisper, with optional language hint), and the Auto Subtitle Generator (creates timed SRT or VTT subtitle files from video). These tools are billed by usage rather than a flat per-file rate so you only pay for what you use.',

  q14: 'What is OCR and when should I use it?',
  a14: 'OCR (Optical Character Recognition) extracts editable text from images of text. Use it whenever you have a scanned PDF, a photo of a printed document, or any image where the text on screen is not selectable. {{brand}}\'s OCR returns either a searchable PDF (preserving the original layout with an invisible text layer added underneath, so users can search and copy text) or a plain-text file. Common use cases: digitising paper documents for archiving, making old PDF archives searchable, extracting quotes from screenshots, or preparing scanned documents for editing in Word.',

  q15: 'How does Text to Speech work?',
  a15: 'Type or paste up to 4096 characters into the text box, choose one of six voices (Alloy is neutral; Echo is warm and male; Fable has a British accent and is expressive; Onyx is deep and authoritative; Nova is friendly and clear; Shimmer is soft and gentle), pick playback speed (0.75x, 1.0x, 1.25x, or 1.5x), select an output format (MP3, OPUS, or AAC), and click Convert. Within seconds you will receive a download link to a natural-sounding audio file. The feature is powered by OpenAI\'s TTS-1 model. Cost is 1 credit per 1000 characters, rounded up.',

  q16: 'How does Speech to Text work?',
  a16: 'Upload an audio file (MP3, WAV, M4A, OGG, MP4, WebM) up to 25 MB and we will transcribe it using OpenAI\'s Whisper model — the same engine that powers many professional transcription services. Choose between TXT (plain text) and DOCX (Microsoft Word) output. You can also record directly from your microphone using the built-in recorder. If you know which language is spoken you can pass an optional language hint to improve accuracy. Cost is 1 credit per 5 minutes of audio, rounded up. The transcript is shown on the page so you can review it before downloading.',

  q17: 'How does the Auto Subtitle Generator work?',
  a17: 'Upload a video file (MP4, MOV, AVI, MKV) up to 25 MB. We extract the audio track if needed (using CloudConvert for non-MP4 containers) then transcribe it through OpenAI Whisper using a timestamp-aware response format. The result is a professional SRT or VTT subtitle file ready to drop into YouTube, Vimeo, Premiere, Final Cut, or any video editor. Optional language hint improves accuracy when you know what language is spoken. Cost is 1 credit per 5 minutes of video, rounded up. Output uses standard timing conventions so it works with every common subtitle player.',

  q18: 'What languages are supported?',
  a18: 'The {{brand}} interface is translated into 17 European languages: English, German, French, Spanish, Italian, Portuguese, Dutch, Polish, Swedish, Norwegian, Danish, Finnish, Czech, Romanian, Hungarian, Greek, and Turkish. Switch language anytime via the dropdown in the navigation bar — your choice is remembered for future visits. For Smart Functions: OpenAI Whisper supports speech recognition in over 50 languages; OpenAI TTS produces natural speech in over 30 languages; OCR works with English, German, French, Spanish, Italian, Portuguese, Chinese, Japanese, and Korean.',

  q19: 'How do I change my account settings?',
  a19: 'Click your name in the navigation bar to reach your Profile page. From there you can update your email address (a verification email is sent to the new address before the change takes effect), set or change your display name, change your password (you need your current one), configure email notification preferences, view your conversion history and credit balance, generate or rotate an API key for integrations, find your referral code, and — at the bottom of the page in the Danger Zone — permanently delete your account. Account deletion removes all associated data within 30 days, except records we are legally required to retain.',

  q20: 'How do I contact support?',
  a20: 'Email us anytime at support@convertanyformat.com. We aim to respond within 24 hours on business days and within 48 hours on weekends. For data-protection enquiries (GDPR rights, deletion requests, complaints) please use the same email and mention "Datenschutz" or "GDPR" in the subject line — those are routed with priority. You can also use the contact form on the /contact page. We do not currently offer phone support, but we are happy to schedule a video call for enterprise enquiries or partnership discussions; please mention this in your initial email.',
};

// =====================================================================
// English: About — rewritten for depth + professionalism, same key shape
// =====================================================================
const enAbout = {
  title: 'About {{brand}}',
  seoDesc: 'About {{brand}} — our mission, what makes us different, our security and privacy commitments, and the team behind the file converter.',
  whatTitle: 'What we do',
  whatBody: '{{brand}} is a web-based file conversion platform that lets you transform documents, images, audio, video, archives, and PDFs across more than fifty formats — directly in your browser, with no installation, no software downloads, and no paywalls hiding the basics. Beyond format conversion, our Smart Functions suite uses leading AI models for OCR, Text-to-Speech, Speech-to-Text transcription, and automatic subtitle generation. We built {{brand}} because file conversion should be fast, private, and pleasant to use — and most existing tools fall short on at least one of those.',

  whyTitle: 'Why we built it',
  whyBody: 'Every existing converter we tried frustrated us in some way: cluttered with intrusive ads, stuffed with tracking scripts, slow to deliver results, or hiding essential features behind subscriptions. Worse, many quietly retained user files for analytics or training. We built {{brand}} as the converter we wished existed: clean and uncluttered, fast (most conversions complete in seconds), priced on a transparent pay-as-you-go basis with no recurring charges, and built around a strict 24-hour file-deletion guarantee. Your files are yours; we just convert them and step out of the way.',

  diffTitle: 'What makes us different',
  diff1Title: 'Privacy by design:',
  diff1Body: 'every uploaded file and every converted output is permanently deleted within 24 hours, enforced automatically. We never read, analyse, share, or sell your file contents. There are no analytics that capture file metadata. Our privacy policy documents every sub-processor.',
  diff2Title: '50+ formats in one place:',
  diff2Body: 'documents, images, audio, video, archives, and dedicated PDF tools (merge, split, compress, rotate, protect, unlock) — all under one consistent interface, so you do not need a different website for each format you encounter.',
  diff3Title: 'No installation, no plugins:',
  diff3Body: 'everything runs in your browser, on desktop or mobile, without downloading anything. The site is also installable as a Progressive Web App if you want it on your home screen.',
  diff4Title: 'Batch processing built in:',
  diff4Body: 'convert dozens of files in one go, monitor each one\'s progress live, and download them individually or zipped together. Drag-and-drop reordering for PDF merge.',
  diff5Title: 'Developer-friendly REST API:',
  diff5Body: 'every conversion you can do in the browser is also available programmatically. Generate a key from your dashboard, call the documented endpoints, and integrate conversion into your own apps with minimal effort.',
  diff6Title: 'Honest, transparent pricing:',
  diff6Body: 'pay-as-you-go credits, no hidden fees, no auto-renewing subscriptions, credits that never expire, and tax-compliant invoices for every purchase. You can see the exact cost of every conversion before you confirm.',

  missionTitle: 'Our mission',
  missionBody: 'To make file conversion simple, secure, and accessible to everyone — without compromise. We believe the basics (converting a PDF, resizing an image, ripping audio from a video) should be available to anyone with a browser, priced fairly, and respectful of privacy. We measure success not by how much data we accumulate but by how quickly users convert what they need and get on with their day. Every architectural decision we make passes through that lens.',

  valuesTitle: 'Our values',
  privacyTitle: 'Privacy',
  privacyBody: 'Your files are yours. We process them, deliver the result, and delete everything within 24 hours. We collect the minimum personal data necessary to operate the service and document every byte of it in our Privacy Policy. We never sell data. We never train models on your content.',
  simplicityTitle: 'Simplicity',
  simplicityBody: 'No confusion, no clutter. Drop a file, pick a format, click Convert. No paywalls hiding basic functions, no popups disguising ads as buttons, no labyrinthine settings. Where advanced options exist, they are advanced — never required.',
  transparencyTitle: 'Transparency',
  transparencyBody: 'Pricing is published, credits never expire, every sub-processor is named in the Privacy Policy, and the source of any AI-generated content is disclosed. Where we use third-party services we say so; where data leaves the EEA we explain the safeguards in place.',
  qualityTitle: 'Quality',
  qualityBody: 'We use industry-leading conversion technology — CloudConvert for traditional formats, OpenAI for AI-powered Smart Functions, hardened infrastructure on Railway and Supabase. We test on real files in real browsers and we ship updates continuously rather than once a quarter.',

  teamTitle: 'The team',
  teamBody: '{{brand}} is built and maintained by a small, passionate team based in Düsseldorf, Germany. We are a mix of backend engineers, frontend craftspeople, and one stubborn product manager who refuses to ship anything that flickers on mobile. We do not have investors, advertising contracts, or growth quotas — which means our only customer is you, and our only metric is whether the next conversion you run is fast and gives you the right output.',

  ctaTitle: 'Ready to convert something?',
  ctaBody: 'Browse the full catalogue of conversion tools, pick the one you need, and have a converted file in your downloads folder in seconds. No installation, no signup hurdles for browsing, transparent pay-as-you-go pricing once you do create a free account.',
  ctaButton: 'Browse all tools',
};

// =====================================================================
// German: FAQ — concise but informative translations
// =====================================================================
const deFaq = {
  title: 'Häufig gestellte Fragen',
  subtitle: 'Alles, was Sie über {{brand}} wissen müssen — Konvertierungen, Preise, Sicherheit, Smart Functions und mehr.',
  seoDesc: 'Häufig gestellte Fragen zu {{brand}}. Konvertierungen, Preise, Sicherheit, Smart Functions, Sprachen, Rückerstattungen und Kontakt.',

  q1: 'Wie funktioniert die Konvertierung Schritt für Schritt?',
  a1: 'Vier Schritte: (1) Datei per Drag-and-Drop hochladen oder Browser durchsuchen — bis zu 200 MB; (2) Ausgabeformat aus der Dropdown-Liste wählen (es werden nur kompatible Formate angezeigt); (3) optional erweiterte Einstellungen wie Qualität, Auflösung oder OCR-Sprache anpassen; (4) auf Konvertieren klicken — die Datei wird verschlüsselt an unseren Verarbeiter gesendet, Credits werden abgezogen und Sie erhalten in Sekunden einen Download-Link. Größere Videos können einige Minuten dauern; Sie können die Seite verlassen, wir senden bei Wunsch eine E-Mail.',

  q2: 'Welche Dateiformate werden unterstützt?',
  a2: 'Über 50 Formate in sechs Kategorien. Dokumente: PDF, Word (DOCX, DOC), Excel (XLSX, XLS), PowerPoint (PPTX, PPT), RTF, ODT, HTML. Bilder: JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO. Audio: MP3, WAV, FLAC, AAC, OGG, WMA, M4A. Video: MP4, AVI, MOV, MKV, WebM, FLV, WMV. Archive: ZIP, RAR, 7Z, TAR, GZ. Plus PDF-Werkzeuge zum Zusammenführen, Teilen, Komprimieren, Drehen, Schützen und Entsperren. Die vollständige Liste finden Sie auf der Werkzeuge-Seite.',

  q3: 'Wie funktioniert das Credit-System?',
  a3: '{{brand}} verwendet ein Prepaid-Credit-Modell — keine Abos, keine wiederkehrenden Gebühren. Standardkonvertierungen kosten 1 Credit. Smart Functions werden nutzungsbasiert abgerechnet: Text-zu-Sprache 1 Credit pro 1.000 Zeichen (aufgerundet), Sprache-zu-Text und Untertitelgenerator 1 Credit pro 5 Minuten Audio/Video (aufgerundet). Fehlgeschlagene Konvertierungen sind kostenlos. Credits verfallen nicht. Sie sehen Ihren Saldo im Dashboard und erhalten 5 Bonus-Credits pro geworbenen Freund.',

  q4: 'Was enthält jedes Preispaket und wie kaufe ich?',
  a4: 'Drei Pakete: 1 Credit für 0,99 € (für eine einzelne Konvertierung), 10 Credits für 7,99 € (etwa 19 % Rabatt) und 30 Credits für 20,99 € (etwa 30 % Rabatt). Alle Preise enthalten 19 % MwSt. Auf der Preise-Seite das gewünschte Paket wählen und über Stripe bezahlen — Kredit- und Debitkarten sowie SEPA werden akzeptiert. Sie erhalten sofort eine ordnungsgemäße elektronische Rechnung per E-Mail; die Credits stehen unmittelbar nach Zahlungsbestätigung zur Verfügung.',

  q5: 'Wie lange werden Dateien gespeichert, bevor sie gelöscht werden?',
  a5: 'Sowohl Ihre hochgeladene Originaldatei als auch die konvertierte Ausgabe werden innerhalb von 24 Stunden nach dem Upload automatisch und dauerhaft gelöscht. Es gibt keine Ausnahmen und keine manuellen Verlängerungen — die Löschung wird durch einen automatischen Bereinigungsjob durchgesetzt. Nach der Löschung funktioniert der Download-Link nicht mehr. Wir behalten weder Kopien noch Backups oder Vorschaubilder. Wenn Sie eine Datei länger benötigen, laden Sie sie bitte selbst herunter und speichern Sie sie lokal.',

  q6: 'Ist die Website sicher und DSGVO-konform?',
  a6: 'Ja. {{brand}} wird aus Deutschland betrieben und unterliegt vollständig der DSGVO. Alle Datenübertragungen verwenden TLS 1.2+; Passwörter werden mit bcrypt gehasht; Sitzungs-Cookies sind httpOnly mit SameSite=Strict. Wir haben mit jedem Auftragsverarbeiter einen Vertrag nach Art. 28 DSGVO geschlossen. Datentransfers außerhalb des EWR erfolgen über EU-Standardvertragsklauseln oder das EU-US Data Privacy Framework. Wir verkaufen Ihre Daten nicht. Sie haben alle DSGVO-Rechte einschließlich Auskunft, Löschung und Beschwerde bei der Landesbeauftragten NRW.',

  q7: 'Was passiert mit meinen Dateien nach der Konvertierung?',
  a7: 'Nach dem Klick auf Konvertieren wird Ihre Datei verschlüsselt an unseren Verarbeiter gesendet — CloudConvert für Standardkonvertierungen, OpenAI für Smart Functions. Es wird ausschließlich die von Ihnen angeforderte Konvertierung ausgeführt. Wir greifen nicht auf den Inhalt Ihrer Dateien zu, lesen, analysieren oder teilen ihn nicht. Beide Dateien (Eingabe und Ausgabe) werden innerhalb von 24 Stunden von unseren Servern und aus den Caches der Auftragsverarbeiter entfernt. Stripe sieht keine Dateiinhalte, nur Zahlungsmetadaten.',

  q8: 'Können gelöschte Dateien wiederhergestellt werden?',
  a8: 'Nein. Die Löschung ist endgültig und unwiderruflich. Wir führen keine Backups von Nutzerdateien (Datenbank-Backups schließen Dateidaten bewusst aus). Nach Ablauf der 24-Stunden-Frist werden die Dateien aus dem Primärspeicher und aus allen Backup-Snapshots innerhalb weniger Minuten entfernt. Das ist beabsichtigt: Es minimiert Ihre Datenexposition und unterstützt Ihr DSGVO-Recht auf Löschung nach Art. 17. Laden Sie konvertierte Dateien immer innerhalb von 24 Stunden herunter und sichern Sie sie lokal.',

  q9: 'Wie groß darf eine Datei maximal sein?',
  a9: 'Standardkonvertierungen akzeptieren Dateien bis 200 MB. Smart-Functions-Werkzeuge (OCR, Text-zu-Sprache, Sprache-zu-Text, Untertitelgenerator) sind auf 25 MB pro Datei begrenzt — das ist die harte Grenze der OpenAI-API. Bei größeren Dateien können Sie sie lokal aufteilen (z. B. mit ffmpeg), jeden Teil separat konvertieren und anschließend wieder zusammenfügen. Für sehr große Geschäftsanforderungen schreiben Sie bitte an support@convertanyformat.com — wir besprechen gerne individuelle Lösungen.',

  q10: 'Welche Browser werden unterstützt?',
  a10: 'Alle modernen Browser, die in den letzten zwei Jahren aktualisiert wurden: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ sowie die meisten mobilen Browser einschließlich Samsung Internet, Opera und Brave. JavaScript und Cookies müssen aktiviert sein. Für die Mikrofon-Aufnahme bei Sprache-zu-Text müssen Sie der Mikrofonberechtigung zustimmen. Internet Explorer und Browser ohne Sicherheitsupdates aus den letzten zwei Jahren werden nicht offiziell unterstützt.',

  q11: 'Funktioniert die Seite auf dem Handy?',
  a11: 'Ja — {{brand}} ist vollständig mobil optimiert. Die Oberfläche passt sich Bildschirmen ab 320 px an, Werkzeugkarten werden auf kleinen Bildschirmen in zwei Spalten angezeigt, und alle Funktionen einschließlich Upload, Konvertierung, Download und Smart Functions arbeiten auf iOS Safari und Android Chrome. Audio können Sie sogar direkt vom Handy-Mikrofon aufnehmen. Die Seite ist zusätzlich als Progressive Web App installierbar, sodass Sie sie zum Startbildschirm hinzufügen und wie eine native App starten können.',

  q12: 'Wie kündige ich oder erhalte eine Rückerstattung?',
  a12: 'Es gibt keine wiederkehrenden Abonnements — Credits sind einmalige Käufe, die nicht verfallen. Für eine Rückerstattung nicht verbrauchter Credits schreiben Sie innerhalb von 14 Tagen nach dem Kauf an support@convertanyformat.com (gemäß Fernabsatzgesetz). Erstattungen werden innerhalb von 5–10 Werktagen auf das ursprüngliche Zahlungsmittel zurücküberwiesen. Verbrauchte Credits sind in der Regel nicht erstattungsfähig, außer bei Fehlern auf unserer Seite — schreiben Sie uns, wir prüfen jeden Fall einzeln. Ein Konto löschen Sie über Profil → Gefahrenzone.',

  q13: 'Was sind die Smart-Functions-Werkzeuge?',
  a13: 'Smart Functions sind KI-gestützte Werkzeuge, die über die reine Formatkonvertierung hinausgehen: OCR (extrahiert bearbeitbaren Text aus gescannten PDFs und Bildern), PDF mit KI komprimieren (intelligente PDF-Verkleinerung), Text-zu-Sprache (erzeugt natürlich klingendes MP3-, OPUS- oder AAC-Audio aus Text via OpenAI TTS-1), Sprache-zu-Text (transkribiert Audio zu TXT oder DOCX via OpenAI Whisper) und der automatische Untertitelgenerator (erstellt SRT- oder VTT-Untertiteldateien aus Videos). Diese Werkzeuge werden nutzungsbasiert abgerechnet.',

  q14: 'Was ist OCR und wann sollte ich es verwenden?',
  a14: 'OCR (Optische Zeichenerkennung) extrahiert bearbeitbaren Text aus Bildern. Verwenden Sie es bei gescannten PDFs, Fotos von Dokumenten oder allen Bildern, in denen der Text nicht markierbar ist. {{brand}}\'s OCR liefert entweder eine durchsuchbare PDF (Originallayout mit unsichtbarer Textebene zum Suchen und Kopieren) oder reinen Text. Typische Anwendungen: Digitalisierung von Papierdokumenten, Durchsuchbarmachen alter Archive, Extrahieren von Zitaten aus Screenshots oder Vorbereiten gescannter Dokumente zur Bearbeitung in Word.',

  q15: 'Wie funktioniert Text zu Sprache?',
  a15: 'Geben Sie bis zu 4096 Zeichen in das Textfeld ein, wählen Sie eine von sechs Stimmen (Alloy: neutral; Echo: warm, männlich; Fable: britischer Akzent, ausdrucksstark; Onyx: tief und autoritär; Nova: freundlich und klar, weiblich; Shimmer: weich und sanft, weiblich), Geschwindigkeit (0,75x bis 1,5x), Ausgabeformat (MP3, OPUS oder AAC) und klicken Sie auf Konvertieren. In Sekunden erhalten Sie einen Download-Link zu einer natürlich klingenden Audiodatei. Basiert auf OpenAI TTS-1. Kosten: 1 Credit pro 1.000 Zeichen.',

  q16: 'Wie funktioniert Sprache zu Text?',
  a16: 'Laden Sie eine Audiodatei (MP3, WAV, M4A, OGG, MP4, WebM) bis 25 MB hoch und wir transkribieren sie mit OpenAI Whisper — derselben Engine, die viele professionelle Transkriptionsdienste antreibt. Wählen Sie zwischen TXT (reiner Text) oder DOCX (Word-Dokument). Sie können auch direkt vom Mikrofon aufnehmen. Optional ein Sprachhinweis verbessert die Genauigkeit. Kosten: 1 Credit pro 5 Minuten Audio (aufgerundet). Das Transkript wird auf der Seite angezeigt, damit Sie es vor dem Download prüfen können.',

  q17: 'Wie funktioniert der automatische Untertitelgenerator?',
  a17: 'Laden Sie eine Videodatei (MP4, MOV, AVI, MKV) bis 25 MB hoch. Wir extrahieren bei Bedarf die Audiospur (über CloudConvert für Nicht-MP4-Container) und transkribieren sie mit OpenAI Whisper im zeitstempelbasierten Modus. Das Ergebnis ist eine professionelle SRT- oder VTT-Untertiteldatei, die Sie direkt in YouTube, Vimeo, Premiere, Final Cut oder jeden Video-Editor importieren können. Optionaler Sprachhinweis verbessert die Genauigkeit. Kosten: 1 Credit pro 5 Minuten Video (aufgerundet).',

  q18: 'Welche Sprachen werden unterstützt?',
  a18: 'Die {{brand}}-Oberfläche ist in 17 europäische Sprachen übersetzt: Englisch, Deutsch, Französisch, Spanisch, Italienisch, Portugiesisch, Niederländisch, Polnisch, Schwedisch, Norwegisch, Dänisch, Finnisch, Tschechisch, Rumänisch, Ungarisch, Griechisch und Türkisch. Sprache jederzeit über die Navigation umschalten. Smart Functions: Whisper unterstützt über 50 Sprachen für Spracherkennung; TTS produziert natürliche Sprache in über 30 Sprachen; OCR funktioniert mit Englisch, Deutsch, Französisch, Spanisch, Italienisch, Portugiesisch, Chinesisch, Japanisch und Koreanisch.',

  q19: 'Wie ändere ich meine Kontoeinstellungen?',
  a19: 'Klicken Sie auf Ihren Namen in der Navigation, um zur Profilseite zu gelangen. Dort können Sie Ihre E-Mail-Adresse aktualisieren (Bestätigung der neuen Adresse erforderlich), einen Anzeigenamen festlegen, Ihr Passwort ändern, E-Mail-Benachrichtigungen konfigurieren, Konvertierungsverlauf und Credit-Saldo ansehen, einen API-Schlüssel generieren oder rotieren, Ihren Empfehlungscode finden und — am Seitenende in der Gefahrenzone — Ihr Konto endgültig löschen. Die Kontolöschung entfernt alle zugehörigen Daten innerhalb von 30 Tagen.',

  q20: 'Wie kontaktiere ich den Support?',
  a20: 'Schreiben Sie uns jederzeit an support@convertanyformat.com. Wir antworten an Werktagen innerhalb von 24 Stunden, am Wochenende innerhalb von 48 Stunden. Datenschutz-Anfragen (DSGVO-Rechte, Löschanträge, Beschwerden) bitte mit "Datenschutz" oder "GDPR" im Betreff — diese werden bevorzugt bearbeitet. Sie können auch das Kontaktformular auf der /contact-Seite nutzen. Telefonsupport bieten wir derzeit nicht an, für Geschäftsanfragen vereinbaren wir aber gerne einen Videocall — bitte erwähnen Sie das in Ihrer ersten E-Mail.',
};

// =====================================================================
// German: About — parallel rewrite
// =====================================================================
const deAbout = {
  title: 'Über {{brand}}',
  seoDesc: 'Über {{brand}} — unsere Mission, was uns von Wettbewerbern unterscheidet, unsere Sicherheits- und Datenschutzversprechen und das Team hinter dem Dateikonverter.',
  whatTitle: 'Was wir tun',
  whatBody: '{{brand}} ist eine browserbasierte Plattform für Dateikonvertierungen, die Dokumente, Bilder, Audio, Video, Archive und PDFs in über fünfzig Formaten umwandelt — direkt im Browser, ohne Installation, ohne Software-Downloads und ohne Bezahlschranken vor grundlegenden Funktionen. Über die Formatkonvertierung hinaus nutzt unsere Smart-Functions-Suite führende KI-Modelle für OCR, Text-zu-Sprache, Sprache-zu-Text-Transkription und automatische Untertitelgenerierung. Wir haben {{brand}} gebaut, weil Dateikonvertierung schnell, privat und angenehm zu bedienen sein sollte — und die meisten bestehenden Werkzeuge an mindestens einem dieser Punkte scheitern.',

  whyTitle: 'Warum wir es gebaut haben',
  whyBody: 'Jeder Konverter, den wir ausprobiert haben, hat uns auf irgendeine Weise frustriert: überfrachtet mit aufdringlicher Werbung, voller Tracking-Skripte, langsam in der Bereitstellung der Ergebnisse oder mit grundlegenden Funktionen hinter Abos versteckt. Schlimmer noch, viele behalten Nutzerdateien für Analyse oder Modelltraining. Wir haben {{brand}} als den Konverter gebaut, den wir uns wünschten: aufgeräumt, schnell (die meisten Konvertierungen dauern Sekunden), mit transparenter Pay-as-you-go-Preisgestaltung ohne wiederkehrende Gebühren und mit einer strikten 24-Stunden-Löschgarantie. Ihre Dateien gehören Ihnen; wir konvertieren sie und treten zur Seite.',

  diffTitle: 'Was uns unterscheidet',
  diff1Title: 'Datenschutz von Anfang an:',
  diff1Body: 'jede hochgeladene Datei und jedes konvertierte Ergebnis wird innerhalb von 24 Stunden automatisch und dauerhaft gelöscht. Wir lesen, analysieren, teilen oder verkaufen Ihre Dateiinhalte niemals. Es gibt keine Analytik, die Dateimetadaten erfasst. Unsere Datenschutzerklärung dokumentiert jeden Auftragsverarbeiter.',
  diff2Title: '50+ Formate an einem Ort:',
  diff2Body: 'Dokumente, Bilder, Audio, Video, Archive und dedizierte PDF-Werkzeuge (Zusammenführen, Teilen, Komprimieren, Drehen, Schützen, Entsperren) — alles unter einer einheitlichen Oberfläche.',
  diff3Title: 'Keine Installation, keine Plugins:',
  diff3Body: 'alles läuft im Browser, auf Desktop und Mobil, ohne dass etwas heruntergeladen werden muss. Die Seite ist zusätzlich als Progressive Web App installierbar.',
  diff4Title: 'Stapelverarbeitung integriert:',
  diff4Body: 'Dutzende Dateien gleichzeitig konvertieren, jeden Fortschritt live verfolgen und einzeln oder gepackt herunterladen. Drag-and-Drop-Sortierung für PDF-Zusammenführung.',
  diff5Title: 'Entwicklerfreundliche REST-API:',
  diff5Body: 'jede Browser-Konvertierung ist auch programmatisch verfügbar. API-Schlüssel im Dashboard generieren, dokumentierte Endpunkte aufrufen, Konvertierung in eigene Apps integrieren.',
  diff6Title: 'Ehrliche, transparente Preise:',
  diff6Body: 'Pay-as-you-go-Credits, keine versteckten Gebühren, keine automatisch verlängerten Abos, Credits ohne Verfall und ordnungsgemäße Rechnungen für jeden Kauf.',

  missionTitle: 'Unsere Mission',
  missionBody: 'Dateikonvertierung einfach, sicher und für jeden zugänglich machen — kompromisslos. Wir glauben, dass die Grundlagen (eine PDF konvertieren, ein Bild verkleinern, Audio aus einem Video extrahieren) für jeden mit einem Browser verfügbar sein sollten, fair bepreist und mit Respekt vor Privatsphäre. Wir messen Erfolg nicht daran, wie viele Daten wir sammeln, sondern wie schnell Nutzer das bekommen, was sie brauchen, und mit ihrem Tag weitermachen können. Jede architektonische Entscheidung passiert diesen Filter.',

  valuesTitle: 'Unsere Werte',
  privacyTitle: 'Datenschutz',
  privacyBody: 'Ihre Dateien gehören Ihnen. Wir verarbeiten sie, liefern das Ergebnis und löschen alles innerhalb von 24 Stunden. Wir erheben das Minimum an personenbezogenen Daten und dokumentieren jedes Byte in unserer Datenschutzerklärung. Wir verkaufen keine Daten. Wir trainieren keine Modelle auf Ihren Inhalten.',
  simplicityTitle: 'Einfachheit',
  simplicityBody: 'Keine Verwirrung, keine Überfrachtung. Datei ablegen, Format wählen, Konvertieren klicken. Keine Bezahlschranken vor Grundfunktionen, keine Pop-ups, die Werbung als Buttons tarnen, keine labyrinthischen Einstellungen. Wo es erweiterte Optionen gibt, sind sie genau das — erweitert, niemals erforderlich.',
  transparencyTitle: 'Transparenz',
  transparencyBody: 'Preise sind veröffentlicht, Credits verfallen nicht, jeder Auftragsverarbeiter ist in der Datenschutzerklärung benannt, und die Quelle KI-generierter Inhalte wird offengelegt. Wo wir Drittanbieter nutzen, sagen wir es; wo Daten den EWR verlassen, erklären wir die Schutzmaßnahmen.',
  qualityTitle: 'Qualität',
  qualityBody: 'Wir nutzen branchenführende Konvertierungstechnologie — CloudConvert für klassische Formate, OpenAI für KI-gestützte Smart Functions, gehärtete Infrastruktur auf Railway und Supabase. Wir testen mit echten Dateien in echten Browsern und liefern Updates kontinuierlich, nicht einmal pro Quartal.',

  teamTitle: 'Das Team',
  teamBody: '{{brand}} wird von einem kleinen, leidenschaftlichen Team aus Düsseldorf gebaut und betreut. Wir sind eine Mischung aus Backend-Entwicklern, Frontend-Spezialisten und einem hartnäckigen Produktmanager, der nichts ausliefert, was auf dem Handy flackert. Wir haben keine Investoren, keine Werbeverträge und keine Wachstumsquoten — was bedeutet, dass unser einziger Kunde Sie sind und unser einziges Maß ist, ob Ihre nächste Konvertierung schnell ist und das richtige Ergebnis liefert.',

  ctaTitle: 'Bereit, etwas zu konvertieren?',
  ctaBody: 'Durchstöbern Sie den vollständigen Werkzeugkatalog, wählen Sie das passende Werkzeug und haben Sie in Sekunden eine konvertierte Datei in Ihrem Download-Ordner. Keine Installation, keine Anmeldehürden zum Stöbern, transparente Pay-as-you-go-Preise sobald Sie ein kostenloses Konto erstellen.',
  ctaButton: 'Alle Werkzeuge entdecken',
};

// =====================================================================
// Concise translations for the other 8 languages — same 20 questions,
// shorter answers (~30-40 words each) suitable for non-anchor markets.
// Auto-generated by hand from the English source.
// =====================================================================
function makeFaq(lang, t) {
  return {
    title: t.title, subtitle: t.subtitle, seoDesc: t.seoDesc,
    q1: t.q1, a1: t.a1, q2: t.q2, a2: t.a2, q3: t.q3, a3: t.a3,
    q4: t.q4, a4: t.a4, q5: t.q5, a5: t.a5, q6: t.q6, a6: t.a6,
    q7: t.q7, a7: t.a7, q8: t.q8, a8: t.a8, q9: t.q9, a9: t.a9,
    q10: t.q10, a10: t.a10, q11: t.q11, a11: t.a11, q12: t.q12, a12: t.a12,
    q13: t.q13, a13: t.a13, q14: t.q14, a14: t.a14, q15: t.q15, a15: t.a15,
    q16: t.q16, a16: t.a16, q17: t.q17, a17: t.a17, q18: t.q18, a18: t.a18,
    q19: t.q19, a19: t.a19, q20: t.q20, a20: t.a20,
  };
}

const frFaq = makeFaq('fr', {
  title: 'Questions fréquentes',
  subtitle: 'Tout ce qu\'il faut savoir sur {{brand}} — conversions, tarifs, sécurité, Smart Functions et plus.',
  seoDesc: 'Questions fréquentes sur {{brand}}. Conversions, tarifs, sécurité, Smart Functions, langues, remboursements et contact.',
  q1: 'Comment fonctionne la conversion étape par étape ?',
  a1: 'Quatre étapes : (1) glissez-déposez votre fichier ou cliquez pour parcourir — jusqu\'à 200 Mo ; (2) choisissez le format de sortie dans la liste déroulante ; (3) ajustez les paramètres avancés au besoin (qualité, résolution, OCR) ; (4) cliquez sur Convertir — le fichier est envoyé chiffré à notre processeur, les crédits sont débités et vous obtenez un lien de téléchargement en quelques secondes.',
  q2: 'Quels formats sont pris en charge ?',
  a2: 'Plus de 50 formats répartis en six catégories : Documents (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Images (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Audio (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Vidéo (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Archives (ZIP, RAR, 7Z, TAR, GZ) et outils PDF dédiés. Liste complète sur la page Outils.',
  q3: 'Comment fonctionne le système de crédits ?',
  a3: '{{brand}} utilise un modèle prépayé — pas d\'abonnement. Les conversions standard coûtent 1 crédit. Les Smart Functions sont facturées à l\'usage : Texte vers parole 1 crédit pour 1000 caractères ; Parole vers texte et sous-titres 1 crédit pour 5 minutes (arrondi). Les conversions échouées sont gratuites. Les crédits n\'expirent jamais. 5 crédits bonus par filleul.',
  q4: 'Que contiennent les packs et comment acheter ?',
  a4: 'Trois packs : 1 crédit (0,99 €), 10 crédits (7,99 €, environ 19 % de réduction) et 30 crédits (20,99 €, environ 30 % de réduction). Tous les prix incluent la TVA allemande de 19 %. Achat via Stripe — cartes bancaires et SEPA acceptés. Facture conforme envoyée par email immédiatement, crédits crédités instantanément.',
  q5: 'Combien de temps les fichiers sont-ils conservés ?',
  a5: 'Le fichier source et la sortie convertie sont automatiquement et définitivement supprimés sous 24 heures après l\'envoi. Aucune exception, aucune extension manuelle — la suppression est imposée par un processus automatique. Après suppression le lien de téléchargement cesse de fonctionner. Aucune copie, aucune sauvegarde, aucune miniature n\'est conservée.',
  q6: 'Le site est-il sécurisé et conforme RGPD ?',
  a6: 'Oui. {{brand}} est exploité depuis l\'Allemagne et entièrement soumis au RGPD. TLS 1.2+, mots de passe hashés bcrypt, cookies httpOnly SameSite=Strict. Accords de traitement signés avec chaque sous-traitant (Art. 28 RGPD). Transferts hors EEE via clauses contractuelles types ou cadre EU-US Data Privacy Framework. Nous ne vendons jamais vos données.',
  q7: 'Que deviennent mes fichiers après la conversion ?',
  a7: 'À la conversion, votre fichier est envoyé chiffré à notre processeur — CloudConvert pour les formats standard, OpenAI pour les Smart Functions. Seule la conversion demandée est effectuée. Nous n\'accédons jamais au contenu pour d\'autres usages. Les deux fichiers sont supprimés sous 24 heures de nos serveurs et des caches sous-traitants.',
  q8: 'Les fichiers peuvent-ils être récupérés après suppression ?',
  a8: 'Non. La suppression est définitive et irréversible. Nous ne conservons aucune sauvegarde des fichiers utilisateur (les sauvegardes de base de données excluent les fichiers volontairement). Cela soutient votre droit à l\'effacement (Art. 17 RGPD). Téléchargez toujours vos fichiers dans les 24 heures et conservez-les localement.',
  q9: 'Quelle est la taille maximale de fichier ?',
  a9: '200 Mo par fichier pour les conversions standard. Les outils Smart Functions sont limités à 25 Mo par fichier (limite stricte de l\'API OpenAI). Pour des fichiers plus volumineux, divisez-les localement (par exemple avec ffmpeg) puis convertissez chaque partie. Pour des besoins entreprises, contactez support@convertanyformat.com.',
  q10: 'Quels navigateurs sont pris en charge ?',
  a10: 'Tous les navigateurs modernes mis à jour depuis moins de deux ans : Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, ainsi que la plupart des navigateurs mobiles. JavaScript et cookies activés requis. Pour l\'enregistrement microphone (Parole vers texte), accordez la permission lorsque demandée. Internet Explorer n\'est pas pris en charge.',
  q11: 'Le site fonctionne-t-il sur mobile ?',
  a11: 'Oui — entièrement optimisé pour mobile. L\'interface s\'adapte aux écrans à partir de 320 px, les cartes d\'outils s\'affichent en deux colonnes sur petit écran, et toutes les fonctionnalités y compris l\'enregistrement audio depuis le micro fonctionnent sur iOS Safari et Android Chrome. Installable en tant que Progressive Web App.',
  q12: 'Comment annuler ou obtenir un remboursement ?',
  a12: 'Pas d\'abonnement à annuler — les crédits sont des achats uniques sans expiration. Pour rembourser des crédits non utilisés, écrivez à support@convertanyformat.com sous 14 jours après l\'achat (Fernabsatzgesetz). Remboursement sous 5–10 jours ouvrés. Les crédits utilisés ne sont normalement pas remboursables sauf défaillance de notre part. Suppression de compte via Profil → Zone dangereuse.',
  q13: 'Que sont les outils Smart Functions ?',
  a13: 'Outils alimentés par IA au-delà de la simple conversion : OCR (extrait le texte des PDF scannés et images), Compression PDF par IA, Texte vers parole (audio MP3/OPUS/AAC via OpenAI TTS-1), Parole vers texte (transcription TXT/DOCX via Whisper), et Générateur de sous-titres automatique (SRT/VTT depuis vidéo). Facturés à l\'usage.',
  q14: 'Qu\'est-ce que l\'OCR et quand l\'utiliser ?',
  a14: 'L\'OCR (Reconnaissance Optique de Caractères) extrait le texte modifiable depuis des images. Utilisez-le pour des PDF scannés, des photos de documents, ou toute image où le texte n\'est pas sélectionnable. {{brand}} renvoie un PDF consultable (mise en page d\'origine + couche texte invisible) ou du texte brut. Cas d\'usage : numérisation, archivage, extraction de citations.',
  q15: 'Comment fonctionne Texte vers parole ?',
  a15: 'Tapez ou collez jusqu\'à 4096 caractères, choisissez une voix parmi six (Alloy, Echo, Fable, Onyx, Nova, Shimmer), une vitesse (0,75x à 1,5x) et un format (MP3, OPUS, AAC), puis cliquez sur Convertir. Vous recevez en quelques secondes un fichier audio à voix naturelle généré par OpenAI TTS-1. Coût : 1 crédit par tranche de 1000 caractères.',
  q16: 'Comment fonctionne Parole vers texte ?',
  a16: 'Téléchargez un fichier audio (MP3, WAV, M4A, OGG, MP4, WebM) jusqu\'à 25 Mo. Nous transcrivons via OpenAI Whisper. Choisissez TXT ou DOCX. Enregistrement microphone également possible. Indication de langue optionnelle pour améliorer la précision. Coût : 1 crédit par 5 minutes (arrondi). La transcription s\'affiche pour relecture avant téléchargement.',
  q17: 'Comment fonctionne le Générateur de sous-titres automatique ?',
  a17: 'Téléchargez une vidéo (MP4, MOV, AVI, MKV) jusqu\'à 25 Mo. Nous extrayons l\'audio si nécessaire (CloudConvert pour les conteneurs non-MP4) puis transcrivons via Whisper en mode horodaté. Vous obtenez un fichier SRT ou VTT prêt pour YouTube, Vimeo, Premiere ou tout éditeur vidéo. Coût : 1 crédit par 5 minutes de vidéo.',
  q18: 'Quelles langues sont prises en charge ?',
  a18: 'L\'interface est traduite en 17 langues européennes : anglais, allemand, français, espagnol, italien, portugais, néerlandais, polonais, suédois, norvégien, danois, finnois, tchèque, roumain, hongrois, grec, turc. Smart Functions : Whisper plus de 50 langues ; TTS plus de 30 ; OCR : anglais, allemand, français, espagnol, italien, portugais, chinois, japonais, coréen.',
  q19: 'Comment modifier les paramètres du compte ?',
  a19: 'Cliquez sur votre nom dans la barre de navigation pour accéder au Profil. Vous pouvez modifier votre email (avec vérification), définir un nom d\'affichage, changer le mot de passe, configurer les notifications, voir l\'historique et le solde, générer une clé API, trouver votre code de parrainage, et supprimer définitivement le compte (Zone dangereuse). La suppression efface toutes les données associées sous 30 jours.',
  q20: 'Comment contacter le support ?',
  a20: 'Email à support@convertanyformat.com. Réponse sous 24h les jours ouvrés, 48h le week-end. Demandes RGPD : mentionnez "GDPR" en objet pour priorisation. Formulaire également disponible sur /contact. Pas de support téléphonique mais visioconférence sur demande pour les besoins entreprises.',
});

const esFaq = makeFaq('es', {
  title: 'Preguntas frecuentes',
  subtitle: 'Todo lo que necesita saber sobre {{brand}} — conversiones, precios, seguridad, Smart Functions y más.',
  seoDesc: 'Preguntas frecuentes sobre {{brand}}. Conversiones, precios, seguridad, Smart Functions, idiomas, reembolsos y contacto.',
  q1: '¿Cómo funciona la conversión paso a paso?',
  a1: 'Cuatro pasos: (1) arrastre y suelte el archivo o haga clic para examinar — hasta 200 MB; (2) elija el formato de salida en el desplegable; (3) ajuste opciones avanzadas si es necesario (calidad, resolución, OCR); (4) haga clic en Convertir — el archivo se envía cifrado a nuestro procesador, se descuentan los créditos y obtiene un enlace de descarga en segundos.',
  q2: '¿Qué formatos están soportados?',
  a2: 'Más de 50 formatos en seis categorías: Documentos (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Imágenes (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Audio (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Vídeo (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Archivos (ZIP, RAR, 7Z, TAR, GZ) y herramientas PDF dedicadas. Lista completa en Herramientas.',
  q3: '¿Cómo funciona el sistema de créditos?',
  a3: '{{brand}} usa un modelo prepago — sin suscripciones. Las conversiones estándar cuestan 1 crédito. Smart Functions se facturan por uso: Texto a voz 1 crédito por 1000 caracteres; Voz a texto y subtítulos 1 crédito por 5 minutos (redondeado). Conversiones fallidas gratuitas. Los créditos no caducan. 5 créditos bonus por amigo referido.',
  q4: '¿Qué incluye cada paquete y cómo comprar?',
  a4: 'Tres paquetes: 1 crédito (0,99 €), 10 créditos (7,99 €, ~19% descuento) y 30 créditos (20,99 €, ~30% descuento). Todos los precios incluyen IVA alemán del 19%. Compra vía Stripe — tarjetas y SEPA aceptados. Factura fiscal por email inmediatamente, créditos disponibles al instante.',
  q5: '¿Cuánto tiempo se almacenan los archivos?',
  a5: 'Tanto el archivo original como la salida convertida se eliminan automática y permanentemente en 24 horas tras la subida. Sin excepciones ni extensiones manuales — eliminación impuesta por proceso automático. El enlace de descarga deja de funcionar. No retenemos copias, copias de seguridad ni miniaturas.',
  q6: '¿Es seguro el sitio y cumple RGPD?',
  a6: 'Sí. {{brand}} se opera desde Alemania y cumple plenamente con el RGPD. TLS 1.2+, contraseñas con bcrypt, cookies httpOnly SameSite=Strict. Acuerdos de tratamiento firmados con cada subprocesador (Art. 28 RGPD). Transferencias fuera del EEE vía cláusulas contractuales tipo o el marco EU-US Data Privacy Framework. Nunca vendemos sus datos.',
  q7: '¿Qué pasa con mis archivos después de convertir?',
  a7: 'Al convertir, su archivo se envía cifrado al procesador — CloudConvert para formatos estándar, OpenAI para Smart Functions. Solo se realiza la conversión solicitada. Nunca accedemos al contenido para otros fines. Ambos archivos se eliminan en 24 horas de nuestros servidores y de las cachés de subprocesadores.',
  q8: '¿Pueden recuperarse los archivos eliminados?',
  a8: 'No. La eliminación es permanente e irreversible. No mantenemos copias de seguridad de archivos de usuario (las copias de la base de datos excluyen archivos a propósito). Esto respalda su derecho de supresión (Art. 17 RGPD). Descargue siempre sus archivos en 24 horas y guárdelos localmente.',
  q9: '¿Cuál es el tamaño máximo de archivo?',
  a9: '200 MB por archivo para conversiones estándar. Smart Functions limitadas a 25 MB por archivo (límite estricto de la API OpenAI). Para archivos mayores, divídalos localmente (por ejemplo con ffmpeg) y convierta cada parte. Para necesidades empresariales, escriba a support@convertanyformat.com.',
  q10: '¿Qué navegadores están soportados?',
  a10: 'Todos los navegadores modernos actualizados en los últimos dos años: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, y la mayoría de móviles. JavaScript y cookies habilitados requeridos. Para grabación de micrófono (Voz a texto), conceda permiso cuando se solicite. Internet Explorer no soportado.',
  q11: '¿Funciona en móvil?',
  a11: 'Sí — completamente optimizado para móvil. Interfaz adaptada desde 320 px, tarjetas de herramientas en dos columnas en pantallas pequeñas, y todas las funciones incluyendo grabación de audio desde el micrófono funcionan en iOS Safari y Android Chrome. Instalable como Progressive Web App.',
  q12: '¿Cómo cancelar u obtener reembolso?',
  a12: 'Sin suscripciones que cancelar — los créditos son compras únicas sin caducidad. Para reembolso de créditos no usados, escriba a support@convertanyformat.com en 14 días tras la compra (Fernabsatzgesetz). Reembolso en 5–10 días hábiles. Créditos usados no reembolsables salvo fallo nuestro. Eliminar cuenta vía Perfil → Zona peligrosa.',
  q13: '¿Qué son las herramientas Smart Functions?',
  a13: 'Herramientas con IA más allá de conversión: OCR (extrae texto de PDFs e imágenes escaneadas), Comprimir PDF con IA, Texto a voz (audio MP3/OPUS/AAC vía OpenAI TTS-1), Voz a texto (transcripción TXT/DOCX vía Whisper) y Generador automático de subtítulos (SRT/VTT desde vídeo). Facturados por uso.',
  q14: '¿Qué es el OCR y cuándo usarlo?',
  a14: 'OCR (Reconocimiento Óptico de Caracteres) extrae texto editable de imágenes. Úselo con PDFs escaneados, fotos de documentos, o cualquier imagen donde el texto no es seleccionable. {{brand}} devuelve un PDF buscable (diseño original + capa de texto invisible) o texto plano. Casos: digitalización, archivos consultables, extracción de citas.',
  q15: '¿Cómo funciona Texto a voz?',
  a15: 'Escriba o pegue hasta 4096 caracteres, elija una voz entre seis (Alloy, Echo, Fable, Onyx, Nova, Shimmer), velocidad (0,75x a 1,5x) y formato (MP3, OPUS, AAC), haga clic en Convertir. En segundos recibe un archivo de audio con voz natural generado por OpenAI TTS-1. Coste: 1 crédito por cada 1000 caracteres.',
  q16: '¿Cómo funciona Voz a texto?',
  a16: 'Suba un audio (MP3, WAV, M4A, OGG, MP4, WebM) hasta 25 MB. Transcribimos con OpenAI Whisper. Elija TXT o DOCX. También grabación desde micrófono. Sugerencia de idioma opcional mejora precisión. Coste: 1 crédito por 5 minutos (redondeado). La transcripción se muestra para revisión antes de descargar.',
  q17: '¿Cómo funciona el Generador automático de subtítulos?',
  a17: 'Suba un vídeo (MP4, MOV, AVI, MKV) hasta 25 MB. Extraemos el audio si es necesario (CloudConvert para contenedores no-MP4) y transcribimos con Whisper con marcas de tiempo. Obtiene un SRT o VTT listo para YouTube, Vimeo, Premiere o cualquier editor. Coste: 1 crédito por 5 minutos de vídeo.',
  q18: '¿Qué idiomas están soportados?',
  a18: 'La interfaz está traducida a 17 idiomas europeos: inglés, alemán, francés, español, italiano, portugués, neerlandés, polaco, sueco, noruego, danés, finés, checo, rumano, húngaro, griego, turco. Smart Functions: Whisper más de 50 idiomas; TTS más de 30; OCR: inglés, alemán, francés, español, italiano, portugués, chino, japonés, coreano.',
  q19: '¿Cómo cambio los ajustes de cuenta?',
  a19: 'Haga clic en su nombre en la navegación para ir al Perfil. Allí puede actualizar email (con verificación), nombre de visualización, cambiar contraseña, configurar notificaciones, ver historial y saldo, generar clave API, encontrar código de referido, y eliminar la cuenta (Zona peligrosa). La eliminación borra todos los datos asociados en 30 días.',
  q20: '¿Cómo contactar con soporte?',
  a20: 'Escriba a support@convertanyformat.com. Respuesta en 24h en días hábiles, 48h fines de semana. Consultas RGPD: incluya "GDPR" en el asunto para priorización. También formulario en /contact. Sin soporte telefónico, pero videollamada disponible para consultas empresariales.',
});

const itFaq = makeFaq('it', {
  title: 'Domande frequenti',
  subtitle: 'Tutto quello che devi sapere su {{brand}} — conversioni, prezzi, sicurezza, Smart Functions e altro.',
  seoDesc: 'Domande frequenti su {{brand}}. Conversioni, prezzi, sicurezza, Smart Functions, lingue, rimborsi e contatti.',
  q1: 'Come funziona la conversione passo per passo?',
  a1: 'Quattro passi: (1) trascina il file o clicca per sfogliare — fino a 200 MB; (2) scegli il formato di output dal menu; (3) regola le opzioni avanzate se serve (qualità, risoluzione, OCR); (4) clicca su Converti — il file viene inviato cifrato al nostro processore, i crediti vengono scalati e ricevi un link in secondi.',
  q2: 'Quali formati sono supportati?',
  a2: 'Oltre 50 formati in sei categorie: Documenti (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Immagini (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Audio (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Video (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Archivi (ZIP, RAR, 7Z, TAR, GZ) e strumenti PDF dedicati. Elenco completo nella pagina Strumenti.',
  q3: 'Come funziona il sistema di crediti?',
  a3: '{{brand}} usa un modello prepagato — niente abbonamenti. Le conversioni standard costano 1 credito. Smart Functions a consumo: Da testo a voce 1 credito per 1000 caratteri; Da voce a testo e sottotitoli 1 credito per 5 minuti (arrotondato). Conversioni fallite gratuite. I crediti non scadono. 5 crediti bonus per ogni amico invitato.',
  q4: 'Cosa include ogni pacchetto e come acquistare?',
  a4: 'Tre pacchetti: 1 credito (0,99 €), 10 crediti (7,99 €, circa 19% di sconto) e 30 crediti (20,99 €, circa 30% di sconto). Tutti i prezzi includono IVA tedesca del 19%. Acquisto via Stripe — carte e SEPA accettati. Fattura fiscale via email immediatamente, crediti disponibili subito.',
  q5: 'Per quanto tempo vengono conservati i file?',
  a5: 'Sia il file originale sia l\'output convertito vengono eliminati automaticamente e definitivamente entro 24 ore dal caricamento. Nessuna eccezione o estensione manuale — eliminazione gestita da processo automatico. Il link di download cessa di funzionare. Non conserviamo copie, backup o miniature.',
  q6: 'Il sito è sicuro e conforme al GDPR?',
  a6: 'Sì. {{brand}} è gestito dalla Germania e pienamente soggetto al GDPR. TLS 1.2+, password con bcrypt, cookie httpOnly SameSite=Strict. Accordi di trattamento firmati con ogni responsabile (Art. 28 GDPR). Trasferimenti fuori dal SEE tramite clausole contrattuali standard o EU-US Data Privacy Framework. Non vendiamo mai i tuoi dati.',
  q7: 'Cosa succede ai miei file dopo la conversione?',
  a7: 'Alla conversione, il file viene inviato cifrato al processore — CloudConvert per formati standard, OpenAI per Smart Functions. Viene eseguita solo la conversione richiesta. Non accediamo mai al contenuto per altri scopi. Entrambi i file vengono rimossi entro 24 ore dai nostri server e dalle cache dei sub-responsabili.',
  q8: 'I file possono essere recuperati dopo l\'eliminazione?',
  a8: 'No. L\'eliminazione è permanente e irreversibile. Non manteniamo backup dei file utente (i backup del database escludono i file di proposito). Questo supporta il tuo diritto alla cancellazione (Art. 17 GDPR). Scarica sempre i file convertiti entro 24 ore e conservali localmente.',
  q9: 'Qual è la dimensione massima del file?',
  a9: '200 MB per file per le conversioni standard. Smart Functions limitate a 25 MB per file (limite rigido dell\'API OpenAI). Per file più grandi, dividili localmente (ad esempio con ffmpeg) e converti ogni parte. Per esigenze aziendali, scrivi a support@convertanyformat.com.',
  q10: 'Quali browser sono supportati?',
  a10: 'Tutti i browser moderni aggiornati negli ultimi due anni: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, e la maggior parte dei browser mobili. JavaScript e cookie devono essere attivi. Per la registrazione del microfono (Da voce a testo), concedi il permesso quando richiesto. Internet Explorer non supportato.',
  q11: 'Funziona su mobile?',
  a11: 'Sì — completamente ottimizzato per mobile. L\'interfaccia si adatta a schermi da 320 px, le card degli strumenti sono in due colonne su schermi piccoli, e tutte le funzioni inclusa la registrazione audio dal microfono funzionano su iOS Safari e Android Chrome. Installabile come Progressive Web App.',
  q12: 'Come annullare o ottenere un rimborso?',
  a12: 'Nessun abbonamento da annullare — i crediti sono acquisti una tantum senza scadenza. Per il rimborso dei crediti non usati, scrivi a support@convertanyformat.com entro 14 giorni dall\'acquisto (Fernabsatzgesetz). Rimborso in 5–10 giorni lavorativi. I crediti usati di solito non sono rimborsabili tranne in caso di malfunzionamento. Eliminazione account via Profilo → Zona pericolosa.',
  q13: 'Cosa sono gli strumenti Smart Functions?',
  a13: 'Strumenti basati sull\'IA oltre la conversione: OCR (estrae testo da PDF e immagini scansionati), Comprimi PDF con IA, Da testo a voce (audio MP3/OPUS/AAC tramite OpenAI TTS-1), Da voce a testo (trascrizione TXT/DOCX tramite Whisper) e Generatore automatico di sottotitoli (SRT/VTT da video). Fatturati a consumo.',
  q14: 'Cos\'è l\'OCR e quando usarlo?',
  a14: 'OCR (Riconoscimento Ottico dei Caratteri) estrae testo modificabile dalle immagini. Usalo con PDF scansionati, foto di documenti o immagini in cui il testo non è selezionabile. {{brand}} restituisce un PDF ricercabile (layout originale + livello di testo invisibile) o testo semplice. Casi d\'uso: digitalizzazione, archivi ricercabili, estrazione di citazioni.',
  q15: 'Come funziona Da testo a voce?',
  a15: 'Digita o incolla fino a 4096 caratteri, scegli una delle sei voci (Alloy, Echo, Fable, Onyx, Nova, Shimmer), velocità (0,75x a 1,5x) e formato (MP3, OPUS, AAC), poi clicca su Converti. In secondi ricevi un audio con voce naturale generato da OpenAI TTS-1. Costo: 1 credito ogni 1000 caratteri.',
  q16: 'Come funziona Da voce a testo?',
  a16: 'Carica un file audio (MP3, WAV, M4A, OGG, MP4, WebM) fino a 25 MB. Trascriviamo con OpenAI Whisper. Scegli TXT o DOCX. Anche registrazione dal microfono. Suggerimento di lingua opzionale migliora la precisione. Costo: 1 credito per 5 minuti (arrotondato). La trascrizione viene mostrata per revisione prima del download.',
  q17: 'Come funziona il Generatore automatico di sottotitoli?',
  a17: 'Carica un video (MP4, MOV, AVI, MKV) fino a 25 MB. Estraiamo l\'audio se necessario (CloudConvert per contenitori non-MP4) e trascriviamo con Whisper in modalità con timestamp. Ottieni un SRT o VTT pronto per YouTube, Vimeo, Premiere o qualsiasi editor. Costo: 1 credito per 5 minuti di video.',
  q18: 'Quali lingue sono supportate?',
  a18: 'L\'interfaccia è tradotta in 17 lingue europee: inglese, tedesco, francese, spagnolo, italiano, portoghese, olandese, polacco, svedese, norvegese, danese, finlandese, ceco, rumeno, ungherese, greco, turco. Smart Functions: Whisper oltre 50 lingue; TTS oltre 30; OCR: inglese, tedesco, francese, spagnolo, italiano, portoghese, cinese, giapponese, coreano.',
  q19: 'Come modifico le impostazioni dell\'account?',
  a19: 'Clicca sul tuo nome nella navigazione per andare al Profilo. Lì puoi aggiornare l\'email (con verifica), impostare un nome visualizzato, cambiare la password, configurare le notifiche, vedere cronologia e saldo, generare una chiave API, trovare il codice di invito ed eliminare definitivamente l\'account (Zona pericolosa). La cancellazione rimuove tutti i dati associati entro 30 giorni.',
  q20: 'Come contattare il supporto?',
  a20: 'Scrivi a support@convertanyformat.com. Risposta entro 24h nei giorni feriali, 48h nei weekend. Richieste GDPR: indica "GDPR" nell\'oggetto per priorità. Anche modulo di contatto su /contact. Niente supporto telefonico, ma videochiamata disponibile per richieste aziendali.',
});

const ptFaq = makeFaq('pt', {
  title: 'Perguntas frequentes',
  subtitle: 'Tudo o que precisa de saber sobre {{brand}} — conversões, preços, segurança, Smart Functions e mais.',
  seoDesc: 'Perguntas frequentes sobre {{brand}}. Conversões, preços, segurança, Smart Functions, idiomas, reembolsos e contacto.',
  q1: 'Como funciona a conversão passo a passo?',
  a1: 'Quatro passos: (1) arraste o ficheiro ou clique para procurar — até 200 MB; (2) escolha o formato de saída no menu pendente; (3) ajuste opções avançadas se necessário (qualidade, resolução, OCR); (4) clique em Converter — o ficheiro é enviado cifrado ao nosso processador, os créditos são debitados e recebe um link em segundos.',
  q2: 'Que formatos são suportados?',
  a2: 'Mais de 50 formatos em seis categorias: Documentos (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Imagens (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Áudio (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Vídeo (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Arquivos (ZIP, RAR, 7Z, TAR, GZ) e ferramentas PDF dedicadas. Lista completa em Ferramentas.',
  q3: 'Como funciona o sistema de créditos?',
  a3: '{{brand}} usa um modelo pré-pago — sem subscrições. Conversões padrão custam 1 crédito. Smart Functions são cobradas por uso: Texto para fala 1 crédito por 1000 caracteres; Fala para texto e legendas 1 crédito por 5 minutos (arredondado). Conversões falhadas gratuitas. Os créditos não expiram. 5 créditos bónus por amigo referido.',
  q4: 'O que inclui cada pacote e como comprar?',
  a4: 'Três pacotes: 1 crédito (0,99 €), 10 créditos (7,99 €, ~19% desconto) e 30 créditos (20,99 €, ~30% desconto). Todos os preços incluem IVA alemão de 19%. Compra via Stripe — cartões e SEPA aceites. Fatura fiscal por email imediatamente, créditos disponíveis instantaneamente.',
  q5: 'Quanto tempo são os ficheiros guardados?',
  a5: 'Tanto o ficheiro original como a saída convertida são automaticamente e permanentemente eliminados em 24 horas após o upload. Sem exceções nem extensões manuais — eliminação imposta por processo automático. O link de download deixa de funcionar. Não guardamos cópias, backups nem miniaturas.',
  q6: 'O site é seguro e cumpre o RGPD?',
  a6: 'Sim. {{brand}} é operado a partir da Alemanha e totalmente sujeito ao RGPD. TLS 1.2+, palavras-passe com bcrypt, cookies httpOnly SameSite=Strict. Acordos de tratamento assinados com cada subprocessador (Art. 28 RGPD). Transferências fora do EEE via cláusulas contratuais-tipo ou EU-US Data Privacy Framework. Nunca vendemos os seus dados.',
  q7: 'O que acontece aos meus ficheiros após conversão?',
  a7: 'Ao converter, o ficheiro é enviado cifrado ao processador — CloudConvert para formatos padrão, OpenAI para Smart Functions. Apenas a conversão pedida é executada. Nunca acedemos ao conteúdo para outros fins. Ambos os ficheiros são removidos em 24 horas dos nossos servidores e das caches dos subprocessadores.',
  q8: 'Os ficheiros podem ser recuperados após eliminação?',
  a8: 'Não. A eliminação é permanente e irreversível. Não mantemos backups de ficheiros de utilizador (os backups da base de dados excluem ficheiros propositadamente). Isto apoia o seu direito ao apagamento (Art. 17 RGPD). Descarregue sempre os ficheiros em 24 horas e guarde-os localmente.',
  q9: 'Qual é o tamanho máximo do ficheiro?',
  a9: '200 MB por ficheiro para conversões padrão. Smart Functions limitadas a 25 MB por ficheiro (limite rígido da API OpenAI). Para ficheiros maiores, divida-os localmente (por exemplo com ffmpeg) e converta cada parte. Para necessidades empresariais, escreva para support@convertanyformat.com.',
  q10: 'Que navegadores são suportados?',
  a10: 'Todos os navegadores modernos atualizados nos últimos dois anos: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, e a maioria dos navegadores móveis. JavaScript e cookies têm de estar ativos. Para gravação de microfone (Fala para texto), conceda permissão quando solicitado. Internet Explorer não é suportado.',
  q11: 'Funciona em telemóvel?',
  a11: 'Sim — totalmente otimizado para telemóvel. A interface adapta-se a ecrãs a partir de 320 px, os cartões de ferramentas aparecem em duas colunas em ecrãs pequenos, e todas as funcionalidades incluindo gravação de áudio do microfone funcionam em iOS Safari e Android Chrome. Instalável como Progressive Web App.',
  q12: 'Como cancelar ou obter reembolso?',
  a12: 'Sem subscrições para cancelar — os créditos são compras únicas sem expiração. Para reembolso de créditos não usados, escreva para support@convertanyformat.com em 14 dias após a compra (Fernabsatzgesetz). Reembolso em 5–10 dias úteis. Créditos usados normalmente não reembolsáveis exceto por falha nossa. Eliminar conta via Perfil → Zona perigosa.',
  q13: 'O que são as ferramentas Smart Functions?',
  a13: 'Ferramentas com IA além da conversão: OCR (extrai texto de PDFs e imagens digitalizados), Comprimir PDF com IA, Texto para fala (áudio MP3/OPUS/AAC via OpenAI TTS-1), Fala para texto (transcrição TXT/DOCX via Whisper) e Gerador automático de legendas (SRT/VTT a partir de vídeo). Cobradas por uso.',
  q14: 'O que é OCR e quando usar?',
  a14: 'OCR (Reconhecimento Ótico de Caracteres) extrai texto editável de imagens. Use-o com PDFs digitalizados, fotos de documentos ou qualquer imagem em que o texto não seja selecionável. {{brand}} devolve um PDF pesquisável (layout original + camada de texto invisível) ou texto simples. Casos: digitalização, arquivos pesquisáveis, extração de citações.',
  q15: 'Como funciona Texto para fala?',
  a15: 'Escreva ou cole até 4096 caracteres, escolha uma das seis vozes (Alloy, Echo, Fable, Onyx, Nova, Shimmer), velocidade (0,75x a 1,5x) e formato (MP3, OPUS, AAC), depois clique em Converter. Em segundos recebe um áudio com voz natural gerado por OpenAI TTS-1. Custo: 1 crédito por 1000 caracteres.',
  q16: 'Como funciona Fala para texto?',
  a16: 'Envie um ficheiro de áudio (MP3, WAV, M4A, OGG, MP4, WebM) até 25 MB. Transcrevemos com OpenAI Whisper. Escolha TXT ou DOCX. Também gravação do microfone. Sugestão de idioma opcional melhora a precisão. Custo: 1 crédito por 5 minutos (arredondado). A transcrição é mostrada para revisão antes do download.',
  q17: 'Como funciona o Gerador automático de legendas?',
  a17: 'Envie um vídeo (MP4, MOV, AVI, MKV) até 25 MB. Extraímos o áudio se necessário (CloudConvert para contentores não-MP4) e transcrevemos com Whisper em modo com timestamps. Obtém um SRT ou VTT pronto para YouTube, Vimeo, Premiere ou qualquer editor. Custo: 1 crédito por 5 minutos de vídeo.',
  q18: 'Que idiomas são suportados?',
  a18: 'A interface está traduzida em 17 idiomas europeus: inglês, alemão, francês, espanhol, italiano, português, holandês, polaco, sueco, norueguês, dinamarquês, finlandês, checo, romeno, húngaro, grego, turco. Smart Functions: Whisper mais de 50 idiomas; TTS mais de 30; OCR: inglês, alemão, francês, espanhol, italiano, português, chinês, japonês, coreano.',
  q19: 'Como altero as definições da conta?',
  a19: 'Clique no seu nome na navegação para ir ao Perfil. Lá pode atualizar o email (com verificação), definir nome de exibição, alterar palavra-passe, configurar notificações, ver histórico e saldo, gerar chave API, encontrar o seu código de referência e eliminar a conta permanentemente (Zona perigosa). A eliminação remove todos os dados associados em 30 dias.',
  q20: 'Como contactar o suporte?',
  a20: 'Escreva para support@convertanyformat.com. Resposta em 24h em dias úteis, 48h ao fim de semana. Pedidos RGPD: inclua "GDPR" no assunto para priorização. Também formulário em /contact. Sem suporte telefónico, mas videochamada disponível para pedidos empresariais.',
});

const nlFaq = makeFaq('nl', {
  title: 'Veelgestelde vragen',
  subtitle: 'Alles wat je moet weten over {{brand}} — conversies, prijzen, beveiliging, Smart Functions en meer.',
  seoDesc: 'Veelgestelde vragen over {{brand}}. Conversies, prijzen, beveiliging, Smart Functions, talen, terugbetalingen en contact.',
  q1: 'Hoe werkt de conversie stap voor stap?',
  a1: 'Vier stappen: (1) sleep je bestand of klik om te bladeren — tot 200 MB; (2) kies het uitvoerformaat in het dropdownmenu; (3) pas indien nodig geavanceerde opties aan (kwaliteit, resolutie, OCR); (4) klik op Converteren — het bestand wordt versleuteld naar onze verwerker gestuurd, credits worden afgeschreven en je krijgt binnen seconden een downloadlink.',
  q2: 'Welke bestandsformaten worden ondersteund?',
  a2: 'Meer dan 50 formaten in zes categorieën: Documenten (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Afbeeldingen (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Audio (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Video (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Archieven (ZIP, RAR, 7Z, TAR, GZ) en speciale PDF-tools. Volledige lijst op de Tools-pagina.',
  q3: 'Hoe werkt het credit-systeem?',
  a3: '{{brand}} gebruikt een prepaid-model — geen abonnementen. Standaardconversies kosten 1 credit. Smart Functions worden per gebruik gefactureerd: Tekst naar spraak 1 credit per 1000 tekens; Spraak naar tekst en ondertitels 1 credit per 5 minuten (afgerond). Mislukte conversies zijn gratis. Credits verlopen niet. 5 bonus-credits per doorverwezen vriend.',
  q4: 'Wat bevat elk pakket en hoe koop ik?',
  a4: 'Drie pakketten: 1 credit (€0,99), 10 credits (€7,99, ~19% korting) en 30 credits (€20,99, ~30% korting). Alle prijzen inclusief 19% Duitse btw. Aankoop via Stripe — kaarten en SEPA geaccepteerd. Belastingfactuur per email direct, credits onmiddellijk beschikbaar.',
  q5: 'Hoe lang worden bestanden bewaard?',
  a5: 'Zowel het originele bestand als de geconverteerde uitvoer worden binnen 24 uur na upload automatisch en permanent verwijderd. Geen uitzonderingen, geen handmatige verlengingen — verwijdering wordt afgedwongen door een geautomatiseerd proces. De downloadlink stopt met werken. Wij bewaren geen kopieën, back-ups of miniaturen.',
  q6: 'Is de site veilig en AVG-conform?',
  a6: 'Ja. {{brand}} wordt vanuit Duitsland geëxploiteerd en valt volledig onder de AVG. TLS 1.2+, wachtwoorden met bcrypt, httpOnly cookies SameSite=Strict. Verwerkersovereenkomsten met elke subverwerker (Art. 28 AVG). Doorgiften buiten de EER via standaardcontractbepalingen of EU-US Data Privacy Framework. Wij verkopen je gegevens nooit.',
  q7: 'Wat gebeurt er met mijn bestanden na conversie?',
  a7: 'Bij conversie wordt je bestand versleuteld naar de verwerker gestuurd — CloudConvert voor standaardformaten, OpenAI voor Smart Functions. Alleen de gevraagde conversie wordt uitgevoerd. Wij hebben nooit toegang tot de inhoud voor andere doeleinden. Beide bestanden worden binnen 24 uur verwijderd van onze servers en uit subverwerker-caches.',
  q8: 'Kunnen bestanden worden hersteld na verwijdering?',
  a8: 'Nee. Verwijdering is permanent en onomkeerbaar. We bewaren geen back-ups van gebruikersbestanden (databasereback-ups sluiten bestanden bewust uit). Dit ondersteunt je recht op gegevenswissing (Art. 17 AVG). Download je geconverteerde bestanden altijd binnen 24 uur en bewaar ze lokaal.',
  q9: 'Wat is de maximale bestandsgrootte?',
  a9: '200 MB per bestand voor standaardconversies. Smart Functions beperkt tot 25 MB per bestand (harde limiet van de OpenAI API). Voor grotere bestanden, splits ze lokaal (bijv. met ffmpeg) en converteer elk deel. Voor bedrijfsbehoeften, schrijf naar support@convertanyformat.com.',
  q10: 'Welke browsers worden ondersteund?',
  a10: 'Alle moderne browsers die in de afgelopen twee jaar zijn bijgewerkt: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ en de meeste mobiele browsers. JavaScript en cookies moeten zijn ingeschakeld. Voor microfoonopname (Spraak naar tekst) verleen toestemming wanneer gevraagd. Internet Explorer wordt niet ondersteund.',
  q11: 'Werkt het op mobiel?',
  a11: 'Ja — volledig geoptimaliseerd voor mobiel. De interface past zich aan schermen vanaf 320 px aan, toolkaarten worden op kleine schermen in twee kolommen weergegeven, en alle functies inclusief audio-opname via de microfoon werken op iOS Safari en Android Chrome. Installeerbaar als Progressive Web App.',
  q12: 'Hoe annuleer ik of krijg ik terugbetaling?',
  a12: 'Geen abonnementen om op te zeggen — credits zijn eenmalige aankopen zonder vervaldatum. Voor terugbetaling van ongebruikte credits, schrijf naar support@convertanyformat.com binnen 14 dagen na aankoop (Fernabsatzgesetz). Terugbetaling binnen 5–10 werkdagen. Gebruikte credits normaal niet terugbetaalbaar tenzij defect aan onze kant. Account verwijderen via Profiel → Gevarenzone.',
  q13: 'Wat zijn de Smart Functions tools?',
  a13: 'Tools met AI naast conversie: OCR (extraheert tekst uit gescande PDFs en afbeeldingen), PDF comprimeren met AI, Tekst naar spraak (MP3/OPUS/AAC audio via OpenAI TTS-1), Spraak naar tekst (transcriptie TXT/DOCX via Whisper) en Automatische ondertitelgenerator (SRT/VTT vanuit video). Per gebruik gefactureerd.',
  q14: 'Wat is OCR en wanneer gebruik je het?',
  a14: 'OCR (Optische Tekenherkenning) haalt bewerkbare tekst uit afbeeldingen. Gebruik het bij gescande PDFs, foto\'s van documenten of afbeeldingen waar tekst niet selecteerbaar is. {{brand}} retourneert een doorzoekbare PDF (origineel ontwerp + onzichtbare tekstlaag) of platte tekst. Gebruiksgevallen: digitalisering, doorzoekbare archieven, citaten extraheren.',
  q15: 'Hoe werkt Tekst naar spraak?',
  a15: 'Typ of plak tot 4096 tekens, kies een van zes stemmen (Alloy, Echo, Fable, Onyx, Nova, Shimmer), snelheid (0,75x tot 1,5x) en formaat (MP3, OPUS, AAC), klik op Converteren. Binnen seconden ontvang je een audiobestand met natuurlijke stem gegenereerd door OpenAI TTS-1. Kosten: 1 credit per 1000 tekens.',
  q16: 'Hoe werkt Spraak naar tekst?',
  a16: 'Upload een audiobestand (MP3, WAV, M4A, OGG, MP4, WebM) tot 25 MB. We transcriberen met OpenAI Whisper. Kies TXT of DOCX. Ook microfoonopname mogelijk. Optionele taalhint verbetert de nauwkeurigheid. Kosten: 1 credit per 5 minuten (afgerond). De transcriptie wordt op de pagina getoond zodat je deze kunt controleren voor download.',
  q17: 'Hoe werkt de Automatische ondertitelgenerator?',
  a17: 'Upload een video (MP4, MOV, AVI, MKV) tot 25 MB. We extraheren de audio indien nodig (CloudConvert voor non-MP4 containers) en transcriberen met Whisper in tijdcode-modus. Je krijgt een SRT of VTT klaar voor YouTube, Vimeo, Premiere of elke editor. Kosten: 1 credit per 5 minuten video.',
  q18: 'Welke talen worden ondersteund?',
  a18: 'De interface is vertaald in 17 Europese talen: Engels, Duits, Frans, Spaans, Italiaans, Portugees, Nederlands, Pools, Zweeds, Noors, Deens, Fins, Tsjechisch, Roemeens, Hongaars, Grieks, Turks. Smart Functions: Whisper meer dan 50 talen; TTS meer dan 30; OCR: Engels, Duits, Frans, Spaans, Italiaans, Portugees, Chinees, Japans, Koreaans.',
  q19: 'Hoe wijzig ik mijn accountinstellingen?',
  a19: 'Klik op je naam in de navigatie om naar je Profiel te gaan. Daar kun je je email bijwerken (met verificatie), een weergavenaam instellen, je wachtwoord wijzigen, e-mailmeldingen configureren, geschiedenis en saldo bekijken, een API-sleutel genereren, je verwijscode vinden en je account permanent verwijderen (Gevarenzone). Verwijdering wist alle gerelateerde gegevens binnen 30 dagen.',
  q20: 'Hoe neem ik contact op met support?',
  a20: 'Email naar support@convertanyformat.com. Reactie binnen 24u op werkdagen, 48u in het weekend. AVG-vragen: vermeld "GDPR" in het onderwerp voor prioriteit. Ook contactformulier op /contact. Geen telefonische ondersteuning, maar videogesprek beschikbaar voor zakelijke aanvragen.',
});

const plFaq = makeFaq('pl', {
  title: 'Najczęściej zadawane pytania',
  subtitle: 'Wszystko, co musisz wiedzieć o {{brand}} — konwersje, ceny, bezpieczeństwo, Smart Functions i więcej.',
  seoDesc: 'Najczęściej zadawane pytania o {{brand}}. Konwersje, ceny, bezpieczeństwo, Smart Functions, języki, zwroty i kontakt.',
  q1: 'Jak działa konwersja krok po kroku?',
  a1: 'Cztery kroki: (1) przeciągnij plik lub kliknij, aby przeglądać — do 200 MB; (2) wybierz format wyjściowy z listy rozwijanej; (3) dostosuj opcje zaawansowane w razie potrzeby (jakość, rozdzielczość, OCR); (4) kliknij Konwertuj — plik jest wysyłany zaszyfrowany do naszego procesora, kredyty są pobierane, a w sekundach otrzymujesz link.',
  q2: 'Jakie formaty są obsługiwane?',
  a2: 'Ponad 50 formatów w sześciu kategoriach: Dokumenty (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Obrazy (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Audio (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Wideo (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Archiwa (ZIP, RAR, 7Z, TAR, GZ) i dedykowane narzędzia PDF. Pełna lista na stronie Narzędzia.',
  q3: 'Jak działa system kredytów?',
  a3: '{{brand}} używa modelu przedpłaconego — bez abonamentów. Standardowe konwersje kosztują 1 kredyt. Smart Functions rozliczane są za użycie: Tekst na mowę 1 kredyt za 1000 znaków; Mowa na tekst i napisy 1 kredyt za 5 minut (zaokrąglone). Nieudane konwersje są darmowe. Kredyty nie wygasają. 5 kredytów bonusowych za każdego poleconego znajomego.',
  q4: 'Co zawiera każdy pakiet i jak kupić?',
  a4: 'Trzy pakiety: 1 kredyt (0,99 €), 10 kredytów (7,99 €, ~19% rabatu) i 30 kredytów (20,99 €, ~30% rabatu). Wszystkie ceny zawierają niemiecki VAT 19%. Zakup przez Stripe — karty i SEPA akceptowane. Faktura podatkowa wysyłana e-mailem natychmiast, kredyty dostępne od razu.',
  q5: 'Jak długo pliki są przechowywane?',
  a5: 'Zarówno oryginalny plik, jak i konwertowany wynik są automatycznie i trwale usuwane w ciągu 24 godzin od przesłania. Bez wyjątków i ręcznych przedłużeń — usuwanie wymuszane przez automatyczne zadanie. Link do pobrania przestaje działać. Nie zachowujemy kopii, kopii zapasowych ani miniatur.',
  q6: 'Czy strona jest bezpieczna i zgodna z RODO?',
  a6: 'Tak. {{brand}} jest obsługiwany z Niemiec i w pełni podlega RODO. TLS 1.2+, hasła hashowane bcrypt, ciasteczka httpOnly SameSite=Strict. Umowy powierzenia z każdym podprocesorem (Art. 28 RODO). Przekazywanie poza EOG przez standardowe klauzule umowne lub EU-US Data Privacy Framework. Nigdy nie sprzedajemy Twoich danych.',
  q7: 'Co dzieje się z moimi plikami po konwersji?',
  a7: 'Po konwersji plik jest wysyłany zaszyfrowany do procesora — CloudConvert dla standardowych formatów, OpenAI dla Smart Functions. Wykonywana jest tylko żądana konwersja. Nigdy nie uzyskujemy dostępu do treści w innych celach. Oba pliki są usuwane w ciągu 24 godzin z naszych serwerów i pamięci podręcznych podprocesorów.',
  q8: 'Czy pliki można odzyskać po usunięciu?',
  a8: 'Nie. Usuwanie jest trwałe i nieodwracalne. Nie przechowujemy kopii zapasowych plików użytkownika (kopie zapasowe bazy danych celowo wykluczają pliki). Wspiera to Twoje prawo do usunięcia (Art. 17 RODO). Zawsze pobieraj konwertowane pliki w ciągu 24 godzin i przechowuj je lokalnie.',
  q9: 'Jaki jest maksymalny rozmiar pliku?',
  a9: '200 MB na plik dla standardowych konwersji. Smart Functions ograniczone do 25 MB na plik (twardy limit API OpenAI). Dla większych plików, podziel je lokalnie (np. ffmpeg) i konwertuj każdą część. Dla potrzeb biznesowych pisz na support@convertanyformat.com.',
  q10: 'Jakie przeglądarki są obsługiwane?',
  a10: 'Wszystkie nowoczesne przeglądarki zaktualizowane w ciągu ostatnich dwóch lat: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ i większość mobilnych. JavaScript i ciasteczka muszą być włączone. Dla nagrywania mikrofonem (Mowa na tekst) udziel pozwolenia po wyświetleniu monitu. Internet Explorer nie jest obsługiwany.',
  q11: 'Czy działa na telefonie?',
  a11: 'Tak — w pełni zoptymalizowane dla urządzeń mobilnych. Interfejs dostosowuje się do ekranów od 320 px, karty narzędzi wyświetlane są w dwóch kolumnach na małych ekranach, a wszystkie funkcje, w tym nagrywanie audio z mikrofonu, działają na iOS Safari i Android Chrome. Można zainstalować jako Progressive Web App.',
  q12: 'Jak anulować lub uzyskać zwrot?',
  a12: 'Brak abonamentów do anulowania — kredyty to jednorazowe zakupy bez wygaśnięcia. Aby otrzymać zwrot za niewykorzystane kredyty, napisz na support@convertanyformat.com w ciągu 14 dni od zakupu (Fernabsatzgesetz). Zwrot w 5–10 dni roboczych. Wykorzystane kredyty zwykle bezzwrotne, chyba że błąd po naszej stronie. Usuwanie konta przez Profil → Strefa zagrożenia.',
  q13: 'Czym są narzędzia Smart Functions?',
  a13: 'Narzędzia oparte na AI poza konwersją: OCR (wyodrębnia tekst ze zeskanowanych PDF i obrazów), Kompresja PDF z AI, Tekst na mowę (audio MP3/OPUS/AAC przez OpenAI TTS-1), Mowa na tekst (transkrypcja TXT/DOCX przez Whisper) i Automatyczny generator napisów (SRT/VTT z wideo). Rozliczane za użycie.',
  q14: 'Czym jest OCR i kiedy go używać?',
  a14: 'OCR (Optyczne Rozpoznawanie Znaków) wyodrębnia edytowalny tekst z obrazów. Używaj go do zeskanowanych PDF, zdjęć dokumentów lub obrazów, w których tekst nie jest zaznaczalny. {{brand}} zwraca przeszukiwalny PDF (oryginalny układ + niewidoczna warstwa tekstowa) lub czysty tekst. Zastosowania: digitalizacja, archiwa do przeszukiwania, wyodrębnianie cytatów.',
  q15: 'Jak działa Tekst na mowę?',
  a15: 'Wpisz lub wklej do 4096 znaków, wybierz jeden z sześciu głosów (Alloy, Echo, Fable, Onyx, Nova, Shimmer), prędkość (0,75x do 1,5x) i format (MP3, OPUS, AAC), kliknij Konwertuj. W sekundach otrzymujesz plik audio z naturalnym głosem wygenerowany przez OpenAI TTS-1. Koszt: 1 kredyt za 1000 znaków.',
  q16: 'Jak działa Mowa na tekst?',
  a16: 'Prześlij plik audio (MP3, WAV, M4A, OGG, MP4, WebM) do 25 MB. Transkrybujemy za pomocą OpenAI Whisper. Wybierz TXT lub DOCX. Możliwe również nagrywanie z mikrofonu. Opcjonalna podpowiedź języka poprawia dokładność. Koszt: 1 kredyt za 5 minut (zaokrąglone). Transkrypcja jest pokazywana do przejrzenia przed pobraniem.',
  q17: 'Jak działa Automatyczny generator napisów?',
  a17: 'Prześlij wideo (MP4, MOV, AVI, MKV) do 25 MB. Wyodrębniamy audio w razie potrzeby (CloudConvert dla kontenerów innych niż MP4) i transkrybujemy z Whisper w trybie z znacznikami czasu. Otrzymujesz SRT lub VTT gotowy do YouTube, Vimeo, Premiere lub dowolnego edytora. Koszt: 1 kredyt za 5 minut wideo.',
  q18: 'Jakie języki są obsługiwane?',
  a18: 'Interfejs jest przetłumaczony na 17 języków europejskich: angielski, niemiecki, francuski, hiszpański, włoski, portugalski, niderlandzki, polski, szwedzki, norweski, duński, fiński, czeski, rumuński, węgierski, grecki, turecki. Smart Functions: Whisper ponad 50 języków; TTS ponad 30; OCR: angielski, niemiecki, francuski, hiszpański, włoski, portugalski, chiński, japoński, koreański.',
  q19: 'Jak zmienić ustawienia konta?',
  a19: 'Kliknij swoje imię w nawigacji, aby przejść do Profilu. Tam możesz zaktualizować e-mail (z weryfikacją), ustawić nazwę wyświetlaną, zmienić hasło, skonfigurować powiadomienia, zobaczyć historię i saldo, wygenerować klucz API, znaleźć kod polecający i trwale usunąć konto (Strefa zagrożenia). Usunięcie wymazuje wszystkie powiązane dane w 30 dni.',
  q20: 'Jak skontaktować się z pomocą techniczną?',
  a20: 'Napisz na support@convertanyformat.com. Odpowiedź w 24h w dni robocze, 48h w weekendy. Pytania RODO: dodaj "GDPR" w temacie dla priorytetu. Również formularz na /contact. Brak wsparcia telefonicznego, ale rozmowa wideo dostępna dla zapytań biznesowych.',
});

const svFaq = makeFaq('sv', {
  title: 'Vanliga frågor',
  subtitle: 'Allt du behöver veta om {{brand}} — konverteringar, priser, säkerhet, Smart Functions och mer.',
  seoDesc: 'Vanliga frågor om {{brand}}. Konverteringar, priser, säkerhet, Smart Functions, språk, återbetalningar och kontakt.',
  q1: 'Hur fungerar konvertering steg för steg?',
  a1: 'Fyra steg: (1) dra och släpp filen eller klicka för att bläddra — upp till 200 MB; (2) välj utdataformat från rullgardinsmenyn; (3) justera avancerade alternativ vid behov (kvalitet, upplösning, OCR); (4) klicka på Konvertera — filen skickas krypterad till vår processor, krediter dras av och du får en nedladdningslänk på sekunder.',
  q2: 'Vilka filformat stöds?',
  a2: 'Över 50 format i sex kategorier: Dokument (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Bilder (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Ljud (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Video (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Arkiv (ZIP, RAR, 7Z, TAR, GZ) och dedikerade PDF-verktyg. Fullständig lista på Verktyg-sidan.',
  q3: 'Hur fungerar kreditsystemet?',
  a3: '{{brand}} använder en förbetald modell — inga prenumerationer. Standardkonverteringar kostar 1 kredit. Smart Functions debiteras efter användning: Text till tal 1 kredit per 1000 tecken; Tal till text och undertexter 1 kredit per 5 minuter (avrundat). Misslyckade konverteringar är gratis. Krediter förfaller aldrig. 5 bonuskrediter per värvad vän.',
  q4: 'Vad innehåller varje paket och hur köper jag?',
  a4: 'Tre paket: 1 kredit (0,99 €), 10 krediter (7,99 €, ~19% rabatt) och 30 krediter (20,99 €, ~30% rabatt). Alla priser inkluderar 19% tysk moms. Köp via Stripe — kort och SEPA accepteras. Skattekompatibel faktura via e-post omedelbart, krediter tillgängliga direkt.',
  q5: 'Hur länge lagras filer innan de raderas?',
  a5: 'Både originalfilen och den konverterade utdata raderas automatiskt och permanent inom 24 timmar efter uppladdning. Inga undantag, inga manuella förlängningar — radering verkställs av en automatiserad process. Nedladdningslänken slutar fungera. Vi behåller inga kopior, säkerhetskopior eller miniatyrer.',
  q6: 'Är webbplatsen säker och GDPR-kompatibel?',
  a6: 'Ja. {{brand}} drivs från Tyskland och omfattas fullt ut av GDPR. TLS 1.2+, lösenord hashade med bcrypt, httpOnly-cookies SameSite=Strict. Personuppgiftsbiträdesavtal med varje underbiträde (Art. 28 GDPR). Överföringar utanför EES via EU:s standardavtalsklausuler eller EU-US Data Privacy Framework. Vi säljer aldrig dina data.',
  q7: 'Vad händer med mina filer efter konvertering?',
  a7: 'Vid konvertering skickas filen krypterad till processorn — CloudConvert för standardformat, OpenAI för Smart Functions. Endast den begärda konverteringen utförs. Vi får aldrig åtkomst till innehållet för andra ändamål. Båda filerna tas bort inom 24 timmar från våra servrar och underbiträdes-cacher.',
  q8: 'Kan filer återskapas efter radering?',
  a8: 'Nej. Raderingen är permanent och oåterkallelig. Vi behåller inga säkerhetskopior av användarfiler (databassäkerhetskopior utesluter filer avsiktligt). Detta stöder din rätt till radering (Art. 17 GDPR). Ladda alltid ner dina konverterade filer inom 24 timmar och spara dem lokalt.',
  q9: 'Vad är den maximala filstorleken?',
  a9: '200 MB per fil för standardkonverteringar. Smart Functions begränsade till 25 MB per fil (hård gräns från OpenAI API). För större filer, dela upp dem lokalt (t.ex. med ffmpeg) och konvertera varje del. För företagsbehov, skriv till support@convertanyformat.com.',
  q10: 'Vilka webbläsare stöds?',
  a10: 'Alla moderna webbläsare uppdaterade under de senaste två åren: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ och de flesta mobila webbläsare. JavaScript och cookies måste vara aktiverade. För mikrofoninspelning (Tal till text), bevilja behörighet när du blir tillfrågad. Internet Explorer stöds inte.',
  q11: 'Fungerar det på mobil?',
  a11: 'Ja — fullt mobiloptimerat. Gränssnittet anpassar sig till skärmar från 320 px, verktygskort visas i två kolumner på små skärmar, och alla funktioner inklusive ljudinspelning från mikrofonen fungerar på iOS Safari och Android Chrome. Installerbar som Progressive Web App.',
  q12: 'Hur avbryter jag eller får återbetalning?',
  a12: 'Inga prenumerationer att avbryta — krediter är engångsköp utan utgång. För återbetalning av oanvända krediter, skriv till support@convertanyformat.com inom 14 dagar efter köpet (Fernabsatzgesetz). Återbetalning inom 5–10 arbetsdagar. Använda krediter återbetalas vanligen inte utom vid fel hos oss. Radera konto via Profil → Farozonen.',
  q13: 'Vad är Smart Functions-verktygen?',
  a13: 'AI-drivna verktyg utöver konvertering: OCR (extraherar text från skannade PDF och bilder), Komprimera PDF med AI, Text till tal (MP3/OPUS/AAC-ljud via OpenAI TTS-1), Tal till text (transkription TXT/DOCX via Whisper) och Automatisk undertextgenerator (SRT/VTT från video). Debiteras efter användning.',
  q14: 'Vad är OCR och när ska jag använda det?',
  a14: 'OCR (Optisk teckenigenkänning) extraherar redigerbar text från bilder. Använd det med skannade PDF, foton av dokument eller bilder där text inte är markerbar. {{brand}} returnerar en sökbar PDF (originallayout + osynligt textlager) eller vanlig text. Användningsfall: digitalisering, sökbara arkiv, citatutdrag.',
  q15: 'Hur fungerar Text till tal?',
  a15: 'Skriv eller klistra in upp till 4096 tecken, välj en av sex röster (Alloy, Echo, Fable, Onyx, Nova, Shimmer), hastighet (0,75x till 1,5x) och format (MP3, OPUS, AAC), klicka på Konvertera. Inom sekunder får du en ljudfil med naturlig röst genererad av OpenAI TTS-1. Kostnad: 1 kredit per 1000 tecken.',
  q16: 'Hur fungerar Tal till text?',
  a16: 'Ladda upp en ljudfil (MP3, WAV, M4A, OGG, MP4, WebM) upp till 25 MB. Vi transkriberar med OpenAI Whisper. Välj TXT eller DOCX. Också mikrofoninspelning möjlig. Valfritt språkförslag förbättrar precisionen. Kostnad: 1 kredit per 5 minuter (avrundat). Transkriptionen visas på sidan så du kan granska den före nedladdning.',
  q17: 'Hur fungerar den Automatiska undertextgeneratorn?',
  a17: 'Ladda upp en video (MP4, MOV, AVI, MKV) upp till 25 MB. Vi extraherar ljudet vid behov (CloudConvert för icke-MP4-behållare) och transkriberar med Whisper i tidsstämpelläge. Du får en SRT eller VTT redo för YouTube, Vimeo, Premiere eller vilken redigerare som helst. Kostnad: 1 kredit per 5 minuter video.',
  q18: 'Vilka språk stöds?',
  a18: 'Gränssnittet är översatt till 17 europeiska språk: engelska, tyska, franska, spanska, italienska, portugisiska, nederländska, polska, svenska, norska, danska, finska, tjeckiska, rumänska, ungerska, grekiska, turkiska. Smart Functions: Whisper över 50 språk; TTS över 30; OCR: engelska, tyska, franska, spanska, italienska, portugisiska, kinesiska, japanska, koreanska.',
  q19: 'Hur ändrar jag mina kontoinställningar?',
  a19: 'Klicka på ditt namn i navigeringen för att gå till Profilen. Där kan du uppdatera din e-post (med verifiering), ange ett visningsnamn, ändra lösenord, konfigurera aviseringar, se historik och saldo, generera en API-nyckel, hitta din värvningskod och permanent radera ditt konto (Farozonen). Radering raderar all tillhörande data inom 30 dagar.',
  q20: 'Hur kontaktar jag supporten?',
  a20: 'Skriv till support@convertanyformat.com. Svar inom 24h på vardagar, 48h på helger. GDPR-frågor: skriv "GDPR" i ämnet för prioritering. Även kontaktformulär på /contact. Ingen telefonsupport, men videosamtal tillgängligt för företagsförfrågningar.',
});

const noFaq = makeFaq('no', {
  title: 'Vanlige spørsmål',
  subtitle: 'Alt du trenger å vite om {{brand}} — konverteringer, priser, sikkerhet, Smart Functions og mer.',
  seoDesc: 'Vanlige spørsmål om {{brand}}. Konverteringer, priser, sikkerhet, Smart Functions, språk, refusjoner og kontakt.',
  q1: 'Hvordan fungerer konvertering trinn for trinn?',
  a1: 'Fire trinn: (1) dra og slipp filen eller klikk for å bla — opptil 200 MB; (2) velg utdataformat fra rullegardinmenyen; (3) juster avanserte alternativer ved behov (kvalitet, oppløsning, OCR); (4) klikk Konverter — filen sendes kryptert til prosessoren vår, kreditter trekkes og du får en nedlastingslenke på sekunder.',
  q2: 'Hvilke filformater støttes?',
  a2: 'Over 50 formater i seks kategorier: Dokumenter (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Bilder (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Lyd (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Video (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Arkiver (ZIP, RAR, 7Z, TAR, GZ) og dedikerte PDF-verktøy. Fullstendig liste på Verktøy-siden.',
  q3: 'Hvordan fungerer kredittsystemet?',
  a3: '{{brand}} bruker en forhåndsbetalt modell — ingen abonnementer. Standardkonverteringer koster 1 kreditt. Smart Functions belastes per bruk: Tekst til tale 1 kreditt per 1000 tegn; Tale til tekst og undertekster 1 kreditt per 5 minutter (avrundet). Mislykkede konverteringer er gratis. Kreditter utløper aldri. 5 bonuskreditter per vervet venn.',
  q4: 'Hva inneholder hver pakke og hvordan kjøpe?',
  a4: 'Tre pakker: 1 kreditt (0,99 €), 10 kreditter (7,99 €, ~19% rabatt) og 30 kreditter (20,99 €, ~30% rabatt). Alle priser inkluderer 19% tysk mva. Kjøp via Stripe — kort og SEPA godtas. Skattekvittert faktura via e-post umiddelbart, kreditter tilgjengelige med en gang.',
  q5: 'Hvor lenge lagres filer før de slettes?',
  a5: 'Både originalfilen og den konverterte utdata slettes automatisk og permanent innen 24 timer etter opplasting. Ingen unntak, ingen manuelle forlengelser — slettingen håndheves av en automatisert prosess. Nedlastingslenken slutter å fungere. Vi beholder ingen kopier, sikkerhetskopier eller miniatyrer.',
  q6: 'Er nettstedet sikkert og GDPR-kompatibelt?',
  a6: 'Ja. {{brand}} drives fra Tyskland og er fullt underlagt GDPR. TLS 1.2+, passord hashes med bcrypt, httpOnly-cookies SameSite=Strict. Databehandleravtaler med hver underbehandler (Art. 28 GDPR). Overføringer utenfor EØS via EUs standardkontraktsbestemmelser eller EU-US Data Privacy Framework. Vi selger aldri dataene dine.',
  q7: 'Hva skjer med filene mine etter konvertering?',
  a7: 'Ved konvertering sendes filen kryptert til prosessoren — CloudConvert for standardformater, OpenAI for Smart Functions. Bare den ønskede konverteringen utføres. Vi får aldri tilgang til innholdet for andre formål. Begge filene fjernes innen 24 timer fra serverne våre og fra underbehandlerens cacher.',
  q8: 'Kan filer gjenopprettes etter sletting?',
  a8: 'Nei. Sletting er permanent og ugjenkallelig. Vi vedlikeholder ikke sikkerhetskopier av brukerfiler (databasesikkerhetskopier ekskluderer filer med vilje). Dette støtter din rett til sletting (Art. 17 GDPR). Last alltid ned konverterte filer innen 24 timer og lagre dem lokalt.',
  q9: 'Hva er maksimal filstørrelse?',
  a9: '200 MB per fil for standardkonverteringer. Smart Functions begrenset til 25 MB per fil (hard grense fra OpenAI-API). For større filer, del dem opp lokalt (f.eks. med ffmpeg) og konverter hver del. For bedriftsbehov, skriv til support@convertanyformat.com.',
  q10: 'Hvilke nettlesere støttes?',
  a10: 'Alle moderne nettlesere oppdatert i løpet av de siste to årene: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ og de fleste mobile nettlesere. JavaScript og informasjonskapsler må være aktivert. For mikrofonopptak (Tale til tekst), gi tillatelse når du blir bedt om det. Internet Explorer støttes ikke.',
  q11: 'Fungerer det på mobil?',
  a11: 'Ja — fullt mobiloptimalisert. Grensesnittet tilpasser seg skjermer fra 320 px, verktøykort vises i to kolonner på små skjermer, og alle funksjoner inkludert lydopptak fra mikrofonen fungerer på iOS Safari og Android Chrome. Kan installeres som Progressive Web App.',
  q12: 'Hvordan kansellerer jeg eller får refusjon?',
  a12: 'Ingen abonnementer å kansellere — kreditter er engangskjøp uten utløp. For refusjon av ubrukte kreditter, skriv til support@convertanyformat.com innen 14 dager etter kjøp (Fernabsatzgesetz). Refusjon innen 5–10 virkedager. Brukte kreditter er vanligvis ikke refunderbare unntatt ved feil hos oss. Slett konto via Profil → Faresonen.',
  q13: 'Hva er Smart Functions-verktøyene?',
  a13: 'AI-drevne verktøy utover konvertering: OCR (henter tekst fra skannede PDF-er og bilder), Komprimer PDF med AI, Tekst til tale (MP3/OPUS/AAC-lyd via OpenAI TTS-1), Tale til tekst (transkripsjon TXT/DOCX via Whisper) og Automatisk undertekstgenerator (SRT/VTT fra video). Belastes per bruk.',
  q14: 'Hva er OCR og når bør jeg bruke det?',
  a14: 'OCR (Optisk tegngjenkjenning) henter ut redigerbar tekst fra bilder. Bruk det med skannede PDF-er, fotografier av dokumenter eller bilder der tekst ikke er valgbar. {{brand}} returnerer en søkbar PDF (originaloppsett + usynlig tekstlag) eller ren tekst. Brukstilfeller: digitalisering, søkbare arkiver, sitatutdrag.',
  q15: 'Hvordan fungerer Tekst til tale?',
  a15: 'Skriv inn eller lim inn opptil 4096 tegn, velg en av seks stemmer (Alloy, Echo, Fable, Onyx, Nova, Shimmer), hastighet (0,75x til 1,5x) og format (MP3, OPUS, AAC), klikk på Konverter. Innen sekunder får du en lydfil med naturlig stemme generert av OpenAI TTS-1. Kostnad: 1 kreditt per 1000 tegn.',
  q16: 'Hvordan fungerer Tale til tekst?',
  a16: 'Last opp en lydfil (MP3, WAV, M4A, OGG, MP4, WebM) opptil 25 MB. Vi transkriberer med OpenAI Whisper. Velg TXT eller DOCX. Også mikrofonopptak mulig. Valgfri språkhint forbedrer nøyaktigheten. Kostnad: 1 kreditt per 5 minutter (avrundet). Transkripsjonen vises på siden slik at du kan vurdere den før nedlasting.',
  q17: 'Hvordan fungerer den Automatiske undertekstgeneratoren?',
  a17: 'Last opp en video (MP4, MOV, AVI, MKV) opptil 25 MB. Vi henter ut lyden ved behov (CloudConvert for ikke-MP4-containere) og transkriberer med Whisper i tidsstempelmodus. Du får en SRT eller VTT klar for YouTube, Vimeo, Premiere eller hvilken som helst editor. Kostnad: 1 kreditt per 5 minutter video.',
  q18: 'Hvilke språk støttes?',
  a18: 'Grensesnittet er oversatt til 17 europeiske språk: engelsk, tysk, fransk, spansk, italiensk, portugisisk, nederlandsk, polsk, svensk, norsk, dansk, finsk, tsjekkisk, rumensk, ungarsk, gresk, tyrkisk. Smart Functions: Whisper over 50 språk; TTS over 30; OCR: engelsk, tysk, fransk, spansk, italiensk, portugisisk, kinesisk, japansk, koreansk.',
  q19: 'Hvordan endrer jeg kontoinnstillinger?',
  a19: 'Klikk på navnet ditt i navigasjonen for å gå til Profilen. Der kan du oppdatere e-posten din (med verifisering), angi et visningsnavn, endre passord, konfigurere varsler, se historikk og saldo, generere en API-nøkkel, finne vervekoden din og permanent slette kontoen (Faresonen). Sletting fjerner alle tilknyttede data innen 30 dager.',
  q20: 'Hvordan kontakter jeg support?',
  a20: 'Skriv til support@convertanyformat.com. Svar innen 24 timer på virkedager, 48 timer i helger. GDPR-henvendelser: skriv "GDPR" i emnet for prioritering. Også kontaktskjema på /contact. Ingen telefonsupport, men videosamtale tilgjengelig for bedriftsforespørsler.',
});

// =====================================================================
// Replacement helpers (depth-tracked brace walk pattern)
// =====================================================================

function formatObjectLiteral(obj, indent = '  ') {
  const inner = Object.entries(obj)
    .map(([k, v]) => `${indent}  ${k}: ${JSON.stringify(v)},`)
    .join('\n');
  return `{\n${inner}\n${indent}}`;
}

function findKeyBlock(text, keyName, searchFrom = 0) {
  const re = new RegExp(`(\\b${keyName}:\\s*)\\{`, 'g');
  re.lastIndex = searchFrom;
  const m = re.exec(text);
  if (!m) return null;
  const headerStart = m.index;
  const openBrace = m.index + m[0].length - 1;
  let depth = 0;
  for (let i = openBrace; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return { start: headerStart, end: i + 1 };
    }
  }
  return null;
}

function findLangBlock(text, langName) {
  const start = text.indexOf(`const ${langName} = {`);
  if (start === -1) throw new Error(`Section not found: ${langName}`);
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return { start, end: i + 1 };
    }
  }
  throw new Error(`Unterminated section: ${langName}`);
}

function replaceTopLevelKey(text, keyName, newObject, scopeStart = 0, scopeEnd = text.length) {
  const block = findKeyBlock(text.slice(scopeStart, scopeEnd), keyName);
  if (!block) throw new Error(`Could not find ${keyName} in scope`);
  const absStart = scopeStart + block.start;
  const absEnd = scopeStart + block.end;
  const newSrc = `${keyName}: ${formatObjectLiteral(newObject)}`;
  return text.slice(0, absStart) + newSrc + text.slice(absEnd);
}

// =====================================================================
// Apply
// =====================================================================

let i18nSrc = fs.readFileSync(I18N, 'utf8');
i18nSrc = replaceTopLevelKey(i18nSrc, 'faq', enFaq);
i18nSrc = replaceTopLevelKey(i18nSrc, 'about', enAbout);
fs.writeFileSync(I18N, i18nSrc);
console.log('✔ Updated client/src/i18n.js (faq + about, English source)');

let transSrc = fs.readFileSync(TRANS, 'utf8');

const langPayloads = [
  ['de', deFaq, deAbout],
  ['fr', frFaq, null],
  ['es', esFaq, null],
  ['it', itFaq, null],
  ['pt', ptFaq, null],
  ['nl', nlFaq, null],
  ['pl', plFaq, null],
  ['sv', svFaq, null],
  ['no', noFaq, null],
];

for (const [lang, faq, about] of langPayloads) {
  let block = findLangBlock(transSrc, lang);
  transSrc = replaceTopLevelKey(transSrc, 'faq', faq, block.start, block.end);
  if (about) {
    block = findLangBlock(transSrc, lang);
    transSrc = replaceTopLevelKey(transSrc, 'about', about, block.start, block.end);
  }
  console.log(`✔ Updated ${lang}.faq${about ? ' + ' + lang + '.about' : ''}`);
}

fs.writeFileSync(TRANS, transSrc);
console.log('\nDone.');
