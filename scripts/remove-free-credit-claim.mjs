#!/usr/bin/env node
// ── Remove the false "free conversion credit" claim ──────────────────
//
//   node scripts/remove-free-credit-claim.mjs
//
// Registration grants credits: 0 on every path (server/routes/auth.js and
// server/lib/passport.js), so nothing on the site may promise a free credit.
// This rewrites every string that did, in all 17 languages.
//
// Four claim carriers:
//   toolContent packs  faq.cost.a.{pair,tool,smartTts,smartAv}
//                      — visible tool-page FAQ AND the FAQPage JSON-LD, which
//                        share one source, so fixing the pack fixes both.
//   seo.registerDesc   — Register page meta description
//   pricing.freeFeat1  — free-tier bullet; the whole key is the claim, so it
//                        is deleted rather than reworded (nothing renders it)
//   apiDocs.rateLimitsFreeLimit — "1 credit (included)" in the plans table
//
// Surviving text is preserved from the existing translations rather than
// retranslated: only the free-credit clause is removed and the sentence that
// followed it is re-opened (e.g. "After that each conversion…" -> "Each
// conversion…"). faq.cost.a.pair folds {{from}}/{{to}} into the surviving
// sentence so both placeholders live on.
//
// Deliberately NOT touched: dash.referBody ("5 free credits per referral") is
// a true claim — auth.js does increment the referrer by 5 on signup.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const PACKS = path.join(ROOT, 'client', 'src', 'toolContent', 'packs');
const I18N = path.join(ROOT, 'client', 'src', 'i18n.js');
const TRANS = path.join(ROOT, 'client', 'src', 'i18n-translations.js');

const LANGS = ['en','de','fr','es','it','pt','nl','pl','sv','no','da','fi','cs','ro','hu','el','tr'];
const NON_EN = LANGS.filter((l) => l !== 'en');

