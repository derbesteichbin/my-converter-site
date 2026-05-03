// Chunk 1 of 3: fills the 5 missing About keys (teamTitle, teamBody,
// ctaTitle, ctaBody, ctaButton) in fr, es, it, pt, nl, pl, sv, no.
// Run from repo root:  node scripts/fill-gap-1-about.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

const T = {
  fr: {
    teamTitle: "L'équipe",
    teamBody: "{{brand}} est conçu et maintenu par une petite équipe passionnée basée à Düsseldorf, en Allemagne. Nous sommes un mélange d'ingénieurs back-end, d'artisans front-end et d'un chef de produit obstiné qui refuse de livrer quoi que ce soit qui scintille sur mobile. Nous n'avons pas d'investisseurs, de contrats publicitaires ni de quotas de croissance — ce qui signifie que notre seul client, c'est vous, et notre seule métrique est de savoir si votre prochaine conversion est rapide et donne le bon résultat.",
    ctaTitle: 'Prêt à convertir quelque chose ?',
    ctaBody: "Parcourez l'ensemble du catalogue d'outils de conversion, choisissez celui dont vous avez besoin et obtenez un fichier converti dans votre dossier de téléchargements en quelques secondes. Pas d'installation, pas d'obstacle à l'inscription pour parcourir, des prix transparents au paiement à l'usage dès que vous créez un compte gratuit.",
    ctaButton: 'Parcourir tous les outils',
  },
  es: {
    teamTitle: 'El equipo',
    teamBody: '{{brand}} está construido y mantenido por un pequeño equipo apasionado con sede en Düsseldorf, Alemania. Somos una mezcla de ingenieros backend, artesanos frontend y un terco gestor de producto que se niega a publicar nada que parpadee en móvil. No tenemos inversores, contratos publicitarios ni cuotas de crecimiento — lo que significa que nuestro único cliente es usted, y nuestra única métrica es si su próxima conversión es rápida y entrega el resultado correcto.',
    ctaTitle: '¿Listo para convertir algo?',
    ctaBody: 'Explore el catálogo completo de herramientas de conversión, elija la que necesite y tenga un archivo convertido en su carpeta de descargas en segundos. Sin instalación, sin barreras de registro para navegar, precios transparentes de pago por uso una vez que cree una cuenta gratuita.',
    ctaButton: 'Explorar todas las herramientas',
  },
  it: {
    teamTitle: 'Il team',
    teamBody: '{{brand}} è costruito e gestito da un piccolo team appassionato con sede a Düsseldorf, Germania. Siamo un mix di ingegneri backend, artigiani frontend e un product manager testardo che si rifiuta di rilasciare qualsiasi cosa che tremoli su mobile. Non abbiamo investitori, contratti pubblicitari o quote di crescita — il che significa che il nostro unico cliente siete voi, e la nostra unica metrica è se la vostra prossima conversione è veloce e fornisce il risultato corretto.',
    ctaTitle: 'Pronto a convertire qualcosa?',
    ctaBody: "Esplora il catalogo completo degli strumenti di conversione, scegli quello che ti serve e avrai un file convertito nella cartella dei download in pochi secondi. Niente installazioni, niente ostacoli di registrazione per sfogliare, prezzi trasparenti pay-as-you-go quando crei un account gratuito.",
    ctaButton: 'Sfoglia tutti gli strumenti',
  },
  pt: {
    teamTitle: 'A equipa',
    teamBody: '{{brand}} é construído e mantido por uma pequena equipa apaixonada com sede em Düsseldorf, Alemanha. Somos uma mistura de engenheiros de backend, artesãos de frontend e um teimoso gestor de produto que se recusa a lançar qualquer coisa que tremule no telemóvel. Não temos investidores, contratos publicitários ou quotas de crescimento — o que significa que o nosso único cliente é você, e a nossa única métrica é se a sua próxima conversão é rápida e entrega o resultado correto.',
    ctaTitle: 'Pronto para converter algo?',
    ctaBody: 'Explore o catálogo completo de ferramentas de conversão, escolha a que precisa e tenha um ficheiro convertido na sua pasta de downloads em segundos. Sem instalação, sem barreiras de registo para navegar, preços transparentes de pagamento por uso assim que criar uma conta gratuita.',
    ctaButton: 'Explorar todas as ferramentas',
  },
  nl: {
    teamTitle: 'Het team',
    teamBody: '{{brand}} wordt gebouwd en onderhouden door een klein, gepassioneerd team gevestigd in Düsseldorf, Duitsland. We zijn een mix van backend-engineers, frontend-vakmensen en een koppige product manager die weigert iets uit te brengen dat flikkert op mobiel. We hebben geen investeerders, advertentiecontracten of groeiquota — wat betekent dat onze enige klant jij bent, en onze enige maatstaf is of je volgende conversie snel is en het juiste resultaat oplevert.',
    ctaTitle: 'Klaar om iets te converteren?',
    ctaBody: 'Blader door de volledige catalogus van conversietools, kies degene die je nodig hebt en heb binnen seconden een geconverteerd bestand in je downloadmap. Geen installatie, geen registratiehindernis om te bladeren, transparante pay-as-you-go prijzen zodra je een gratis account aanmaakt.',
    ctaButton: 'Bekijk alle tools',
  },
  pl: {
    teamTitle: 'Zespół',
    teamBody: '{{brand}} jest budowany i utrzymywany przez mały, pełen pasji zespół z siedzibą w Düsseldorfie w Niemczech. Jesteśmy mieszanką inżynierów backend, rzemieślników frontend i upartego menedżera produktu, który odmawia wydawania czegokolwiek, co miga na urządzeniach mobilnych. Nie mamy inwestorów, kontraktów reklamowych ani limitów wzrostu — co oznacza, że naszym jedynym klientem jesteś Ty, a naszą jedyną miarą jest to, czy następna konwersja jest szybka i daje prawidłowy wynik.',
    ctaTitle: 'Gotowy, aby coś przekonwertować?',
    ctaBody: 'Przeglądaj pełny katalog narzędzi do konwersji, wybierz to, którego potrzebujesz, i miej przekonwertowany plik w folderze pobierania w sekundach. Bez instalacji, bez przeszkód rejestracji do przeglądania, przejrzyste ceny pay-as-you-go po utworzeniu darmowego konta.',
    ctaButton: 'Przeglądaj wszystkie narzędzia',
  },
  sv: {
    teamTitle: 'Teamet',
    teamBody: '{{brand}} byggs och underhålls av ett litet, passionerat team baserat i Düsseldorf, Tyskland. Vi är en blandning av backend-ingenjörer, frontend-hantverkare och en envis produktchef som vägrar släppa något som flimrar på mobil. Vi har inga investerare, reklamkontrakt eller tillväxtkvoter — vilket innebär att vår enda kund är du, och vårt enda mått är om din nästa konvertering är snabb och ger rätt resultat.',
    ctaTitle: 'Redo att konvertera något?',
    ctaBody: 'Bläddra igenom hela katalogen av konverteringsverktyg, välj det du behöver och ha en konverterad fil i din nedladdningsmapp på sekunder. Ingen installation, inga registreringshinder för att bläddra, transparenta pay-as-you-go-priser när du skapar ett gratis konto.',
    ctaButton: 'Bläddra bland alla verktyg',
  },
  no: {
    teamTitle: 'Teamet',
    teamBody: '{{brand}} bygges og vedlikeholdes av et lite, lidenskapelig team basert i Düsseldorf, Tyskland. Vi er en blanding av backend-ingeniører, frontend-håndverkere og en sta produktleder som nekter å lansere noe som flimrer på mobil. Vi har ingen investorer, reklamekontrakter eller vekstkvoter — som betyr at vår eneste kunde er deg, og vårt eneste mål er om din neste konvertering er rask og gir riktig resultat.',
    ctaTitle: 'Klar til å konvertere noe?',
    ctaBody: 'Bla gjennom hele katalogen av konverteringsverktøy, velg den du trenger og få en konvertert fil i nedlastingsmappen på sekunder. Ingen installasjon, ingen registreringshindringer for å bla, transparente pay-as-you-go-priser når du oppretter en gratis konto.',
    ctaButton: 'Bla gjennom alle verktøy',
  },
};

