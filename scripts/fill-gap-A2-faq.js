// Chunk A2 of 4: adds the entire `faq` block to fi/hu/el (Finnish, Hungarian,
// Greek). After this script all 7 secondary languages have FAQ.
//
// Run from repo root:  node scripts/fill-gap-A2-faq.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

// Helper that builds a 43-key FAQ object from positional arrays.
function makeFaq(meta, qs, as) {
  const obj = {
    title: meta.title,
    subtitle: meta.subtitle,
    seoDesc: meta.seoDesc,
  };
  for (let i = 0; i < 20; i++) {
    obj[`q${i + 1}`] = qs[i];
    obj[`a${i + 1}`] = as[i];
  }
  return obj;
}

// =====================================================================
// Finnish (fi)
// =====================================================================
const fiFaq = makeFaq(
  {
    title: 'Usein kysytyt kysymykset',
    subtitle: 'Kaikki, mitä sinun tarvitsee tietää {{brand}}-palvelusta — muunnokset, hinnoittelu, tietoturva, Smart Functions ja muu.',
    seoDesc: 'Usein kysytyt kysymykset {{brand}}-palvelusta. Muunnokset, hinnoittelu, tietoturva, Smart Functions, kielet, palautukset ja yhteystiedot.',
  },
  [
    'Miten muunnos toimii vaihe vaiheelta?',
    'Mitä tiedostomuotoja tuetaan?',
    'Miten kredit-järjestelmä toimii?',
    'Mitä jokainen hintapaketti sisältää ja miten ostan?',
    'Kuinka kauan tiedostoja säilytetään ennen poistamista?',
    'Onko sivusto turvallinen ja GDPR-yhteensopiva?',
    'Mitä tiedostoilleni tapahtuu muunnoksen jälkeen?',
    'Voidaanko tiedostot palauttaa poistamisen jälkeen?',
    'Mikä on suurin tiedostokoko?',
    'Mitä selaimia tuetaan?',
    'Toimiiko se mobiilissa?',
    'Miten peruutan tai saan palautuksen?',
    'Mitä Smart Functions -työkalut ovat?',
    'Mikä on OCR ja milloin minun tulisi käyttää sitä?',
    'Miten Tekstistä puheeksi toimii?',
    'Miten Puheesta tekstiksi toimii?',
    'Miten automaattinen tekstitysgeneraattori toimii?',
    'Mitä kieliä tuetaan?',
    'Miten muutan tiliasetuksiani?',
    'Miten otan yhteyttä tukeen?',
  ],
  [
    'Muunnos on neliosainen prosessi. Ensin vedä ja pudota tiedosto lähetysalueelle tai napsauta selataksesi — useimmat selaimet hyväksyvät jopa 200 Mt tiedostoja. Toiseksi valitse tulostusformaatti pudotusvalikosta (näytämme vain syötteesi kanssa yhteensopivat formaatit). Kolmanneksi säädä halutessasi lisäasetuksia, kuten laatua, resoluutiota tai OCR-kieltä. Neljänneksi napsauta Muunna: lähetämme tiedoston turvallisesti käsittelypalveluntarjoajallemme, vähennämme asianmukaiset kreditit ja palautamme latauslinkin sekunneissa useimmille tiedostoille. Suuremmat videotiedostot voivat kestää muutaman minuutin; voit poistua sivulta ja lähetämme sähköpostia, kun tulos on valmis, jos otat sen käyttöön.',
    'Yli 50 formaattia kuudessa kategoriassa. Asiakirjat: PDF, Word (DOCX, DOC), Excel (XLSX, XLS), PowerPoint (PPTX, PPT), RTF, ODT, HTML. Kuvat: JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO. Ääni: MP3, WAV, FLAC, AAC, OGG, WMA, M4A. Video: MP4, AVI, MOV, MKV, WebM, FLV, WMV. Arkistot: ZIP, RAR, 7Z, TAR, GZ. Lisäksi PDF-työkalut yhdistämiseen, jakamiseen, pakkaamiseen, kääntämiseen, salasanasuojaukseen ja avaamiseen. Täydellinen lista on Työkalut-sivulla; jos et näe yhdistelmääsi, lähetä pyyntö.',
    '{{brand}} käyttää ennakkomaksullista kreditmallia — ei tilauksia, ei toistuvia veloituksia. Jokainen vakiomuunnos maksaa 1 kreditin. Smart Functions hinnoitellaan käytön mukaan: Tekstistä puheeksi maksaa 1 kreditin per 1000 syötemerkkiä (pyöristys ylöspäin), ja Puheesta tekstiksi sekä automaattinen tekstitysgeneraattori maksavat 1 kreditin per 5 minuuttia ääntä tai videota (pyöristys ylöspäin). Epäonnistuneet muunnokset ovat aina ilmaisia. Kreditit eivät vanhene. Voit nähdä saldosi ja koko tapahtumahistorian Kojelaudasta ja ansaita 5 bonuskreditiä jokaisesta ystävästä, joka rekisteröityy suosittelulinkilläsi.',
    'Kolme kreditpakettia: 1 kredit hintaan 0,99 € (kertaluonteiseen muunnokseen), 10 kreditiä hintaan 7,99 € (satunnaiseen käyttöön, ~19 % alennus), ja 30 kreditiä hintaan 20,99 € (tehokäyttäjille, ~30 % alennus). Kaikki hinnat sisältävät 19 % saksalaisen ALV:n. Ostamiseen mene Hinnoittelu-sivulle, napsauta valitsemaasi pakettia ja viimeistele kassalla Stripen kautta — hyväksymme kaikki suuret luotto- ja maksukortit sekä SEPA-suoraveloituksen tuetuissa maissa. Saat verolaskun sähköpostitse heti, ja kreditit ilmestyvät tilillesi sekunneissa.',
    'Sekä lähetetty lähdetiedostosi että muunnettu tulos poistetaan automaattisesti ja pysyvästi 24 tunnin kuluessa lähetyksestä. Poikkeuksia tai manuaalisia jatkoja ei ole — poiston suorittaa automatisoitu puhdistustyö, joka käy jatkuvasti. Poiston jälkeen latauslinkki ei toimi. Emme säilytä kopioita, varmuuskopioita, pikkukuvia tai välimuistiversioita infrastruktuurissamme tai alikäsittelijöillämme. Jos tarvitset muunnetun tiedoston yli 24 tunnin ikkunan, lataa se ja tallenna paikallisesti. Tämä 24 tunnin sääntö tukee GDPR-oikeuttasi tietojen minimointiin.',
    'Kyllä. {{brand}}-palvelua operoidaan Saksasta ja se on täysin GDPR:n alainen. Kaikki tiedonsiirrot käyttävät TLS 1.2:ta tai uudempaa; salasanat hashataan bcryptillä (emme näe tai tallenna selkokielistä salasanaasi); istuntoevästeet ovat httpOnly ja SameSite=Strict-attribuutilla. Olemme allekirjoittaneet tietojenkäsittelysopimukset jokaisen alikäsittelijän kanssa GDPR Art. 28 mukaisesti. Siirrot ETA:n ulkopuolelle perustuvat EU:n vakiosopimuslausekkeisiin tai Googlella EU-US Data Privacy Frameworkiin. Emme koskaan myy tietojasi. Säilytät kaikki GDPR-oikeutesi.',
    'Kun napsautat Muunna, tiedostosi ladataan palvelimellemme ja välitetään sitten salatun yhteyden kautta käsittelypalveluntarjoajallemme — CloudConvert vakiomuunnoksissa ja OpenAI Smart Functionsissa. Palveluntarjoaja suorittaa vain pyytämäsi muunnoksen ja palauttaa tuloksen. Emme käytä, lue, analysoi tai jaa tiedostojesi sisältöä mihinkään muuhun tarkoitukseen koskaan. Molemmat tiedostot (syöte ja tuloste) poistetaan palvelimiltamme ja alikäsittelijöiden välimuistista 24 tunnin kuluessa. Stripe ei näe tiedostosisältöäsi; vain maksumetatietoja.',
    'Ei. Poisto on pysyvä ja peruuttamaton. Emme ylläpidä käyttäjätiedostojen varmuuskopioita (tietokantakopiot eivät sisällä tiedostodataa tarkoituksella). Kun 24 tunnin ikkuna umpeutuu, tiedostot poistetaan ensisijaisesta tallennuksesta ja varmuuskopioista minuuteissa. Tämä on tahallinen suunnitteluratkaisu: se minimoi tietojen altistumisen, tukee GDPR:n erääntymisoikeutta Art. 17 mukaisesti ja antaa lupauksen, ettei kolmas osapuoli voi haastaa vanhoja tiedostoja, joita meillä ei enää ole. Lataa muunnetut tiedostosi aina 24 tunnin sisällä.',
    'Vakiomuunnokset hyväksyvät jopa 200 Mt tiedostoja. Smart Functions -työkalut (OCR, Tekstistä puheeksi, Puheesta tekstiksi, automaattinen tekstitysgeneraattori) on rajoitettu 25 Mt:iin tiedostoa kohti, koska se on OpenAI API:n asettama kova raja. Jos tiedostosi ylittää nämä rajat, voit jakaa sen paikallisesti (useimmat videoeditorit ja ffmpeg-komentorivityökalu osaavat tehdä tämän), muuntaa kunkin osan erikseen ja yhdistää jälkeenpäin. Erittäin suurille yritystarpeille — toistuvalle monen gigatavun transkoodaukselle, eräajolle tai suuremmille rate-rajoille — ota yhteyttä Support@convertanyformat.com.',
    'Kaikki nykyaikaiset selaimet, jotka on päivitetty viimeisen kahden vuoden aikana: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, sekä useimmat mobiiliselaimet kuten Samsung Internet, Opera ja Brave. JavaScript ja evästeet on oltava käytössä. Puheesta tekstiksi -mikrofonin tallennusominaisuus vaatii selaimen mikrofoniluvan, kun sitä pyydetään. Emme virallisesti tue Internet Exploreria tai selaimia, jotka eivät ole saaneet tietoturvapäivityksiä yli kahteen vuoteen; sivusto saattaa silti toimia, mutta emme voi taata oikeaa toimintaa.',
    'Kyllä — {{brand}} on täysin mobiilioptimoitu. Käyttöliittymä mukautuu puhelinnäyttöihin 320 pikselistä alkaen, työkalukortit näkyvät mukavassa 2-sarakkeisessa ruudukossa pienillä näytöillä, ja jokainen ominaisuus mukaan lukien lähetys, muunnos, lataus ja Smart Functions toimii iOS Safarissa ja Android Chromessa. Äänen voit nauhoittaa suoraan puhelimen mikrofonista käyttäen sivuston nauhuria sen sijaan, että lataisit tiedoston. Sivusto on myös asennettavissa Progressive Web Appiksi, joten voit lisätä sen aloitusnäytöllesi.',
    'Toistuvia tilauksia ei ole, joten peruutettavaa ei ole — kreditit ovat kertaluonteisia ennakkomaksuostoja, jotka eivät vanhene. Pyytääksesi palautusta käyttämättömistä krediteistä, lähetä sähköpostia osoitteeseen Support@convertanyformat.com tilisi sähköpostista 14 päivän kuluessa ostosta saksalaisen Fernabsatzgesetz-lain mukaisesti. Palautukset käsitellään 5–10 työpäivän kuluessa alkuperäiseen maksutapaan. Käytetyt kreditit ovat yleensä palautuskelvottomia, mutta jos muunnos epäonnistui meidän vuoksemme, mainitse se viestissäsi. Tilisi voit poistaa Profiili → Vaarallinen alue.',
    'Smart Functions ovat tekoälypohjaisia työkaluja, jotka menevät pelkkää formaattimuunnosta pidemmälle. Nykyinen valikoima: OCR (poimii muokattavaa tekstiä skannatuista PDF-tiedostoista ja kuvista), PDF-pakkaus tekoälyllä (vähentää PDF-tiedostokokoa älykkäästi säilyttäen luettavuuden), Tekstistä puheeksi (luo luonnolliselta kuulostavaa MP3-, OPUS- tai AAC-ääntä OpenAI TTS-1:n avulla), Puheesta tekstiksi (transkriboi äänen TXT- tai DOCX-muotoon OpenAI Whisperin avulla), ja automaattinen tekstitysgeneraattori (luo ajoitettuja SRT- tai VTT-tekstitystiedostoja videosta). Nämä työkalut laskutetaan käytön mukaan.',
    'OCR (optinen merkintunnistus) poimii muokattavaa tekstiä tekstin kuvista. Käytä sitä aina kun sinulla on skannattu PDF, valokuva painetusta asiakirjasta tai kuva, jossa näytön teksti ei ole valittavissa. {{brand}}:n OCR palauttaa joko haettavissa olevan PDF:n (säilyttää alkuperäisen ulkoasun ja lisää näkymättömän tekstikerroksen alle, jotta käyttäjät voivat hakea ja kopioida tekstiä) tai pelkän tekstitiedoston. Yleisiä käyttötapauksia: paperiasiakirjojen digitalisointi arkistointiin, vanhojen PDF-arkistojen hakeminen, lainausten poimiminen kuvakaappauksista.',
    'Kirjoita tai liitä jopa 4096 merkkiä tekstilaatikkoon, valitse yksi kuudesta äänestä (Alloy on neutraali; Echo on lämmin ja maskuliininen; Fable on brittikorostuksella ja ilmaisuvoimainen; Onyx on syvä ja arvovaltainen; Nova on ystävällinen ja selkeä; Shimmer on pehmeä ja lempeä), valitse toistonopeus (0,75x, 1,0x, 1,25x tai 1,5x), valitse tulostusformaatti (MP3, OPUS tai AAC) ja napsauta Muunna. Sekunneissa saat latauslinkin luonnolliselta kuulostavaan äänitiedostoon. Ominaisuus käyttää OpenAI TTS-1 -mallia. Hinta on 1 kredit per 1000 merkkiä, pyöristys ylöspäin.',
    'Lähetä äänitiedosto (MP3, WAV, M4A, OGG, MP4, WebM) jopa 25 Mt, ja transkriboimme sen käyttäen OpenAI Whisperia — samaa moottoria, joka tukee monia ammattimaisia transkriptiopalveluja. Valitse TXT (pelkkä teksti) ja DOCX (Microsoft Word) -tulosteen välillä. Voit myös nauhoittaa suoraan mikrofonista sisäänrakennetulla nauhurilla. Jos tiedät puhutun kielen, voit antaa valinnaisen kielivihjeen tarkkuuden parantamiseksi. Hinta on 1 kredit per 5 minuuttia ääntä, pyöristys ylöspäin. Transkriptio näytetään sivulla, jotta voit tarkistaa sen ennen lataamista.',
    'Lähetä videotiedosto (MP4, MOV, AVI, MKV) jopa 25 Mt. Erotamme äänen tarvittaessa (käyttäen CloudConvertia ei-MP4-konteille) ja transkriboimme sen OpenAI Whisperin kautta käyttäen aikaleima-tietoista vastausmuotoa. Tulos on ammattimainen SRT- tai VTT-tekstitystiedosto, joka on valmis YouTubeen, Vimeoon, Premiereen, Final Cutiin tai mihin tahansa videoeditoriin. Valinnainen kielivihje parantaa tarkkuutta. Hinta on 1 kredit per 5 minuuttia videota, pyöristys ylöspäin. Tuloste käyttää standardiajoituskäytäntöjä, joten se toimii kaikkien yleisten tekstityssoittimien kanssa.',
    '{{brand}}-käyttöliittymä on käännetty 17 eurooppalaiselle kielelle: englanti, saksa, ranska, espanja, italia, portugali, hollanti, puola, ruotsi, norja, tanska, suomi, tšekki, romania, unkari, kreikka ja turkki. Vaihda kieltä milloin tahansa navigointipalkin pudotusvalikosta — valintasi muistetaan tulevia käyntejä varten. Smart Functionsille: OpenAI Whisper tukee puheentunnistusta yli 50 kielellä; OpenAI TTS tuottaa luonnollista puhetta yli 30 kielellä; OCR toimii englanniksi, saksaksi, ranskaksi, espanjaksi, italiaksi, portugaliksi, kiinaksi, japaniksi ja koreaksi.',
    'Napsauta nimeäsi navigointipalkissa päästäksesi Profiili-sivullesi. Sieltä voit päivittää sähköpostiosoitteesi (vahvistussähköposti lähetetään uuteen osoitteeseen ennen muutoksen voimaantuloa), asettaa tai vaihtaa näyttönimen, vaihtaa salasanan (tarvitset nykyisen), määrittää sähköposti-ilmoitusten asetukset, tarkastella muunnoshistoriaa ja kreditsaldoa, luoda tai vaihtaa API-avaimen integraatioita varten, löytää suosittelukoodisi ja — sivun alaosassa Vaarallinen alue -osiossa — poistaa tilisi pysyvästi. Tilin poisto poistaa kaikki tähän liittyvät tiedot 30 päivän kuluessa.',
    'Lähetä meille sähköpostia milloin tahansa osoitteeseen Support@convertanyformat.com. Pyrimme vastaamaan 24 tunnin kuluessa työpäivinä ja 48 tunnin kuluessa viikonloppuisin. Tietosuojakysymyksiin (GDPR-oikeudet, poistopyynnöt, valitukset) käytä samaa sähköpostia ja mainitse "Datenschutz" tai "GDPR" otsikossa — ne reititetään etusijalla. Voit myös käyttää /contact-sivun yhteydenottolomaketta. Emme tarjoa puhelintukea, mutta järjestämme mielellämme videopuhelun yritystiedusteluille tai kumppanuuskeskusteluille; mainitse tämä alkuperäisessä sähköpostissasi.',
  ]
);