// ── Tool-page FAQ answers (visible text + FAQPage JSON-LD) ───────────
const PACK = {
  'faq.cost.a.pair': {
    en: 'Each {{from}} to {{to}} conversion uses one credit from a small prepaid pack — there is no subscription, credits never expire, and if a conversion fails you are not charged for it.',
    de: 'Jede Umwandlung von {{from}} zu {{to}} verbraucht ein Credit aus einem kleinen Prepaid-Paket — es gibt kein Abo, Credits verfallen nie, und für eine fehlgeschlagene Umwandlung zahlen Sie nichts.',
    fr: 'Chaque conversion de {{from}} en {{to}} consomme un crédit d’un petit lot prépayé — pas d’abonnement, les crédits n’expirent jamais, et une conversion qui échoue ne vous est pas facturée.',
    es: 'Cada conversión de {{from}} a {{to}} usa un crédito de un pequeño paquete prepago: no hay suscripción, los créditos nunca caducan y una conversión fallida no se le cobra.',
    it: 'Ogni conversione da {{from}} a {{to}} consuma un credito di un piccolo pacchetto prepagato: nessun abbonamento, i crediti non scadono mai e una conversione fallita non vi viene addebitata.',
    pt: 'Cada conversão de {{from}} para {{to}} usa um crédito de um pequeno pacote pré-pago — não há subscrição, os créditos nunca expiram, e uma conversão que falhe não lhe é cobrada.',
    nl: 'Elke omzetting van {{from}} naar {{to}} gebruikt één tegoed uit een klein vooruitbetaald pakket — er is geen abonnement, tegoeden verlopen nooit, en voor een mislukte omzetting betaalt u niets.',
    pl: 'Każda konwersja {{from}} na {{to}} zużywa jeden kredyt z małego pakietu przedpłaconego — nie ma abonamentu, kredyty nigdy nie wygasają, a za nieudaną konwersję nie płacisz.',
    sv: 'Varje konvertering från {{from}} till {{to}} drar en kredit ur ett litet förbetalt paket — det finns inget abonnemang, krediter går aldrig ut, och en misslyckad konvertering debiteras inte.',
    no: 'Hver konvertering fra {{from}} til {{to}} bruker én kreditt fra en liten forhåndsbetalt pakke — det finnes ikke noe abonnement, kreditter utløper aldri, og en mislykket konvertering belastes ikke.',
    da: 'Hver konvertering fra {{from}} til {{to}} bruger én kredit fra en lille forudbetalt pakke — der er intet abonnement, kreditter udløber aldrig, og en mislykket konvertering bliver ikke opkrævet.',
    fi: 'Jokainen muunnos {{from}}-muodosta {{to}}-muotoon käyttää yhden krediitin pienestä ennakkoon maksetusta paketista — tilausta ei ole, krediitit eivät koskaan vanhene, eikä epäonnistuneesta muunnoksesta veloiteta.',
    cs: 'Každý převod {{from}} na {{to}} spotřebuje jeden kredit z malého předplaceného balíčku — žádné předplatné, kredity nikdy nevyprší a za neúspěšný převod se neplatí.',
    ro: 'Fiecare conversie din {{from}} în {{to}} foloseşte un credit dintr-un pachet mic preplătit — nu există abonament, creditele nu expiră niciodată, iar o conversie eşuată nu se taxează.',
    hu: 'Minden {{from}} – {{to}} átalakítás egy kreditet használ el egy kis előre fizetett csomagból — nincs előfizetés, a kreditek soha nem járnak le, és a sikertelen átalakítást nem számoljuk fel.',
    el: 'Κάθε μετατροπή από {{from}} σε {{to}} χρησιμοποιεί μία μονάδα από ένα μικρό προπληρωμένο πακέτο — δεν υπάρχει συνδρομή, οι μονάδες δεν λήγουν ποτέ και μια αποτυχημένη μετατροπή δεν χρεώνεται.',
    tr: 'Her {{from}} – {{to}} dönüştürmesi, küçük bir ön ödemeli paketten bir kredi harcar — abonelik yok, krediler asla sona ermez ve başarısız bir dönüştürme için ücret alınmaz.',
  },
  'faq.cost.a.tool': {
    en: 'Each conversion uses one credit from a small prepaid pack — there is no subscription, credits never expire, and if a conversion fails you are not charged for it.',
    de: 'Jede Umwandlung verbraucht ein Credit aus einem kleinen Prepaid-Paket — es gibt kein Abo, Credits verfallen nie, und für eine fehlgeschlagene Umwandlung zahlen Sie nichts.',
    fr: 'Chaque conversion consomme un crédit d’un petit lot prépayé — pas d’abonnement, les crédits n’expirent jamais, et une conversion qui échoue ne vous est pas facturée.',
    es: 'Cada conversión usa un crédito de un pequeño paquete prepago: no hay suscripción, los créditos nunca caducan y una conversión fallida no se le cobra.',
    it: 'Ogni conversione consuma un credito di un piccolo pacchetto prepagato: nessun abbonamento, i crediti non scadono mai e una conversione fallita non vi viene addebitata.',
    pt: 'Cada conversão usa um crédito de um pequeno pacote pré-pago — não há subscrição, os créditos nunca expiram, e uma conversão que falhe não lhe é cobrada.',
    nl: 'Elke omzetting gebruikt één tegoed uit een klein vooruitbetaald pakket — er is geen abonnement, tegoeden verlopen nooit, en voor een mislukte omzetting betaalt u niets.',
    pl: 'Każda konwersja zużywa jeden kredyt z małego pakietu przedpłaconego — nie ma abonamentu, kredyty nigdy nie wygasają, a za nieudaną konwersję nie płacisz.',
    sv: 'Varje konvertering drar en kredit ur ett litet förbetalt paket — det finns inget abonnemang, krediter går aldrig ut, och en misslyckad konvertering debiteras inte.',
    no: 'Hver konvertering bruker én kreditt fra en liten forhåndsbetalt pakke — det finnes ikke noe abonnement, kreditter utløper aldri, og en mislykket konvertering belastes ikke.',
    da: 'Hver konvertering bruger én kredit fra en lille forudbetalt pakke — der er intet abonnement, kreditter udløber aldrig, og en mislykket konvertering bliver ikke opkrævet.',
    fi: 'Jokainen muunnos käyttää yhden krediitin pienestä ennakkoon maksetusta paketista — tilausta ei ole, krediitit eivät koskaan vanhene, eikä epäonnistuneesta muunnoksesta veloiteta.',
    cs: 'Každý převod spotřebuje jeden kredit z malého předplaceného balíčku — žádné předplatné, kredity nikdy nevyprší a za neúspěšný převod se neplatí.',
    ro: 'Fiecare conversie foloseşte un credit dintr-un pachet mic preplătit — nu există abonament, creditele nu expiră niciodată, iar o conversie eşuată nu se taxează.',
    hu: 'Minden átalakítás egy kreditet használ el egy kis előre fizetett csomagból — nincs előfizetés, a kreditek soha nem járnak le, és a sikertelen átalakítást nem számoljuk fel.',
    el: 'Κάθε μετατροπή χρησιμοποιεί μία μονάδα από ένα μικρό προπληρωμένο πακέτο — δεν υπάρχει συνδρομή, οι μονάδες δεν λήγουν ποτέ και μια αποτυχημένη μετατροπή δεν χρεώνεται.',
    tr: 'Her dönüştürme, küçük bir ön ödemeli paketten bir kredi harcar — abonelik yok, krediler asla sona ermez ve başarısız bir dönüştürme için ücret alınmaz.',
  },
  'faq.cost.a.smartTts': {
    en: 'Smart Functions are billed by usage rather than per file — 1 credit per 1000 characters of text, rounded up. There is no subscription: credits are bought in small prepaid packs, they never expire, and a conversion that fails never costs you anything.',
    de: 'Die intelligenten Funktionen werden nach Nutzung statt pro Datei abgerechnet — 1 Credit je 1000 Zeichen Text, aufgerundet. Es gibt kein Abo: Credits werden in kleinen Prepaid-Paketen gekauft, verfallen nie, und eine fehlgeschlagene Umwandlung kostet nie etwas.',
    fr: 'Les fonctions intelligentes sont facturées à l’usage plutôt qu’au fichier — 1 crédit par tranche de 1000 caractères, arrondie au supérieur. Pas d’abonnement : les crédits s’achètent par petits lots prépayés, n’expirent jamais, et une conversion qui échoue ne coûte jamais rien.',
    es: 'Las funciones inteligentes se facturan por uso en lugar de por archivo: 1 crédito por cada 1000 caracteres de texto, redondeando hacia arriba. No hay suscripción: los créditos se compran en pequeños paquetes prepago, nunca caducan y una conversión fallida nunca cuesta nada.',
    it: 'Le funzioni intelligenti si pagano a consumo anziché a file: 1 credito ogni 1000 caratteri di testo, arrotondati per eccesso. Nessun abbonamento: i crediti si acquistano in piccoli pacchetti prepagati, non scadono mai e una conversione fallita non costa mai nulla.',
    pt: 'As funções inteligentes são cobradas por utilização em vez de por ficheiro — 1 crédito por cada 1000 caracteres de texto, arredondados para cima. Não há subscrição: os créditos compram-se em pequenos pacotes pré-pagos, nunca expiram, e uma conversão que falhe nunca custa nada.',
    nl: 'De slimme functies worden per gebruik afgerekend in plaats van per bestand — 1 tegoed per 1000 tekens tekst, naar boven afgerond. Er is geen abonnement: tegoeden koopt u in kleine vooruitbetaalde pakketten, ze verlopen nooit, en een mislukte omzetting kost nooit iets.',
    pl: 'Funkcje inteligentne rozliczane są za zużycie, a nie za plik — 1 kredyt za każde 1000 znaków tekstu, zaokrąglone w górę. Nie ma abonamentu: kredyty kupuje się w małych pakietach przedpłaconych, nigdy nie wygasają, a nieudana konwersja nigdy nic nie kosztuje.',
    sv: 'De smarta funktionerna debiteras efter användning i stället för per fil — 1 kredit per 1000 tecken text, uppåt avrundat. Inget abonnemang: krediter köps i små förbetalda paket, går aldrig ut, och en misslyckad konvertering kostar aldrig något.',
    no: 'De smarte funksjonene faktureres etter bruk i stedet for per fil — 1 kreditt per 1000 tegn tekst, rundet opp. Ingen abonnement: kreditter kjøpes i små forhåndsbetalte pakker, utløper aldri, og en mislykket konvertering koster aldri noe.',
    da: 'De smarte funktioner afregnes efter forbrug i stedet for pr. fil — 1 kredit pr. 1000 tegn tekst, rundet op. Intet abonnement: kreditter købes i små forudbetalte pakker, udløber aldrig, og en mislykket konvertering koster aldrig noget.',
    fi: 'Älytoiminnot laskutetaan käytön mukaan eikä tiedostoittain — 1 krediitti jokaista 1000 tekstimerkkiä kohden, ylöspäin pyöristettynä. Tilausta ei ole: krediittejä ostetaan pieninä ennakkoon maksettuina paketteina, ne eivät koskaan vanhene, eikä epäonnistunut muunnos maksa koskaan mitään.',
    cs: 'Chytré funkce se účtují podle využití, ne po souborech — 1 kredit za každých 1000 znaků textu, zaokrouhleno nahoru. Žádné předplatné: kredity se kupují v malých předplacených balíčcích, nikdy nevyprší a neúspěšný převod nikdy nic nestojí.',
    ro: 'Funcţiile inteligente se taxează după consum, nu pe fişier — 1 credit la fiecare 1000 de caractere de text, rotunjit în sus. Fără abonament: creditele se cumpără în pachete mici preplătite, nu expiră niciodată, iar o conversie eşuată nu costă nimic.',
    hu: 'Az intelligens funkciókat használat szerint számoljuk, nem fájlonként — 1 kredit minden 1000 szövegkarakterért, felfelé kerekítve. Nincs előfizetés: a krediteket kis, előre fizetett csomagokban lehet megvenni, soha nem járnak le, és egy sikertelen átalakítás soha nem kerül semmibe.',
    el: 'Οι έξυπνες λειτουργίες χρεώνονται με τη χρήση κι όχι ανά αρχείο — 1 μονάδα ανά 1000 χαρακτήρες κειμένου, στρογγυλοποιημένα προς τα πάνω. Καμία συνδρομή: οι μονάδες αγοράζονται σε μικρά προπληρωμένα πακέτα, δεν λήγουν ποτέ και μια αποτυχημένη μετατροπή δεν κοστίζει ποτέ τίποτα.',
    tr: 'Akıllı işlevler dosya başına değil kullanıma göre ücretlendirilir — her 1000 metin karakteri için 1 kredi, yukarı yuvarlanarak. Abonelik yok: krediler küçük ön ödemeli paketlerle alınır, asla sona ermez ve başarısız bir dönüştürme hiçbir zaman hiçbir şeye mal olmaz.',
  },
  'faq.cost.a.smartAv': {
    en: 'Smart Functions are billed by usage rather than per file — 1 credit per 5 minutes of audio or video, rounded up. There is no subscription: credits are bought in small prepaid packs, they never expire, and a conversion that fails never costs you anything.',
    de: 'Die intelligenten Funktionen werden nach Nutzung statt pro Datei abgerechnet — 1 Credit je 5 Minuten Audio oder Video, aufgerundet. Es gibt kein Abo: Credits werden in kleinen Prepaid-Paketen gekauft, verfallen nie, und eine fehlgeschlagene Umwandlung kostet nie etwas.',
    fr: 'Les fonctions intelligentes sont facturées à l’usage plutôt qu’au fichier — 1 crédit par tranche de 5 minutes d’audio ou de vidéo, arrondie au supérieur. Pas d’abonnement : les crédits s’achètent par petits lots prépayés, n’expirent jamais, et une conversion qui échoue ne coûte jamais rien.',
    es: 'Las funciones inteligentes se facturan por uso en lugar de por archivo: 1 crédito por cada 5 minutos de audio o vídeo, redondeando hacia arriba. No hay suscripción: los créditos se compran en pequeños paquetes prepago, nunca caducan y una conversión fallida nunca cuesta nada.',
    it: 'Le funzioni intelligenti si pagano a consumo anziché a file: 1 credito ogni 5 minuti di audio o video, arrotondati per eccesso. Nessun abbonamento: i crediti si acquistano in piccoli pacchetti prepagati, non scadono mai e una conversione fallita non costa mai nulla.',
    pt: 'As funções inteligentes são cobradas por utilização em vez de por ficheiro — 1 crédito por cada 5 minutos de áudio ou vídeo, arredondados para cima. Não há subscrição: os créditos compram-se em pequenos pacotes pré-pagos, nunca expiram, e uma conversão que falhe nunca custa nada.',
    nl: 'De slimme functies worden per gebruik afgerekend in plaats van per bestand — 1 tegoed per 5 minuten audio of video, naar boven afgerond. Er is geen abonnement: tegoeden koopt u in kleine vooruitbetaalde pakketten, ze verlopen nooit, en een mislukte omzetting kost nooit iets.',
    pl: 'Funkcje inteligentne rozliczane są za zużycie, a nie za plik — 1 kredyt za każde 5 minut dźwięku lub wideo, zaokrąglone w górę. Nie ma abonamentu: kredyty kupuje się w małych pakietach przedpłaconych, nigdy nie wygasają, a nieudana konwersja nigdy nic nie kosztuje.',
    sv: 'De smarta funktionerna debiteras efter användning i stället för per fil — 1 kredit per 5 minuter ljud eller video, uppåt avrundat. Inget abonnemang: krediter köps i små förbetalda paket, går aldrig ut, och en misslyckad konvertering kostar aldrig något.',
    no: 'De smarte funksjonene faktureres etter bruk i stedet for per fil — 1 kreditt per 5 minutter lyd eller video, rundet opp. Ingen abonnement: kreditter kjøpes i små forhåndsbetalte pakker, utløper aldri, og en mislykket konvertering koster aldri noe.',
    da: 'De smarte funktioner afregnes efter forbrug i stedet for pr. fil — 1 kredit pr. 5 minutters lyd eller video, rundet op. Intet abonnement: kreditter købes i små forudbetalte pakker, udløber aldrig, og en mislykket konvertering koster aldrig noget.',
    fi: 'Älytoiminnot laskutetaan käytön mukaan eikä tiedostoittain — 1 krediitti jokaista 5 minuutin ääni- tai videojaksoa kohden, ylöspäin pyöristettynä. Tilausta ei ole: krediittejä ostetaan pieninä ennakkoon maksettuina paketteina, ne eivät koskaan vanhene, eikä epäonnistunut muunnos maksa koskaan mitään.',
    cs: 'Chytré funkce se účtují podle využití, ne po souborech — 1 kredit za každých 5 minut zvuku či videa, zaokrouhleno nahoru. Žádné předplatné: kredity se kupují v malých předplacených balíčcích, nikdy nevyprší a neúspěšný převod nikdy nic nestojí.',
    ro: 'Funcţiile inteligente se taxează după consum, nu pe fişier — 1 credit la fiecare 5 minute de sunet sau video, rotunjit în sus. Fără abonament: creditele se cumpără în pachete mici preplătite, nu expiră niciodată, iar o conversie eşuată nu costă nimic.',
    hu: 'Az intelligens funkciókat használat szerint számoljuk, nem fájlonként — 1 kredit minden 5 perc hangért vagy videóért, felfelé kerekítve. Nincs előfizetés: a krediteket kis, előre fizetett csomagokban lehet megvenni, soha nem járnak le, és egy sikertelen átalakítás soha nem kerül semmibe.',
    el: 'Οι έξυπνες λειτουργίες χρεώνονται με τη χρήση κι όχι ανά αρχείο — 1 μονάδα ανά 5 λεπτά ήχου ή βίντεο, στρογγυλοποιημένα προς τα πάνω. Καμία συνδρομή: οι μονάδες αγοράζονται σε μικρά προπληρωμένα πακέτα, δεν λήγουν ποτέ και μια αποτυχημένη μετατροπή δεν κοστίζει ποτέ τίποτα.',
    tr: 'Akıllı işlevler dosya başına değil kullanıma göre ücretlendirilir — her 5 dakikalık ses ya da video için 1 kredi, yukarı yuvarlanarak. Abonelik yok: krediler küçük ön ödemeli paketlerle alınır, asla sona ermez ve başarısız bir dönüştürme hiçbir zaman hiçbir şeye mal olmaz.',
  },
};

