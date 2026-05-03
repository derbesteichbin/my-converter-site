// Chunk C1: adds the entire `privacy` block to da, fi, cs, ro.
// 73 keys × 4 langs.
//
// Run from repo root:  node scripts/fill-gap-C1-privacy.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

// =====================================================================
// Danish (da)
// =====================================================================
const daPrivacy = {
  title: 'Fortrolighedspolitik',
  seoDesc: '{{brand}} Fortrolighedspolitik. GDPR-kompatibel datahåndtering: hvad vi indsamler, retsgrundlag, opbevaring, underleverandører, dine rettigheder, internationale overførsler.',
  updated: 'Sidst opdateret: maj 2026',
  s1Title: '1. Dataansvarlig',
  s1Body: 'Den dataansvarlige for personoplysninger behandlet via {{brand}} ("Tjenesten") er Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Tyskland. For alle databeskyttelsesforespørgsler — herunder anmodninger om at udøve dine rettigheder under den generelle databeskyttelsesforordning (GDPR) — kontakt os via e-mail på Support@convertanyformat.com. Da vi ikke opfylder tærsklerne i Art. 37 GDPR eller § 38 BDSG, er vi ikke forpligtet til at udpege en databeskyttelsesrådgiver; den dataansvarlige håndterer alle databeskyttelsessager direkte. Denne fortrolighedspolitik forklarer, hvilke data vi indsamler, hvorfor, på hvilket retsgrundlag, med hvem vi deler dem, hvor længe vi opbevarer dem, og hvilke rettigheder du har.',
  s2Title: '2. Personoplysninger vi indsamler',
  s2Account: 'Kontodata:',
  s2AccountBody: ' din e-mailadresse, valgfrit visningsnavn, en bcrypt-hash af din adgangskode (aldrig adgangskoden selv), Google-konto-id ved login via OAuth, kontoindstillinger (tema, sprog, notifikationsindstillinger) og en henvisningskode hvis relevant.',
  s2Usage: 'Brugsdata:',
  s2UsageBody: ' konverteringshistorik (filnavn, input/output-format, tidsstempel, status), kreditbalance og transaktionslog, værktøjsbrugsstatistik, IP-adresse og omtrentlig placering udledt af IP til svindelforebyggelse.',
  s2Payment: 'Betalingsdata:',
  s2PaymentBody: ' behandles helt af Stripe Payments Europe Ltd. Vi modtager kun en Stripe-kunde-id, de sidste fire cifre af kortet, kortmærket og en transaktionsbekræftelse. Vi ser eller gemmer aldrig fulde kortnumre, CVC eller bankoplysninger.',
  s2File: 'Fildata:',
  s2FileBody: ' de filer, du uploader til konvertering, opbevares kun i den tid, der er nødvendig for at levere Tjenesten, og slettes automatisk inden for fireogtyve timer. Vi tilgår, læser eller analyserer ikke indholdet af dine filer, undtagen som strengt nødvendigt for at udføre den konvertering, du har anmodet om.',
  s2Tech: 'Tekniske data:',
  s2TechBody: ' browsertype og -version, operativsystem, enhedstype, henvisende URL, sprogpreference og cookie-id\'er. Indsamlet automatisk af hensyn til sikkerhed, misbrugsforebyggelse og levering af en fungerende Tjeneste.',
  s3Title: '3. Formål med behandlingen',
  s3Body: 'Vi behandler personoplysninger til følgende formål: (a) drift af Tjenesten, herunder levering af de konverteringer, du har anmodet om, administration af din konto og bogføring af kreditbalancer; (b) behandling af betalinger og udstedelse af momspligtige fakturaer via Stripe; (c) afsendelse af transaktionsmails såsom kontoverifikation, adgangskodenulstilling, konverteringsfærdiggørelsesmeddelelser, du har tilmeldt dig, og servicestatusmeddelelser; (d) besvarelse af supportforespørgsler og løsning af tvister; (e) analyse af aggregeret, ikke-identificerende brug for at forbedre Tjenesten; (f) forebyggelse af svindel, misbrug og uautoriseret adgang; og (g) overholdelse af juridiske forpligtelser, herunder opbevaring af skatteregistre.',
  s4Title: '4. Retsgrundlag for behandling (Art. 6 GDPR)',
  s4ContractTitle: 'Kontraktopfyldelse (Art. 6 (1) (b)):',
  s4ContractBody: ' behandling af dine konverteringer, administration af din konto og drift af kreditsystemet er nødvendige for at opfylde den kontrakt, du indgik, da du registrerede dig eller foretog et køb.',
  s4InterestTitle: 'Legitim interesse (Art. 6 (1) (f)):',
  s4InterestBody: ' svindelforebyggelse, sikkerhedsovervågning, misbrugsdetektion, aggregeret analyse og serviceforbedring. Vi har gennemført en afvejningstest og overvejet dine grundlæggende rettigheder og friheder.',
  s4ConsentTitle: 'Samtykke (Art. 6 (1) (a)):',
  s4ConsentBody: ' marketingmails, analysecookies og eventuelle valgfrie funktioner, der går ud over streng nødvendighed. Samtykke gives frit via cookiebanneret eller indstillingerne og kan til enhver tid trækkes tilbage uden at påvirke lovligheden af behandling foretaget før tilbagetrækning.',
  s4LegalTitle: 'Juridisk forpligtelse (Art. 6 (1) (c)):',
  s4LegalBody: ' opbevaring af skatterelevante registre under § 147 AO (tysk skattelov), besvarelse af lovlige anmodninger fra kompetente myndigheder og enhver anden forpligtelse pålagt os af EU- eller tysk lov.',
  s5Title: '5. Cookies og lignende teknologier',
  s5EssentialTitle: 'Essentielle cookies:',
  s5EssentialBody: ' dit godkendelsestoken (httpOnly, SameSite=Strict), temapreference, sprogpreference og cookie-samtykke-tilstand. Disse er strengt nødvendige for at Tjenesten kan fungere og kræver ikke samtykke under § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Analysecookies:',
  s5AnalyticsBody: ' indstilles kun med dit udtrykkelige samtykke via cookiebanneret. Hjælper os med at forstå, hvordan Tjenesten bruges samlet set. Du kan til enhver tid trække samtykke tilbage, og vi vil slette de tilsvarende cookies.',
  s5MarketingTitle: 'Marketingcookies:',
  s5MarketingBody: ' indstilles kun med dit udtrykkelige samtykke. Bruges til at personalisere kommunikation. Du kan til enhver tid trække samtykke tilbage.',
  s5Manage: 'Du kan til enhver tid administrere dine cookiepræferencer via cookieikonet i sidefoden. Browserindstillinger lader dig desuden blokere, slette eller begrænse cookies — bemærk at blokering af essentielle cookies vil forhindre dig i at logge ind eller foretage køb.',
  s6Title: '6. Datadeling med underleverandører',
  s6Body: 'Vi deler kun personoplysninger med følgende underleverandører, der hver er engageret under en databehandleraftale i overensstemmelse med Art. 28 GDPR. Stripe Payments Europe Ltd. (Irland) håndterer betalingsbehandling; CloudConvert GmbH (München, Tyskland) behandler filkonverteringer; Supabase Inc. (USA, overførsler dækket af EU-standardkontraktbestemmelser) hoster vores PostgreSQL-database; Railway Corp. (USA, SCC\'er) hoster vores applikation; Resend (USA, SCC\'er) leverer transaktionsmails; OpenAI Ireland Ltd. behandler Smart Functions-input (lyd/tekst); og Google LLC (USA, certificeret under EU-US Data Privacy Framework) leverer Google OAuth-login. Vi sælger aldrig dine personoplysninger til nogen, og vi overfører ikke data til tredjeparter til deres egne marketingformål.',
  s7Title: '7. Dataopbevaring',
  s7Files: 'Filer:',
  s7FilesBody: ' uploadede og konverterede filer slettes inden for fireogtyve (24) timer efter upload, uanset om de blev downloadet.',
  s7Account: 'Kontodata:',
  s7AccountBody: ' opbevares så længe din konto er aktiv. Når du sletter din konto, fjernes alle tilknyttede data inden for tredive (30) dage, undtagen registre, vi er juridisk forpligtet til at opbevare.',
  s7Payment: 'Betalings- og fakturaregistre:',
  s7PaymentBody: ' opbevares i ti (10) år i overensstemmelse med § 147 AO (tysk skattelov) for skatte- og regnskabsmæssig overholdelse. Efter denne periode slettes dataene irreversibelt.',
  s7Logs: 'Serverlogfiler:',
  s7LogsBody: ' opbevares i tredive (30) dage til sikkerhed, misbrugsforebyggelse og hændelsesundersøgelse, hvorefter de automatisk renses.',
  s8Title: '8. Dine rettigheder under GDPR',
  s8Intro: 'Du har omfattende rettigheder vedrørende de personoplysninger, vi behandler om dig:',
  s8Access: 'Ret til adgang (Art. 15):',
  s8AccessBody: ' du kan anmode om bekræftelse af, om vi behandler dine data og en kopi af disse data.',
  s8Rect: 'Ret til berigtigelse (Art. 16):',
  s8RectBody: ' du kan rette unøjagtige data direkte via din profilside eller ved at kontakte os.',
  s8Erase: 'Ret til sletning / "ret til at blive glemt" (Art. 17):',
  s8EraseBody: ' du kan anmode om sletning af din konto og alle tilknyttede personoplysninger, med forbehold for juridiske opbevaringsforpligtelser såsom skatteregistre.',
  s8Port: 'Ret til dataportabilitet (Art. 20):',
  s8PortBody: ' du kan anmode om en kopi af dine data i et struktureret, almindeligt anvendt, maskinlæsbart format.',
  s8Restrict: 'Ret til begrænsning af behandling (Art. 18):',
  s8RestrictBody: ' du kan anmode om, at vi begrænser behandlingen af dine data, mens vi løser en tvist, retter en unøjagtighed eller vurderer et juridisk krav.',
  s8Object: 'Ret til indsigelse (Art. 21):',
  s8ObjectBody: ' du kan gøre indsigelse mod behandling foretaget på grundlag af legitim interesse, herunder profilering. Vi vil stoppe, medmindre vi kan påvise tvingende legitime grunde, der tilsidesætter dine interesser.',
  s8Withdraw: 'Ret til at trække samtykke tilbage (Art. 7):',
  s8WithdrawBody: ' for enhver behandling baseret på samtykke kan du trække tilbage til enhver tid uden at påvirke lovligheden af behandling foretaget før tilbagetrækning.',
  s8Outro: 'For at udøve nogen af disse rettigheder skal du sende en e-mail til Support@convertanyformat.com fra den adresse, der er knyttet til din konto. Vi vil svare inden for en måned, der kan forlænges med yderligere to måneder for komplekse anmodninger som tilladt af Art. 12 (3) GDPR. Udøvelse af dine rettigheder er gratis.',
  s9Title: '9. Datasikkerhed',
  s9Body: 'Vi beskytter dine personoplysninger ved hjælp af branchestandard tekniske og organisatoriske foranstaltninger: TLS 1.2+ kryptering for alle data under transport; bcrypt-adgangskodehashing med en omkostningsfaktor på 10 eller højere; httpOnly-sessionscookies med SameSite=Strict-attributten; mindst privilegium-princippet for intern adgang inklusive auditlogging; regelmæssige opdateringer af afhængigheder for at adressere kendte sårbarheder; rate-begrænsning og inputvalidering for at forhindre misbrug; og infrastruktur hostet af udbydere med anerkendte certificeringer (ISO 27001, SOC 2). I tilfælde af et brud på persondatabeskyttelsen, der påvirker dine rettigheder og friheder, vil vi underrette den kompetente tilsynsmyndighed inden for 72 timer og informere berørte brugere uden unødig forsinkelse i overensstemmelse med Art. 33-34 GDPR.',
  s10Title: '10. Internationale dataoverførsler',
  s10Body: 'Nogle af vores underleverandører er baseret uden for Det Europæiske Økonomiske Samarbejdsområde, primært i USA. For hver sådan overførsel har vi implementeret passende sikkerhedsforanstaltninger som krævet af kapitel V GDPR. Overførsler til Stripe (Irland) og CloudConvert (Tyskland) forbliver inden for EØS. Overførsler til Supabase, Railway, Resend og OpenAI (USA) er underlagt Europa-Kommissionens standardkontraktbestemmelser (Modul 2: dataansvarlig-til-databehandler) suppleret med yderligere tekniske sikkerhedsforanstaltninger inklusive kryptering under transport og i hvile. Google LLC er desuden certificeret under EU-US Data Privacy Framework, hvilket giver et passende beskyttelsesniveau i henhold til Art. 45 GDPR.',
  s11Title: '11. Børns privatliv',
  s11Body: 'Tjenesten er ikke rettet mod børn under seksten (16) år, og vi indsamler ikke bevidst personoplysninger fra børn under denne alder. Hvis du er forælder eller værge og mener, at et barn under 16 har givet os personoplysninger, bedes du kontakte os på Support@convertanyformat.com, og vi vil tage skridt til at slette disse data hurtigt. Brugere mellem 16 og 18 år erklærer, at de har samtykke fra en forælder eller værge, hvor det kræves af deres bopælsland.',
  s12Title: '12. Ændringer af denne fortrolighedspolitik',
  s12Body: 'Vi kan opdatere denne fortrolighedspolitik fra tid til anden for at afspejle ændringer i vores praksis, de teknologier vi bruger, gældende juridiske krav eller andre operationelle faktorer. Materielle ændringer vil blive meddelt din registrerede e-mailadresse mindst tredive (30) dage før de træder i kraft. Ikke-materielle ændringer (typorettelser, formatering, præciserende tilføjelser) træder i kraft ved offentliggørelse. "Sidst opdateret"-datoen øverst på denne side angiver, hvornår politikken sidst blev revideret. Fortsat brug af Tjenesten efter den effektive dato for enhver ændring udgør accept af den reviderede politik.',
  s13Title: '13. Kontakt og ret til at indgive klage',
  s13Body: 'For databeskyttelsesforespørgsler, anmodninger om at udøve dine GDPR-rettigheder eller ethvert andet privatlivsrelateret problem, send venligst en e-mail til Support@convertanyformat.com. Vi sigter mod at svare inden for en måned. Uden at det berører nogen anden administrativ eller retslig retsmidling, har du i henhold til Art. 77 GDPR ret til at indgive en klage til tilsynsmyndigheden i den EU-medlemsstat, hvor du bor, arbejder, eller hvor den påståede overtrædelse fandt sted. Den kompetente tilsynsmyndighed for {{brand}} er Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Finnish (fi)
// =====================================================================
const fiPrivacy = {
  title: 'Tietosuojakäytäntö',
  seoDesc: '{{brand}} Tietosuojakäytäntö. GDPR-yhteensopiva tietojenkäsittely: mitä keräämme, oikeusperusta, säilyttäminen, alikäsittelijät, oikeutesi, kansainväliset siirrot.',
  updated: 'Viimeksi päivitetty: toukokuu 2026',
  s1Title: '1. Rekisterinpitäjä',
  s1Body: 'Rekisterinpitäjä, joka vastaa {{brand}}-palvelun ("Palvelu") kautta käsiteltävistä henkilötiedoista, on Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Saksa. Kaikkiin tietosuojakysymyksiin — mukaan lukien pyynnöt käyttää oikeuksiasi yleisen tietosuoja-asetuksen (GDPR) nojalla — ota yhteyttä sähköpostitse Support@convertanyformat.com. Koska emme täytä Art. 37 GDPR:n tai § 38 BDSG:n kynnyksiä, meidän ei tarvitse nimittää tietosuojavastaavaa; rekisterinpitäjä käsittelee kaikki tietosuoja-asiat suoraan. Tämä tietosuojakäytäntö selittää, mitä tietoja keräämme, miksi, millä oikeusperustalla, kenen kanssa jaamme, kuinka kauan säilytämme ja mitä oikeuksia sinulla on.',
  s2Title: '2. Henkilötiedot, joita keräämme',
  s2Account: 'Tilitiedot:',
  s2AccountBody: ' sähköpostiosoitteesi, valinnainen näyttönimi, salasanasi bcrypt-hash (ei koskaan itse salasanaa), Google-tilin tunniste OAuth-kirjautumisessa, tilin asetukset (teema, kieli, ilmoitusasetukset) ja suosittelukoodi tarvittaessa.',
  s2Usage: 'Käyttötiedot:',
  s2UsageBody: ' muunnoshistoria (tiedostonimi, syöte-/tulostusformaatti, aikaleima, tila), krediittisaldo ja transaktioloki, työkalujen käyttötilastot, IP-osoite ja IP:stä johdettu likimääräinen sijainti petosten estämiseksi.',
  s2Payment: 'Maksutiedot:',
  s2PaymentBody: ' käsittelee kokonaan Stripe Payments Europe Ltd. Saamme vain Stripe-asiakastunnisteen, kortin neljä viimeistä numeroa, korttimerkin ja tapahtumavahvistuksen. Emme näe tai tallenna täydellisiä korttinumeroita, CVC-koodeja tai pankkitunnuksia.',
  s2File: 'Tiedostotiedot:',
  s2FileBody: ' lähettämäsi tiedostot muunnosta varten säilytetään vain Palvelun toimittamiseen tarvittavan ajan ja ne poistetaan automaattisesti 24 tunnin sisällä. Emme käytä, lue tai analysoi tiedostojesi sisältöä paitsi tiukasti tarpeellisten määrin pyytämäsi muunnoksen suorittamiseksi.',
  s2Tech: 'Tekniset tiedot:',
  s2TechBody: ' selaimen tyyppi ja versio, käyttöjärjestelmä, laitetyyppi, viittaava URL, kielipreferenssi ja evästetunnisteet. Kerätään automaattisesti turvallisuuden, väärinkäytön ehkäisyn ja toimivan Palvelun toimittamiseksi.',
  s3Title: '3. Käsittelyn tarkoitukset',
  s3Body: 'Käsittelemme henkilötietoja seuraaviin tarkoituksiin: (a) Palvelun käyttö, mukaan lukien pyytämiesi muunnosten toimittaminen, tilisi hallinta ja krediittisaldojen kirjanpito; (b) maksujen käsittely ja verolaskukelpoisten laskujen antaminen Stripen kautta; (c) transaktiosähköpostien lähettäminen kuten tilin vahvistus, salasanan palautus, hyväksymäsi muunnoksen valmistumisen ilmoitukset ja palvelun tilaa koskevat ilmoitukset; (d) tukikyselyihin vastaaminen ja riitojen ratkaiseminen; (e) yhdistettyjen, ei tunnistavien käyttötietojen analysointi Palvelun parantamiseksi; (f) petosten, väärinkäytön ja luvattoman pääsyn estäminen; ja (g) lakisääteisten velvoitteiden täyttäminen mukaan lukien verotietojen säilyttäminen.',
  s4Title: '4. Käsittelyn oikeusperusta (Art. 6 GDPR)',
  s4ContractTitle: 'Sopimuksen täytäntöönpano (Art. 6 (1) (b)):',
  s4ContractBody: ' muunnostesi käsittely, tilisi hallinta ja krediittijärjestelmän käyttö ovat välttämättömiä rekisteröityessäsi tai oston tehdessäsi solmimasi sopimuksen täyttämiseksi.',
  s4InterestTitle: 'Oikeutettu etu (Art. 6 (1) (f)):',
  s4InterestBody: ' petosten esto, turvallisuuden seuranta, väärinkäytön havaitseminen, yhdistetty analyysi ja Palvelun parantaminen. Olemme suorittaneet tasapainotestin ja ottaneet huomioon perusoikeutesi ja -vapautesi.',
  s4ConsentTitle: 'Suostumus (Art. 6 (1) (a)):',
  s4ConsentBody: ' markkinointisähköpostit, analyysievästeet ja kaikki valinnaiset ominaisuudet, jotka ylittävät tiukan välttämättömyyden. Suostumus annetaan vapaasti evästebannerin tai asetusten kautta ja se voidaan peruuttaa milloin tahansa vaikuttamatta peruuttamista edeltävän käsittelyn lainmukaisuuteen.',
  s4LegalTitle: 'Lakisääteinen velvoite (Art. 6 (1) (c)):',
  s4LegalBody: ' verotuksellisesti merkityksellisten tietojen säilyttäminen § 147 AO:n (Saksan verolain) nojalla, lainmukaisten viranomaispyyntöjen vastaaminen ja muut EU- tai Saksan lain meille asettamat velvoitteet.',
  s5Title: '5. Evästeet ja vastaavat tekniikat',
  s5EssentialTitle: 'Välttämättömät evästeet:',
  s5EssentialBody: ' todennustunnuksesi (httpOnly, SameSite=Strict), teemapreferenssi, kielipreferenssi ja evästesuostumustila. Nämä ovat ehdottoman välttämättömiä Palvelun toimimiselle eivätkä vaadi suostumusta § 25 (2) TTDSG:n nojalla.',
  s5AnalyticsTitle: 'Analyysievästeet:',
  s5AnalyticsBody: ' asetetaan vain nimenomaisella suostumuksellasi evästebannerin kautta. Auttavat ymmärtämään, miten Palvelua käytetään yhteenlaskettuna. Voit peruuttaa suostumuksen milloin tahansa, ja poistamme vastaavat evästeet.',
  s5MarketingTitle: 'Markkinointievästeet:',
  s5MarketingBody: ' asetetaan vain nimenomaisella suostumuksellasi. Käytetään viestinnän personointiin. Voit peruuttaa suostumuksen milloin tahansa.',
  s5Manage: 'Voit hallita evästeasetuksiasi milloin tahansa sivun alatunnisteen evästekuvakkeen kautta. Selainasetukset antavat sinun lisäksi estää, poistaa tai rajoittaa evästeitä — huomaa, että välttämättömien evästeiden estäminen estää sinua kirjautumasta tai tekemästä ostoja.',
  s6Title: '6. Tietojen jakaminen alikäsittelijöiden kanssa',
  s6Body: 'Jaamme henkilötietoja vain seuraavien alikäsittelijöiden kanssa, joista jokainen on sitoutunut Art. 28 GDPR:n mukaiseen tietojenkäsittelysopimukseen. Stripe Payments Europe Ltd. (Irlanti) hoitaa maksujen käsittelyn; CloudConvert GmbH (München, Saksa) käsittelee tiedostomuunnoksia; Supabase Inc. (Yhdysvallat, siirrot katettu EU:n vakiosopimuslausekkeilla) isännöi PostgreSQL-tietokantaamme; Railway Corp. (Yhdysvallat, SCC:t) isännöi sovellustamme; Resend (Yhdysvallat, SCC:t) toimittaa transaktiosähköposteja; OpenAI Ireland Ltd. käsittelee Smart Functions -syötteitä (ääni/teksti); ja Google LLC (Yhdysvallat, sertifioitu EU-US Data Privacy Framework -järjestelmän mukaan) tarjoaa Google OAuth -kirjautumisen. Emme koskaan myy henkilötietojasi kenellekään, emmekä siirrä tietoja kolmansille osapuolille heidän omiin markkinointitarkoituksiinsa.',
  s7Title: '7. Tietojen säilyttäminen',
  s7Files: 'Tiedostot:',
  s7FilesBody: ' lähetetyt ja muunnetut tiedostot poistetaan kahdenkymmenenneljän (24) tunnin sisällä lähetyksestä riippumatta siitä, ladattiinko ne.',
  s7Account: 'Tilitiedot:',
  s7AccountBody: ' säilytetään niin kauan kuin tilisi on aktiivinen. Kun poistat tilisi, kaikki siihen liittyvät tiedot poistetaan kolmenkymmenen (30) päivän sisällä, lukuun ottamatta tietoja, joita meillä on lakisääteinen velvollisuus säilyttää.',
  s7Payment: 'Maksu- ja laskutiedot:',
  s7PaymentBody: ' säilytetään kymmenen (10) vuotta § 147 AO:n (Saksan verolain) mukaisesti vero- ja kirjanpitomääräysten noudattamiseksi. Tämän jakson jälkeen tiedot poistetaan peruuttamattomasti.',
  s7Logs: 'Palvelinlokit:',
  s7LogsBody: ' säilytetään kolmekymmentä (30) päivää turvallisuutta, väärinkäytön estoa ja tapausten tutkimista varten, minkä jälkeen ne poistetaan automaattisesti.',
  s8Title: '8. Oikeutesi GDPR:n nojalla',
  s8Intro: 'Sinulla on laajoja oikeuksia käsittelemiimme henkilötietoihisi nähden:',
  s8Access: 'Oikeus saada pääsy tietoihin (Art. 15):',
  s8AccessBody: ' voit pyytää vahvistuksen siitä, käsittelemmekö tietojasi, ja kopion näistä tiedoista.',
  s8Rect: 'Oikeus tietojen oikaisuun (Art. 16):',
  s8RectBody: ' voit korjata epätarkat tiedot suoraan profiilisivultasi tai ottamalla yhteyttä meihin.',
  s8Erase: 'Oikeus tietojen poistamiseen / "oikeus tulla unohdetuksi" (Art. 17):',
  s8EraseBody: ' voit pyytää tilisi ja kaikkien siihen liittyvien henkilötietojen poistamista, ottaen huomioon lakisääteiset säilytysvelvoitteet kuten verotiedot.',
  s8Port: 'Oikeus tietojen siirrettävyyteen (Art. 20):',
  s8PortBody: ' voit pyytää kopion tiedoistasi jäsennellyssä, yleisesti käytetyssä, koneluettavassa muodossa.',
  s8Restrict: 'Oikeus käsittelyn rajoittamiseen (Art. 18):',
  s8RestrictBody: ' voit pyytää, että rajoitamme tietojesi käsittelyä riidan ratkaisemisen, virheen korjaamisen tai oikeudellisen vaateen arvioinnin ajaksi.',
  s8Object: 'Oikeus vastustaa (Art. 21):',
  s8ObjectBody: ' voit vastustaa oikeutetun edun perusteella tehtävää käsittelyä, mukaan lukien profilointi. Lopetamme, ellemme voi osoittaa pakottavia oikeutettuja perusteita, jotka ohittavat etusi.',
  s8Withdraw: 'Oikeus peruuttaa suostumus (Art. 7):',
  s8WithdrawBody: ' kaiken suostumukseen perustuvan käsittelyn osalta voit peruuttaa milloin tahansa vaikuttamatta peruuttamista edeltävän käsittelyn lainmukaisuuteen.',
  s8Outro: 'Käyttääksesi mitä tahansa näistä oikeuksista, lähetä sähköpostia osoitteeseen Support@convertanyformat.com tilisi sähköpostista. Vastaamme kuukauden sisällä, jota voidaan jatkaa kahdella lisäkuukaudella monimutkaisille pyynnöille Art. 12 (3) GDPR:n sallimalla tavalla. Oikeuksiesi käyttäminen on maksutonta.',
  s9Title: '9. Tietoturva',
  s9Body: 'Suojaamme henkilötietojasi alan standardien mukaisilla teknisillä ja organisatorisilla toimenpiteillä: TLS 1.2+ -salaus kaikille siirrettäville tiedoille; bcrypt-salasanahashaus kustannustekijällä 10 tai korkeammalla; httpOnly-istuntokevästeet SameSite=Strict-attribuutilla; vähimmän etuoikeuden periaate sisäiselle pääsylle mukaan lukien auditlogging; säännölliset riippuvuuksien päivitykset tunnettujen haavoittuvuuksien korjaamiseksi; rate-rajoitus ja syötteen validointi väärinkäytön estämiseksi; ja infrastruktuuri, jota isännöivät palveluntarjoajat tunnustetuilla sertifioinneilla (ISO 27001, SOC 2). Mikäli henkilötietojen tietoturvaloukkaus vaikuttaa oikeuksiisi ja vapauksiisi, ilmoitamme toimivaltaiselle valvontaviranomaiselle 72 tunnin sisällä ja kerromme vaikuttuneille käyttäjille ilman aiheetonta viivettä Art. 33-34 GDPR:n mukaisesti.',
  s10Title: '10. Kansainväliset tiedonsiirrot',
  s10Body: 'Jotkut alikäsittelijöistämme sijaitsevat Euroopan talousalueen ulkopuolella, pääasiassa Yhdysvalloissa. Jokaisesta tällaisesta siirrosta olemme toteuttaneet asianmukaisia luvun V GDPR:n vaatimia suojatoimenpiteitä. Stripeen (Irlanti) ja CloudConvertiin (Saksa) tehtävät siirrot pysyvät ETA:n sisällä. Siirrot Supabaseen, Railwaylle, Resendille ja OpenAI:lle (Yhdysvallat) on katettu Euroopan komission vakiosopimuslausekkeilla (Moduuli 2: rekisterinpitäjä-käsittelijä) täydennettynä lisäteknisillä suojatoimenpiteillä mukaan lukien salaus siirron aikana ja levossa. Google LLC on lisäksi sertifioitu EU-US Data Privacy Framework -järjestelmän mukaan, mikä tarjoaa riittävän suojatason Art. 45 GDPR:n merkityksessä.',
  s11Title: '11. Lasten yksityisyys',
  s11Body: 'Palvelua ei ole suunnattu alle kuusitoista (16)-vuotiaille lapsille emmekä tietoisesti kerää henkilötietoja alle tämän iän olevilta lapsilta. Jos olet vanhempi tai laillinen huoltaja ja uskot, että alle 16-vuotias lapsi on antanut meille henkilötietoja, ota yhteyttä Support@convertanyformat.com ja toimimme nopeasti tietojen poistamiseksi. 16–18-vuotiaat käyttäjät vahvistavat, että heillä on vanhemman tai huoltajan suostumus, jos asuinmaa sitä vaatii.',
  s12Title: '12. Muutokset tähän tietosuojakäytäntöön',
  s12Body: 'Voimme päivittää tätä tietosuojakäytäntöä ajoittain heijastamaan käytäntöjemme, käyttämiemme teknologioiden, sovellettavien lakisääteisten vaatimusten tai muiden operatiivisten tekijöiden muutoksia. Olennaiset muutokset ilmoitetaan rekisteröityyn sähköpostiosoitteeseesi vähintään kolmekymmentä (30) päivää ennen niiden voimaantuloa. Ei-olennaiset muutokset (kirjoitusvirheiden korjaukset, muotoilu, selventävät lisäykset) tulevat voimaan julkaisemisen jälkeen. "Viimeksi päivitetty" -päivämäärä tämän sivun yläosassa osoittaa, milloin käytäntö on viimeksi tarkistettu. Palvelun jatkettu käyttö muutoksen voimaantulopäivän jälkeen muodostaa tarkistetun käytännön hyväksynnän.',
  s13Title: '13. Yhteystiedot ja oikeus tehdä valitus',
  s13Body: 'Tietosuojakysymyksiin, GDPR-oikeuksien käytön pyyntöihin tai muihin yksityisyyteen liittyviin huoliin, lähetä sähköpostia osoitteeseen Support@convertanyformat.com. Pyrimme vastaamaan kuukauden sisällä. Vaikuttamatta muuhun hallinnolliseen tai oikeudelliseen muutoksenhakukeinoon, sinulla on Art. 77 GDPR:n nojalla oikeus tehdä valitus sen EU-jäsenvaltion valvontaviranomaiselle, jossa asut, työskentelet tai jossa väitetty rikkomus tapahtui. {{brand}}:n toimivaltainen valvontaviranomainen on Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Czech (cs)
// =====================================================================
const csPrivacy = {
  title: 'Zásady ochrany osobních údajů',
  seoDesc: '{{brand}} Zásady ochrany osobních údajů. Zpracování dat v souladu s GDPR: co shromažďujeme, právní základ, uchovávání, dílčí zpracovatelé, vaše práva, mezinárodní přenosy.',
  updated: 'Naposledy aktualizováno: květen 2026',
  s1Title: '1. Správce údajů',
  s1Body: 'Správcem údajů odpovědným za osobní údaje zpracovávané prostřednictvím {{brand}} ("Služba") je Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Německo. Pro všechny dotazy ohledně ochrany údajů — včetně žádostí o uplatnění vašich práv podle obecného nařízení o ochraně osobních údajů (GDPR) — nás kontaktujte e-mailem na Support@convertanyformat.com. Protože nesplňujeme prahy v čl. 37 GDPR nebo § 38 BDSG, nemusíme jmenovat pověřence pro ochranu osobních údajů; správce řeší všechny záležitosti ochrany údajů přímo. Tyto zásady ochrany osobních údajů vysvětlují, jaká data shromažďujeme, proč, na jakém právním základě, s kým je sdílíme, jak dlouho je uchováváme a jaká máte práva.',
  s2Title: '2. Osobní údaje, které shromažďujeme',
  s2Account: 'Údaje účtu:',
  s2AccountBody: ' vaše e-mailová adresa, volitelné zobrazované jméno, bcrypt hash vašeho hesla (nikdy heslo samotné), identifikátor účtu Google při přihlašování přes OAuth, předvolby účtu (téma, jazyk, nastavení oznámení) a doporučovací kód, pokud je relevantní.',
  s2Usage: 'Údaje o používání:',
  s2UsageBody: ' historie převodů (název souboru, vstupní/výstupní formát, časová značka, stav), zůstatek kreditů a transakční log, statistiky používání nástrojů, IP adresa a přibližná lokalita odvozená z IP pro účely prevence podvodů.',
  s2Payment: 'Platební údaje:',
  s2PaymentBody: ' zpracovává zcela Stripe Payments Europe Ltd. Dostáváme pouze identifikátor zákazníka Stripe, poslední čtyři číslice karty, značku karty a potvrzení transakce. Nikdy nevidíme ani neukládáme úplná čísla karet, CVC nebo bankovní údaje.',
  s2File: 'Údaje o souborech:',
  s2FileBody: ' soubory, které nahrajete pro převod, jsou ukládány pouze po dobu nezbytnou pro poskytování Služby a jsou automaticky smazány do dvaceti čtyř hodin. Nepřistupujeme, nečteme ani neanalyzujeme obsah vašich souborů, kromě toho, co je nezbytně nutné pro provedení požadovaného převodu.',
  s2Tech: 'Technická data:',
  s2TechBody: ' typ a verze prohlížeče, operační systém, typ zařízení, odkazující URL, jazyková předvolba a identifikátory cookies. Shromažďováno automaticky pro bezpečnost, prevenci zneužití a poskytnutí funkční Služby.',
  s3Title: '3. Účely zpracování',
  s3Body: 'Osobní údaje zpracováváme pro následující účely: (a) provoz Služby, včetně poskytnutí požadovaných převodů, správa vašeho účtu a účetnictví zůstatků kreditů; (b) zpracování plateb a vystavování daňových faktur prostřednictvím Stripe; (c) odesílání transakčních e-mailů, jako je ověření účtu, obnovení hesla, oznámení o dokončení převodu, ke kterým jste se přihlásili, a oznámení o stavu Služby; (d) odpovědi na dotazy podpory a řešení sporů; (e) analýza souhrnného, neidentifikujícího použití pro zlepšení Služby; (f) prevence podvodů, zneužití a neoprávněného přístupu; a (g) plnění právních povinností včetně uchovávání daňových záznamů.',
  s4Title: '4. Právní základ pro zpracování (čl. 6 GDPR)',
  s4ContractTitle: 'Plnění smlouvy (čl. 6 (1) (b)):',
  s4ContractBody: ' zpracování vašich převodů, správa vašeho účtu a provoz kreditního systému jsou nezbytné pro plnění smlouvy, kterou jste uzavřeli při registraci nebo nákupu.',
  s4InterestTitle: 'Oprávněný zájem (čl. 6 (1) (f)):',
  s4InterestBody: ' prevence podvodů, monitoring bezpečnosti, detekce zneužití, souhrnná analytika a zlepšování Služby. Provedli jsme test rovnováhy a zvážili vaše základní práva a svobody.',
  s4ConsentTitle: 'Souhlas (čl. 6 (1) (a)):',
  s4ConsentBody: ' marketingové e-maily, analytické cookies a jakékoli volitelné funkce, které jdou nad rámec přísné nezbytnosti. Souhlas je dán svobodně prostřednictvím cookie banneru nebo nastavení a může být kdykoli odvolán bez vlivu na zákonnost zpracování provedeného před odvoláním.',
  s4LegalTitle: 'Právní povinnost (čl. 6 (1) (c)):',
  s4LegalBody: ' uchovávání daňově relevantních záznamů podle § 147 AO (německý daňový zákon), reakce na zákonné žádosti od příslušných orgánů a jakákoli jiná povinnost uložená nám právem EU nebo Německa.',
  s5Title: '5. Cookies a podobné technologie',
  s5EssentialTitle: 'Esenciální cookies:',
  s5EssentialBody: ' váš autentizační token (httpOnly, SameSite=Strict), předvolba tématu, předvolba jazyka a stav souhlasu s cookies. Tyto jsou nezbytně nutné pro fungování Služby a nevyžadují souhlas podle § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Analytické cookies:',
  s5AnalyticsBody: ' nastavují se pouze s vaším výslovným souhlasem prostřednictvím cookie banneru. Pomáhají nám pochopit, jak je Služba používána v souhrnu. Souhlas můžete kdykoli odvolat a my odpovídající cookies smažeme.',
  s5MarketingTitle: 'Marketingové cookies:',
  s5MarketingBody: ' nastavují se pouze s vaším výslovným souhlasem. Používají se k personalizaci komunikace. Souhlas můžete kdykoli odvolat.',
  s5Manage: 'Předvolby cookies můžete kdykoli spravovat prostřednictvím ikony cookie v zápatí stránky. Nastavení prohlížeče vám navíc umožňují blokovat, mazat nebo omezovat cookies — nezapomeňte, že blokování esenciálních cookies vám zabrání v přihlášení nebo nákupech.',
  s6Title: '6. Sdílení dat s dílčími zpracovateli',
  s6Body: 'Osobní údaje sdílíme pouze s následujícími dílčími zpracovateli, z nichž každý je vázán smlouvou o zpracování osobních údajů v souladu s čl. 28 GDPR. Stripe Payments Europe Ltd. (Irsko) zpracovává platby; CloudConvert GmbH (Mnichov, Německo) zpracovává převody souborů; Supabase Inc. (USA, přenosy pokryté standardními smluvními doložkami EU) hostí naši databázi PostgreSQL; Railway Corp. (USA, SCC) hostí naši aplikaci; Resend (USA, SCC) doručuje transakční e-maily; OpenAI Ireland Ltd. zpracovává vstupy Smart Functions (audio/text); a Google LLC (USA, certifikováno podle EU-US Data Privacy Framework) poskytuje přihlášení Google OAuth. Vaše osobní údaje nikdy neprodáváme nikomu a nepřenášíme údaje třetím stranám pro jejich vlastní marketingové účely.',
  s7Title: '7. Uchovávání dat',
  s7Files: 'Soubory:',
  s7FilesBody: ' nahrané a převedené soubory jsou smazány do dvaceti čtyř (24) hodin od nahrání, bez ohledu na to, zda byly staženy.',
  s7Account: 'Údaje účtu:',
  s7AccountBody: ' uchovávány tak dlouho, dokud je váš účet aktivní. Když smažete svůj účet, všechny související údaje jsou odstraněny do třiceti (30) dnů, kromě záznamů, které jsme ze zákona povinni uchovávat.',
  s7Payment: 'Záznamy o platbách a fakturách:',
  s7PaymentBody: ' uchovávány po deset (10) let v souladu s § 147 AO (německý daňový zákon) pro daňovou a účetní shodu. Po této době jsou data nevratně smazána.',
  s7Logs: 'Server logy:',
  s7LogsBody: ' uchovávány po třicet (30) dnů pro bezpečnost, prevenci zneužití a vyšetřování incidentů, poté jsou automaticky vyčištěny.',
  s8Title: '8. Vaše práva podle GDPR',
  s8Intro: 'Máte rozsáhlá práva ohledně osobních údajů, které o vás zpracováváme:',
  s8Access: 'Právo na přístup (čl. 15):',
  s8AccessBody: ' můžete požadovat potvrzení, zda zpracováváme vaše údaje, a kopii těchto údajů.',
  s8Rect: 'Právo na opravu (čl. 16):',
  s8RectBody: ' nepřesné údaje můžete opravit přímo prostřednictvím své profilové stránky nebo nás kontaktovat.',
  s8Erase: 'Právo na výmaz / "právo být zapomenut" (čl. 17):',
  s8EraseBody: ' můžete požadovat smazání svého účtu a všech souvisejících osobních údajů, s výhradou právních povinností uchovávání, jako jsou daňové záznamy.',
  s8Port: 'Právo na přenositelnost údajů (čl. 20):',
  s8PortBody: ' můžete požadovat kopii svých údajů ve strukturovaném, běžně používaném, strojově čitelném formátu.',
  s8Restrict: 'Právo na omezení zpracování (čl. 18):',
  s8RestrictBody: ' můžete požadovat, abychom omezili zpracování vašich údajů, dokud nevyřešíme spor, neopravíme nepřesnost nebo neposoudíme právní nárok.',
  s8Object: 'Právo vznést námitku (čl. 21):',
  s8ObjectBody: ' můžete vznést námitku proti zpracování prováděnému na základě oprávněného zájmu, včetně profilování. Zastavíme, pokud nemůžeme prokázat naléhavé oprávněné důvody, které převažují nad vašimi zájmy.',
  s8Withdraw: 'Právo odvolat souhlas (čl. 7):',
  s8WithdrawBody: ' u jakéhokoli zpracování založeného na souhlasu můžete kdykoli odvolat bez vlivu na zákonnost zpracování prováděného před odvoláním.',
  s8Outro: 'Pro uplatnění kteréhokoli z těchto práv pošlete e-mail na Support@convertanyformat.com z adresy spojené s vaším účtem. Odpovíme do jednoho měsíce, prodlužitelný o další dva měsíce pro složité požadavky, jak povoluje čl. 12 (3) GDPR. Uplatnění vašich práv je bezplatné.',
  s9Title: '9. Bezpečnost dat',
  s9Body: 'Vaše osobní údaje chráníme pomocí technických a organizačních opatření v oborovém standardu: šifrování TLS 1.2+ pro všechna data v přenosu; bcrypt hashování hesel s nákladovým faktorem 10 nebo vyšším; httpOnly session cookies s atributem SameSite=Strict; princip nejmenšího privilegia pro interní přístup včetně auditních logů; pravidelné aktualizace závislostí pro řešení známých zranitelností; rate limiting a validace vstupu pro prevenci zneužití; a infrastruktura hostovaná poskytovateli s uznávanými certifikacemi (ISO 27001, SOC 2). V případě porušení osobních údajů ovlivňujícího vaše práva a svobody oznámíme příslušnému dozorovému úřadu do 72 hodin a budeme informovat dotčené uživatele bez zbytečného prodlení v souladu s čl. 33-34 GDPR.',
  s10Title: '10. Mezinárodní přenosy údajů',
  s10Body: 'Někteří z našich dílčích zpracovatelů sídlí mimo Evropský hospodářský prostor, hlavně ve Spojených státech. Pro každý takový přenos jsme implementovali příslušná opatření vyžadovaná kapitolou V GDPR. Přenosy do Stripe (Irsko) a CloudConvert (Německo) zůstávají v rámci EHP. Přenosy do Supabase, Railway, Resend a OpenAI (USA) se řídí standardními smluvními doložkami Evropské komise (Modul 2: správce-zpracovatel) doplněnými o další technická opatření včetně šifrování při přenosu a v klidu. Google LLC je navíc certifikován podle EU-US Data Privacy Framework, což poskytuje odpovídající úroveň ochrany ve smyslu čl. 45 GDPR.',
  s11Title: '11. Soukromí dětí',
  s11Body: 'Služba není určena dětem mladším šestnácti (16) let a vědomě neshromažďujeme osobní údaje od dětí mladších tohoto věku. Pokud jste rodič nebo zákonný zástupce a domníváte se, že nám dítě mladší 16 let poskytlo osobní údaje, kontaktujte nás na Support@convertanyformat.com a podnikneme kroky k rychlému smazání těchto údajů. Uživatelé mezi 16 a 18 lety prohlašují, že mají souhlas rodiče nebo zákonného zástupce, kde to vyžaduje země pobytu.',
  s12Title: '12. Změny těchto zásad ochrany osobních údajů',
  s12Body: 'Tyto zásady ochrany osobních údajů můžeme čas od času aktualizovat, aby odrážely změny v našich postupech, technologiích, které používáme, platných právních požadavcích nebo jiných provozních faktorech. Materiální změny budou oznámeny na vaši registrovanou e-mailovou adresu nejméně třicet (30) dní před jejich nabytím účinnosti. Nemateriální změny (oprava překlepů, formátování, vyjasňující doplnění) nabývají účinnosti zveřejněním. Datum "Naposledy aktualizováno" v horní části této stránky označuje, kdy byly Zásady naposledy revidovány. Pokračující používání Služby po datu účinnosti jakékoli změny představuje přijetí revidovaných Zásad.',
  s13Title: '13. Kontakt a právo podat stížnost',
  s13Body: 'Pro dotazy ohledně ochrany údajů, žádosti o uplatnění vašich práv GDPR nebo jakýkoli jiný problém související se soukromím, prosím napište na Support@convertanyformat.com. Snažíme se odpovídat do jednoho měsíce. Bez ohledu na jakýkoli jiný správní nebo soudní opravný prostředek máte podle čl. 77 GDPR právo podat stížnost u dozorového úřadu členského státu EU, kde žijete, pracujete nebo kde došlo k údajnému porušení. Příslušným dozorovým úřadem pro {{brand}} je Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Romanian (ro)
// =====================================================================
const roPrivacy = {
  title: 'Politica de confidențialitate',
  seoDesc: '{{brand}} Politica de confidențialitate. Manipulare a datelor conform GDPR: ce colectăm, baza legală, păstrare, sub-procesatori, drepturile dvs., transferuri internaționale.',
  updated: 'Ultima actualizare: mai 2026',
  s1Title: '1. Operatorul de date',
  s1Body: 'Operatorul de date responsabil pentru datele personale prelucrate prin {{brand}} ("Serviciul") este Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Germania. Pentru toate întrebările legate de protecția datelor — inclusiv cererile de a vă exercita drepturile conform Regulamentului General privind Protecția Datelor (GDPR) — vă rugăm să ne contactați prin e-mail la Support@convertanyformat.com. Deoarece nu îndeplinim pragurile din art. 37 GDPR sau § 38 BDSG, nu suntem obligați să numim un responsabil cu protecția datelor; operatorul gestionează direct toate problemele de protecție a datelor. Această politică de confidențialitate explică ce date colectăm, de ce, pe ce bază legală, cu cine le împărtășim, cât timp le păstrăm și ce drepturi aveți.',
  s2Title: '2. Date personale pe care le colectăm',
  s2Account: 'Date despre cont:',
  s2AccountBody: ' adresa dvs. de e-mail, nume de afișare opțional, un hash bcrypt al parolei dvs. (niciodată parola în sine), identificatorul contului Google când vă conectați prin OAuth, preferințele contului (temă, limbă, setări de notificare) și un cod de recomandare, dacă este cazul.',
  s2Usage: 'Date de utilizare:',
  s2UsageBody: ' istoricul conversiilor (numele fișierului, formatul de intrare/ieșire, marcaj temporal, stare), soldul de credite și jurnalul tranzacțiilor, statistici de utilizare a instrumentelor, adresa IP și locația aproximativă derivată din IP pentru prevenirea fraudei.',
  s2Payment: 'Date de plată:',
  s2PaymentBody: ' procesate complet de Stripe Payments Europe Ltd. Primim doar un identificator de client Stripe, ultimele patru cifre ale cardului, marca cardului și o confirmare de tranzacție. Nu vedem și nu stocăm niciodată numerele complete ale cardurilor, CVC-urile sau acreditările bancare.',
  s2File: 'Date despre fișiere:',
  s2FileBody: ' fișierele pe care le încărcați pentru conversie sunt stocate doar pentru durata necesară furnizării Serviciului și sunt șterse automat în termen de douăzeci și patru de ore. Nu accesăm, nu citim și nu analizăm conținutul fișierelor dvs. decât în măsura strict necesară pentru a efectua conversia solicitată.',
  s2Tech: 'Date tehnice:',
  s2TechBody: ' tipul și versiunea browserului, sistemul de operare, tipul dispozitivului, URL-ul de referință, preferința de limbă și identificatorii cookie-urilor. Colectate automat pentru securitate, prevenirea abuzului și furnizarea unui Serviciu funcțional.',
  s3Title: '3. Scopurile prelucrării',
  s3Body: 'Prelucrăm date personale în următoarele scopuri: (a) operarea Serviciului, inclusiv livrarea conversiilor solicitate, gestionarea contului dvs. și contabilizarea soldurilor de credite; (b) procesarea plăților și emiterea de facturi conforme fiscale prin Stripe; (c) trimiterea de e-mailuri tranzacționale, cum ar fi verificarea contului, resetarea parolei, notificările de finalizare a conversiei la care v-ați abonat și anunțuri privind starea Serviciului; (d) răspunsul la întrebările de asistență și rezolvarea disputelor; (e) analiza utilizării agregate, neidentificatoare pentru îmbunătățirea Serviciului; (f) prevenirea fraudei, abuzului și accesului neautorizat; și (g) respectarea obligațiilor legale, inclusiv păstrarea înregistrărilor fiscale.',
  s4Title: '4. Baza legală pentru prelucrare (art. 6 GDPR)',
  s4ContractTitle: 'Executarea contractului (art. 6 (1) (b)):',
  s4ContractBody: ' procesarea conversiilor dvs., gestionarea contului dvs. și operarea sistemului de credite sunt necesare pentru executarea contractului pe care l-ați încheiat când v-ați înregistrat sau ați făcut o achiziție.',
  s4InterestTitle: 'Interes legitim (art. 6 (1) (f)):',
  s4InterestBody: ' prevenirea fraudei, monitorizarea securității, detectarea abuzului, analize agregate și îmbunătățirea Serviciului. Am efectuat un test de echilibrare și am luat în considerare drepturile și libertățile dvs. fundamentale.',
  s4ConsentTitle: 'Consimțământ (art. 6 (1) (a)):',
  s4ConsentBody: ' e-mailuri de marketing, cookie-uri analitice și orice funcții opționale care depășesc strictul necesar. Consimțământul este dat liber prin bannerul de cookie-uri sau setări și poate fi retras oricând fără a afecta legalitatea prelucrării efectuate înainte de retragere.',
  s4LegalTitle: 'Obligație legală (art. 6 (1) (c)):',
  s4LegalBody: ' păstrarea înregistrărilor relevante fiscal conform § 147 AO (Codul Fiscal German), răspunsul la cererile legale ale autorităților competente și orice altă obligație impusă de legea UE sau germană.',
  s5Title: '5. Cookie-uri și tehnologii similare',
  s5EssentialTitle: 'Cookie-uri esențiale:',
  s5EssentialBody: ' tokenul de autentificare (httpOnly, SameSite=Strict), preferința de temă, preferința de limbă și starea consimțământului pentru cookie-uri. Acestea sunt strict necesare pentru funcționarea Serviciului și nu necesită consimțământ conform § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Cookie-uri analitice:',
  s5AnalyticsBody: ' setate doar cu consimțământul dvs. expres prin bannerul de cookie-uri. Ne ajută să înțelegem cum este utilizat Serviciul în mod agregat. Puteți retrage consimțământul oricând, iar noi vom șterge cookie-urile corespunzătoare.',
  s5MarketingTitle: 'Cookie-uri de marketing:',
  s5MarketingBody: ' setate doar cu consimțământul dvs. expres. Folosite pentru a personaliza comunicările. Puteți retrage consimțământul oricând.',
  s5Manage: 'Puteți gestiona preferințele de cookie-uri oricând prin pictograma cookie din subsolul paginii. Setările browserului vă permit, în plus, să blocați, ștergeți sau restricționați cookie-urile — rețineți că blocarea cookie-urilor esențiale vă va împiedica să vă conectați sau să faceți achiziții.',
  s6Title: '6. Partajarea datelor cu sub-procesatorii',
  s6Body: 'Partajăm datele personale doar cu următorii sub-procesatori, fiecare angajat în baza unui Acord de Procesare a Datelor conform art. 28 GDPR. Stripe Payments Europe Ltd. (Irlanda) gestionează procesarea plăților; CloudConvert GmbH (München, Germania) procesează conversiile de fișiere; Supabase Inc. (Statele Unite, transferuri acoperite de Clauzele Contractuale Standard ale UE) găzduiește baza noastră de date PostgreSQL; Railway Corp. (Statele Unite, SCC) găzduiește aplicația noastră; Resend (Statele Unite, SCC) livrează e-mailuri tranzacționale; OpenAI Ireland Ltd. procesează intrările Smart Functions (audio/text); și Google LLC (Statele Unite, certificat conform EU-US Data Privacy Framework) oferă autentificare Google OAuth. Nu vindem niciodată datele dvs. personale nimănui și nu transferăm date terților pentru propriile lor scopuri de marketing.',
  s7Title: '7. Păstrarea datelor',
  s7Files: 'Fișiere:',
  s7FilesBody: ' fișierele încărcate și convertite sunt șterse în termen de douăzeci și patru (24) de ore de la încărcare, indiferent dacă au fost descărcate.',
  s7Account: 'Date despre cont:',
  s7AccountBody: ' păstrate cât timp contul dvs. este activ. Când vă ștergeți contul, toate datele asociate sunt eliminate în termen de treizeci (30) de zile, cu excepția înregistrărilor pe care suntem obligați legal să le păstrăm.',
  s7Payment: 'Înregistrări de plată și factură:',
  s7PaymentBody: ' păstrate pentru zece (10) ani în conformitate cu § 147 AO (Codul Fiscal German) pentru conformitatea fiscală și contabilă. După această perioadă, datele sunt șterse irevocabil.',
  s7Logs: 'Jurnalele serverului:',
  s7LogsBody: ' păstrate timp de treizeci (30) de zile pentru securitate, prevenirea abuzului și investigarea incidentelor, după care sunt curățate automat.',
  s8Title: '8. Drepturile dvs. conform GDPR',
  s8Intro: 'Aveți drepturi extinse cu privire la datele personale pe care le procesăm despre dvs.:',
  s8Access: 'Dreptul de acces (art. 15):',
  s8AccessBody: ' puteți solicita confirmarea dacă vă procesăm datele și o copie a acelor date.',
  s8Rect: 'Dreptul la rectificare (art. 16):',
  s8RectBody: ' puteți corecta datele inexacte direct prin pagina dvs. de profil sau contactându-ne.',
  s8Erase: 'Dreptul la ștergere / "dreptul de a fi uitat" (art. 17):',
  s8EraseBody: ' puteți solicita ștergerea contului dvs. și a tuturor datelor personale asociate, sub rezerva obligațiilor legale de păstrare, cum ar fi înregistrările fiscale.',
  s8Port: 'Dreptul la portabilitatea datelor (art. 20):',
  s8PortBody: ' puteți solicita o copie a datelor dvs. într-un format structurat, utilizat în mod obișnuit, citibil de mașină.',
  s8Restrict: 'Dreptul la restricționarea prelucrării (art. 18):',
  s8RestrictBody: ' puteți solicita să restricționăm prelucrarea datelor dvs. în timp ce rezolvăm o dispută, corectăm o inexactitate sau evaluăm o pretenție legală.',
  s8Object: 'Dreptul de a obiecta (art. 21):',
  s8ObjectBody: ' puteți obiecta la prelucrarea efectuată pe baza intereselor legitime, inclusiv profilarea. Vom opri, cu excepția cazului în care putem demonstra motive legitime convingătoare care prevalează asupra intereselor dvs.',
  s8Withdraw: 'Dreptul de a retrage consimțământul (art. 7):',
  s8WithdrawBody: ' pentru orice prelucrare bazată pe consimțământ, puteți retrage oricând fără a afecta legalitatea prelucrării efectuate înainte de retragere.',
  s8Outro: 'Pentru a exercita oricare dintre aceste drepturi, trimiteți un e-mail la Support@convertanyformat.com de la adresa asociată contului dvs. Vom răspunde în termen de o lună, prelungibilă cu încă două luni pentru cereri complexe, după cum permite art. 12 (3) GDPR. Exercitarea drepturilor dvs. este gratuită.',
  s9Title: '9. Securitatea datelor',
  s9Body: 'Vă protejăm datele personale folosind măsuri tehnice și organizatorice standard în industrie: criptare TLS 1.2+ pentru toate datele în tranzit; hashing parolă bcrypt cu un factor de cost de 10 sau mai mare; cookie-uri de sesiune httpOnly cu atributul SameSite=Strict; principiul celui mai mic privilegiu pentru accesul intern, inclusiv jurnalele de audit; actualizări regulate ale dependențelor pentru a aborda vulnerabilitățile cunoscute; limitarea ratei și validarea intrării pentru a preveni abuzul; și infrastructură găzduită de furnizori cu certificări recunoscute (ISO 27001, SOC 2). În cazul unei încălcări a datelor personale care vă afectează drepturile și libertățile, vom notifica autoritatea de supraveghere competentă în termen de 72 de ore și vom informa utilizatorii afectați fără întârziere nejustificată, în conformitate cu art. 33-34 GDPR.',
  s10Title: '10. Transferuri internaționale de date',
  s10Body: 'Unii dintre sub-procesatorii noștri au sediul în afara Spațiului Economic European, în principal în Statele Unite. Pentru fiecare astfel de transfer am implementat garanțiile corespunzătoare cerute de Capitolul V GDPR. Transferurile către Stripe (Irlanda) și CloudConvert (Germania) rămân în SEE. Transferurile către Supabase, Railway, Resend și OpenAI (Statele Unite) sunt guvernate de Clauzele Contractuale Standard ale Comisiei Europene (Modul 2: operator-procesator) suplimentate de garanții tehnice suplimentare, inclusiv criptare în tranzit și în repaus. Google LLC este, în plus, certificat conform EU-US Data Privacy Framework, oferind un nivel adecvat de protecție în sensul art. 45 GDPR.',
  s11Title: '11. Confidențialitatea copiilor',
  s11Body: 'Serviciul nu este destinat copiilor sub șaisprezece (16) ani și nu colectăm cu bună știință date personale de la copii sub această vârstă. Dacă sunteți părinte sau tutore legal și credeți că un copil sub 16 ani ne-a furnizat date personale, vă rugăm să ne contactați la Support@convertanyformat.com și vom lua măsuri pentru a șterge acele date prompt. Utilizatorii între 16 și 18 ani declară că au consimțământul unui părinte sau tutore legal, unde este cerut de țara de rezidență.',
  s12Title: '12. Modificări ale acestei politici de confidențialitate',
  s12Body: 'Putem actualiza această politică de confidențialitate din când în când pentru a reflecta modificări ale practicilor noastre, ale tehnologiilor pe care le folosim, ale cerințelor legale aplicabile sau ale altor factori operaționali. Modificările materiale vor fi notificate la adresa dvs. de e-mail înregistrată cu cel puțin treizeci (30) de zile înainte de intrarea lor în vigoare. Modificările nemateriale (corecții de greșeli, formatare, adăugări de clarificare) intră în vigoare la publicare. Data "Ultima actualizare" din partea de sus a acestei pagini indică momentul în care politica a fost ultima oară revizuită. Utilizarea continuă a Serviciului după data efectivă a oricărei modificări constituie acceptarea politicii revizuite.',
  s13Title: '13. Contact și dreptul de a depune o plângere',
  s13Body: 'Pentru întrebări privind protecția datelor, cereri de exercitare a drepturilor dvs. GDPR sau orice altă preocupare legată de confidențialitate, vă rugăm să trimiteți un e-mail la Support@convertanyformat.com. Ne propunem să răspundem în termen de o lună. Fără a aduce atingere oricărei alte căi administrative sau judiciare de atac, aveți dreptul, conform art. 77 GDPR, de a depune o plângere la autoritatea de supraveghere a statului membru UE în care locuiți, lucrați sau în care a avut loc presupusa încălcare. Autoritatea de supraveghere competentă pentru {{brand}} este Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
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

const PAYLOADS = { da: daPrivacy, fi: fiPrivacy, cs: csPrivacy, ro: roPrivacy };

for (const [lang, privacy] of Object.entries(PAYLOADS)) {
  const block = findLangBlock(content, lang);
  content = replaceTopLevelKey(content, 'privacy', privacy, block.start, block.end);
  console.log(`✔ Updated ${lang}.privacy`);
}

fs.writeFileSync(FILE, content);
console.log('\nPrivacy done for da/fi/cs/ro (4 of 7).');
