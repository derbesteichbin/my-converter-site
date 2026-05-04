// Replaces every language's `metadataPage` block with the complete
// 47-key set: 7 page strings + 1 SEO description + 39 result-table
// label strings. Covers en (i18n.js) and all 16 other language packs
// (i18n-translations.js).
//
// Run from repo root:  node scripts/fill-metadata-page.js

const fs = require('fs');
const path = require('path');

const I18N_EN = path.join(__dirname, '..', 'client', 'src', 'i18n.js');
const I18N_TRANS = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');

// Languages, in column order:
const LANGS = ['en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'cs', 'ro', 'hu', 'el', 'tr'];

// Each row is [keyPath, en, de, fr, es, it, pt, nl, pl, sv, no, da, fi, cs, ro, hu, el, tr].
// keyPath uses '.' to indicate nesting under labels (e.g. 'labels.fileName').
const ROWS = [
  // --- Page strings ---
  ['title',
    'File Info', 'Datei-Info', 'Infos sur le fichier', 'Información del archivo',
    'Informazioni file', 'Informações do ficheiro', 'Bestandsinfo', 'Informacje o pliku',
    'Filinformation', 'Filinformasjon', 'Filinformation', 'Tiedoston tiedot',
    'Informace o souboru', 'Informații fișier', 'Fájlinformációk', 'Πληροφορίες αρχείου',
    'Dosya Bilgileri'],

  ['body',
    'Upload any file to view its metadata — dimensions, duration, author, camera info, page count, and more.',
    'Lade eine beliebige Datei hoch, um ihre Metadaten zu sehen — Abmessungen, Dauer, Autor, Kamerainfos, Seitenzahl und mehr.',
    'Téléversez n\'importe quel fichier pour voir ses métadonnées — dimensions, durée, auteur, infos appareil photo, nombre de pages, et plus.',
    'Sube cualquier archivo para ver sus metadatos — dimensiones, duración, autor, información de cámara, número de páginas y más.',
    'Carica un file qualsiasi per vedere i suoi metadati — dimensioni, durata, autore, info fotocamera, numero di pagine e altro.',
    'Carregue qualquer ficheiro para ver os seus metadados — dimensões, duração, autor, informações da câmara, número de páginas e mais.',
    'Upload elk bestand om de metadata te zien — afmetingen, duur, auteur, camera-info, paginatelling en meer.',
    'Prześlij dowolny plik, aby zobaczyć jego metadane — wymiary, czas trwania, autora, informacje o aparacie, liczbę stron i więcej.',
    'Ladda upp valfri fil för att se dess metadata — dimensioner, längd, författare, kamerainformation, sidantal och mer.',
    'Last opp hvilken som helst fil for å se metadataene — dimensjoner, varighet, forfatter, kamerainfo, sideantall og mer.',
    'Upload enhver fil for at se dens metadata — dimensioner, varighed, forfatter, kameraoplysninger, antal sider og mere.',
    'Lähetä mikä tahansa tiedosto nähdäksesi sen metatiedot — mitat, kesto, tekijä, kameran tiedot, sivumäärä ja paljon muuta.',
    'Nahrajte jakýkoli soubor a zobrazte jeho metadata — rozměry, trvání, autor, informace o fotoaparátu, počet stránek a další.',
    'Încărcați orice fișier pentru a vedea metadatele sale — dimensiuni, durată, autor, informații cameră, număr pagini și multe altele.',
    'Töltsön fel bármilyen fájlt a metaadatok megtekintéséhez — méretek, időtartam, szerző, kamerainformációk, oldalszám és még sok más.',
    'Ανεβάστε οποιοδήποτε αρχείο για να δείτε τα μεταδεδομένα του — διαστάσεις, διάρκεια, συγγραφέας, πληροφορίες κάμερας, αριθμός σελίδων και άλλα.',
    'Meta verilerini görmek için herhangi bir dosya yükleyin — boyutlar, süre, yazar, kamera bilgisi, sayfa sayısı ve daha fazlası.'],

  ['extracting',
    'Extracting metadata...', 'Metadaten werden extrahiert...', 'Extraction des métadonnées...',
    'Extrayendo metadatos...', 'Estrazione metadati...', 'A extrair metadados...',
    'Metadata uitlezen...', 'Wyodrębnianie metadanych...', 'Hämtar metadata...',
    'Henter metadata...', 'Udtrækker metadata...', 'Puretaan metatietoja...',
    'Extrahuji metadata...', 'Se extrag metadatele...', 'Metaadatok kinyerése...',
    'Εξαγωγή μεταδεδομένων...', 'Meta veriler çıkarılıyor...'],

  ['dropHere',
    'Drop it here...', 'Hier ablegen...', 'Déposez-le ici...', 'Suéltalo aquí...',
    'Rilascia qui...', 'Largue aqui...', 'Sleep het hier...', 'Upuść tutaj...',
    'Släpp här...', 'Slipp her...', 'Slip det her...', 'Pudota tähän...',
    'Pusťte sem...', 'Plasați aici...', 'Engedje el itt...', 'Αφήστε εδώ...',
    'Buraya bırakın...'],

  ['dropDefault',
    'Drag & drop a file here, or click to browse',
    'Datei hier ablegen oder klicken zum Durchsuchen',
    'Glissez-déposez un fichier ici, ou cliquez pour parcourir',
    'Arrastra y suelta un archivo aquí, o haz clic para explorar',
    'Trascina un file qui o clicca per sfogliare',
    'Arraste e largue um ficheiro aqui, ou clique para procurar',
    'Sleep een bestand hierheen of klik om te bladeren',
    'Przeciągnij plik tutaj lub kliknij, aby przeglądać',
    'Dra och släpp en fil här, eller klicka för att bläddra',
    'Dra og slipp en fil her, eller klikk for å bla',
    'Træk og slip en fil her, eller klik for at gennemse',
    'Vedä ja pudota tiedosto tähän tai napsauta selataksesi',
    'Přetáhněte sem soubor nebo klikněte pro procházení',
    'Trageți și plasați un fișier aici sau faceți clic pentru a răsfoi',
    'Húzzon ide egy fájlt, vagy kattintson a tallózáshoz',
    'Σύρετε και αποθέστε ένα αρχείο εδώ ή κάντε κλικ για περιήγηση',
    'Bir dosyayı buraya sürükleyip bırakın veya göz atmak için tıklayın'],

  ['analyzeAnother',
    'Analyze another file', 'Andere Datei analysieren', 'Analyser un autre fichier',
    'Analizar otro archivo', 'Analizza un altro file', 'Analisar outro ficheiro',
    'Ander bestand analyseren', 'Analizuj inny plik', 'Analysera en annan fil',
    'Analyser en annen fil', 'Analyser en anden fil', 'Analysoi toinen tiedosto',
    'Analyzovat jiný soubor', 'Analizați alt fișier', 'Másik fájl elemzése',
    'Ανάλυση άλλου αρχείου', 'Başka dosya analiz et'],

  ['failExtract',
    'Failed to extract metadata', 'Metadaten konnten nicht extrahiert werden',
    'Échec de l\'extraction des métadonnées', 'No se pudieron extraer los metadatos',
    'Estrazione metadati non riuscita', 'Falha ao extrair metadados',
    'Metadata uitlezen mislukt', 'Nie udało się wyodrębnić metadanych',
    'Det gick inte att hämta metadata', 'Kunne ikke hente metadata',
    'Kunne ikke udtrække metadata', 'Metatietojen purkaminen epäonnistui',
    'Nepodařilo se extrahovat metadata', 'Extragerea metadatelor a eșuat',
    'A metaadatok kinyerése sikertelen', 'Αποτυχία εξαγωγής μεταδεδομένων',
    'Meta veriler çıkarılamadı'],

  ['seoDesc',
    'View file metadata online for free. Inspect dimensions, duration, author, camera info, codec, page count and more. Works with PDF, images, video and audio.',
    'Datei-Metadaten online kostenlos anzeigen. Abmessungen, Dauer, Autor, Kamerainfos, Codec, Seitenzahl und mehr. Funktioniert mit PDF, Bildern, Video und Audio.',
    'Consultez les métadonnées de fichier en ligne gratuitement. Inspectez dimensions, durée, auteur, infos appareil photo, codec, nombre de pages et plus. Compatible PDF, images, vidéo et audio.',
    'Ver metadatos de archivos en línea gratis. Inspecciona dimensiones, duración, autor, información de cámara, códec, número de páginas y más. Funciona con PDF, imágenes, video y audio.',
    'Visualizza i metadati dei file online gratuitamente. Ispeziona dimensioni, durata, autore, info fotocamera, codec, numero di pagine e altro. Funziona con PDF, immagini, video e audio.',
    'Veja os metadados de ficheiros online gratuitamente. Inspecione dimensões, duração, autor, informações da câmara, codec, número de páginas e mais. Funciona com PDF, imagens, vídeo e áudio.',
    'Bekijk online gratis bestandsmetadata. Inspecteer afmetingen, duur, auteur, camera-informatie, codec, paginatelling en meer. Werkt met PDF, afbeeldingen, video en audio.',
    'Wyświetl metadane plików online za darmo. Sprawdź wymiary, czas trwania, autora, informacje o aparacie, kodek, liczbę stron i więcej. Działa z PDF, obrazami, wideo i audio.',
    'Visa filmetadata online gratis. Inspektera dimensioner, längd, författare, kamerainformation, codec, sidantal och mer. Fungerar med PDF, bilder, video och ljud.',
    'Vis filmetadata på nett gratis. Inspiser dimensjoner, varighet, forfatter, kamerainfo, kodek, sideantall og mer. Fungerer med PDF, bilder, video og lyd.',
    'Se filmetadata online gratis. Inspicer dimensioner, varighed, forfatter, kameraoplysninger, codec, antal sider og mere. Fungerer med PDF, billeder, video og lyd.',
    'Tarkastele tiedostojen metatietoja verkossa ilmaiseksi. Tutki mittoja, kestoa, tekijää, kameran tietoja, koodekkia, sivumäärää ja paljon muuta. Toimii PDF-, kuva-, video- ja äänitiedostoilla.',
    'Prohlížejte metadata souborů online zdarma. Prozkoumejte rozměry, trvání, autora, informace o fotoaparátu, kodek, počet stránek a další. Funguje s PDF, obrázky, videem a zvukem.',
    'Vizualizați metadatele fișierelor online gratuit. Inspectați dimensiuni, durată, autor, informații cameră, codec, număr pagini și multe altele. Funcționează cu PDF, imagini, video și audio.',
    'Tekintse meg a fájl metaadatait online ingyen. Vizsgálja meg a méreteket, időtartamot, szerzőt, kamerainformációkat, kodeket, oldalszámot és még sok mást. PDF, képek, videó és audio fájlokkal működik.',
    'Δείτε τα μεταδεδομένα αρχείων online δωρεάν. Επιθεωρήστε διαστάσεις, διάρκεια, συγγραφέα, πληροφορίες κάμερας, codec, αριθμό σελίδων και άλλα. Λειτουργεί με PDF, εικόνες, βίντεο και ήχο.',
    'Dosya meta verilerini çevrimiçi ücretsiz görüntüleyin. Boyutları, süreyi, yazarı, kamera bilgisini, codec\'i, sayfa sayısını ve daha fazlasını inceleyin. PDF, görüntü, video ve ses ile çalışır.'],

  // --- Result-table labels (39) ---
  ['labels.fileName',     'File Name', 'Dateiname', 'Nom du fichier', 'Nombre del archivo', 'Nome file', 'Nome do ficheiro', 'Bestandsnaam', 'Nazwa pliku', 'Filnamn', 'Filnavn', 'Filnavn', 'Tiedostonimi', 'Název souboru', 'Nume fișier', 'Fájlnév', 'Όνομα αρχείου', 'Dosya Adı'],
  ['labels.fileSize',     'File Size', 'Dateigröße', 'Taille du fichier', 'Tamaño del archivo', 'Dimensione file', 'Tamanho do ficheiro', 'Bestandsgrootte', 'Rozmiar pliku', 'Filstorlek', 'Filstørrelse', 'Filstørrelse', 'Tiedostokoko', 'Velikost souboru', 'Dimensiune fișier', 'Fájlméret', 'Μέγεθος αρχείου', 'Dosya Boyutu'],
  ['labels.format',       'Format', 'Format', 'Format', 'Formato', 'Formato', 'Formato', 'Formaat', 'Format', 'Format', 'Format', 'Format', 'Muoto', 'Formát', 'Format', 'Formátum', 'Μορφή', 'Format'],
  ['labels.mimeType',     'MIME Type', 'MIME-Typ', 'Type MIME', 'Tipo MIME', 'Tipo MIME', 'Tipo MIME', 'MIME-type', 'Typ MIME', 'MIME-typ', 'MIME-type', 'MIME-type', 'MIME-tyyppi', 'Typ MIME', 'Tip MIME', 'MIME-típus', 'Τύπος MIME', 'MIME Türü'],
  ['labels.lastModified', 'Last Modified', 'Zuletzt geändert', 'Dernière modification', 'Última modificación', 'Ultima modifica', 'Última modificação', 'Laatst gewijzigd', 'Ostatnia modyfikacja', 'Senast ändrad', 'Sist endret', 'Sidst ændret', 'Viimeksi muokattu', 'Naposledy upraveno', 'Ultima modificare', 'Utoljára módosítva', 'Τελευταία τροποποίηση', 'Son Değiştirme'],
  ['labels.pageCount',    'Pages', 'Seiten', 'Pages', 'Páginas', 'Pagine', 'Páginas', 'Pagina\'s', 'Strony', 'Sidor', 'Sider', 'Sider', 'Sivut', 'Stránky', 'Pagini', 'Oldalak', 'Σελίδες', 'Sayfalar'],
  ['labels.pageWidth',    'Page Width (pt)', 'Seitenbreite (pt)', 'Largeur de page (pt)', 'Ancho de página (pt)', 'Larghezza pagina (pt)', 'Largura da página (pt)', 'Paginabreedte (pt)', 'Szerokość strony (pt)', 'Sidbredd (pt)', 'Sidebredde (pt)', 'Sidebredde (pt)', 'Sivun leveys (pt)', 'Šířka stránky (pt)', 'Lățime pagină (pt)', 'Oldalszélesség (pt)', 'Πλάτος σελίδας (pt)', 'Sayfa Genişliği (pt)'],
  ['labels.pageHeight',   'Page Height (pt)', 'Seitenhöhe (pt)', 'Hauteur de page (pt)', 'Alto de página (pt)', 'Altezza pagina (pt)', 'Altura da página (pt)', 'Paginahoogte (pt)', 'Wysokość strony (pt)', 'Sidhöjd (pt)', 'Sidehøyde (pt)', 'Sidehøjde (pt)', 'Sivun korkeus (pt)', 'Výška stránky (pt)', 'Înălțime pagină (pt)', 'Oldalmagasság (pt)', 'Ύψος σελίδας (pt)', 'Sayfa Yüksekliği (pt)'],
  ['labels.title',        'Title', 'Titel', 'Titre', 'Título', 'Titolo', 'Título', 'Titel', 'Tytuł', 'Titel', 'Tittel', 'Titel', 'Otsikko', 'Název', 'Titlu', 'Cím', 'Τίτλος', 'Başlık'],
  ['labels.author',       'Author', 'Autor', 'Auteur', 'Autor', 'Autore', 'Autor', 'Auteur', 'Autor', 'Författare', 'Forfatter', 'Forfatter', 'Tekijä', 'Autor', 'Autor', 'Szerző', 'Συγγραφέας', 'Yazar'],
  ['labels.subject',      'Subject', 'Betreff', 'Sujet', 'Asunto', 'Oggetto', 'Assunto', 'Onderwerp', 'Temat', 'Ämne', 'Emne', 'Emne', 'Aihe', 'Předmět', 'Subiect', 'Tárgy', 'Θέμα', 'Konu'],
  ['labels.creator',      'Creator', 'Ersteller', 'Créateur', 'Creador', 'Creatore', 'Criador', 'Maker', 'Twórca', 'Skapare', 'Skaper', 'Skaber', 'Luoja', 'Tvůrce', 'Creator', 'Készítő', 'Δημιουργός', 'Oluşturan'],
  ['labels.producer',     'Producer', 'Produzent', 'Producteur', 'Productor', 'Produttore', 'Produtor', 'Producent', 'Producent', 'Producent', 'Produsent', 'Producent', 'Tuottaja', 'Producent', 'Producător', 'Készítő program', 'Παραγωγός', 'Üretici'],
  ['labels.creationDate', 'Creation Date', 'Erstellungsdatum', 'Date de création', 'Fecha de creación', 'Data di creazione', 'Data de criação', 'Aanmaakdatum', 'Data utworzenia', 'Skapandedatum', 'Opprettet dato', 'Oprettelsesdato', 'Luontipäivä', 'Datum vytvoření', 'Data creării', 'Létrehozás dátuma', 'Ημερομηνία δημιουργίας', 'Oluşturulma Tarihi'],
  ['labels.modificationDate', 'Modification Date', 'Änderungsdatum', 'Date de modification', 'Fecha de modificación', 'Data di modifica', 'Data de modificação', 'Wijzigingsdatum', 'Data modyfikacji', 'Ändringsdatum', 'Endringsdato', 'Ændringsdato', 'Muokkauspäivä', 'Datum změny', 'Data modificării', 'Módosítás dátuma', 'Ημερομηνία τροποποίησης', 'Değiştirilme Tarihi'],
  ['labels.width',        'Width (px)', 'Breite (px)', 'Largeur (px)', 'Ancho (px)', 'Larghezza (px)', 'Largura (px)', 'Breedte (px)', 'Szerokość (px)', 'Bredd (px)', 'Bredde (px)', 'Bredde (px)', 'Leveys (px)', 'Šířka (px)', 'Lățime (px)', 'Szélesség (px)', 'Πλάτος (px)', 'Genişlik (px)'],
  ['labels.height',       'Height (px)', 'Höhe (px)', 'Hauteur (px)', 'Alto (px)', 'Altezza (px)', 'Altura (px)', 'Hoogte (px)', 'Wysokość (px)', 'Höjd (px)', 'Høyde (px)', 'Højde (px)', 'Korkeus (px)', 'Výška (px)', 'Înălțime (px)', 'Magasság (px)', 'Ύψος (px)', 'Yükseklik (px)'],
  ['labels.cameraMake',   'Camera Make', 'Kamerahersteller', 'Marque de l\'appareil photo', 'Marca de cámara', 'Marca fotocamera', 'Marca da câmara', 'Cameramerk', 'Marka aparatu', 'Kameramärke', 'Kameramerke', 'Kameramærke', 'Kameran merkki', 'Značka fotoaparátu', 'Marcă cameră', 'Fényképezőgép gyártója', 'Μάρκα κάμερας', 'Kamera Markası'],
  ['labels.cameraModel',  'Camera Model', 'Kameramodell', 'Modèle d\'appareil photo', 'Modelo de cámara', 'Modello fotocamera', 'Modelo da câmara', 'Cameramodel', 'Model aparatu', 'Kameramodell', 'Kameramodell', 'Kameramodel', 'Kameran malli', 'Model fotoaparátu', 'Model cameră', 'Fényképezőgép modellje', 'Μοντέλο κάμερας', 'Kamera Modeli'],
  ['labels.dateTaken',    'Date Taken', 'Aufnahmedatum', 'Date de prise', 'Fecha de captura', 'Data scatto', 'Data de captura', 'Opnamedatum', 'Data zrobienia', 'Tagningsdatum', 'Tatt dato', 'Optagelsesdato', 'Ottopäivä', 'Datum pořízení', 'Data capturii', 'Felvétel dátuma', 'Ημερομηνία λήψης', 'Çekim Tarihi'],
  ['labels.iso',          'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO', 'ISO'],
  ['labels.focalLength',  'Focal Length', 'Brennweite', 'Distance focale', 'Distancia focal', 'Lunghezza focale', 'Distância focal', 'Brandpuntsafstand', 'Ogniskowa', 'Brännvidd', 'Brennvidde', 'Brændvidde', 'Polttoväli', 'Ohnisková vzdálenost', 'Distanță focală', 'Fókusztávolság', 'Εστιακή απόσταση', 'Odak Uzaklığı'],
  ['labels.exposureTime', 'Exposure Time', 'Belichtungszeit', 'Temps d\'exposition', 'Tiempo de exposición', 'Tempo di esposizione', 'Tempo de exposição', 'Belichtingstijd', 'Czas naświetlania', 'Exponeringstid', 'Eksponeringstid', 'Eksponeringstid', 'Valotusaika', 'Doba expozice', 'Timp expunere', 'Expozíciós idő', 'Χρόνος έκθεσης', 'Pozlama Süresi'],
  ['labels.aperture',     'Aperture', 'Blende', 'Ouverture', 'Apertura', 'Apertura', 'Abertura', 'Diafragma', 'Przysłona', 'Bländare', 'Blenderåpning', 'Blænde', 'Aukko', 'Clona', 'Diafragmă', 'Rekesz', 'Διάφραγμα', 'Diyafram'],
  ['labels.gpsLatitude',  'GPS Latitude', 'GPS-Breitengrad', 'Latitude GPS', 'Latitud GPS', 'Latitudine GPS', 'Latitude GPS', 'GPS-breedtegraad', 'Szerokość GPS', 'GPS-latitud', 'GPS-bredde', 'GPS-bredde', 'GPS-leveysaste', 'Zeměpisná šířka GPS', 'Latitudine GPS', 'GPS szélesség', 'Γεωγραφικό πλάτος GPS', 'GPS Enlemi'],
  ['labels.gpsLongitude', 'GPS Longitude', 'GPS-Längengrad', 'Longitude GPS', 'Longitud GPS', 'Longitudine GPS', 'Longitude GPS', 'GPS-lengtegraad', 'Długość GPS', 'GPS-longitud', 'GPS-lengde', 'GPS-længde', 'GPS-pituusaste', 'Zeměpisná délka GPS', 'Longitudine GPS', 'GPS hosszúság', 'Γεωγραφικό μήκος GPS', 'GPS Boylamı'],
  ['labels.colorSpace',   'Color Space', 'Farbraum', 'Espace colorimétrique', 'Espacio de color', 'Spazio colore', 'Espaço de cor', 'Kleurruimte', 'Przestrzeń kolorów', 'Färgrymd', 'Fargerom', 'Farverum', 'Väriavaruus', 'Barevný prostor', 'Spațiu de culoare', 'Színtér', 'Χρωματικός χώρος', 'Renk Uzayı'],
  ['labels.bitDepth',     'Bit Depth', 'Bittiefe', 'Profondeur de bit', 'Profundidad de bits', 'Profondità bit', 'Profundidade de bits', 'Bitdiepte', 'Głębia bitowa', 'Bitdjup', 'Bitdybde', 'Bitdybde', 'Bittisyvyys', 'Bitová hloubka', 'Adâncime de biți', 'Bitmélység', 'Βάθος bit', 'Bit Derinliği'],
  ['labels.mediaType',    'Media Type', 'Medientyp', 'Type de média', 'Tipo de medio', 'Tipo media', 'Tipo de mídia', 'Mediatype', 'Typ multimediów', 'Mediatyp', 'Medietype', 'Medietype', 'Mediatyyppi', 'Typ média', 'Tip media', 'Médiatípus', 'Τύπος μέσου', 'Medya Türü'],
  ['labels.duration',     'Duration', 'Dauer', 'Durée', 'Duración', 'Durata', 'Duração', 'Duur', 'Czas trwania', 'Längd', 'Varighet', 'Varighed', 'Kesto', 'Trvání', 'Durată', 'Időtartam', 'Διάρκεια', 'Süre'],
  ['labels.durationSeconds', 'Duration (seconds)', 'Dauer (Sekunden)', 'Durée (secondes)', 'Duración (segundos)', 'Durata (secondi)', 'Duração (segundos)', 'Duur (seconden)', 'Czas trwania (sekundy)', 'Längd (sekunder)', 'Varighet (sekunder)', 'Varighed (sekunder)', 'Kesto (sekuntia)', 'Trvání (sekundy)', 'Durată (secunde)', 'Időtartam (másodperc)', 'Διάρκεια (δευτερόλεπτα)', 'Süre (saniye)'],
  ['labels.sampleRate',   'Sample Rate', 'Abtastrate', 'Fréquence d\'échantillonnage', 'Frecuencia de muestreo', 'Frequenza di campionamento', 'Taxa de amostragem', 'Samplefrequentie', 'Częstotliwość próbkowania', 'Samplingsfrekvens', 'Samplingsfrekvens', 'Samplingsfrekvens', 'Näytteenottotaajuus', 'Vzorkovací frekvence', 'Rată de eșantionare', 'Mintavételezési frekvencia', 'Ρυθμός δειγματοληψίας', 'Örnekleme Hızı'],
  ['labels.bitrate',      'Bitrate', 'Bitrate', 'Débit binaire', 'Tasa de bits', 'Bitrate', 'Taxa de bits', 'Bitrate', 'Przepływność', 'Bithastighet', 'Bitrate', 'Bitrate', 'Bittinopeus', 'Datový tok', 'Rată de biți', 'Bitráta', 'Ρυθμός bit', 'Bit Hızı'],
  ['labels.channels',     'Channels', 'Kanäle', 'Canaux', 'Canales', 'Canali', 'Canais', 'Kanalen', 'Kanały', 'Kanaler', 'Kanaler', 'Kanaler', 'Kanavat', 'Kanály', 'Canale', 'Csatornák', 'Κανάλια', 'Kanallar'],
  ['labels.codec',        'Codec', 'Codec', 'Codec', 'Códec', 'Codec', 'Codec', 'Codec', 'Kodek', 'Codec', 'Kodek', 'Codec', 'Koodekki', 'Kodek', 'Codec', 'Kodek', 'Codec', 'Codec'],
  ['labels.artist',       'Artist', 'Künstler', 'Artiste', 'Artista', 'Artista', 'Artista', 'Artiest', 'Wykonawca', 'Artist', 'Artist', 'Kunstner', 'Artisti', 'Interpret', 'Artist', 'Előadó', 'Καλλιτέχνης', 'Sanatçı'],
  ['labels.album',        'Album', 'Album', 'Album', 'Álbum', 'Album', 'Álbum', 'Album', 'Album', 'Album', 'Album', 'Album', 'Albumi', 'Album', 'Album', 'Album', 'Άλμπουμ', 'Albüm'],
  ['labels.year',         'Year', 'Jahr', 'Année', 'Año', 'Anno', 'Ano', 'Jaar', 'Rok', 'År', 'År', 'År', 'Vuosi', 'Rok', 'An', 'Év', 'Έτος', 'Yıl'],
  ['labels.genre',        'Genre', 'Genre', 'Genre', 'Género', 'Genere', 'Género', 'Genre', 'Gatunek', 'Genre', 'Sjanger', 'Genre', 'Genre', 'Žánr', 'Gen', 'Műfaj', 'Είδος', 'Tür'],
];

// =====================================================================
// Build per-language nested object
// =====================================================================
function setNested(obj, dotPath, value) {
  const parts = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

const PAYLOADS = {};
for (const lang of LANGS) PAYLOADS[lang] = {};
for (const row of ROWS) {
  const [keyPath, ...vals] = row;
  for (let i = 0; i < LANGS.length; i++) {
    setNested(PAYLOADS[LANGS[i]], keyPath, vals[i]);
  }
}

// =====================================================================
// Helpers (same patching infra used elsewhere)
// =====================================================================
function formatObjectLiteral(obj, indent = '  ') {
  const inner = Object.entries(obj).map(([k, v]) => {
    const keyStr = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return `${indent}  ${keyStr}: ${formatObjectLiteral(v, indent + '  ')},`;
    }
    return `${indent}  ${keyStr}: ${JSON.stringify(v)},`;
  }).join('\n');
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
  if (start === -1) throw new Error('`const en = {` not found in i18n.js');
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
  let i = scopeEnd - 2;
  while (i > scopeStart && /\s/.test(text[i])) i--;
  const needsLeadingComma = text[i] !== ',' && text[i] !== '{';
  const insertion = `${needsLeadingComma ? ',' : ''}\n  ${keyName}: ${formatObjectLiteral(payloadObj, '  ')},\n`;
  return text.slice(0, scopeEnd - 1) + insertion + text.slice(scopeEnd - 1);
}

// =====================================================================
// Patch en (i18n.js)
// =====================================================================
let enContent = fs.readFileSync(I18N_EN, 'utf8');
const enBlock = findEnSourceBlock(enContent);
enContent = injectOrReplaceTopLevelKey(enContent, 'metadataPage', PAYLOADS.en, enBlock.start, enBlock.end);
fs.writeFileSync(I18N_EN, enContent);
console.log('✔ en (i18n.js)');

// =====================================================================
// Patch i18n-translations.js
// =====================================================================
let trContent = fs.readFileSync(I18N_TRANS, 'utf8');
for (const lang of LANGS.filter((l) => l !== 'en')) {
  const block = findLangBlock(trContent, lang);
  trContent = injectOrReplaceTopLevelKey(trContent, 'metadataPage', PAYLOADS[lang], block.start, block.end);
  console.log('✔ ' + lang);
}
fs.writeFileSync(I18N_TRANS, trContent);

console.log('\nDone — metadataPage with ' + ROWS.length + ' keys × ' + LANGS.length + ' languages.');