// ── i18n strings ─────────────────────────────────────────────────────
const REGISTER_DESC = {
  en: 'Create a free account to start converting files. No credit card needed to sign up — pay only for the conversions you use. Sign up by email or with Google.',
  de: 'Kostenloses Konto erstellen und sofort Dateien konvertieren. Keine Kreditkarte für die Anmeldung nötig — Sie zahlen nur die Konvertierungen, die Sie nutzen. Anmeldung per E-Mail oder mit Google.',
  fr: 'Créez un compte gratuit et commencez à convertir vos fichiers. Aucune carte bancaire pour l’inscription — vous ne payez que les conversions que vous utilisez. Inscription par e-mail ou via Google.',
  es: 'Crea una cuenta gratuita y empieza a convertir archivos. No se necesita tarjeta para registrarse: solo pagas las conversiones que uses. Registro por email o con Google.',
  it: 'Crea un account gratuito e inizia a convertire file. Nessuna carta richiesta per registrarsi: paghi solo le conversioni che usi. Registrazione via email o con Google.',
  pt: 'Crie uma conta gratuita e comece a converter ficheiros. Não é necessário cartão para se registar — paga apenas as conversões que usar. Registo por email ou com Google.',
  nl: 'Maak gratis een account aan en begin met het converteren van bestanden. Geen creditcard nodig om je aan te melden — je betaalt alleen voor de conversies die je gebruikt. Aanmelden per e-mail of met Google.',
  pl: 'Załóż darmowe konto i zacznij konwertować pliki. Rejestracja bez karty — płacisz tylko za konwersje, których używasz. Rejestracja przez email lub Google.',
  sv: 'Skapa ett gratis konto och börja konvertera filer. Inget kort krävs för att registrera dig — du betalar bara för de konverteringar du använder. Registrera dig med e-post eller Google.',
  no: 'Opprett en gratis konto og begynn å konvertere filer. Ingen kort kreves for å registrere seg — du betaler bare for konverteringene du bruker. Registrer deg med e-post eller Google.',
  da: 'Opret en gratis konto, og begynd at konvertere filer. Intet kort kræves for at oprette dig — du betaler kun for de konverteringer, du bruger. Opret dig med e-mail eller Google.',
  fi: 'Luo ilmainen tili ja aloita tiedostojen muuntaminen. Rekisteröityminen ei vaadi korttia — maksat vain käyttämistäsi muunnoksista. Rekisteröidy sähköpostilla tai Googlella.',
  cs: 'Vytvořte si účet zdarma a začněte převádět soubory. K registraci není potřeba karta — platíte jen za převody, které využijete. Registrace e-mailem nebo přes Google.',
  ro: 'Creează un cont gratuit și începe să convertești fișiere. Nu e nevoie de card pentru înregistrare — plătești doar conversiile pe care le folosești. Înregistrare prin email sau cu Google.',
  hu: 'Hozzon létre ingyenes fiókot, és kezdje el a fájlok átalakítását. A regisztrációhoz nem kell bankkártya — csak a felhasznált átalakításokért fizet. Regisztráció e-maillel vagy Google-fiókkal.',
  el: 'Δημιουργήστε δωρεάν λογαριασμό και ξεκινήστε τη μετατροπή αρχείων. Δεν απαιτείται κάρτα για την εγγραφή — πληρώνετε μόνο τις μετατροπές που χρησιμοποιείτε. Εγγραφή με email ή με Google.',
  tr: 'Ücretsiz hesap oluşturun ve dosyaları dönüştürmeye başlayın. Kayıt için kart gerekmez — yalnızca kullandığınız dönüştürmeler için ödeme yaparsınız. E-posta veya Google ile kaydolun.',
};

