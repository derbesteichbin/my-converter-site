// One-shot: adds a `toolDescriptions` section to the EN source (i18n.js)
// and to each of de/fr/es/it/pt/nl/pl/sv/no in i18n-translations.js.
// 59 tool slugs × 10 languages = 590 description strings.
//
// Run from repo root:  node scripts/add-tool-descriptions.js

const fs = require('fs');
const path = require('path');

const I18N_EN = path.join(__dirname, '..', 'client', 'src', 'i18n.js');
const I18N_TRANS = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');

// Each entry is [slug, en, de, fr, es, it, pt, nl, pl, sv, no].
const ROWS = [
  // ── Document ──
  ['pdf-to-word',
    'Convert your PDF documents to fully editable Word files. Perfect for editing scanned documents, contracts, or any PDF you need to modify in Microsoft Word.',
    'Konvertiere deine PDF-Dokumente in vollständig bearbeitbare Word-Dateien. Ideal zum Bearbeiten gescannter Dokumente, Verträge oder jeder PDF, die du in Microsoft Word ändern möchtest.',
    'Convertissez vos documents PDF en fichiers Word entièrement modifiables. Parfait pour éditer des documents numérisés, des contrats ou tout PDF que vous devez modifier dans Microsoft Word.',
    'Convierte tus documentos PDF en archivos de Word totalmente editables. Perfecto para editar documentos escaneados, contratos o cualquier PDF que necesites modificar en Microsoft Word.',
    'Converti i tuoi documenti PDF in file Word completamente modificabili. Perfetto per modificare documenti scansionati, contratti o qualsiasi PDF da rivedere in Microsoft Word.',
    'Converta seus documentos PDF em ficheiros Word totalmente editáveis. Perfeito para editar documentos digitalizados, contratos ou qualquer PDF que precise de modificar no Microsoft Word.',
    'Converteer je PDF-documenten naar volledig bewerkbare Word-bestanden. Perfect voor het bewerken van gescande documenten, contracten of elke PDF die je in Microsoft Word wilt aanpassen.',
    'Konwertuj dokumenty PDF na w pełni edytowalne pliki Word. Idealne do edycji zeskanowanych dokumentów, umów lub dowolnego pliku PDF, który chcesz zmodyfikować w Microsoft Word.',
    'Konvertera dina PDF-dokument till helt redigerbara Word-filer. Perfekt för att redigera skannade dokument, kontrakt eller PDF-filer du behöver ändra i Microsoft Word.',
    'Konverter PDF-dokumentene dine til fullt redigerbare Word-filer. Perfekt for å redigere skannede dokumenter, kontrakter eller enhver PDF du trenger å endre i Microsoft Word.'],

  ['word-to-pdf',
    'Convert Word documents to PDF format with preserved formatting, fonts, and layout. Ideal for sharing finalized documents that look identical on every device.',
    'Konvertiere Word-Dokumente in PDF mit beibehaltener Formatierung, Schriftarten und Layout. Ideal zum Teilen fertiger Dokumente, die auf jedem Gerät gleich aussehen.',
    'Convertissez des documents Word en PDF avec mise en forme, polices et mise en page préservées. Idéal pour partager des documents finalisés qui s\'affichent à l\'identique sur tous les appareils.',
    'Convierte documentos de Word a PDF conservando formato, fuentes y diseño. Ideal para compartir documentos finales que se ven igual en cualquier dispositivo.',
    'Converti documenti Word in PDF mantenendo formattazione, font e layout. Ideale per condividere documenti finali che appaiono identici su ogni dispositivo.',
    'Converta documentos Word em PDF mantendo formatação, tipos de letra e disposição. Ideal para partilhar documentos finalizados que parecem iguais em qualquer dispositivo.',
    'Converteer Word-documenten naar PDF met behoud van opmaak, lettertypen en lay-out. Ideaal voor het delen van afgewerkte documenten die er op elk apparaat hetzelfde uitzien.',
    'Konwertuj dokumenty Word na PDF z zachowaniem formatowania, czcionek i układu. Idealne do udostępniania ukończonych dokumentów, które wyglądają identycznie na każdym urządzeniu.',
    'Konvertera Word-dokument till PDF med bevarad formatering, typsnitt och layout. Idealiskt för att dela färdiga dokument som ser identiska ut på alla enheter.',
    'Konverter Word-dokumenter til PDF med bevart formatering, skrifter og layout. Ideelt for å dele ferdige dokumenter som ser identiske ut på alle enheter.'],

  ['pdf-to-excel',
    'Extract tables and data from your PDFs into editable Excel spreadsheets. Saves hours of manual retyping for reports, invoices, and statements.',
    'Extrahiere Tabellen und Daten aus deinen PDFs in bearbeitbare Excel-Tabellen. Spart Stunden manueller Eingabe bei Berichten, Rechnungen und Auszügen.',
    'Extrayez les tableaux et données de vos PDF vers des feuilles Excel modifiables. Vous économise des heures de ressaisie pour les rapports, factures et relevés.',
    'Extrae tablas y datos de tus PDF a hojas de cálculo Excel editables. Te ahorra horas de transcripción manual para informes, facturas y estados de cuenta.',
    'Estrai tabelle e dati dai tuoi PDF in fogli Excel modificabili. Risparmia ore di inserimento manuale per report, fatture ed estratti conto.',
    'Extraia tabelas e dados dos seus PDFs para folhas Excel editáveis. Poupa horas de digitação manual em relatórios, faturas e extratos.',
    'Extraheer tabellen en gegevens uit je PDF\'s naar bewerkbare Excel-bestanden. Bespaart uren handmatig overtypen van rapporten, facturen en afschriften.',
    'Wyodrębnij tabele i dane z plików PDF do edytowalnych arkuszy Excel. Oszczędza godzin ręcznego przepisywania raportów, faktur i wyciągów.',
    'Extrahera tabeller och data från dina PDF-filer till redigerbara Excel-ark. Sparar timmar av manuell inmatning för rapporter, fakturor och kontoutdrag.',
    'Hent ut tabeller og data fra PDF-ene dine til redigerbare Excel-ark. Sparer timer med manuell inntasting av rapporter, fakturaer og kontoutskrifter.'],

  ['excel-to-pdf',
    'Convert Excel spreadsheets to PDF for easy sharing and printing. Preserves formulas, charts, and formatting in a universally readable format.',
    'Konvertiere Excel-Tabellen in PDF zum einfachen Teilen und Drucken. Behält Formeln, Diagramme und Formatierung in einem universell lesbaren Format bei.',
    'Convertissez des feuilles Excel en PDF pour faciliter le partage et l\'impression. Préserve les formules, graphiques et mise en forme dans un format universellement lisible.',
    'Convierte hojas de Excel a PDF para compartir e imprimir fácilmente. Conserva fórmulas, gráficos y formato en un archivo legible en cualquier sistema.',
    'Converti fogli Excel in PDF per una condivisione e stampa facili. Mantiene formule, grafici e formattazione in un formato leggibile ovunque.',
    'Converta folhas de Excel em PDF para partilha e impressão fáceis. Preserva fórmulas, gráficos e formatação num formato universalmente legível.',
    'Converteer Excel-spreadsheets naar PDF voor eenvoudig delen en afdrukken. Behoudt formules, grafieken en opmaak in een universeel leesbaar formaat.',
    'Konwertuj arkusze Excela na PDF dla łatwego udostępniania i drukowania. Zachowuje formuły, wykresy i formatowanie w uniwersalnym formacie.',
    'Konvertera Excel-ark till PDF för enkel delning och utskrift. Bevarar formler, diagram och formatering i ett universellt läsbart format.',
    'Konverter Excel-regneark til PDF for enkel deling og utskrift. Bevarer formler, diagrammer og formatering i et universelt lesbart format.'],

  ['pptx-to-pdf',
    'Turn PowerPoint presentations into PDF files for easy sharing across devices. Keeps slide layout, fonts, and embedded media intact.',
    'Wandle PowerPoint-Präsentationen in PDF um für einfaches Teilen auf allen Geräten. Behält Folienlayout, Schriftarten und eingebettete Medien bei.',
    'Transformez vos présentations PowerPoint en PDF pour les partager facilement. Conserve la mise en page des diapositives, les polices et les médias intégrés.',
    'Convierte presentaciones de PowerPoint en archivos PDF para compartirlas fácilmente. Mantiene el diseño de las diapositivas, las fuentes y el contenido multimedia.',
    'Trasforma le presentazioni PowerPoint in PDF per condividerle facilmente su qualsiasi dispositivo. Mantiene layout, font e media incorporati.',
    'Transforme apresentações PowerPoint em PDF para partilha fácil entre dispositivos. Mantém disposição dos slides, tipos de letra e multimédia incorporada.',
    'Zet PowerPoint-presentaties om naar PDF voor eenvoudig delen op alle apparaten. Behoudt dia-indeling, lettertypen en ingesloten media.',
    'Zamień prezentacje PowerPoint w pliki PDF dla łatwego udostępniania między urządzeniami. Zachowuje układ slajdów, czcionki i osadzone multimedia.',
    'Förvandla PowerPoint-presentationer till PDF för enkel delning mellan enheter. Behåller bildlayout, typsnitt och inbäddade media.',
    'Gjør PowerPoint-presentasjoner om til PDF for enkel deling på tvers av enheter. Beholder lysbildelayout, skrifter og innebygde medier.'],

  ['pdf-to-pptx',
    'Convert PDF documents back into editable PowerPoint slides. Useful when you need to update or repurpose a presentation you only have as PDF.',
    'Konvertiere PDF-Dokumente zurück in bearbeitbare PowerPoint-Folien. Nützlich, wenn du eine nur als PDF vorhandene Präsentation aktualisieren oder weiterverwenden möchtest.',
    'Reconvertissez des documents PDF en diapositives PowerPoint modifiables. Utile lorsque vous devez mettre à jour ou réutiliser une présentation dont vous n\'avez que la version PDF.',
    'Convierte documentos PDF en diapositivas de PowerPoint editables. Útil cuando necesitas actualizar o reutilizar una presentación que solo tienes en PDF.',
    'Riconverti documenti PDF in diapositive PowerPoint modificabili. Utile quando devi aggiornare o riutilizzare una presentazione disponibile solo in PDF.',
    'Reconverta documentos PDF em slides PowerPoint editáveis. Útil quando precisa atualizar ou reaproveitar uma apresentação que só tem em PDF.',
    'Converteer PDF-documenten terug naar bewerkbare PowerPoint-dia\'s. Handig wanneer je een presentatie wilt bijwerken die je alleen als PDF hebt.',
    'Konwertuj dokumenty PDF z powrotem na edytowalne slajdy PowerPoint. Przydatne, gdy musisz zaktualizować lub ponownie wykorzystać prezentację dostępną tylko w PDF.',
    'Konvertera PDF-dokument tillbaka till redigerbara PowerPoint-bilder. Användbart när du behöver uppdatera eller återanvända en presentation du bara har som PDF.',
    'Konverter PDF-dokumenter tilbake til redigerbare PowerPoint-lysbilder. Nyttig når du må oppdatere eller gjenbruke en presentasjon du bare har som PDF.'],

  ['pdf-to-txt',
    'Extract plain text content from PDF files for analysis, editing, or reuse. Great for processing documents in scripts or text editors.',
    'Extrahiere reinen Textinhalt aus PDF-Dateien zur Analyse, Bearbeitung oder Wiederverwendung. Ideal für die Verarbeitung von Dokumenten in Skripten oder Texteditoren.',
    'Extrayez le contenu textuel brut des fichiers PDF pour analyse, édition ou réutilisation. Idéal pour traiter des documents dans des scripts ou éditeurs de texte.',
    'Extrae el contenido de texto plano de archivos PDF para análisis, edición o reutilización. Ideal para procesar documentos en scripts o editores de texto.',
    'Estrai il contenuto testuale dai file PDF per analisi, modifica o riutilizzo. Ottimo per elaborare documenti in script o editor di testo.',
    'Extraia o conteúdo de texto simples de ficheiros PDF para análise, edição ou reutilização. Ótimo para processar documentos em scripts ou editores de texto.',
    'Haal platte tekst uit PDF-bestanden voor analyse, bewerking of hergebruik. Ideaal voor het verwerken van documenten in scripts of teksteditors.',
    'Wyodrębnij zwykły tekst z plików PDF do analizy, edycji lub ponownego użycia. Świetne do przetwarzania dokumentów w skryptach lub edytorach tekstu.',
    'Extrahera ren textinnehåll från PDF-filer för analys, redigering eller återanvändning. Perfekt för att bearbeta dokument i skript eller textredigerare.',
    'Hent ren tekst fra PDF-filer for analyse, redigering eller gjenbruk. Flott for å behandle dokumenter i skript eller tekstredigerere.'],

  ['pdf-to-html',
    'Convert PDFs to HTML web pages while preserving layout, links, and formatting. Perfect for publishing documents online.',
    'Konvertiere PDFs in HTML-Webseiten unter Beibehaltung von Layout, Links und Formatierung. Perfekt zum Veröffentlichen von Dokumenten online.',
    'Convertissez des PDF en pages HTML tout en préservant la mise en page, les liens et le formatage. Parfait pour publier des documents en ligne.',
    'Convierte PDFs en páginas web HTML conservando diseño, enlaces y formato. Perfecto para publicar documentos en línea.',
    'Converti PDF in pagine web HTML mantenendo layout, collegamenti e formattazione. Perfetto per pubblicare documenti online.',
    'Converta PDFs em páginas HTML mantendo disposição, ligações e formatação. Perfeito para publicar documentos online.',
    'Converteer PDF\'s naar HTML-webpagina\'s met behoud van lay-out, links en opmaak. Perfect voor het online publiceren van documenten.',
    'Konwertuj pliki PDF na strony HTML z zachowaniem układu, odnośników i formatowania. Idealne do publikowania dokumentów online.',
    'Konvertera PDF-filer till HTML-webbsidor med bevarad layout, länkar och formatering. Perfekt för att publicera dokument online.',
    'Konverter PDF-filer til HTML-nettsider med bevart layout, lenker og formatering. Perfekt for å publisere dokumenter på nett.'],

  ['html-to-pdf',
    'Save web pages or HTML documents as PDF files for offline reading or archival. Captures styling, images, and links.',
    'Speichere Webseiten oder HTML-Dokumente als PDF zum Offline-Lesen oder Archivieren. Erfasst Stil, Bilder und Links.',
    'Enregistrez des pages web ou des documents HTML au format PDF pour la lecture hors ligne ou l\'archivage. Capture le style, les images et les liens.',
    'Guarda páginas web o documentos HTML como PDF para lectura sin conexión o archivado. Captura estilo, imágenes y enlaces.',
    'Salva pagine web o documenti HTML come PDF per la lettura offline o l\'archiviazione. Cattura stile, immagini e collegamenti.',
    'Guarde páginas web ou documentos HTML como PDF para leitura offline ou arquivo. Captura o estilo, imagens e ligações.',
    'Sla webpagina\'s of HTML-documenten op als PDF voor offline lezen of archivering. Vangt opmaak, afbeeldingen en links op.',
    'Zapisz strony internetowe lub dokumenty HTML jako PDF do czytania offline lub archiwizacji. Zachowuje style, obrazy i odnośniki.',
    'Spara webbsidor eller HTML-dokument som PDF för offlineläsning eller arkivering. Fångar stil, bilder och länkar.',
    'Lagre nettsider eller HTML-dokumenter som PDF for offline lesing eller arkivering. Fanger opp stil, bilder og lenker.'],

  ['rtf-to-pdf',
    'Convert Rich Text Format documents to PDF for consistent presentation across devices. Preserves fonts, formatting, and embedded media.',
    'Konvertiere RTF-Dokumente in PDF für eine einheitliche Darstellung auf allen Geräten. Behält Schriftarten, Formatierung und eingebettete Medien bei.',
    'Convertissez des documents Rich Text Format en PDF pour une présentation uniforme sur tous les appareils. Préserve les polices, la mise en forme et les médias intégrés.',
    'Convierte documentos RTF a PDF para una presentación uniforme en cualquier dispositivo. Conserva fuentes, formato y multimedia incrustada.',
    'Converti documenti Rich Text Format in PDF per una presentazione coerente su tutti i dispositivi. Mantiene font, formattazione e media incorporati.',
    'Converta documentos Rich Text Format em PDF para uma apresentação consistente em todos os dispositivos. Preserva tipos de letra, formatação e multimédia incorporada.',
    'Converteer Rich Text Format-documenten naar PDF voor consistente weergave op alle apparaten. Behoudt lettertypen, opmaak en ingesloten media.',
    'Konwertuj dokumenty Rich Text Format na PDF dla spójnej prezentacji na wszystkich urządzeniach. Zachowuje czcionki, formatowanie i osadzone multimedia.',
    'Konvertera Rich Text Format-dokument till PDF för enhetlig presentation på alla enheter. Bevarar typsnitt, formatering och inbäddade media.',
    'Konverter Rich Text Format-dokumenter til PDF for enhetlig presentasjon på alle enheter. Bevarer skrifter, formatering og innebygde medier.'],

  ['pdf-to-rtf',
    'Convert PDF files to RTF format for editing in any word processor. Ideal when you need a portable, editable copy of a PDF.',
    'Konvertiere PDF-Dateien in das RTF-Format zur Bearbeitung in jedem Textverarbeitungsprogramm. Ideal, wenn du eine portable, bearbeitbare Kopie eines PDFs benötigst.',
    'Convertissez des fichiers PDF en RTF pour les modifier dans n\'importe quel traitement de texte. Idéal lorsque vous avez besoin d\'une copie modifiable et portable d\'un PDF.',
    'Convierte archivos PDF a formato RTF para editarlos en cualquier procesador de texto. Ideal cuando necesitas una copia portable y editable de un PDF.',
    'Converti file PDF in formato RTF per modificarli in qualsiasi elaboratore di testi. Ideale quando hai bisogno di una copia portatile e modificabile di un PDF.',
    'Converta ficheiros PDF para o formato RTF para edição em qualquer processador de texto. Ideal quando precisa de uma cópia portátil e editável de um PDF.',
    'Converteer PDF-bestanden naar RTF voor bewerking in elke tekstverwerker. Ideaal wanneer je een draagbare, bewerkbare kopie van een PDF nodig hebt.',
    'Konwertuj pliki PDF do formatu RTF do edycji w dowolnym edytorze tekstu. Idealne, gdy potrzebujesz przenośnej, edytowalnej kopii pliku PDF.',
    'Konvertera PDF-filer till RTF-format för redigering i valfri ordbehandlare. Idealiskt när du behöver en portabel, redigerbar kopia av en PDF.',
    'Konverter PDF-filer til RTF-format for redigering i enhver tekstbehandler. Ideelt når du trenger en bærbar, redigerbar kopi av en PDF.'],

  ['odt-to-pdf',
    'Convert OpenDocument Text files to PDF or Word. Perfect for sharing LibreOffice documents with anyone, regardless of which office suite they use.',
    'Konvertiere OpenDocument-Text-Dateien in PDF oder Word. Perfekt zum Teilen von LibreOffice-Dokumenten mit jedem, unabhängig von der verwendeten Office-Suite.',
    'Convertissez des fichiers OpenDocument Text en PDF ou Word. Parfait pour partager des documents LibreOffice avec n\'importe qui, quel que soit son logiciel bureautique.',
    'Convierte archivos OpenDocument Text a PDF o Word. Perfecto para compartir documentos de LibreOffice con cualquiera, sin importar qué suite ofimática use.',
    'Converti file OpenDocument Text in PDF o Word. Perfetto per condividere documenti LibreOffice con chiunque, indipendentemente dalla suite per ufficio usata.',
    'Converta ficheiros OpenDocument Text em PDF ou Word. Perfeito para partilhar documentos LibreOffice com qualquer pessoa, qualquer que seja o seu pacote de escritório.',
    'Converteer OpenDocument Text-bestanden naar PDF of Word. Perfect voor het delen van LibreOffice-documenten met iedereen, ongeacht welke kantoorsuite ze gebruiken.',
    'Konwertuj pliki OpenDocument Text na PDF lub Word. Idealne do udostępniania dokumentów LibreOffice każdemu, niezależnie od używanego pakietu biurowego.',
    'Konvertera OpenDocument Text-filer till PDF eller Word. Perfekt för att dela LibreOffice-dokument med vem som helst, oavsett vilken kontorssvit de använder.',
    'Konverter OpenDocument Text-filer til PDF eller Word. Perfekt for å dele LibreOffice-dokumenter med hvem som helst, uansett hvilken kontorpakke de bruker.'],

  // ── Image ──
  ['jpg-to-png',
    'Convert JPG images to PNG with transparency support. Ideal for graphics, logos, and screenshots that need a clean transparent background.',
    'Konvertiere JPG-Bilder in PNG mit Transparenz. Ideal für Grafiken, Logos und Screenshots, die einen transparenten Hintergrund benötigen.',
    'Convertissez des images JPG en PNG avec transparence. Idéal pour les graphiques, logos et captures d\'écran nécessitant un fond transparent.',
    'Convierte imágenes JPG a PNG con compatibilidad para transparencias. Ideal para gráficos, logos y capturas de pantalla con fondo transparente.',
    'Converti immagini JPG in PNG con supporto trasparenza. Ideale per grafica, loghi e screenshot che richiedono uno sfondo trasparente.',
    'Converta imagens JPG em PNG com suporte a transparência. Ideal para gráficos, logótipos e capturas de ecrã com fundo transparente.',
    'Converteer JPG-afbeeldingen naar PNG met transparantie. Ideaal voor graphics, logo\'s en screenshots die een transparante achtergrond nodig hebben.',
    'Konwertuj obrazy JPG na PNG z obsługą przezroczystości. Idealne dla grafik, logotypów i zrzutów ekranu wymagających przezroczystego tła.',
    'Konvertera JPG-bilder till PNG med transparens. Idealiskt för grafik, logotyper och skärmdumpar som behöver en transparent bakgrund.',
    'Konverter JPG-bilder til PNG med gjennomsiktighet. Ideelt for grafikk, logoer og skjermbilder som trenger en gjennomsiktig bakgrunn.'],

  ['png-to-jpg',
    'Convert PNG images to JPG to dramatically reduce file size. Perfect for photos, web images, and any graphic where a smaller file matters more than transparency.',
    'Konvertiere PNG-Bilder in JPG, um die Dateigröße drastisch zu reduzieren. Perfekt für Fotos, Webgrafiken und Bilder, bei denen kleinere Dateien wichtiger sind als Transparenz.',
    'Convertissez des images PNG en JPG pour réduire considérablement la taille des fichiers. Parfait pour les photos, images web et tout graphique où la taille prime sur la transparence.',
    'Convierte imágenes PNG a JPG para reducir el tamaño del archivo drásticamente. Perfecto para fotos, imágenes web y gráficos donde el tamaño importa más que la transparencia.',
    'Converti immagini PNG in JPG per ridurre drasticamente le dimensioni dei file. Perfetto per foto, immagini web e grafiche in cui le dimensioni contano più della trasparenza.',
    'Converta imagens PNG em JPG para reduzir drasticamente o tamanho do ficheiro. Perfeito para fotos, imagens web e gráficos onde o tamanho importa mais que a transparência.',
    'Converteer PNG-afbeeldingen naar JPG om de bestandsgrootte drastisch te verkleinen. Perfect voor foto\'s, webafbeeldingen en grafische elementen waar grootte belangrijker is dan transparantie.',
    'Konwertuj obrazy PNG na JPG, aby drastycznie zmniejszyć rozmiar pliku. Idealne dla zdjęć, grafik internetowych i innych obrazów, gdzie rozmiar ma większe znaczenie niż przezroczystość.',
    'Konvertera PNG-bilder till JPG för att drastiskt minska filstorleken. Perfekt för foton, webbbilder och grafik där storlek är viktigare än transparens.',
    'Konverter PNG-bilder til JPG for å redusere filstørrelsen drastisk. Perfekt for bilder, nettgrafikk og bilder der størrelse betyr mer enn gjennomsiktighet.'],

  ['webp-to-png',
    'Convert modern WebP images to widely-supported PNG format. Useful for editing in software that does not yet support WebP natively.',
    'Konvertiere moderne WebP-Bilder ins weit verbreitete PNG-Format. Nützlich zum Bearbeiten in Software, die WebP noch nicht nativ unterstützt.',
    'Convertissez des images WebP modernes au format PNG largement pris en charge. Utile pour l\'édition dans des logiciels qui ne prennent pas encore en charge WebP nativement.',
    'Convierte imágenes WebP modernas al formato PNG ampliamente compatible. Útil para editar en programas que aún no admiten WebP de forma nativa.',
    'Converti moderne immagini WebP nel formato PNG ampiamente supportato. Utile per modificarle in software che non supporta ancora WebP nativamente.',
    'Converta imagens WebP modernas para o formato PNG amplamente suportado. Útil para edição em software que ainda não suporta WebP nativamente.',
    'Converteer moderne WebP-afbeeldingen naar het breed ondersteunde PNG-formaat. Handig voor bewerking in software die WebP nog niet ondersteunt.',
    'Konwertuj nowoczesne obrazy WebP na powszechnie obsługiwany format PNG. Przydatne do edycji w programach, które jeszcze nie obsługują WebP natywnie.',
    'Konvertera moderna WebP-bilder till det allmänt stödda PNG-formatet. Användbart för redigering i program som ännu inte stöder WebP nativt.',
    'Konverter moderne WebP-bilder til det bredt støttede PNG-formatet. Nyttig for redigering i programvare som ennå ikke støtter WebP naturlig.'],

  ['webp-to-jpg',
    'Convert WebP images to JPG for maximum compatibility with old systems and software. Great for sharing photos that everyone can open.',
    'Konvertiere WebP-Bilder in JPG für maximale Kompatibilität mit älteren Systemen und Software. Ideal zum Teilen von Fotos, die jeder öffnen kann.',
    'Convertissez des images WebP en JPG pour une compatibilité maximale avec les anciens systèmes et logiciels. Idéal pour partager des photos que tout le monde peut ouvrir.',
    'Convierte imágenes WebP a JPG para máxima compatibilidad con sistemas y programas antiguos. Genial para compartir fotos que cualquiera pueda abrir.',
    'Converti immagini WebP in JPG per la massima compatibilità con sistemi e software meno recenti. Ottimo per condividere foto che tutti possono aprire.',
    'Converta imagens WebP em JPG para máxima compatibilidade com sistemas e software antigos. Ótimo para partilhar fotos que toda a gente consegue abrir.',
    'Converteer WebP-afbeeldingen naar JPG voor maximale compatibiliteit met oudere systemen en software. Ideaal om foto\'s te delen die iedereen kan openen.',
    'Konwertuj obrazy WebP na JPG dla maksymalnej zgodności ze starszymi systemami i oprogramowaniem. Świetne do udostępniania zdjęć, które każdy otworzy.',
    'Konvertera WebP-bilder till JPG för maximal kompatibilitet med äldre system och programvara. Bra för att dela foton som alla kan öppna.',
    'Konverter WebP-bilder til JPG for maksimal kompatibilitet med eldre systemer og programvare. Flott for å dele bilder alle kan åpne.'],

  ['heic-to-jpg',
    'Convert iPhone HEIC photos to standard JPG format. Solves compatibility issues when sharing photos with non-Apple devices or services.',
    'Konvertiere iPhone-HEIC-Fotos in das Standard-JPG-Format. Löst Kompatibilitätsprobleme beim Teilen von Fotos mit Nicht-Apple-Geräten oder -Diensten.',
    'Convertissez les photos HEIC d\'iPhone au format JPG standard. Résout les problèmes de compatibilité lors du partage de photos avec des appareils ou services non Apple.',
    'Convierte fotos HEIC de iPhone al formato JPG estándar. Resuelve problemas de compatibilidad al compartir fotos con dispositivos o servicios no Apple.',
    'Converti foto HEIC iPhone nel formato JPG standard. Risolve i problemi di compatibilità durante la condivisione con dispositivi o servizi non Apple.',
    'Converta fotos HEIC do iPhone para o formato JPG padrão. Resolve problemas de compatibilidade ao partilhar fotos com dispositivos ou serviços não Apple.',
    'Converteer iPhone HEIC-foto\'s naar standaard JPG-formaat. Lost compatibiliteitsproblemen op bij het delen met niet-Apple-apparaten of -diensten.',
    'Konwertuj zdjęcia HEIC z iPhone\'a na standardowy format JPG. Rozwiązuje problemy ze zgodnością przy udostępnianiu zdjęć urządzeniom lub usługom innym niż Apple.',
    'Konvertera iPhone HEIC-foton till standard JPG-format. Löser kompatibilitetsproblem vid delning av foton med icke-Apple-enheter eller -tjänster.',
    'Konverter iPhone HEIC-bilder til standard JPG-format. Løser kompatibilitetsproblemer når du deler bilder med enheter eller tjenester som ikke er Apple.'],

  ['heic-to-png',
    'Convert iPhone HEIC images to PNG with full quality preservation. Perfect for editing or printing without losing detail.',
    'Konvertiere iPhone-HEIC-Bilder in PNG mit voller Qualitätserhaltung. Perfekt zum Bearbeiten oder Drucken ohne Detailverlust.',
    'Convertissez les images HEIC d\'iPhone en PNG en préservant toute la qualité. Parfait pour l\'édition ou l\'impression sans perte de détail.',
    'Convierte imágenes HEIC de iPhone a PNG conservando toda la calidad. Perfecto para editar o imprimir sin perder detalle.',
    'Converti immagini HEIC iPhone in PNG mantenendo la qualità completa. Perfetto per modifica o stampa senza perdita di dettaglio.',
    'Converta imagens HEIC do iPhone em PNG preservando toda a qualidade. Perfeito para edição ou impressão sem perder detalhe.',
    'Converteer iPhone HEIC-afbeeldingen naar PNG met volledig behoud van kwaliteit. Perfect voor bewerking of afdruk zonder detailverlies.',
    'Konwertuj obrazy HEIC z iPhone\'a na PNG z zachowaniem pełnej jakości. Idealne do edycji lub druku bez utraty szczegółów.',
    'Konvertera iPhone HEIC-bilder till PNG med full kvalitetsbevaring. Perfekt för redigering eller utskrift utan detaljförlust.',
    'Konverter iPhone HEIC-bilder til PNG med full kvalitetsbevaring. Perfekt for redigering eller utskrift uten detaljtap.'],

  ['svg-to-png',
    'Render scalable SVG vector graphics as PNG raster images. Ideal for using vector designs in apps that only support pixel-based formats.',
    'Rendere skalierbare SVG-Vektorgrafiken als PNG-Rasterbilder. Ideal, um Vektordesigns in Apps zu verwenden, die nur pixelbasierte Formate unterstützen.',
    'Restituez les graphiques vectoriels SVG sous forme d\'images raster PNG. Idéal pour utiliser des conceptions vectorielles dans des applications ne prenant en charge que les formats pixel.',
    'Renderiza gráficos vectoriales SVG escalables como imágenes ráster PNG. Ideal para usar diseños vectoriales en aplicaciones que solo admiten formatos basados en píxeles.',
    'Rendi le grafiche vettoriali SVG scalabili come immagini raster PNG. Ideale per usare design vettoriali in app che supportano solo formati basati su pixel.',
    'Renderize gráficos vetoriais SVG escaláveis como imagens raster PNG. Ideal para usar designs vetoriais em aplicações que só suportam formatos baseados em píxeis.',
    'Render schaalbare SVG-vectorgrafieken als PNG-rasterafbeeldingen. Ideaal om vectorontwerpen te gebruiken in apps die alleen pixelformaten ondersteunen.',
    'Renderuj skalowalne grafiki wektorowe SVG jako obrazy rastrowe PNG. Idealne do używania projektów wektorowych w aplikacjach obsługujących tylko formaty pikselowe.',
    'Rendera skalbar SVG-vektorgrafik som PNG-rasterbilder. Idealiskt för att använda vektordesign i appar som bara stöder pixelbaserade format.',
    'Gjengi skalerbar SVG-vektorgrafikk som PNG-rasterbilder. Ideelt for å bruke vektordesign i apper som bare støtter pikselbaserte formater.'],

  ['svg-to-jpg',
    'Convert SVG vectors to JPG for use on any platform. Great for sharing logos, icons, or illustrations as standard images.',
    'Konvertiere SVG-Vektoren in JPG zur Verwendung auf jeder Plattform. Ideal zum Teilen von Logos, Symbolen oder Illustrationen als Standardbilder.',
    'Convertissez des vecteurs SVG en JPG pour les utiliser sur n\'importe quelle plateforme. Parfait pour partager logos, icônes ou illustrations sous forme d\'images standard.',
    'Convierte vectores SVG a JPG para usarlos en cualquier plataforma. Perfecto para compartir logos, íconos o ilustraciones como imágenes estándar.',
    'Converti vettori SVG in JPG per l\'uso su qualsiasi piattaforma. Ottimo per condividere loghi, icone o illustrazioni come immagini standard.',
    'Converta vetores SVG em JPG para uso em qualquer plataforma. Ótimo para partilhar logótipos, ícones ou ilustrações como imagens padrão.',
    'Converteer SVG-vectoren naar JPG voor gebruik op elk platform. Ideaal voor het delen van logo\'s, pictogrammen of illustraties als standaardafbeeldingen.',
    'Konwertuj wektory SVG na JPG do użycia na dowolnej platformie. Świetne do udostępniania logotypów, ikon czy ilustracji jako standardowych obrazów.',
    'Konvertera SVG-vektorer till JPG för användning på alla plattformar. Bra för att dela logotyper, ikoner eller illustrationer som standardbilder.',
    'Konverter SVG-vektorer til JPG for bruk på enhver plattform. Flott for å dele logoer, ikoner eller illustrasjoner som standardbilder.'],

  ['bmp-to-png',
    'Convert legacy BMP files to compact, modern PNG format. Drastically reduces file size while preserving full image quality.',
    'Konvertiere ältere BMP-Dateien in kompakte, moderne PNG-Dateien. Reduziert die Dateigröße drastisch bei voller Bildqualität.',
    'Convertissez d\'anciens fichiers BMP au format PNG moderne et compact. Réduit considérablement la taille tout en préservant la qualité d\'image.',
    'Convierte archivos BMP antiguos al formato PNG moderno y compacto. Reduce drásticamente el tamaño manteniendo toda la calidad de imagen.',
    'Converti vecchi file BMP nel moderno e compatto formato PNG. Riduce drasticamente le dimensioni mantenendo la qualità dell\'immagine.',
    'Converta ficheiros BMP antigos no formato PNG moderno e compacto. Reduz drasticamente o tamanho mantendo toda a qualidade da imagem.',
    'Converteer oude BMP-bestanden naar het compacte, moderne PNG-formaat. Verkleint de bestandsgrootte drastisch met behoud van volledige beeldkwaliteit.',
    'Konwertuj stare pliki BMP na kompaktowy, nowoczesny format PNG. Drastycznie zmniejsza rozmiar pliku, zachowując pełną jakość obrazu.',
    'Konvertera äldre BMP-filer till det kompakta, moderna PNG-formatet. Minskar filstorleken drastiskt med bibehållen bildkvalitet.',
    'Konverter eldre BMP-filer til det kompakte, moderne PNG-formatet. Reduserer filstørrelsen drastisk med full bildekvalitet.'],

  ['tiff-to-jpg',
    'Convert high-resolution TIFF files to compressed JPG. Perfect for sharing scanned documents or professional photos in a smaller, web-friendly size.',
    'Konvertiere hochauflösende TIFF-Dateien in komprimierte JPG-Dateien. Perfekt zum Teilen gescannter Dokumente oder professioneller Fotos in webfreundlicher Größe.',
    'Convertissez des fichiers TIFF haute résolution en JPG compressés. Parfait pour partager des documents numérisés ou des photos professionnelles dans une taille plus petite, adaptée au web.',
    'Convierte archivos TIFF de alta resolución a JPG comprimido. Perfecto para compartir documentos escaneados o fotos profesionales en un tamaño más pequeño y compatible con la web.',
    'Converti file TIFF ad alta risoluzione in JPG compressi. Perfetto per condividere documenti scansionati o foto professionali in un formato più piccolo e adatto al web.',
    'Converta ficheiros TIFF de alta resolução em JPG comprimido. Perfeito para partilhar documentos digitalizados ou fotos profissionais num tamanho menor e compatível com a web.',
    'Converteer high-resolution TIFF-bestanden naar gecomprimeerde JPG. Perfect om gescande documenten of professionele foto\'s in een kleiner, webvriendelijk formaat te delen.',
    'Konwertuj pliki TIFF o wysokiej rozdzielczości na skompresowany JPG. Idealne do udostępniania zeskanowanych dokumentów lub profesjonalnych zdjęć w mniejszym, sieciowym rozmiarze.',
    'Konvertera högupplösta TIFF-filer till komprimerad JPG. Perfekt för att dela skannade dokument eller professionella foton i en mindre, webbvänlig storlek.',
    'Konverter høyoppløselige TIFF-filer til komprimert JPG. Perfekt for å dele skannede dokumenter eller profesjonelle bilder i en mindre, nettvennlig størrelse.'],

  ['gif-to-png',
    'Convert GIF images to PNG with better color depth and transparency. Best for static images extracted from animated GIFs.',
    'Konvertiere GIF-Bilder in PNG mit besserer Farbtiefe und Transparenz. Ideal für statische Bilder aus animierten GIFs.',
    'Convertissez des images GIF en PNG avec une meilleure profondeur de couleur et transparence. Idéal pour les images statiques extraites de GIF animés.',
    'Convierte imágenes GIF a PNG con mejor profundidad de color y transparencia. Ideal para imágenes estáticas extraídas de GIFs animados.',
    'Converti immagini GIF in PNG con migliore profondità di colore e trasparenza. Ottimo per immagini statiche estratte da GIF animate.',
    'Converta imagens GIF em PNG com melhor profundidade de cor e transparência. Ótimo para imagens estáticas extraídas de GIFs animados.',
    'Converteer GIF-afbeeldingen naar PNG met betere kleurdiepte en transparantie. Ideaal voor statische beelden uit geanimeerde GIF\'s.',
    'Konwertuj obrazy GIF na PNG z lepszą głębią kolorów i przezroczystością. Najlepsze dla obrazów statycznych wyodrębnionych z animowanych GIF-ów.',
    'Konvertera GIF-bilder till PNG med bättre färgdjup och transparens. Bäst för statiska bilder från animerade GIF-filer.',
    'Konverter GIF-bilder til PNG med bedre fargedybde og gjennomsiktighet. Best for statiske bilder fra animerte GIF-er.'],

  ['png-to-ico',
    'Generate Windows-compatible ICO favicon and app icon files from PNG images. Includes multiple resolutions in a single icon file.',
    'Erstelle Windows-kompatible ICO-Favicon- und App-Icon-Dateien aus PNG-Bildern. Enthält mehrere Auflösungen in einer einzigen Icon-Datei.',
    'Générez des fichiers favicon ICO et icônes d\'application compatibles Windows à partir d\'images PNG. Inclut plusieurs résolutions dans un seul fichier icône.',
    'Genera archivos ICO de favicon e iconos de aplicación compatibles con Windows a partir de imágenes PNG. Incluye varias resoluciones en un único archivo.',
    'Genera file ICO favicon e icone app compatibili con Windows da immagini PNG. Include più risoluzioni in un singolo file icona.',
    'Gere ficheiros ICO de favicon e ícones de aplicações compatíveis com Windows a partir de imagens PNG. Inclui várias resoluções num único ficheiro de ícone.',
    'Genereer Windows-compatibele ICO favicon- en app-pictogrambestanden uit PNG-afbeeldingen. Bevat meerdere resoluties in één icoonbestand.',
    'Generuj kompatybilne z Windows pliki ICO favicon i ikon aplikacji z obrazów PNG. Zawiera wiele rozdzielczości w jednym pliku ikony.',
    'Generera Windows-kompatibla ICO-favicon- och appikonfiler från PNG-bilder. Inkluderar flera upplösningar i en enda ikonfil.',
    'Generer Windows-kompatible ICO-favikon- og appikonfiler fra PNG-bilder. Inkluderer flere oppløsninger i én ikonfil.'],

  // ── Video ──
  ['mp4-to-avi',
    'Convert MP4 videos to AVI for compatibility with older media players and editing software. Preserves video and audio quality during conversion.',
    'Konvertiere MP4-Videos in AVI für Kompatibilität mit älteren Mediaplayern und Bearbeitungssoftware. Erhält Video- und Audioqualität bei der Konvertierung.',
    'Convertissez des vidéos MP4 en AVI pour la compatibilité avec d\'anciens lecteurs et logiciels de montage. Préserve la qualité vidéo et audio.',
    'Convierte videos MP4 a AVI para compatibilidad con reproductores y software de edición antiguos. Conserva la calidad de video y audio.',
    'Converti video MP4 in AVI per compatibilità con vecchi lettori multimediali e software di editing. Mantiene la qualità video e audio.',
    'Converta vídeos MP4 em AVI para compatibilidade com leitores e software de edição mais antigos. Preserva a qualidade de vídeo e áudio.',
    'Converteer MP4-video\'s naar AVI voor compatibiliteit met oudere mediaspelers en bewerkingssoftware. Behoudt video- en audiokwaliteit.',
    'Konwertuj filmy MP4 na AVI dla zgodności ze starszymi odtwarzaczami i oprogramowaniem edycyjnym. Zachowuje jakość wideo i dźwięku.',
    'Konvertera MP4-videor till AVI för kompatibilitet med äldre mediaspelare och redigeringsprogram. Bevarar video- och ljudkvalitet.',
    'Konverter MP4-videoer til AVI for kompatibilitet med eldre mediespillere og redigeringsprogramvare. Bevarer video- og lydkvalitet.'],

  ['mp4-to-mov',
    'Convert MP4 to QuickTime MOV format for editing in Apple Final Cut Pro, iMovie, or other Mac-based video tools.',
    'Konvertiere MP4 in das QuickTime-MOV-Format für die Bearbeitung in Apple Final Cut Pro, iMovie oder anderen Mac-Videotools.',
    'Convertissez MP4 au format QuickTime MOV pour le montage dans Apple Final Cut Pro, iMovie ou d\'autres outils vidéo Mac.',
    'Convierte MP4 al formato QuickTime MOV para edición en Apple Final Cut Pro, iMovie u otras herramientas de video para Mac.',
    'Converti MP4 nel formato QuickTime MOV per il montaggio in Apple Final Cut Pro, iMovie o altri strumenti video Mac.',
    'Converta MP4 para o formato QuickTime MOV para edição no Apple Final Cut Pro, iMovie ou outras ferramentas de vídeo para Mac.',
    'Converteer MP4 naar QuickTime MOV-formaat voor bewerking in Apple Final Cut Pro, iMovie of andere Mac-videotools.',
    'Konwertuj MP4 do formatu QuickTime MOV do edycji w Apple Final Cut Pro, iMovie lub innych narzędziach wideo Mac.',
    'Konvertera MP4 till QuickTime MOV-format för redigering i Apple Final Cut Pro, iMovie eller andra Mac-baserade videoverktyg.',
    'Konverter MP4 til QuickTime MOV-format for redigering i Apple Final Cut Pro, iMovie eller andre Mac-baserte videoverktøy.'],

  ['mov-to-mp4',
    'Convert MOV files to MP4 for universal playback across phones, browsers, and streaming platforms. Reduces file size without sacrificing quality.',
    'Konvertiere MOV-Dateien in MP4 für universelle Wiedergabe auf Telefonen, Browsern und Streaming-Plattformen. Reduziert die Dateigröße ohne Qualitätsverlust.',
    'Convertissez des fichiers MOV en MP4 pour une lecture universelle sur téléphones, navigateurs et plateformes de streaming. Réduit la taille sans sacrifier la qualité.',
    'Convierte archivos MOV a MP4 para reproducción universal en teléfonos, navegadores y plataformas de streaming. Reduce el tamaño sin perder calidad.',
    'Converti file MOV in MP4 per la riproduzione universale su telefoni, browser e piattaforme di streaming. Riduce le dimensioni senza compromettere la qualità.',
    'Converta ficheiros MOV em MP4 para reprodução universal em telemóveis, navegadores e plataformas de streaming. Reduz o tamanho sem comprometer a qualidade.',
    'Converteer MOV-bestanden naar MP4 voor universele weergave op telefoons, browsers en streamingplatforms. Verkleint de bestandsgrootte zonder kwaliteitsverlies.',
    'Konwertuj pliki MOV na MP4 dla uniwersalnego odtwarzania w telefonach, przeglądarkach i platformach streamingowych. Zmniejsza rozmiar bez utraty jakości.',
    'Konvertera MOV-filer till MP4 för universell uppspelning på telefoner, webbläsare och streamingplattformar. Minskar filstorleken utan kvalitetsförlust.',
    'Konverter MOV-filer til MP4 for universell avspilling på telefoner, nettlesere og strømmeplattformer. Reduserer filstørrelsen uten å ofre kvalitet.'],

  ['mkv-to-mp4',
    'Convert Matroska MKV files to MP4 for use on smartphones, streaming devices, and editing software that does not support MKV natively.',
    'Konvertiere Matroska-MKV-Dateien in MP4 zur Verwendung auf Smartphones, Streaming-Geräten und Bearbeitungssoftware, die MKV nicht nativ unterstützt.',
    'Convertissez des fichiers Matroska MKV en MP4 pour les utiliser sur smartphones, appareils de streaming et logiciels de montage ne prenant pas en charge MKV nativement.',
    'Convierte archivos Matroska MKV a MP4 para usar en smartphones, dispositivos de streaming y software de edición sin soporte nativo para MKV.',
    'Converti file Matroska MKV in MP4 per smartphone, dispositivi di streaming e software di editing che non supportano MKV nativamente.',
    'Converta ficheiros Matroska MKV em MP4 para uso em smartphones, dispositivos de streaming e software de edição sem suporte nativo a MKV.',
    'Converteer Matroska MKV-bestanden naar MP4 voor gebruik op smartphones, streamingapparaten en bewerkingssoftware zonder MKV-ondersteuning.',
    'Konwertuj pliki Matroska MKV na MP4 do użycia w smartfonach, urządzeniach streamingowych i oprogramowaniu edycyjnym bez natywnej obsługi MKV.',
    'Konvertera Matroska MKV-filer till MP4 för användning i smartphones, streamingenheter och redigeringsprogram utan inbyggt MKV-stöd.',
    'Konverter Matroska MKV-filer til MP4 for bruk på smarttelefoner, strømmeenheter og redigeringsprogramvare uten innebygd MKV-støtte.'],

  ['webm-to-mp4',
    'Convert WebM videos to MP4 for broader device support including iOS, older Android, and most desktop video editors.',
    'Konvertiere WebM-Videos in MP4 für breitere Geräteunterstützung einschließlich iOS, älterem Android und den meisten Desktop-Videoeditoren.',
    'Convertissez des vidéos WebM en MP4 pour une prise en charge plus large incluant iOS, Android plus ancien et la plupart des éditeurs vidéo de bureau.',
    'Convierte videos WebM a MP4 para mayor compatibilidad con iOS, Android antiguo y la mayoría de editores de video de escritorio.',
    'Converti video WebM in MP4 per un supporto più ampio inclusi iOS, vecchio Android e la maggior parte degli editor video desktop.',
    'Converta vídeos WebM em MP4 para suporte mais amplo, incluindo iOS, Android mais antigo e a maioria dos editores de vídeo desktop.',
    'Converteer WebM-video\'s naar MP4 voor bredere apparaatondersteuning waaronder iOS, oudere Android en de meeste desktop videoeditors.',
    'Konwertuj filmy WebM na MP4 dla szerszej obsługi urządzeń, w tym iOS, starszego Androida i większości desktopowych edytorów wideo.',
    'Konvertera WebM-videor till MP4 för bredare enhetsstöd inklusive iOS, äldre Android och de flesta skrivbordsvideoredigerare.',
    'Konverter WebM-videoer til MP4 for bredere enhetsstøtte inkludert iOS, eldre Android og de fleste videoredigerere på skrivebordet.'],

  ['avi-to-mp4',
    'Convert legacy AVI videos to modern MP4 format. Smaller file sizes, better compression, and full compatibility with mobile devices.',
    'Konvertiere ältere AVI-Videos in das moderne MP4-Format. Kleinere Dateigrößen, bessere Komprimierung und volle Kompatibilität mit Mobilgeräten.',
    'Convertissez d\'anciennes vidéos AVI au format MP4 moderne. Tailles de fichier plus petites, meilleure compression et compatibilité totale avec les mobiles.',
    'Convierte videos AVI antiguos al moderno formato MP4. Tamaños más pequeños, mejor compresión y total compatibilidad con dispositivos móviles.',
    'Converti vecchi video AVI nel moderno formato MP4. Dimensioni inferiori, migliore compressione e piena compatibilità con i dispositivi mobili.',
    'Converta vídeos AVI antigos para o moderno formato MP4. Tamanhos menores, melhor compressão e total compatibilidade com dispositivos móveis.',
    'Converteer oude AVI-video\'s naar het moderne MP4-formaat. Kleinere bestanden, betere compressie en volledige compatibiliteit met mobiele apparaten.',
    'Konwertuj stare filmy AVI na nowoczesny format MP4. Mniejsze rozmiary, lepsza kompresja i pełna zgodność z urządzeniami mobilnymi.',
    'Konvertera äldre AVI-videor till det moderna MP4-formatet. Mindre filstorlekar, bättre komprimering och full kompatibilitet med mobila enheter.',
    'Konverter eldre AVI-videoer til det moderne MP4-formatet. Mindre filstørrelser, bedre komprimering og full kompatibilitet med mobile enheter.'],

  ['flv-to-mp4',
    'Convert old Flash FLV videos to MP4. Future-proofs archived video content now that Flash is deprecated everywhere.',
    'Konvertiere alte Flash-FLV-Videos in MP4. Macht archivierte Videoinhalte zukunftssicher, da Flash überall ausläuft.',
    'Convertissez d\'anciennes vidéos Flash FLV en MP4. Pérennise les contenus vidéo archivés maintenant que Flash est obsolète.',
    'Convierte videos Flash FLV antiguos a MP4. Asegura el futuro del contenido archivado ahora que Flash está obsoleto.',
    'Converti vecchi video Flash FLV in MP4. Rende a prova di futuro i contenuti video archiviati ora che Flash è obsoleto.',
    'Converta vídeos Flash FLV antigos em MP4. Protege o futuro do conteúdo arquivado agora que o Flash está obsoleto.',
    'Converteer oude Flash FLV-video\'s naar MP4. Toekomstbestendig je gearchiveerde videocontent nu Flash overal verdwijnt.',
    'Konwertuj stare filmy Flash FLV na MP4. Zabezpiecza zarchiwizowane treści wideo na przyszłość, skoro Flash jest wszędzie wycofywany.',
    'Konvertera gamla Flash FLV-videor till MP4. Framtidssäkrar arkiverat videoinnehåll nu när Flash är utfasat överallt.',
    'Konverter gamle Flash FLV-videoer til MP4. Fremtidssikrer arkivert videoinnhold nå som Flash er utfaset overalt.'],

  ['wmv-to-mp4',
    'Convert Windows Media WMV files to universally supported MP4. Perfect for sharing old presentations or recordings on Mac, iOS, and Android.',
    'Konvertiere Windows Media WMV-Dateien in das universell unterstützte MP4. Perfekt zum Teilen alter Präsentationen oder Aufnahmen auf Mac, iOS und Android.',
    'Convertissez des fichiers Windows Media WMV en MP4 universellement pris en charge. Parfait pour partager d\'anciennes présentations ou enregistrements sur Mac, iOS et Android.',
    'Convierte archivos Windows Media WMV a MP4 universalmente compatible. Perfecto para compartir presentaciones o grabaciones antiguas en Mac, iOS y Android.',
    'Converti file Windows Media WMV in MP4 universalmente supportato. Perfetto per condividere vecchie presentazioni o registrazioni su Mac, iOS e Android.',
    'Converta ficheiros Windows Media WMV no MP4 universalmente suportado. Perfeito para partilhar apresentações ou gravações antigas no Mac, iOS e Android.',
    'Converteer Windows Media WMV-bestanden naar het universeel ondersteunde MP4. Perfect voor het delen van oude presentaties of opnamen op Mac, iOS en Android.',
    'Konwertuj pliki Windows Media WMV na uniwersalnie obsługiwany MP4. Idealne do udostępniania starych prezentacji lub nagrań na Macu, iOS i Androidzie.',
    'Konvertera Windows Media WMV-filer till universellt stödda MP4. Perfekt för att dela gamla presentationer eller inspelningar på Mac, iOS och Android.',
    'Konverter Windows Media WMV-filer til universelt støttet MP4. Perfekt for å dele gamle presentasjoner eller opptak på Mac, iOS og Android.'],

  ['mp4-to-mp3',
    'Extract the audio track from MP4 video files as MP3. Great for ripping music, podcasts, or audio recordings from video sources.',
    'Extrahiere die Audiospur aus MP4-Videodateien als MP3. Ideal zum Auslesen von Musik, Podcasts oder Audioaufnahmen aus Videoquellen.',
    'Extrayez la piste audio des fichiers vidéo MP4 au format MP3. Parfait pour récupérer musique, podcasts ou enregistrements audio depuis des vidéos.',
    'Extrae la pista de audio de archivos de video MP4 como MP3. Perfecto para extraer música, podcasts o grabaciones de audio de videos.',
    'Estrai la traccia audio da file video MP4 come MP3. Ottimo per estrarre musica, podcast o registrazioni audio da fonti video.',
    'Extraia a faixa de áudio de ficheiros de vídeo MP4 como MP3. Ótimo para extrair música, podcasts ou gravações de áudio de fontes de vídeo.',
    'Haal de audiotrack uit MP4-videobestanden als MP3. Ideaal om muziek, podcasts of audio-opnamen uit videobronnen te halen.',
    'Wyodrębnij ścieżkę dźwiękową z plików wideo MP4 jako MP3. Świetne do wydobywania muzyki, podcastów lub nagrań audio z wideo.',
    'Extrahera ljudspåret från MP4-videofiler som MP3. Bra för att rippa musik, poddar eller ljudinspelningar från videokällor.',
    'Hent ut lydsporet fra MP4-videofiler som MP3. Flott for å hente ut musikk, podkaster eller lydopptak fra videokilder.'],

  // ── Audio ──
  ['mp3-to-wav',
    'Convert compressed MP3 files to lossless WAV format for audio editing or professional production. Highest possible quality preservation.',
    'Konvertiere komprimierte MP3-Dateien in verlustfreies WAV-Format für Audiobearbeitung oder professionelle Produktion. Höchstmögliche Qualitätserhaltung.',
    'Convertissez des fichiers MP3 compressés au format WAV sans perte pour le montage audio ou la production professionnelle. Qualité maximale préservée.',
    'Convierte archivos MP3 comprimidos al formato WAV sin pérdida para edición de audio o producción profesional. Máxima calidad preservada.',
    'Converti file MP3 compressi nel formato WAV senza perdita per editing audio o produzione professionale. Massima qualità mantenuta.',
    'Converta ficheiros MP3 comprimidos no formato WAV sem perdas para edição de áudio ou produção profissional. Máxima preservação de qualidade.',
    'Converteer gecomprimeerde MP3-bestanden naar verliesloos WAV-formaat voor audiobewerking of professionele productie. Maximale kwaliteitsbehoud.',
    'Konwertuj skompresowane pliki MP3 do bezstratnego formatu WAV do edycji audio lub produkcji profesjonalnej. Najwyższa zachowana jakość.',
    'Konvertera komprimerade MP3-filer till förlustfritt WAV-format för ljudredigering eller professionell produktion. Högsta möjliga kvalitetsbevaring.',
    'Konverter komprimerte MP3-filer til tapsfritt WAV-format for lydredigering eller profesjonell produksjon. Høyest mulig kvalitetsbevaring.'],

  ['wav-to-mp3',
    'Convert lossless WAV files to compact MP3 for storage, streaming, or sharing. Customizable quality settings to balance size and clarity.',
    'Konvertiere verlustfreie WAV-Dateien in kompakte MP3 für Speicherung, Streaming oder Teilen. Anpassbare Qualitätseinstellungen für die Balance zwischen Größe und Klangqualität.',
    'Convertissez des fichiers WAV sans perte en MP3 compacts pour le stockage, le streaming ou le partage. Paramètres de qualité personnalisables.',
    'Convierte archivos WAV sin pérdida a MP3 compactos para almacenamiento, streaming o compartir. Configuración de calidad personalizable.',
    'Converti file WAV senza perdita in MP3 compatti per archiviazione, streaming o condivisione. Impostazioni di qualità personalizzabili.',
    'Converta ficheiros WAV sem perdas em MP3 compactos para armazenamento, streaming ou partilha. Definições de qualidade personalizáveis.',
    'Converteer verliesloze WAV-bestanden naar compacte MP3 voor opslag, streaming of delen. Aanpasbare kwaliteitsinstellingen.',
    'Konwertuj bezstratne pliki WAV na kompaktowy MP3 do przechowywania, streamingu lub udostępniania. Dostosowywalne ustawienia jakości.',
    'Konvertera förlustfria WAV-filer till kompakta MP3 för lagring, streaming eller delning. Anpassningsbara kvalitetsinställningar.',
    'Konverter tapsfrie WAV-filer til kompakte MP3 for lagring, strømming eller deling. Tilpassbare kvalitetsinnstillinger.'],

  ['flac-to-mp3',
    'Convert lossless FLAC audio to MP3 for use in cars, phones, and devices that do not support FLAC. Maintains excellent audio quality at much smaller file sizes.',
    'Konvertiere verlustfreies FLAC-Audio in MP3 für Autos, Handys und Geräte ohne FLAC-Unterstützung. Hervorragende Audioqualität bei deutlich kleineren Dateien.',
    'Convertissez l\'audio FLAC sans perte en MP3 pour les voitures, téléphones et appareils ne prenant pas en charge FLAC. Qualité audio excellente avec des fichiers bien plus petits.',
    'Convierte audio FLAC sin pérdida a MP3 para coches, teléfonos y dispositivos sin soporte FLAC. Mantiene una excelente calidad de audio con tamaños mucho menores.',
    'Converti audio FLAC senza perdita in MP3 per auto, telefoni e dispositivi che non supportano FLAC. Mantiene un\'eccellente qualità audio con file molto più piccoli.',
    'Converta áudio FLAC sem perdas em MP3 para carros, telemóveis e dispositivos sem suporte a FLAC. Mantém excelente qualidade de áudio em ficheiros muito mais pequenos.',
    'Converteer verliesloze FLAC-audio naar MP3 voor auto\'s, telefoons en apparaten zonder FLAC-ondersteuning. Behoudt uitstekende audiokwaliteit bij veel kleinere bestanden.',
    'Konwertuj bezstratne audio FLAC na MP3 do samochodów, telefonów i urządzeń bez obsługi FLAC. Zachowuje doskonałą jakość przy znacznie mniejszych rozmiarach.',
    'Konvertera förlustfri FLAC-ljud till MP3 för bilar, telefoner och enheter utan FLAC-stöd. Bibehåller utmärkt ljudkvalitet vid mycket mindre filstorlekar.',
    'Konverter tapsfri FLAC-lyd til MP3 for biler, telefoner og enheter uten FLAC-støtte. Bevarer utmerket lydkvalitet i mye mindre filstørrelser.'],

  ['aac-to-mp3',
    'Convert AAC audio files to widely-compatible MP3 format. Ideal for using AAC content in older players, software, or hardware.',
    'Konvertiere AAC-Audiodateien in das weit verbreitete MP3-Format. Ideal zur Verwendung von AAC-Inhalten in älteren Playern, Software oder Hardware.',
    'Convertissez des fichiers audio AAC au format MP3 largement compatible. Idéal pour utiliser du contenu AAC dans des lecteurs, logiciels ou matériels plus anciens.',
    'Convierte archivos de audio AAC al formato MP3 ampliamente compatible. Ideal para usar contenido AAC en reproductores, software o hardware antiguos.',
    'Converti file audio AAC nel formato MP3 ampiamente compatibile. Ideale per usare contenuti AAC in lettori, software o hardware meno recenti.',
    'Converta ficheiros de áudio AAC para o formato MP3 amplamente compatível. Ideal para usar conteúdo AAC em leitores, software ou hardware mais antigos.',
    'Converteer AAC-audiobestanden naar het breed compatibele MP3-formaat. Ideaal voor het gebruik van AAC-content in oudere spelers, software of hardware.',
    'Konwertuj pliki audio AAC na powszechnie zgodny format MP3. Idealne do używania treści AAC w starszych odtwarzaczach, oprogramowaniu lub sprzęcie.',
    'Konvertera AAC-ljudfiler till det allmänt kompatibla MP3-formatet. Idealiskt för att använda AAC-innehåll i äldre spelare, programvara eller hårdvara.',
    'Konverter AAC-lydfiler til det bredt kompatible MP3-formatet. Ideelt for å bruke AAC-innhold i eldre spillere, programvare eller maskinvare.'],

  ['ogg-to-mp3',
    'Convert OGG Vorbis audio to MP3 for compatibility with mainstream music players and devices that lack native OGG support.',
    'Konvertiere OGG-Vorbis-Audio in MP3 für Kompatibilität mit gängigen Musikplayern und Geräten ohne native OGG-Unterstützung.',
    'Convertissez de l\'audio OGG Vorbis en MP3 pour la compatibilité avec les lecteurs de musique grand public et appareils sans prise en charge OGG native.',
    'Convierte audio OGG Vorbis a MP3 para compatibilidad con reproductores de música principales y dispositivos sin soporte nativo OGG.',
    'Converti audio OGG Vorbis in MP3 per compatibilità con i lettori musicali più diffusi e dispositivi senza supporto OGG nativo.',
    'Converta áudio OGG Vorbis em MP3 para compatibilidade com leitores de música populares e dispositivos sem suporte nativo a OGG.',
    'Converteer OGG Vorbis-audio naar MP3 voor compatibiliteit met populaire muziekspelers en apparaten zonder native OGG-ondersteuning.',
    'Konwertuj audio OGG Vorbis na MP3 dla zgodności z popularnymi odtwarzaczami muzyki i urządzeniami bez natywnej obsługi OGG.',
    'Konvertera OGG Vorbis-ljud till MP3 för kompatibilitet med vanliga musikspelare och enheter utan inbyggt OGG-stöd.',
    'Konverter OGG Vorbis-lyd til MP3 for kompatibilitet med vanlige musikkavspillere og enheter uten innebygd OGG-støtte.'],

  ['wma-to-mp3',
    'Convert Windows Media Audio files to MP3 for cross-platform playback. Great for migrating old WMA collections to modern devices.',
    'Konvertiere Windows Media Audio-Dateien in MP3 für plattformübergreifende Wiedergabe. Ideal zum Migrieren alter WMA-Sammlungen auf moderne Geräte.',
    'Convertissez des fichiers Windows Media Audio en MP3 pour une lecture multiplateforme. Idéal pour migrer d\'anciennes collections WMA vers des appareils modernes.',
    'Convierte archivos Windows Media Audio a MP3 para reproducción multiplataforma. Ideal para migrar colecciones antiguas de WMA a dispositivos modernos.',
    'Converti file Windows Media Audio in MP3 per la riproduzione multipiattaforma. Ottimo per migrare vecchie collezioni WMA su dispositivi moderni.',
    'Converta ficheiros Windows Media Audio em MP3 para reprodução multiplataforma. Ótimo para migrar coleções antigas de WMA para dispositivos modernos.',
    'Converteer Windows Media Audio-bestanden naar MP3 voor cross-platform afspelen. Ideaal om oude WMA-collecties naar moderne apparaten te migreren.',
    'Konwertuj pliki Windows Media Audio na MP3 dla wieloplatformowego odtwarzania. Świetne do migracji starych kolekcji WMA na nowoczesne urządzenia.',
    'Konvertera Windows Media Audio-filer till MP3 för plattformsoberoende uppspelning. Bra för att migrera gamla WMA-samlingar till moderna enheter.',
    'Konverter Windows Media Audio-filer til MP3 for avspilling på tvers av plattformer. Flott for å migrere gamle WMA-samlinger til moderne enheter.'],

  ['m4a-to-mp3',
    'Convert iTunes-style M4A audio to MP3 for use on any device. Particularly useful for moving music libraries off Apple platforms.',
    'Konvertiere M4A-Audio im iTunes-Stil in MP3 zur Verwendung auf jedem Gerät. Besonders nützlich beim Umzug von Musikbibliotheken von Apple-Plattformen.',
    'Convertissez l\'audio M4A de style iTunes en MP3 pour une utilisation sur n\'importe quel appareil. Particulièrement utile pour migrer des bibliothèques musicales hors des plateformes Apple.',
    'Convierte audio M4A estilo iTunes a MP3 para usar en cualquier dispositivo. Particularmente útil para mover bibliotecas musicales fuera de las plataformas de Apple.',
    'Converti audio M4A in stile iTunes in MP3 per usarlo su qualsiasi dispositivo. Particolarmente utile per spostare librerie musicali fuori dalle piattaforme Apple.',
    'Converta áudio M4A estilo iTunes em MP3 para uso em qualquer dispositivo. Especialmente útil para migrar bibliotecas de música para fora das plataformas Apple.',
    'Converteer iTunes-stijl M4A-audio naar MP3 voor gebruik op elk apparaat. Vooral handig om muziekbibliotheken van Apple-platforms te verplaatsen.',
    'Konwertuj audio M4A w stylu iTunes na MP3 do użycia na dowolnym urządzeniu. Szczególnie przydatne do przenoszenia bibliotek muzycznych poza platformy Apple.',
    'Konvertera iTunes-stil M4A-ljud till MP3 för användning på alla enheter. Särskilt användbart för att flytta musikbibliotek från Apple-plattformar.',
    'Konverter iTunes-stil M4A-lyd til MP3 for bruk på enhver enhet. Spesielt nyttig for å flytte musikkbibliotek fra Apple-plattformer.'],

  ['mp3-to-aac',
    'Convert MP3 to higher-quality AAC format. AAC achieves better sound at the same bitrate, ideal for streaming and modern playback.',
    'Konvertiere MP3 in das hochwertigere AAC-Format. AAC erzielt besseren Klang bei gleicher Bitrate, ideal für Streaming und moderne Wiedergabe.',
    'Convertissez MP3 au format AAC de meilleure qualité. AAC offre un meilleur son au même débit, idéal pour le streaming et la lecture moderne.',
    'Convierte MP3 al formato AAC de mayor calidad. AAC logra mejor sonido al mismo bitrate, ideal para streaming y reproducción moderna.',
    'Converti MP3 nel formato AAC di qualità superiore. AAC offre un suono migliore allo stesso bitrate, ideale per streaming e riproduzione moderna.',
    'Converta MP3 para o formato AAC de maior qualidade. O AAC oferece melhor som ao mesmo bitrate, ideal para streaming e reprodução moderna.',
    'Converteer MP3 naar het kwalitatief hoogwaardigere AAC-formaat. AAC biedt betere klank bij dezelfde bitrate, ideaal voor streaming en moderne weergave.',
    'Konwertuj MP3 na format AAC o wyższej jakości. AAC zapewnia lepszy dźwięk przy tej samej przepływności, idealny do streamingu i nowoczesnego odtwarzania.',
    'Konvertera MP3 till det högre kvalitativa AAC-formatet. AAC ger bättre ljud vid samma bitrate, idealiskt för streaming och modern uppspelning.',
    'Konverter MP3 til det høyere kvalitets-AAC-formatet. AAC gir bedre lyd ved samme bithastighet, ideelt for strømming og moderne avspilling.'],

  // ── Archive ──
  ['rar-to-zip',
    'Convert RAR archives to universally supported ZIP format. No need for special software — extract anywhere, on any operating system.',
    'Konvertiere RAR-Archive in das universell unterstützte ZIP-Format. Keine Spezialsoftware nötig — entpacke überall, auf jedem Betriebssystem.',
    'Convertissez des archives RAR au format ZIP universellement pris en charge. Pas besoin de logiciel spécial — extrayez partout, sur tout système d\'exploitation.',
    'Convierte archivos RAR al formato ZIP universalmente compatible. Sin software especial — extrae en cualquier sistema operativo.',
    'Converti archivi RAR nel formato ZIP universalmente supportato. Nessun software speciale — estrai ovunque, su qualsiasi sistema operativo.',
    'Converta arquivos RAR no formato ZIP universalmente suportado. Sem necessidade de software especial — extraia em qualquer sistema operativo.',
    'Converteer RAR-archieven naar het universeel ondersteunde ZIP-formaat. Geen speciale software nodig — uitpakken op elk besturingssysteem.',
    'Konwertuj archiwa RAR na uniwersalnie obsługiwany format ZIP. Bez specjalnego oprogramowania — rozpakuj wszędzie, w dowolnym systemie operacyjnym.',
    'Konvertera RAR-arkiv till det universellt stödda ZIP-formatet. Ingen specialprogramvara behövs — packa upp var som helst, på alla operativsystem.',
    'Konverter RAR-arkiver til det universelt støttede ZIP-formatet. Ingen spesialprogramvare nødvendig — pakk ut hvor som helst, på alle operativsystemer.'],

  ['7z-to-zip',
    'Convert 7Z archives to ZIP for compatibility with built-in tools on every operating system. Easier sharing without requiring 7-Zip software.',
    'Konvertiere 7Z-Archive in ZIP für Kompatibilität mit integrierten Tools jedes Betriebssystems. Einfacheres Teilen ohne 7-Zip-Software.',
    'Convertissez des archives 7Z en ZIP pour la compatibilité avec les outils intégrés de chaque système. Partage plus facile sans nécessiter 7-Zip.',
    'Convierte archivos 7Z a ZIP para compatibilidad con herramientas integradas en cualquier sistema. Compartir sin necesidad de 7-Zip.',
    'Converti archivi 7Z in ZIP per compatibilità con gli strumenti integrati di ogni sistema operativo. Condivisione facile senza dover usare 7-Zip.',
    'Converta arquivos 7Z em ZIP para compatibilidade com as ferramentas integradas em todos os sistemas operativos. Partilha mais fácil sem precisar do 7-Zip.',
    'Converteer 7Z-archieven naar ZIP voor compatibiliteit met de ingebouwde tools van elk besturingssysteem. Makkelijker delen zonder 7-Zip.',
    'Konwertuj archiwa 7Z na ZIP dla zgodności z wbudowanymi narzędziami w każdym systemie operacyjnym. Łatwiejsze udostępnianie bez 7-Zip.',
    'Konvertera 7Z-arkiv till ZIP för kompatibilitet med inbyggda verktyg i alla operativsystem. Enklare delning utan 7-Zip-programvara.',
    'Konverter 7Z-arkiver til ZIP for kompatibilitet med innebygde verktøy i alle operativsystemer. Enklere deling uten 7-Zip.'],

  ['tar-to-zip',
    'Convert Linux TAR archives to Windows-friendly ZIP format. Perfect for sharing developer files with non-technical users.',
    'Konvertiere Linux-TAR-Archive in das Windows-freundliche ZIP-Format. Perfekt zum Teilen von Entwicklerdateien mit nicht-technischen Nutzern.',
    'Convertissez des archives Linux TAR au format ZIP compatible Windows. Parfait pour partager des fichiers développeur avec des utilisateurs non techniques.',
    'Convierte archivos TAR de Linux al formato ZIP compatible con Windows. Perfecto para compartir archivos de desarrollador con usuarios no técnicos.',
    'Converti archivi TAR Linux nel formato ZIP compatibile con Windows. Perfetto per condividere file di sviluppatori con utenti non tecnici.',
    'Converta arquivos TAR do Linux no formato ZIP compatível com Windows. Perfeito para partilhar ficheiros de programador com utilizadores não técnicos.',
    'Converteer Linux TAR-archieven naar het Windows-vriendelijke ZIP-formaat. Perfect voor het delen van developer-bestanden met niet-technische gebruikers.',
    'Konwertuj archiwa TAR z Linuksa na przyjazny dla Windows format ZIP. Idealne do udostępniania plików programistycznych nietechnicznym użytkownikom.',
    'Konvertera Linux TAR-arkiv till det Windows-vänliga ZIP-formatet. Perfekt för att dela utvecklarfiler med icke-tekniska användare.',
    'Konverter Linux TAR-arkiver til det Windows-vennlige ZIP-formatet. Perfekt for å dele utviklerfiler med ikke-tekniske brukere.'],

  ['gz-to-zip',
    'Convert GZIP files to ZIP for easier extraction without command-line tools. Great for moving files from Linux to Windows users.',
    'Konvertiere GZIP-Dateien in ZIP zum einfacheren Entpacken ohne Befehlszeilentools. Ideal beim Übertragen von Dateien von Linux- zu Windows-Nutzern.',
    'Convertissez des fichiers GZIP en ZIP pour une extraction plus facile sans outils en ligne de commande. Idéal pour migrer des fichiers de Linux vers Windows.',
    'Convierte archivos GZIP a ZIP para extracción más sencilla sin herramientas de línea de comandos. Ideal para mover archivos de Linux a Windows.',
    'Converti file GZIP in ZIP per un\'estrazione più facile senza strumenti da riga di comando. Ottimo per spostare file da Linux a Windows.',
    'Converta ficheiros GZIP em ZIP para extração mais fácil sem ferramentas de linha de comandos. Ótimo para mover ficheiros de Linux para Windows.',
    'Converteer GZIP-bestanden naar ZIP voor eenvoudiger uitpakken zonder command-line tools. Ideaal om bestanden van Linux naar Windows te verplaatsen.',
    'Konwertuj pliki GZIP na ZIP dla łatwiejszego rozpakowywania bez narzędzi wiersza poleceń. Świetne do przenoszenia plików z Linuksa na Windows.',
    'Konvertera GZIP-filer till ZIP för enklare uppackning utan kommandoradsverktyg. Bra för att flytta filer från Linux till Windows-användare.',
    'Konverter GZIP-filer til ZIP for enklere utpakking uten kommandolinjeverktøy. Flott for å flytte filer fra Linux til Windows-brukere.'],

  ['zip-to-7z',
    'Convert ZIP files to 7Z for stronger compression and smaller file sizes. Ideal for archiving large folders or saving cloud storage space.',
    'Konvertiere ZIP-Dateien in 7Z für stärkere Komprimierung und kleinere Dateigrößen. Ideal zum Archivieren großer Ordner oder Sparen von Cloud-Speicher.',
    'Convertissez des fichiers ZIP en 7Z pour une compression plus forte et des tailles plus petites. Idéal pour archiver de gros dossiers ou économiser du stockage cloud.',
    'Convierte archivos ZIP a 7Z para mayor compresión y archivos más pequeños. Ideal para archivar carpetas grandes o ahorrar almacenamiento en la nube.',
    'Converti file ZIP in 7Z per una compressione più forte e dimensioni più piccole. Ideale per archiviare cartelle grandi o risparmiare spazio cloud.',
    'Converta ficheiros ZIP em 7Z para maior compressão e tamanhos menores. Ideal para arquivar pastas grandes ou poupar espaço na nuvem.',
    'Converteer ZIP-bestanden naar 7Z voor sterkere compressie en kleinere bestanden. Ideaal voor het archiveren van grote mappen of besparen van cloudopslag.',
    'Konwertuj pliki ZIP na 7Z dla silniejszej kompresji i mniejszych rozmiarów. Idealne do archiwizacji dużych folderów lub oszczędzania miejsca w chmurze.',
    'Konvertera ZIP-filer till 7Z för starkare komprimering och mindre filstorlekar. Idealiskt för att arkivera stora mappar eller spara molnlagring.',
    'Konverter ZIP-filer til 7Z for sterkere komprimering og mindre filstørrelser. Ideelt for å arkivere store mapper eller spare skylagring.'],

  // ── PDF Tools ──
  ['merge-pdf',
    'Combine multiple PDF documents into a single file. Reorder pages by drag-and-drop, with no limit on how many documents you can merge at once.',
    'Kombiniere mehrere PDF-Dokumente zu einer einzigen Datei. Ordne Seiten per Drag-and-Drop neu — ohne Begrenzung der Dokumentanzahl.',
    'Combinez plusieurs documents PDF en un seul fichier. Réorganisez les pages par glisser-déposer, sans limite sur le nombre de documents fusionnés.',
    'Combina varios documentos PDF en un único archivo. Reordena páginas con arrastrar y soltar, sin límite en la cantidad de documentos.',
    'Combina più documenti PDF in un unico file. Riordina le pagine con drag-and-drop, senza limiti sul numero di documenti.',
    'Combine vários documentos PDF num único ficheiro. Reordene páginas arrastando, sem limite no número de documentos a unir.',
    'Combineer meerdere PDF-documenten in één bestand. Herschik pagina\'s met slepen en neerzetten, zonder limiet op het aantal documenten.',
    'Połącz wiele dokumentów PDF w jeden plik. Zmieniaj kolejność stron metodą przeciągnij i upuść, bez limitu liczby dokumentów.',
    'Kombinera flera PDF-dokument till en enda fil. Ordna om sidor med dra-och-släpp, utan gräns för hur många dokument du kan slå ihop.',
    'Slå sammen flere PDF-dokumenter til én fil. Endre rekkefølgen på sider med dra-og-slipp, uten grense for antall dokumenter.'],

  ['split-pdf',
    'Extract specific pages or page ranges from a PDF into separate files. Enter ranges like "1-3, 5, 7-10" to choose exactly which pages you want.',
    'Extrahiere bestimmte Seiten oder Seitenbereiche aus einem PDF in separate Dateien. Gib Bereiche wie "1-3, 5, 7-10" ein, um genau zu wählen.',
    'Extrayez des pages spécifiques ou des plages de pages d\'un PDF dans des fichiers séparés. Saisissez des plages comme "1-3, 5, 7-10".',
    'Extrae páginas o rangos específicos de un PDF en archivos separados. Introduce rangos como "1-3, 5, 7-10" para elegir exactamente qué páginas.',
    'Estrai pagine specifiche o intervalli di pagine da un PDF in file separati. Inserisci intervalli come "1-3, 5, 7-10".',
    'Extraia páginas específicas ou intervalos de páginas de um PDF em ficheiros separados. Introduza intervalos como "1-3, 5, 7-10".',
    'Haal specifieke pagina\'s of paginabereiken uit een PDF in aparte bestanden. Voer bereiken in zoals "1-3, 5, 7-10".',
    'Wyodrębnij określone strony lub zakresy stron z PDF do osobnych plików. Wprowadź zakresy takie jak "1-3, 5, 7-10".',
    'Extrahera specifika sidor eller sidområden från en PDF till separata filer. Ange intervall som "1-3, 5, 7-10" för att välja exakt vilka sidor.',
    'Hent ut bestemte sider eller sideområder fra en PDF til separate filer. Skriv inn områder som "1-3, 5, 7-10" for å velge nøyaktig hvilke sider.'],

  ['compress-pdf',
    'Reduce the file size of PDF documents while preserving readability. Perfect for email attachments, web uploads, and storage savings.',
    'Reduziere die Dateigröße von PDF-Dokumenten bei voller Lesbarkeit. Perfekt für E-Mail-Anhänge, Web-Uploads und Speichereinsparungen.',
    'Réduisez la taille des documents PDF tout en préservant la lisibilité. Parfait pour les pièces jointes, téléversements web et économies de stockage.',
    'Reduce el tamaño de archivos PDF manteniendo la legibilidad. Perfecto para adjuntos de correo, subidas web y ahorro de almacenamiento.',
    'Riduci le dimensioni dei documenti PDF mantenendo la leggibilità. Perfetto per allegati email, caricamenti web e risparmio di spazio.',
    'Reduza o tamanho de documentos PDF mantendo a legibilidade. Perfeito para anexos de email, uploads web e poupança de armazenamento.',
    'Verklein PDF-documenten met behoud van leesbaarheid. Perfect voor e-mailbijlagen, webuploads en opslagbesparing.',
    'Zmniejsz rozmiar dokumentów PDF z zachowaniem czytelności. Idealne dla załączników mailowych, przesyłania na strony i oszczędności miejsca.',
    'Minska filstorleken på PDF-dokument med bibehållen läsbarhet. Perfekt för e-postbilagor, webbuppladdningar och lagringsbesparingar.',
    'Reduser filstørrelsen på PDF-dokumenter med bevart lesbarhet. Perfekt for e-postvedlegg, nettopplastinger og lagringsbesparelse.'],

  ['rotate-pdf',
    'Rotate one or all pages of a PDF by 90, 180, or 270 degrees. Quickly fix scanned documents that are sideways or upside down.',
    'Drehe eine oder alle Seiten eines PDFs um 90, 180 oder 270 Grad. Korrigiere schnell gescannte Dokumente, die seitwärts oder kopfüber sind.',
    'Faites pivoter une ou toutes les pages d\'un PDF de 90, 180 ou 270 degrés. Corrigez rapidement les documents numérisés mal orientés.',
    'Rota una o todas las páginas de un PDF 90, 180 o 270 grados. Corrige rápidamente documentos escaneados de lado o al revés.',
    'Ruota una o tutte le pagine di un PDF di 90, 180 o 270 gradi. Sistema rapidamente i documenti scansionati capovolti o di lato.',
    'Rode uma ou todas as páginas de um PDF em 90, 180 ou 270 graus. Corrija rapidamente documentos digitalizados invertidos ou de lado.',
    'Draai een of alle pagina\'s van een PDF 90, 180 of 270 graden. Corrigeer snel gescande documenten die zijwaarts of ondersteboven staan.',
    'Obróć jedną lub wszystkie strony PDF o 90, 180 lub 270 stopni. Szybko popraw zeskanowane dokumenty obrócone bokiem lub do góry nogami.',
    'Rotera en eller alla sidor i en PDF 90, 180 eller 270 grader. Korrigera snabbt skannade dokument som är på sidan eller upp och ned.',
    'Roter én eller alle sider i en PDF 90, 180 eller 270 grader. Fiks raskt skannede dokumenter som er på siden eller opp ned.'],

  ['protect-pdf',
    'Encrypt your PDF with a password to prevent unauthorized access. Industry-standard AES encryption keeps confidential documents secure.',
    'Verschlüssele dein PDF mit einem Passwort, um unbefugten Zugriff zu verhindern. AES-Verschlüsselung nach Industriestandard schützt vertrauliche Dokumente.',
    'Chiffrez votre PDF avec un mot de passe pour empêcher tout accès non autorisé. Le chiffrement AES standard protège les documents confidentiels.',
    'Cifra tu PDF con una contraseña para evitar accesos no autorizados. El cifrado AES estándar mantiene seguros los documentos confidenciales.',
    'Cifra il tuo PDF con una password per impedire accessi non autorizzati. La crittografia AES standard protegge i documenti riservati.',
    'Cifre o seu PDF com uma palavra-passe para impedir acesso não autorizado. A encriptação AES padrão protege documentos confidenciais.',
    'Versleutel je PDF met een wachtwoord om ongeautoriseerde toegang te voorkomen. AES-versleuteling op industrienorm beveiligt vertrouwelijke documenten.',
    'Zaszyfruj swój plik PDF hasłem, aby zapobiec nieautoryzowanemu dostępowi. Standardowe szyfrowanie AES chroni poufne dokumenty.',
    'Kryptera din PDF med ett lösenord för att förhindra obehörig åtkomst. AES-kryptering enligt branschstandard skyddar konfidentiella dokument.',
    'Krypter PDF-en din med et passord for å hindre uautorisert tilgang. AES-kryptering i bransjestandard beskytter konfidensielle dokumenter.'],

  ['unlock-pdf',
    'Remove password protection from PDFs you own. Restore full editing and printing access to your secured documents.',
    'Entferne den Passwortschutz von PDFs, die dir gehören. Stelle vollen Bearbeitungs- und Druckzugriff auf deine geschützten Dokumente wieder her.',
    'Supprimez la protection par mot de passe des PDF qui vous appartiennent. Restaurez l\'accès complet à l\'édition et à l\'impression.',
    'Elimina la protección por contraseña de los PDF que posees. Restaura el acceso completo a edición e impresión de tus documentos.',
    'Rimuovi la protezione con password dai PDF di tua proprietà. Ripristina l\'accesso completo alla modifica e alla stampa.',
    'Remova a proteção por palavra-passe dos PDFs que possui. Restaure o acesso total à edição e impressão dos seus documentos.',
    'Verwijder wachtwoordbeveiliging van PDF\'s die je bezit. Herstel volledige bewerkings- en afdruktoegang tot je beveiligde documenten.',
    'Usuń ochronę hasłem z plików PDF, których jesteś właścicielem. Przywróć pełny dostęp do edycji i drukowania zabezpieczonych dokumentów.',
    'Ta bort lösenordsskydd från PDF-filer du äger. Återställ fullständig redigerings- och utskriftsåtkomst till dina skyddade dokument.',
    'Fjern passordbeskyttelse fra PDF-er du eier. Gjenopprett full redigerings- og utskriftstilgang til de beskyttede dokumentene dine.'],

  // ── Utilities ──
  ['view-metadata',
    'Inspect detailed metadata embedded in any file: dimensions, duration, codecs, EXIF camera info, document properties, and more. No conversion needed.',
    'Untersuche detaillierte Metadaten in jeder Datei: Abmessungen, Dauer, Codecs, EXIF-Kamerainfos, Dokumenteigenschaften und mehr. Keine Konvertierung nötig.',
    'Inspectez les métadonnées détaillées de tout fichier : dimensions, durée, codecs, informations EXIF, propriétés du document, et plus. Aucune conversion nécessaire.',
    'Inspecciona los metadatos detallados de cualquier archivo: dimensiones, duración, códecs, datos EXIF, propiedades del documento y más. Sin conversión.',
    'Ispeziona i metadati dettagliati di qualsiasi file: dimensioni, durata, codec, info EXIF, proprietà del documento e altro. Nessuna conversione necessaria.',
    'Inspecione os metadados detalhados de qualquer ficheiro: dimensões, duração, codecs, info EXIF, propriedades do documento e mais. Sem conversão.',
    'Bekijk gedetailleerde metadata van elk bestand: afmetingen, duur, codecs, EXIF-camera-info, documentkenmerken en meer. Geen conversie nodig.',
    'Sprawdź szczegółowe metadane dowolnego pliku: wymiary, czas trwania, kodeki, informacje EXIF, właściwości dokumentu i więcej. Bez konwersji.',
    'Inspektera detaljerade metadata i alla filer: dimensioner, längd, codecs, EXIF-kamerainformation, dokumentegenskaper med mera. Ingen konvertering behövs.',
    'Inspiser detaljerte metadata i enhver fil: dimensjoner, varighet, kodeker, EXIF-kamerainfo, dokumentegenskaper og mer. Ingen konvertering nødvendig.'],

  // ── Smart Functions ──
  ['ocr',
    'Extract editable text from scanned PDFs and photos using optical character recognition. Outputs searchable PDF or plain text in your chosen language.',
    'Extrahiere bearbeitbaren Text aus gescannten PDFs und Fotos per optischer Zeichenerkennung. Liefert durchsuchbares PDF oder Klartext in deiner Wunschsprache.',
    'Extrayez le texte éditable des PDF scannés et photos par reconnaissance optique de caractères. Produit un PDF consultable ou du texte brut dans la langue choisie.',
    'Extrae texto editable de PDF escaneados y fotos mediante reconocimiento óptico de caracteres. Genera PDF buscable o texto plano en el idioma elegido.',
    'Estrai testo modificabile da PDF scansionati e foto tramite riconoscimento ottico dei caratteri. Produce PDF ricercabile o testo semplice nella lingua scelta.',
    'Extraia texto editável de PDFs digitalizados e fotos usando reconhecimento ótico de caracteres. Gera PDF pesquisável ou texto simples no idioma escolhido.',
    'Haal bewerkbare tekst uit gescande PDF\'s en foto\'s met optische tekenherkenning. Genereert doorzoekbare PDF of platte tekst in de gekozen taal.',
    'Wyodrębnij edytowalny tekst ze zeskanowanych PDF-ów i zdjęć za pomocą optycznego rozpoznawania znaków. Tworzy przeszukiwalny PDF lub tekst w wybranym języku.',
    'Extrahera redigerbar text från skannade PDF-filer och foton med optisk teckenigenkänning. Ger en sökbar PDF eller ren text på det valda språket.',
    'Hent ut redigerbar tekst fra skannede PDF-er og bilder med optisk tegngjenkjenning. Gir søkbar PDF eller ren tekst på valgt språk.'],

  ['pdf-compress-ai',
    'AI-powered PDF compression that intelligently reduces file size while preserving the quality of text and images. Achieves smaller files than traditional compression.',
    'KI-gestützte PDF-Komprimierung, die die Dateigröße intelligent reduziert und Text- und Bildqualität bewahrt. Erzielt kleinere Dateien als herkömmliche Komprimierung.',
    'Compression PDF par IA qui réduit intelligemment la taille tout en préservant la qualité du texte et des images. Plus efficace que la compression classique.',
    'Compresión PDF con IA que reduce el tamaño de forma inteligente preservando la calidad de texto e imágenes. Logra archivos más pequeños que la compresión tradicional.',
    'Compressione PDF con IA che riduce intelligentemente le dimensioni preservando la qualità di testo e immagini. Risultati migliori della compressione tradizionale.',
    'Compressão PDF com IA que reduz inteligentemente o tamanho preservando a qualidade de texto e imagens. Obtém ficheiros menores que a compressão tradicional.',
    'AI-gestuurde PDF-compressie die intelligent de bestandsgrootte verkleint met behoud van tekst- en beeldkwaliteit. Kleinere bestanden dan traditionele compressie.',
    'Kompresja PDF z AI, która inteligentnie zmniejsza rozmiar, zachowując jakość tekstu i obrazów. Mniejsze pliki niż tradycyjna kompresja.',
    'AI-driven PDF-komprimering som intelligent minskar filstorlek samtidigt som text- och bildkvalitet bevaras. Mindre filer än traditionell komprimering.',
    'AI-drevet PDF-komprimering som intelligent reduserer filstørrelse mens tekst- og bildekvalitet bevares. Mindre filer enn tradisjonell komprimering.'],

  ['document-translation',
    'Coming soon: automatically translate documents between dozens of languages while preserving the original layout and formatting.',
    'Demnächst verfügbar: Dokumente automatisch zwischen Dutzenden Sprachen übersetzen — bei Erhalt des ursprünglichen Layouts und Formatierung.',
    'Bientôt disponible : traduisez automatiquement des documents entre des dizaines de langues tout en préservant la mise en page et le formatage d\'origine.',
    'Próximamente: traduce automáticamente documentos entre decenas de idiomas conservando el diseño y formato originales.',
    'In arrivo: traduci automaticamente documenti tra decine di lingue mantenendo layout e formattazione originali.',
    'Em breve: traduza automaticamente documentos entre dezenas de idiomas preservando a disposição e formatação originais.',
    'Binnenkort beschikbaar: automatisch documenten vertalen tussen tientallen talen met behoud van de originele lay-out en opmaak.',
    'Wkrótce: automatyczne tłumaczenie dokumentów między dziesiątkami języków z zachowaniem oryginalnego układu i formatowania.',
    'Kommer snart: översätt automatiskt dokument mellan dussintals språk med bibehållen ursprunglig layout och formatering.',
    'Kommer snart: oversett dokumenter automatisk mellom titalls språk med bevart originaloppsett og formatering.'],

  ['text-to-speech',
    'Convert any text to natural-sounding speech using OpenAI voices. Choose from six voice characters and three audio formats including MP3.',
    'Konvertiere beliebigen Text in natürlich klingende Sprache mit OpenAI-Stimmen. Wähle aus sechs Sprechercharakteren und drei Audioformaten einschließlich MP3.',
    'Convertissez n\'importe quel texte en voix naturelle avec les voix OpenAI. Choisissez parmi six personnages de voix et trois formats audio dont MP3.',
    'Convierte cualquier texto en voz natural con las voces de OpenAI. Elige entre seis personajes de voz y tres formatos de audio incluido MP3.',
    'Converti qualsiasi testo in parlato naturale con le voci OpenAI. Scegli tra sei voci e tre formati audio incluso MP3.',
    'Converta qualquer texto em voz natural com as vozes OpenAI. Escolha entre seis personagens de voz e três formatos de áudio incluindo MP3.',
    'Zet elke tekst om naar natuurlijk klinkende spraak met OpenAI-stemmen. Kies uit zes stemkarakters en drie audioformaten waaronder MP3.',
    'Zamień dowolny tekst na naturalnie brzmiącą mowę z głosami OpenAI. Wybieraj spośród sześciu postaci głosowych i trzech formatów audio, w tym MP3.',
    'Konvertera valfri text till naturligt klingande tal med OpenAI-röster. Välj bland sex röstkaraktärer och tre ljudformat inklusive MP3.',
    'Konverter hvilken som helst tekst til naturlig klingende tale med OpenAI-stemmer. Velg mellom seks stemmekarakterer og tre lydformater inkludert MP3.'],

  ['speech-to-text',
    'Transcribe audio recordings, meetings, or interviews into text using OpenAI Whisper. Supports over 50 languages with high accuracy.',
    'Transkribiere Audioaufnahmen, Meetings oder Interviews per OpenAI Whisper in Text. Unterstützt über 50 Sprachen mit hoher Genauigkeit.',
    'Transcrivez des enregistrements audio, réunions ou interviews en texte avec OpenAI Whisper. Plus de 50 langues prises en charge avec une grande précision.',
    'Transcribe grabaciones de audio, reuniones o entrevistas a texto con OpenAI Whisper. Más de 50 idiomas con alta precisión.',
    'Trascrivi registrazioni audio, riunioni o interviste in testo con OpenAI Whisper. Oltre 50 lingue con elevata accuratezza.',
    'Transcreva gravações de áudio, reuniões ou entrevistas em texto usando OpenAI Whisper. Suporta mais de 50 idiomas com elevada precisão.',
    'Transcribeer audio-opnamen, vergaderingen of interviews naar tekst met OpenAI Whisper. Ondersteunt meer dan 50 talen met hoge nauwkeurigheid.',
    'Transkrybuj nagrania audio, spotkania lub wywiady na tekst za pomocą OpenAI Whisper. Obsługuje ponad 50 języków z wysoką dokładnością.',
    'Transkribera ljudinspelningar, möten eller intervjuer till text med OpenAI Whisper. Stöder över 50 språk med hög noggrannhet.',
    'Transkriber lydopptak, møter eller intervjuer til tekst med OpenAI Whisper. Støtter over 50 språk med høy nøyaktighet.'],

  ['auto-subtitle',
    'Generate accurate, time-coded SRT or VTT subtitle files from any video. Powered by OpenAI Whisper for professional-quality results in over 50 languages.',
    'Erstelle präzise, zeitgenaue SRT- oder VTT-Untertitel aus jedem Video. Mit OpenAI Whisper für professionelle Ergebnisse in über 50 Sprachen.',
    'Générez des fichiers de sous-titres SRT ou VTT précis et synchronisés à partir de toute vidéo. Propulsé par OpenAI Whisper, qualité professionnelle dans plus de 50 langues.',
    'Genera archivos SRT o VTT con subtítulos precisos y sincronizados desde cualquier video. Con OpenAI Whisper para resultados profesionales en más de 50 idiomas.',
    'Genera file di sottotitoli SRT o VTT accurati e sincronizzati da qualsiasi video. Basato su OpenAI Whisper per risultati professionali in oltre 50 lingue.',
    'Gere ficheiros de legendas SRT ou VTT precisos e sincronizados a partir de qualquer vídeo. Com OpenAI Whisper para resultados profissionais em mais de 50 idiomas.',
    'Genereer nauwkeurige, getimede SRT- of VTT-ondertitelbestanden van elke video. Aangedreven door OpenAI Whisper voor professionele kwaliteit in meer dan 50 talen.',
    'Generuj dokładne, kodowane czasem pliki napisów SRT lub VTT z dowolnego filmu. Oparte na OpenAI Whisper dla profesjonalnych wyników w ponad 50 językach.',
    'Generera exakta, tidkodade SRT- eller VTT-undertextfiler från valfri video. Drivs av OpenAI Whisper för professionell kvalitet på över 50 språk.',
    'Generer nøyaktige, tidskodede SRT- eller VTT-undertekstfiler fra enhver video. Drevet av OpenAI Whisper for profesjonell kvalitet på over 50 språk.'],
];