// =====================================================================
// Hungarian (hu)
// =====================================================================
const huFaq = makeFaq(
  {
    title: 'Gyakran ismételt kérdések',
    subtitle: 'Minden, amit tudnod kell a {{brand}}-ról — átalakítások, árazás, biztonság, Smart Functions és több.',
    seoDesc: 'Gyakran ismételt kérdések a {{brand}}-ról. Átalakítások, árazás, biztonság, Smart Functions, nyelvek, visszatérítések és kapcsolat.',
  },
  [
    'Hogyan működik az átalakítás lépésről lépésre?',
    'Milyen fájlformátumokat támogat?',
    'Hogyan működik a kreditrendszer?',
    'Mit tartalmaz minden árcsomag és hogyan vásárolhatok?',
    'Mennyi ideig tárolódnak a fájlok törlés előtt?',
    'Biztonságos és GDPR-kompatibilis a webhely?',
    'Mi történik a fájljaimmal az átalakítás után?',
    'Visszaállíthatók a fájlok törlés után?',
    'Mi a maximális fájlméret?',
    'Mely böngészőket támogatja?',
    'Működik mobilon?',
    'Hogyan mondhatom le vagy kérhetek visszatérítést?',
    'Mik a Smart Functions eszközök?',
    'Mi az OCR és mikor érdemes használni?',
    'Hogyan működik a Szöveg-beszéd átalakítás?',
    'Hogyan működik a Beszéd-szöveg átalakítás?',
    'Hogyan működik az automatikus feliratgenerátor?',
    'Mely nyelveket támogatja?',
    'Hogyan változtathatom meg a fiókbeállításaimat?',
    'Hogyan léphetek kapcsolatba az ügyfélszolgálattal?',
  ],
  [
    'Az átalakítás négylépéses folyamat. Először húzd és ejtsd a fájlt a feltöltési területre, vagy kattints a tallózáshoz — a legtöbb böngésző elfogad 200 MB-ig terjedő fájlokat. Másodszor válaszd ki a kimeneti formátumot a legördülő menüből (csak a bemeneteddel kompatibilis formátumokat mutatjuk). Harmadszor opcionálisan állítsd be a haladó beállításokat, mint a minőség, felbontás vagy OCR nyelv. Negyedszer kattints az Átalakítás gombra: biztonságosan elküldjük a fájlt a feldolgozó szolgáltatónknak, levonjuk a megfelelő krediteket, és másodperceken belül letöltési linket adunk vissza a legtöbb fájlhoz. A nagyobb videofájlok eltarthatnak néhány percig.',
    'Több mint 50 formátum hat kategóriában. Dokumentumok: PDF, Word (DOCX, DOC), Excel (XLSX, XLS), PowerPoint (PPTX, PPT), RTF, ODT, HTML. Képek: JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO. Hang: MP3, WAV, FLAC, AAC, OGG, WMA, M4A. Videó: MP4, AVI, MOV, MKV, WebM, FLV, WMV. Archívumok: ZIP, RAR, 7Z, TAR, GZ. Plusz dedikált PDF eszközök egyesítéshez, felosztáshoz, tömörítéshez, forgatáshoz, jelszóvédelemhez és feloldáshoz. A teljes támogatott átalakítási kombinációk listája az Eszközök oldalon van; ha nem találod a kombinációd, küldj kérést.',
    'A {{brand}} előre fizetett kreditmodellt használ — nincs előfizetés, nincs ismétlődő díj. Minden szabványos átalakítás 1 kreditbe kerül. A Smart Functions használat alapján van árazva: a Szöveg-beszéd 1 kredit per 1000 bemeneti karakter (felfelé kerekítve), a Beszéd-szöveg és az automatikus feliratgenerátor pedig 1 kredit per 5 perc hang vagy videó (felfelé kerekítve). A sikertelen átalakítások mindig ingyenesek. A kreditek soha nem járnak le. Az egyenleget és teljes tranzakciótörténetet a műszerfalon láthatod, és 5 bónusz kreditet szerezhetsz minden barátért, aki regisztrál az ajánlólinkeddel.',
    'Három kreditcsomag: 1 kredit 0,99 €-ért (egyszeri átalakításhoz), 10 kredit 7,99 €-ért (alkalmi használathoz, ~19 % kedvezmény), és 30 kredit 20,99 €-ért (nagy felhasználóknak, ~30 % kedvezmény). Minden ár tartalmazza a 19 % német áfát. Vásárláshoz látogasd meg az Árak oldalt, kattints a választott csomagra, és fejezd be a fizetést Stripe-on keresztül — minden fő hitel- és bankkártyát elfogadunk, valamint SEPA-direkt befizetést a támogatott helyeken. Az adóköteles számlát azonnal e-mailben megkapod, és a kreditek másodperceken belül megjelennek a fiókodban.',
    'A feltöltött forrásfájl és az átalakított kimenet automatikusan és véglegesen törlődik a feltöltéstől számított 24 órán belül. Nincsenek kivételek és nincsenek manuális hosszabbítások — a törlést egy folyamatosan futó automatizált tisztítási feladat hajtja végre. Törlés után a letöltési link nem működik. Nem tartunk fenn másolatokat, biztonsági mentéseket, miniatűröket vagy gyorsítótárazott verziókat sem az infrastruktúránkban, sem az alvállalkozóinknál. Ha 24 órán túl szükséged van az átalakított fájlra, töltsd le és tárold helyileg. Ez a 24 órás szabály támogatja a GDPR adatminimalizálási jogodat.',
    'Igen. A {{brand}}-ot Németországból üzemeltetjük és teljes mértékben a GDPR hatálya alá tartozik. Minden adatátvitel TLS 1.2-t vagy újabbat használ; a jelszavakat bcrypttel hasheljük (soha nem látjuk vagy tároljuk a sima szöveges jelszavadat); a munkamenet sütik httpOnly és SameSite=Strict attribútumúak. Adatfeldolgozási megállapodásokat írtunk alá minden alvállalkozóval a GDPR 28. cikke szerint. Az EGT-n kívüli átvitelek az EU szabványos szerződéses záradékaira vagy a Google esetében az EU-US Data Privacy Frameworkre támaszkodnak. Soha nem adjuk el az adataidat. Megőrzöd minden GDPR jogodat.',
    'Amikor az Átalakítás gombra kattintasz, a fájlod feltöltődik a szerverünkre, majd titkosított kapcsolaton keresztül továbbítódik a feldolgozó szolgáltatónknak — CloudConvert szabványos formátumátalakításokhoz és OpenAI Smart Functionshöz. A szolgáltató csak a kért átalakítást hajtja végre és visszaadja az eredményt. Soha nem férünk hozzá, olvassuk, elemezzük vagy osszuk meg a fájljaid tartalmát semmilyen más célból. Mindkét fájl (bemenet és kimenet) eltávolításra kerül a szervereinkről és az alvállalkozók gyorsítótáraiból 24 órán belül. A Stripe nem látja a fájl tartalmát; csak a fizetési metaadatokat.',
    'Nem. A törlés végleges és visszafordíthatatlan. Nem tartunk fenn felhasználói fájlok biztonsági mentéseit (az adatbázis-mentések szándékosan kizárják a fájladatokat). Miután a 24 órás ablak lejár, a fájlok eltávolításra kerülnek az elsődleges tárolásból és a biztonsági mentésekből perceken belül. Ez szándékos tervezés: minimalizálja az adatkitettséget, támogatja a GDPR 17. cikke szerinti törlési jogot, és lehetővé teszi, hogy senki ne tudjon idézést kérni régi fájlokra, amik már nincsenek nálunk. Mindig töltsd le az átalakított fájlokat 24 órán belül.',
    'A szabványos formátumátalakítások 200 MB-ig fogadnak el fájlokat. A Smart Functions eszközök (OCR, Szöveg-beszéd, Beszéd-szöveg, automatikus feliratgenerátor) fájlonként 25 MB-ra korlátozódnak, mert ez az OpenAI API által szabott kemény korlát. Ha a fájlod meghaladja ezeket, először helyileg feloszthatod (a legtöbb videószerkesztő és az ffmpeg parancssoros eszköz képes erre), átalakíthatod minden részt külön-külön, majd egyesítheted utána. Nagyon nagy vállalati igényekre — ismétlődő több gigabájtos átkódolásra, kötegelt feldolgozásra vagy magasabb rate-korlátokra — vegye fel a kapcsolatot a Support@convertanyformat.com címen.',
    'Minden modern böngésző, amelyet az elmúlt két évben frissítettek: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, plusz a legtöbb mobil böngésző, beleértve a Samsung Internetet, Operát és Brave-t. A JavaScript és a sütik engedélyezve kell, hogy legyenek. A Beszéd-szöveg mikrofonos felvételhez engedélyezned kell a böngésző mikrofonengedélyét, amikor kéri. Hivatalosan nem támogatjuk az Internet Explorert vagy olyan böngészőket, amelyek több mint két éve nem kaptak biztonsági frissítést; az oldal még működhet, de nem tudjuk garantálni a megfelelő viselkedést.',
    'Igen — a {{brand}} teljesen mobilra optimalizált. A felhasználói felület 320 px-től felfelé alkalmazkodik a telefonképernyőkhöz, az eszközkártyák kényelmes 2 oszlopos rácsban jelennek meg kis képernyőkön, és minden funkció — beleértve a feltöltést, átalakítást, letöltést és Smart Functions-t — működik iOS Safarin és Android Chrome-on. Hangra felvehetsz közvetlenül a telefon mikrofonjáról az oldali rögzítővel ahelyett, hogy fájlt töltenél fel. Az oldal Progressive Web Appként is telepíthető, így hozzáadhatod a kezdőképernyődhöz és natív alkalmazásként indíthatod.',
    'Nincsenek ismétlődő előfizetések, így nincs mit lemondani — a kreditek egyszeri előre fizetett vásárlások, amelyek soha nem járnak le. A felhasználatlan kreditek visszatérítéséhez küldj e-mailt a Support@convertanyformat.com-ra a fiókod e-mail címéről a vásárlástól számított 14 napon belül a német Fernabsatzgesetz szerint. A visszatérítések 5–10 munkanapon belül kerülnek feldolgozásra az eredeti fizetési módra. A felhasznált kreditek általában nem visszatéríthetők, de ha az átalakítás a mi hibánk miatt sikertelen volt, említsd meg az üzenetedben. A fiókod teljes törléséhez látogasd meg a Profil oldaladat és használd a Veszélyzónát.',
    'A Smart Functions AI-vezérelt eszközök, amelyek a tiszta formátumátalakításon túlmutatnak. Jelenlegi kínálat: OCR (szerkeszthető szöveget von ki szkennelt PDF-ekből és képekből), PDF-tömörítés AI-vel (intelligensen csökkenti a PDF-fájlméretet az olvashatóság megőrzése mellett), Szöveg-beszéd (természetesen hangzó MP3, OPUS vagy AAC hangot generál OpenAI TTS-1 használatával), Beszéd-szöveg (TXT vagy DOCX-be transzkribál OpenAI Whisper használatával), és az automatikus feliratgenerátor (időzített SRT vagy VTT feliratfájlokat hoz létre videóból). Ezek az eszközök használat szerint vannak számlázva.',
    'Az OCR (optikai karakterfelismerés) szerkeszthető szöveget von ki a szöveg képeiből. Használd, amikor szkennelt PDF-ed van, fényképed egy nyomtatott dokumentumról, vagy bármilyen kép, ahol a képernyőn lévő szöveg nem választható ki. A {{brand}} OCR-je vagy kereshető PDF-et (megőrzi az eredeti elrendezést láthatatlan szövegréteggel alatta, így a felhasználók kereshetnek és másolhatnak szöveget) vagy egyszerű szövegfájlt ad vissza. Gyakori felhasználási esetek: papíralapú dokumentumok digitalizálása archiváláshoz, régi PDF-archívumok kereshetővé tétele, idézetek kivonása képernyőképekből.',
    'Írj vagy illessz be akár 4096 karaktert a szövegdobozba, válassz a hat hang közül (Alloy semleges; Echo meleg és férfias; Fable brit akcentussal és kifejező; Onyx mély és tekintélyes; Nova barátságos és tiszta; Shimmer puha és lágy), válassz lejátszási sebességet (0,75x, 1,0x, 1,25x vagy 1,5x), válaszd ki a kimeneti formátumot (MP3, OPUS vagy AAC), és kattints az Átalakítás gombra. Másodperceken belül letöltési linket kapsz egy természetesen hangzó hangfájlhoz. A funkció az OpenAI TTS-1 modellje hajtja. Költsége 1 kredit per 1000 karakter, felfelé kerekítve.',
    'Tölts fel egy hangfájlt (MP3, WAV, M4A, OGG, MP4, WebM) akár 25 MB-ig, és átírjuk az OpenAI Whisper segítségével — ugyanaz a motor, amely sok professzionális átírási szolgáltatást hajt. Válassz a TXT (egyszerű szöveg) és DOCX (Microsoft Word) kimenet között. Közvetlenül is felvehetsz a mikrofonodról a beépített rögzítővel. Ha tudod, melyik nyelv beszél, opcionális nyelvi tippet adhatsz a pontosság javítása érdekében. Költsége 1 kredit per 5 perc hang, felfelé kerekítve. Az átirat megjelenik az oldalon, hogy átnézhesd letöltés előtt.',
    'Tölts fel egy videofájlt (MP4, MOV, AVI, MKV) akár 25 MB-ig. Szükség esetén kivonjuk a hangsávot (CloudConvert használatával nem-MP4 konténereknél), majd OpenAI Whisperen keresztül átírjuk időbélyeg-tudatos válaszformátum használatával. Az eredmény egy professzionális SRT vagy VTT feliratfájl, amely készen áll a YouTube-ra, Vimeo-ra, Premiere-re, Final Cutra vagy bármilyen videószerkesztőre. Az opcionális nyelvi tipp javítja a pontosságot. Költsége 1 kredit per 5 perc videó, felfelé kerekítve. A kimenet szabványos időzítési konvenciókat használ, így minden gyakori feliratlejátszóval működik.',
    'A {{brand}} felhasználói felület 17 európai nyelvre van fordítva: angol, német, francia, spanyol, olasz, portugál, holland, lengyel, svéd, norvég, dán, finn, cseh, román, magyar, görög és török. Bármikor válthatsz nyelvet a navigációs sávban lévő legördülő menüvel — a választásod megőrződik a jövőbeli látogatásokra. A Smart Functionshöz: az OpenAI Whisper több mint 50 nyelven támogatja a beszédfelismerést; az OpenAI TTS természetes beszédet hoz létre több mint 30 nyelven; az OCR angolul, németül, franciául, spanyolul, olaszul, portugálul, kínaiul, japánul és koreaiul működik.',
    'Kattints a navigációs sávban a nevedre, hogy elérd a Profil oldaladat. Onnan frissítheted az e-mail címedet (megerősítő e-mailt küldünk az új címre a változás életbe lépése előtt), beállíthatsz vagy megváltoztathatsz megjelenített nevet, megváltoztathatod a jelszót (szükséged van a jelenlegire), beállíthatod az e-mail értesítési preferenciákat, megtekintheted az átalakítási előzményeket és kreditegyenleget, generálhatsz vagy forgathatsz API kulcsot integrációkhoz, megtalálhatod az ajánlókódodat, és — az oldal alján a Veszélyzónában — véglegesen törölheted a fiókodat. A fiók törlése 30 napon belül eltávolítja az összes kapcsolódó adatot.',
    'Küldj nekünk e-mailt bármikor a Support@convertanyformat.com címre. Munkanapokon 24 órán belül, hétvégén 48 órán belül igyekszünk válaszolni. Adatvédelmi kérdésekhez (GDPR jogok, törlési kérelmek, panaszok) használd ugyanazt az e-mailt és említsd meg a "Datenschutz" vagy "GDPR" szót a tárgyban — ezek prioritással kerülnek továbbításra. A /contact oldalon található kapcsolatfelvételi űrlapot is használhatod. Jelenleg nem kínálunk telefonos támogatást, de szívesen szervezünk videohívást vállalati megkeresésekhez vagy partnerségi megbeszélésekhez; ezt említsd meg a kezdeti e-mailedben.',
  ]
);