const RATE_LIMIT_FREE = {
  en: 'No credits included',
  de: 'Keine Credits enthalten',
  fr: 'Aucun crédit inclus',
  es: 'Sin créditos incluidos',
  it: 'Nessun credito incluso',
  pt: 'Sem créditos incluídos',
  nl: 'Geen tegoeden inbegrepen',
  pl: 'Bez kredytów w pakiecie',
  sv: 'Inga krediter ingår',
  no: 'Ingen kreditter inkludert',
  da: 'Ingen kreditter inkluderet',
  fi: 'Ei sisällytettyjä krediittejä',
  cs: 'Žádné kredity v ceně',
  ro: 'Fără credite incluse',
  hu: 'Nem tartalmaz kreditet',
  el: 'Δεν περιλαμβάνονται μονάδες',
  tr: 'Kredi dahil değil',
};

const lit = (s) => JSON.stringify(s);
let packEdits = 0, i18nEdits = 0, deletions = 0;

// Replace `'<key>': '<old>'` (any quote style) with the new value.
function replaceKeyedString(src, key, value, { quotedKey = false } = {}) {
  const k = quotedKey ? `'${key.replace(/\./g, '\\.')}'` : key;
  const re = new RegExp(`(${k}\\s*:\\s*)(['"\`])(?:\\\\.|(?!\\2)[\\s\\S])*\\2`);
  if (!re.test(src)) return null;
  return src.replace(re, (_m, head) => head + lit(value));
}

