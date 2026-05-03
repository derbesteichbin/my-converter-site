// One-shot: rewrites the Terms of Service and Privacy Policy content in
// English (i18n.js) and German (de section of i18n-translations.js) with
// professional, GDPR-compliant copy for the German-based ConvertAnyFormat
// SaaS. Keeps the existing key structure (s1..s14 for terms; s1..s13 with
// nested labels for privacy) so Terms.jsx and Privacy.jsx render unchanged.
//
// Run from repo root:  node scripts/rewrite-legal-pages.js
//
// NOTE: Generated content is template-quality. Have a German Rechtsanwalt
// review before relying on it commercially.

const fs = require('fs');
const path = require('path');

const I18N = path.join(__dirname, '..', 'client', 'src', 'i18n.js');
const TRANS = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');

const UPDATED_DATE_EN = 'Last updated: May 2026';
const UPDATED_DATE_DE = 'Zuletzt aktualisiert: Mai 2026';

// =====================================================================
// English: Terms of Service
// =====================================================================
const enTerms = {
  title: 'Terms of Service',
  seoDesc: '{{brand}} Terms of Service. Account obligations, credit system, payments, refunds, file handling, prohibited uses, liability and German jurisdiction.',
  updated: UPDATED_DATE_EN,

  s1Title: '1. Scope and Acceptance of Terms',
  s1Body: 'These Terms of Service ("Terms") govern your use of {{brand}} (the "Service"), a web-based file conversion platform operated from Germany by Arwand Moobed Mehdiabadi, Volmerswerther Str. 346, 40221 Düsseldorf. By creating an account, completing a purchase, or using the Service in any way, you confirm that you have read, understood, and agreed to be legally bound by these Terms. If you do not agree, you must not use the Service. We may update these Terms from time to time as set out in Section 14, and continued use after changes take effect constitutes acceptance of the updated Terms.',

  s2Title: '2. Description of the Service',
  s2Body: '{{brand}} provides browser-based file conversion across more than fifty input and output formats including documents (PDF, Word, Excel, PowerPoint, OpenDocument), images (JPG, PNG, WebP, HEIC, SVG, TIFF), audio (MP3, WAV, FLAC, AAC, OGG), video (MP4, MOV, AVI, MKV, WebM) and archives (ZIP, RAR, 7Z, TAR, GZ). The Service also offers AI-powered Smart Functions including OCR text recognition, text-to-speech, speech-to-text transcription, and automatic subtitle generation. Conversion processing is carried out by our infrastructure and by trusted third-party APIs as identified in Section 12.',

  s3Title: '3. Account Registration and Security',
  s3Body: 'To use the Service you must create an account using a valid email address and a password meeting our minimum security requirements, or sign in via Google OAuth. You are solely responsible for safeguarding your login credentials and for all activity under your account. You must notify us immediately at support@convertanyformat.com if you suspect unauthorized use. You must be at least sixteen (16) years of age to register; users between 16 and 18 represent that they have the consent of a parent or legal guardian where required by their country of residence. We reserve the right to refuse registration, suspend accounts, or terminate access for users found to be in breach of these Terms.',

  s4Title: '4. Credit System',
  s4Body: 'The Service operates on a prepaid credit model. Each successful conversion deducts a defined number of credits from your balance. Standard format conversions cost one (1) credit per file. Smart Functions are priced by usage: Text-to-Speech costs one credit per 1,000 input characters (rounded up); Speech-to-Text and Auto Subtitle Generator cost one credit per five minutes of audio or video duration (rounded up). Failed conversions do not deduct credits. Credits are non-transferable, do not expire, and can only be redeemed within the Service. Bonus credits awarded through the referral program are subject to the same rules but cannot be exchanged for cash.',

  s5Title: '5. Pricing and Payments',
  s5Body: 'Credit packs are sold in three sizes: 1 credit (€0.99), 10 credits (€7.99) and 30 credits (€20.99). All prices are quoted in Euro and include applicable German Value Added Tax (currently 19%). Payments are processed exclusively by Stripe Payments Europe Ltd., an authorised payment institution; we do not store full payment card numbers. By purchasing credits you represent that you are authorized to use the payment method provided. We will issue a tax-compliant electronic invoice for each purchase. We reserve the right to modify pricing on at least thirty (30) days written notice to your registered email address.',

  s6Title: '6. Refund Policy',
  s6Body: 'As a consumer resident in the European Union you have a fourteen (14) day right of withdrawal for digital purchases under the German Fernabsatzgesetz. By purchasing credits and using any of them within the withdrawal period, you expressly waive your right of withdrawal as permitted under § 356 Abs. 5 BGB. Unused credits are refundable in full within fourteen days of purchase. To request a refund, email support@convertanyformat.com from the address associated with your account; refunds are processed to the original payment method within five to ten business days. We reserve the right to deny refund requests we reasonably believe to be made in bad faith.',

  s7Title: '7. File Size and Format Restrictions',
  s7Body: 'Maximum upload size is 200 MB per file for standard format conversions and 25 MB for Smart Functions tools (the latter is constrained by the OpenAI API). Supported input and output formats are listed on the Tools page; uploading a file in an unsupported format may result in a failed conversion for which no credits will be deducted. We reserve the right to refuse files that contain malware, exceed our infrastructure capacity, would impose disproportionate cost, or otherwise jeopardise the operation of the Service. Files we reasonably suspect to contain illegal content may be reported to competent authorities as required by law.',

  s8Title: '8. Automatic File Deletion',
  s8Body: 'All files you upload, together with the converted output we deliver, are stored only as long as necessary to provide the Service and are automatically and permanently deleted from our systems within twenty-four (24) hours of upload. Download links expire when the underlying files are deleted. We do not retain copies, backups, or thumbnails of your files beyond this window. If you require a converted file beyond this period you must download it and store it locally. Server logs that may incidentally reference filenames are retained separately under the retention rules in our Privacy Policy.',

  s9Title: '9. Prohibited Uses',
  s9Body: 'You agree not to use the Service to: (a) upload or distribute malware, viruses, or any malicious code; (b) violate any applicable law including copyright, trademark, or data-protection law; (c) attempt to gain unauthorised access to our systems, other users\' accounts, or any underlying infrastructure; (d) use automated systems, scripts, or bots to circumvent rate limits, credit pricing, or security controls; (e) upload content that is unlawful, defamatory, hateful, harassing, or that depicts minors in inappropriate contexts; (f) process content that violates the privacy or other rights of identifiable persons without their consent. Violations may result in immediate account termination, forfeiture of remaining credits without refund, and referral to competent authorities.',

  s10Title: '10. Intellectual Property',
  s10Body: 'You retain full ownership of all files you upload and of the converted output the Service produces. By uploading a file you grant us a limited, non-exclusive, royalty-free licence solely to perform the conversion you have requested; this licence terminates automatically when the file is deleted under Section 8. The {{brand}} name, logo, visual design, source code, and underlying software are our exclusive intellectual property and are protected by German copyright law and international treaties. You may not reverse-engineer, decompile, or otherwise attempt to derive the source code of the Service except to the extent expressly permitted by mandatory law (e.g. § 69d UrhG).',

  s11Title: '11. Limitation of Liability',
  s11Body: 'The Service is provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy of conversions, or uninterrupted availability. To the maximum extent permitted by German law, our total aggregate liability for any claim arising out of or relating to the Service shall not exceed the total amount you paid us in the twelve (12) months preceding the claim. We are not liable for indirect, incidental, consequential, or punitive damages including loss of data, lost profits, lost business, or business interruption. The foregoing limitations do not apply to liability for injury to life, body or health, for intentional or grossly negligent conduct, under the German Product Liability Act, or for any other liability that cannot be limited or excluded under mandatory German law.',

  s12Title: '12. Third-Party Services',
  s12Body: 'The Service relies on the following third-party providers who act as processors on our behalf under Art. 28 GDPR: Stripe Payments Europe Ltd. (payment processing), CloudConvert GmbH (file conversion processing, based in Munich, Germany), Supabase Inc. (PostgreSQL database hosting), Railway Corp. (application hosting), Resend (transactional email delivery), OpenAI Ireland Ltd. (Smart Functions powered by TTS-1 and Whisper-1), and Google LLC (Google OAuth sign-in). We have entered into Data Processing Agreements with each provider that handles personal data. Each provider operates under its own terms of service which apply alongside these Terms.',

  s13Title: '13. Governing Law and Jurisdiction',
  s13Body: 'These Terms and any non-contractual obligations arising out of or in connection with them are governed by the laws of the Federal Republic of Germany, excluding the United Nations Convention on Contracts for the International Sale of Goods. Mandatory consumer-protection provisions of the country in which you have your habitual residence remain unaffected. The exclusive place of jurisdiction for all disputes arising from or in connection with these Terms is Düsseldorf, Germany, provided you are a merchant, a legal entity under public law, or a special fund under public law. The European Commission provides an online platform for out-of-court dispute resolution at https://ec.europa.eu/consumers/odr; we are not obliged and do not commit to participate in dispute-resolution proceedings before a consumer arbitration board.',

  s14Title: '14. Changes to These Terms',
  s14Body: 'We may modify these Terms at our discretion to reflect changes in the Service, applicable law, or business operations. Material changes will be notified to your registered email address at least thirty (30) days before they take effect, and we will display a notice on the website. Non-material changes (clarifications, formatting, updates to the list of third-party providers in Section 12) take effect upon publication. Continued use of the Service after the effective date of any change constitutes acceptance of the revised Terms. If you do not accept changes you may close your account at any time from your profile page; previously deducted credits are not refundable on the basis of disagreement with policy changes.',
};

