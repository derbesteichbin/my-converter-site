// Chunk C2: adds the entire `privacy` block to hu, el, tr.
// 73 keys × 3 langs.
//
// Run from repo root:  node scripts/fill-gap-C2-privacy.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

// =====================================================================
// Hungarian (hu)
// =====================================================================
const huPrivacy = {
  title: 'Adatvédelmi szabályzat',
  seoDesc: '{{brand}} Adatvédelmi szabályzat. GDPR-kompatibilis adatkezelés: mit gyűjtünk, jogalap, megőrzés, alvállalkozók, jogai, nemzetközi adattovábbítások.',
  updated: 'Utoljára frissítve: 2026. május',
  s1Title: '1. Adatkezelő',
  s1Body: 'A {{brand}} ("Szolgáltatás") révén feldolgozott személyes adatokért felelős adatkezelő Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Németország. Minden adatvédelmi kérdéssel — beleértve az általános adatvédelmi rendelet (GDPR) szerinti jogai gyakorlására vonatkozó kéréseket — kérjük, lépjen velünk kapcsolatba e-mailben a Support@convertanyformat.com címen. Mivel nem felelünk meg a GDPR 37. cikkében vagy a § 38 BDSG küszöbértékeinek, nem vagyunk kötelesek adatvédelmi tisztviselőt kinevezni; az adatkezelő közvetlenül kezel minden adatvédelmi ügyet. Ez az adatvédelmi szabályzat elmagyarázza, milyen adatokat gyűjtünk, miért, milyen jogalapon, kivel osztjuk meg, mennyi ideig tároljuk, és milyen jogai vannak.',
  s2Title: '2. Az általunk gyűjtött személyes adatok',
  s2Account: 'Fiókadatok:',
  s2AccountBody: ' az e-mail címe, opcionális megjelenített név, jelszavának bcrypt hash-e (soha nem maga a jelszó), Google-fiók azonosítója OAuth-on keresztüli bejelentkezéskor, fiókbeállítások (téma, nyelv, értesítési beállítások) és hivatkozási kód, ha van.',
  s2Usage: 'Használati adatok:',
  s2UsageBody: ' átalakítási előzmények (fájlnév, bemeneti/kimeneti formátum, időbélyeg, állapot), kreditegyenleg és tranzakciónapló, eszközhasználati statisztikák, IP-cím és IP alapján származtatott megközelítő hely a csalás megelőzése érdekében.',
  s2Payment: 'Fizetési adatok:',
  s2PaymentBody: ' teljes egészében a Stripe Payments Europe Ltd. dolgozza fel. Csak egy Stripe ügyfélazonosítót, a kártya utolsó négy számjegyét, a kártya márkáját és egy tranzakció-megerősítést kapunk. Soha nem látunk vagy tárolunk teljes kártyaszámokat, CVC-ket vagy banki hitelesítő adatokat.',
  s2File: 'Fájladatok:',
  s2FileBody: ' az átalakításra feltöltött fájljait csak a Szolgáltatás biztosításához szükséges ideig tároljuk, és huszonnégy órán belül automatikusan töröljük. Nem férünk hozzá, nem olvassuk és nem elemezzük fájljai tartalmát, kivéve a kért átalakítás végrehajtásához szigorúan szükséges mértékben.',
  s2Tech: 'Műszaki adatok:',
  s2TechBody: ' böngésző típusa és verziója, operációs rendszer, eszköztípus, hivatkozó URL, nyelvi preferencia és cookie-azonosítók. Automatikusan gyűjtve a biztonság, a visszaélés megelőzése és a működő Szolgáltatás biztosítása érdekében.',
  s3Title: '3. Az adatkezelés céljai',
  s3Body: 'Személyes adatokat a következő célokra dolgozunk fel: (a) a Szolgáltatás üzemeltetése, beleértve a kért átalakítások szállítását, fiókja kezelését és a kreditegyenlegek elszámolását; (b) fizetések feldolgozása és adóügyileg megfelelő számlák kiállítása a Stripe-on keresztül; (c) tranzakciós e-mailek küldése, mint például fiók-ellenőrzés, jelszó-visszaállítás, az átalakítás befejezésére vonatkozó értesítések, amelyekre feliratkozott, és Szolgáltatás-állapot bejelentések; (d) ügyfélszolgálati kérdések megválaszolása és viták megoldása; (e) az összesített, nem azonosító használat elemzése a Szolgáltatás javítása érdekében; (f) csalás, visszaélés és jogosulatlan hozzáférés megelőzése; és (g) jogi kötelezettségek teljesítése, beleértve az adónyilvántartások megőrzését.',
  s4Title: '4. Az adatkezelés jogalapja (GDPR 6. cikk)',
  s4ContractTitle: 'Szerződés teljesítése (6. cikk (1) (b)):',
  s4ContractBody: ' átalakításai feldolgozása, fiókja kezelése és a kreditrendszer üzemeltetése szükséges a regisztráció vagy vásárlás során kötött szerződés teljesítéséhez.',
  s4InterestTitle: 'Jogos érdek (6. cikk (1) (f)):',
  s4InterestBody: ' csalás megelőzése, biztonsági monitoring, visszaélés-felismerés, összesített analitika és Szolgáltatás-javítás. Mérlegtesztet végeztünk és figyelembe vettük az Ön alapvető jogait és szabadságait.',
  s4ConsentTitle: 'Hozzájárulás (6. cikk (1) (a)):',
  s4ConsentBody: ' marketing e-mailek, analitikai cookie-k és minden olyan opcionális funkció, amely meghaladja a szigorú szükségességet. A hozzájárulást szabadon adja meg a cookie-bannerrel vagy a beállításokkal és bármikor visszavonhatja anélkül, hogy az érintené a visszavonás előtti adatkezelés jogszerűségét.',
  s4LegalTitle: 'Jogi kötelezettség (6. cikk (1) (c)):',
  s4LegalBody: ' adózási szempontból releváns nyilvántartások megőrzése a § 147 AO (német adótörvény) alapján, jogszerű hatósági kérésekre adott válaszok és bármely más, az EU vagy a német törvény által ránk rótt kötelezettség.',
  s5Title: '5. Cookie-k és hasonló technológiák',
  s5EssentialTitle: 'Alapvető cookie-k:',
  s5EssentialBody: ' hitelesítési tokenje (httpOnly, SameSite=Strict), témapreferencia, nyelvi preferencia és cookie-hozzájárulás állapota. Ezek szigorúan szükségesek a Szolgáltatás működéséhez és nem igényelnek hozzájárulást a § 25 (2) TTDSG szerint.',
  s5AnalyticsTitle: 'Analitikai cookie-k:',
  s5AnalyticsBody: ' csak a kifejezett hozzájárulásával kerülnek beállításra a cookie-banneren keresztül. Segítenek megérteni, hogyan használják a Szolgáltatást összesítve. A hozzájárulást bármikor visszavonhatja, és töröljük a megfelelő cookie-kat.',
  s5MarketingTitle: 'Marketing cookie-k:',
  s5MarketingBody: ' csak a kifejezett hozzájárulásával kerülnek beállításra. A kommunikáció személyre szabására használjuk. A hozzájárulást bármikor visszavonhatja.',
  s5Manage: 'A cookie-beállításokat bármikor kezelheti a oldal láblécében található cookie ikonon keresztül. A böngésző beállításai ezenkívül lehetővé teszik a cookie-k blokkolását, törlését vagy korlátozását — vegye figyelembe, hogy az alapvető cookie-k blokkolása megakadályozza a bejelentkezést vagy vásárlást.',
  s6Title: '6. Adatmegosztás alvállalkozókkal',
  s6Body: 'Személyes adatokat csak a következő alvállalkozókkal osztunk meg, mindegyikük a 28. cikk GDPR szerint megfelelő adatfeldolgozási megállapodás alapján van bevonva. A Stripe Payments Europe Ltd. (Írország) kezeli a fizetésfeldolgozást; a CloudConvert GmbH (München, Németország) feldolgozza a fájlátalakításokat; a Supabase Inc. (Egyesült Államok, az átvitelt EU szabványos szerződéses záradékok fedik) hosztolja PostgreSQL adatbázisunkat; a Railway Corp. (Egyesült Államok, SCC-k) hosztolja alkalmazásunkat; a Resend (Egyesült Államok, SCC-k) szállítja a tranzakciós e-maileket; az OpenAI Ireland Ltd. dolgozza fel a Smart Functions bemeneteket (audió/szöveg); és a Google LLC (Egyesült Államok, EU-US Data Privacy Framework keretében tanúsított) biztosítja a Google OAuth bejelentkezést. Soha nem adjuk el személyes adatait senkinek, és nem továbbítunk adatokat harmadik feleknek saját marketing célokra.',
  s7Title: '7. Adatmegőrzés',
  s7Files: 'Fájlok:',
  s7FilesBody: ' a feltöltött és átalakított fájlok a feltöltést követő huszonnégy (24) órán belül törlődnek, függetlenül attól, hogy letöltötték-e őket.',
  s7Account: 'Fiókadatok:',
  s7AccountBody: ' addig őrzik, amíg a fiók aktív. Amikor törli a fiókját, az összes kapcsolódó adat harminc (30) napon belül eltávolításra kerül, kivéve azokat a nyilvántartásokat, amelyeket törvényileg meg kell őriznünk.',
  s7Payment: 'Fizetési és számlanyilvántartások:',
  s7PaymentBody: ' tíz (10) évig megőrizzük a § 147 AO (német adótörvény) szerint az adózási és számviteli megfelelés érdekében. Ezen időszak után az adatokat visszafordíthatatlanul töröljük.',
  s7Logs: 'Szervernaplók:',
  s7LogsBody: ' harminc (30) napig megőrizzük biztonsági okokból, visszaélés megelőzése és incidens kivizsgálása céljából, ezt követően automatikusan törlésre kerülnek.',
  s8Title: '8. GDPR szerinti jogai',
  s8Intro: 'Kiterjedt jogai vannak az Önről feldolgozott személyes adatokkal kapcsolatban:',
  s8Access: 'Hozzáférési jog (15. cikk):',
  s8AccessBody: ' kérheti annak megerősítését, hogy feldolgozzuk-e adatait, és másolatot kérhet ezekről az adatokról.',
  s8Rect: 'Helyesbítéshez való jog (16. cikk):',
  s8RectBody: ' a pontatlan adatokat közvetlenül a profil oldalán keresztül vagy hozzánk fordulva javíthatja.',
  s8Erase: 'Törléshez való jog / "elfeledtetéshez való jog" (17. cikk):',
  s8EraseBody: ' kérheti fiókja és minden kapcsolódó személyes adat törlését, a jogi megőrzési kötelezettségektől, például az adónyilvántartásoktól függően.',
  s8Port: 'Adathordozhatósághoz való jog (20. cikk):',
  s8PortBody: ' kérheti adatainak másolatát strukturált, általánosan használt, géppel olvasható formátumban.',
  s8Restrict: 'Az adatkezelés korlátozásához való jog (18. cikk):',
  s8RestrictBody: ' kérheti, hogy korlátozzuk adatai feldolgozását, amíg vitát rendezünk, pontatlanságot javítunk vagy jogi igényt értékelünk.',
  s8Object: 'Tiltakozáshoz való jog (21. cikk):',
  s8ObjectBody: ' tiltakozhat a jogos érdek alapján végzett adatkezelés ellen, beleértve a profilalkotást is. Leállítjuk, hacsak nem tudjuk bizonyítani a kényszerítő jogos okokat, amelyek felülírják az Ön érdekeit.',
  s8Withdraw: 'Hozzájárulás visszavonásához való jog (7. cikk):',
  s8WithdrawBody: ' minden hozzájáruláson alapuló feldolgozásnál bármikor visszavonhatja anélkül, hogy ez érintené a visszavonás előtti feldolgozás jogszerűségét.',
  s8Outro: 'Bármely ilyen jog gyakorlásához küldjön e-mailt a Support@convertanyformat.com címre a fiókjához társított címről. Egy hónapon belül válaszolunk, amely összetett kéréseknél két további hónappal meghosszabbítható, ahogy azt a 12. cikk (3) GDPR engedi. Jogai gyakorlása ingyenes.',
  s9Title: '9. Adatbiztonság',
  s9Body: 'Személyes adatait iparági szabványú technikai és szervezési intézkedésekkel védjük: TLS 1.2+ titkosítás minden továbbítás alatt lévő adathoz; bcrypt jelszó hashing 10 vagy magasabb költségfaktorral; httpOnly munkamenet-sütik SameSite=Strict attribútummal; legkisebb privilégium elve a belső hozzáféréshez, beleértve az audit naplózást; rendszeres függőségi frissítések az ismert sebezhetőségek kezelésére; sebességkorlátozás és bemenet-ellenőrzés a visszaélések megelőzésére; és elismert tanúsítványokkal (ISO 27001, SOC 2) rendelkező szolgáltatók által üzemeltetett infrastruktúra. Az Ön jogait és szabadságait érintő személyes adatvédelmi incidens esetén 72 órán belül értesítjük az illetékes felügyeleti hatóságot, és indokolatlan késedelem nélkül tájékoztatjuk az érintett felhasználókat a 33-34. cikk GDPR-ral összhangban.',
  s10Title: '10. Nemzetközi adattovábbítások',
  s10Body: 'Egyes alvállalkozóink az Európai Gazdasági Térségen kívül találhatóak, főként az Egyesült Államokban. Minden ilyen továbbításhoz végrehajtottuk a GDPR V. fejezete által megkövetelt megfelelő biztosítékokat. A Stripe (Írország) és CloudConvert (Németország) felé történő átvitelek az EGT-n belül maradnak. A Supabase, Railway, Resend és OpenAI (Egyesült Államok) felé történő átviteleket az Európai Bizottság szabványos szerződéses záradékai (2. modul: adatkezelő-feldolgozó) szabályozzák, kiegészítve további technikai biztosítékokkal, beleértve az átvitel közbeni és nyugalmi titkosítást. A Google LLC ezen kívül az EU-US Data Privacy Framework alá tartozik, ami a 45. cikk GDPR értelmében megfelelő védelmi szintet biztosít.',
  s11Title: '11. Gyermekek adatvédelme',
  s11Body: 'A Szolgáltatás nem irányul tizenhat (16) éven aluli gyermekekre, és tudatosan nem gyűjtünk személyes adatokat ennél a kornál fiatalabb gyermekektől. Ha Ön szülő vagy törvényes gyám és úgy gondolja, hogy egy 16 év alatti gyermek személyes adatokat adott meg, kérjük, lépjen kapcsolatba velünk a Support@convertanyformat.com címen, és lépéseket teszünk az adatok gyors törlése érdekében. A 16 és 18 év közötti felhasználók kijelentik, hogy rendelkeznek szülő vagy törvényes gyám hozzájárulásával, ahol azt a tartózkodási ország megköveteli.',
  s12Title: '12. Az adatvédelmi szabályzat módosításai',
  s12Body: 'Ezt az adatvédelmi szabályzatot időről időre frissíthetjük, hogy tükrözze gyakorlatunkban, az általunk használt technológiákban, az alkalmazandó jogi követelményekben vagy egyéb működési tényezőkben bekövetkezett változásokat. A lényeges változtatásokat hatálybalépésük előtt legalább harminc (30) nappal a regisztrált e-mail címére küldjük el. A nem lényeges változtatások (gépelési hibák javítása, formázás, magyarázó kiegészítések) megjelenéskor lépnek hatályba. Az oldal tetején található "Utoljára frissítve" dátum jelzi, hogy a Szabályzatot mikor vizsgálták felül utoljára. A Szolgáltatás folyamatos használata bármely változtatás hatálybalépési dátuma után az átdolgozott Szabályzat elfogadását jelenti.',
  s13Title: '13. Kapcsolat és panasztételhez való jog',
  s13Body: 'Adatvédelmi kérdésekkel, GDPR jogai gyakorlására vonatkozó kérésekkel vagy bármilyen más adatvédelemmel kapcsolatos aggállyal kapcsolatban kérjük, küldjön e-mailt a Support@convertanyformat.com címre. Egy hónapon belül igyekszünk válaszolni. Bármely más közigazgatási vagy bírósági jogorvoslat sérelme nélkül a 77. cikk GDPR alapján joga van panaszt benyújtani azon EU tagállam felügyeleti hatóságához, ahol Ön lakik, dolgozik, vagy ahol az állítólagos jogsértés történt. A {{brand}} illetékes felügyeleti hatósága a Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Greek (el)
// =====================================================================
const elPrivacy = {
  title: 'Πολιτική Απορρήτου',
  seoDesc: '{{brand}} Πολιτική Απορρήτου. Διαχείριση δεδομένων συμβατή με GDPR: τι συλλέγουμε, νομική βάση, διατήρηση, υπεπεξεργαστές, τα δικαιώματά σας, διεθνείς μεταφορές.',
  updated: 'Τελευταία ενημέρωση: Μάιος 2026',
  s1Title: '1. Υπεύθυνος επεξεργασίας δεδομένων',
  s1Body: 'Ο υπεύθυνος επεξεργασίας δεδομένων που είναι αρμόδιος για τα προσωπικά δεδομένα που υφίστανται επεξεργασία μέσω του {{brand}} ("Υπηρεσία") είναι ο Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Γερμανία. Για όλες τις ερωτήσεις σχετικά με την προστασία δεδομένων — συμπεριλαμβανομένων αιτημάτων άσκησης των δικαιωμάτων σας βάσει του Γενικού Κανονισμού Προστασίας Δεδομένων (GDPR) — επικοινωνήστε μαζί μας μέσω email στο Support@convertanyformat.com. Καθώς δεν πληρούμε τα όρια του Άρθρου 37 GDPR ή § 38 BDSG, δεν είμαστε υποχρεωμένοι να ορίσουμε Υπεύθυνο Προστασίας Δεδομένων· ο υπεύθυνος επεξεργασίας χειρίζεται όλα τα θέματα προστασίας δεδομένων απευθείας. Αυτή η Πολιτική Απορρήτου εξηγεί τι δεδομένα συλλέγουμε, γιατί, σε ποια νομική βάση, με ποιους τα μοιραζόμαστε, για πόσο τα διατηρούμε και τι δικαιώματα έχετε.',
  s2Title: '2. Προσωπικά δεδομένα που συλλέγουμε',
  s2Account: 'Δεδομένα λογαριασμού:',
  s2AccountBody: ' η διεύθυνση email σας, προαιρετικό όνομα εμφάνισης, ένα bcrypt hash του κωδικού πρόσβασής σας (ποτέ ο κωδικός πρόσβασης), αναγνωριστικό λογαριασμού Google κατά τη σύνδεση μέσω OAuth, προτιμήσεις λογαριασμού (θέμα, γλώσσα, ρυθμίσεις ειδοποιήσεων) και κωδικός παραπομπής εάν ισχύει.',
  s2Usage: 'Δεδομένα χρήσης:',
  s2UsageBody: ' ιστορικό μετατροπών (όνομα αρχείου, μορφή εισόδου/εξόδου, χρονοσφραγίδα, κατάσταση), υπόλοιπο κρεντίτ και αρχείο συναλλαγών, στατιστικά χρήσης εργαλείων, διεύθυνση IP και κατά προσέγγιση τοποθεσία που προέρχεται από IP για σκοπούς πρόληψης απάτης.',
  s2Payment: 'Δεδομένα πληρωμής:',
  s2PaymentBody: ' επεξεργάζονται εξ ολοκλήρου από την Stripe Payments Europe Ltd. Λαμβάνουμε μόνο ένα αναγνωριστικό πελάτη Stripe, τα τελευταία τέσσερα ψηφία της κάρτας, τη μάρκα της κάρτας και μια επιβεβαίωση συναλλαγής. Δεν βλέπουμε ούτε αποθηκεύουμε ποτέ πλήρεις αριθμούς καρτών, CVC ή τραπεζικά διαπιστευτήρια.',
  s2File: 'Δεδομένα αρχείων:',
  s2FileBody: ' τα αρχεία που μεταφορτώνετε για μετατροπή αποθηκεύονται μόνο για όσο διάστημα απαιτείται για την παροχή της Υπηρεσίας και διαγράφονται αυτόματα εντός είκοσι τεσσάρων ωρών. Δεν αποκτούμε πρόσβαση, δεν διαβάζουμε ή αναλύουμε το περιεχόμενο των αρχείων σας, εκτός από όσο είναι απολύτως απαραίτητο για την εκτέλεση της μετατροπής που ζητήσατε.',
  s2Tech: 'Τεχνικά δεδομένα:',
  s2TechBody: ' τύπος και έκδοση προγράμματος περιήγησης, λειτουργικό σύστημα, τύπος συσκευής, URL αναφοράς, προτίμηση γλώσσας και αναγνωριστικά cookies. Συλλέγονται αυτόματα για ασφάλεια, πρόληψη κατάχρησης και παροχή λειτουργικής Υπηρεσίας.',
  s3Title: '3. Σκοποί επεξεργασίας',
  s3Body: 'Επεξεργαζόμαστε προσωπικά δεδομένα για τους ακόλουθους σκοπούς: (α) λειτουργία της Υπηρεσίας, συμπεριλαμβανομένης της παράδοσης των μετατροπών που έχετε ζητήσει, διαχείρισης του λογαριασμού σας και λογιστικής υπολοίπων κρεντίτ· (β) επεξεργασία πληρωμών και έκδοση τιμολογίων που συμμορφώνονται φορολογικά μέσω Stripe· (γ) αποστολή συναλλακτικών email όπως επαλήθευση λογαριασμού, επαναφορά κωδικού πρόσβασης, ειδοποιήσεις ολοκλήρωσης μετατροπής στις οποίες έχετε εγγραφεί και ανακοινώσεις κατάστασης Υπηρεσίας· (δ) απάντηση σε ερωτήσεις υποστήριξης και επίλυση διαφορών· (ε) ανάλυση συγκεντρωτικής, μη αναγνωρίσιμης χρήσης για βελτίωση της Υπηρεσίας· (στ) πρόληψη απάτης, κατάχρησης και μη εξουσιοδοτημένης πρόσβασης· και (ζ) συμμόρφωση με νομικές υποχρεώσεις, συμπεριλαμβανομένης της διατήρησης φορολογικών αρχείων.',
  s4Title: '4. Νομική βάση επεξεργασίας (Άρθρο 6 GDPR)',
  s4ContractTitle: 'Εκτέλεση συμβολαίου (Άρθρο 6 (1) (β)):',
  s4ContractBody: ' η επεξεργασία των μετατροπών σας, η διαχείριση του λογαριασμού σας και η λειτουργία του συστήματος κρεντίτ είναι απαραίτητες για την εκτέλεση του συμβολαίου που συνάψατε όταν εγγραφήκατε ή κάνατε αγορά.',
  s4InterestTitle: 'Νόμιμο συμφέρον (Άρθρο 6 (1) (στ)):',
  s4InterestBody: ' πρόληψη απάτης, παρακολούθηση ασφάλειας, εντοπισμός κατάχρησης, συγκεντρωτική ανάλυση και βελτίωση Υπηρεσίας. Έχουμε διεξάγει δοκιμή ισορροπίας και έχουμε λάβει υπόψη τα θεμελιώδη δικαιώματα και τις ελευθερίες σας.',
  s4ConsentTitle: 'Συγκατάθεση (Άρθρο 6 (1) (α)):',
  s4ConsentBody: ' email μάρκετινγκ, αναλυτικά cookies και τυχόν προαιρετικές λειτουργίες που υπερβαίνουν την αυστηρή αναγκαιότητα. Η συγκατάθεση δίδεται ελεύθερα μέσω του banner cookies ή των ρυθμίσεων και μπορεί να ανακληθεί ανά πάσα στιγμή χωρίς να επηρεάζει τη νομιμότητα της επεξεργασίας που πραγματοποιήθηκε πριν την ανάκληση.',
  s4LegalTitle: 'Νομική υποχρέωση (Άρθρο 6 (1) (γ)):',
  s4LegalBody: ' διατήρηση φορολογικά σχετικών αρχείων σύμφωνα με § 147 AO (Γερμανικός Φορολογικός Κώδικας), απάντηση σε νόμιμα αιτήματα από αρμόδιες αρχές και κάθε άλλη υποχρέωση που μας επιβάλλεται από το ευρωπαϊκό ή γερμανικό δίκαιο.',
  s5Title: '5. Cookies και παρόμοιες τεχνολογίες',
  s5EssentialTitle: 'Απαραίτητα cookies:',
  s5EssentialBody: ' το token ελέγχου ταυτότητάς σας (httpOnly, SameSite=Strict), προτίμηση θέματος, προτίμηση γλώσσας και κατάσταση συγκατάθεσης cookies. Αυτά είναι αυστηρά απαραίτητα για να λειτουργήσει η Υπηρεσία και δεν απαιτούν συγκατάθεση σύμφωνα με § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Αναλυτικά cookies:',
  s5AnalyticsBody: ' ορίζονται μόνο με τη ρητή συγκατάθεσή σας μέσω του banner cookies. Μας βοηθούν να καταλάβουμε πώς χρησιμοποιείται η Υπηρεσία συγκεντρωτικά. Μπορείτε να ανακαλέσετε τη συγκατάθεση ανά πάσα στιγμή και θα διαγράψουμε τα αντίστοιχα cookies.',
  s5MarketingTitle: 'Cookies μάρκετινγκ:',
  s5MarketingBody: ' ορίζονται μόνο με τη ρητή συγκατάθεσή σας. Χρησιμοποιούνται για την εξατομίκευση των επικοινωνιών. Μπορείτε να ανακαλέσετε τη συγκατάθεση ανά πάσα στιγμή.',
  s5Manage: 'Μπορείτε να διαχειριστείτε τις προτιμήσεις cookies σας ανά πάσα στιγμή μέσω του εικονιδίου cookie στο υποσέλιδο της σελίδας. Οι ρυθμίσεις του προγράμματος περιήγησης σας επιτρέπουν επιπλέον να μπλοκάρετε, να διαγράψετε ή να περιορίσετε cookies — σημειώστε ότι ο αποκλεισμός βασικών cookies θα σας εμποδίσει να συνδεθείτε ή να κάνετε αγορές.',
  s6Title: '6. Κοινή χρήση δεδομένων με υπεπεξεργαστές',
  s6Body: 'Μοιραζόμαστε προσωπικά δεδομένα μόνο με τους ακόλουθους υπεπεξεργαστές, καθένας από τους οποίους εμπλέκεται σύμφωνα με Συμφωνία Επεξεργασίας Δεδομένων που συμμορφώνεται με Άρθρο 28 GDPR. Η Stripe Payments Europe Ltd. (Ιρλανδία) χειρίζεται την επεξεργασία πληρωμών· η CloudConvert GmbH (Μόναχο, Γερμανία) επεξεργάζεται μετατροπές αρχείων· η Supabase Inc. (Ηνωμένες Πολιτείες, μεταφορές καλυπτόμενες από τυποποιημένες συμβατικές ρήτρες της ΕΕ) φιλοξενεί τη βάση δεδομένων PostgreSQL μας· η Railway Corp. (Ηνωμένες Πολιτείες, SCC) φιλοξενεί την εφαρμογή μας· η Resend (Ηνωμένες Πολιτείες, SCC) παραδίδει συναλλακτικά email· η OpenAI Ireland Ltd. επεξεργάζεται εισόδους Smart Functions (ήχο/κείμενο)· και η Google LLC (Ηνωμένες Πολιτείες, πιστοποιημένη βάσει του EU-US Data Privacy Framework) παρέχει σύνδεση Google OAuth. Δεν πουλάμε ποτέ τα προσωπικά σας δεδομένα σε κανέναν, και δεν μεταφέρουμε δεδομένα σε τρίτα μέρη για δικούς τους σκοπούς μάρκετινγκ.',
  s7Title: '7. Διατήρηση δεδομένων',
  s7Files: 'Αρχεία:',
  s7FilesBody: ' τα μεταφορτωμένα και μετατρεπόμενα αρχεία διαγράφονται εντός είκοσι τεσσάρων (24) ωρών από τη μεταφόρτωση, ανεξάρτητα από το αν λήφθηκαν.',
  s7Account: 'Δεδομένα λογαριασμού:',
  s7AccountBody: ' διατηρούνται όσο ο λογαριασμός σας είναι ενεργός. Όταν διαγράφετε τον λογαριασμό σας, όλα τα συσχετισμένα δεδομένα αφαιρούνται εντός τριάντα (30) ημερών, εκτός από τα αρχεία που είμαστε νομικά υποχρεωμένοι να διατηρήσουμε.',
  s7Payment: 'Αρχεία πληρωμών και τιμολογίων:',
  s7PaymentBody: ' διατηρούνται για δέκα (10) έτη σύμφωνα με § 147 AO (Γερμανικός Φορολογικός Κώδικας) για φορολογική και λογιστική συμμόρφωση. Μετά από αυτήν την περίοδο τα δεδομένα διαγράφονται μη αναστρέψιμα.',
  s7Logs: 'Αρχεία καταγραφής διακομιστή:',
  s7LogsBody: ' διατηρούνται για τριάντα (30) ημέρες για ασφάλεια, πρόληψη κατάχρησης και διερεύνηση συμβάντων, μετά τα οποία διαγράφονται αυτόματα.',
  s8Title: '8. Τα δικαιώματά σας βάσει του GDPR',
  s8Intro: 'Έχετε εκτεταμένα δικαιώματα σχετικά με τα προσωπικά δεδομένα που επεξεργαζόμαστε για εσάς:',
  s8Access: 'Δικαίωμα πρόσβασης (Άρθρο 15):',
  s8AccessBody: ' μπορείτε να ζητήσετε επιβεβαίωση του εάν επεξεργαζόμαστε τα δεδομένα σας και αντίγραφο αυτών των δεδομένων.',
  s8Rect: 'Δικαίωμα διόρθωσης (Άρθρο 16):',
  s8RectBody: ' μπορείτε να διορθώσετε ανακριβή δεδομένα απευθείας μέσω της σελίδας προφίλ σας ή επικοινωνώντας μαζί μας.',
  s8Erase: 'Δικαίωμα διαγραφής / "δικαίωμα στη λήθη" (Άρθρο 17):',
  s8EraseBody: ' μπορείτε να ζητήσετε τη διαγραφή του λογαριασμού σας και όλων των συσχετισμένων προσωπικών δεδομένων, με την επιφύλαξη νομικών υποχρεώσεων διατήρησης όπως φορολογικά αρχεία.',
  s8Port: 'Δικαίωμα φορητότητας δεδομένων (Άρθρο 20):',
  s8PortBody: ' μπορείτε να ζητήσετε αντίγραφο των δεδομένων σας σε δομημένη, κοινώς χρησιμοποιούμενη, μηχανικά αναγνώσιμη μορφή.',
  s8Restrict: 'Δικαίωμα περιορισμού της επεξεργασίας (Άρθρο 18):',
  s8RestrictBody: ' μπορείτε να ζητήσετε να περιορίσουμε την επεξεργασία των δεδομένων σας ενώ επιλύουμε μια διαφορά, διορθώνουμε μια ανακρίβεια ή αξιολογούμε μια νομική αξίωση.',
  s8Object: 'Δικαίωμα εναντίωσης (Άρθρο 21):',
  s8ObjectBody: ' μπορείτε να εναντιωθείτε στην επεξεργασία που πραγματοποιείται βάσει νόμιμου συμφέροντος, συμπεριλαμβανομένης της κατάρτισης προφίλ. Θα σταματήσουμε εκτός εάν μπορούμε να αποδείξουμε επιτακτικούς νόμιμους λόγους που υπερισχύουν των συμφερόντων σας.',
  s8Withdraw: 'Δικαίωμα ανάκλησης συγκατάθεσης (Άρθρο 7):',
  s8WithdrawBody: ' για οποιαδήποτε επεξεργασία βασίζεται στη συγκατάθεση, μπορείτε να ανακαλέσετε ανά πάσα στιγμή χωρίς να επηρεάζετε τη νομιμότητα της επεξεργασίας που πραγματοποιήθηκε πριν την ανάκληση.',
  s8Outro: 'Για να ασκήσετε οποιοδήποτε από αυτά τα δικαιώματα, στείλτε email στο Support@convertanyformat.com από τη διεύθυνση που σχετίζεται με τον λογαριασμό σας. Θα απαντήσουμε εντός ενός μηνός, παρατάσιμη κατά δύο επιπλέον μήνες για σύνθετα αιτήματα όπως επιτρέπεται από το Άρθρο 12 (3) GDPR. Η άσκηση των δικαιωμάτων σας είναι δωρεάν.',
  s9Title: '9. Ασφάλεια δεδομένων',
  s9Body: 'Προστατεύουμε τα προσωπικά σας δεδομένα χρησιμοποιώντας τεχνικά και οργανωτικά μέτρα που ανταποκρίνονται στα βιομηχανικά πρότυπα: κρυπτογράφηση TLS 1.2+ για όλα τα δεδομένα κατά τη μεταφορά· κατακερματισμός κωδικού πρόσβασης bcrypt με συντελεστή κόστους 10 ή μεγαλύτερο· cookies συνεδρίας httpOnly με το χαρακτηριστικό SameSite=Strict· αρχή ελάχιστου προνομίου για εσωτερική πρόσβαση συμπεριλαμβανομένης της καταγραφής ελέγχου· τακτικές ενημερώσεις εξαρτήσεων για την αντιμετώπιση γνωστών ευπαθειών· περιορισμός ρυθμού και επικύρωση εισόδου για την αποτροπή κατάχρησης· και υποδομή που φιλοξενείται από παρόχους με αναγνωρισμένες πιστοποιήσεις (ISO 27001, SOC 2). Σε περίπτωση παραβίασης προσωπικών δεδομένων που επηρεάζει τα δικαιώματα και τις ελευθερίες σας θα ειδοποιήσουμε την αρμόδια εποπτική αρχή εντός 72 ωρών και θα ενημερώσουμε τους επηρεαζόμενους χρήστες χωρίς αδικαιολόγητη καθυστέρηση, σύμφωνα με τα Άρθρα 33-34 GDPR.',
  s10Title: '10. Διεθνείς μεταφορές δεδομένων',
  s10Body: 'Ορισμένοι από τους υπεπεξεργαστές μας έχουν έδρα εκτός του Ευρωπαϊκού Οικονομικού Χώρου, κυρίως στις Ηνωμένες Πολιτείες. Για κάθε τέτοια μεταφορά έχουμε εφαρμόσει τις κατάλληλες διασφαλίσεις που απαιτούνται από το Κεφάλαιο V GDPR. Οι μεταφορές προς Stripe (Ιρλανδία) και CloudConvert (Γερμανία) παραμένουν εντός του ΕΟΧ. Οι μεταφορές προς Supabase, Railway, Resend και OpenAI (Ηνωμένες Πολιτείες) διέπονται από τις Τυποποιημένες Συμβατικές Ρήτρες της Ευρωπαϊκής Επιτροπής (Module 2: υπεύθυνος επεξεργασίας προς εκτελών) συμπληρωμένες με πρόσθετες τεχνικές διασφαλίσεις, συμπεριλαμβανομένης κρυπτογράφησης κατά τη μεταφορά και σε ηρεμία. Η Google LLC είναι επιπλέον πιστοποιημένη βάσει του EU-US Data Privacy Framework, παρέχοντας επαρκές επίπεδο προστασίας κατά την έννοια του Άρθρου 45 GDPR.',
  s11Title: '11. Απορρήτου παιδιών',
  s11Body: 'Η Υπηρεσία δεν απευθύνεται σε παιδιά κάτω των δεκαέξι (16) ετών και δεν συλλέγουμε εν γνώσει μας προσωπικά δεδομένα από παιδιά κάτω από αυτή την ηλικία. Εάν είστε γονέας ή νόμιμος κηδεμόνας και πιστεύετε ότι ένα παιδί κάτω των 16 ετών μας έχει παρέχει προσωπικά δεδομένα, παρακαλούμε επικοινωνήστε μαζί μας στο Support@convertanyformat.com και θα λάβουμε μέτρα για τη διαγραφή αυτών των δεδομένων αμέσως. Οι χρήστες μεταξύ 16 και 18 ετών δηλώνουν ότι έχουν τη συγκατάθεση γονέα ή νόμιμου κηδεμόνα όπου απαιτείται από τη χώρα κατοικίας τους.',
  s12Title: '12. Αλλαγές σε αυτή την Πολιτική Απορρήτου',
  s12Body: 'Ενδέχεται να ενημερώσουμε αυτήν την Πολιτική Απορρήτου από καιρό σε καιρό για να αντικατοπτρίζει αλλαγές στις πρακτικές μας, στις τεχνολογίες που χρησιμοποιούμε, στις ισχύουσες νομικές απαιτήσεις ή σε άλλους λειτουργικούς παράγοντες. Οι ουσιαστικές αλλαγές θα κοινοποιηθούν στην εγγεγραμμένη διεύθυνση email σας τουλάχιστον τριάντα (30) ημέρες πριν τεθούν σε ισχύ. Οι μη ουσιαστικές αλλαγές (διορθώσεις τυπογραφικών λαθών, μορφοποίηση, διευκρινιστικές προσθήκες) τίθενται σε ισχύ κατά τη δημοσίευση. Η ημερομηνία "Τελευταία ενημέρωση" στην κορυφή αυτής της σελίδας υποδεικνύει πότε αναθεωρήθηκε τελευταία η Πολιτική. Η συνεχιζόμενη χρήση της Υπηρεσίας μετά την ημερομηνία έναρξης ισχύος οποιασδήποτε αλλαγής συνιστά αποδοχή της αναθεωρημένης Πολιτικής.',
  s13Title: '13. Επικοινωνία και δικαίωμα υποβολής καταγγελίας',
  s13Body: 'Για ερωτήσεις σχετικά με την προστασία δεδομένων, αιτήματα άσκησης των δικαιωμάτων σας GDPR ή οποιαδήποτε άλλη ανησυχία σχετική με την ιδιωτικότητα, παρακαλούμε στείλτε email στο Support@convertanyformat.com. Στόχος μας είναι να απαντούμε εντός ενός μηνός. Με την επιφύλαξη οποιουδήποτε άλλου διοικητικού ή δικαστικού ένδικου μέσου, έχετε το δικαίωμα βάσει του Άρθρου 77 GDPR να υποβάλετε καταγγελία στην εποπτική αρχή του κράτους μέλους της ΕΕ όπου διαμένετε, εργάζεστε ή όπου έλαβε χώρα η εικαζόμενη παράβαση. Η αρμόδια εποπτική αρχή για το {{brand}} είναι η Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Turkish (tr)
// =====================================================================
const trPrivacy = {
  title: 'Gizlilik Politikası',
  seoDesc: '{{brand}} Gizlilik Politikası. GDPR uyumlu veri işleme: ne topluyoruz, yasal dayanak, saklama, alt-işleyiciler, haklarınız, uluslararası transferler.',
  updated: 'Son güncelleme: Mayıs 2026',
  s1Title: '1. Veri Kontrolörü',
  s1Body: '{{brand}} ("Hizmet") aracılığıyla işlenen kişisel verilerden sorumlu veri kontrolörü Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Almanya\'dır. Genel Veri Koruma Yönetmeliği (GDPR) kapsamındaki haklarınızı kullanma talepleri dahil tüm veri koruma sorularınız için lütfen Support@convertanyformat.com adresinden e-posta ile bizimle iletişime geçin. Madde 37 GDPR veya § 38 BDSG\'deki eşikleri karşılamadığımızdan, bir Veri Koruma Görevlisi atamamız gerekmemektedir; kontrolör tüm veri koruma konularını doğrudan ele alır. Bu Gizlilik Politikası hangi verileri topladığımızı, neden, hangi yasal dayanağa, kimlerle paylaştığımızı, ne kadar süre sakladığımızı ve hangi haklara sahip olduğunuzu açıklar.',
  s2Title: '2. Topladığımız Kişisel Veriler',
  s2Account: 'Hesap verileri:',
  s2AccountBody: ' e-posta adresiniz, isteğe bağlı görüntülenen ad, parolanızın bcrypt hash\'i (asla parolanın kendisi değil), OAuth ile giriş yaparken Google hesabı tanımlayıcısı, hesap tercihleri (tema, dil, bildirim ayarları) ve geçerli olduğunda bir yönlendirme kodu.',
  s2Usage: 'Kullanım verileri:',
  s2UsageBody: ' dönüşüm geçmişi (dosya adı, giriş/çıkış formatı, zaman damgası, durum), kredi bakiyesi ve işlem günlüğü, araç kullanım istatistikleri, IP adresi ve dolandırıcılık önleme amacıyla IP\'den türetilmiş yaklaşık konum.',
  s2Payment: 'Ödeme verileri:',
  s2PaymentBody: ' tamamen Stripe Payments Europe Ltd. tarafından işlenir. Yalnızca bir Stripe müşteri tanımlayıcısı, kartın son dört rakamı, kart markası ve bir işlem onayı alırız. Tam kart numaralarını, CVC\'leri veya bankacılık kimlik bilgilerini asla görmez veya saklamayız.',
  s2File: 'Dosya verileri:',
  s2FileBody: ' dönüşüm için yüklediğiniz dosyalar yalnızca Hizmeti sunmak için gereken süre boyunca saklanır ve yirmi dört saat içinde otomatik olarak silinir. Talep ettiğiniz dönüşümü gerçekleştirmek için kesinlikle gerekli olan durumlar dışında dosyalarınızın içeriğine erişmez, okumaz veya analiz etmeyiz.',
  s2Tech: 'Teknik veriler:',
  s2TechBody: ' tarayıcı türü ve sürümü, işletim sistemi, cihaz türü, yönlendirici URL, dil tercihi ve çerez tanımlayıcıları. Güvenlik, kötüye kullanımın önlenmesi ve çalışan bir Hizmet sunmak için otomatik olarak toplanır.',
  s3Title: '3. İşleme Amaçları',
  s3Body: 'Kişisel verileri aşağıdaki amaçlarla işliyoruz: (a) Hizmetin işletilmesi, talep ettiğiniz dönüşümlerin teslimi, hesabınızın yönetilmesi ve kredi bakiyelerinin hesaplanması dahil; (b) ödemelerin işlenmesi ve Stripe aracılığıyla vergi uyumlu faturaların düzenlenmesi; (c) hesap doğrulama, parola sıfırlama, kabul ettiğiniz dönüşüm tamamlama bildirimleri ve Hizmet durumu duyuruları gibi işlem e-postaları gönderme; (d) destek sorgularına yanıt verme ve anlaşmazlıkları çözme; (e) Hizmeti iyileştirmek için toplu, tanımlayıcı olmayan kullanımı analiz etme; (f) dolandırıcılık, kötüye kullanım ve yetkisiz erişimin önlenmesi; ve (g) vergi kayıtlarının saklanması dahil yasal yükümlülüklere uyma.',
  s4Title: '4. İşleme için Yasal Dayanak (Madde 6 GDPR)',
  s4ContractTitle: 'Sözleşme ifası (Madde 6 (1) (b)):',
  s4ContractBody: ' dönüşümlerinizin işlenmesi, hesabınızın yönetilmesi ve kredi sisteminin işletilmesi, kayıt olduğunuzda veya satın alma yaptığınızda yapmış olduğunuz sözleşmenin ifası için gereklidir.',
  s4InterestTitle: 'Meşru menfaat (Madde 6 (1) (f)):',
  s4InterestBody: ' dolandırıcılığın önlenmesi, güvenlik izleme, kötüye kullanım tespiti, toplu analitik ve Hizmet iyileştirme. Bir denge testi yaptık ve temel haklarınızı ve özgürlüklerinizi göz önünde bulundurduk.',
  s4ConsentTitle: 'Rıza (Madde 6 (1) (a)):',
  s4ConsentBody: ' pazarlama e-postaları, analitik çerezler ve katı zorunluluğun ötesine geçen herhangi bir isteğe bağlı özellik. Rıza, çerez bannerı veya ayarlar aracılığıyla özgürce verilir ve geri çekme öncesi yapılan işlemenin yasallığını etkilemeden istediğiniz zaman geri çekilebilir.',
  s4LegalTitle: 'Yasal yükümlülük (Madde 6 (1) (c)):',
  s4LegalBody: ' § 147 AO (Alman Vergi Kodu) kapsamında vergi açısından ilgili kayıtların saklanması, yetkili makamlardan gelen yasal taleplere yanıt verme ve AB veya Alman hukuku tarafından bize dayatılan diğer herhangi bir yükümlülük.',
  s5Title: '5. Çerezler ve Benzeri Teknolojiler',
  s5EssentialTitle: 'Esansiyel çerezler:',
  s5EssentialBody: ' kimlik doğrulama belirtecini (httpOnly, SameSite=Strict), tema tercihini, dil tercihini ve çerez onay durumunu içerir. Bunlar Hizmetin çalışması için kesinlikle gereklidir ve § 25 (2) TTDSG kapsamında onay gerektirmez.',
  s5AnalyticsTitle: 'Analitik çerezler:',
  s5AnalyticsBody: ' yalnızca çerez bannerı aracılığıyla açık onayınızla ayarlanır. Hizmetin toplu olarak nasıl kullanıldığını anlamamıza yardımcı olur. Onayı istediğiniz zaman geri çekebilirsiniz ve karşılık gelen çerezleri sileriz.',
  s5MarketingTitle: 'Pazarlama çerezleri:',
  s5MarketingBody: ' yalnızca açık onayınızla ayarlanır. İletişimleri kişiselleştirmek için kullanılır. Onayı istediğiniz zaman geri çekebilirsiniz.',
  s5Manage: 'Çerez tercihlerinizi sayfa altbilgisindeki çerez simgesi aracılığıyla istediğiniz zaman yönetebilirsiniz. Tarayıcı ayarları ayrıca çerezleri engellemenize, silmenize veya kısıtlamanıza izin verir — esansiyel çerezleri engellemenin oturum açmanızı veya satın alma yapmanızı engelleyeceğini unutmayın.',
  s6Title: '6. Alt-İşleyicilerle Veri Paylaşımı',
  s6Body: 'Kişisel verileri yalnızca Madde 28 GDPR ile uyumlu bir Veri İşleme Sözleşmesi kapsamında çalıştırılan aşağıdaki alt-işleyicilerle paylaşırız. Stripe Payments Europe Ltd. (İrlanda) ödeme işlemeyi yapar; CloudConvert GmbH (Münih, Almanya) dosya dönüşümlerini işler; Supabase Inc. (Amerika Birleşik Devletleri, AB Standart Sözleşme Maddeleri tarafından kapsanan transferler) PostgreSQL veritabanımızı barındırır; Railway Corp. (Amerika Birleşik Devletleri, SCC) uygulamamızı barındırır; Resend (Amerika Birleşik Devletleri, SCC) işlem e-postaları gönderir; OpenAI Ireland Ltd. Smart Functions girdilerini (ses/metin) işler; ve Google LLC (Amerika Birleşik Devletleri, EU-US Data Privacy Framework altında sertifikalı) Google OAuth oturum açmayı sağlar. Kişisel verilerinizi asla kimseye satmayız ve verileri kendi pazarlama amaçları için üçüncü taraflara aktarmayız.',
  s7Title: '7. Veri Saklama',
  s7Files: 'Dosyalar:',
  s7FilesBody: ' yüklenen ve dönüştürülen dosyalar, indirilip indirilmediklerine bakılmaksızın yüklemeden sonra yirmi dört (24) saat içinde silinir.',
  s7Account: 'Hesap verileri:',
  s7AccountBody: ' hesabınız aktif olduğu sürece saklanır. Hesabınızı sildiğinizde, ilişkili tüm veriler, yasal olarak saklamamız gereken kayıtlar dışında otuz (30) gün içinde kaldırılır.',
  s7Payment: 'Ödeme ve fatura kayıtları:',
  s7PaymentBody: ' vergi ve muhasebe uyumluluğu için § 147 AO (Alman Vergi Kodu) uyarınca on (10) yıl saklanır. Bu süreden sonra veriler geri dönüşü olmayan bir şekilde silinir.',
  s7Logs: 'Sunucu günlükleri:',
  s7LogsBody: ' güvenlik, kötüye kullanım önleme ve olay incelemesi için otuz (30) gün saklanır, ardından otomatik olarak temizlenir.',
  s8Title: '8. GDPR Kapsamındaki Haklarınız',
  s8Intro: 'Hakkınızda işlediğimiz kişisel verilerle ilgili kapsamlı haklarınız vardır:',
  s8Access: 'Erişim hakkı (Madde 15):',
  s8AccessBody: ' verilerinizi işleyip işlemediğimizin onayını ve bu verilerin bir kopyasını talep edebilirsiniz.',
  s8Rect: 'Düzeltme hakkı (Madde 16):',
  s8RectBody: ' yanlış verileri profil sayfanız aracılığıyla doğrudan veya bizimle iletişime geçerek düzeltebilirsiniz.',
  s8Erase: 'Silme hakkı / "unutulma hakkı" (Madde 17):',
  s8EraseBody: ' vergi kayıtları gibi yasal saklama yükümlülüklerine tabi olarak hesabınızın ve tüm ilişkili kişisel verilerin silinmesini talep edebilirsiniz.',
  s8Port: 'Veri taşınabilirliği hakkı (Madde 20):',
  s8PortBody: ' verilerinizin yapılandırılmış, yaygın olarak kullanılan, makine tarafından okunabilir bir formatta bir kopyasını talep edebilirsiniz.',
  s8Restrict: 'İşlemenin kısıtlanması hakkı (Madde 18):',
  s8RestrictBody: ' bir anlaşmazlığı çözerken, bir yanlışlığı düzeltirken veya bir yasal talebi değerlendirirken verilerinizin işlenmesini kısıtlamamızı talep edebilirsiniz.',
  s8Object: 'İtiraz hakkı (Madde 21):',
  s8ObjectBody: ' profilleme dahil meşru menfaat temelinde gerçekleştirilen işlemeye itiraz edebilirsiniz. Çıkarlarınızı geçersiz kılan zorlayıcı meşru gerekçeleri gösteremezsek dururuz.',
  s8Withdraw: 'Rızanızı geri çekme hakkı (Madde 7):',
  s8WithdrawBody: ' rızaya dayalı herhangi bir işleme için, geri çekme öncesi yapılan işlemenin yasallığını etkilemeden istediğiniz zaman geri çekebilirsiniz.',
  s8Outro: 'Bu haklardan herhangi birini kullanmak için hesabınızla ilişkili adresten Support@convertanyformat.com adresine e-posta gönderin. Bir ay içinde yanıtlayacağız, Madde 12 (3) GDPR\'nin izin verdiği şekilde karmaşık talepler için iki ay daha uzatılabilir. Haklarınızı kullanmak ücretsizdir.',
  s9Title: '9. Veri Güvenliği',
  s9Body: 'Kişisel verilerinizi sektörün standart teknik ve organizasyonel önlemlerini kullanarak koruyoruz: aktarımdaki tüm veriler için TLS 1.2+ şifreleme; 10 veya daha yüksek maliyet faktörüne sahip bcrypt parola hashleme; SameSite=Strict özellikli httpOnly oturum çerezleri; denetim kaydı dahil iç erişim için en az ayrıcalık ilkesi; bilinen güvenlik açıklarını ele almak için düzenli bağımlılık güncellemeleri; kötüye kullanımı önlemek için hız sınırlama ve giriş doğrulama; ve tanınmış sertifikalara (ISO 27001, SOC 2) sahip sağlayıcılar tarafından barındırılan altyapı. Haklarınızı ve özgürlüklerinizi etkileyen kişisel veri ihlali durumunda 72 saat içinde yetkili denetim makamına bildiririz ve etkilenen kullanıcılara gereksiz gecikme olmadan, Madde 33-34 GDPR uyarınca bildiririz.',
  s10Title: '10. Uluslararası Veri Aktarımları',
  s10Body: 'Alt-işleyicilerimizden bazıları Avrupa Ekonomik Alanı dışında, esas olarak Amerika Birleşik Devletleri\'nde bulunmaktadır. Bu tür her aktarım için GDPR Bölüm V tarafından gerekli uygun güvenceleri uygulamış bulunuyoruz. Stripe (İrlanda) ve CloudConvert\'e (Almanya) yapılan aktarımlar AEA içinde kalır. Supabase, Railway, Resend ve OpenAI\'a (Amerika Birleşik Devletleri) yapılan aktarımlar Avrupa Komisyonu\'nun Standart Sözleşme Maddeleri (Modül 2: kontrolörden işleyiciye) tarafından yönetilir, aktarım sırasında ve dinlenme halinde şifreleme dahil ek teknik güvencelerle desteklenir. Google LLC ayrıca EU-US Data Privacy Framework altında sertifikalanmıştır ve Madde 45 GDPR anlamında yeterli düzeyde koruma sağlar.',
  s11Title: '11. Çocukların Gizliliği',
  s11Body: 'Hizmet, on altı (16) yaş altındaki çocuklara yönelik değildir ve bu yaşın altındaki çocuklardan bilerek kişisel veri toplamayız. Bir ebeveyn veya yasal vasi iseniz ve 16 yaşından küçük bir çocuğun bize kişisel veri sağladığına inanıyorsanız, lütfen Support@convertanyformat.com adresinden bizimle iletişime geçin ve bu verileri derhal silmek için adımlar atacağız. 16 ile 18 yaş arasındaki kullanıcılar, ikamet ettikleri ülkenin gerektirdiği yerlerde bir ebeveyn veya yasal vasinin onayına sahip olduklarını beyan ederler.',
  s12Title: '12. Bu Gizlilik Politikasındaki Değişiklikler',
  s12Body: 'Uygulamalarımızdaki, kullandığımız teknolojilerdeki, geçerli yasal gereksinimlerdeki veya diğer operasyonel faktörlerdeki değişiklikleri yansıtmak için bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler, yürürlüğe girmesinden en az otuz (30) gün önce kayıtlı e-posta adresinize bildirilecektir. Önemsiz değişiklikler (yazım hatalarının düzeltilmesi, biçimlendirme, açıklayıcı eklemeler) yayınlandıktan sonra yürürlüğe girer. Bu sayfanın üstündeki "Son güncelleme" tarihi, Politikanın en son ne zaman revize edildiğini gösterir. Herhangi bir değişikliğin yürürlük tarihinden sonra Hizmet\'in devam eden kullanımı, revize edilmiş Politikanın kabulünü oluşturur.',
  s13Title: '13. İletişim ve Şikayette Bulunma Hakkı',
  s13Body: 'Veri koruma soruları, GDPR haklarınızı kullanma talepleri veya gizlilikle ilgili herhangi bir endişe için lütfen Support@convertanyformat.com adresine e-posta gönderin. Bir ay içinde yanıt vermeyi hedefliyoruz. Diğer idari veya yargısal tedbirleri etkilemeksizin, Madde 77 GDPR uyarınca yaşadığınız, çalıştığınız veya iddia edilen ihlalin gerçekleştiği AB üye devletinin denetim makamına şikayette bulunma hakkına sahipsiniz. {{brand}} için yetkili denetim makamı Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf\'dur.',
};

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
  let i = scopeEnd - 2;
  while (i > scopeStart && /\s/.test(text[i])) i--;
  const needsLeadingComma = text[i] !== ',' && text[i] !== '{';
  const insertion = `${needsLeadingComma ? ',' : ''}\n  ${keyName}: ${formatObjectLiteral(newObject, '  ')},\n`;
  return text.slice(0, scopeEnd - 1) + insertion + text.slice(scopeEnd - 1);
}

const PAYLOADS = { hu: huPrivacy, el: elPrivacy, tr: trPrivacy };

for (const [lang, privacy] of Object.entries(PAYLOADS)) {
  const block = findLangBlock(content, lang);
  content = replaceTopLevelKey(content, 'privacy', privacy, block.start, block.end);
  console.log(`✔ Updated ${lang}.privacy`);
}

fs.writeFileSync(FILE, content);
console.log('\nPrivacy done for hu/el/tr (final 3 of 7).');