// ── 1. tool content packs ────────────────────────────────────────────
for (const lang of LANGS) {
  const file = path.join(PACKS, `${lang}.js`);
  let src = fs.readFileSync(file, 'utf8');
  for (const [key, byLang] of Object.entries(PACK)) {
    const next = replaceKeyedString(src, key, byLang[lang], { quotedKey: true });
    if (next === null) throw new Error(`${lang}: key not found in pack: ${key}`);
    src = next;
    packEdits++;
  }
  fs.writeFileSync(file, src);
}

// ── 2. English i18n.js ───────────────────────────────────────────────
{
  let src = fs.readFileSync(I18N, 'utf8');

  let next = replaceKeyedString(src, 'registerDesc', REGISTER_DESC.en);
  if (next === null) throw new Error('en: registerDesc not found');
  src = next; i18nEdits++;

  next = replaceKeyedString(src, 'rateLimitsFreeLimit', RATE_LIMIT_FREE.en);
  if (next === null) throw new Error('en: rateLimitsFreeLimit not found');
  src = next; i18nEdits++;

  // freeFeat1 is nothing but the false claim, and no component renders it.
  const del = /^\s*freeFeat1:\s*(['"])(?:\\.|(?!\1).)*\1,?\s*\n/m;
  if (!del.test(src)) throw new Error('en: freeFeat1 not found');
  src = src.replace(del, ''); deletions++;

  fs.writeFileSync(I18N, src);
}

// ── 3. the other 16 languages ────────────────────────────────────────
{
  let src = fs.readFileSync(TRANS, 'utf8');

  const blockRange = (lang) => {
    const start = src.indexOf(`\nconst ${lang} = {`);
    if (start === -1) throw new Error(`block not found: ${lang}`);
    const later = NON_EN.map((l) => src.indexOf(`\nconst ${l} = {`)).filter((i) => i > start).sort((a, b) => a - b);
    const end = later.length ? later[0] : src.indexOf('\nexport const translations');
    return [start, end === -1 ? src.length : end];
  };

  for (const lang of NON_EN) {
    const [start, end] = blockRange(lang);
    let block = src.slice(start, end);

    let next = replaceKeyedString(block, 'registerDesc', REGISTER_DESC[lang]);
    if (next === null) throw new Error(`${lang}: registerDesc not found`);
    block = next; i18nEdits++;

    next = replaceKeyedString(block, 'rateLimitsFreeLimit', RATE_LIMIT_FREE[lang]);
    if (next === null) throw new Error(`${lang}: rateLimitsFreeLimit not found`);
    block = next; i18nEdits++;

    // freeFeat1 sits inline among other keys here, so drop just the pair.
    const inline = /freeFeat1:\s*(['"])(?:\\.|(?!\1).)*\1,\s*/;
    if (!inline.test(block)) throw new Error(`${lang}: freeFeat1 not found`);
    block = block.replace(inline, ''); deletions++;

    src = src.slice(0, start) + block + src.slice(end);
  }

  fs.writeFileSync(TRANS, src);
}

console.log(`Pack FAQ answers rewritten: ${packEdits} (4 keys x 17 languages)`);
console.log(`i18n strings rewritten:     ${i18nEdits} (2 keys x 17 languages)`);
console.log(`freeFeat1 deleted:          ${deletions} languages`);