// =====================================================================
// English: Privacy Policy
// =====================================================================
const enPrivacy = {
  title: 'Privacy Policy',
  seoDesc: '{{brand}} Privacy Policy. GDPR-compliant data handling: what we collect, legal basis, retention, sub-processors, your rights, international transfers.',
  updated: UPDATED_DATE_EN,

  s1Title: '1. Data Controller',
  s1Body: 'The data controller responsible for personal data processed via {{brand}} (the "Service") is Arwand Moobed Mehdiabadi, Volmerswerther Str. 346, 40221 Düsseldorf, Germany. For all data-protection inquiries — including requests to exercise your rights under the General Data Protection Regulation (GDPR) — please contact us by email at support@convertanyformat.com. As we do not satisfy the thresholds in Art. 37 GDPR or § 38 BDSG, we are not required to appoint a Data Protection Officer; the controller handles all data-protection matters directly. This Privacy Policy explains what data we collect, why, on what legal basis, with whom we share it, how long we keep it, and what rights you have.',

  s2Title: '2. Personal Data We Collect',
  s2Account: 'Account data:',
  s2AccountBody: ' your email address, optional display name, a bcrypt hash of your password (never the password itself), Google account identifier when signing in via OAuth, account preferences (theme, language, notification settings), and a referral code if applicable.',
  s2Usage: 'Usage data:',
  s2UsageBody: ' conversion history (filename, input/output format, timestamp, status), credit balance and transaction log, tool-usage statistics, IP address, and approximate location derived from IP for fraud-prevention purposes.',
  s2Payment: 'Payment data:',
  s2PaymentBody: ' processed entirely by Stripe Payments Europe Ltd. We receive only a Stripe customer identifier, the last four digits of the card, the card brand, and a transaction confirmation. We never see or store full card numbers, CVCs, or banking credentials.',
  s2File: 'File data:',
  s2FileBody: ' the files you upload for conversion are stored only for the duration required to deliver the Service and are automatically deleted within twenty-four hours. We do not access, read, or analyse the content of your files except as strictly necessary to perform the conversion you requested.',
  s2Tech: 'Technical data:',
  s2TechBody: ' browser type and version, operating system, device type, referrer URL, language preference, and cookie identifiers. Collected automatically for security, abuse prevention, and to deliver a working Service.',

  s3Title: '3. Purposes of Processing',
  s3Body: 'We process personal data for the following purposes: (a) operating the Service, including delivering the conversions you have requested, managing your account, and accounting credit balances; (b) processing payments and issuing tax-compliant invoices through Stripe; (c) sending transactional emails such as account verification, password reset, conversion-completion notifications you have opted into, and Service-status announcements; (d) responding to support inquiries and resolving disputes; (e) analysing aggregated, non-identifying usage to improve the Service; (f) preventing fraud, abuse, and unauthorised access; and (g) complying with legal obligations including tax-record retention.',

  s4Title: '4. Legal Basis for Processing (Art. 6 GDPR)',
  s4ContractTitle: 'Contract performance (Art. 6 (1) (b)):',
  s4ContractBody: ' processing your conversions, managing your account, and operating the credit system are necessary to perform the contract you entered into when you registered or made a purchase.',
  s4InterestTitle: 'Legitimate interest (Art. 6 (1) (f)):',
  s4InterestBody: ' fraud prevention, security monitoring, abuse detection, aggregated analytics, and Service improvement. We have conducted a balancing test and considered your fundamental rights and freedoms.',
  s4ConsentTitle: 'Consent (Art. 6 (1) (a)):',
  s4ConsentBody: ' marketing emails, analytics cookies, and any optional features that go beyond strict necessity. Consent is freely given via the cookie banner or settings and may be withdrawn at any time without affecting the lawfulness of processing carried out before withdrawal.',
  s4LegalTitle: 'Legal obligation (Art. 6 (1) (c)):',
  s4LegalBody: ' retention of tax-relevant records under § 147 AO (German Fiscal Code), responding to lawful requests from competent authorities, and any other obligation imposed on us by EU or German law.',

  s5Title: '5. Cookies and Similar Technologies',
  s5EssentialTitle: 'Essential cookies:',
  s5EssentialBody: ' your authentication token (httpOnly, SameSite=Strict), theme preference, language preference, and cookie-consent state. These are strictly necessary for the Service to function and do not require consent under § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Analytics cookies:',
  s5AnalyticsBody: ' set only with your express opt-in via the cookie banner. Help us understand how the Service is used in aggregate. You can withdraw consent at any time and we will delete the corresponding cookies.',
  s5MarketingTitle: 'Marketing cookies:',
  s5MarketingBody: ' set only with your express opt-in. Used to personalise communications. You can withdraw consent at any time.',
  s5Manage: 'You can manage your cookie preferences at any time via the cookie icon in the page footer. Browser settings additionally let you block, delete, or restrict cookies — note that blocking essential cookies will prevent you from signing in or making purchases.',

  s6Title: '6. Data Sharing with Sub-Processors',
  s6Body: 'We share personal data only with the following sub-processors, each engaged under a Data Processing Agreement compliant with Art. 28 GDPR. Stripe Payments Europe Ltd. (Ireland) handles payment processing; CloudConvert GmbH (Munich, Germany) processes file conversions; Supabase Inc. (United States, transfers covered by EU Standard Contractual Clauses) hosts our PostgreSQL database; Railway Corp. (United States, SCCs) hosts our application; Resend (United States, SCCs) delivers transactional emails; OpenAI Ireland Ltd. processes Smart Functions inputs (audio/text); and Google LLC (United States, certified under the EU-US Data Privacy Framework) provides Google OAuth sign-in. We do not sell your personal data to anyone, ever, and we do not transfer data to third parties for their own marketing purposes.',

  s7Title: '7. Data Retention',
  s7Files: 'Files:',
  s7FilesBody: ' uploaded and converted files are deleted within twenty-four (24) hours of upload, regardless of whether they were downloaded.',
  s7Account: 'Account data:',
  s7AccountBody: ' retained as long as your account is active. When you delete your account, all associated data is removed within thirty (30) days, except records we are legally required to keep.',
  s7Payment: 'Payment and invoice records:',
  s7PaymentBody: ' retained for ten (10) years in accordance with § 147 AO (German Fiscal Code) for tax and accounting compliance. After this period the data is irreversibly deleted.',
  s7Logs: 'Server logs:',
  s7LogsBody: ' retained for thirty (30) days for security, abuse prevention, and incident investigation, after which they are automatically purged.',

  s8Title: '8. Your Rights Under GDPR',
  s8Intro: 'You have extensive rights regarding the personal data we process about you:',
  s8Access: 'Right of access (Art. 15):',
  s8AccessBody: ' you may request confirmation of whether we process your data and a copy of that data.',
  s8Rect: 'Right to rectification (Art. 16):',
  s8RectBody: ' you may correct inaccurate data directly via your profile page or by contacting us.',
  s8Erase: 'Right to erasure / "right to be forgotten" (Art. 17):',
  s8EraseBody: ' you may request deletion of your account and all associated personal data, subject to legal retention obligations such as tax records.',
  s8Port: 'Right to data portability (Art. 20):',
  s8PortBody: ' you may request a copy of your data in a structured, commonly used, machine-readable format.',
  s8Restrict: 'Right to restriction of processing (Art. 18):',
  s8RestrictBody: ' you may request that we restrict processing of your data while we resolve a dispute, correct an inaccuracy, or assess a legal claim.',
  s8Object: 'Right to object (Art. 21):',
  s8ObjectBody: ' you may object to processing carried out on the basis of legitimate interest, including profiling. We will stop unless we can demonstrate compelling legitimate grounds that override your interests.',
  s8Withdraw: 'Right to withdraw consent (Art. 7):',
  s8WithdrawBody: ' for any processing based on consent, you may withdraw at any time without affecting the lawfulness of processing carried out before withdrawal.',
  s8Outro: 'To exercise any of these rights, email support@convertanyformat.com from the address associated with your account. We will respond within one month, extendable by two further months for complex requests as permitted by Art. 12 (3) GDPR. Exercising your rights is free of charge.',

  s9Title: '9. Data Security',
  s9Body: 'We protect your personal data using industry-standard technical and organisational measures: TLS 1.2+ encryption for all data in transit; bcrypt password hashing with a cost factor of 10 or higher; httpOnly session cookies with the SameSite=Strict attribute; principle of least privilege for internal access including audit logging; regular dependency updates to address known vulnerabilities; rate limiting and input validation to prevent abuse; and infrastructure hosted by providers with recognised certifications (ISO 27001, SOC 2). In the event of a personal-data breach affecting your rights and freedoms we will notify the competent supervisory authority within 72 hours and inform affected users without undue delay, in accordance with Art. 33-34 GDPR.',

  s10Title: '10. International Data Transfers',
  s10Body: 'Some of our sub-processors are based outside the European Economic Area, principally in the United States. For each such transfer we have implemented appropriate safeguards required by Chapter V GDPR. Transfers to Stripe (Ireland) and CloudConvert (Germany) remain within the EEA. Transfers to Supabase, Railway, Resend, and OpenAI (United States) are governed by the European Commission\'s Standard Contractual Clauses (Module 2: controller-to-processor) supplemented by additional technical safeguards including encryption in transit and at rest. Google LLC is additionally certified under the EU-US Data Privacy Framework, providing an adequate level of protection within the meaning of Art. 45 GDPR.',

  s11Title: '11. Children\'s Privacy',
  s11Body: 'The Service is not directed at children under sixteen (16) and we do not knowingly collect personal data from children under that age. If you are a parent or legal guardian and believe a child under 16 has provided us with personal data, please contact us at support@convertanyformat.com and we will take steps to delete that data promptly. Users between 16 and 18 represent that they have the consent of a parent or legal guardian where required by their country of residence.',

  s12Title: '12. Changes to This Privacy Policy',
  s12Body: 'We may update this Privacy Policy from time to time to reflect changes in our practices, the technologies we use, applicable legal requirements, or other operational factors. Material changes will be notified to your registered email address at least thirty (30) days before they take effect. Non-material changes (typo corrections, formatting, clarifying additions) take effect upon publication. The "Last updated" date at the top of this page indicates when the Policy was last revised. Continued use of the Service after the effective date of any change constitutes acceptance of the revised Policy.',

  s13Title: '13. Contact and Right to Lodge a Complaint',
  s13Body: 'For data-protection inquiries, requests to exercise your GDPR rights, or any other privacy-related concern, please email support@convertanyformat.com. We aim to respond within one month. Without prejudice to any other administrative or judicial remedy, you have the right under Art. 77 GDPR to lodge a complaint with the supervisory authority of the EU member state where you reside, work, or where the alleged infringement occurred. The competent supervisory authority for {{brand}} is the Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// German: Nutzungsbedingungen
// =====================================================================
const deTerms = {
  title: 'Nutzungsbedingungen',
  seoDesc: '{{brand}} Nutzungsbedingungen. Kontoverpflichtungen, Credit-System, Zahlungen, Rückerstattungen, Dateibehandlung, verbotene Nutzung, Haftung und deutscher Gerichtsstand.',
  updated: UPDATED_DATE_DE,

  s1Title: '1. Geltungsbereich und Annahme der Bedingungen',
  s1Body: 'Diese Nutzungsbedingungen ("Bedingungen") regeln Ihre Nutzung von {{brand}} (der "Dienst"), einer browserbasierten Plattform für Dateikonvertierungen, die aus Deutschland von Arwand Moobed Mehdiabadi, Volmerswerther Str. 346, 40221 Düsseldorf, betrieben wird. Mit der Erstellung eines Kontos, dem Abschluss eines Kaufs oder der sonstigen Nutzung des Dienstes bestätigen Sie, dass Sie diese Bedingungen gelesen, verstanden und akzeptiert haben. Wenn Sie nicht einverstanden sind, dürfen Sie den Dienst nicht nutzen. Wir können diese Bedingungen gemäß Abschnitt 14 von Zeit zu Zeit aktualisieren; die fortgesetzte Nutzung nach Inkrafttreten von Änderungen gilt als Zustimmung zu den geänderten Bedingungen.',

  s2Title: '2. Beschreibung des Dienstes',
  s2Body: '{{brand}} bietet browserbasierte Dateikonvertierung in über fünfzig Eingabe- und Ausgabeformaten, darunter Dokumente (PDF, Word, Excel, PowerPoint, OpenDocument), Bilder (JPG, PNG, WebP, HEIC, SVG, TIFF), Audio (MP3, WAV, FLAC, AAC, OGG), Video (MP4, MOV, AVI, MKV, WebM) und Archive (ZIP, RAR, 7Z, TAR, GZ). Der Dienst bietet zudem KI-gestützte Smart Functions wie OCR-Texterkennung, Text-zu-Sprache, Sprache-zu-Text-Transkription und automatische Untertitelgenerierung. Die Konvertierung erfolgt durch unsere Infrastruktur sowie über vertrauenswürdige Drittanbieter-APIs gemäß Abschnitt 12. Wir bemühen uns um eine möglichst hohe Verfügbarkeit des Dienstes, übernehmen jedoch keine Gewähr für eine ununterbrochene oder fehlerfreie Verfügbarkeit. Wartungsfenster, technische Störungen oder Ausfälle bei Drittanbietern können zu vorübergehenden Beeinträchtigungen führen. Über geplante Wartungen, die längere Auswirkungen haben, informieren wir nach Möglichkeit vorab per Hinweis auf der Website.',

  s3Title: '3. Kontoregistrierung und Sicherheit',
  s3Body: 'Zur Nutzung des Dienstes müssen Sie ein Konto mit einer gültigen E-Mail-Adresse und einem Passwort, das unsere Mindestsicherheitsanforderungen erfüllt, anlegen oder sich über Google OAuth anmelden. Sie sind allein für die Sicherheit Ihrer Anmeldedaten und für alle Aktivitäten unter Ihrem Konto verantwortlich. Bei Verdacht auf unbefugte Nutzung müssen Sie uns unverzüglich unter support@convertanyformat.com benachrichtigen. Sie müssen mindestens sechzehn (16) Jahre alt sein, um sich zu registrieren; Nutzer zwischen 16 und 18 Jahren erklären, dass sie die nach dem Recht ihres Wohnsitzlandes erforderliche Zustimmung eines Erziehungsberechtigten haben. Wir behalten uns das Recht vor, Registrierungen abzulehnen, Konten zu sperren oder den Zugang zu kündigen, wenn Nutzer gegen diese Bedingungen verstoßen.',

  s4Title: '4. Credit-System',
  s4Body: 'Der Dienst arbeitet mit einem Prepaid-Credit-Modell. Jede erfolgreiche Konvertierung verbraucht eine festgelegte Anzahl von Credits. Standard-Formatkonvertierungen kosten ein (1) Credit pro Datei. Smart Functions werden nutzungsbasiert abgerechnet: Text-zu-Sprache kostet einen Credit pro 1.000 Eingabezeichen (aufgerundet); Sprache-zu-Text und der automatische Untertitelgenerator kosten einen Credit pro fünf Minuten Audio- oder Videodauer (aufgerundet). Fehlgeschlagene Konvertierungen verbrauchen keine Credits. Credits sind nicht übertragbar, verfallen nicht und können nur innerhalb des Dienstes eingelöst werden. Bonus-Credits aus dem Empfehlungsprogramm unterliegen denselben Regeln, können aber nicht in Bargeld umgewandelt werden.',

  s5Title: '5. Preise und Zahlungen',
  s5Body: 'Credit-Pakete werden in drei Größen angeboten: 1 Credit (0,99 €), 10 Credits (7,99 €) und 30 Credits (20,99 €). Alle Preise verstehen sich in Euro und enthalten die anwendbare deutsche Umsatzsteuer (derzeit 19 %). Zahlungen werden ausschließlich von Stripe Payments Europe Ltd. abgewickelt, einem zugelassenen Zahlungsdienstleister; wir speichern keine vollständigen Kartennummern. Mit dem Kauf von Credits erklären Sie, zur Nutzung des angegebenen Zahlungsmittels berechtigt zu sein. Für jeden Kauf stellen wir eine ordnungsgemäße elektronische Rechnung aus, die Sie über Ihr Profil herunterladen können. Akzeptierte Zahlungsmittel umfassen üblicherweise gängige Kredit- und Debitkarten sowie SEPA-Lastschrift, abhängig von Ihrer Region und der Verfügbarkeit bei Stripe. Wir behalten uns vor, Preise mit einer Frist von mindestens dreißig (30) Tagen per E-Mail an Ihre registrierte Adresse zu ändern; bereits gekaufte Credits behalten ihren ursprünglichen Wert und sind von Preisänderungen nicht betroffen.',

  s6Title: '6. Rückerstattungsrichtlinie',
  s6Body: 'Als Verbraucher mit Wohnsitz in der Europäischen Union haben Sie nach dem deutschen Fernabsatzgesetz ein vierzehntägiges Widerrufsrecht für digitale Käufe. Wenn Sie Credits kaufen und innerhalb der Widerrufsfrist verbrauchen, verzichten Sie ausdrücklich auf Ihr Widerrufsrecht, wie es § 356 Abs. 5 BGB zulässt. Nicht verbrauchte Credits sind innerhalb von vierzehn Tagen nach Kauf voll erstattungsfähig. Erstattungsanträge senden Sie bitte per E-Mail an support@convertanyformat.com von der mit Ihrem Konto verknüpften Adresse; Erstattungen werden innerhalb von fünf bis zehn Werktagen auf das ursprüngliche Zahlungsmittel zurückerstattet. Anträge, die wir nach billigem Ermessen für missbräuchlich halten, können wir ablehnen.',

  s7Title: '7. Dateigröße und Formatbeschränkungen',
  s7Body: 'Die maximale Uploadgröße beträgt 200 MB pro Datei für Standardkonvertierungen und 25 MB für Smart-Functions-Werkzeuge (letzteres ist durch die OpenAI-API begrenzt). Unterstützte Eingabe- und Ausgabeformate sind auf der Werkzeuge-Seite aufgeführt; das Hochladen einer Datei in einem nicht unterstützten Format kann zu einer fehlgeschlagenen Konvertierung führen, für die keine Credits abgezogen werden. Wir behalten uns vor, Dateien abzulehnen, die Schadsoftware enthalten, unsere Infrastrukturkapazität überschreiten, einen unverhältnismäßigen Aufwand verursachen würden oder den Betrieb des Dienstes anderweitig gefährden. Dateien, die wir berechtigterweise als rechtswidrig einstufen, können wir den zuständigen Behörden melden, soweit gesetzlich vorgeschrieben.',

  s8Title: '8. Automatische Dateilöschung',
  s8Body: 'Alle von Ihnen hochgeladenen Dateien sowie die ausgegebene Konvertierung werden nur so lange gespeichert, wie für die Erbringung des Dienstes erforderlich, und werden innerhalb von vierundzwanzig (24) Stunden nach dem Hochladen automatisch und dauerhaft aus unseren Systemen gelöscht. Download-Links verfallen, sobald die zugrundeliegenden Dateien gelöscht sind. Wir behalten weder Kopien noch Backups oder Vorschaubilder Ihrer Dateien über diesen Zeitraum hinaus auf. Wenn Sie eine konvertierte Datei länger benötigen, müssen Sie sie selbst herunterladen und lokal speichern. Server-Logs, in denen Dateinamen erscheinen können, unterliegen den Aufbewahrungsregeln unserer Datenschutzerklärung.',

  s9Title: '9. Verbotene Nutzung',
  s9Body: 'Sie verpflichten sich, den Dienst nicht zu nutzen, um: (a) Schadsoftware, Viren oder schädlichen Code hochzuladen oder zu verbreiten; (b) gegen geltendes Recht zu verstoßen, einschließlich Urheber-, Marken- oder Datenschutzrechts; (c) sich unbefugten Zugang zu unseren Systemen, fremden Konten oder zugrundeliegender Infrastruktur zu verschaffen; (d) automatisierte Systeme, Skripte oder Bots einzusetzen, um Ratenbegrenzungen, Credit-Preise oder Sicherheitsmaßnahmen zu umgehen; (e) rechtswidrige, verleumderische, hasserfüllte, belästigende Inhalte oder Inhalte, die Minderjährige unangemessen darstellen, hochzuladen; (f) Inhalte zu verarbeiten, die ohne Einwilligung der Betroffenen deren Persönlichkeitsrechte verletzen. Verstöße können zur sofortigen Kündigung des Kontos, zum Verfall verbleibender Credits ohne Erstattung und zur Meldung an zuständige Behörden führen.',

  s10Title: '10. Geistiges Eigentum',
  s10Body: 'Sie behalten das vollständige Eigentum an allen von Ihnen hochgeladenen Dateien und an der vom Dienst erzeugten Ausgabe. Mit dem Hochladen gewähren Sie uns ein einfaches, unentgeltliches und auf die Erbringung der von Ihnen angeforderten Konvertierung beschränktes Nutzungsrecht; dieses Recht endet automatisch mit der Löschung der Datei gemäß Abschnitt 8. Name, Logo, Designs, Quellcode und zugrundeliegende Software von {{brand}} sind unser ausschließliches geistiges Eigentum und nach deutschem Urheberrecht und internationalen Verträgen geschützt. Eine Dekompilierung, Disassemblierung oder ein sonstiger Versuch, den Quellcode des Dienstes abzuleiten, ist nur in dem Umfang gestattet, in dem zwingendes Recht (z. B. § 69d UrhG) dies erlaubt.',

  s11Title: '11. Haftungsbeschränkung',
  s11Body: 'Der Dienst wird "wie besehen" und "soweit verfügbar" ohne ausdrückliche oder stillschweigende Gewährleistungen jeglicher Art bereitgestellt, insbesondere ohne Gewährleistung der Marktgängigkeit, Eignung für einen bestimmten Zweck, Genauigkeit der Konvertierungen oder ununterbrochenen Verfügbarkeit. Soweit nach deutschem Recht zulässig, ist unsere Gesamthaftung für Ansprüche aus oder im Zusammenhang mit dem Dienst auf den Betrag begrenzt, den Sie in den zwölf (12) Monaten vor dem Anspruch an uns gezahlt haben. Wir haften nicht für mittelbare, zufällige, Folge- oder Strafschäden, einschließlich Datenverlust, entgangenem Gewinn oder Geschäftsunterbrechung. Wir empfehlen ausdrücklich, von wichtigen Originaldateien stets eigene Sicherungskopien anzufertigen, bevor Sie diese in den Dienst hochladen. Eine Konvertierung kann formatbedingt zu Qualitätsverlusten oder Layoutänderungen führen; Sie sind selbst dafür verantwortlich, das Ergebnis vor weiterer Verwendung zu prüfen. Diese Beschränkungen gelten nicht für die Haftung bei Verletzung von Leben, Körper oder Gesundheit, bei Vorsatz oder grober Fahrlässigkeit, nach dem Produkthaftungsgesetz oder bei sonstiger zwingend nicht ausschließbarer Haftung. Bei einer Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) ist unsere Haftung auf den vorhersehbaren, vertragstypischen Schaden begrenzt.',

  s12Title: '12. Drittanbieter',
  s12Body: 'Der Dienst stützt sich auf folgende Drittanbieter, die als Auftragsverarbeiter im Sinne von Art. 28 DSGVO für uns tätig sind: Stripe Payments Europe Ltd. (Zahlungsabwicklung), CloudConvert GmbH (Konvertierungsverarbeitung, Sitz in München), Supabase Inc. (PostgreSQL-Datenbank-Hosting), Railway Corp. (Anwendungs-Hosting), Resend (Versand transaktionaler E-Mails), OpenAI Ireland Ltd. (Smart Functions auf Basis von TTS-1 und Whisper-1) sowie Google LLC (Google-OAuth-Anmeldung). Mit jedem Anbieter, der personenbezogene Daten verarbeitet, haben wir Auftragsverarbeitungsverträge geschlossen. Es gelten zusätzlich die jeweiligen Bedingungen der Anbieter.',

  s13Title: '13. Anwendbares Recht und Gerichtsstand',
  s13Body: 'Diese Bedingungen sowie alle außervertraglichen Verpflichtungen aus oder im Zusammenhang mit ihnen unterliegen dem Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Zwingende Verbraucherschutzbestimmungen des Landes Ihres gewöhnlichen Aufenthalts bleiben unberührt. Ausschließlicher Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesen Bedingungen ist Düsseldorf, Deutschland, sofern Sie Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen sind. Die Europäische Kommission stellt eine Plattform zur außergerichtlichen Streitbeilegung unter https://ec.europa.eu/consumers/odr bereit; wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',

  s14Title: '14. Änderungen dieser Bedingungen',
  s14Body: 'Wir können diese Bedingungen nach billigem Ermessen ändern, um Änderungen des Dienstes, des geltenden Rechts oder unseres Geschäftsbetriebs Rechnung zu tragen. Wesentliche Änderungen werden mindestens dreißig (30) Tage vor Inkrafttreten an Ihre registrierte E-Mail-Adresse mitgeteilt; ein entsprechender Hinweis wird auf der Website veröffentlicht. Nicht wesentliche Änderungen (Klarstellungen, Formatierung, Aktualisierung der Liste der Drittanbieter in Abschnitt 12) treten mit Veröffentlichung in Kraft. Die fortgesetzte Nutzung des Dienstes nach Wirksamwerden einer Änderung gilt als Zustimmung zu den geänderten Bedingungen. Wenn Sie Änderungen ablehnen, können Sie Ihr Konto jederzeit über Ihre Profilseite löschen; bereits abgezogene Credits sind nicht aufgrund einer Ablehnung von Richtlinienänderungen erstattungsfähig.',
};

// =====================================================================
// German: Datenschutzerklärung
// =====================================================================
const dePrivacy = {
  title: 'Datenschutzerklärung',
  seoDesc: '{{brand}} Datenschutzerklärung. DSGVO-konformer Datenumgang: Welche Daten wir erheben, Rechtsgrundlagen, Aufbewahrung, Auftragsverarbeiter, Ihre Rechte, Drittlandtransfers.',
  updated: UPDATED_DATE_DE,

  s1Title: '1. Verantwortlicher',
  s1Body: 'Verantwortlicher für die über {{brand}} (den "Dienst") verarbeiteten personenbezogenen Daten ist Arwand Moobed Mehdiabadi, Volmerswerther Str. 346, 40221 Düsseldorf, Deutschland. Für sämtliche datenschutzrechtlichen Anliegen — einschließlich der Geltendmachung Ihrer Rechte nach der Datenschutz-Grundverordnung (DSGVO) — erreichen Sie uns per E-Mail unter support@convertanyformat.com. Da wir die Schwellen nach Art. 37 DSGVO bzw. § 38 BDSG nicht erreichen, sind wir nicht verpflichtet, einen Datenschutzbeauftragten zu bestellen; der Verantwortliche bearbeitet Datenschutzanliegen unmittelbar selbst. Diese Datenschutzerklärung erläutert, welche Daten wir erheben, zu welchem Zweck und auf welcher Rechtsgrundlage, mit wem wir sie teilen, wie lange wir sie aufbewahren und welche Rechte Ihnen zustehen.',

  s2Title: '2. Welche personenbezogenen Daten wir erheben',
  s2Account: 'Kontodaten:',
  s2AccountBody: ' Ihre E-Mail-Adresse, optionaler Anzeigename, ein bcrypt-Hash Ihres Passworts (niemals das Passwort selbst), bei OAuth-Anmeldung der Google-Konto-Identifier, Kontoeinstellungen (Theme, Sprache, Benachrichtigungen) sowie ggf. ein Empfehlungscode.',
  s2Usage: 'Nutzungsdaten:',
  s2UsageBody: ' Konvertierungshistorie (Dateiname, Eingangs-/Ausgangsformat, Zeitstempel, Status), Credit-Saldo und Transaktionsprotokoll, Werkzeug-Nutzungsstatistik, IP-Adresse sowie ein aus der IP abgeleiteter ungefährer Standort zu Zwecken der Betrugsprävention.',
  s2Payment: 'Zahlungsdaten:',
  s2PaymentBody: ' werden vollständig von Stripe Payments Europe Ltd. verarbeitet. Wir erhalten lediglich eine Stripe-Kunden-ID, die letzten vier Stellen der Karte, die Kartenmarke und eine Transaktionsbestätigung. Vollständige Kartennummern, CVCs oder Bankzugangsdaten sehen oder speichern wir nicht.',
  s2File: 'Dateidaten:',
  s2FileBody: ' Die zur Konvertierung hochgeladenen Dateien werden nur für die zur Erbringung des Dienstes erforderliche Dauer gespeichert und automatisch innerhalb von vierundzwanzig Stunden gelöscht. Wir greifen nicht auf den Inhalt Ihrer Dateien zu, lesen ihn nicht und analysieren ihn nicht, soweit dies nicht zur Durchführung der von Ihnen angeforderten Konvertierung zwingend erforderlich ist.',
  s2Tech: 'Technische Daten:',
  s2TechBody: ' Browsertyp und -version, Betriebssystem, Gerätetyp, Referrer-URL, Spracheinstellung und Cookie-Identifier. Diese werden automatisch zu Zwecken der Sicherheit, Missbrauchsprävention und zur Bereitstellung eines funktionsfähigen Dienstes erhoben.',

  s3Title: '3. Zwecke der Verarbeitung',
  s3Body: 'Wir verarbeiten personenbezogene Daten zu folgenden Zwecken: (a) Bereitstellung und Betrieb des Dienstes einschließlich der von Ihnen angeforderten Konvertierungen, Kontoverwaltung und Credit-Buchhaltung; (b) Abwicklung von Zahlungen und Ausstellung steuerkonformer Rechnungen über Stripe; (c) Versand transaktionaler E-Mails wie Kontobestätigung, Passwort-Zurücksetzung, opt-in Benachrichtigungen über abgeschlossene Konvertierungen und Service-Statusmeldungen; (d) Bearbeitung von Support-Anfragen und Streitbeilegung; (e) aggregierte, nicht personenbezogene Auswertung der Nutzung zur Verbesserung des Dienstes; (f) Prävention von Betrug, Missbrauch und unbefugtem Zugriff; (g) Erfüllung gesetzlicher Pflichten einschließlich steuerlicher Aufbewahrungsfristen.',

  s4Title: '4. Rechtsgrundlagen der Verarbeitung (Art. 6 DSGVO)',
  s4ContractTitle: 'Vertragserfüllung (Art. 6 Abs. 1 lit. b):',
  s4ContractBody: ' Die Verarbeitung Ihrer Konvertierungen, die Verwaltung Ihres Kontos und der Betrieb des Credit-Systems sind erforderlich zur Erfüllung des mit der Registrierung oder dem Kauf geschlossenen Vertrags.',
  s4InterestTitle: 'Berechtigtes Interesse (Art. 6 Abs. 1 lit. f):',
  s4InterestBody: ' Betrugsprävention, Sicherheitsüberwachung, Missbrauchserkennung, aggregierte Analytik und die Verbesserung des Dienstes. Wir haben eine Interessenabwägung durchgeführt und Ihre Grundrechte und Grundfreiheiten berücksichtigt.',
  s4ConsentTitle: 'Einwilligung (Art. 6 Abs. 1 lit. a):',
  s4ConsentBody: ' Marketing-E-Mails, Analytics-Cookies und sämtliche optionale Funktionen, die über das technisch Erforderliche hinausgehen. Die Einwilligung wird über das Cookie-Banner oder die Einstellungen freiwillig erteilt und kann jederzeit ohne Auswirkung auf die Rechtmäßigkeit zuvor erfolgter Verarbeitung widerrufen werden.',
  s4LegalTitle: 'Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c):',
  s4LegalBody: ' Aufbewahrung steuerrelevanter Unterlagen nach § 147 AO, Beantwortung rechtmäßiger Anfragen zuständiger Behörden und sonstige Verpflichtungen aus EU- und deutschem Recht.',

  s5Title: '5. Cookies und ähnliche Technologien',
  s5EssentialTitle: 'Essentielle Cookies:',
  s5EssentialBody: ' Ihr Authentifizierungs-Token (httpOnly, SameSite=Strict), Theme-Einstellung, Spracheinstellung und Cookie-Zustimmungsstatus. Diese sind für den Betrieb des Dienstes zwingend erforderlich und nicht zustimmungspflichtig nach § 25 Abs. 2 TTDSG.',
  s5AnalyticsTitle: 'Analyse-Cookies:',
  s5AnalyticsBody: ' werden nur mit Ihrer ausdrücklichen Einwilligung über das Cookie-Banner gesetzt. Sie helfen uns, die Nutzung des Dienstes in aggregierter Form zu verstehen. Sie können Ihre Einwilligung jederzeit widerrufen; die zugehörigen Cookies werden dann gelöscht.',
  s5MarketingTitle: 'Marketing-Cookies:',
  s5MarketingBody: ' werden nur mit Ihrer ausdrücklichen Einwilligung gesetzt und dienen der personalisierten Kommunikation. Sie können Ihre Einwilligung jederzeit widerrufen.',
  s5Manage: 'Sie können Ihre Cookie-Einstellungen jederzeit über das Cookie-Symbol im Seitenfuß verwalten. Auch über Ihre Browser-Einstellungen können Sie Cookies blockieren, löschen oder einschränken — beachten Sie jedoch, dass das Blockieren essentieller Cookies Anmeldung und Käufe verhindert.',

  s6Title: '6. Datenweitergabe an Auftragsverarbeiter',
  s6Body: 'Wir geben personenbezogene Daten ausschließlich an die folgenden Auftragsverarbeiter weiter, mit denen jeweils ein Auftragsverarbeitungsvertrag im Sinne von Art. 28 DSGVO besteht. Stripe Payments Europe Ltd. (Irland) wickelt Zahlungen ab; CloudConvert GmbH (München, Deutschland) verarbeitet Konvertierungen; Supabase Inc. (USA, Übermittlung über EU-Standardvertragsklauseln) hostet unsere PostgreSQL-Datenbank; Railway Corp. (USA, SCC) hostet unsere Anwendung; Resend (USA, SCC) versendet transaktionale E-Mails; OpenAI Ireland Ltd. verarbeitet Smart-Functions-Eingaben (Audio/Text); Google LLC (USA, zertifiziert nach dem EU-US Data Privacy Framework) stellt die Google-OAuth-Anmeldung bereit. Wir verkaufen Ihre personenbezogenen Daten nicht und übermitteln sie nicht zu eigenen Marketingzwecken Dritter.',

  s7Title: '7. Datenaufbewahrung',
  s7Files: 'Dateien:',
  s7FilesBody: ' hochgeladene und konvertierte Dateien werden innerhalb von vierundzwanzig (24) Stunden nach dem Upload gelöscht, unabhängig davon, ob sie heruntergeladen wurden.',
  s7Account: 'Kontodaten:',
  s7AccountBody: ' werden für die Dauer Ihres aktiven Kontos aufbewahrt. Bei Kontolöschung werden alle zugehörigen Daten innerhalb von dreißig (30) Tagen entfernt, mit Ausnahme der Daten, die wir gesetzlich aufbewahren müssen.',
  s7Payment: 'Zahlungs- und Rechnungsdaten:',
  s7PaymentBody: ' werden gemäß § 147 AO zehn (10) Jahre lang aus steuer- und buchhalterischen Gründen aufbewahrt. Nach Ablauf dieser Frist werden die Daten unwiderruflich gelöscht.',
  s7Logs: 'Server-Logs:',
  s7LogsBody: ' werden für dreißig (30) Tage zu Zwecken der Sicherheit, Missbrauchsprävention und Vorfallsuntersuchung aufbewahrt und anschließend automatisch gelöscht.',

  s8Title: '8. Ihre Rechte nach der DSGVO',
  s8Intro: 'Ihnen stehen umfassende Rechte hinsichtlich der von uns verarbeiteten personenbezogenen Daten zu:',
  s8Access: 'Auskunftsrecht (Art. 15):',
  s8AccessBody: ' Sie können eine Bestätigung darüber verlangen, ob wir Sie betreffende Daten verarbeiten, sowie eine Kopie dieser Daten.',
  s8Rect: 'Recht auf Berichtigung (Art. 16):',
  s8RectBody: ' Sie können unrichtige Daten direkt über Ihre Profilseite oder durch Kontaktaufnahme mit uns berichtigen lassen.',
  s8Erase: 'Recht auf Löschung / "Recht auf Vergessenwerden" (Art. 17):',
  s8EraseBody: ' Sie können die Löschung Ihres Kontos und aller zugehörigen personenbezogenen Daten verlangen, vorbehaltlich gesetzlicher Aufbewahrungspflichten wie steuerrechtlicher Vorgaben.',
  s8Port: 'Recht auf Datenübertragbarkeit (Art. 20):',
  s8PortBody: ' Sie können eine Kopie Ihrer Daten in einem strukturierten, gängigen, maschinenlesbaren Format erhalten.',
  s8Restrict: 'Recht auf Einschränkung der Verarbeitung (Art. 18):',
  s8RestrictBody: ' Sie können die Einschränkung der Verarbeitung verlangen, während wir einen Streit beilegen, eine Unrichtigkeit prüfen oder einen Rechtsanspruch bewerten.',
  s8Object: 'Widerspruchsrecht (Art. 21):',
  s8ObjectBody: ' Sie können der auf berechtigtem Interesse beruhenden Verarbeitung einschließlich Profiling widersprechen. Wir stoppen die Verarbeitung, sofern wir nicht zwingende schutzwürdige Gründe nachweisen können, die Ihre Interessen überwiegen.',
  s8Withdraw: 'Recht auf Widerruf der Einwilligung (Art. 7):',
  s8WithdrawBody: ' Bei einwilligungsbasierter Verarbeitung können Sie Ihre Einwilligung jederzeit widerrufen, ohne dass die Rechtmäßigkeit der zuvor erfolgten Verarbeitung berührt wird.',
  s8Outro: 'Zur Geltendmachung dieser Rechte schreiben Sie bitte an support@convertanyformat.com von der mit Ihrem Konto verknüpften Adresse. Wir antworten innerhalb eines Monats; bei komplexen Anfragen kann sich die Frist gemäß Art. 12 Abs. 3 DSGVO um zwei weitere Monate verlängern. Die Wahrnehmung Ihrer Rechte ist für Sie kostenfrei.',

  s9Title: '9. Datensicherheit',
  s9Body: 'Wir schützen Ihre personenbezogenen Daten durch dem Stand der Technik entsprechende technische und organisatorische Maßnahmen: TLS-1.2+-Verschlüsselung aller Datenübertragungen; bcrypt-Passwort-Hashing mit einem Kostenfaktor von mindestens 10; httpOnly-Sitzungs-Cookies mit dem Attribut SameSite=Strict; Prinzip der minimalen Berechtigung intern einschließlich Audit-Logging; regelmäßige Aktualisierungen aller Abhängigkeiten zur Schließung bekannter Schwachstellen; Ratenbegrenzungen und Eingabevalidierung zur Missbrauchsabwehr; Hosting bei Anbietern mit anerkannten Zertifizierungen (ISO 27001, SOC 2). Wir trennen logisch und physisch zwischen Dateispeicher (kurzlebig, 24 Stunden) und Kontodatenbank (langlebig, verschlüsselt im Ruhezustand). Sicherheitsrelevante Vorfälle werden protokolliert und regelmäßig überprüft. Trotz aller Maßnahmen lässt sich keine über das Internet übermittelte Information mit absoluter Sicherheit schützen — wir bemühen uns um den Schutz Ihrer Daten mit kommerziell vertretbaren Mitteln, können jedoch keine absolute Sicherheit garantieren. Im Falle einer meldepflichtigen Datenschutzverletzung benachrichtigen wir die zuständige Aufsichtsbehörde innerhalb von 72 Stunden und betroffene Nutzer ohne unangemessene Verzögerung gemäß Art. 33-34 DSGVO.',

  s10Title: '10. Internationale Datenübermittlungen',
  s10Body: 'Einige unserer Auftragsverarbeiter haben ihren Sitz außerhalb des Europäischen Wirtschaftsraums, insbesondere in den Vereinigten Staaten. Für jede solche Übermittlung haben wir die nach Kapitel V DSGVO erforderlichen Garantien implementiert. Übermittlungen an Stripe (Irland) und CloudConvert (Deutschland) verbleiben innerhalb des EWR. Übermittlungen an Supabase, Railway, Resend und OpenAI (USA) erfolgen auf Grundlage der Standardvertragsklauseln der Europäischen Kommission (Modul 2: Verantwortlicher zu Auftragsverarbeiter), ergänzt um zusätzliche technische Schutzmaßnahmen wie Verschlüsselung bei Übertragung und Speicherung. Google LLC ist zusätzlich nach dem EU-US Data Privacy Framework zertifiziert und gewährleistet ein angemessenes Schutzniveau im Sinne von Art. 45 DSGVO.',

  s11Title: '11. Datenschutz für Kinder',
  s11Body: 'Der Dienst richtet sich nicht an Kinder unter sechzehn (16) Jahren, und wir erheben wissentlich keine personenbezogenen Daten von Kindern unter diesem Alter. Wenn Sie als Erziehungsberechtigte/r Kenntnis davon erlangen, dass uns ein Kind unter 16 Jahren personenbezogene Daten übermittelt hat, kontaktieren Sie uns bitte unter support@convertanyformat.com; wir werden die Daten unverzüglich löschen. Nutzer zwischen 16 und 18 Jahren erklären, dass sie die nach dem Recht ihres Wohnsitzlandes ggf. erforderliche Einwilligung eines Erziehungsberechtigten haben.',

  s12Title: '12. Änderungen dieser Datenschutzerklärung',
  s12Body: 'Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen unserer Praxis, der eingesetzten Technologien, gesetzlicher Anforderungen oder sonstiger betrieblicher Faktoren widerzuspiegeln. Wesentliche Änderungen werden mindestens dreißig (30) Tage vor Inkrafttreten an Ihre registrierte E-Mail-Adresse mitgeteilt. Nicht wesentliche Änderungen (Tippfehlerkorrekturen, Formatierung, klarstellende Ergänzungen) treten mit Veröffentlichung in Kraft. Das Datum "Zuletzt aktualisiert" am Anfang dieser Seite zeigt an, wann die Erklärung zuletzt überarbeitet wurde. Die fortgesetzte Nutzung des Dienstes nach Wirksamwerden einer Änderung gilt als Zustimmung zur überarbeiteten Erklärung.',

  s13Title: '13. Kontakt und Beschwerderecht',
  s13Body: 'Bei datenschutzrechtlichen Anfragen, Anträgen zur Geltendmachung Ihrer Rechte aus der DSGVO oder sonstigen datenschutzbezogenen Anliegen schreiben Sie bitte an support@convertanyformat.com. Wir bemühen uns um eine Antwort innerhalb eines Monats. Unbeschadet anderer verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe haben Sie nach Art. 77 DSGVO das Recht, Beschwerde bei der Aufsichtsbehörde des EU-Mitgliedstaats Ihres Wohnsitzes, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes einzulegen. Zuständige Aufsichtsbehörde für {{brand}} ist die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Replacement helpers
// =====================================================================

// Format an object literal as a multi-line indented JS source. Mirrors the
// existing two-space-indent style of i18n.js.
function formatObjectLiteral(obj, indent = '  ') {
  const inner = Object.entries(obj)
    .map(([k, v]) => `${indent}  ${k}: ${JSON.stringify(v)},`)
    .join('\n');
  return `{\n${inner}\n${indent}}`;
}

// Find a top-level (depth=0 within the section) `keyName: { ... }` block.
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
      if (depth === 0) return { start: headerStart, end: i + 1, headerLength: m[0].length };
    }
  }
  return null;
}

