// Chunk 3b of 3 (final): replaces the entire `privacy` block in nl/pl/sv/no.
// After this script the audit should report 100% coverage in all 10
// supported languages.
//
// Run from repo root:  node scripts/fill-gap-3b-privacy.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

// =====================================================================
// Dutch
// =====================================================================
const nlPrivacy = {
  title: 'Privacybeleid',
  seoDesc: 'Privacybeleid van {{brand}}. AVG-conforme gegevensverwerking: wat we verzamelen, rechtsgrond, bewaartermijnen, sub-verwerkers, jouw rechten, internationale doorgiften.',
  updated: 'Laatst bijgewerkt: mei 2026',
  s1Title: '1. Verwerkingsverantwoordelijke',
  s1Body: 'De verwerkingsverantwoordelijke voor persoonsgegevens die via {{brand}} (de "Service") worden verwerkt is Arwand Moobed Mehdiabadi, Volmerswerther Str. 346, 40221 Düsseldorf, Duitsland. Voor alle privacy-gerelateerde vragen — inclusief verzoeken om je rechten onder de Algemene Verordening Gegevensbescherming (AVG) uit te oefenen — neem contact met ons op via support@convertanyformat.com. Aangezien we de drempelwaarden van Art. 37 AVG of § 38 BDSG niet halen, zijn we niet verplicht een Functionaris voor Gegevensbescherming aan te stellen; de verwerkingsverantwoordelijke behandelt alle privacy-aangelegenheden persoonlijk. Dit Privacybeleid legt uit welke gegevens we verzamelen, waarom, op welke rechtsgrond, met wie we ze delen, hoe lang we ze bewaren en welke rechten je hebt.',
  s2Title: '2. Welke persoonsgegevens we verzamelen',
  s2Account: 'Accountgegevens:',
  s2AccountBody: ' jouw e-mailadres, optionele weergavenaam, een bcrypt-hash van je wachtwoord (nooit het wachtwoord zelf), Google-account-ID bij aanmelden via OAuth, accountvoorkeuren (thema, taal, meldingen) en een verwijscode indien van toepassing.',
  s2Usage: 'Gebruiksgegevens:',
  s2UsageBody: ' conversiegeschiedenis (bestandsnaam, invoer-/uitvoerformaat, tijdstempel, status), creditsaldo en transactielogboek, statistieken van gebruik van tools, IP-adres en bij benadering uit het IP-adres afgeleide locatie ten behoeve van fraudepreventie.',
  s2Payment: 'Betaalgegevens:',
  s2PaymentBody: ' volledig verwerkt door Stripe Payments Europe Ltd. We ontvangen alleen een Stripe-klant-ID, de laatste vier cijfers van de kaart, het kaartmerk en een transactiebevestiging. We zien of bewaren nooit volledige kaartnummers, CVCs of bankgegevens.',
  s2File: 'Bestandsgegevens:',
  s2FileBody: ' de bestanden die je voor conversie uploadt worden alleen opgeslagen voor de duur die nodig is om de Service te leveren en worden binnen vierentwintig uur automatisch verwijderd. We benaderen, lezen of analyseren de inhoud van je bestanden niet, behoudens voor zover strikt noodzakelijk om de aangevraagde conversie uit te voeren.',
  s2Tech: 'Technische gegevens:',
  s2TechBody: ' browsertype en -versie, besturingssysteem, apparaattype, verwijzende URL, taalvoorkeur en cookie-identificatoren. Automatisch verzameld voor beveiliging, misbruikpreventie en levering van de Service.',
  s3Title: '3. Doeleinden van de verwerking',
  s3Body: 'We verwerken persoonsgegevens voor de volgende doeleinden: (a) levering van de Service inclusief uitvoering van de aangevraagde conversies, accountbeheer en bijhouden van het creditsaldo; (b) verwerking van betalingen en uitgifte van fiscaal conforme facturen via Stripe; (c) verzending van transactionele e-mails zoals accountverificatie, wachtwoordherstel, conversievoltooiingsmeldingen waarvoor je je hebt aangemeld en service-statusberichten; (d) afhandeling van supportvragen en het oplossen van geschillen; (e) geaggregeerde, niet-identificerende gebruiksanalyse om de Service te verbeteren; (f) preventie van fraude, misbruik en onbevoegde toegang; en (g) naleving van wettelijke verplichtingen waaronder fiscale bewaarplichten.',
  s4Title: '4. Rechtsgrond voor de verwerking (Art. 6 AVG)',
  s4ContractTitle: 'Uitvoering van de overeenkomst (Art. 6 (1) (b)):',
  s4ContractBody: ' de verwerking van je conversies, het beheer van je account en de werking van het credit-systeem zijn nodig om de overeenkomst uit te voeren die je bij registratie of aankoop bent aangegaan.',
  s4InterestTitle: 'Gerechtvaardigd belang (Art. 6 (1) (f)):',
  s4InterestBody: ' fraudepreventie, beveiligingsmonitoring, misbruikdetectie, geaggregeerde analyses en serviceverbetering. We hebben een belangenafweging uitgevoerd waarin je grondrechten en fundamentele vrijheden zijn betrokken.',
  s4ConsentTitle: 'Toestemming (Art. 6 (1) (a)):',
  s4ConsentBody: ' marketing-e-mails, analytische cookies en optionele functies die verder gaan dan strikt noodzakelijk. Toestemming wordt vrijwillig gegeven via de cookiebanner of instellingen en kan op elk moment worden ingetrokken zonder afbreuk te doen aan de rechtmatigheid van de verwerking voorafgaand aan de intrekking.',
  s4LegalTitle: 'Wettelijke verplichting (Art. 6 (1) (c)):',
  s4LegalBody: ' bewaring van fiscaal relevante gegevens conform § 147 AO (Duitse Algemene Belastingverordening), beantwoording van rechtmatige verzoeken van bevoegde autoriteiten en eventuele andere verplichtingen op grond van EU- of Duits recht.',
  s5Title: '5. Cookies en vergelijkbare technologieën',
  s5EssentialTitle: 'Essentiële cookies:',
  s5EssentialBody: ' jouw authenticatietoken (httpOnly, SameSite=Strict), themavoorkeur, taalvoorkeur en cookie-toestemmingsstatus. Strikt noodzakelijk voor het functioneren van de Service en niet toestemmingsplichtig op grond van § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Analytische cookies:',
  s5AnalyticsBody: ' alleen geplaatst met je uitdrukkelijke opt-in via de cookiebanner. Helpen ons begrijpen hoe de Service in het algemeen wordt gebruikt. Je kunt je toestemming op elk moment intrekken; we verwijderen dan de bijbehorende cookies.',
  s5MarketingTitle: 'Marketing-cookies:',
  s5MarketingBody: ' alleen geplaatst met je uitdrukkelijke opt-in. Voor het personaliseren van communicatie. Je kunt je toestemming op elk moment intrekken.',
  s5Manage: 'Je kunt je cookievoorkeuren op elk moment beheren via het cookie-icoon in de voettekst. Browserinstellingen laten je daarnaast cookies blokkeren, verwijderen of beperken — let op dat het blokkeren van essentiële cookies inloggen of aankopen verhindert.',
  s6Title: '6. Gegevens delen met sub-verwerkers',
  s6Body: 'We delen persoonsgegevens uitsluitend met de volgende sub-verwerkers, ieder onder een Verwerkersovereenkomst conform Art. 28 AVG. Stripe Payments Europe Ltd. (Ierland) verwerkt betalingen; CloudConvert GmbH (München, Duitsland) verwerkt bestandsconversies; Supabase Inc. (Verenigde Staten, doorgiften gedekt door EU-Standaardcontractbepalingen) host onze PostgreSQL-database; Railway Corp. (Verenigde Staten, SCCs) host onze applicatie; Resend (Verenigde Staten, SCCs) levert transactionele e-mails af; OpenAI Ireland Ltd. verwerkt invoer voor Smart Functions (audio/tekst); en Google LLC (Verenigde Staten, gecertificeerd onder het EU-US Data Privacy Framework) verzorgt de Google OAuth-aanmelding. We verkopen je persoonsgegevens nooit en geven ze niet door aan derden voor hun eigen marketingdoeleinden.',
  s7Title: '7. Bewaartermijnen',
  s7Files: 'Bestanden:',
  s7FilesBody: ' geüploade en geconverteerde bestanden worden binnen vierentwintig (24) uur na de upload verwijderd, ongeacht of ze zijn gedownload.',
  s7Account: 'Accountgegevens:',
  s7AccountBody: ' bewaard zolang je account actief is. Wanneer je je account verwijdert, worden alle bijbehorende gegevens binnen dertig (30) dagen verwijderd, met uitzondering van gegevens die we wettelijk moeten bewaren.',
  s7Payment: 'Betalings- en factuurgegevens:',
  s7PaymentBody: ' bewaard voor tien (10) jaar conform § 147 AO (Duitse Algemene Belastingverordening) om aan fiscale en boekhoudkundige verplichtingen te voldoen. Na deze periode worden de gegevens onomkeerbaar verwijderd.',
  s7Logs: 'Server-logs:',
  s7LogsBody: ' bewaard voor dertig (30) dagen voor beveiliging, misbruikpreventie en incidentonderzoek, daarna automatisch gewist.',
  s8Title: '8. Jouw rechten onder de AVG',
  s8Intro: 'Je hebt uitgebreide rechten met betrekking tot de persoonsgegevens die we over jou verwerken:',
  s8Access: 'Recht van inzage (Art. 15):',
  s8AccessBody: ' je kunt bevestiging vragen of we jouw gegevens verwerken en een kopie van die gegevens.',
  s8Rect: 'Recht op rectificatie (Art. 16):',
  s8RectBody: ' je kunt onjuiste gegevens rechtstreeks via je profielpagina of door contact met ons op te nemen laten corrigeren.',
  s8Erase: 'Recht op gegevenswissing / "recht op vergetelheid" (Art. 17):',
  s8EraseBody: ' je kunt verwijdering van je account en alle bijbehorende persoonsgegevens vragen, onverminderd wettelijke bewaartermijnen zoals fiscale registers.',
  s8Port: 'Recht op gegevensoverdraagbaarheid (Art. 20):',
  s8PortBody: ' je kunt een kopie van je gegevens vragen in een gestructureerd, gangbaar en machineleesbaar formaat.',
  s8Restrict: 'Recht op beperking van de verwerking (Art. 18):',
  s8RestrictBody: ' je kunt vragen dat we de verwerking van je gegevens beperken terwijl we een geschil oplossen, een onjuistheid corrigeren of een rechtsvordering beoordelen.',
  s8Object: 'Recht van bezwaar (Art. 21):',
  s8ObjectBody: ' je kunt bezwaar maken tegen verwerking op basis van gerechtvaardigd belang, inclusief profilering. We zullen stoppen tenzij we dwingende gerechtvaardigde gronden kunnen aantonen die zwaarder wegen dan jouw belangen.',
  s8Withdraw: 'Recht om toestemming in te trekken (Art. 7):',
  s8WithdrawBody: ' voor verwerking op basis van toestemming kun je deze op elk moment intrekken zonder afbreuk te doen aan de rechtmatigheid van de verwerking voorafgaand aan de intrekking.',
  s8Outro: 'Om enig recht uit te oefenen, schrijf naar support@convertanyformat.com vanaf het bij je account horende e-mailadres. We reageren binnen één maand, met de mogelijkheid van twee maanden verlenging voor complexe verzoeken zoals toegestaan onder Art. 12 (3) AVG. Het uitoefenen van je rechten is kosteloos.',
  s9Title: '9. Gegevensbeveiliging',
  s9Body: 'We beschermen je persoonsgegevens met technische en organisatorische maatregelen die voldoen aan de stand der techniek: TLS 1.2+-encryptie voor alle gegevens in transit; bcrypt wachtwoord-hashing met een cost factor van minimaal 10; httpOnly sessiecookies met SameSite=Strict; principe van minimale rechten voor interne toegang inclusief audit-logging; regelmatige updates van afhankelijkheden om bekende kwetsbaarheden te dichten; rate limiting en invoervalidatie tegen misbruik; en infrastructuur die bij aanbieders met erkende certificeringen wordt gehost (ISO 27001, SOC 2). We scheiden bestandsopslag (kortdurend, 24 uur) logisch en fysiek van de accountdatabase (langdurig, versleuteld in rust). Beveiligingsincidenten worden gelogd en periodiek beoordeeld. Ondanks alle maatregelen kan geen enkele over het internet verzonden informatie met absolute zekerheid worden beveiligd — we beschermen je gegevens met commercieel redelijke middelen. Bij een meldplichtige inbreuk informeren we de bevoegde toezichthoudende autoriteit binnen 72 uur en getroffen gebruikers zonder onnodige vertraging conform Art. 33-34 AVG.',
  s10Title: '10. Internationale gegevensoverdrachten',
  s10Body: 'Sommige van onze sub-verwerkers zijn gevestigd buiten de Europese Economische Ruimte, voornamelijk in de Verenigde Staten. Voor elke doorgifte hebben we de in Hoofdstuk V AVG vereiste passende waarborgen ingericht. Doorgiften aan Stripe (Ierland) en CloudConvert (Duitsland) blijven binnen de EER. Doorgiften aan Supabase, Railway, Resend en OpenAI (Verenigde Staten) vallen onder de modelcontractbepalingen van de Europese Commissie (Module 2: verwerkingsverantwoordelijke-verwerker), aangevuld met aanvullende technische waarborgen zoals encryptie in transit en in rust. Google LLC is daarnaast gecertificeerd onder het EU-US Data Privacy Framework, hetgeen een passend beschermingsniveau biedt in de zin van Art. 45 AVG.',
  s11Title: '11. Privacy van kinderen',
  s11Body: 'De Service is niet gericht op kinderen onder zestien (16) jaar, en we verzamelen niet bewust persoonsgegevens van kinderen onder die leeftijd. Als je ouder of wettelijk voogd bent en gelooft dat een kind onder 16 ons persoonsgegevens heeft verstrekt, neem contact op via support@convertanyformat.com en we zullen die gegevens onmiddellijk verwijderen. Gebruikers tussen 16 en 18 jaar verklaren toestemming van een ouder of wettelijk voogd te hebben waar de wet van hun land van verblijf dat vereist.',
  s12Title: '12. Wijzigingen in dit Privacybeleid',
  s12Body: 'We kunnen dit Privacybeleid van tijd tot tijd bijwerken om wijzigingen in onze praktijken, gebruikte technologieën, geldende juridische vereisten of andere operationele factoren weer te geven. Materiële wijzigingen worden ten minste dertig (30) dagen voor inwerkingtreding aan je geregistreerde e-mailadres gemeld. Niet-materiële wijzigingen (typefoutcorrecties, opmaak, verduidelijkende toevoegingen) treden in werking bij publicatie. De datum "Laatst bijgewerkt" bovenaan deze pagina geeft aan wanneer het Beleid voor het laatst is herzien. Voortgezet gebruik van de Service na de ingangsdatum van een wijziging geldt als aanvaarding van het herziene Beleid.',
  s13Title: '13. Contact en recht om een klacht in te dienen',
  s13Body: 'Voor privacy-vragen, verzoeken om je AVG-rechten uit te oefenen of andere privacy-gerelateerde zorgen, schrijf naar support@convertanyformat.com. We streven naar een reactie binnen één maand. Onverminderd andere bestuursrechtelijke of gerechtelijke beroepen heb je op grond van Art. 77 AVG het recht een klacht in te dienen bij de toezichthoudende autoriteit van de EU-lidstaat waar je woont, werkt of waar de vermeende inbreuk heeft plaatsgevonden. De bevoegde toezichthoudende autoriteit voor {{brand}} is de Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Polish
// =====================================================================
const plPrivacy = {
  title: 'Polityka Prywatności',
  seoDesc: 'Polityka Prywatności {{brand}}. Przetwarzanie danych zgodne z RODO: co zbieramy, podstawa prawna, retencja, podmioty przetwarzające, Twoje prawa, transfery międzynarodowe.',
  updated: 'Ostatnia aktualizacja: maj 2026',
  s1Title: '1. Administrator danych',
  s1Body: 'Administratorem danych osobowych przetwarzanych za pośrednictwem {{brand}} ("Usługi") jest Arwand Moobed Mehdiabadi, Volmerswerther Str. 346, 40221 Düsseldorf, Niemcy. We wszystkich kwestiach związanych z ochroną danych — w tym żądaniach skorzystania z praw wynikających z Ogólnego Rozporządzenia o Ochronie Danych (RODO) — prosimy o kontakt mailowy pod adresem support@convertanyformat.com. Ponieważ nie spełniamy progów określonych w art. 37 RODO ani w § 38 BDSG, nie jesteśmy zobowiązani do wyznaczenia Inspektora Ochrony Danych; administrator osobiście zajmuje się wszystkimi sprawami związanymi z ochroną danych. Niniejsza Polityka wyjaśnia, jakie dane zbieramy, dlaczego, na jakiej podstawie prawnej, z kim je dzielimy, jak długo je przechowujemy i jakie masz prawa.',
  s2Title: '2. Jakie dane osobowe zbieramy',
  s2Account: 'Dane konta:',
  s2AccountBody: ' Twój adres e-mail, opcjonalna nazwa wyświetlana, hash bcrypt Twojego hasła (nigdy samego hasła), identyfikator konta Google przy logowaniu przez OAuth, preferencje konta (motyw, język, powiadomienia) oraz kod polecający, jeśli dotyczy.',
  s2Usage: 'Dane użytkowania:',
  s2UsageBody: ' historia konwersji (nazwa pliku, format wejściowy/wyjściowy, znacznik czasu, status), saldo kredytów i dziennik transakcji, statystyki użytkowania narzędzi, adres IP oraz przybliżona lokalizacja wynikająca z IP w celu zapobiegania oszustwom.',
  s2Payment: 'Dane płatności:',
  s2PaymentBody: ' przetwarzane w całości przez Stripe Payments Europe Ltd. Otrzymujemy tylko identyfikator klienta Stripe, ostatnie cztery cyfry karty, markę karty oraz potwierdzenie transakcji. Nigdy nie widzimy ani nie przechowujemy pełnych numerów kart, kodów CVC ani danych bankowych.',
  s2File: 'Dane plików:',
  s2FileBody: ' pliki przesyłane do konwersji są przechowywane wyłącznie przez czas niezbędny do świadczenia Usługi i są automatycznie usuwane w ciągu dwudziestu czterech godzin. Nie uzyskujemy dostępu, nie czytamy ani nie analizujemy zawartości Twoich plików, z wyjątkiem przypadków ściśle koniecznych do wykonania zamówionej konwersji.',
  s2Tech: 'Dane techniczne:',
  s2TechBody: ' typ i wersja przeglądarki, system operacyjny, typ urządzenia, URL odsyłający, preferencja językowa oraz identyfikatory plików cookie. Zbierane automatycznie w celach bezpieczeństwa, zapobiegania nadużyciom oraz świadczenia Usługi.',
  s3Title: '3. Cele przetwarzania',
  s3Body: 'Przetwarzamy dane osobowe w następujących celach: (a) świadczenie Usługi, w tym realizacja zamówionych konwersji, zarządzanie kontem oraz księgowanie kredytów; (b) obsługa płatności i wystawianie zgodnych podatkowo faktur za pośrednictwem Stripe; (c) wysyłka transakcyjnych e-maili takich jak weryfikacja konta, reset hasła, powiadomienia o ukończeniu konwersji (po zapisie) oraz komunikaty o stanie Usługi; (d) odpowiadanie na zapytania pomocy technicznej i rozwiązywanie sporów; (e) analizowanie zagregowanych, nieidentyfikujących statystyk użytkowania w celu poprawy Usługi; (f) zapobieganie oszustwom, nadużyciom i nieautoryzowanemu dostępowi; oraz (g) wypełnianie obowiązków prawnych, w tym przechowywania dokumentacji podatkowej.',
  s4Title: '4. Podstawa prawna przetwarzania (Art. 6 RODO)',
  s4ContractTitle: 'Wykonanie umowy (Art. 6 (1) (b)):',
  s4ContractBody: ' przetwarzanie konwersji, zarządzanie kontem i obsługa systemu kredytów są niezbędne do wykonania umowy zawartej w momencie rejestracji lub zakupu.',
  s4InterestTitle: 'Prawnie uzasadniony interes (Art. 6 (1) (f)):',
  s4InterestBody: ' zapobieganie oszustwom, monitorowanie bezpieczeństwa, wykrywanie nadużyć, analiza zagregowana i poprawa Usługi. Przeprowadziliśmy test równowagi i uwzględniliśmy Twoje podstawowe prawa i wolności.',
  s4ConsentTitle: 'Zgoda (Art. 6 (1) (a)):',
  s4ConsentBody: ' e-maile marketingowe, analityczne pliki cookie oraz wszelkie funkcje opcjonalne wykraczające poza ścisłą konieczność. Zgoda jest udzielana dobrowolnie poprzez baner cookie lub ustawienia i może zostać wycofana w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania przed wycofaniem.',
  s4LegalTitle: 'Obowiązek prawny (Art. 6 (1) (c)):',
  s4LegalBody: ' przechowywanie dokumentacji istotnej podatkowo zgodnie z § 147 AO (niemiecki Kodeks Podatkowy), odpowiadanie na uprawnione wnioski właściwych organów oraz inne obowiązki nałożone prawem UE lub niemieckim.',
  s5Title: '5. Pliki cookie i podobne technologie',
  s5EssentialTitle: 'Pliki cookie niezbędne:',
  s5EssentialBody: ' Twój token uwierzytelniający (httpOnly, SameSite=Strict), preferencja motywu, preferencja języka oraz status zgody na cookies. Ściśle niezbędne do działania Usługi i nie wymagają zgody zgodnie z § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Pliki cookie analityczne:',
  s5AnalyticsBody: ' ustawiane wyłącznie po Twojej wyraźnej zgodzie poprzez baner cookie. Pomagają nam zrozumieć, jak Usługa jest używana w ujęciu zagregowanym. Możesz wycofać zgodę w dowolnym momencie, a my usuniemy odpowiednie pliki cookie.',
  s5MarketingTitle: 'Pliki cookie marketingowe:',
  s5MarketingBody: ' ustawiane wyłącznie po Twojej wyraźnej zgodzie. Używane do personalizacji komunikacji. Możesz wycofać zgodę w dowolnym momencie.',
  s5Manage: 'Możesz zarządzać preferencjami cookies w dowolnym momencie poprzez ikonę cookie w stopce strony. Ustawienia przeglądarki dodatkowo pozwalają blokować, usuwać lub ograniczać cookies — pamiętaj, że blokowanie niezbędnych plików cookie uniemożliwi logowanie i dokonywanie zakupów.',
  s6Title: '6. Udostępnianie danych podmiotom przetwarzającym',
  s6Body: 'Udostępniamy dane osobowe wyłącznie następującym podmiotom przetwarzającym, każdemu na podstawie Umowy o Powierzeniu Przetwarzania Danych zgodnej z art. 28 RODO. Stripe Payments Europe Ltd. (Irlandia) obsługuje płatności; CloudConvert GmbH (Monachium, Niemcy) przetwarza konwersje plików; Supabase Inc. (USA, transfery objęte Standardowymi Klauzulami Umownymi UE) hostuje naszą bazę PostgreSQL; Railway Corp. (USA, SCC) hostuje naszą aplikację; Resend (USA, SCC) dostarcza e-maile transakcyjne; OpenAI Ireland Ltd. przetwarza dane wejściowe Smart Functions (audio/tekst); a Google LLC (USA, certyfikowana w EU-US Data Privacy Framework) zapewnia logowanie Google OAuth. Nigdy nie sprzedajemy Twoich danych osobowych i nie przekazujemy ich osobom trzecim do ich własnych celów marketingowych.',
  s7Title: '7. Okresy retencji danych',
  s7Files: 'Pliki:',
  s7FilesBody: ' przesłane i przekonwertowane pliki są usuwane w ciągu dwudziestu czterech (24) godzin od przesłania, niezależnie od tego, czy zostały pobrane.',
  s7Account: 'Dane konta:',
  s7AccountBody: ' przechowywane przez okres aktywności konta. Po usunięciu konta wszystkie powiązane dane są usuwane w ciągu trzydziestu (30) dni, z wyjątkiem zapisów, które jesteśmy zobowiązani prawnie zachować.',
  s7Payment: 'Zapisy płatności i fakturowania:',
  s7PaymentBody: ' przechowywane przez dziesięć (10) lat zgodnie z § 147 AO (niemiecki Kodeks Podatkowy) ze względów zgodności podatkowej i księgowej. Po tym okresie dane są nieodwracalnie usuwane.',
  s7Logs: 'Logi serwera:',
  s7LogsBody: ' przechowywane przez trzydzieści (30) dni w celach bezpieczeństwa, zapobiegania nadużyciom i badania incydentów, po czym są automatycznie usuwane.',
  s8Title: '8. Twoje prawa wynikające z RODO',
  s8Intro: 'Masz szerokie prawa w odniesieniu do danych osobowych, które przetwarzamy o Tobie:',
  s8Access: 'Prawo dostępu (Art. 15):',
  s8AccessBody: ' możesz zażądać potwierdzenia, czy przetwarzamy Twoje dane, oraz kopii tych danych.',
  s8Rect: 'Prawo do sprostowania (Art. 16):',
  s8RectBody: ' możesz poprawić nieprawidłowe dane bezpośrednio na stronie profilu lub kontaktując się z nami.',
  s8Erase: 'Prawo do usunięcia / "prawo do bycia zapomnianym" (Art. 17):',
  s8EraseBody: ' możesz zażądać usunięcia swojego konta i wszystkich powiązanych danych osobowych, z zastrzeżeniem prawnych obowiązków przechowywania, takich jak dokumenty podatkowe.',
  s8Port: 'Prawo do przenoszenia danych (Art. 20):',
  s8PortBody: ' możesz zażądać kopii swoich danych w ustrukturyzowanym, powszechnie używanym formacie nadającym się do odczytu maszynowego.',
  s8Restrict: 'Prawo do ograniczenia przetwarzania (Art. 18):',
  s8RestrictBody: ' możesz zażądać, abyśmy ograniczyli przetwarzanie Twoich danych, podczas gdy rozwiązujemy spór, korygujemy nieścisłość lub oceniamy roszczenie prawne.',
  s8Object: 'Prawo do sprzeciwu (Art. 21):',
  s8ObjectBody: ' możesz sprzeciwić się przetwarzaniu opartemu na prawnie uzasadnionym interesie, w tym profilowaniu. Zaprzestaniemy, chyba że wykażemy ważne, prawnie uzasadnione podstawy nadrzędne wobec Twoich interesów.',
  s8Withdraw: 'Prawo do wycofania zgody (Art. 7):',
  s8WithdrawBody: ' przy każdym przetwarzaniu opartym na zgodzie możesz ją wycofać w dowolnym momencie bez wpływu na zgodność z prawem przetwarzania przed wycofaniem.',
  s8Outro: 'Aby skorzystać z któregokolwiek z tych praw, napisz na support@convertanyformat.com z adresu powiązanego z Twoim kontem. Odpowiemy w ciągu jednego miesiąca, z możliwością przedłużenia o kolejne dwa miesiące w przypadku skomplikowanych żądań, zgodnie z art. 12 (3) RODO. Korzystanie z Twoich praw jest bezpłatne.',
  s9Title: '9. Bezpieczeństwo danych',
  s9Body: 'Chronimy Twoje dane osobowe przy pomocy adekwatnych technicznych i organizacyjnych środków bezpieczeństwa: szyfrowanie TLS 1.2+ wszystkich danych w tranzycie; hashowanie haseł bcrypt z czynnikiem kosztu 10 lub wyższym; pliki cookie sesji httpOnly z atrybutem SameSite=Strict; zasada najmniejszych uprawnień dla dostępu wewnętrznego z dziennikiem audytu; regularne aktualizacje wszystkich zależności w celu eliminacji znanych luk; ograniczanie szybkości i walidacja danych wejściowych w celu zapobiegania nadużyciom; infrastruktura hostowana u dostawców z uznawanymi certyfikatami (ISO 27001, SOC 2). Logicznie i fizycznie oddzielamy magazyn plików (krótkotrwały, 24 godziny) od bazy danych kont (długotrwały, szyfrowany w spoczynku). Incydenty bezpieczeństwa są rejestrowane i regularnie przeglądane. Pomimo wszystkich środków, żadne informacje przesyłane przez Internet nie mogą być chronione z absolutną pewnością — chronimy Twoje dane środkami komercyjnie uzasadnionymi. W przypadku naruszenia danych osobowych powiadomimy właściwy organ nadzorczy w ciągu 72 godzin oraz poinformujemy dotkniętych użytkowników bez nieuzasadnionej zwłoki, zgodnie z art. 33-34 RODO.',
  s10Title: '10. Międzynarodowe przekazywanie danych',
  s10Body: 'Niektórzy z naszych podmiotów przetwarzających mają siedzibę poza Europejskim Obszarem Gospodarczym, głównie w Stanach Zjednoczonych. Dla każdego takiego transferu wdrożyliśmy odpowiednie zabezpieczenia wymagane przez Rozdział V RODO. Transfery do Stripe (Irlandia) i CloudConvert (Niemcy) pozostają w obrębie EOG. Transfery do Supabase, Railway, Resend i OpenAI (Stany Zjednoczone) są regulowane Standardowymi Klauzulami Umownymi Komisji Europejskiej (Moduł 2: administrator-podmiot przetwarzający), uzupełnionymi o dodatkowe techniczne zabezpieczenia, takie jak szyfrowanie w tranzycie i w spoczynku. Google LLC jest dodatkowo certyfikowane w EU-US Data Privacy Framework, zapewniając odpowiedni poziom ochrony w rozumieniu art. 45 RODO.',
  s11Title: '11. Prywatność dzieci',
  s11Body: 'Usługa nie jest skierowana do dzieci poniżej szesnastego (16) roku życia i nie zbieramy świadomie danych osobowych dzieci poniżej tego wieku. Jeśli jesteś rodzicem lub opiekunem prawnym i podejrzewasz, że dziecko poniżej 16 lat udostępniło nam dane osobowe, skontaktuj się z nami pod adresem support@convertanyformat.com, a my niezwłocznie usuniemy te dane. Użytkownicy w wieku 16-18 lat oświadczają, że posiadają zgodę rodzica lub opiekuna prawnego, gdy wymaga tego prawo ich kraju zamieszkania.',
  s12Title: '12. Zmiany w niniejszej Polityce Prywatności',
  s12Body: 'Możemy okresowo aktualizować niniejszą Politykę Prywatności, aby odzwierciedlać zmiany w naszych praktykach, używanych technologiach, obowiązujących wymogach prawnych lub innych czynnikach operacyjnych. Istotne zmiany zostaną zgłoszone na Twój zarejestrowany adres e-mail co najmniej trzydzieści (30) dni przed wejściem w życie. Mniej istotne zmiany (poprawki literówek, formatowanie, dodatki wyjaśniające) wchodzą w życie z chwilą publikacji. Data "Ostatnia aktualizacja" na górze tej strony wskazuje, kiedy Polityka została ostatnio zmieniona. Dalsze korzystanie z Usługi po dniu wejścia w życie jakiejkolwiek zmiany stanowi akceptację zmienionej Polityki.',
  s13Title: '13. Kontakt i prawo do złożenia skargi',
  s13Body: 'W sprawach związanych z ochroną danych, żądaniach skorzystania z praw RODO lub innych obawach związanych z prywatnością, prosimy o kontakt na support@convertanyformat.com. Staramy się odpowiedzieć w ciągu jednego miesiąca. Bez uszczerbku dla jakichkolwiek innych administracyjnych lub sądowych środków odwoławczych, masz prawo zgodnie z art. 77 RODO złożyć skargę do organu nadzorczego państwa członkowskiego UE, w którym mieszkasz, pracujesz lub gdzie miało miejsce domniemane naruszenie. Właściwym organem nadzorczym dla {{brand}} jest Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Swedish
// =====================================================================
const svPrivacy = {
  title: 'Integritetspolicy',
  seoDesc: '{{brand}} integritetspolicy. GDPR-kompatibel datahantering: vad vi samlar in, rättslig grund, lagring, underbiträden, dina rättigheter, internationella överföringar.',
  updated: 'Senast uppdaterad: maj 2026',
  s1Title: '1. Personuppgiftsansvarig',
  s1Body: 'Personuppgiftsansvarig för personuppgifter som behandlas via {{brand}} ("Tjänsten") är Arwand Moobed Mehdiabadi, Volmerswerther Str. 346, 40221 Düsseldorf, Tyskland. För alla dataskyddsförfrågningar — inklusive begäran om att utöva dina rättigheter enligt Dataskyddsförordningen (GDPR) — kontakta oss via e-post på support@convertanyformat.com. Eftersom vi inte uppfyller tröskelvärdena i art. 37 GDPR eller § 38 BDSG är vi inte skyldiga att utse ett dataskyddsombud; den personuppgiftsansvarige hanterar personligen alla dataskyddsfrågor. Denna policy förklarar vilka uppgifter vi samlar in, varför, på vilken rättslig grund, med vem vi delar dem, hur länge vi behåller dem och vilka rättigheter du har.',
  s2Title: '2. Personuppgifter vi samlar in',
  s2Account: 'Kontodata:',
  s2AccountBody: ' din e-postadress, valfritt visningsnamn, en bcrypt-hash av ditt lösenord (aldrig själva lösenordet), Google-konto-ID vid inloggning via OAuth, kontoinställningar (tema, språk, aviseringar) och en värvningskod om tillämpligt.',
  s2Usage: 'Användningsdata:',
  s2UsageBody: ' konverteringshistorik (filnamn, in-/utdataformat, tidsstämpel, status), kreditsaldo och transaktionslogg, statistik för verktygsanvändning, IP-adress samt ungefärlig plats härledd från IP för bedrägeriförebyggande syften.',
  s2Payment: 'Betalningsdata:',
  s2PaymentBody: ' behandlas helt av Stripe Payments Europe Ltd. Vi får endast en Stripe-kund-ID, kortets fyra sista siffror, kortmärket och en transaktionsbekräftelse. Vi ser eller lagrar aldrig fullständiga kortnummer, CVC eller bankuppgifter.',
  s2File: 'Fildata:',
  s2FileBody: ' filerna du laddar upp för konvertering lagras endast så länge som krävs för att leverera Tjänsten och raderas automatiskt inom tjugofyra timmar. Vi kommer inte åt, läser eller analyserar innehållet i dina filer förutom vad som är strikt nödvändigt för att utföra den begärda konverteringen.',
  s2Tech: 'Teknisk data:',
  s2TechBody: ' webbläsartyp och version, operativsystem, enhetstyp, hänvisande URL, språkinställning och cookie-identifierare. Samlas in automatiskt för säkerhet, förhindrande av missbruk och leverans av Tjänsten.',
  s3Title: '3. Ändamål med behandlingen',
  s3Body: 'Vi behandlar personuppgifter för följande ändamål: (a) drift av Tjänsten, inklusive att leverera de begärda konverteringarna, hantera ditt konto och redovisa kreditbalanser; (b) hantera betalningar och utfärda skatte­kompatibla fakturor via Stripe; (c) skicka transaktionella e-postmeddelanden såsom kontoverifiering, lösenordsåterställning, slutmeddelanden om konvertering du valt och Tjänstestatusmeddelanden; (d) besvara supportfrågor och lösa tvister; (e) analysera aggregerad, icke-identifierande användning för att förbättra Tjänsten; (f) förhindra bedrägeri, missbruk och obehörig åtkomst; samt (g) uppfylla rättsliga skyldigheter inklusive lagring av skattepliktiga uppgifter.',
  s4Title: '4. Rättslig grund för behandlingen (Art. 6 GDPR)',
  s4ContractTitle: 'Avtalsuppfyllelse (Art. 6 (1) (b)):',
  s4ContractBody: ' behandling av dina konverteringar, hantering av ditt konto och drift av kreditsystemet är nödvändigt för att fullgöra avtalet du ingick vid registrering eller köp.',
  s4InterestTitle: 'Berättigat intresse (Art. 6 (1) (f)):',
  s4InterestBody: ' bedrägeriförebyggande, säkerhetsövervakning, missbruksdetektering, aggregerad analys och tjänsteförbättring. Vi har genomfört en intresseavvägning och beaktat dina grundläggande rättigheter och friheter.',
  s4ConsentTitle: 'Samtycke (Art. 6 (1) (a)):',
  s4ConsentBody: ' marknadsföringsmejl, analyscookies och valfria funktioner som går utöver det strikt nödvändiga. Samtycke ges frivilligt via cookie-bannern eller inställningarna och kan när som helst återkallas utan att påverka lagligheten av behandling som utförts före återkallandet.',
  s4LegalTitle: 'Rättslig förpliktelse (Art. 6 (1) (c)):',
  s4LegalBody: ' lagring av skattepliktigt material enligt § 147 AO (tysk skattelagstiftning), besvarande av lagliga förfrågningar från behöriga myndigheter och andra skyldigheter enligt EU- eller tysk rätt.',
  s5Title: '5. Cookies och liknande tekniker',
  s5EssentialTitle: 'Nödvändiga cookies:',
  s5EssentialBody: ' din autentiseringstoken (httpOnly, SameSite=Strict), tema-inställning, språkinställning och cookie-samtyckesstatus. Strikt nödvändiga för att Tjänsten ska fungera och kräver inget samtycke enligt § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Analyscookies:',
  s5AnalyticsBody: ' sätts endast med ditt uttryckliga samtycke via cookie-bannern. Hjälper oss förstå hur Tjänsten används i aggregerad form. Du kan när som helst återkalla samtycket och vi tar bort motsvarande cookies.',
  s5MarketingTitle: 'Marknadsföringscookies:',
  s5MarketingBody: ' sätts endast med ditt uttryckliga samtycke. Används för att personalisera kommunikation. Du kan när som helst återkalla samtycket.',
  s5Manage: 'Du kan hantera dina cookie-inställningar när som helst via cookie-ikonen i sidfoten. Webbläsarinställningar låter dig dessutom blockera, ta bort eller begränsa cookies — observera att blockering av nödvändiga cookies förhindrar inloggning eller köp.',
  s6Title: '6. Datadelning med underbiträden',
  s6Body: 'Vi delar personuppgifter endast med följande underbiträden, vart och ett under ett Personuppgiftsbiträdesavtal i enlighet med art. 28 GDPR. Stripe Payments Europe Ltd. (Irland) hanterar betalningar; CloudConvert GmbH (München, Tyskland) bearbetar filkonverteringar; Supabase Inc. (USA, överföringar täcks av EU:s standardavtalsklausuler) hostar vår PostgreSQL-databas; Railway Corp. (USA, SCC) hostar vår applikation; Resend (USA, SCC) levererar transaktionsmejl; OpenAI Ireland Ltd. behandlar Smart Functions-indata (ljud/text); och Google LLC (USA, certifierad enligt EU-US Data Privacy Framework) tillhandahåller Google OAuth-inloggning. Vi säljer aldrig dina personuppgifter och överför dem inte till tredje part för deras egna marknadsföringssyften.',
  s7Title: '7. Lagringstider',
  s7Files: 'Filer:',
  s7FilesBody: ' uppladdade och konverterade filer raderas inom tjugofyra (24) timmar efter uppladdning, oavsett om de laddades ner.',
  s7Account: 'Kontodata:',
  s7AccountBody: ' lagras så länge ditt konto är aktivt. När du raderar ditt konto tas all tillhörande data bort inom trettio (30) dagar, förutom uppgifter som vi enligt lag måste behålla.',
  s7Payment: 'Betalnings- och fakturadata:',
  s7PaymentBody: ' lagras i tio (10) år enligt § 147 AO (tysk skattelagstiftning) av skatte- och redovisningsskäl. Efter denna period raderas data oåterkalleligen.',
  s7Logs: 'Serverloggar:',
  s7LogsBody: ' lagras i trettio (30) dagar för säkerhet, missbruksförebyggande och incidentutredning, varefter de raderas automatiskt.',
  s8Title: '8. Dina rättigheter enligt GDPR',
  s8Intro: 'Du har omfattande rättigheter avseende de personuppgifter vi behandlar om dig:',
  s8Access: 'Rätt till tillgång (Art. 15):',
  s8AccessBody: ' du kan begära bekräftelse på att vi behandlar dina uppgifter och en kopia av dem.',
  s8Rect: 'Rätt till rättelse (Art. 16):',
  s8RectBody: ' du kan korrigera felaktiga uppgifter direkt via din profilsida eller genom att kontakta oss.',
  s8Erase: 'Rätt till radering / "rätten att bli bortglömd" (Art. 17):',
  s8EraseBody: ' du kan begära att ditt konto och alla tillhörande personuppgifter raderas, med förbehåll för rättsliga lagringskrav som skattedokumentation.',
  s8Port: 'Rätt till dataportabilitet (Art. 20):',
  s8PortBody: ' du kan begära en kopia av dina uppgifter i ett strukturerat, allmänt använt och maskinläsbart format.',
  s8Restrict: 'Rätt till begränsning av behandling (Art. 18):',
  s8RestrictBody: ' du kan begära att vi begränsar behandlingen av dina uppgifter medan vi löser en tvist, korrigerar en felaktighet eller bedömer ett rättsligt anspråk.',
  s8Object: 'Rätt att invända (Art. 21):',
  s8ObjectBody: ' du kan invända mot behandling baserad på berättigat intresse, inklusive profilering. Vi upphör om vi inte kan visa tvingande berättigade skäl som väger tyngre än dina intressen.',
  s8Withdraw: 'Rätt att återkalla samtycke (Art. 7):',
  s8WithdrawBody: ' för all behandling som baseras på samtycke kan du när som helst återkalla det utan att påverka lagligheten av behandling utförd före återkallandet.',
  s8Outro: 'För att utöva någon av dessa rättigheter, skriv till support@convertanyformat.com från adressen som är kopplad till ditt konto. Vi svarar inom en månad, med möjlighet till ytterligare två månaders förlängning för komplexa förfrågningar enligt art. 12 (3) GDPR. Att utöva dina rättigheter är kostnadsfritt.',
  s9Title: '9. Datasäkerhet',
  s9Body: 'Vi skyddar dina personuppgifter med branschstandard tekniska och organisatoriska åtgärder: TLS 1.2+-kryptering för all data i transit; bcrypt-lösenordshashning med kostnadsfaktor 10 eller högre; httpOnly-sessionscookies med attributet SameSite=Strict; principen om minsta privilegium för intern åtkomst inklusive granskningslogg; regelbundna uppdateringar av beroenden för att åtgärda kända sårbarheter; hastighetsbegränsning och indatavalidering för att förhindra missbruk; och infrastruktur hos leverantörer med erkända certifieringar (ISO 27001, SOC 2). Vi separerar logiskt och fysiskt fillagring (kortvarig, 24 timmar) från kontodatabasen (långvarig, krypterad i vila). Säkerhetsincidenter loggas och granskas regelbundet. Trots alla åtgärder kan ingen information som överförs över internet skyddas med absolut säkerhet — vi skyddar dina uppgifter med kommersiellt rimliga medel. Vid en personuppgiftsincident underrättar vi behörig tillsynsmyndighet inom 72 timmar och informerar berörda användare utan oskäligt dröjsmål, i enlighet med art. 33-34 GDPR.',
  s10Title: '10. Internationella dataöverföringar',
  s10Body: 'Vissa av våra underbiträden har sin bas utanför Europeiska ekonomiska samarbetsområdet, främst i USA. För varje sådan överföring har vi infört de lämpliga skyddsåtgärder som krävs enligt kapitel V GDPR. Överföringar till Stripe (Irland) och CloudConvert (Tyskland) kvarstår inom EES. Överföringar till Supabase, Railway, Resend och OpenAI (USA) regleras av Europeiska kommissionens standardavtalsklausuler (modul 2: personuppgiftsansvarig till personuppgiftsbiträde), kompletterade med ytterligare tekniska skyddsåtgärder såsom kryptering i transit och i vila. Google LLC är dessutom certifierat enligt EU-US Data Privacy Framework, vilket ger en adekvat skyddsnivå i den mening som avses i art. 45 GDPR.',
  s11Title: '11. Barns integritet',
  s11Body: 'Tjänsten är inte riktad till barn under sexton (16) år, och vi samlar inte medvetet in personuppgifter från barn under den åldern. Om du är förälder eller vårdnadshavare och tror att ett barn under 16 har lämnat personuppgifter till oss, kontakta oss på support@convertanyformat.com så raderar vi dessa uppgifter omedelbart. Användare mellan 16 och 18 år försäkrar att de har samtycke från en förälder eller vårdnadshavare där så krävs enligt lagen i deras hemland.',
  s12Title: '12. Ändringar av denna policy',
  s12Body: 'Vi kan från tid till annan uppdatera denna integritetspolicy för att återspegla ändringar i vår praxis, de teknologier vi använder, tillämpliga rättsliga krav eller andra operativa faktorer. Väsentliga ändringar meddelas till din registrerade e-postadress minst trettio (30) dagar innan de träder i kraft. Mindre ändringar (rättningar, formatering, förtydliganden) träder i kraft vid publicering. Datumet "Senast uppdaterad" överst på denna sida visar när policyn senast reviderades. Fortsatt användning av Tjänsten efter ikraftträdande av en ändring utgör godkännande av den reviderade policyn.',
  s13Title: '13. Kontakt och rätten att lämna in klagomål',
  s13Body: 'För dataskyddsförfrågningar, begäran att utöva dina GDPR-rättigheter eller andra integritetsrelaterade frågor, skriv till support@convertanyformat.com. Vi strävar efter att svara inom en månad. Utan att det påverkar någon annan administrativ eller rättslig prövning har du enligt art. 77 GDPR rätt att lämna in klagomål till tillsynsmyndigheten i den EU-medlemsstat där du bor, arbetar eller där den påstådda överträdelsen ägde rum. Behörig tillsynsmyndighet för {{brand}} är Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Norwegian
// =====================================================================
const noPrivacy = {
  title: 'Personvernerklæring',
  seoDesc: '{{brand}} personvernerklæring. GDPR-kompatibel databehandling: hva vi samler inn, rettsgrunnlag, oppbevaring, underdatabehandlere, dine rettigheter, internasjonale overføringer.',
  updated: 'Sist oppdatert: mai 2026',
  s1Title: '1. Behandlingsansvarlig',
  s1Body: 'Behandlingsansvarlig for personopplysninger som behandles gjennom {{brand}} ("Tjenesten") er Arwand Moobed Mehdiabadi, Volmerswerther Str. 346, 40221 Düsseldorf, Tyskland. For alle personvernhenvendelser — inkludert forespørsler om å utøve dine rettigheter etter personvernforordningen (GDPR) — kontakt oss på e-post til support@convertanyformat.com. Siden vi ikke når terskelverdiene i art. 37 GDPR eller § 38 BDSG, er vi ikke pliktige til å utnevne et personvernombud; den behandlingsansvarlige håndterer alle personvernsaker personlig. Denne erklæringen forklarer hvilke data vi samler inn, hvorfor, på hvilket rettsgrunnlag, hvem vi deler dem med, hvor lenge vi oppbevarer dem og hvilke rettigheter du har.',
  s2Title: '2. Personopplysninger vi samler inn',
  s2Account: 'Kontodata:',
  s2AccountBody: ' din e-postadresse, valgfritt visningsnavn, en bcrypt-hash av passordet (aldri selve passordet), Google-konto-ID ved innlogging via OAuth, kontopreferanser (tema, språk, varsler) og en henvisningskode om aktuelt.',
  s2Usage: 'Bruksdata:',
  s2UsageBody: ' konverteringshistorikk (filnavn, inn-/utdataformat, tidsstempel, status), kredittsaldo og transaksjonslogg, statistikk over verktøybruk, IP-adresse og omtrentlig lokasjon utledet fra IP for forebygging av svindel.',
  s2Payment: 'Betalingsdata:',
  s2PaymentBody: ' behandles fullstendig av Stripe Payments Europe Ltd. Vi mottar bare en Stripe-kunde-ID, de fire siste sifrene av kortet, kortmerket og en transaksjonsbekreftelse. Vi ser eller lagrer aldri fullstendige kortnumre, CVC eller bankopplysninger.',
  s2File: 'Fildata:',
  s2FileBody: ' filene du laster opp for konvertering lagres bare så lenge det er nødvendig for å levere Tjenesten og slettes automatisk innen tjuefire timer. Vi får ikke tilgang til, leser eller analyserer innholdet i filene dine, bortsett fra det som er strengt nødvendig for å utføre den forespurte konverteringen.',
  s2Tech: 'Tekniske data:',
  s2TechBody: ' nettlesertype og versjon, operativsystem, enhetstype, henvisende URL, språkpreferanse og informasjonskapselidentifikatorer. Samles inn automatisk for sikkerhet, misbrukforebygging og levering av Tjenesten.',
  s3Title: '3. Formål med behandlingen',
  s3Body: 'Vi behandler personopplysninger for følgende formål: (a) drift av Tjenesten, inkludert å levere de forespurte konverteringene, administrere kontoen din og bokføre kredittsaldo; (b) håndtere betalinger og utstede skattekompatible fakturaer gjennom Stripe; (c) sende transaksjonsmail som kontobekreftelse, passordtilbakestilling, varsler om fullført konvertering du har valgt og statusmeldinger om Tjenesten; (d) svare på supporthenvendelser og løse tvister; (e) analysere aggregert, ikke-identifiserbar bruk for å forbedre Tjenesten; (f) forebygge svindel, misbruk og uautorisert tilgang; og (g) overholde rettslige forpliktelser inkludert oppbevaring av skattedokumentasjon.',
  s4Title: '4. Rettslig grunnlag for behandlingen (Art. 6 GDPR)',
  s4ContractTitle: 'Oppfyllelse av avtale (Art. 6 (1) (b)):',
  s4ContractBody: ' behandling av dine konverteringer, administrasjon av kontoen din og drift av kredittsystemet er nødvendig for å oppfylle avtalen du inngikk ved registrering eller kjøp.',
  s4InterestTitle: 'Berettiget interesse (Art. 6 (1) (f)):',
  s4InterestBody: ' svindelforebygging, sikkerhetsovervåking, deteksjon av misbruk, aggregert analyse og tjenesteforbedring. Vi har gjennomført en interesseavveining og tatt hensyn til dine grunnleggende rettigheter og friheter.',
  s4ConsentTitle: 'Samtykke (Art. 6 (1) (a)):',
  s4ConsentBody: ' markedsføringsmail, analyse-informasjonskapsler og valgfrie funksjoner som går utover det strengt nødvendige. Samtykke gis frivillig via informasjonskapselbanneret eller innstillingene og kan trekkes tilbake når som helst uten å påvirke lovligheten av behandling utført før tilbaketrekkingen.',
  s4LegalTitle: 'Rettslig forpliktelse (Art. 6 (1) (c)):',
  s4LegalBody: ' oppbevaring av skattepliktig materiale i henhold til § 147 AO (tysk skattelov), svar på lovlige henvendelser fra kompetente myndigheter og andre forpliktelser etter EU-rett eller tysk rett.',
  s5Title: '5. Informasjonskapsler og lignende teknologier',
  s5EssentialTitle: 'Nødvendige informasjonskapsler:',
  s5EssentialBody: ' ditt autentiseringstoken (httpOnly, SameSite=Strict), tema-preferanse, språkpreferanse og samtykkestatus for informasjonskapsler. Strengt nødvendige for at Tjenesten skal fungere og krever ikke samtykke i henhold til § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Analytiske informasjonskapsler:',
  s5AnalyticsBody: ' settes kun med ditt uttrykkelige samtykke via informasjonskapselbanneret. Hjelper oss å forstå hvordan Tjenesten brukes i aggregert form. Du kan når som helst trekke tilbake samtykket, og vi sletter de tilsvarende informasjonskapslene.',
  s5MarketingTitle: 'Markedsføringsinformasjonskapsler:',
  s5MarketingBody: ' settes kun med ditt uttrykkelige samtykke. Brukes til å personliggjøre kommunikasjon. Du kan når som helst trekke tilbake samtykket.',
  s5Manage: 'Du kan administrere preferansene for informasjonskapsler når som helst via informasjonskapselikonet i bunnteksten. Nettleserinnstillinger lar deg også blokkere, slette eller begrense informasjonskapsler — merk at blokkering av nødvendige informasjonskapsler vil hindre innlogging eller kjøp.',
  s6Title: '6. Datadeling med underdatabehandlere',
  s6Body: 'Vi deler personopplysninger kun med følgende underdatabehandlere, hver under en databehandleravtale i samsvar med art. 28 GDPR. Stripe Payments Europe Ltd. (Irland) håndterer betalinger; CloudConvert GmbH (München, Tyskland) behandler filkonverteringer; Supabase Inc. (USA, overføringer dekket av EUs standardvilkår) drifter PostgreSQL-databasen vår; Railway Corp. (USA, SCC) drifter applikasjonen vår; Resend (USA, SCC) leverer transaksjonsmail; OpenAI Ireland Ltd. behandler Smart Functions-input (lyd/tekst); og Google LLC (USA, sertifisert under EU-US Data Privacy Framework) leverer Google OAuth-innlogging. Vi selger aldri personopplysningene dine og overfører dem ikke til tredjeparter for deres egne markedsføringsformål.',
  s7Title: '7. Datalagring',
  s7Files: 'Filer:',
  s7FilesBody: ' opplastede og konverterte filer slettes innen tjuefire (24) timer etter opplasting, uavhengig av om de ble lastet ned.',
  s7Account: 'Kontodata:',
  s7AccountBody: ' lagres så lenge kontoen din er aktiv. Når du sletter kontoen, fjernes alle tilknyttede data innen tretti (30) dager, med unntak av poster vi er rettslig pålagt å beholde.',
  s7Payment: 'Betalings- og fakturadata:',
  s7PaymentBody: ' oppbevares i ti (10) år i samsvar med § 147 AO (tysk skattelov) av skatte- og regnskapsmessige hensyn. Etter denne perioden slettes dataene ugjenkallelig.',
  s7Logs: 'Server-logger:',
  s7LogsBody: ' oppbevares i tretti (30) dager for sikkerhet, misbruksforebygging og hendelsesundersøkelse, og slettes deretter automatisk.',
  s8Title: '8. Dine rettigheter etter GDPR',
  s8Intro: 'Du har omfattende rettigheter knyttet til personopplysningene vi behandler om deg:',
  s8Access: 'Rett til innsyn (Art. 15):',
  s8AccessBody: ' du kan be om bekreftelse på om vi behandler dataene dine, og en kopi av disse dataene.',
  s8Rect: 'Rett til retting (Art. 16):',
  s8RectBody: ' du kan korrigere uriktige data direkte fra profilsiden din eller ved å kontakte oss.',
  s8Erase: 'Rett til sletting / "retten til å bli glemt" (Art. 17):',
  s8EraseBody: ' du kan be om sletting av kontoen din og alle tilknyttede personopplysninger, med forbehold for rettslige oppbevaringskrav som skattedokumentasjon.',
  s8Port: 'Rett til dataportabilitet (Art. 20):',
  s8PortBody: ' du kan be om en kopi av dataene dine i et strukturert, vanlig brukt og maskinlesbart format.',
  s8Restrict: 'Rett til begrensning av behandlingen (Art. 18):',
  s8RestrictBody: ' du kan be om at vi begrenser behandlingen av dataene dine mens vi løser en tvist, korrigerer en unøyaktighet eller vurderer et rettskrav.',
  s8Object: 'Rett til å protestere (Art. 21):',
  s8ObjectBody: ' du kan protestere mot behandling basert på berettiget interesse, inkludert profilering. Vi vil opphøre med mindre vi kan vise tvingende berettigede grunner som veier tyngre enn interessene dine.',
  s8Withdraw: 'Rett til å trekke tilbake samtykke (Art. 7):',
  s8WithdrawBody: ' for all behandling basert på samtykke kan du når som helst trekke det tilbake uten at det påvirker lovligheten av behandling utført før tilbaketrekkingen.',
  s8Outro: 'For å utøve noen av disse rettighetene, skriv til support@convertanyformat.com fra adressen som er knyttet til kontoen din. Vi svarer innen én måned, med mulighet for ytterligere to måneders forlengelse for komplekse forespørsler i tråd med art. 12 (3) GDPR. Å utøve rettighetene dine er kostnadsfritt.',
  s9Title: '9. Datasikkerhet',
  s9Body: 'Vi beskytter personopplysningene dine med bransjestandard tekniske og organisatoriske tiltak: TLS 1.2+-kryptering for alle data i transitt; bcrypt passord-hashing med kostnadsfaktor 10 eller høyere; httpOnly-øktinformasjonskapsler med attributtet SameSite=Strict; minste privilegium-prinsippet for intern tilgang inkludert revisjonslogg; regelmessige oppdateringer av avhengigheter for å lukke kjente sårbarheter; rate-begrensning og inputvalidering for å forhindre misbruk; og infrastruktur hostet hos leverandører med anerkjente sertifiseringer (ISO 27001, SOC 2). Vi skiller logisk og fysisk fillagring (kortvarig, 24 timer) fra kontodatabasen (langvarig, kryptert i hvile). Sikkerhetshendelser logges og gjennomgås regelmessig. Til tross for alle tiltak kan ingen informasjon som overføres over internett beskyttes med absolutt sikkerhet — vi beskytter dataene dine med kommersielt rimelige midler. Ved et personopplysningsbrudd varsler vi kompetent tilsynsmyndighet innen 72 timer og berørte brukere uten ugrunnet opphold, i samsvar med art. 33-34 GDPR.',
  s10Title: '10. Internasjonale dataoverføringer',
  s10Body: 'Noen av våre underdatabehandlere er basert utenfor Det europeiske økonomiske samarbeidsområdet, hovedsakelig i USA. For hver slik overføring har vi implementert de hensiktsmessige sikkerhetstiltakene som kreves etter kapittel V GDPR. Overføringer til Stripe (Irland) og CloudConvert (Tyskland) forblir innenfor EØS. Overføringer til Supabase, Railway, Resend og OpenAI (USA) reguleres av EU-kommisjonens standard kontraktsvilkår (modul 2: behandlingsansvarlig til databehandler), supplert med ytterligere tekniske garantier som kryptering i transitt og i hvile. Google LLC er dessuten sertifisert under EU-US Data Privacy Framework, som gir et tilstrekkelig beskyttelsesnivå i henhold til art. 45 GDPR.',
  s11Title: '11. Barns personvern',
  s11Body: 'Tjenesten retter seg ikke mot barn under seksten (16) år, og vi samler ikke bevisst inn personopplysninger fra barn under denne alderen. Hvis du er forelder eller verge og mener at et barn under 16 har gitt oss personopplysninger, kontakt oss på support@convertanyformat.com, og vi vil slette disse dataene snarest. Brukere mellom 16 og 18 år erklærer at de har samtykke fra en forelder eller verge der dette kreves av loven i hjemlandet deres.',
  s12Title: '12. Endringer i denne erklæringen',
  s12Body: 'Vi kan oppdatere denne personvernerklæringen fra tid til annen for å reflektere endringer i praksis, teknologiene vi bruker, gjeldende rettslige krav eller andre operative faktorer. Vesentlige endringer varsles til din registrerte e-postadresse minst tretti (30) dager før de trer i kraft. Ikke-vesentlige endringer (skrivefeil, formatering, presiseringer) trer i kraft ved publisering. Datoen "Sist oppdatert" øverst på denne siden viser når erklæringen sist ble revidert. Fortsatt bruk av Tjenesten etter ikrafttredelsesdatoen for en endring utgjør aksept av den reviderte erklæringen.',
  s13Title: '13. Kontakt og klagerett',
  s13Body: 'For personvernhenvendelser, forespørsler om å utøve GDPR-rettighetene dine eller andre personvernrelaterte bekymringer, skriv til support@convertanyformat.com. Vi tar sikte på å svare innen én måned. Uten å gripe inn i andre administrative eller rettslige rettsmidler har du etter art. 77 GDPR rett til å sende inn klage til tilsynsmyndigheten i EU-medlemsstaten der du bor, arbeider eller hvor den påståtte krenkelsen fant sted. Kompetent tilsynsmyndighet for {{brand}} er Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
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
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return { start, end: i + 1 };
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

function replaceTopLevelKey(text, keyName, newObject, scopeStart, scopeEnd) {
  const block = findKeyBlock(text.slice(scopeStart, scopeEnd), keyName);
  if (!block) throw new Error(`Could not find ${keyName} in scope`);
  const absStart = scopeStart + block.start;
  const absEnd = scopeStart + block.end;
  const newSrc = `${keyName}: ${formatObjectLiteral(newObject)}`;
  return text.slice(0, absStart) + newSrc + text.slice(absEnd);
}

const PAYLOADS = { nl: nlPrivacy, pl: plPrivacy, sv: svPrivacy, no: noPrivacy };

for (const [lang, privacy] of Object.entries(PAYLOADS)) {
  const block = findLangBlock(content, lang);
  content = replaceTopLevelKey(content, 'privacy', privacy, block.start, block.end);
  console.log(`✔ Updated ${lang}.privacy`);
}

fs.writeFileSync(FILE, content);
console.log('\nDone (final chunk — all 10 supported languages should now be at 100%).');