function findLangBlock(text, langName) {
  const start = text.indexOf(`const ${langName} = {`);
  if (start === -1) throw new Error(`Section not found: ${langName}`);
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return [start, i + 1];
    }
  }
  throw new Error(`Unterminated section: ${langName}`);
}

function findSubObject(block, keyName) {
  const re = new RegExp(`\\b${keyName}:\\s*\\{`);
  const m = re.exec(block);
  if (!m) return null;
  const openIdx = m.index + m[0].length - 1;
  let depth = 0;
  for (let i = openIdx; i < block.length; i++) {
    if (block[i] === '{') depth++;
    else if (block[i] === '}') {
      depth--;
      if (depth === 0) return [openIdx, i];
    }
  }
  return null;
}

function appendKeys(block, keyName, additions) {
  const found = findSubObject(block, keyName);
  if (!found) throw new Error(`sub-object ${keyName} not found`);
  const [, closeIdx] = found;
  return block.slice(0, closeIdx).replace(/\s*$/, '') + ', ' + additions + ' ' + block.slice(closeIdx);
}

for (const [lang, keys] of Object.entries(T)) {
  const [start, end] = findLangBlock(content, lang);
  let block = content.slice(start, end);
  const additions = Object.entries(keys)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(', ');
  block = appendKeys(block, 'about', additions);
  content = content.slice(0, start) + block + content.slice(end);
  console.log(`✔ Updated ${lang}.about`);
}

fs.writeFileSync(FILE, content);
console.log(`\nDone.`);
