// Chunk A1 of 4: replaces the entire `faq` block in da/cs/ro/tr with the
// 20-question FAQ matching the EN/DE rewrite. The 12-question old version
// is overwritten — same key shape (q1..q20, a1..a20).
//
// Run from repo root:  node scripts/fill-gap-A1-faq.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

function makeFaq(t) {
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

// =====================================================================
// Danish
// =====================================================================
const daFaq = makeFaq({
  title: 'Ofte stillede spørgsmål',
  subtitle: 'Alt du behøver at vide om {{brand}} — konverteringer, priser, sikkerhed, Smart Functions og mere.',
  seoDesc: 'Ofte stillede spørgsmål om {{brand}}. Konverteringer, priser, sikkerhed, Smart Functions, sprog, refusioner og kontakt.',
  q1: 'Hvordan fungerer konvertering trin for trin?',
  a1: 'Fire trin: (1) træk og slip filen eller klik for at gennemse — op til 200 MB; (2) vælg outputformat fra rullemenuen; (3) juster avancerede indstillinger om nødvendigt (kvalitet, opløsning, OCR); (4) klik på Konverter — filen sendes krypteret til vores processor, kreditter trækkes, og du modtager et downloadlink på sekunder.',
  q2: 'Hvilke filformater understøttes?',
  a2: 'Over 50 formater i seks kategorier: Dokumenter (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Billeder (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Lyd (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Video (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Arkiver (ZIP, RAR, 7Z, TAR, GZ) og dedikerede PDF-værktøjer. Den fulde liste findes på Værktøjer-siden.',
  q3: 'Hvordan fungerer kreditsystemet?',
  a3: '{{brand}} bruger en forudbetalt kreditmodel — ingen abonnementer. Standardkonverteringer koster 1 kredit. Smart Functions afregnes efter brug: Tekst til tale 1 kredit pr. 1.000 tegn; Tale til tekst og undertekster 1 kredit pr. 5 minutter (rundet op). Mislykkede konverteringer er gratis. Kreditter udløber aldrig. 5 bonuskreditter pr. henvist ven.',
  q4: 'Hvad indeholder hver pakke, og hvordan køber jeg?',
  a4: 'Tre pakker: 1 kredit (0,99 €), 10 kreditter (7,99 €, ca. 19 % rabat) og 30 kreditter (20,99 €, ca. 30 % rabat). Alle priser inkluderer 19 % tysk moms. Køb via Stripe — kort og SEPA accepteres. Skattekompatibel faktura sendes pr. e-mail straks, kreditter er tilgængelige med det samme.',
  q5: 'Hvor længe gemmes filer, før de slettes?',
  a5: 'Både den oprindelige fil og det konverterede output slettes automatisk og permanent inden for 24 timer efter upload. Ingen undtagelser, ingen manuelle forlængelser — sletning håndhæves af en automatiseret proces. Downloadlinket holder op med at fungere. Vi gemmer ingen kopier, sikkerhedskopier eller miniaturer.',
  q6: 'Er hjemmesiden sikker og GDPR-kompatibel?',
  a6: 'Ja. {{brand}} drives fra Tyskland og er fuldt underlagt GDPR. TLS 1.2+, adgangskoder hashes med bcrypt, httpOnly-cookies SameSite=Strict. Databehandleraftaler indgået med hver underdatabehandler (Art. 28 GDPR). Overførsler uden for EØS sker via EU-standardkontraktbestemmelser eller EU-US Data Privacy Framework. Vi sælger aldrig dine data.',
  q7: 'Hvad sker der med mine filer efter konvertering?',
  a7: 'Ved konvertering sendes filen krypteret til processoren — CloudConvert til standardformater, OpenAI til Smart Functions. Kun den anmodede konvertering udføres. Vi får aldrig adgang til indholdet til andre formål. Begge filer fjernes inden for 24 timer fra vores servere og fra underdatabehandlerens caches.',
  q8: 'Kan filer gendannes efter sletning?',
  a8: 'Nej. Sletning er permanent og uigenkaldelig. Vi vedligeholder ingen sikkerhedskopier af brugerfiler (databasebackups udelukker filer med vilje). Dette understøtter din ret til sletning (Art. 17 GDPR). Download altid dine konverterede filer inden for 24 timer og gem dem lokalt.',
  q9: 'Hvad er den maksimale filstørrelse?',
  a9: '200 MB pr. fil til standardkonverteringer. Smart Functions er begrænset til 25 MB pr. fil (hård grænse fra OpenAI API). For større filer, opdel dem lokalt (f.eks. med ffmpeg) og konverter hver del. For erhvervsbehov, skriv til Support@convertanyformat.com.',
  q10: 'Hvilke browsere understøttes?',
  a10: 'Alle moderne browsere opdateret inden for de seneste to år: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ og de fleste mobilbrowsere. JavaScript og cookies skal være aktiveret. Til mikrofonoptagelse (Tale til tekst) skal du give tilladelse, når du bliver bedt om det. Internet Explorer understøttes ikke.',
  q11: 'Fungerer det på mobilen?',
  a11: 'Ja — fuldt mobiloptimeret. Brugergrænsefladen tilpasser sig skærme fra 320 px, værktøjskort vises i to kolonner på små skærme, og alle funktioner inklusive lydoptagelse fra mikrofonen fungerer på iOS Safari og Android Chrome. Kan installeres som Progressive Web App.',
  q12: 'Hvordan annullerer jeg eller får refusion?',
  a12: 'Ingen abonnementer at annullere — kreditter er engangskøb uden udløb. For refusion af ubrugte kreditter, skriv til Support@convertanyformat.com inden for 14 dage efter købet (Fernabsatzgesetz). Refusion inden for 5–10 hverdage. Brugte kreditter er normalt ikke refunderbare undtagen ved fejl fra vores side. Slet konto via Profil → Farezone.',
  q13: 'Hvad er Smart Functions-værktøjerne?',
  a13: 'AI-drevne værktøjer ud over konvertering: OCR (uddrager tekst fra scannede PDF\'er og billeder), Komprimer PDF med AI, Tekst til tale (MP3/OPUS/AAC-lyd via OpenAI TTS-1), Tale til tekst (transskription TXT/DOCX via Whisper) og Automatisk undertekstgenerator (SRT/VTT fra video). Afregnes efter brug.',
  q14: 'Hvad er OCR, og hvornår skal jeg bruge det?',
  a14: 'OCR (Optisk tegngenkendelse) uddrager redigerbar tekst fra billeder. Brug det med scannede PDF\'er, fotos af dokumenter eller billeder, hvor teksten ikke kan markeres. {{brand}} returnerer en søgbar PDF (originalt layout + usynligt tekstlag) eller almindelig tekst. Anvendelser: digitalisering, søgbare arkiver, citatuddrag.',
  q15: 'Hvordan fungerer Tekst til tale?',
  a15: 'Skriv eller indsæt op til 4096 tegn, vælg en af seks stemmer (Alloy, Echo, Fable, Onyx, Nova, Shimmer), hastighed (0,75x til 1,5x) og format (MP3, OPUS, AAC), og klik på Konverter. På sekunder modtager du en lydfil med naturlig stemme genereret af OpenAI TTS-1. Pris: 1 kredit pr. 1.000 tegn.',
  q16: 'Hvordan fungerer Tale til tekst?',
  a16: 'Upload en lydfil (MP3, WAV, M4A, OGG, MP4, WebM) op til 25 MB. Vi transskriberer med OpenAI Whisper. Vælg TXT eller DOCX. Mikrofonoptagelse er også mulig. Valgfrit sprogtip forbedrer nøjagtigheden. Pris: 1 kredit pr. 5 minutter (rundet op). Transskriptionen vises på siden, så du kan gennemgå den før download.',
  q17: 'Hvordan fungerer den automatiske undertekstgenerator?',
  a17: 'Upload en video (MP4, MOV, AVI, MKV) op til 25 MB. Vi udtrækker lyden om nødvendigt (CloudConvert til ikke-MP4-containere) og transskriberer med Whisper i tidsstempel-tilstand. Du får en SRT eller VTT klar til YouTube, Vimeo, Premiere eller en hvilken som helst editor. Pris: 1 kredit pr. 5 minutters video.',
  q18: 'Hvilke sprog understøttes?',
  a18: 'Brugergrænsefladen er oversat til 17 europæiske sprog: engelsk, tysk, fransk, spansk, italiensk, portugisisk, hollandsk, polsk, svensk, norsk, dansk, finsk, tjekkisk, rumænsk, ungarsk, græsk, tyrkisk. Smart Functions: Whisper over 50 sprog; TTS over 30; OCR: engelsk, tysk, fransk, spansk, italiensk, portugisisk, kinesisk, japansk, koreansk.',
  q19: 'Hvordan ændrer jeg mine kontoindstillinger?',
  a19: 'Klik på dit navn i navigationen for at gå til Profilen. Der kan du opdatere din e-mail (med bekræftelse), angive et visningsnavn, ændre adgangskode, konfigurere notifikationer, se historik og saldo, generere en API-nøgle, finde din henvisningskode og slette din konto permanent (Farezone). Sletning fjerner alle tilknyttede data inden for 30 dage.',
  q20: 'Hvordan kontakter jeg supporten?',
  a20: 'Skriv til Support@convertanyformat.com. Svar inden for 24 timer på hverdage, 48 timer i weekender. GDPR-forespørgsler: skriv "GDPR" i emnet for prioritering. Også kontaktformular på /contact. Ingen telefonsupport, men videoopkald er tilgængeligt for forretningsforespørgsler.',
});

// =====================================================================
// Czech
// =====================================================================
const csFaq = makeFaq({
  title: 'Často kladené dotazy',
  subtitle: 'Vše, co potřebujete vědět o {{brand}} — konverze, ceny, bezpečnost, Smart Functions a další.',
  seoDesc: 'Často kladené dotazy o {{brand}}. Konverze, ceny, bezpečnost, Smart Functions, jazyky, vrácení peněz a kontakt.',
  q1: 'Jak konverze funguje krok za krokem?',
  a1: 'Čtyři kroky: (1) přetáhněte soubor nebo klikněte pro procházení — až 200 MB; (2) vyberte výstupní formát z rozbalovacího menu; (3) v případě potřeby upravte pokročilá nastavení (kvalita, rozlišení, OCR); (4) klikněte na Převést — soubor se zašifrovaně odešle do našeho zpracovatele, odečtou se kredity a obdržíte odkaz ke stažení během několika sekund.',
  q2: 'Jaké formáty souborů jsou podporovány?',
  a2: 'Více než 50 formátů v šesti kategoriích: Dokumenty (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Obrázky (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Audio (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Video (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Archivy (ZIP, RAR, 7Z, TAR, GZ) a vyhrazené PDF nástroje. Úplný seznam je na stránce Nástroje.',
  q3: 'Jak funguje kreditní systém?',
  a3: '{{brand}} používá předplacený kreditní model — žádné předplatné. Standardní konverze stojí 1 kredit. Smart Functions se účtují podle použití: Text na řeč 1 kredit za 1000 znaků; Řeč na text a titulky 1 kredit za 5 minut (zaokrouhleno nahoru). Neúspěšné konverze jsou zdarma. Kredity nikdy nevyprší. 5 bonusových kreditů za doporučeného přítele.',
  q4: 'Co obsahuje každý balíček a jak nakupovat?',
  a4: 'Tři balíčky: 1 kredit (0,99 €), 10 kreditů (7,99 €, ~19% sleva) a 30 kreditů (20,99 €, ~30% sleva). Všechny ceny zahrnují 19 % německé DPH. Nákup přes Stripe — karty a SEPA. Daňová faktura ihned e-mailem, kredity okamžitě k dispozici.',
  q5: 'Jak dlouho jsou soubory uloženy před smazáním?',
  a5: 'Originální i převedený výstup jsou automaticky a trvale smazány do 24 hodin od nahrání. Žádné výjimky, žádná manuální prodloužení — mazání vynucuje automatický proces. Odkaz ke stažení přestane fungovat. Neuchováváme žádné kopie, zálohy ani miniatury.',
  q6: 'Je web bezpečný a v souladu s GDPR?',
  a6: 'Ano. {{brand}} provozuje z Německa a plně podléhá GDPR. TLS 1.2+, hesla hashována bcrypt, httpOnly cookies SameSite=Strict. Smlouvy o zpracování s každým subzpracovatelem (čl. 28 GDPR). Přenosy mimo EHP přes standardní smluvní doložky EU nebo EU-US Data Privacy Framework. Vaše data nikdy neprodáváme.',
  q7: 'Co se stane s mými soubory po konverzi?',
  a7: 'Při konverzi je soubor zašifrovaně odeslán zpracovateli — CloudConvert pro standardní formáty, OpenAI pro Smart Functions. Provede se pouze požadovaná konverze. Nikdy nepřistupujeme k obsahu pro jiné účely. Oba soubory jsou odstraněny do 24 hodin z našich serverů a z cache subzpracovatelů.',
  q8: 'Lze soubory obnovit po smazání?',
  a8: 'Ne. Mazání je trvalé a nevratné. Neudržujeme zálohy uživatelských souborů (zálohy databáze záměrně vylučují soubory). Podporuje to vaše právo na výmaz (čl. 17 GDPR). Vždy stahujte převedené soubory během 24 hodin a ukládejte je lokálně.',
  q9: 'Jaká je maximální velikost souboru?',
  a9: '200 MB na soubor pro standardní konverze. Smart Functions jsou omezeny na 25 MB na soubor (tvrdý limit OpenAI API). U větších souborů je rozdělte lokálně (např. pomocí ffmpeg) a převeďte každou část. Pro firemní potřeby pište na Support@convertanyformat.com.',
  q10: 'Jaké prohlížeče jsou podporovány?',
  a10: 'Všechny moderní prohlížeče aktualizované v posledních dvou letech: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ a většina mobilních prohlížečů. JavaScript a cookies musí být povoleny. Pro nahrávání mikrofonem (Řeč na text) udělte oprávnění při výzvě. Internet Explorer není podporován.',
  q11: 'Funguje na mobilu?',
  a11: 'Ano — plně optimalizováno pro mobil. Rozhraní se přizpůsobuje obrazovkám od 320 px, karty nástrojů se na malých obrazovkách zobrazují ve dvou sloupcích a všechny funkce včetně nahrávání zvuku z mikrofonu fungují na iOS Safari a Android Chrome. Lze nainstalovat jako Progressive Web App.',
  q12: 'Jak zrušit nebo získat vrácení peněz?',
  a12: 'Žádné předplatné ke zrušení — kredity jsou jednorázové nákupy bez vypršení. Pro vrácení nepoužitých kreditů napište na Support@convertanyformat.com do 14 dnů od nákupu (Fernabsatzgesetz). Vrácení během 5–10 pracovních dní. Použité kredity obvykle nevratné s výjimkou chyby z naší strany. Smazat účet přes Profil → Nebezpečná zóna.',
  q13: 'Co jsou nástroje Smart Functions?',
  a13: 'Nástroje s AI nad rámec konverze: OCR (extrahuje text ze skenovaných PDF a obrázků), Komprese PDF s AI, Text na řeč (audio MP3/OPUS/AAC přes OpenAI TTS-1), Řeč na text (transkripce TXT/DOCX přes Whisper) a Automatický generátor titulků (SRT/VTT z videa). Účtováno podle použití.',
  q14: 'Co je OCR a kdy ho použít?',
  a14: 'OCR (Optické rozpoznávání znaků) extrahuje upravitelný text z obrázků. Použijte u skenovaných PDF, fotek dokumentů nebo obrázků, kde nelze označit text. {{brand}} vrátí prohledávatelné PDF (původní rozvržení + neviditelná textová vrstva) nebo prostý text. Použití: digitalizace, prohledávatelné archivy, výňatky citátů.',
  q15: 'Jak funguje Text na řeč?',
  a15: 'Napište nebo vložte až 4096 znaků, vyberte jeden z šesti hlasů (Alloy, Echo, Fable, Onyx, Nova, Shimmer), rychlost (0,75x až 1,5x) a formát (MP3, OPUS, AAC), klikněte na Převést. Během sekund obdržíte audio soubor s přirozeným hlasem generovaným OpenAI TTS-1. Cena: 1 kredit za 1000 znaků.',
  q16: 'Jak funguje Řeč na text?',
  a16: 'Nahrajte audio soubor (MP3, WAV, M4A, OGG, MP4, WebM) do 25 MB. Přepisujeme pomocí OpenAI Whisper. Vyberte TXT nebo DOCX. Také nahrávání z mikrofonu. Volitelné nápověda jazyka zlepší přesnost. Cena: 1 kredit za 5 minut (zaokrouhleno). Přepis se zobrazí na stránce ke kontrole před stažením.',
  q17: 'Jak funguje Automatický generátor titulků?',
  a17: 'Nahrajte video (MP4, MOV, AVI, MKV) do 25 MB. Extrahujeme zvuk podle potřeby (CloudConvert pro ne-MP4 kontejnery) a přepíšeme přes Whisper v režimu časových značek. Získáte SRT nebo VTT soubor připravený pro YouTube, Vimeo, Premiere nebo jakýkoli editor. Cena: 1 kredit za 5 minut videa.',
  q18: 'Jaké jazyky jsou podporovány?',
  a18: 'Rozhraní je přeloženo do 17 evropských jazyků: angličtina, němčina, francouzština, španělština, italština, portugalština, nizozemština, polština, švédština, norština, dánština, finština, čeština, rumunština, maďarština, řečtina, turečtina. Smart Functions: Whisper přes 50 jazyků; TTS přes 30; OCR: angličtina, němčina, francouzština, španělština, italština, portugalština, čínština, japonština, korejština.',
  q19: 'Jak změnit nastavení účtu?',
  a19: 'Klikněte na své jméno v navigaci pro přechod na Profil. Tam můžete aktualizovat e-mail (s ověřením), nastavit zobrazované jméno, změnit heslo, konfigurovat oznámení, zobrazit historii a zůstatek, vygenerovat API klíč, najít doporučující kód a trvale smazat účet (Nebezpečná zóna). Smazání odstraní všechna související data do 30 dnů.',
  q20: 'Jak kontaktovat podporu?',
  a20: 'Pište na Support@convertanyformat.com. Odpověď do 24h v pracovní dny, 48h o víkendech. GDPR dotazy: napište "GDPR" do předmětu pro prioritu. Také kontaktní formulář na /contact. Žádná telefonická podpora, ale videohovor je k dispozici pro firemní dotazy.',
});

// =====================================================================
// Romanian
// =====================================================================
const roFaq = makeFaq({
  title: 'Întrebări frecvente',
  subtitle: 'Tot ce trebuie să știți despre {{brand}} — conversii, prețuri, securitate, Smart Functions și altele.',
  seoDesc: 'Întrebări frecvente despre {{brand}}. Conversii, prețuri, securitate, Smart Functions, limbi, rambursări și contact.',
  q1: 'Cum funcționează conversia pas cu pas?',
  a1: 'Patru pași: (1) trageți și plasați fișierul sau faceți clic pentru a naviga — până la 200 MB; (2) alegeți formatul de ieșire din meniul derulant; (3) ajustați setările avansate dacă e necesar (calitate, rezoluție, OCR); (4) faceți clic pe Convertește — fișierul este trimis criptat către procesorul nostru, creditele sunt deduse și primiți un link de descărcare în câteva secunde.',
  q2: 'Ce formate de fișiere sunt acceptate?',
  a2: 'Peste 50 de formate în șase categorii: Documente (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Imagini (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Audio (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Video (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Arhive (ZIP, RAR, 7Z, TAR, GZ) și instrumente PDF dedicate. Lista completă este pe pagina Instrumente.',
  q3: 'Cum funcționează sistemul de credite?',
  a3: '{{brand}} folosește un model preplătit de credite — fără abonamente. Conversiile standard costă 1 credit. Smart Functions sunt taxate per utilizare: Text în vorbire 1 credit la 1000 de caractere; Vorbire în text și subtitrări 1 credit la 5 minute (rotunjit în sus). Conversiile eșuate sunt gratuite. Creditele nu expiră niciodată. 5 credite bonus pentru fiecare prieten recomandat.',
  q4: 'Ce conține fiecare pachet și cum cumpăr?',
  a4: 'Trei pachete: 1 credit (0,99 €), 10 credite (7,99 €, ~19% reducere) și 30 de credite (20,99 €, ~30% reducere). Toate prețurile includ TVA-ul german de 19%. Cumpărați prin Stripe — carduri și SEPA acceptate. Factură fiscală pe e-mail imediat, creditele sunt disponibile instantaneu.',
  q5: 'Cât timp sunt stocate fișierele înainte de ștergere?',
  a5: 'Atât fișierul original, cât și ieșirea convertită sunt șterse automat și permanent în 24 de ore de la încărcare. Fără excepții, fără prelungiri manuale — ștergerea este aplicată de un proces automatizat. Linkul de descărcare nu mai funcționează. Nu păstrăm copii, copii de rezervă sau miniaturi.',
  q6: 'Site-ul este sigur și conform GDPR?',
  a6: 'Da. {{brand}} este operat din Germania și complet supus GDPR. TLS 1.2+, parole hash-uite cu bcrypt, cookie-uri httpOnly SameSite=Strict. Acorduri de prelucrare a datelor cu fiecare subîmputernicit (Art. 28 GDPR). Transferurile în afara SEE prin Clauze Contractuale Standard ale UE sau cadrul EU-US Data Privacy Framework. Nu vă vindem niciodată datele.',
  q7: 'Ce se întâmplă cu fișierele mele după conversie?',
  a7: 'La conversie, fișierul este trimis criptat către procesor — CloudConvert pentru formate standard, OpenAI pentru Smart Functions. Se efectuează doar conversia solicitată. Nu accesăm niciodată conținutul în alte scopuri. Ambele fișiere sunt eliminate în 24 de ore de pe serverele noastre și din cache-urile subîmputerniciților.',
  q8: 'Pot fi recuperate fișierele după ștergere?',
  a8: 'Nu. Ștergerea este permanentă și ireversibilă. Nu păstrăm copii de rezervă ale fișierelor utilizatorilor (copiile de rezervă ale bazei de date exclud fișierele intenționat). Aceasta vă susține dreptul la ștergere (Art. 17 GDPR). Descărcați întotdeauna fișierele convertite în 24 de ore și păstrați-le local.',
  q9: 'Care este dimensiunea maximă a fișierului?',
  a9: '200 MB pe fișier pentru conversii standard. Smart Functions sunt limitate la 25 MB pe fișier (limită strictă a API-ului OpenAI). Pentru fișiere mai mari, împărțiți-le local (de ex. cu ffmpeg) și convertiți fiecare parte. Pentru nevoi de afaceri, scrieți la Support@convertanyformat.com.',
  q10: 'Ce browsere sunt acceptate?',
  a10: 'Toate browserele moderne actualizate în ultimii doi ani: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ și majoritatea browserelor mobile. JavaScript și cookie-urile trebuie activate. Pentru înregistrare cu microfon (Vorbire în text), acordați permisiunea când vi se cere. Internet Explorer nu este acceptat.',
  q11: 'Funcționează pe mobil?',
  a11: 'Da — complet optimizat pentru mobil. Interfața se adaptează la ecrane de la 320 px, cardurile de instrumente se afișează pe două coloane pe ecrane mici, iar toate funcțiile, inclusiv înregistrarea audio de la microfon, funcționează pe iOS Safari și Android Chrome. Poate fi instalat ca Progressive Web App.',
  q12: 'Cum anulez sau obțin o rambursare?',
  a12: 'Fără abonamente de anulat — creditele sunt achiziții unice care nu expiră. Pentru rambursarea creditelor neutilizate, scrieți la Support@convertanyformat.com în termen de 14 zile de la cumpărare (Fernabsatzgesetz). Rambursare în 5–10 zile lucrătoare. Creditele utilizate de obicei nu sunt rambursabile, cu excepția erorilor de partea noastră. Ștergeți contul prin Profil → Zonă periculoasă.',
  q13: 'Ce sunt instrumentele Smart Functions?',
  a13: 'Instrumente AI dincolo de conversie: OCR (extrage text din PDF-uri și imagini scanate), Comprimă PDF cu AI, Text în vorbire (audio MP3/OPUS/AAC prin OpenAI TTS-1), Vorbire în text (transcriere TXT/DOCX prin Whisper) și Generator automat de subtitrări (SRT/VTT din video). Taxate per utilizare.',
  q14: 'Ce este OCR și când să-l folosesc?',
  a14: 'OCR (Recunoaștere Optică a Caracterelor) extrage text editabil din imagini. Folosiți-l cu PDF-uri scanate, fotografii ale documentelor sau orice imagine în care textul nu poate fi selectat. {{brand}} returnează un PDF căutabil (aspect original + strat de text invizibil) sau text simplu. Cazuri de utilizare: digitalizare, arhive căutabile, extragere de citate.',
  q15: 'Cum funcționează Text în vorbire?',
  a15: 'Tastați sau lipiți până la 4096 de caractere, alegeți una dintre cele șase voci (Alloy, Echo, Fable, Onyx, Nova, Shimmer), viteza (0,75x până la 1,5x) și formatul (MP3, OPUS, AAC), faceți clic pe Convertește. În câteva secunde primiți un fișier audio cu voce naturală generat de OpenAI TTS-1. Cost: 1 credit la 1000 de caractere.',
  q16: 'Cum funcționează Vorbire în text?',
  a16: 'Încărcați un fișier audio (MP3, WAV, M4A, OGG, MP4, WebM) de până la 25 MB. Transcriem cu OpenAI Whisper. Alegeți TXT sau DOCX. De asemenea, înregistrare de la microfon. Sugestia de limbă opțională îmbunătățește precizia. Cost: 1 credit la 5 minute (rotunjit). Transcrierea este afișată pe pagină pentru revizuire înainte de descărcare.',
  q17: 'Cum funcționează Generatorul automat de subtitrări?',
  a17: 'Încărcați un video (MP4, MOV, AVI, MKV) de până la 25 MB. Extragem audio dacă e necesar (CloudConvert pentru containere non-MP4) și transcriem cu Whisper în mod cu marcaje de timp. Obțineți un fișier SRT sau VTT gata pentru YouTube, Vimeo, Premiere sau orice editor. Cost: 1 credit la 5 minute de video.',
  q18: 'Ce limbi sunt acceptate?',
  a18: 'Interfața este tradusă în 17 limbi europene: engleză, germană, franceză, spaniolă, italiană, portugheză, olandeză, poloneză, suedeză, norvegiană, daneză, finlandeză, cehă, română, maghiară, greacă, turcă. Smart Functions: Whisper peste 50 de limbi; TTS peste 30; OCR: engleză, germană, franceză, spaniolă, italiană, portugheză, chineză, japoneză, coreeană.',
  q19: 'Cum schimb setările contului?',
  a19: 'Faceți clic pe numele dvs. din navigare pentru a accesa Profilul. Acolo puteți actualiza e-mailul (cu verificare), seta un nume afișat, schimba parola, configura notificări, vedea istoricul și soldul, genera o cheie API, găsi codul de recomandare și șterge contul permanent (Zonă periculoasă). Ștergerea elimină toate datele asociate în 30 de zile.',
  q20: 'Cum contactez asistența?',
  a20: 'Scrieți la Support@convertanyformat.com. Răspuns în 24h în zilele lucrătoare, 48h în weekend. Solicitări GDPR: includeți "GDPR" în subiect pentru prioritate. De asemenea, formular de contact pe /contact. Fără asistență telefonică, dar apel video disponibil pentru solicitări de afaceri.',
});

// =====================================================================
// Turkish
// =====================================================================
const trFaq = makeFaq({
  title: 'Sıkça sorulan sorular',
  subtitle: '{{brand}} hakkında bilmeniz gereken her şey — dönüştürmeler, fiyatlar, güvenlik, Smart Functions ve daha fazlası.',
  seoDesc: '{{brand}} hakkında sıkça sorulan sorular. Dönüştürmeler, fiyatlar, güvenlik, Smart Functions, diller, geri ödemeler ve iletişim.',
  q1: 'Dönüşüm adım adım nasıl çalışır?',
  a1: 'Dört adım: (1) dosyayı sürükleyip bırakın veya gözatın — 200 MB\'a kadar; (2) açılır menüden çıktı formatını seçin; (3) gerekirse gelişmiş ayarları yapın (kalite, çözünürlük, OCR); (4) Dönüştür\'e tıklayın — dosya işleyicimize şifrelenmiş olarak gönderilir, krediler düşülür ve saniyeler içinde indirme bağlantısı alırsınız.',
  q2: 'Hangi dosya formatları desteklenir?',
  a2: 'Altı kategoride 50\'den fazla format: Belgeler (PDF, DOCX, XLSX, PPTX, RTF, ODT, HTML), Görüntüler (JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO), Ses (MP3, WAV, FLAC, AAC, OGG, WMA, M4A), Video (MP4, AVI, MOV, MKV, WebM, FLV, WMV), Arşivler (ZIP, RAR, 7Z, TAR, GZ) ve özel PDF araçları. Tam liste Araçlar sayfasında.',
  q3: 'Kredi sistemi nasıl çalışır?',
  a3: '{{brand}} ön ödemeli kredi modeli kullanır — abonelik yok. Standart dönüştürmeler 1 kredidir. Smart Functions kullanıma göre faturalandırılır: Metinden konuşmaya 1000 karakter başına 1 kredi; Konuşmadan metne ve altyazılar 5 dakika başına 1 kredi (yukarı yuvarlanır). Başarısız dönüştürmeler ücretsizdir. Krediler süresi dolmaz. Yönlendirilen arkadaş başına 5 bonus kredi.',
  q4: 'Her paket neler içerir ve nasıl satın alınır?',
  a4: 'Üç paket: 1 kredi (0,99 €), 10 kredi (7,99 €, ~%19 indirim) ve 30 kredi (20,99 €, ~%30 indirim). Tüm fiyatlara %19 Alman KDV dahildir. Stripe ile satın alma — kartlar ve SEPA kabul edilir. Vergi uyumlu fatura hemen e-posta ile gönderilir, krediler anında kullanılabilir.',
  q5: 'Dosyalar silinmeden ne kadar süre saklanır?',
  a5: 'Hem orijinal dosya hem de dönüştürülmüş çıktı, yüklemeden sonra 24 saat içinde otomatik ve kalıcı olarak silinir. İstisna yok, manuel uzatma yok — silme otomatik bir süreçle uygulanır. İndirme bağlantısı çalışmayı durdurur. Kopya, yedek veya küçük resim tutmuyoruz.',
  q6: 'Site güvenli ve GDPR uyumlu mu?',
  a6: 'Evet. {{brand}} Almanya\'dan işletilir ve tamamen GDPR\'ye tabidir. TLS 1.2+, bcrypt ile parola hash\'leri, httpOnly çerezler SameSite=Strict. Her alt veri işleyici ile Veri İşleme Anlaşmaları (Madde 28 GDPR). AEA dışına aktarımlar AB Standart Sözleşme Maddeleri veya EU-US Data Privacy Framework ile yapılır. Verilerinizi asla satmayız.',
  q7: 'Dönüşümden sonra dosyalarıma ne olur?',
  a7: 'Dönüştürmede dosya, işleyiciye şifrelenmiş olarak gönderilir — standart formatlar için CloudConvert, Smart Functions için OpenAI. Yalnızca istenen dönüşüm gerçekleştirilir. İçeriğe başka amaçlarla asla erişmiyoruz. Her iki dosya da 24 saat içinde sunucularımızdan ve alt işleyici önbelleklerinden kaldırılır.',
  q8: 'Silinen dosyalar kurtarılabilir mi?',
  a8: 'Hayır. Silme kalıcı ve geri alınamaz. Kullanıcı dosyalarının yedeklerini tutmuyoruz (veritabanı yedekleri kasıtlı olarak dosyaları hariç tutar). Bu, silme hakkınızı (Madde 17 GDPR) destekler. Dönüştürülen dosyalarınızı her zaman 24 saat içinde indirin ve yerel olarak saklayın.',
  q9: 'Maksimum dosya boyutu nedir?',
  a9: 'Standart dönüştürmeler için dosya başına 200 MB. Smart Functions, dosya başına 25 MB ile sınırlıdır (OpenAI API\'sinin sıkı sınırı). Daha büyük dosyalar için yerel olarak bölün (örn. ffmpeg ile) ve her parçayı dönüştürün. Kurumsal ihtiyaçlar için Support@convertanyformat.com adresine yazın.',
  q10: 'Hangi tarayıcılar desteklenir?',
  a10: 'Son iki yılda güncellenmiş tüm modern tarayıcılar: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+ ve çoğu mobil tarayıcı. JavaScript ve çerezler etkin olmalıdır. Mikrofon kaydı (Konuşmadan metne) için sorulduğunda izin verin. Internet Explorer desteklenmez.',
  q11: 'Mobilde çalışıyor mu?',
  a11: 'Evet — tamamen mobil için optimize edilmiştir. Arayüz 320 px\'den itibaren ekranlara uyum sağlar, araç kartları küçük ekranlarda iki sütunda görüntülenir ve mikrofondan ses kaydı dahil tüm özellikler iOS Safari ve Android Chrome\'da çalışır. Progressive Web App olarak yüklenebilir.',
  q12: 'Nasıl iptal ederim veya geri ödeme alırım?',
  a12: 'İptal edilecek abonelik yok — krediler süresi dolmayan tek seferlik satın almalardır. Kullanılmamış kredilerin iadesi için satın almadan sonra 14 gün içinde Support@convertanyformat.com adresine yazın (Fernabsatzgesetz). 5–10 iş günü içinde geri ödeme. Kullanılmış krediler genellikle iade edilmez, bizim tarafımızdaki hatalar hariç. Hesabı Profil → Tehlike Bölgesi üzerinden silin.',
  q13: 'Smart Functions araçları nelerdir?',
  a13: 'Dönüşümün ötesinde AI tabanlı araçlar: OCR (taranmış PDF\'lerden ve görüntülerden metin çıkarır), AI ile PDF Sıkıştır, Metinden konuşmaya (OpenAI TTS-1 ile MP3/OPUS/AAC ses), Konuşmadan metne (Whisper ile TXT/DOCX transkripsiyon) ve Otomatik Altyazı Oluşturucu (videodan SRT/VTT). Kullanıma göre faturalandırılır.',
  q14: 'OCR nedir ve ne zaman kullanmalıyım?',
  a14: 'OCR (Optik Karakter Tanıma) görüntülerden düzenlenebilir metin çıkarır. Taranmış PDF\'ler, belge fotoğrafları veya metnin seçilemediği herhangi bir görüntü için kullanın. {{brand}} aranabilir bir PDF (orijinal düzen + görünmez metin katmanı) veya düz metin döndürür. Kullanım örnekleri: dijitalleştirme, aranabilir arşivler, alıntı çıkarma.',
  q15: 'Metinden konuşmaya nasıl çalışır?',
  a15: '4096 karaktere kadar yazın veya yapıştırın, altı sesten birini seçin (Alloy, Echo, Fable, Onyx, Nova, Shimmer), hızı (0,75x ila 1,5x) ve formatı (MP3, OPUS, AAC), Dönüştür\'e tıklayın. Saniyeler içinde OpenAI TTS-1 tarafından oluşturulan doğal sesli bir ses dosyası alırsınız. Maliyet: 1000 karakter başına 1 kredi.',
  q16: 'Konuşmadan metne nasıl çalışır?',
  a16: '25 MB\'a kadar bir ses dosyası (MP3, WAV, M4A, OGG, MP4, WebM) yükleyin. OpenAI Whisper ile transkripsiyon yaparız. TXT veya DOCX seçin. Mikrofondan kayıt da mümkündür. İsteğe bağlı dil ipucu doğruluğu artırır. Maliyet: 5 dakika başına 1 kredi (yukarı yuvarlanır). Transkripsiyon, indirmeden önce inceleyebilmeniz için sayfada gösterilir.',
  q17: 'Otomatik Altyazı Oluşturucu nasıl çalışır?',
  a17: '25 MB\'a kadar bir video (MP4, MOV, AVI, MKV) yükleyin. Gerekirse sesi çıkarırız (MP4 olmayan kapsayıcılar için CloudConvert) ve zaman damgalı modda Whisper ile transkripsiyon yaparız. YouTube, Vimeo, Premiere veya herhangi bir editör için hazır bir SRT veya VTT dosyası alırsınız. Maliyet: 5 dakika video başına 1 kredi.',
  q18: 'Hangi diller desteklenir?',
  a18: 'Arayüz 17 Avrupa diline çevrilmiştir: İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Felemenkçe, Lehçe, İsveççe, Norveççe, Danca, Fince, Çekçe, Romence, Macarca, Yunanca, Türkçe. Smart Functions: Whisper 50\'den fazla dil; TTS 30\'dan fazla; OCR: İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Çince, Japonca, Korece.',
  q19: 'Hesap ayarlarını nasıl değiştiririm?',
  a19: 'Profilinize gitmek için gezinmedeki adınıza tıklayın. Orada e-postanızı (doğrulama ile) güncelleyebilir, görünen ad ayarlayabilir, parola değiştirebilir, bildirimleri yapılandırabilir, geçmişi ve bakiyeyi görüntüleyebilir, API anahtarı oluşturabilir, yönlendirme kodunuzu bulabilir ve hesabı kalıcı olarak silebilirsiniz (Tehlike Bölgesi). Silme, ilgili tüm verileri 30 gün içinde kaldırır.',
  q20: 'Desteğe nasıl ulaşırım?',
  a20: 'Support@convertanyformat.com adresine yazın. İş günlerinde 24 saat, hafta sonları 48 saat içinde yanıt veririz. GDPR sorguları: önceliklendirme için konuya "GDPR" yazın. /contact sayfasında iletişim formu da var. Telefon desteği yok, ancak kurumsal sorgular için video görüşme mevcuttur.',
});

// =====================================================================
// Helpers
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
  const start = m.index;
  const openBrace = m.index + m[0].length - 1;
  let depth = 0;
  for (let i = openBrace; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') { depth--; if (depth === 0) return { start, end: i + 1 }; }
  }
  return null;
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

function replaceTopLevelKey(text, keyName, newObject, scopeStart, scopeEnd) {
  const block = findKeyBlock(text.slice(scopeStart, scopeEnd), keyName);
  if (block) {
    const absStart = scopeStart + block.start;
    const absEnd = scopeStart + block.end;
    return text.slice(0, absStart) + `${keyName}: ${formatObjectLiteral(newObject)}` + text.slice(absEnd);
  }
  // Insert before the lang block's closing `}`. scopeEnd points to char
  // after the closing brace, so brace is at scopeEnd - 1. Walk back to
  // skip whitespace and find a comma or `{` to decide trailing punctuation.
  let i = scopeEnd - 2;
  while (i > scopeStart && /\s/.test(text[i])) i--;
  const needsLeadingComma = text[i] !== ',' && text[i] !== '{';
  const insertion = `${needsLeadingComma ? ',' : ''}\n  ${keyName}: ${formatObjectLiteral(newObject, '  ')},\n`;
  return text.slice(0, scopeEnd - 1) + insertion + text.slice(scopeEnd - 1);
}

const PAYLOADS = { da: daFaq, cs: csFaq, ro: roFaq, tr: trFaq };

for (const [lang, faq] of Object.entries(PAYLOADS)) {
  const block = findLangBlock(content, lang);
  content = replaceTopLevelKey(content, 'faq', faq, block.start, block.end);
  console.log(`✔ Updated ${lang}.faq`);
}

fs.writeFileSync(FILE, content);
console.log('\nDone (4 of 7 — fi/hu/el coming next).');