// =====================================================================
// Greek (el)
// =====================================================================
const elFaq = makeFaq(
  {
    title: 'Συχνές ερωτήσεις',
    subtitle: 'Όλα όσα πρέπει να γνωρίζετε για το {{brand}} — μετατροπές, τιμολόγηση, ασφάλεια, Smart Functions και άλλα.',
    seoDesc: 'Συχνές ερωτήσεις σχετικά με το {{brand}}. Μετατροπές, τιμολόγηση, ασφάλεια, Smart Functions, γλώσσες, επιστροφές χρημάτων και επικοινωνία.',
  },
  [
    'Πώς λειτουργεί η μετατροπή βήμα προς βήμα;',
    'Ποιες μορφές αρχείων υποστηρίζονται;',
    'Πώς λειτουργεί το σύστημα κρεντίτ;',
    'Τι περιλαμβάνει κάθε πακέτο τιμολόγησης και πώς αγοράζω;',
    'Για πόσο διάστημα αποθηκεύονται τα αρχεία πριν διαγραφούν;',
    'Είναι ο ιστότοπος ασφαλής και συμβατός με GDPR;',
    'Τι συμβαίνει με τα αρχεία μου μετά τη μετατροπή;',
    'Μπορούν τα αρχεία να ανακτηθούν μετά τη διαγραφή;',
    'Ποιο είναι το μέγιστο μέγεθος αρχείου;',
    'Ποιοι περιηγητές υποστηρίζονται;',
    'Λειτουργεί σε κινητό;',
    'Πώς ακυρώνω ή λαμβάνω επιστροφή χρημάτων;',
    'Τι είναι τα εργαλεία Smart Functions;',
    'Τι είναι το OCR και πότε πρέπει να το χρησιμοποιήσω;',
    'Πώς λειτουργεί το Κείμενο σε Ομιλία;',
    'Πώς λειτουργεί το Ομιλία σε Κείμενο;',
    'Πώς λειτουργεί η Αυτόματη Δημιουργία Υποτίτλων;',
    'Ποιες γλώσσες υποστηρίζονται;',
    'Πώς αλλάζω τις ρυθμίσεις του λογαριασμού μου;',
    'Πώς επικοινωνώ με την υποστήριξη;',
  ],
  [
    'Η μετατροπή είναι μια διαδικασία τεσσάρων βημάτων. Πρώτον, σύρετε και αποθέστε το αρχείο σας στην περιοχή μεταφόρτωσης ή κάντε κλικ για περιήγηση — οι περισσότεροι περιηγητές δέχονται αρχεία έως 200 MB. Δεύτερον, επιλέξτε τη μορφή εξόδου από το αναπτυσσόμενο μενού (εμφανίζουμε μόνο μορφές συμβατές με την είσοδό σας). Τρίτον, προαιρετικά προσαρμόστε τις προηγμένες ρυθμίσεις όπως ποιότητα, ανάλυση ή γλώσσα OCR. Τέταρτον, κάντε κλικ στο Μετατροπή: στέλνουμε το αρχείο με ασφάλεια στον πάροχο επεξεργασίας μας, αφαιρούμε τα κατάλληλα κρεντίτ και επιστρέφουμε σύνδεσμο λήψης μέσα σε δευτερόλεπτα για τα περισσότερα αρχεία.',
    'Πάνω από 50 μορφές σε έξι κατηγορίες. Έγγραφα: PDF, Word (DOCX, DOC), Excel (XLSX, XLS), PowerPoint (PPTX, PPT), RTF, ODT, HTML. Εικόνες: JPG, PNG, WebP, HEIC, SVG, BMP, TIFF, GIF, ICO. Ήχος: MP3, WAV, FLAC, AAC, OGG, WMA, M4A. Βίντεο: MP4, AVI, MOV, MKV, WebM, FLV, WMV. Αρχεία: ZIP, RAR, 7Z, TAR, GZ. Συν αποκλειστικά εργαλεία PDF για συνένωση, διαχωρισμό, συμπίεση, περιστροφή, προστασία με κωδικό και ξεκλείδωμα. Η πλήρης λίστα κάθε υποστηριζόμενου συνδυασμού μετατροπής είναι στη σελίδα Εργαλεία.',
    'Το {{brand}} χρησιμοποιεί προπληρωμένο μοντέλο κρεντίτ — χωρίς συνδρομές, χωρίς επαναλαμβανόμενες χρεώσεις. Κάθε τυπική μετατροπή κοστίζει 1 κρεντίτ. Τα Smart Functions τιμολογούνται ανά χρήση: το Κείμενο σε Ομιλία κοστίζει 1 κρεντίτ ανά 1000 χαρακτήρες εισόδου (στρογγυλοποίηση προς τα πάνω) και το Ομιλία σε Κείμενο και η Αυτόματη Δημιουργία Υποτίτλων κοστίζουν 1 κρεντίτ ανά 5 λεπτά ήχου ή βίντεο (στρογγυλοποίηση προς τα πάνω). Οι αποτυχημένες μετατροπές είναι πάντα δωρεάν. Τα κρεντίτ δεν λήγουν ποτέ. Μπορείτε να δείτε το υπόλοιπό σας και το πλήρες ιστορικό συναλλαγών στον Πίνακα Ελέγχου.',
    'Τρία πακέτα κρεντίτ: 1 κρεντίτ για 0,99 € (για μεμονωμένη μετατροπή), 10 κρεντίτ για 7,99 € (για περιστασιακή χρήση, ~19 % έκπτωση), και 30 κρεντίτ για 20,99 € (για χρήστες υψηλής χρήσης, ~30 % έκπτωση). Όλες οι τιμές περιλαμβάνουν 19 % γερμανικό ΦΠΑ. Για να αγοράσετε, επισκεφτείτε τη σελίδα Τιμολόγηση, κάντε κλικ στο επιλεγμένο πακέτο και ολοκληρώστε την πληρωμή μέσω Stripe — δεχόμαστε όλες τις μεγάλες πιστωτικές και χρεωστικές κάρτες καθώς και SEPA Direct Debit όπου υποστηρίζεται. Θα λάβετε τιμολόγιο με ΦΠΑ μέσω email αμέσως, και τα κρεντίτ εμφανίζονται στον λογαριασμό σας μέσα σε δευτερόλεπτα.',
    'Τόσο το αρχείο πηγής που μεταφορτώσατε όσο και η μετατρεπόμενη έξοδος διαγράφονται αυτόματα και οριστικά εντός 24 ωρών από τη μεταφόρτωση. Δεν υπάρχουν εξαιρέσεις και μη αυτόματες παρατάσεις — η διαγραφή επιβάλλεται από μια αυτοματοποιημένη εργασία καθαρισμού που εκτελείται συνεχώς. Μετά τη διαγραφή ο σύνδεσμος λήψης σταματά να λειτουργεί. Δεν διατηρούμε αντίγραφα, αντίγραφα ασφαλείας, μικρογραφίες ή αποθηκευμένες εκδόσεις στην υποδομή μας ή με τους υποεπεξεργαστές μας. Εάν χρειάζεστε ένα μετατρεπόμενο αρχείο πέραν του παραθύρου των 24 ωρών, παρακαλούμε κατεβάστε το και αποθηκεύστε το τοπικά.',
    'Ναι. Το {{brand}} λειτουργεί από τη Γερμανία και υπόκειται πλήρως στον GDPR. Όλες οι μεταφορές δεδομένων χρησιμοποιούν TLS 1.2 ή υψηλότερο· οι κωδικοί πρόσβασης κατακερματίζονται με bcrypt (δεν βλέπουμε ποτέ ή αποθηκεύουμε τον απλό κωδικό σας)· τα cookies συνεδρίας είναι httpOnly με το χαρακτηριστικό SameSite=Strict. Έχουμε υπογράψει Συμφωνίες Επεξεργασίας Δεδομένων με κάθε υποεπεξεργαστή σύμφωνα με το Άρθρο 28 GDPR. Οι μεταφορές εκτός ΕΟΧ βασίζονται σε τυποποιημένες συμβατικές ρήτρες της ΕΕ ή για τη Google στο πλαίσιο EU-US Data Privacy Framework. Ποτέ δεν πουλάμε τα δεδομένα σας. Διατηρείτε όλα τα δικαιώματα GDPR.',
    'Όταν κάνετε κλικ στο Μετατροπή το αρχείο σας μεταφορτώνεται στον διακομιστή μας και στη συνέχεια προωθείται μέσω κρυπτογραφημένης σύνδεσης στον πάροχο επεξεργασίας μας — CloudConvert για τυπικές μετατροπές μορφής και OpenAI για Smart Functions. Ο πάροχος εκτελεί μόνο τη μετατροπή που ζητήσατε και επιστρέφει το αποτέλεσμα. Δεν αποκτούμε ποτέ πρόσβαση, διαβάζουμε, αναλύουμε ή μοιραζόμαστε το περιεχόμενο των αρχείων σας για κανέναν άλλο σκοπό. Και τα δύο αρχεία (είσοδος και έξοδος) αφαιρούνται από τους διακομιστές μας και από τις προσωρινές μνήμες των υποεπεξεργαστών εντός 24 ωρών. Το Stripe δεν βλέπει ποτέ το περιεχόμενο των αρχείων σας.',
    'Όχι. Η διαγραφή είναι οριστική και μη αναστρέψιμη. Δεν διατηρούμε αντίγραφα ασφαλείας των αρχείων χρηστών (τα αντίγραφα ασφαλείας βάσης δεδομένων εξαιρούν σκόπιμα τα δεδομένα αρχείων). Μόλις λήξει το παράθυρο των 24 ωρών, τα αρχεία αφαιρούνται από την κύρια αποθήκευση και από τα στιγμιότυπα ασφαλείας μέσα σε λεπτά. Αυτό είναι ηθελημένος σχεδιασμός: ελαχιστοποιεί την έκθεση των δεδομένων σας, υποστηρίζει το δικαίωμα διαγραφής σύμφωνα με το Άρθρο 17 GDPR και μας επιτρέπει να υποσχόμαστε ότι κανένας τρίτος δεν μπορεί να ζητήσει παλιά αρχεία που δεν έχουμε πλέον.',
    'Οι τυπικές μετατροπές μορφής δέχονται αρχεία έως 200 MB το καθένα. Τα εργαλεία Smart Functions (OCR, Κείμενο σε Ομιλία, Ομιλία σε Κείμενο, Αυτόματη Δημιουργία Υποτίτλων) περιορίζονται σε 25 MB ανά αρχείο επειδή αυτό είναι το όριο που επιβάλλει το API του OpenAI. Εάν το αρχείο σας υπερβαίνει αυτά τα όρια, μπορείτε να το χωρίσετε τοπικά πρώτα (οι περισσότεροι επεξεργαστές βίντεο και το εργαλείο γραμμής εντολών ffmpeg μπορούν να το κάνουν), να μετατρέψετε κάθε κομμάτι ξεχωριστά και στη συνέχεια να τα συγχωνεύσετε. Για πολύ μεγάλες επιχειρηματικές ανάγκες επικοινωνήστε στο Support@convertanyformat.com.',
    'Όλοι οι σύγχρονοι περιηγητές που έχουν ενημερωθεί τα τελευταία δύο χρόνια: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+, καθώς και οι περισσότεροι περιηγητές κινητού συμπεριλαμβανομένων Samsung Internet, Opera και Brave. Το JavaScript και τα cookies πρέπει να είναι ενεργοποιημένα. Για τη λειτουργία εγγραφής μικροφώνου Ομιλία σε Κείμενο, θα χρειαστεί να παραχωρήσετε άδεια μικροφώνου στον περιηγητή. Δεν υποστηρίζουμε επίσημα τον Internet Explorer ή περιηγητές που δεν έχουν λάβει ενημερώσεις ασφαλείας για πάνω από δύο χρόνια· ο ιστότοπος μπορεί ακόμα να λειτουργεί αλλά δεν μπορούμε να εγγυηθούμε σωστή συμπεριφορά.',
    'Ναι — το {{brand}} είναι πλήρως βελτιστοποιημένο για κινητά. Η διεπαφή προσαρμόζεται σε οθόνες τηλεφώνου από 320 px και πάνω, οι κάρτες εργαλείων εμφανίζονται σε άνετο πλέγμα 2 στηλών σε μικρές οθόνες, και κάθε λειτουργία συμπεριλαμβανομένης μεταφόρτωσης, μετατροπής, λήψης και Smart Functions λειτουργεί σε iOS Safari και Android Chrome. Για ήχο μπορείτε να κάνετε εγγραφή απευθείας από το μικρόφωνο του τηλεφώνου σας χρησιμοποιώντας τη συσκευή εγγραφής εντός σελίδας. Ο ιστότοπος είναι επίσης εγκαταστάσιμος ως Progressive Web App.',
    'Δεν υπάρχουν επαναλαμβανόμενες συνδρομές, οπότε δεν υπάρχει τίποτα για ακύρωση — τα κρεντίτ είναι εφάπαξ προπληρωμένες αγορές που δεν λήγουν ποτέ. Για να ζητήσετε επιστροφή σε αχρησιμοποίητα κρεντίτ, στείλτε email στο Support@convertanyformat.com από το email του λογαριασμού σας εντός 14 ημερών από την αγορά, σύμφωνα με τον γερμανικό Fernabsatzgesetz. Οι επιστροφές χρημάτων επεξεργάζονται εντός 5 έως 10 εργάσιμων ημερών στην αρχική μέθοδο πληρωμής. Τα χρησιμοποιημένα κρεντίτ συνήθως δεν επιστρέφονται, αλλά εάν μια μετατροπή απέτυχε λόγω προβλήματος δικού μας, αναφέρετέ το στο μήνυμά σας.',
    'Τα Smart Functions είναι εργαλεία τεχνητής νοημοσύνης που υπερβαίνουν την καθαρή μετατροπή μορφής. Η τρέχουσα γκάμα: OCR (εξάγει επεξεργάσιμο κείμενο από σαρωμένα PDF και εικόνες), Συμπίεση PDF με AI (μειώνει έξυπνα το μέγεθος αρχείου PDF διατηρώντας την αναγνωσιμότητα), Κείμενο σε Ομιλία (δημιουργεί φυσικό ήχο MP3, OPUS ή AAC χρησιμοποιώντας OpenAI TTS-1), Ομιλία σε Κείμενο (μεταγράφει σε TXT ή DOCX χρησιμοποιώντας OpenAI Whisper) και Αυτόματη Δημιουργία Υποτίτλων (δημιουργεί χρονομετρημένα αρχεία υποτίτλων SRT ή VTT από βίντεο). Αυτά τα εργαλεία χρεώνονται ανά χρήση.',
    'Το OCR (Οπτική Αναγνώριση Χαρακτήρων) εξάγει επεξεργάσιμο κείμενο από εικόνες κειμένου. Χρησιμοποιήστε το όποτε έχετε σαρωμένο PDF, μια φωτογραφία ενός εκτυπωμένου εγγράφου ή οποιαδήποτε εικόνα όπου το κείμενο στην οθόνη δεν είναι επιλέξιμο. Το OCR του {{brand}} επιστρέφει είτε ένα PDF με δυνατότητα αναζήτησης (διατηρώντας την αρχική διάταξη με ένα αόρατο επίπεδο κειμένου από κάτω) είτε ένα απλό αρχείο κειμένου. Συνηθισμένες περιπτώσεις χρήσης: ψηφιοποίηση χαρτιού για αρχειοθέτηση, να γίνουν αρχεία PDF αναζητήσιμα, εξαγωγή αποσπασμάτων από στιγμιότυπα οθόνης.',
    'Πληκτρολογήστε ή επικολλήστε έως 4096 χαρακτήρες στο πλαίσιο κειμένου, επιλέξτε μία από τις έξι φωνές (Alloy ουδέτερη· Echo ζεστή και ανδρική· Fable με βρετανική προφορά και εκφραστική· Onyx βαθιά και αυταρχική· Nova φιλική και καθαρή· Shimmer μαλακή και απαλή), επιλέξτε ταχύτητα αναπαραγωγής (0,75x, 1,0x, 1,25x ή 1,5x), επιλέξτε μορφή εξόδου (MP3, OPUS ή AAC) και κάντε κλικ στο Μετατροπή. Μέσα σε δευτερόλεπτα θα λάβετε σύνδεσμο λήψης για ένα φυσικό αρχείο ήχου. Η λειτουργία τροφοδοτείται από το μοντέλο OpenAI TTS-1. Το κόστος είναι 1 κρεντίτ ανά 1000 χαρακτήρες, στρογγυλοποίηση προς τα πάνω.',
    'Μεταφορτώστε ένα αρχείο ήχου (MP3, WAV, M4A, OGG, MP4, WebM) έως 25 MB και θα το μεταγράψουμε χρησιμοποιώντας OpenAI Whisper — την ίδια μηχανή που τροφοδοτεί πολλές επαγγελματικές υπηρεσίες μεταγραφής. Επιλέξτε μεταξύ TXT (απλό κείμενο) και DOCX (Microsoft Word). Μπορείτε επίσης να καταγράψετε απευθείας από το μικρόφωνό σας χρησιμοποιώντας την ενσωματωμένη συσκευή εγγραφής. Εάν γνωρίζετε ποια γλώσσα ομιλείται μπορείτε να δώσετε προαιρετική υπόδειξη γλώσσας. Το κόστος είναι 1 κρεντίτ ανά 5 λεπτά ήχου, στρογγυλοποίηση προς τα πάνω. Η μεταγραφή εμφανίζεται στη σελίδα ώστε να την ελέγξετε πριν τη λήψη.',
    'Μεταφορτώστε ένα αρχείο βίντεο (MP4, MOV, AVI, MKV) έως 25 MB. Εξάγουμε το κομμάτι ήχου εάν χρειάζεται (χρησιμοποιώντας CloudConvert για μη-MP4 κοντέινερ) και στη συνέχεια το μεταγράφουμε μέσω OpenAI Whisper χρησιμοποιώντας μορφή απάντησης που γνωρίζει χρονοσφραγίδες. Το αποτέλεσμα είναι ένα επαγγελματικό αρχείο υποτίτλων SRT ή VTT έτοιμο για YouTube, Vimeo, Premiere, Final Cut ή οποιονδήποτε επεξεργαστή βίντεο. Η προαιρετική υπόδειξη γλώσσας βελτιώνει την ακρίβεια. Το κόστος είναι 1 κρεντίτ ανά 5 λεπτά βίντεο, στρογγυλοποίηση προς τα πάνω.',
    'Η διεπαφή του {{brand}} είναι μεταφρασμένη σε 17 ευρωπαϊκές γλώσσες: αγγλικά, γερμανικά, γαλλικά, ισπανικά, ιταλικά, πορτογαλικά, ολλανδικά, πολωνικά, σουηδικά, νορβηγικά, δανικά, φινλανδικά, τσεχικά, ρουμανικά, ουγγρικά, ελληνικά και τουρκικά. Αλλάξτε γλώσσα ανά πάσα στιγμή μέσω του αναπτυσσόμενου μενού στη γραμμή πλοήγησης — η επιλογή σας θυμάται για μελλοντικές επισκέψεις. Για Smart Functions: το OpenAI Whisper υποστηρίζει αναγνώριση ομιλίας σε πάνω από 50 γλώσσες· το OpenAI TTS παράγει φυσικό λόγο σε πάνω από 30 γλώσσες· το OCR λειτουργεί στα αγγλικά, γερμανικά, γαλλικά, ισπανικά, ιταλικά, πορτογαλικά, κινεζικά, ιαπωνικά και κορεατικά.',
    'Κάντε κλικ στο όνομά σας στη γραμμή πλοήγησης για να φτάσετε στη σελίδα Προφίλ. Από εκεί μπορείτε να ενημερώσετε τη διεύθυνση email σας (αποστέλλεται email επιβεβαίωσης στη νέα διεύθυνση πριν τεθεί σε ισχύ η αλλαγή), να ορίσετε ή να αλλάξετε όνομα οθόνης, να αλλάξετε τον κωδικό πρόσβασης (χρειάζεστε τον τρέχοντα), να διαμορφώσετε τις προτιμήσεις ειδοποιήσεων email, να δείτε το ιστορικό μετατροπών και το υπόλοιπο κρεντίτ, να δημιουργήσετε ή να εναλλάξετε κλειδί API για ενσωματώσεις, να βρείτε τον κωδικό παραπομπής σας και — στο κάτω μέρος της σελίδας στη Ζώνη Κινδύνου — να διαγράψετε οριστικά τον λογαριασμό σας. Η διαγραφή λογαριασμού αφαιρεί όλα τα σχετικά δεδομένα εντός 30 ημερών.',
    'Στείλτε μας email οποτεδήποτε στο Support@convertanyformat.com. Στόχος μας είναι να απαντήσουμε εντός 24 ωρών τις εργάσιμες ημέρες και εντός 48 ωρών τα Σαββατοκύριακα. Για ερωτήματα προστασίας δεδομένων (δικαιώματα GDPR, αιτήματα διαγραφής, καταγγελίες) χρησιμοποιήστε το ίδιο email και αναφέρετε "Datenschutz" ή "GDPR" στο θέμα — αυτά δρομολογούνται με προτεραιότητα. Μπορείτε επίσης να χρησιμοποιήσετε τη φόρμα επικοινωνίας στη σελίδα /contact. Δεν προσφέρουμε τηλεφωνική υποστήριξη επί του παρόντος, αλλά ευχαρίστως θα προγραμματίσουμε βιντεοκλήση για επιχειρηματικά ερωτήματα ή συζητήσεις συνεργασίας.',
  ]
);

// =====================================================================
// Helpers (same as A1)
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

const PAYLOADS = { fi: fiFaq, hu: huFaq, el: elFaq };

for (const [lang, faq] of Object.entries(PAYLOADS)) {
  const block = findLangBlock(content, lang);
  content = replaceTopLevelKey(content, 'faq', faq, block.start, block.end);
  console.log(`✔ Updated ${lang}.faq`);
}

fs.writeFileSync(FILE, content);
console.log('\nFAQ done for all 7 secondary languages.');
