// One-shot: add the folder-upload + batch-summary tool.* keys to every
// non-English language section in client/src/i18n-translations.js.
//
// The English source lives in client/src/i18n.js (added separately). Keys are
// inserted immediately before each language's `confirmBtn:` entry (which is
// unique per language and lives inside the `tool` object). Values are written
// with JSON.stringify so apostrophes/quotes are always escaped correctly.
//
// Run from repo root:  node scripts/add-folder-upload-translations.js

const fs = require('fs');
const path = require('path');

const TRANS = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');

// Order matches the language declarations in i18n-translations.js.
const LANGS = ['de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'cs', 'ro', 'hu', 'el', 'tr'];

const KEYS = [
  'uploadFolder',
  'uploadFolderHint',
  'uploadFiles',
  'uploadFilesHint',
  'folderNoneMatched',
  'folderFiltered',
  'folderAdded',
  'batchSummaryFiles',
  'batchSummaryCost',
  'confirmBatchBodySingular',
  'confirmBatchBodyPlural',
];

const T = {
  de: {
    uploadFolder: 'Ordner hochladen',
    uploadFolderHint: 'Alle Dateien im Ordner werden in Ihr gewähltes Format konvertiert.',
    uploadFiles: 'Mehrere Dateien hochladen',
    uploadFilesHint: 'Wählen Sie mehrere Dateien aus, um sie alle auf einmal zu konvertieren.',
    folderNoneMatched: 'Keine Dateien passen. Dieses Werkzeug akzeptiert {{formats}}-Dateien.',
    folderFiltered: '{{matched}} Dateien passen und werden konvertiert, {{skipped}} Dateien wurden übersprungen, da sie keine {{formats}}-Dateien sind.',
    folderAdded: 'Hinzugefügte Dateien: {{count}}',
    batchSummaryFiles: 'Ausgewählte Dateien: {{count}}',
    batchSummaryCost: 'Credits gesamt: {{count}}',
    confirmBatchBodySingular: 'Dies konvertiert 1 Datei und verbraucht 1 Credit. Sie haben {{remaining}} Credits übrig.',
    confirmBatchBodyPlural: 'Dies konvertiert {{files}} Dateien und verbraucht {{credits}} Credits. Sie haben {{remaining}} Credits übrig.',
  },
  fr: {
    uploadFolder: 'Importer un dossier',
    uploadFolderHint: 'Tous les fichiers du dossier seront convertis dans le format choisi.',
    uploadFiles: 'Importer plusieurs fichiers',
    uploadFilesHint: 'Sélectionnez plusieurs fichiers pour tous les convertir en une fois.',
    folderNoneMatched: 'Aucun fichier ne correspond. Cet outil accepte les fichiers {{formats}}.',
    folderFiltered: '{{matched}} fichiers correspondent et seront convertis, {{skipped}} fichiers ont été ignorés car ce ne sont pas des fichiers {{formats}}.',
    folderAdded: 'Fichiers ajoutés : {{count}}',
    batchSummaryFiles: 'Fichiers sélectionnés : {{count}}',
    batchSummaryCost: 'Crédits au total : {{count}}',
    confirmBatchBodySingular: 'Cette opération convertira 1 fichier et utilisera 1 crédit. Il vous reste {{remaining}} crédits.',
    confirmBatchBodyPlural: 'Cette opération convertira {{files}} fichiers et utilisera {{credits}} crédits. Il vous reste {{remaining}} crédits.',
  },
  es: {
    uploadFolder: 'Subir una carpeta',
    uploadFolderHint: 'Todos los archivos de la carpeta se convertirán al formato que elijas.',
    uploadFiles: 'Subir varios archivos',
    uploadFilesHint: 'Selecciona varios archivos para convertirlos todos a la vez.',
    folderNoneMatched: 'Ningún archivo coincide. Esta herramienta acepta archivos {{formats}}.',
    folderFiltered: '{{matched}} archivos coinciden y se convertirán, {{skipped}} archivos se omitieron porque no son archivos {{formats}}.',
    folderAdded: 'Archivos añadidos: {{count}}',
    batchSummaryFiles: 'Archivos seleccionados: {{count}}',
    batchSummaryCost: 'Créditos en total: {{count}}',
    confirmBatchBodySingular: 'Esto convertirá 1 archivo y usará 1 crédito. Te quedan {{remaining}} créditos.',
    confirmBatchBodyPlural: 'Esto convertirá {{files}} archivos y usará {{credits}} créditos. Te quedan {{remaining}} créditos.',
  },
  it: {
    uploadFolder: 'Carica una cartella',
    uploadFolderHint: 'Tutti i file della cartella verranno convertiti nel formato scelto.',
    uploadFiles: 'Carica più file',
    uploadFilesHint: 'Seleziona più file per convertirli tutti in una volta.',
    folderNoneMatched: 'Nessun file corrisponde. Questo strumento accetta file {{formats}}.',
    folderFiltered: '{{matched}} file corrispondono e verranno convertiti, {{skipped}} file sono stati ignorati perché non sono file {{formats}}.',
    folderAdded: 'File aggiunti: {{count}}',
    batchSummaryFiles: 'File selezionati: {{count}}',
    batchSummaryCost: 'Crediti totali: {{count}}',
    confirmBatchBodySingular: 'Questa operazione convertirà 1 file e userà 1 credito. Ti restano {{remaining}} crediti.',
    confirmBatchBodyPlural: 'Questa operazione convertirà {{files}} file e userà {{credits}} crediti. Ti restano {{remaining}} crediti.',
  },
  pt: {
    uploadFolder: 'Carregar uma pasta',
    uploadFolderHint: 'Todos os ficheiros da pasta serão convertidos para o formato escolhido.',
    uploadFiles: 'Carregar vários ficheiros',
    uploadFilesHint: 'Selecione vários ficheiros para os converter todos de uma vez.',
    folderNoneMatched: 'Nenhum ficheiro corresponde. Esta ferramenta aceita ficheiros {{formats}}.',
    folderFiltered: '{{matched}} ficheiros correspondem e serão convertidos, {{skipped}} ficheiros foram ignorados porque não são ficheiros {{formats}}.',
    folderAdded: 'Ficheiros adicionados: {{count}}',
    batchSummaryFiles: 'Ficheiros selecionados: {{count}}',
    batchSummaryCost: 'Créditos no total: {{count}}',
    confirmBatchBodySingular: 'Isto irá converter 1 ficheiro e usar 1 crédito. Restam-lhe {{remaining}} créditos.',
    confirmBatchBodyPlural: 'Isto irá converter {{files}} ficheiros e usar {{credits}} créditos. Restam-lhe {{remaining}} créditos.',
  },
  nl: {
    uploadFolder: 'Een map uploaden',
    uploadFolderHint: 'Alle bestanden in de map worden naar het gekozen formaat geconverteerd.',
    uploadFiles: 'Meerdere bestanden uploaden',
    uploadFilesHint: 'Selecteer meerdere bestanden om ze allemaal tegelijk te converteren.',
    folderNoneMatched: 'Geen bestanden komen overeen. Deze tool accepteert {{formats}}-bestanden.',
    folderFiltered: '{{matched}} bestanden komen overeen en worden geconverteerd, {{skipped}} bestanden zijn overgeslagen omdat het geen {{formats}}-bestanden zijn.',
    folderAdded: 'Toegevoegde bestanden: {{count}}',
    batchSummaryFiles: 'Geselecteerde bestanden: {{count}}',
    batchSummaryCost: 'Totaal aantal credits: {{count}}',
    confirmBatchBodySingular: 'Hiermee wordt 1 bestand geconverteerd en 1 credit gebruikt. Je hebt nog {{remaining}} credits over.',
    confirmBatchBodyPlural: 'Hiermee worden {{files}} bestanden geconverteerd en {{credits}} credits gebruikt. Je hebt nog {{remaining}} credits over.',
  },
  pl: {
    uploadFolder: 'Prześlij folder',
    uploadFolderHint: 'Wszystkie pliki w folderze zostaną przekonwertowane do wybranego formatu.',
    uploadFiles: 'Prześlij wiele plików',
    uploadFilesHint: 'Wybierz kilka plików, aby przekonwertować je wszystkie naraz.',
    folderNoneMatched: 'Żaden plik nie pasuje. To narzędzie akceptuje pliki {{formats}}.',
    folderFiltered: '{{matched}} plików pasuje i zostanie przekonwertowanych, {{skipped}} plików pominięto, ponieważ nie są to pliki {{formats}}.',
    folderAdded: 'Dodane pliki: {{count}}',
    batchSummaryFiles: 'Wybrane pliki: {{count}}',
    batchSummaryCost: 'Łącznie kredytów: {{count}}',
    confirmBatchBodySingular: 'Spowoduje to konwersję 1 pliku i użycie 1 kredytu. Zostaje Ci {{remaining}} kredytów.',
    confirmBatchBodyPlural: 'Spowoduje to konwersję {{files}} plików i użycie {{credits}} kredytów. Zostaje Ci {{remaining}} kredytów.',
  },
  sv: {
    uploadFolder: 'Ladda upp en mapp',
    uploadFolderHint: 'Alla filer i mappen konverteras till det valda formatet.',
    uploadFiles: 'Ladda upp flera filer',
    uploadFilesHint: 'Välj flera filer för att konvertera dem alla på en gång.',
    folderNoneMatched: 'Inga filer matchade. Det här verktyget accepterar {{formats}}-filer.',
    folderFiltered: '{{matched}} filer matchade och konverteras, {{skipped}} filer hoppades över eftersom de inte är {{formats}}-filer.',
    folderAdded: 'Tillagda filer: {{count}}',
    batchSummaryFiles: 'Valda filer: {{count}}',
    batchSummaryCost: 'Totalt antal krediter: {{count}}',
    confirmBatchBodySingular: 'Detta konverterar 1 fil och använder 1 kredit. Du har {{remaining}} krediter kvar.',
    confirmBatchBodyPlural: 'Detta konverterar {{files}} filer och använder {{credits}} krediter. Du har {{remaining}} krediter kvar.',
  },
  no: {
    uploadFolder: 'Last opp en mappe',
    uploadFolderHint: 'Alle filene i mappen konverteres til formatet du velger.',
    uploadFiles: 'Last opp flere filer',
    uploadFilesHint: 'Velg flere filer for å konvertere dem alle på én gang.',
    folderNoneMatched: 'Ingen filer samsvarte. Dette verktøyet godtar {{formats}}-filer.',
    folderFiltered: '{{matched}} filer samsvarte og konverteres, {{skipped}} filer ble hoppet over fordi de ikke er {{formats}}-filer.',
    folderAdded: 'Lagt til filer: {{count}}',
    batchSummaryFiles: 'Valgte filer: {{count}}',
    batchSummaryCost: 'Totalt antall kreditter: {{count}}',
    confirmBatchBodySingular: 'Dette konverterer 1 fil og bruker 1 kreditt. Du har {{remaining}} kreditter igjen.',
    confirmBatchBodyPlural: 'Dette konverterer {{files}} filer og bruker {{credits}} kreditter. Du har {{remaining}} kreditter igjen.',
  },
  da: {
    uploadFolder: 'Upload en mappe',
    uploadFolderHint: 'Alle filer i mappen konverteres til det valgte format.',
    uploadFiles: 'Upload flere filer',
    uploadFilesHint: 'Vælg flere filer for at konvertere dem alle på én gang.',
    folderNoneMatched: 'Ingen filer matchede. Dette værktøj accepterer {{formats}}-filer.',
    folderFiltered: '{{matched}} filer matchede og konverteres, {{skipped}} filer blev sprunget over, fordi de ikke er {{formats}}-filer.',
    folderAdded: 'Tilføjede filer: {{count}}',
    batchSummaryFiles: 'Valgte filer: {{count}}',
    batchSummaryCost: 'Kreditter i alt: {{count}}',
    confirmBatchBodySingular: 'Dette konverterer 1 fil og bruger 1 kredit. Du har {{remaining}} kreditter tilbage.',
    confirmBatchBodyPlural: 'Dette konverterer {{files}} filer og bruger {{credits}} kreditter. Du har {{remaining}} kreditter tilbage.',
  },
  fi: {
    uploadFolder: 'Lataa kansio',
    uploadFolderHint: 'Kaikki kansion tiedostot muunnetaan valitsemaasi muotoon.',
    uploadFiles: 'Lataa useita tiedostoja',
    uploadFilesHint: 'Valitse useita tiedostoja muuntaaksesi ne kaikki kerralla.',
    folderNoneMatched: 'Yksikään tiedosto ei täsmännyt. Tämä työkalu hyväksyy {{formats}}-tiedostoja.',
    folderFiltered: '{{matched}} tiedostoa täsmäsi ja muunnetaan, {{skipped}} tiedostoa ohitettiin, koska ne eivät ole {{formats}}-tiedostoja.',
    folderAdded: 'Lisätyt tiedostot: {{count}}',
    batchSummaryFiles: 'Valitut tiedostot: {{count}}',
    batchSummaryCost: 'Krediittejä yhteensä: {{count}}',
    confirmBatchBodySingular: 'Tämä muuntaa 1 tiedoston ja käyttää 1 krediitin. Sinulla on {{remaining}} krediittiä jäljellä.',
    confirmBatchBodyPlural: 'Tämä muuntaa {{files}} tiedostoa ja käyttää {{credits}} krediittiä. Sinulla on {{remaining}} krediittiä jäljellä.',
  },
  cs: {
    uploadFolder: 'Nahrát složku',
    uploadFolderHint: 'Všechny soubory ve složce budou převedeny do zvoleného formátu.',
    uploadFiles: 'Nahrát více souborů',
    uploadFilesHint: 'Vyberte více souborů a převeďte je všechny najednou.',
    folderNoneMatched: 'Žádné soubory neodpovídají. Tento nástroj přijímá soubory {{formats}}.',
    folderFiltered: '{{matched}} souborů odpovídá a bude převedeno, {{skipped}} souborů bylo přeskočeno, protože nejsou soubory {{formats}}.',
    folderAdded: 'Přidané soubory: {{count}}',
    batchSummaryFiles: 'Vybrané soubory: {{count}}',
    batchSummaryCost: 'Kreditů celkem: {{count}}',
    confirmBatchBodySingular: 'Tímto se převede 1 soubor a využije 1 kredit. Zbývá vám {{remaining}} kreditů.',
    confirmBatchBodyPlural: 'Tímto se převede {{files}} souborů a využije {{credits}} kreditů. Zbývá vám {{remaining}} kreditů.',
  },
  ro: {
    uploadFolder: 'Încarcă un folder',
    uploadFolderHint: 'Toate fișierele din folder vor fi convertite în formatul ales.',
    uploadFiles: 'Încarcă mai multe fișiere',
    uploadFilesHint: 'Selectează mai multe fișiere pentru a le converti pe toate deodată.',
    folderNoneMatched: 'Niciun fișier nu se potrivește. Acest instrument acceptă fișiere {{formats}}.',
    folderFiltered: '{{matched}} fișiere se potrivesc și vor fi convertite, {{skipped}} fișiere au fost omise deoarece nu sunt fișiere {{formats}}.',
    folderAdded: 'Fișiere adăugate: {{count}}',
    batchSummaryFiles: 'Fișiere selectate: {{count}}',
    batchSummaryCost: 'Credite în total: {{count}}',
    confirmBatchBodySingular: 'Aceasta va converti 1 fișier și va folosi 1 credit. Mai ai {{remaining}} credite.',
    confirmBatchBodyPlural: 'Aceasta va converti {{files}} fișiere și va folosi {{credits}} credite. Mai ai {{remaining}} credite.',
  },
  hu: {
    uploadFolder: 'Mappa feltöltése',
    uploadFolderHint: 'A mappában lévő összes fájl a kiválasztott formátumra lesz konvertálva.',
    uploadFiles: 'Több fájl feltöltése',
    uploadFilesHint: 'Válasszon ki több fájlt, hogy egyszerre konvertálja mindet.',
    folderNoneMatched: 'Nincs egyező fájl. Ez az eszköz {{formats}} fájlokat fogad el.',
    folderFiltered: '{{matched}} fájl egyezik és konvertálásra kerül, {{skipped}} fájl kihagyva, mert nem {{formats}} fájlok.',
    folderAdded: 'Hozzáadott fájlok: {{count}}',
    batchSummaryFiles: 'Kiválasztott fájlok: {{count}}',
    batchSummaryCost: 'Kreditek összesen: {{count}}',
    confirmBatchBodySingular: 'Ez 1 fájlt konvertál és 1 kreditet használ fel. {{remaining}} kredited van hátra.',
    confirmBatchBodyPlural: 'Ez {{files}} fájlt konvertál és {{credits}} kreditet használ fel. {{remaining}} kredited van hátra.',
  },
  el: {
    uploadFolder: 'Μεταφόρτωση φακέλου',
    uploadFolderHint: 'Όλα τα αρχεία στον φάκελο θα μετατραπούν στη μορφή που επιλέξατε.',
    uploadFiles: 'Μεταφόρτωση πολλών αρχείων',
    uploadFilesHint: 'Επιλέξτε πολλά αρχεία για να τα μετατρέψετε όλα μαζί.',
    folderNoneMatched: 'Κανένα αρχείο δεν ταιριάζει. Αυτό το εργαλείο δέχεται αρχεία {{formats}}.',
    folderFiltered: '{{matched}} αρχεία ταιριάζουν και θα μετατραπούν, {{skipped}} αρχεία παραλείφθηκαν επειδή δεν είναι αρχεία {{formats}}.',
    folderAdded: 'Αρχεία που προστέθηκαν: {{count}}',
    batchSummaryFiles: 'Επιλεγμένα αρχεία: {{count}}',
    batchSummaryCost: 'Σύνολο credits: {{count}}',
    confirmBatchBodySingular: 'Αυτό θα μετατρέψει 1 αρχείο και θα χρησιμοποιήσει 1 credit. Έχετε {{remaining}} credits απομένοντα.',
    confirmBatchBodyPlural: 'Αυτό θα μετατρέψει {{files}} αρχεία και θα χρησιμοποιήσει {{credits}} credits. Έχετε {{remaining}} credits απομένοντα.',
  },
  tr: {
    uploadFolder: 'Klasör yükle',
    uploadFolderHint: 'Klasördeki tüm dosyalar seçtiğiniz biçime dönüştürülür.',
    uploadFiles: 'Birden fazla dosya yükle',
    uploadFilesHint: 'Hepsini birden dönüştürmek için birkaç dosya seçin.',
    folderNoneMatched: 'Hiçbir dosya eşleşmedi. Bu araç {{formats}} dosyalarını kabul eder.',
    folderFiltered: '{{matched}} dosya eşleşti ve dönüştürülecek, {{skipped}} dosya {{formats}} dosyası olmadığı için atlandı.',
    folderAdded: 'Eklenen dosyalar: {{count}}',
    batchSummaryFiles: 'Seçilen dosyalar: {{count}}',
    batchSummaryCost: 'Toplam kredi: {{count}}',
    confirmBatchBodySingular: 'Bu işlem 1 dosyayı dönüştürecek ve 1 kredi kullanacak. {{remaining}} krediniz kaldı.',
    confirmBatchBodyPlural: 'Bu işlem {{files}} dosyayı dönüştürecek ve {{credits}} kredi kullanacak. {{remaining}} krediniz kaldı.',
  },
};

let src = fs.readFileSync(TRANS, 'utf8');
let cursor = 0; // only search forward, so each language's block is handled in order

for (const lang of LANGS) {
  const decl = `const ${lang} = {`;
  const declIdx = src.indexOf(decl, cursor);
  if (declIdx === -1) throw new Error(`Could not find declaration for language: ${lang}`);

  const anchor = src.indexOf('confirmBtn:', declIdx);
  if (anchor === -1) throw new Error(`Could not find confirmBtn: for language: ${lang}`);

  const dict = T[lang];
  const missing = KEYS.filter((k) => !(k in dict));
  if (missing.length) throw new Error(`Missing translations for ${lang}: ${missing.join(', ')}`);

  const insertion = KEYS.map((k) => `${k}: ${JSON.stringify(dict[k])}`).join(', ') + ', ';
  src = src.slice(0, anchor) + insertion + src.slice(anchor);

  // Continue searching after the point we just modified.
  cursor = anchor + insertion.length + 'confirmBtn:'.length;
}

fs.writeFileSync(TRANS, src);
console.log(`Inserted ${KEYS.length} keys into ${LANGS.length} languages.`);
