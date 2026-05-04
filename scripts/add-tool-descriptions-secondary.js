// Companion to add-tool-descriptions.js — adds the toolDescriptions
// section to the 7 secondary languages (da, fi, cs, ro, hu, el, tr).
// 7 langs × 59 tools = 413 strings.
//
// Run from repo root:  node scripts/add-tool-descriptions-secondary.js

const fs = require('fs');
const path = require('path');

const I18N_TRANS = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');

// Each row is [slug, da, fi, cs, ro, hu, el, tr].
const ROWS = [
  // ── Document ──
  ['pdf-to-word',
    'Konverter dine PDF-dokumenter til fuldt redigerbare Word-filer. Perfekt til at redigere scannede dokumenter, kontrakter eller enhver PDF, du skal ændre i Microsoft Word.',
    'Muunna PDF-asiakirjasi täysin muokattaviksi Word-tiedostoiksi. Ihanteellinen skannattujen asiakirjojen, sopimusten tai minkä tahansa Microsoft Wordissa muokattavan PDF:n käsittelyyn.',
    'Převeďte své dokumenty PDF na plně upravitelné soubory Word. Ideální pro úpravu naskenovaných dokumentů, smluv nebo jakéhokoli PDF, které potřebujete upravit v Microsoft Word.',
    'Convertiți documentele PDF în fișiere Word complet editabile. Perfect pentru editarea documentelor scanate, contractelor sau oricărui PDF pe care doriți să-l modificați în Microsoft Word.',
    'Konvertálja PDF-dokumentumait teljesen szerkeszthető Word-fájlokká. Tökéletes szkennelt dokumentumok, szerződések vagy bármely PDF szerkesztéséhez Microsoft Wordben.',
    'Μετατρέψτε τα έγγραφα PDF σας σε πλήρως επεξεργάσιμα αρχεία Word. Ιδανικό για επεξεργασία σαρωμένων εγγράφων, συμβολαίων ή οποιουδήποτε PDF χρειάζεστε να τροποποιήσετε στο Microsoft Word.',
    'PDF belgelerinizi tamamen düzenlenebilir Word dosyalarına dönüştürün. Taranmış belgeleri, sözleşmeleri veya Microsoft Word\'de değiştirmek istediğiniz herhangi bir PDF\'yi düzenlemek için mükemmeldir.'],

  ['word-to-pdf',
    'Konverter Word-dokumenter til PDF-format med bevaret formatering, skrifttyper og layout. Ideelt til at dele færdiggjorte dokumenter, der ser ens ud på alle enheder.',
    'Muunna Word-asiakirjat PDF-muotoon säilyttäen muotoilun, fontit ja asettelun. Ihanteellinen valmiiden asiakirjojen jakamiseen niin, että ne näyttävät identtisiltä jokaisella laitteella.',
    'Převeďte dokumenty Word do PDF se zachovaným formátováním, písmy a rozvržením. Ideální pro sdílení dokončených dokumentů, které vypadají identicky na všech zařízeních.',
    'Convertiți documente Word în PDF păstrând formatarea, fonturile și aspectul. Ideal pentru partajarea documentelor finalizate care arată identic pe orice dispozitiv.',
    'Konvertálja a Word dokumentumokat PDF formátumba a formázás, betűtípusok és elrendezés megőrzésével. Ideális a véglegesített dokumentumok megosztásához, amelyek minden eszközön azonosan néznek ki.',
    'Μετατρέψτε έγγραφα Word σε PDF διατηρώντας μορφοποίηση, γραμματοσειρές και διάταξη. Ιδανικό για κοινοποίηση οριστικών εγγράφων που φαίνονται ίδια σε κάθε συσκευή.',
    'Word belgelerini biçimlendirme, yazı tipleri ve düzen korunarak PDF formatına dönüştürün. Her cihazda aynı görünen tamamlanmış belgeleri paylaşmak için idealdir.'],

  ['pdf-to-excel',
    'Udtræk tabeller og data fra dine PDF\'er til redigerbare Excel-regneark. Sparer timer af manuel indtastning til rapporter, fakturaer og kontoudtog.',
    'Pura taulukot ja tiedot PDF-tiedostoistasi muokattaviksi Excel-laskentataulukoiksi. Säästää tunteja manuaalista uudelleen kirjoittamista raporttien, laskujen ja otteiden parissa.',
    'Extrahujte tabulky a data z vašich PDF do upravitelných tabulek Excel. Ušetří hodiny ručního přepisování pro zprávy, faktury a výpisy.',
    'Extrageți tabele și date din PDF-urile dvs. în foi de calcul Excel editabile. Economisește ore de retastat manual pentru rapoarte, facturi și extrase.',
    'Vonjon ki táblázatokat és adatokat PDF-jeiből szerkeszthető Excel-táblázatokba. Órákat takarít meg a kézi átírásból jelentések, számlák és kimutatások esetén.',
    'Εξαγάγετε πίνακες και δεδομένα από τα PDF σας σε επεξεργάσιμα φύλλα Excel. Εξοικονομεί ώρες χειροκίνητης πληκτρολόγησης για αναφορές, τιμολόγια και καταστάσεις.',
    'PDF\'lerinizdeki tabloları ve verileri düzenlenebilir Excel elektronik tablolarına çıkarın. Raporlar, faturalar ve hesap özetleri için saatlerce manuel yeniden yazma işinden tasarruf sağlar.'],

  ['excel-to-pdf',
    'Konverter Excel-regneark til PDF for nem deling og udskrivning. Bevarer formler, diagrammer og formatering i et universelt læsbart format.',
    'Muunna Excel-laskentataulukot PDF-muotoon helppoa jakamista ja tulostamista varten. Säilyttää kaavat, kaaviot ja muotoilun yleisesti luettavassa muodossa.',
    'Převeďte tabulky Excel do PDF pro snadné sdílení a tisk. Zachovává vzorce, grafy a formátování v univerzálně čitelném formátu.',
    'Convertiți foi de calcul Excel în PDF pentru partajare și imprimare ușoară. Păstrează formule, grafice și formatare într-un format citibil universal.',
    'Konvertálja Excel táblázatait PDF-be könnyű megosztásért és nyomtatásért. Megőrzi a képleteket, diagramokat és formázást univerzálisan olvasható formátumban.',
    'Μετατρέψτε φύλλα Excel σε PDF για εύκολη κοινοποίηση και εκτύπωση. Διατηρεί τύπους, γραφήματα και μορφοποίηση σε μορφή καθολικά αναγνώσιμη.',
    'Excel elektronik tablolarını kolay paylaşım ve yazdırma için PDF\'ye dönüştürün. Formülleri, grafikleri ve biçimlendirmeyi evrensel olarak okunabilir bir formatta korur.'],

  ['pptx-to-pdf',
    'Forvandl PowerPoint-præsentationer til PDF-filer for nem deling på tværs af enheder. Bevarer slidelayout, skrifttyper og indlejrede medier.',
    'Muunna PowerPoint-esitykset PDF-tiedostoiksi helppoa jakamista varten laitteiden välillä. Säilyttää dia-asettelun, fontit ja upotetut mediat.',
    'Přeměňte prezentace PowerPoint na PDF soubory pro snadné sdílení mezi zařízeními. Zachovává rozvržení snímků, písma a vložená média.',
    'Transformați prezentări PowerPoint în fișiere PDF pentru partajare ușoară între dispozitive. Păstrează aspectul slide-urilor, fonturile și conținutul multimedia încorporat.',
    'Alakítsa át PowerPoint prezentációit PDF fájlokká az egyszerű, eszközök közötti megosztáshoz. Megőrzi a dia-elrendezést, betűtípusokat és beágyazott médiát.',
    'Μετατρέψτε παρουσιάσεις PowerPoint σε PDF για εύκολη κοινοποίηση μεταξύ συσκευών. Διατηρεί διάταξη διαφανειών, γραμματοσειρές και ενσωματωμένα μέσα.',
    'PowerPoint sunumlarını cihazlar arasında kolay paylaşım için PDF dosyalarına dönüştürün. Slayt düzenini, yazı tiplerini ve gömülü medyayı korur.'],

  ['pdf-to-pptx',
    'Konverter PDF-dokumenter tilbage til redigerbare PowerPoint-slides. Nyttigt når du skal opdatere eller genbruge en præsentation, du kun har som PDF.',
    'Muunna PDF-asiakirjat takaisin muokattaviksi PowerPoint-dioiksi. Hyödyllistä kun tarvitset päivittää tai uudelleenkäyttää esitystä, joka on saatavilla vain PDF-muodossa.',
    'Převeďte dokumenty PDF zpět na upravitelné snímky PowerPoint. Užitečné, když potřebujete aktualizovat nebo znovu použít prezentaci, kterou máte pouze jako PDF.',
    'Convertiți documente PDF înapoi în slide-uri PowerPoint editabile. Util când trebuie să actualizați sau să refolosiți o prezentare disponibilă doar ca PDF.',
    'Konvertálja vissza a PDF-dokumentumokat szerkeszthető PowerPoint-diákká. Hasznos, ha frissítenie vagy újra fel kell használnia egy csak PDF-ként rendelkezésre álló prezentációt.',
    'Μετατρέψτε έγγραφα PDF ξανά σε επεξεργάσιμες διαφάνειες PowerPoint. Χρήσιμο όταν χρειάζεται να ενημερώσετε ή να επαναχρησιμοποιήσετε μια παρουσίαση που έχετε μόνο σε PDF.',
    'PDF belgelerini tekrar düzenlenebilir PowerPoint slaytlarına dönüştürün. Yalnızca PDF olarak elinizde olan bir sunumu güncellemeniz veya yeniden kullanmanız gerektiğinde faydalıdır.'],

  ['pdf-to-txt',
    'Udtræk almindelig tekst fra PDF-filer til analyse, redigering eller genbrug. Fantastisk til at behandle dokumenter i scripts eller teksteditorer.',
    'Pura tavallinen teksti PDF-tiedostoista analyysiä, muokkausta tai uudelleenkäyttöä varten. Erinomainen asiakirjojen käsittelyyn skripteissä tai tekstieditoreissa.',
    'Extrahujte čistý text z PDF souborů pro analýzu, úpravu nebo opětovné použití. Skvělé pro zpracování dokumentů ve skriptech nebo textových editorech.',
    'Extrageți conținut text simplu din fișiere PDF pentru analiză, editare sau reutilizare. Excelent pentru procesarea documentelor în scripturi sau editoare de text.',
    'Vonja ki a sima szöveges tartalmat a PDF fájlokból elemzéshez, szerkesztéshez vagy újrafelhasználáshoz. Nagyszerű a dokumentumok feldolgozásához szkriptekben vagy szövegszerkesztőkben.',
    'Εξαγάγετε απλό κείμενο από αρχεία PDF για ανάλυση, επεξεργασία ή επαναχρησιμοποίηση. Εξαιρετικό για επεξεργασία εγγράφων σε scripts ή προγράμματα επεξεργασίας κειμένου.',
    'PDF dosyalarından düz metin içeriğini analiz, düzenleme veya yeniden kullanım için çıkarın. Belgeleri komut dosyalarında veya metin düzenleyicilerinde işlemek için harikadır.'],

  ['pdf-to-html',
    'Konverter PDF\'er til HTML-websider med bevaret layout, links og formatering. Perfekt til at udgive dokumenter online.',
    'Muunna PDF-tiedostot HTML-verkkosivuiksi säilyttäen asettelun, linkit ja muotoilun. Täydellinen asiakirjojen julkaisemiseen verkossa.',
    'Převeďte PDF na HTML webové stránky se zachovaným rozvržením, odkazy a formátováním. Perfektní pro publikování dokumentů online.',
    'Convertiți PDF-uri în pagini web HTML păstrând aspectul, linkurile și formatarea. Perfect pentru publicarea documentelor online.',
    'Konvertálja a PDF-eket HTML weboldalakká az elrendezés, hivatkozások és formázás megőrzésével. Tökéletes dokumentumok online közzétételéhez.',
    'Μετατρέψτε PDF σε HTML ιστοσελίδες διατηρώντας διάταξη, συνδέσμους και μορφοποίηση. Τέλειο για δημοσίευση εγγράφων online.',
    'PDF\'leri düzen, bağlantılar ve biçimlendirme korunarak HTML web sayfalarına dönüştürün. Belgeleri çevrimiçi yayımlamak için mükemmeldir.'],

  ['html-to-pdf',
    'Gem websider eller HTML-dokumenter som PDF-filer til offline læsning eller arkivering. Fanger styling, billeder og links.',
    'Tallenna verkkosivut tai HTML-asiakirjat PDF-tiedostoiksi offline-luentaa tai arkistointia varten. Tallentaa tyylit, kuvat ja linkit.',
    'Uložte webové stránky nebo dokumenty HTML jako soubory PDF pro offline čtení nebo archivaci. Zachycuje styl, obrázky a odkazy.',
    'Salvați pagini web sau documente HTML ca fișiere PDF pentru citire offline sau arhivare. Capturează stilul, imaginile și linkurile.',
    'Mentse el a weboldalakat vagy HTML-dokumentumokat PDF-fájlokként offline olvasáshoz vagy archiváláshoz. Rögzíti a stílust, képeket és hivatkozásokat.',
    'Αποθηκεύστε ιστοσελίδες ή έγγραφα HTML ως αρχεία PDF για ανάγνωση εκτός σύνδεσης ή αρχειοθέτηση. Καταγράφει στυλ, εικόνες και συνδέσμους.',
    'Web sayfalarını veya HTML belgelerini çevrimdışı okuma veya arşivleme için PDF dosyaları olarak kaydedin. Stil, görüntüler ve bağlantıları yakalar.'],

  ['rtf-to-pdf',
    'Konverter Rich Text Format-dokumenter til PDF for konsekvent præsentation på tværs af enheder. Bevarer skrifttyper, formatering og indlejrede medier.',
    'Muunna Rich Text Format -asiakirjat PDF-muotoon yhtenäistä esitystä varten kaikilla laitteilla. Säilyttää fontit, muotoilun ja upotetut mediat.',
    'Převeďte dokumenty Rich Text Format do PDF pro konzistentní prezentaci napříč zařízeními. Zachovává písma, formátování a vložená média.',
    'Convertiți documente Rich Text Format în PDF pentru o prezentare consistentă pe toate dispozitivele. Păstrează fonturile, formatarea și conținutul multimedia încorporat.',
    'Konvertálja a Rich Text Format dokumentumokat PDF-be következetes megjelenítéshez az eszközök között. Megőrzi a betűtípusokat, formázást és beágyazott médiát.',
    'Μετατρέψτε έγγραφα Rich Text Format σε PDF για συνεπή παρουσίαση σε όλες τις συσκευές. Διατηρεί γραμματοσειρές, μορφοποίηση και ενσωματωμένα μέσα.',
    'Rich Text Format belgelerini cihazlar arasında tutarlı bir sunum için PDF\'ye dönüştürün. Yazı tiplerini, biçimlendirmeyi ve gömülü medyayı korur.'],

  ['pdf-to-rtf',
    'Konverter PDF-filer til RTF-format til redigering i ethvert tekstbehandlingsprogram. Ideelt når du har brug for en bærbar, redigerbar kopi af en PDF.',
    'Muunna PDF-tiedostot RTF-muotoon muokkausta varten missä tahansa tekstinkäsittelyohjelmassa. Ihanteellinen kun tarvitset siirrettävän, muokattavan kopion PDF:stä.',
    'Převeďte PDF soubory do formátu RTF pro úpravu v jakémkoli textovém procesoru. Ideální, když potřebujete přenosnou, upravitelnou kopii PDF.',
    'Convertiți fișiere PDF în format RTF pentru editare în orice procesor de text. Ideal când aveți nevoie de o copie portabilă și editabilă a unui PDF.',
    'Konvertálja a PDF fájlokat RTF formátumba bármilyen szövegszerkesztőben történő szerkesztéshez. Ideális, ha hordozható, szerkeszthető másolatra van szüksége egy PDF-ből.',
    'Μετατρέψτε αρχεία PDF σε μορφή RTF για επεξεργασία σε οποιοδήποτε επεξεργαστή κειμένου. Ιδανικό όταν χρειάζεστε ένα φορητό, επεξεργάσιμο αντίγραφο ενός PDF.',
    'PDF dosyalarını herhangi bir kelime işlemcide düzenlemek için RTF formatına dönüştürün. Bir PDF\'nin taşınabilir, düzenlenebilir bir kopyasına ihtiyacınız olduğunda idealdir.'],

  ['odt-to-pdf',
    'Konverter OpenDocument Text-filer til PDF eller Word. Perfekt til at dele LibreOffice-dokumenter med alle, uanset hvilken kontorpakke de bruger.',
    'Muunna OpenDocument Text -tiedostot PDF- tai Word-muotoon. Täydellinen LibreOffice-asiakirjojen jakamiseen kaikille riippumatta siitä, mitä toimisto-ohjelmistoa he käyttävät.',
    'Převeďte soubory OpenDocument Text do PDF nebo Word. Ideální pro sdílení LibreOffice dokumentů s kýmkoli, bez ohledu na to, jakou kancelářskou sadu používá.',
    'Convertiți fișiere OpenDocument Text în PDF sau Word. Perfect pentru a partaja documente LibreOffice cu oricine, indiferent de suita de birou folosită.',
    'Konvertálja az OpenDocument Text fájlokat PDF-be vagy Word-be. Tökéletes LibreOffice dokumentumok megosztásához bárkivel, függetlenül attól, milyen irodai csomagot használ.',
    'Μετατρέψτε αρχεία OpenDocument Text σε PDF ή Word. Τέλειο για κοινοποίηση εγγράφων LibreOffice με οποιονδήποτε, ανεξάρτητα από τη σουίτα γραφείου που χρησιμοποιεί.',
    'OpenDocument Text dosyalarını PDF veya Word\'e dönüştürün. Hangi ofis paketini kullandıklarına bakılmaksızın LibreOffice belgelerini herkesle paylaşmak için mükemmeldir.'],

  // ── Image ──
  ['jpg-to-png',
    'Konverter JPG-billeder til PNG med transparenssupport. Ideelt til grafik, logoer og skærmbilleder, der kræver en gennemsigtig baggrund.',
    'Muunna JPG-kuvat PNG:ksi läpinäkyvyystuella. Ihanteellinen grafiikalle, logoille ja kuvakaappauksille, jotka tarvitsevat läpinäkyvän taustan.',
    'Převeďte obrázky JPG na PNG s podporou průhlednosti. Ideální pro grafiku, loga a snímky obrazovky, které vyžadují průhledné pozadí.',
    'Convertiți imagini JPG în PNG cu suport pentru transparență. Ideal pentru grafică, logo-uri și capturi de ecran care au nevoie de fundal transparent.',
    'Konvertálja a JPG képeket PNG-vé átlátszóság támogatással. Ideális grafikákhoz, logókhoz és képernyőképekhez, amelyek átlátszó hátteret igényelnek.',
    'Μετατρέψτε εικόνες JPG σε PNG με υποστήριξη διαφάνειας. Ιδανικό για γραφικά, λογότυπα και στιγμιότυπα οθόνης που χρειάζονται διαφανές φόντο.',
    'JPG görüntülerini şeffaflık desteğiyle PNG\'ye dönüştürün. Şeffaf arka plan gerektiren grafikler, logolar ve ekran görüntüleri için idealdir.'],

  ['png-to-jpg',
    'Konverter PNG-billeder til JPG for dramatisk at reducere filstørrelsen. Perfekt til fotos, webbilleder og enhver grafik, hvor mindre størrelse betyder mere end transparens.',
    'Muunna PNG-kuvat JPG:ksi pienentääksesi tiedostokokoa dramaattisesti. Täydellinen valokuville, verkkokuville ja kaikenlaisille grafiikoille, joissa pieni koko on tärkeämpää kuin läpinäkyvyys.',
    'Převeďte obrázky PNG na JPG pro dramatické zmenšení velikosti souboru. Perfektní pro fotografie, webové obrázky a jakékoli grafické prvky, kde záleží spíše na menší velikosti než na průhlednosti.',
    'Convertiți imagini PNG în JPG pentru a reduce drastic dimensiunea fișierului. Perfect pentru fotografii, imagini web și orice grafică unde dimensiunea contează mai mult decât transparența.',
    'Konvertálja a PNG képeket JPG-vé a fájlméret drasztikus csökkentéséhez. Tökéletes fényképekhez, webes képekhez és bármilyen grafikához, ahol a kisebb méret fontosabb az átlátszóságnál.',
    'Μετατρέψτε εικόνες PNG σε JPG για δραματική μείωση του μεγέθους αρχείου. Τέλειο για φωτογραφίες, εικόνες web και κάθε γραφικό όπου το μικρότερο μέγεθος είναι πιο σημαντικό από τη διαφάνεια.',
    'Dosya boyutunu önemli ölçüde azaltmak için PNG görüntülerini JPG\'ye dönüştürün. Şeffaflıktan ziyade küçük boyutun önemli olduğu fotoğraflar, web görüntüleri ve her türlü grafik için mükemmeldir.'],

  ['webp-to-png',
    'Konverter moderne WebP-billeder til det bredt understøttede PNG-format. Nyttigt til redigering i software, der ikke understøtter WebP nativt endnu.',
    'Muunna modernit WebP-kuvat laajalti tuettuun PNG-muotoon. Hyödyllistä muokkaamiseen ohjelmistoissa, jotka eivät vielä tue WebP:tä natiivisti.',
    'Převeďte moderní obrázky WebP do široce podporovaného formátu PNG. Užitečné pro úpravu v softwaru, který zatím nepodporuje WebP nativně.',
    'Convertiți imagini WebP moderne în formatul PNG larg suportat. Util pentru editare în software-uri care nu suportă încă WebP nativ.',
    'Konvertálja a modern WebP képeket a széles körben támogatott PNG formátumba. Hasznos olyan szoftverekben való szerkesztéshez, amelyek még nem támogatják natívan a WebP-t.',
    'Μετατρέψτε σύγχρονες εικόνες WebP στο ευρέως υποστηριζόμενο φορμά PNG. Χρήσιμο για επεξεργασία σε λογισμικό που δεν υποστηρίζει ακόμα WebP εγγενώς.',
    'Modern WebP görüntülerini geniş çapta desteklenen PNG formatına dönüştürün. WebP\'yi henüz yerel olarak desteklemeyen yazılımlarda düzenleme için kullanışlıdır.'],

  ['webp-to-jpg',
    'Konverter WebP-billeder til JPG for maksimal kompatibilitet med ældre systemer og software. Fantastisk til at dele fotos, alle kan åbne.',
    'Muunna WebP-kuvat JPG:ksi maksimaalisen yhteensopivuuden saamiseksi vanhojen järjestelmien ja ohjelmistojen kanssa. Erinomainen valokuvien jakamiseen, jotka kaikki voivat avata.',
    'Převeďte obrázky WebP na JPG pro maximální kompatibilitu se staršími systémy a softwarem. Skvělé pro sdílení fotografií, které může otevřít každý.',
    'Convertiți imagini WebP în JPG pentru compatibilitate maximă cu sisteme și software-uri mai vechi. Excelent pentru a partaja fotografii pe care oricine le poate deschide.',
    'Konvertálja a WebP képeket JPG-vé a régi rendszerekkel és szoftverekkel való maximális kompatibilitás érdekében. Kiváló olyan fényképek megosztásához, amelyeket bárki megnyithat.',
    'Μετατρέψτε εικόνες WebP σε JPG για μέγιστη συμβατότητα με παλιά συστήματα και λογισμικό. Εξαιρετικό για κοινοποίηση φωτογραφιών που μπορεί να ανοίξει ο καθένας.',
    'Eski sistemlerle ve yazılımlarla maksimum uyumluluk için WebP görüntülerini JPG\'ye dönüştürün. Herkesin açabileceği fotoğrafları paylaşmak için harikadır.'],

  ['heic-to-jpg',
    'Konverter iPhone HEIC-fotos til standard JPG-format. Løser kompatibilitetsproblemer ved deling af fotos med ikke-Apple-enheder eller -tjenester.',
    'Muunna iPhonen HEIC-valokuvat tavalliseen JPG-muotoon. Ratkaisee yhteensopivuusongelmat jakaessa valokuvia ei-Apple-laitteille tai -palveluille.',
    'Převeďte fotky iPhone HEIC do standardního formátu JPG. Řeší problémy s kompatibilitou při sdílení fotografií se zařízeními nebo službami mimo Apple.',
    'Convertiți fotografii iPhone HEIC în formatul JPG standard. Rezolvă problemele de compatibilitate la partajarea fotografiilor cu dispozitive sau servicii non-Apple.',
    'Konvertálja az iPhone HEIC fényképeket a szabványos JPG formátumba. Megoldja a kompatibilitási problémákat, amikor fényképeket oszt meg nem Apple eszközökkel vagy szolgáltatásokkal.',
    'Μετατρέψτε φωτογραφίες HEIC iPhone σε τυπική μορφή JPG. Επιλύει προβλήματα συμβατότητας κατά την κοινοποίηση φωτογραφιών σε συσκευές ή υπηρεσίες εκτός Apple.',
    'iPhone HEIC fotoğraflarını standart JPG formatına dönüştürün. Apple olmayan cihazlar veya hizmetlerle fotoğraf paylaşırken uyumluluk sorunlarını çözer.'],

  ['heic-to-png',
    'Konverter iPhone HEIC-billeder til PNG med fuld kvalitetsbevarelse. Perfekt til redigering eller udskrivning uden tab af detaljer.',
    'Muunna iPhonen HEIC-kuvat PNG:ksi täydellä laadunsäilytyksellä. Täydellinen muokkaukseen tai tulostamiseen ilman yksityiskohtien menetystä.',
    'Převeďte obrázky iPhone HEIC na PNG s plným zachováním kvality. Perfektní pro úpravu nebo tisk bez ztráty detailů.',
    'Convertiți imagini iPhone HEIC în PNG cu păstrarea completă a calității. Perfect pentru editare sau imprimare fără pierderea detaliilor.',
    'Konvertálja az iPhone HEIC képeket PNG-vé a teljes minőség megőrzésével. Tökéletes szerkesztéshez vagy nyomtatáshoz a részletek elvesztése nélkül.',
    'Μετατρέψτε εικόνες iPhone HEIC σε PNG με πλήρη διατήρηση ποιότητας. Τέλειο για επεξεργασία ή εκτύπωση χωρίς απώλεια λεπτομερειών.',
    'iPhone HEIC görüntülerini tam kalite koruması ile PNG\'ye dönüştürün. Detay kaybı olmadan düzenleme veya yazdırma için mükemmeldir.'],

  ['svg-to-png',
    'Render skalerbare SVG-vektorgrafikker som PNG-rasterbilleder. Ideelt til at bruge vektordesigns i apps, der kun understøtter pixelbaserede formater.',
    'Renderöi skaalattavia SVG-vektorigrafiikoita PNG-rasterikuviksi. Ihanteellinen vektorimuotoilujen käyttämiseen sovelluksissa, jotka tukevat vain pikselipohjaisia muotoja.',
    'Vykreslete škálovatelné vektorové grafiky SVG jako rastrové obrázky PNG. Ideální pro použití vektorových návrhů v aplikacích, které podporují pouze pixelové formáty.',
    'Randați grafică vectorială SVG scalabilă ca imagini raster PNG. Ideal pentru folosirea designurilor vectoriale în aplicații care suportă doar formate bazate pe pixeli.',
    'Renderelje a méretezhető SVG vektorgrafikákat PNG raszterképekként. Ideális vektoros tervek használatához olyan alkalmazásokban, amelyek csak pixelalapú formátumokat támogatnak.',
    'Αποτυπώστε κλιμακούμενα διανυσματικά γραφικά SVG ως εικόνες raster PNG. Ιδανικό για χρήση διανυσματικών σχεδίων σε εφαρμογές που υποστηρίζουν μόνο μορφές βασισμένες σε pixel.',
    'Ölçeklenebilir SVG vektör grafiklerini PNG raster görüntüleri olarak işleyin. Yalnızca piksel tabanlı formatları destekleyen uygulamalarda vektör tasarımları kullanmak için idealdir.'],

  ['svg-to-jpg',
    'Konverter SVG-vektorer til JPG til brug på enhver platform. Fantastisk til at dele logoer, ikoner eller illustrationer som standardbilleder.',
    'Muunna SVG-vektorit JPG:ksi käytettäväksi millä tahansa alustalla. Erinomainen logojen, kuvakkeiden tai kuvitusten jakamiseen vakiokuvina.',
    'Převeďte vektory SVG na JPG pro použití na jakékoli platformě. Skvělé pro sdílení log, ikon nebo ilustrací jako standardních obrázků.',
    'Convertiți vectori SVG în JPG pentru utilizare pe orice platformă. Excelent pentru partajarea logo-urilor, pictogramelor sau ilustrațiilor ca imagini standard.',
    'Konvertálja az SVG vektorokat JPG-vé bármilyen platformon való használatra. Kiváló logók, ikonok vagy illusztrációk megosztásához szabványos képekként.',
    'Μετατρέψτε διανύσματα SVG σε JPG για χρήση σε οποιαδήποτε πλατφόρμα. Εξαιρετικό για κοινοποίηση λογότυπων, εικονιδίων ή εικονογραφήσεων ως τυπικών εικόνων.',
    'Herhangi bir platformda kullanmak için SVG vektörlerini JPG\'ye dönüştürün. Logoları, simgeleri veya çizimleri standart görüntüler olarak paylaşmak için harikadır.'],

  ['bmp-to-png',
    'Konverter ældre BMP-filer til kompakt, moderne PNG-format. Reducerer drastisk filstørrelsen, mens hele billedkvaliteten bevares.',
    'Muunna vanhat BMP-tiedostot kompaktiin, moderniin PNG-muotoon. Pienentää tiedostokokoa dramaattisesti säilyttäen samalla täyden kuvanlaadun.',
    'Převeďte starší soubory BMP do kompaktního, moderního formátu PNG. Drasticky snižuje velikost souboru při zachování plné kvality obrazu.',
    'Convertiți fișiere BMP vechi în formatul PNG compact și modern. Reduce drastic dimensiunea fișierului păstrând în același timp calitatea completă a imaginii.',
    'Konvertálja a régi BMP fájlokat kompakt, modern PNG formátumba. Drasztikusan csökkenti a fájlméretet a teljes képminőség megőrzése mellett.',
    'Μετατρέψτε παλιά αρχεία BMP στο συμπαγές, σύγχρονο φορμά PNG. Μειώνει δραστικά το μέγεθος αρχείου διατηρώντας την πλήρη ποιότητα εικόνας.',
    'Eski BMP dosyalarını kompakt, modern PNG formatına dönüştürün. Tam görüntü kalitesini korurken dosya boyutunu önemli ölçüde azaltır.'],

  ['tiff-to-jpg',
    'Konverter højopløselige TIFF-filer til komprimeret JPG. Perfekt til at dele scannede dokumenter eller professionelle fotos i en mindre, web-venlig størrelse.',
    'Muunna korkearesoluutioiset TIFF-tiedostot pakatuksi JPG:ksi. Täydellinen skannattujen asiakirjojen tai ammattikuvien jakamiseen pienemmässä, verkkoystävällisessä koossa.',
    'Převeďte soubory TIFF s vysokým rozlišením na komprimovaný JPG. Perfektní pro sdílení naskenovaných dokumentů nebo profesionálních fotografií v menší, webově přívětivé velikosti.',
    'Convertiți fișiere TIFF de înaltă rezoluție în JPG comprimat. Perfect pentru partajarea documentelor scanate sau a fotografiilor profesionale într-o dimensiune mai mică, prietenoasă cu web-ul.',
    'Konvertálja a nagy felbontású TIFF fájlokat tömörített JPG-vé. Tökéletes szkennelt dokumentumok vagy professzionális fényképek megosztásához kisebb, web-barát méretben.',
    'Μετατρέψτε αρχεία TIFF υψηλής ανάλυσης σε συμπιεσμένο JPG. Τέλειο για κοινοποίηση σαρωμένων εγγράφων ή επαγγελματικών φωτογραφιών σε μικρότερο, web-friendly μέγεθος.',
    'Yüksek çözünürlüklü TIFF dosyalarını sıkıştırılmış JPG\'ye dönüştürün. Taranmış belgeleri veya profesyonel fotoğrafları daha küçük, web dostu bir boyutta paylaşmak için mükemmeldir.'],

  ['gif-to-png',
    'Konverter GIF-billeder til PNG med bedre farvedybde og transparens. Bedst til statiske billeder udtrukket fra animerede GIF\'er.',
    'Muunna GIF-kuvat PNG:ksi paremmalla värisyvyydellä ja läpinäkyvyydellä. Paras staattisille kuville, jotka on poimittu animoiduista GIF-kuvista.',
    'Převeďte obrázky GIF na PNG s lepší barevnou hloubkou a průhledností. Nejlepší pro statické obrázky extrahované z animovaných GIF.',
    'Convertiți imagini GIF în PNG cu profunzime de culoare și transparență mai bună. Cel mai bun pentru imagini statice extrase din GIF-uri animate.',
    'Konvertálja a GIF képeket PNG-vé jobb színmélységgel és átlátszósággal. A legjobb az animált GIF-ekből kinyert statikus képekhez.',
    'Μετατρέψτε εικόνες GIF σε PNG με καλύτερο βάθος χρώματος και διαφάνεια. Καλύτερο για στατικές εικόνες που εξάγονται από κινούμενα GIF.',
    'GIF görüntülerini daha iyi renk derinliği ve şeffaflıkla PNG\'ye dönüştürün. Animasyonlu GIF\'lerden çıkarılan statik görüntüler için en iyisidir.'],

  ['png-to-ico',
    'Generer Windows-kompatible ICO-favicon- og app-ikonfiler fra PNG-billeder. Inkluderer flere opløsninger i en enkelt ikonfil.',
    'Luo Windows-yhteensopivat ICO-favicon- ja sovelluskuvaketiedostot PNG-kuvista. Sisältää useita resoluutioita yhdessä kuvaketiedostossa.',
    'Generujte ze souborů PNG ikony favicon a aplikační ikony ICO kompatibilní s Windows. Zahrnuje více rozlišení v jednom souboru ikony.',
    'Generați fișiere ICO pentru favicon și pictograme de aplicație compatibile cu Windows din imagini PNG. Include mai multe rezoluții într-un singur fișier de pictogramă.',
    'Generáljon Windows-kompatibilis ICO favicon és alkalmazásikon fájlokat PNG képekből. Több felbontást tartalmaz egyetlen ikonfájlban.',
    'Δημιουργήστε αρχεία ICO favicon και εικονιδίων εφαρμογών συμβατά με Windows από εικόνες PNG. Περιλαμβάνει πολλαπλές αναλύσεις σε ένα μόνο αρχείο εικονιδίου.',
    'PNG görüntülerinden Windows uyumlu ICO favicon ve uygulama simgesi dosyaları oluşturun. Tek bir simge dosyasında birden çok çözünürlük içerir.'],

  // ── Video ──
  ['mp4-to-avi',
    'Konverter MP4-videoer til AVI for kompatibilitet med ældre medieafspillere og redigeringssoftware. Bevarer video- og lydkvalitet under konverteringen.',
    'Muunna MP4-videot AVI:ksi yhteensopivuuden saamiseksi vanhempien mediasoittimien ja editointiohjelmistojen kanssa. Säilyttää video- ja äänenlaadun konversion aikana.',
    'Převeďte videa MP4 na AVI pro kompatibilitu se staršími přehrávači médií a editačním softwarem. Zachovává kvalitu videa a zvuku během konverze.',
    'Convertiți videoclipuri MP4 în AVI pentru compatibilitate cu playere media și software de editare mai vechi. Păstrează calitatea video și audio în timpul conversiei.',
    'Konvertálja az MP4 videókat AVI-vá a régebbi médialejátszókkal és szerkesztőszoftverekkel való kompatibilitás érdekében. Megőrzi a videó- és hangminőséget a konverzió során.',
    'Μετατρέψτε βίντεο MP4 σε AVI για συμβατότητα με παλαιότερους players μέσων και λογισμικό επεξεργασίας. Διατηρεί την ποιότητα βίντεο και ήχου κατά τη μετατροπή.',
    'Eski medya oynatıcıları ve düzenleme yazılımlarıyla uyumluluk için MP4 videolarını AVI\'ye dönüştürün. Dönüştürme sırasında video ve ses kalitesini korur.'],

  ['mp4-to-mov',
    'Konverter MP4 til QuickTime MOV-format til redigering i Apple Final Cut Pro, iMovie eller andre Mac-baserede videoværktøjer.',
    'Muunna MP4 QuickTime MOV -muotoon muokattavaksi Apple Final Cut Prossa, iMoviessa tai muissa Mac-pohjaisissa videotyökaluissa.',
    'Převeďte MP4 do formátu QuickTime MOV pro úpravu v Apple Final Cut Pro, iMovie nebo jiných nástrojích pro video na Macu.',
    'Convertiți MP4 în formatul QuickTime MOV pentru editare în Apple Final Cut Pro, iMovie sau alte instrumente video pentru Mac.',
    'Konvertálja az MP4-et QuickTime MOV formátumba az Apple Final Cut Pro, iMovie vagy más Mac-alapú videoeszközökben történő szerkesztéshez.',
    'Μετατρέψτε MP4 σε φορμά QuickTime MOV για επεξεργασία σε Apple Final Cut Pro, iMovie ή άλλα εργαλεία βίντεο για Mac.',
    'Apple Final Cut Pro, iMovie veya diğer Mac tabanlı video araçlarında düzenleme için MP4\'ü QuickTime MOV formatına dönüştürün.'],

  ['mov-to-mp4',
    'Konverter MOV-filer til MP4 for universel afspilning på telefoner, browsere og streamingplatforme. Reducerer filstørrelsen uden at gå på kompromis med kvaliteten.',
    'Muunna MOV-tiedostot MP4:ksi yleistä toistoa varten puhelimissa, selaimissa ja suoratoistoalustoilla. Pienentää tiedostokokoa laadun kärsimättä.',
    'Převeďte soubory MOV na MP4 pro univerzální přehrávání na telefonech, prohlížečích a streamovacích platformách. Snižuje velikost souboru bez ohrožení kvality.',
    'Convertiți fișiere MOV în MP4 pentru redare universală pe telefoane, browsere și platforme de streaming. Reduce dimensiunea fișierului fără a sacrifica calitatea.',
    'Konvertálja a MOV fájlokat MP4-re az univerzális lejátszáshoz telefonokon, böngészőkben és streaming platformokon. Csökkenti a fájlméretet a minőség feláldozása nélkül.',
    'Μετατρέψτε αρχεία MOV σε MP4 για καθολική αναπαραγωγή σε τηλέφωνα, browsers και πλατφόρμες streaming. Μειώνει το μέγεθος αρχείου χωρίς να θυσιάζεται η ποιότητα.',
    'Telefonlar, tarayıcılar ve yayın platformlarında evrensel oynatma için MOV dosyalarını MP4\'e dönüştürün. Kaliteyi feda etmeden dosya boyutunu küçültür.'],

  ['mkv-to-mp4',
    'Konverter Matroska MKV-filer til MP4 til brug på smartphones, streamingenheder og redigeringssoftware, der ikke understøtter MKV nativt.',
    'Muunna Matroska MKV -tiedostot MP4:ksi käytettäväksi älypuhelimissa, suoratoistolaitteissa ja editointiohjelmistoissa, jotka eivät tue MKV:tä natiivisti.',
    'Převeďte soubory Matroska MKV na MP4 pro použití ve smartphonech, streamovacích zařízeních a editačním softwaru, který nativně nepodporuje MKV.',
    'Convertiți fișiere Matroska MKV în MP4 pentru utilizare pe smartphone-uri, dispozitive de streaming și software de editare care nu suportă MKV nativ.',
    'Konvertálja a Matroska MKV fájlokat MP4-re az okostelefonokon, streaming eszközökön és olyan szerkesztőszoftvereken való használathoz, amelyek nem támogatják natívan az MKV-t.',
    'Μετατρέψτε αρχεία Matroska MKV σε MP4 για χρήση σε smartphones, συσκευές streaming και λογισμικό επεξεργασίας που δεν υποστηρίζει MKV εγγενώς.',
    'Akıllı telefonlarda, akış cihazlarında ve MKV\'yi yerel olarak desteklemeyen düzenleme yazılımlarında kullanmak için Matroska MKV dosyalarını MP4\'e dönüştürün.'],

  ['webm-to-mp4',
    'Konverter WebM-videoer til MP4 for bredere enhedssupport inklusive iOS, ældre Android og de fleste desktop videoredigerere.',
    'Muunna WebM-videot MP4:ksi laajempaa laitetukea varten mukaan lukien iOS, vanhempi Android ja useimmat työpöydän videoeditoinnit.',
    'Převeďte videa WebM na MP4 pro širší podporu zařízení včetně iOS, staršího Androidu a většiny desktopových video editorů.',
    'Convertiți videoclipuri WebM în MP4 pentru suport mai larg al dispozitivelor, inclusiv iOS, Android mai vechi și majoritatea editorilor video desktop.',
    'Konvertálja a WebM videókat MP4-re a szélesebb körű eszköztámogatásért, beleértve az iOS-t, a régebbi Androidot és a legtöbb asztali videoszerkesztőt.',
    'Μετατρέψτε βίντεο WebM σε MP4 για ευρύτερη υποστήριξη συσκευών συμπεριλαμβανομένων iOS, παλαιότερου Android και των περισσότερων desktop video editors.',
    'iOS, eski Android ve çoğu masaüstü video düzenleyicisi dahil daha geniş cihaz desteği için WebM videolarını MP4\'e dönüştürün.'],

  ['avi-to-mp4',
    'Konverter ældre AVI-videoer til moderne MP4-format. Mindre filstørrelser, bedre komprimering og fuld kompatibilitet med mobile enheder.',
    'Muunna vanhat AVI-videot moderniin MP4-muotoon. Pienemmät tiedostokoot, parempi pakkaus ja täysi yhteensopivuus mobiililaitteiden kanssa.',
    'Převeďte starší videa AVI do moderního formátu MP4. Menší velikost souborů, lepší komprese a plná kompatibilita s mobilními zařízeními.',
    'Convertiți videoclipuri AVI vechi în formatul MP4 modern. Dimensiuni mai mici de fișier, compresie mai bună și compatibilitate completă cu dispozitivele mobile.',
    'Konvertálja a régi AVI videókat modern MP4 formátumba. Kisebb fájlméret, jobb tömörítés és teljes kompatibilitás a mobil eszközökkel.',
    'Μετατρέψτε παλιά βίντεο AVI στο σύγχρονο φορμά MP4. Μικρότερο μέγεθος αρχείων, καλύτερη συμπίεση και πλήρης συμβατότητα με κινητές συσκευές.',
    'Eski AVI videolarını modern MP4 formatına dönüştürün. Daha küçük dosya boyutları, daha iyi sıkıştırma ve mobil cihazlarla tam uyumluluk.'],

  ['flv-to-mp4',
    'Konverter gamle Flash FLV-videoer til MP4. Fremtidssikrer arkiveret videoindhold nu hvor Flash er forældet overalt.',
    'Muunna vanhat Flash FLV -videot MP4:ksi. Tulevaisuusvarmistaa arkistoidun videosisällön nyt, kun Flash on poistettu käytöstä kaikkialla.',
    'Převeďte staré Flash FLV videa na MP4. Zajišťuje budoucí použitelnost archivovaného video obsahu nyní, když je Flash všude zastaralý.',
    'Convertiți videoclipuri Flash FLV vechi în MP4. Protejează pentru viitor conținutul video arhivat acum că Flash este depreciat peste tot.',
    'Konvertálja a régi Flash FLV videókat MP4-re. Jövőbiztosítja az archivált videótartalmat most, hogy a Flash mindenhol elavult.',
    'Μετατρέψτε παλιά βίντεο Flash FLV σε MP4. Διασφαλίζει το μέλλον του αρχειοθετημένου video content τώρα που το Flash έχει καταργηθεί παντού.',
    'Eski Flash FLV videolarını MP4\'e dönüştürün. Flash her yerde kullanımdan kaldırıldığı için arşivlenmiş video içeriğini geleceğe hazırlar.'],

  ['wmv-to-mp4',
    'Konverter Windows Media WMV-filer til universelt understøttet MP4. Perfekt til at dele gamle præsentationer eller optagelser på Mac, iOS og Android.',
    'Muunna Windows Media WMV -tiedostot yleisesti tuettuun MP4-muotoon. Täydellinen vanhojen esitysten tai tallenteiden jakamiseen Macilla, iOS:llä ja Androidilla.',
    'Převeďte soubory Windows Media WMV do univerzálně podporovaného MP4. Perfektní pro sdílení starých prezentací nebo nahrávek na Macu, iOS a Androidu.',
    'Convertiți fișiere Windows Media WMV în MP4-ul universal suportat. Perfect pentru partajarea prezentărilor sau înregistrărilor vechi pe Mac, iOS și Android.',
    'Konvertálja a Windows Media WMV fájlokat az univerzálisan támogatott MP4-re. Tökéletes régi prezentációk vagy felvételek megosztásához Mac, iOS és Android rendszereken.',
    'Μετατρέψτε αρχεία Windows Media WMV σε MP4 με καθολική υποστήριξη. Τέλειο για κοινοποίηση παλιών παρουσιάσεων ή εγγραφών σε Mac, iOS και Android.',
    'Windows Media WMV dosyalarını evrensel olarak desteklenen MP4\'e dönüştürün. Mac, iOS ve Android\'de eski sunumları veya kayıtları paylaşmak için mükemmeldir.'],

  ['mp4-to-mp3',
    'Udtræk lydsporet fra MP4-videofiler som MP3. Fantastisk til at rippe musik, podcasts eller lydoptagelser fra videokilder.',
    'Pura ääniraita MP4-videotiedostoista MP3:na. Erinomainen musiikin, podcastien tai äänitallenteiden poimimiseen videolähteistä.',
    'Extrahujte zvukovou stopu ze souborů MP4 video jako MP3. Skvělé pro extrakci hudby, podcastů nebo zvukových nahrávek z video zdrojů.',
    'Extrageți pista audio din fișiere video MP4 ca MP3. Excelent pentru extragerea muzicii, podcasturilor sau înregistrărilor audio din surse video.',
    'Vonjon ki hangsávot MP4 videofájlokból MP3-ként. Kiváló zenék, podcastok vagy hangfelvételek kinyeréséhez videoforrásokból.',
    'Εξαγάγετε το ηχητικό κομμάτι από αρχεία βίντεο MP4 ως MP3. Εξαιρετικό για ripping μουσικής, podcasts ή εγγραφών ήχου από πηγές βίντεο.',
    'MP4 video dosyalarından ses parçasını MP3 olarak çıkarın. Müzik, podcast veya video kaynaklarından ses kayıtlarını ayıklamak için harikadır.'],

  // ── Audio ──
  ['mp3-to-wav',
    'Konverter komprimerede MP3-filer til tabsfri WAV-format til lydredigering eller professionel produktion. Højest mulige kvalitetsbevarelse.',
    'Muunna pakatut MP3-tiedostot häviöttömään WAV-muotoon äänieditointia tai ammattituotantoa varten. Korkein mahdollinen laadunsäilytys.',
    'Převeďte komprimované soubory MP3 do bezztrátového formátu WAV pro úpravu zvuku nebo profesionální produkci. Nejvyšší možné zachování kvality.',
    'Convertiți fișiere MP3 comprimate în formatul WAV fără pierderi pentru editare audio sau producție profesională. Cea mai mare conservare posibilă a calității.',
    'Konvertálja a tömörített MP3 fájlokat veszteségmentes WAV formátumba hangszerkesztéshez vagy professzionális gyártáshoz. A lehető legmagasabb minőségmegőrzés.',
    'Μετατρέψτε συμπιεσμένα αρχεία MP3 στο φορμά WAV χωρίς απώλειες για επεξεργασία ήχου ή επαγγελματική παραγωγή. Υψηλότερη δυνατή διατήρηση ποιότητας.',
    'Ses düzenleme veya profesyonel üretim için sıkıştırılmış MP3 dosyalarını kayıpsız WAV formatına dönüştürün. Mümkün olan en yüksek kalite koruması.'],

  ['wav-to-mp3',
    'Konverter tabsfri WAV-filer til kompakt MP3 til lagring, streaming eller deling. Tilpasselige kvalitetsindstillinger til at balancere størrelse og klarhed.',
    'Muunna häviöttömät WAV-tiedostot kompaktiksi MP3:ksi tallennusta, suoratoistoa tai jakamista varten. Mukautettavat laatuasetukset koon ja selkeyden tasapainottamiseksi.',
    'Převeďte bezztrátové soubory WAV na kompaktní MP3 pro ukládání, streamování nebo sdílení. Přizpůsobitelná nastavení kvality pro vyvážení velikosti a srozumitelnosti.',
    'Convertiți fișiere WAV fără pierderi în MP3 compact pentru stocare, streaming sau partajare. Setări de calitate personalizabile pentru a echilibra dimensiunea și claritatea.',
    'Konvertálja a veszteségmentes WAV fájlokat kompakt MP3-vé tároláshoz, streaminghez vagy megosztáshoz. Testreszabható minőségbeállítások a méret és tisztaság egyensúlyához.',
    'Μετατρέψτε αρχεία WAV χωρίς απώλειες σε συμπαγή MP3 για αποθήκευση, streaming ή κοινοποίηση. Προσαρμόσιμες ρυθμίσεις ποιότητας για ισορροπία μεγέθους και διαύγειας.',
    'Depolama, akış veya paylaşım için kayıpsız WAV dosyalarını kompakt MP3\'e dönüştürün. Boyut ve netliği dengelemek için özelleştirilebilir kalite ayarları.'],

  ['flac-to-mp3',
    'Konverter tabsfri FLAC-lyd til MP3 til brug i biler, telefoner og enheder, der ikke understøtter FLAC. Bevarer fremragende lydkvalitet ved meget mindre filstørrelser.',
    'Muunna häviötön FLAC-ääni MP3:ksi käytettäväksi autoissa, puhelimissa ja laitteissa, jotka eivät tue FLAC:ia. Säilyttää erinomaisen äänenlaadun paljon pienemmillä tiedostokokoilla.',
    'Převeďte bezztrátový FLAC zvuk na MP3 pro použití v autech, telefonech a zařízeních, která nepodporují FLAC. Udržuje vynikající kvalitu zvuku při mnohem menších velikostech souborů.',
    'Convertiți audio FLAC fără pierderi în MP3 pentru utilizare în mașini, telefoane și dispozitive care nu suportă FLAC. Menține o calitate audio excelentă la dimensiuni de fișier mult mai mici.',
    'Konvertálja a veszteségmentes FLAC hangot MP3-má autókban, telefonokon és FLAC-ot nem támogató eszközökön való használathoz. Kiváló hangminőséget tart fenn sokkal kisebb fájlméretekkel.',
    'Μετατρέψτε ήχο FLAC χωρίς απώλειες σε MP3 για χρήση σε αυτοκίνητα, τηλέφωνα και συσκευές που δεν υποστηρίζουν FLAC. Διατηρεί εξαιρετική ποιότητα ήχου σε πολύ μικρότερα μεγέθη αρχείων.',
    'FLAC\'i desteklemeyen arabalarda, telefonlarda ve cihazlarda kullanmak için kayıpsız FLAC sesini MP3\'e dönüştürün. Çok daha küçük dosya boyutlarında mükemmel ses kalitesi sağlar.'],

  ['aac-to-mp3',
    'Konverter AAC-lydfiler til bredt kompatibelt MP3-format. Ideelt til at bruge AAC-indhold i ældre afspillere, software eller hardware.',
    'Muunna AAC-äänitiedostot laajasti yhteensopivaan MP3-muotoon. Ihanteellinen AAC-sisällön käyttöön vanhemmissa soittimissa, ohjelmistoissa tai laitteistoissa.',
    'Převeďte zvukové soubory AAC do široce kompatibilního formátu MP3. Ideální pro použití obsahu AAC ve starších přehrávačích, softwaru nebo hardwaru.',
    'Convertiți fișiere audio AAC în formatul MP3 larg compatibil. Ideal pentru utilizarea conținutului AAC în playere, software sau hardware mai vechi.',
    'Konvertálja az AAC hangfájlokat széles körben kompatibilis MP3 formátumba. Ideális AAC tartalom használatához régebbi lejátszókban, szoftverekben vagy hardverekben.',
    'Μετατρέψτε αρχεία ήχου AAC σε ευρέως συμβατό φορμά MP3. Ιδανικό για χρήση περιεχομένου AAC σε παλαιότερους players, λογισμικό ή hardware.',
    'AAC ses dosyalarını geniş çapta uyumlu MP3 formatına dönüştürün. Eski oynatıcılar, yazılım veya donanımlarda AAC içeriği kullanmak için idealdir.'],

  ['ogg-to-mp3',
    'Konverter OGG Vorbis-lyd til MP3 for kompatibilitet med almindelige musikafspillere og enheder, der mangler nativ OGG-support.',
    'Muunna OGG Vorbis -ääni MP3:ksi yhteensopivuuden saamiseksi valtavirtaisten musiikkisoittimien ja OGG-natiivituen puuttuvien laitteiden kanssa.',
    'Převeďte zvuk OGG Vorbis na MP3 pro kompatibilitu s mainstreamovými hudebními přehrávači a zařízeními, která postrádají nativní podporu OGG.',
    'Convertiți audio OGG Vorbis în MP3 pentru compatibilitate cu playere muzicale principale și dispozitive care nu au suport OGG nativ.',
    'Konvertálja az OGG Vorbis hangot MP3-vá a fő áramú zenelejátszókkal és olyan eszközökkel való kompatibilitás érdekében, amelyek nem rendelkeznek natív OGG-támogatással.',
    'Μετατρέψτε ήχο OGG Vorbis σε MP3 για συμβατότητα με δημοφιλείς music players και συσκευές που δεν διαθέτουν εγγενή υποστήριξη OGG.',
    'Yaygın müzik çalarları ve yerel OGG desteği olmayan cihazlarla uyumluluk için OGG Vorbis sesini MP3\'e dönüştürün.'],

  ['wma-to-mp3',
    'Konverter Windows Media Audio-filer til MP3 for afspilning på tværs af platforme. Fantastisk til at migrere gamle WMA-samlinger til moderne enheder.',
    'Muunna Windows Media Audio -tiedostot MP3:ksi alustojen väliseen toistoon. Erinomainen vanhojen WMA-kokoelmien siirtämiseen moderneihin laitteisiin.',
    'Převeďte zvukové soubory Windows Media Audio na MP3 pro přehrávání napříč platformami. Skvělé pro migraci starých sbírek WMA na moderní zařízení.',
    'Convertiți fișiere Windows Media Audio în MP3 pentru redare pe mai multe platforme. Excelent pentru migrarea colecțiilor vechi WMA pe dispozitive moderne.',
    'Konvertálja a Windows Media Audio fájlokat MP3-má a platformközi lejátszáshoz. Kiváló a régi WMA gyűjtemények modern eszközökre történő migrálásához.',
    'Μετατρέψτε αρχεία Windows Media Audio σε MP3 για αναπαραγωγή σε πολλαπλές πλατφόρμες. Εξαιρετικό για μετεγκατάσταση παλιών συλλογών WMA σε σύγχρονες συσκευές.',
    'Çapraz platform oynatma için Windows Media Audio dosyalarını MP3\'e dönüştürün. Eski WMA koleksiyonlarını modern cihazlara taşımak için harikadır.'],

  ['m4a-to-mp3',
    'Konverter iTunes-stil M4A-lyd til MP3 til brug på enhver enhed. Særligt nyttigt til at flytte musikbiblioteker væk fra Apple-platforme.',
    'Muunna iTunes-tyylinen M4A-ääni MP3:ksi käytettäväksi millä tahansa laitteella. Erityisen hyödyllinen musiikkikirjastojen siirtämiseen pois Apple-alustoilta.',
    'Převeďte zvuk M4A ve stylu iTunes na MP3 pro použití na jakémkoli zařízení. Zvláště užitečné pro přesun hudebních knihoven mimo platformy Apple.',
    'Convertiți audio M4A în stil iTunes în MP3 pentru utilizare pe orice dispozitiv. Deosebit de util pentru mutarea bibliotecilor muzicale de pe platformele Apple.',
    'Konvertálja az iTunes-stílusú M4A hangot MP3-má bármely eszközön való használathoz. Különösen hasznos a zenei könyvtárak Apple platformokról való áthelyezéséhez.',
    'Μετατρέψτε ήχο M4A τύπου iTunes σε MP3 για χρήση σε οποιαδήποτε συσκευή. Ιδιαίτερα χρήσιμο για μεταφορά βιβλιοθηκών μουσικής εκτός πλατφορμών Apple.',
    'Herhangi bir cihazda kullanmak için iTunes tarzı M4A sesini MP3\'e dönüştürün. Müzik kitaplıklarını Apple platformlarından taşımak için özellikle yararlıdır.'],

  ['mp3-to-aac',
    'Konverter MP3 til højere kvalitet AAC-format. AAC opnår bedre lyd ved samme bitrate, ideelt til streaming og moderne afspilning.',
    'Muunna MP3 korkealaatuiseen AAC-muotoon. AAC saavuttaa paremman äänen samalla bittinopeudella, ihanteellinen suoratoistoon ja moderniin toistoon.',
    'Převeďte MP3 do kvalitnějšího formátu AAC. AAC dosahuje lepšího zvuku při stejném datovém toku, ideální pro streamování a moderní přehrávání.',
    'Convertiți MP3 în formatul AAC de calitate superioară. AAC obține un sunet mai bun la același bitrate, ideal pentru streaming și redare modernă.',
    'Konvertálja az MP3-at a magasabb minőségű AAC formátumba. Az AAC jobb hangzást ér el ugyanazon bitrátán, ideális streaminghez és modern lejátszáshoz.',
    'Μετατρέψτε MP3 σε φορμά AAC υψηλότερης ποιότητας. Το AAC επιτυγχάνει καλύτερο ήχο στον ίδιο bitrate, ιδανικό για streaming και σύγχρονη αναπαραγωγή.',
    'MP3\'ü daha yüksek kaliteli AAC formatına dönüştürün. AAC, aynı bit hızında daha iyi ses elde eder; akış ve modern oynatma için idealdir.'],

  // ── Archive ──
  ['rar-to-zip',
    'Konverter RAR-arkiver til universelt understøttet ZIP-format. Ingen behov for speciel software — pak ud overalt, på ethvert operativsystem.',
    'Muunna RAR-arkistot yleisesti tuettuun ZIP-muotoon. Erikoisohjelmistoa ei tarvita — pura missä tahansa, millä tahansa käyttöjärjestelmällä.',
    'Převeďte archivy RAR do univerzálně podporovaného formátu ZIP. Není potřeba speciální software — extrahujte kdekoli, na jakémkoli operačním systému.',
    'Convertiți arhive RAR în formatul ZIP universal suportat. Fără software special — extrageți oriunde, pe orice sistem de operare.',
    'Konvertálja a RAR archívumokat az univerzálisan támogatott ZIP formátumba. Nincs szükség speciális szoftverre — bontsa ki bárhol, bármilyen operációs rendszeren.',
    'Μετατρέψτε αρχεία RAR στο καθολικά υποστηριζόμενο φορμά ZIP. Δεν χρειάζεται ειδικό λογισμικό — εξαγάγετε οπουδήποτε, σε οποιοδήποτε λειτουργικό σύστημα.',
    'RAR arşivlerini evrensel olarak desteklenen ZIP formatına dönüştürün. Özel yazılıma gerek yok — herhangi bir işletim sisteminde, her yerde çıkartın.'],

  ['7z-to-zip',
    'Konverter 7Z-arkiver til ZIP for kompatibilitet med indbyggede værktøjer på alle operativsystemer. Lettere deling uden krav om 7-Zip-software.',
    'Muunna 7Z-arkistot ZIP:ksi yhteensopivuuden saamiseksi sisäänrakennettujen työkalujen kanssa kaikissa käyttöjärjestelmissä. Helpompi jakaminen ilman 7-Zip-ohjelmistoa.',
    'Převeďte archivy 7Z na ZIP pro kompatibilitu s vestavěnými nástroji v každém operačním systému. Snadnější sdílení bez nutnosti softwaru 7-Zip.',
    'Convertiți arhive 7Z în ZIP pentru compatibilitate cu instrumentele integrate din fiecare sistem de operare. Partajare mai ușoară fără a necesita software 7-Zip.',
    'Konvertálja a 7Z archívumokat ZIP-be a beépített eszközökkel való kompatibilitásért minden operációs rendszeren. Könnyebb megosztás 7-Zip szoftver nélkül.',
    'Μετατρέψτε αρχεία 7Z σε ZIP για συμβατότητα με ενσωματωμένα εργαλεία σε κάθε λειτουργικό σύστημα. Ευκολότερη κοινοποίηση χωρίς να χρειάζεται λογισμικό 7-Zip.',
    'Her işletim sistemindeki yerleşik araçlarla uyumluluk için 7Z arşivlerini ZIP\'e dönüştürün. 7-Zip yazılımı gerektirmeden daha kolay paylaşım.'],

  ['tar-to-zip',
    'Konverter Linux TAR-arkiver til Windows-venligt ZIP-format. Perfekt til at dele udviklerfiler med ikke-tekniske brugere.',
    'Muunna Linuxin TAR-arkistot Windows-ystävälliseen ZIP-muotoon. Täydellinen kehittäjätiedostojen jakamiseen ei-teknisten käyttäjien kanssa.',
    'Převeďte linuxové archivy TAR do formátu ZIP přátelského k Windows. Perfektní pro sdílení vývojářských souborů s netechnickými uživateli.',
    'Convertiți arhive Linux TAR în formatul ZIP prietenos cu Windows. Perfect pentru partajarea fișierelor de dezvoltator cu utilizatori non-tehnici.',
    'Konvertálja a Linux TAR archívumokat Windows-barát ZIP formátumba. Tökéletes fejlesztői fájlok megosztásához nem-technikai felhasználókkal.',
    'Μετατρέψτε αρχεία Linux TAR στο φιλικό προς Windows φορμά ZIP. Τέλειο για κοινοποίηση αρχείων προγραμματιστή σε μη τεχνικούς χρήστες.',
    'Linux TAR arşivlerini Windows dostu ZIP formatına dönüştürün. Geliştirici dosyalarını teknik olmayan kullanıcılarla paylaşmak için mükemmeldir.'],

  ['gz-to-zip',
    'Konverter GZIP-filer til ZIP for nemmere udpakning uden kommandolinjeværktøjer. Fantastisk til at flytte filer fra Linux til Windows-brugere.',
    'Muunna GZIP-tiedostot ZIP:ksi helpompaa purkamista varten ilman komentorivityökaluja. Erinomainen tiedostojen siirtämiseen Linuxista Windows-käyttäjille.',
    'Převeďte soubory GZIP na ZIP pro snadnější extrakci bez nástrojů příkazové řádky. Skvělé pro přesun souborů z Linuxu pro uživatele Windows.',
    'Convertiți fișiere GZIP în ZIP pentru extragere mai ușoară fără instrumente de linie de comandă. Excelent pentru mutarea fișierelor de la Linux la utilizatorii Windows.',
    'Konvertálja a GZIP fájlokat ZIP-pé az egyszerűbb kibontáshoz parancssori eszközök nélkül. Kiváló fájlok Linuxról Windows-felhasználókhoz történő áthelyezéséhez.',
    'Μετατρέψτε αρχεία GZIP σε ZIP για ευκολότερη εξαγωγή χωρίς εργαλεία γραμμής εντολών. Εξαιρετικό για μετακίνηση αρχείων από Linux σε χρήστες Windows.',
    'Komut satırı araçları olmadan daha kolay çıkartma için GZIP dosyalarını ZIP\'e dönüştürün. Linux\'tan Windows kullanıcılarına dosya taşımak için harikadır.'],

  ['zip-to-7z',
    'Konverter ZIP-filer til 7Z for stærkere komprimering og mindre filstørrelser. Ideelt til arkivering af store mapper eller besparelse af cloud-lagerplads.',
    'Muunna ZIP-tiedostot 7Z:ksi vahvempaa pakkausta ja pienempiä tiedostokokoja varten. Ihanteellinen suurten kansioiden arkistointiin tai pilvitallennustilan säästämiseen.',
    'Převeďte soubory ZIP na 7Z pro silnější kompresi a menší velikost souborů. Ideální pro archivaci velkých složek nebo úsporu cloudového úložiště.',
    'Convertiți fișiere ZIP în 7Z pentru compresie mai puternică și dimensiuni mai mici de fișier. Ideal pentru arhivarea folderelor mari sau economisirea spațiului cloud.',
    'Konvertálja a ZIP fájlokat 7Z-vé erősebb tömörítéshez és kisebb fájlmérethez. Ideális nagy mappák archiválásához vagy felhőtárhely megtakarításához.',
    'Μετατρέψτε αρχεία ZIP σε 7Z για ισχυρότερη συμπίεση και μικρότερα μεγέθη αρχείων. Ιδανικό για αρχειοθέτηση μεγάλων φακέλων ή εξοικονόμηση cloud αποθήκευσης.',
    'Daha güçlü sıkıştırma ve daha küçük dosya boyutları için ZIP dosyalarını 7Z\'ye dönüştürün. Büyük klasörleri arşivlemek veya bulut depolama alanından tasarruf etmek için idealdir.'],

  // ── PDF Tools ──
  ['merge-pdf',
    'Kombiner flere PDF-dokumenter til en enkelt fil. Omarranger sider med drag-and-drop, uden begrænsning på, hvor mange dokumenter du kan flette ad gangen.',
    'Yhdistä useita PDF-asiakirjoja yhdeksi tiedostoksi. Järjestä sivut uudelleen vetämällä ja pudottamalla, ilman rajoitusta yhdistettävien asiakirjojen määrälle.',
    'Spojte více dokumentů PDF do jednoho souboru. Změňte pořadí stránek pomocí drag-and-drop, bez omezení počtu spojovaných dokumentů.',
    'Combinați mai multe documente PDF într-un singur fișier. Reordonați paginile prin drag-and-drop, fără limită pentru numărul de documente pe care le puteți combina.',
    'Egyesítsen több PDF dokumentumot egyetlen fájlba. Rendezze át az oldalakat húzással-ejtéssel, korlátlan számú dokumentum egyesíthető egyszerre.',
    'Συνδυάστε πολλαπλά έγγραφα PDF σε ένα μόνο αρχείο. Αναδιατάξτε σελίδες με drag-and-drop, χωρίς όριο στον αριθμό εγγράφων που μπορείτε να συνδυάσετε.',
    'Birden çok PDF belgesini tek bir dosyada birleştirin. Sayfaları sürükleyip bırakarak yeniden sıralayın, aynı anda birleştirebileceğiniz belge sayısında sınır yoktur.'],

  ['split-pdf',
    'Udtræk specifikke sider eller sideområder fra en PDF til separate filer. Indtast områder som "1-3, 5, 7-10" for at vælge præcis hvilke sider du vil have.',
    'Pura tietyt sivut tai sivualueet PDF:stä erillisiin tiedostoihin. Syötä alueet kuten "1-3, 5, 7-10" valitaksesi tarkalleen mitkä sivut haluat.',
    'Extrahujte konkrétní stránky nebo rozsahy stránek z PDF do samostatných souborů. Zadejte rozsahy jako "1-3, 5, 7-10" a vyberte přesně, které stránky chcete.',
    'Extrageți pagini specifice sau intervale de pagini dintr-un PDF în fișiere separate. Introduceți intervale precum "1-3, 5, 7-10" pentru a alege exact ce pagini doriți.',
    'Vonjon ki konkrét oldalakat vagy oldaltartományokat egy PDF-ből külön fájlokba. Adjon meg tartományokat, mint "1-3, 5, 7-10", hogy pontosan kiválassza, mely oldalakat szeretné.',
    'Εξαγάγετε συγκεκριμένες σελίδες ή εύρη σελίδων από ένα PDF σε ξεχωριστά αρχεία. Εισαγάγετε εύρη όπως "1-3, 5, 7-10" για να επιλέξετε ακριβώς ποιες σελίδες θέλετε.',
    'PDF\'den belirli sayfaları veya sayfa aralıklarını ayrı dosyalara çıkarın. Tam olarak hangi sayfaları istediğinizi seçmek için "1-3, 5, 7-10" gibi aralıklar girin.'],

  ['compress-pdf',
    'Reducer filstørrelsen af PDF-dokumenter, mens læsbarheden bevares. Perfekt til e-mail-vedhæftninger, web-uploads og lagerbesparelse.',
    'Pienennä PDF-asiakirjojen tiedostokokoa säilyttäen samalla luettavuuden. Täydellinen sähköpostin liitteille, verkkolatauksille ja tallennustilan säästöön.',
    'Snižte velikost souborů PDF dokumentů při zachování čitelnosti. Perfektní pro e-mailové přílohy, webové uploady a úsporu úložiště.',
    'Reduceți dimensiunea fișierului documentelor PDF păstrând în același timp lizibilitatea. Perfect pentru atașamente de e-mail, încărcări web și economisire de spațiu de stocare.',
    'Csökkentse a PDF dokumentumok fájlméretét az olvashatóság megőrzése mellett. Tökéletes e-mail mellékletekhez, webfeltöltésekhez és tárhely-megtakarításhoz.',
    'Μειώστε το μέγεθος αρχείου εγγράφων PDF διατηρώντας την αναγνωσιμότητα. Τέλειο για συνημμένα email, web uploads και εξοικονόμηση αποθήκευσης.',
    'Okunabilirliği koruyarak PDF belgelerinin dosya boyutunu azaltın. E-posta ekleri, web yüklemeleri ve depolama tasarrufu için mükemmeldir.'],

  ['rotate-pdf',
    'Roter en eller alle sider af en PDF med 90, 180 eller 270 grader. Ret hurtigt scannede dokumenter, der er sidelæns eller på hovedet.',
    'Käännä yksi tai kaikki PDF-sivut 90, 180 tai 270 astetta. Korjaa nopeasti skannatut asiakirjat, jotka ovat sivuttain tai ylösalaisin.',
    'Otočte jednu nebo všechny stránky PDF o 90, 180 nebo 270 stupňů. Rychle opravte naskenované dokumenty, které jsou stranou nebo vzhůru nohama.',
    'Rotiți una sau toate paginile unui PDF cu 90, 180 sau 270 de grade. Reparați rapid documente scanate care sunt pe lateral sau cu susul în jos.',
    'Forgassa el egy PDF egy vagy összes oldalát 90, 180 vagy 270 fokkal. Gyorsan javítsa az oldalra vagy fejjel lefelé szkennelt dokumentumokat.',
    'Περιστρέψτε μία ή όλες τις σελίδες ενός PDF κατά 90, 180 ή 270 μοίρες. Διορθώστε γρήγορα σαρωμένα έγγραφα που είναι στο πλάι ή ανάποδα.',
    'Bir PDF\'nin bir veya tüm sayfalarını 90, 180 veya 270 derece döndürün. Yan veya ters taranan belgeleri hızlıca düzeltin.'],

  ['protect-pdf',
    'Krypter din PDF med en adgangskode for at forhindre uautoriseret adgang. Industristandard AES-kryptering holder fortrolige dokumenter sikre.',
    'Salaa PDF salasanalla estääksesi luvattoman pääsyn. Alan standardi AES-salaus pitää luottamukselliset asiakirjat turvassa.',
    'Šifrujte své PDF heslem, abyste zabránili neoprávněnému přístupu. Šifrování AES odpovídající průmyslovému standardu udrží důvěrné dokumenty v bezpečí.',
    'Criptați PDF-ul cu o parolă pentru a preveni accesul neautorizat. Criptarea AES standard în industrie păstrează documentele confidențiale în siguranță.',
    'Titkosítsa PDF-jét jelszóval az illetéktelen hozzáférés megakadályozására. Az iparági szabványos AES titkosítás biztonságban tartja a bizalmas dokumentumokat.',
    'Κρυπτογραφήστε το PDF σας με κωδικό πρόσβασης για να αποτρέψετε μη εξουσιοδοτημένη πρόσβαση. Η κρυπτογράφηση AES βιομηχανικού προτύπου διατηρεί ασφαλή τα εμπιστευτικά έγγραφα.',
    'Yetkisiz erişimi önlemek için PDF\'nizi parolayla şifreleyin. Endüstri standardı AES şifrelemesi gizli belgeleri güvende tutar.'],

  ['unlock-pdf',
    'Fjern adgangskodebeskyttelse fra PDF\'er du ejer. Gendan fuld redigerings- og udskrivningsadgang til dine sikrede dokumenter.',
    'Poista salasanasuojaus omistamiltasi PDF-tiedostoista. Palauta täysi muokkaus- ja tulostusoikeus suojattuihin asiakirjoihisi.',
    'Odstraňte ochranu heslem z PDF, které vlastníte. Obnovte plný přístup k úpravě a tisku svých zabezpečených dokumentů.',
    'Eliminați protecția prin parolă a PDF-urilor pe care le dețineți. Restabiliți accesul complet de editare și imprimare la documentele securizate.',
    'Távolítsa el a jelszavas védelmet a PDF-jeiről. Állítsa vissza a teljes szerkesztési és nyomtatási hozzáférést a védett dokumentumaihoz.',
    'Καταργήστε την προστασία με κωδικό πρόσβασης από PDF που σας ανήκουν. Επαναφέρετε πλήρη πρόσβαση επεξεργασίας και εκτύπωσης στα ασφαλισμένα έγγραφά σας.',
    'Sahip olduğunuz PDF\'lerden parola korumasını kaldırın. Güvenli belgelerinize tam düzenleme ve yazdırma erişimini geri yükleyin.'],

  // ── Utilities ──
  ['view-metadata',
    'Inspicer detaljerede metadata indlejret i enhver fil: dimensioner, varighed, codecs, EXIF-kameraoplysninger, dokumentegenskaber og mere. Ingen konvertering nødvendig.',
    'Tarkasta minkä tahansa tiedoston upotetut yksityiskohtaiset metatiedot: mitat, kesto, koodekit, EXIF-kameran tiedot, asiakirjan ominaisuudet ja paljon muuta. Ei konversiota tarvita.',
    'Prozkoumejte podrobná metadata vložená v jakémkoli souboru: rozměry, trvání, kodeky, informace o EXIF kameře, vlastnosti dokumentu a další. Není potřeba žádná konverze.',
    'Inspectați metadatele detaliate încorporate în orice fișier: dimensiuni, durată, codecuri, informații despre camera EXIF, proprietăți document și multe altele. Nu este necesară conversia.',
    'Vizsgálja meg bármely fájlba ágyazott részletes metaadatokat: méreteket, időtartamot, kódolókat, EXIF kamera információkat, dokumentumtulajdonságokat és még sok mást. Konverzió nem szükséges.',
    'Επιθεωρήστε λεπτομερή μεταδεδομένα που είναι ενσωματωμένα σε οποιοδήποτε αρχείο: διαστάσεις, διάρκεια, codecs, πληροφορίες κάμερας EXIF, ιδιότητες εγγράφων και άλλα. Δεν απαιτείται μετατροπή.',
    'Herhangi bir dosyaya gömülü ayrıntılı meta verileri inceleyin: boyutlar, süre, codec\'ler, EXIF kamera bilgisi, belge özellikleri ve daha fazlası. Dönüştürme gerekmez.'],

  // ── Smart Functions ──
  ['ocr',
    'Udtræk redigerbar tekst fra scannede PDF\'er og fotos ved hjælp af optisk tegngenkendelse. Output søgbar PDF eller almindelig tekst på dit valgte sprog.',
    'Pura muokattava teksti skannatuista PDF-tiedostoista ja valokuvista optista merkintunnistusta käyttäen. Tulostaa haettavan PDF:n tai pelkkää tekstiä valitsemallasi kielellä.',
    'Extrahujte upravitelný text z naskenovaných PDF a fotografií pomocí optického rozpoznávání znaků. Výstupem je prohledávatelné PDF nebo prostý text ve vámi zvoleném jazyce.',
    'Extrageți text editabil din PDF-uri scanate și fotografii folosind recunoașterea optică a caracterelor. Rezultatul este un PDF căutabil sau text simplu în limba aleasă.',
    'Vonjon ki szerkeszthető szöveget szkennelt PDF-ekből és fényképekből optikai karakterfelismeréssel. Kereshető PDF vagy egyszerű szöveg a választott nyelven.',
    'Εξαγάγετε επεξεργάσιμο κείμενο από σαρωμένα PDF και φωτογραφίες χρησιμοποιώντας οπτική αναγνώριση χαρακτήρων. Παράγει PDF με δυνατότητα αναζήτησης ή απλό κείμενο στην επιλεγμένη γλώσσα.',
    'Optik karakter tanıma kullanarak taranmış PDF\'lerden ve fotoğraflardan düzenlenebilir metin çıkarın. Seçtiğiniz dilde aranabilir PDF veya düz metin çıktısı.'],

  ['pdf-compress-ai',
    'AI-drevet PDF-komprimering, der intelligent reducerer filstørrelsen, mens kvaliteten af tekst og billeder bevares. Opnår mindre filer end traditionel komprimering.',
    'AI-pohjainen PDF-pakkaus, joka pienentää tiedostokokoa älykkäästi tekstin ja kuvien laadun säilyttäen. Saavuttaa pienemmät tiedostot kuin perinteinen pakkaus.',
    'PDF komprese poháněná umělou inteligencí, která inteligentně snižuje velikost souboru při zachování kvality textu a obrázků. Dosahuje menších souborů než tradiční komprese.',
    'Compresie PDF cu AI care reduce inteligent dimensiunea fișierului păstrând calitatea textului și a imaginilor. Obține fișiere mai mici decât compresia tradițională.',
    'Mesterséges intelligenciával működő PDF tömörítés, amely intelligensen csökkenti a fájlméretet a szöveg és képek minőségének megőrzésével. Kisebb fájlokat ér el, mint a hagyományos tömörítés.',
    'Συμπίεση PDF με τεχνητή νοημοσύνη που μειώνει έξυπνα το μέγεθος αρχείου διατηρώντας την ποιότητα κειμένου και εικόνων. Επιτυγχάνει μικρότερα αρχεία από την παραδοσιακή συμπίεση.',
    'Metin ve görüntü kalitesini korurken dosya boyutunu akıllıca azaltan AI destekli PDF sıkıştırma. Geleneksel sıkıştırmadan daha küçük dosyalar elde eder.'],

  ['document-translation',
    'Kommer snart: oversæt automatisk dokumenter mellem snesevis af sprog, mens den oprindelige layout og formatering bevares.',
    'Tulossa pian: käännä asiakirjat automaattisesti kymmenien kielten välillä alkuperäisen asettelun ja muotoilun säilyttäen.',
    'Brzy: automatický překlad dokumentů mezi desítkami jazyků při zachování původního rozvržení a formátování.',
    'În curând: traduceți automat documente între zeci de limbi păstrând aspectul și formatarea originale.',
    'Hamarosan: dokumentumok automatikus fordítása több tucat nyelv között az eredeti elrendezés és formázás megőrzésével.',
    'Έρχεται σύντομα: αυτόματη μετάφραση εγγράφων μεταξύ δεκάδων γλωσσών διατηρώντας την αρχική διάταξη και μορφοποίηση.',
    'Yakında: orijinal düzeni ve biçimlendirmeyi koruyarak belgeleri onlarca dil arasında otomatik olarak çevirin.'],

  ['text-to-speech',
    'Konverter enhver tekst til naturlig lydende tale ved hjælp af OpenAI-stemmer. Vælg mellem seks stemmekarakterer og tre lydformater inklusive MP3.',
    'Muunna mikä tahansa teksti luonnollisen kuuloiseksi puheeksi OpenAI:n äänillä. Valitse kuudesta äänihahmosta ja kolmesta äänimuodosta mukaan lukien MP3.',
    'Převeďte jakýkoli text na přirozeně znějící řeč pomocí hlasů OpenAI. Vyberte si ze šesti hlasových postav a tří zvukových formátů včetně MP3.',
    'Convertiți orice text în vorbire cu sunet natural folosind vocile OpenAI. Alegeți dintre șase personaje de voce și trei formate audio, inclusiv MP3.',
    'Konvertáljon bármilyen szöveget természetesen hangzó beszéddé OpenAI hangok használatával. Hat hangkarakter és három audio formátum közül választhat, beleértve az MP3-at.',
    'Μετατρέψτε οποιοδήποτε κείμενο σε φυσικά ηχούσα ομιλία χρησιμοποιώντας φωνές OpenAI. Επιλέξτε από έξι χαρακτήρες φωνής και τρεις μορφές ήχου συμπεριλαμβανομένου του MP3.',
    'OpenAI seslerini kullanarak herhangi bir metni doğal sesli konuşmaya dönüştürün. Altı ses karakteri ve MP3 dahil üç ses formatı arasından seçim yapın.'],

  ['speech-to-text',
    'Transskriber lydoptagelser, møder eller interviews til tekst ved hjælp af OpenAI Whisper. Understøtter over 50 sprog med høj nøjagtighed.',
    'Litteroi äänitallenteet, kokoukset tai haastattelut tekstiksi OpenAI Whisperin avulla. Tukee yli 50 kieltä korkealla tarkkuudella.',
    'Přepisujte zvukové nahrávky, schůzky nebo rozhovory na text pomocí OpenAI Whisper. Podporuje více než 50 jazyků s vysokou přesností.',
    'Transcrieți înregistrări audio, întâlniri sau interviuri în text folosind OpenAI Whisper. Suportă peste 50 de limbi cu acuratețe ridicată.',
    'Írjon át hangfelvételeket, megbeszéléseket vagy interjúkat szöveggé OpenAI Whisper segítségével. Több mint 50 nyelvet támogat magas pontossággal.',
    'Μεταγράψτε ηχητικές εγγραφές, συναντήσεις ή συνεντεύξεις σε κείμενο χρησιμοποιώντας OpenAI Whisper. Υποστηρίζει πάνω από 50 γλώσσες με υψηλή ακρίβεια.',
    'OpenAI Whisper kullanarak ses kayıtlarını, toplantıları veya görüşmeleri metne yazılı hale getirin. 50\'den fazla dili yüksek doğrulukla destekler.'],

  ['auto-subtitle',
    'Generer præcise, tidskodede SRT- eller VTT-undertekstfiler fra enhver video. Drevet af OpenAI Whisper for resultater af professionel kvalitet på over 50 sprog.',
    'Luo tarkkoja, aikakoodattuja SRT- tai VTT-tekstitystiedostoja mistä tahansa videosta. OpenAI Whisperin tukemana ammattilaatuisia tuloksia yli 50 kielellä.',
    'Generujte přesné, časově kódované soubory titulků SRT nebo VTT z jakéhokoli videa. Poháněno OpenAI Whisper pro výsledky profesionální kvality ve více než 50 jazycích.',
    'Generați fișiere de subtitrare SRT sau VTT precise, codificate în timp, din orice video. Bazat pe OpenAI Whisper pentru rezultate de calitate profesională în peste 50 de limbi.',
    'Generáljon pontos, időkódolt SRT vagy VTT feliratfájlokat bármely videóból. Az OpenAI Whisper hajtja professzionális minőségű eredményekért több mint 50 nyelven.',
    'Δημιουργήστε ακριβή, χρονικά κωδικοποιημένα αρχεία υποτίτλων SRT ή VTT από οποιοδήποτε βίντεο. Με τη δύναμη του OpenAI Whisper για επαγγελματικά αποτελέσματα σε πάνω από 50 γλώσσες.',
    'Herhangi bir videodan doğru, zaman kodlu SRT veya VTT altyazı dosyaları oluşturun. 50\'den fazla dilde profesyonel kalitede sonuçlar için OpenAI Whisper tarafından desteklenir.'],
];

// =====================================================================
// Build per-language { slug: text } objects
// =====================================================================
const LANGS = ['da', 'fi', 'cs', 'ro', 'hu', 'el', 'tr'];
const PAYLOADS = {};
for (const lang of LANGS) PAYLOADS[lang] = {};
for (const row of ROWS) {
  const [slug, ...texts] = row;
  for (let i = 0; i < LANGS.length; i++) {
    PAYLOADS[LANGS[i]][slug] = texts[i];
  }
}

// =====================================================================
// Helpers (same as add-tool-descriptions.js)
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
// Patch i18n-translations.js
// =====================================================================
let trContent = fs.readFileSync(I18N_TRANS, 'utf8');
for (const lang of LANGS) {
  const block = findLangBlock(trContent, lang);
  trContent = injectOrReplaceTopLevelKey(trContent, 'toolDescriptions', PAYLOADS[lang], block.start, block.end);
  console.log('✔ ' + lang);
}
fs.writeFileSync(I18N_TRANS, trContent);

console.log('\nDone — toolDescriptions added for ' + LANGS.length + ' secondary languages × ' + ROWS.length + ' tools.');