// =====================================================================
// Build per-language { slug: text } objects
// =====================================================================
const LANGS = ['en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'sv', 'no'];

const PAYLOADS = {};
for (const lang of LANGS) PAYLOADS[lang] = {};
for (const row of ROWS) {
  const [slug, ...texts] = row;
  for (let i = 0; i < LANGS.length; i++) {
    PAYLOADS[LANGS[i]][slug] = texts[i];
  }
}

// =====================================================================
// Helpers
// =====================================================================
function formatObjectLiteral(obj, indent = '  ') {
  const inner = Object.entries(obj)
    .map(([k, v]) => `${indent}  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join('\n');
  return `{\n${inner}\n${indent}}`;
}

function findKeyBlock(text, keyName, scopeStart, scopeEnd) {
  const re = new RegExp(`(\\b${keyName}:\\s*)\\{`, 'g');
  re.lastIndex = scopeStart;
  const m = re.exec(text);
  if (!m || m.index >= scopeEnd) return null;
  const open = m.index + m[0].length - 1;
  let depth = 0;
  for (let i = open; i < scopeEnd; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') { depth--; if (depth === 0) return { start: m.index, end: i + 1 }; }
  }
  return null;
}

function findEnSourceBlock(text) {
  const start = text.indexOf('const en = {');
  if (start === -1) throw new Error('Could not find `const en = {` in i18n.js');
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') { depth--; if (depth === 0) return { start, end: i + 1 }; }
  }
  throw new Error('Unterminated `const en` literal');
}

function findLangBlock(text, langName) {
  const start = text.indexOf(`const ${langName} = {`);
  if (start === -1) throw new Error(`Section not found: ${langName}`);
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') { depth--; if (depth === 0) return { start, end: i + 1 }; }
  }
  throw new Error(`Unterminated section: ${langName}`);
}

function injectOrReplaceTopLevelKey(text, keyName, payloadObj, scopeStart, scopeEnd) {
  const block = findKeyBlock(text, keyName, scopeStart, scopeEnd);
  if (block) {
    return text.slice(0, block.start) + `${keyName}: ${formatObjectLiteral(payloadObj)}` + text.slice(block.end);
  }
  // Insert before the closing `}` of the scope. scopeEnd is the index
  // after the closing brace, so the brace itself is at scopeEnd - 1.
  let i = scopeEnd - 2;
  while (i > scopeStart && /\s/.test(text[i])) i--;
  const needsLeadingComma = text[i] !== ',' && text[i] !== '{';
  const insertion = `${needsLeadingComma ? ',' : ''}\n  ${keyName}: ${formatObjectLiteral(payloadObj, '  ')},\n`;
  return text.slice(0, scopeEnd - 1) + insertion + text.slice(scopeEnd - 1);
}

// =====================================================================
// Patch i18n.js (en source)
// =====================================================================
let enContent = fs.readFileSync(I18N_EN, 'utf8');
const enBlock = findEnSourceBlock(enContent);
enContent = injectOrReplaceTopLevelKey(enContent, 'toolDescriptions', PAYLOADS.en, enBlock.start, enBlock.end);
fs.writeFileSync(I18N_EN, enContent);
console.log('✔ en (i18n.js)');

// =====================================================================
// Patch i18n-translations.js (de/fr/es/it/pt/nl/pl/sv/no)
// =====================================================================
let trContent = fs.readFileSync(I18N_TRANS, 'utf8');
for (const lang of LANGS.filter((l) => l !== 'en')) {
  const block = findLangBlock(trContent, lang);
  trContent = injectOrReplaceTopLevelKey(trContent, 'toolDescriptions', PAYLOADS[lang], block.start, block.end);
  console.log('✔ ' + lang + ' (i18n-translations.js)');
}
fs.writeFileSync(I18N_TRANS, trContent);

console.log('\nDone — toolDescriptions added for ' + LANGS.length + ' languages × ' + ROWS.length + ' tools.');