// Find the section block `const langName = { ... };` so we can scope edits
// to one language only.
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
i18nSrc = replaceTopLevelKey(i18nSrc, 'terms', enTerms);
i18nSrc = replaceTopLevelKey(i18nSrc, 'privacy', enPrivacy);
fs.writeFileSync(I18N, i18nSrc);
console.log('✔ Updated client/src/i18n.js (terms + privacy)');

let transSrc = fs.readFileSync(TRANS, 'utf8');
const deBlock = findLangBlock(transSrc, 'de');
transSrc = replaceTopLevelKey(transSrc, 'terms', deTerms, deBlock.start, deBlock.end);
// recompute scope after first replacement (length changed)
const deBlock2 = findLangBlock(transSrc, 'de');
transSrc = replaceTopLevelKey(transSrc, 'privacy', dePrivacy, deBlock2.start, deBlock2.end);
fs.writeFileSync(TRANS, transSrc);
console.log('✔ Updated client/src/i18n-translations.js (de.terms + de.privacy)');

const wc = (s) => s.split(/\s+/).filter(Boolean).length;
const enTermsWc = Object.values(enTerms).map((v) => typeof v === 'string' ? wc(v) : 0).reduce((a, b) => a + b, 0);
const enPrivacyWc = Object.values(enPrivacy).map((v) => typeof v === 'string' ? wc(v) : 0).reduce((a, b) => a + b, 0);
const deTermsWc = Object.values(deTerms).map((v) => typeof v === 'string' ? wc(v) : 0).reduce((a, b) => a + b, 0);
const dePrivacyWc = Object.values(dePrivacy).map((v) => typeof v === 'string' ? wc(v) : 0).reduce((a, b) => a + b, 0);
console.log(`\nWord counts:`);
console.log(`  EN Terms:    ${enTermsWc}`);
console.log(`  EN Privacy:  ${enPrivacyWc}`);
console.log(`  DE Terms:    ${deTermsWc}`);
console.log(`  DE Privacy:  ${dePrivacyWc}`);
