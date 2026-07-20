// One-shot: add the `report` (Report a problem) section to every non-English
// language in client/src/i18n-translations.js. English lives in i18n.js.
//
// A full `report: { ... }` object is inserted immediately before each
// language's `footer: {` section (unique per language). Values are written
// with JSON.stringify so apostrophes/quotes/diacritics are always safe.
//
// Run from repo root:  node scripts/add-report-translations.js

const fs = require('fs');
const path = require('path');

const TRANS = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
const LANGS = ['de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'sv', 'no', 'da', 'fi', 'cs', 'ro', 'hu', 'el', 'tr'];

const KEYS = [
  'button', 'title', 'intro', 'messageLabel', 'messagePlaceholder', 'charsLeft',
  'emailLabel', 'emailPlaceholder', 'emailHint', 'submit', 'submitting', 'cancel',
  'success', 'done', 'error', 'required',
];

const T = {
  de: {
    button: 'Ein Problem melden', title: 'Ein Problem melden',
    intro: 'Etwas funktioniert nicht? Sagen Sie uns Bescheid und wir beheben es.',
    messageLabel: 'Was ist schiefgelaufen?', messagePlaceholder: 'Beschreiben Sie das Problem…',
    charsLeft: 'Noch {{n}} Zeichen', emailLabel: 'Ihre E-Mail (optional)', emailPlaceholder: 'you@example.com',
    emailHint: 'Geben Sie Ihre E-Mail an, wenn Sie eine Antwort möchten.',
    submit: 'Bericht senden', submitting: 'Senden…', cancel: 'Abbrechen',
    success: 'Danke – Ihr Bericht wurde gesendet.', done: 'Fertig',
    error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    required: 'Bitte beschreiben Sie zuerst das Problem.',
  },
  fr: {
    button: 'Signaler un problème', title: 'Signaler un problème',
    intro: 'Quelque chose ne fonctionne pas ? Dites-le-nous et nous le corrigerons.',
    messageLabel: "Qu'est-ce qui ne va pas ?", messagePlaceholder: 'Décrivez le problème…',
    charsLeft: '{{n}} caractères restants', emailLabel: 'Votre e-mail (facultatif)', emailPlaceholder: 'you@example.com',
    emailHint: 'Ajoutez votre e-mail si vous souhaitez une réponse.',
    submit: 'Envoyer le rapport', submitting: 'Envoi…', cancel: 'Annuler',
    success: 'Merci — votre rapport a été envoyé.', done: 'Terminé',
    error: "Une erreur s'est produite. Veuillez réessayer.",
    required: "Veuillez d'abord décrire le problème.",
  },
  es: {
    button: 'Reportar un problema', title: 'Reportar un problema',
    intro: '¿Algo no funciona? Cuéntanoslo y lo solucionaremos.',
    messageLabel: '¿Qué ha fallado?', messagePlaceholder: 'Describe el problema…',
    charsLeft: '{{n}} caracteres restantes', emailLabel: 'Tu correo (opcional)', emailPlaceholder: 'you@example.com',
    emailHint: 'Añade tu correo si quieres una respuesta.',
    submit: 'Enviar informe', submitting: 'Enviando…', cancel: 'Cancelar',
    success: 'Gracias: tu informe ha sido enviado.', done: 'Listo',
    error: 'Algo salió mal. Inténtalo de nuevo.',
    required: 'Describe primero el problema.',
  },
  it: {
    button: 'Segnala un problema', title: 'Segnala un problema',
    intro: 'Qualcosa non funziona? Faccelo sapere e lo sistemeremo.',
    messageLabel: 'Cosa non ha funzionato?', messagePlaceholder: 'Descrivi il problema…',
    charsLeft: '{{n}} caratteri rimanenti', emailLabel: 'La tua email (facoltativa)', emailPlaceholder: 'you@example.com',
    emailHint: 'Aggiungi la tua email se desideri una risposta.',
    submit: 'Invia segnalazione', submitting: 'Invio…', cancel: 'Annulla',
    success: 'Grazie — la tua segnalazione è stata inviata.', done: 'Fatto',
    error: 'Qualcosa è andato storto. Riprova.',
    required: 'Descrivi prima il problema.',
  },
  pt: {
    button: 'Reportar um problema', title: 'Reportar um problema',
    intro: 'Algo não está a funcionar? Diga-nos e nós corrigimos.',
    messageLabel: 'O que correu mal?', messagePlaceholder: 'Descreva o problema…',
    charsLeft: '{{n}} caracteres restantes', emailLabel: 'O seu email (opcional)', emailPlaceholder: 'you@example.com',
    emailHint: 'Adicione o seu email se quiser uma resposta.',
    submit: 'Enviar relatório', submitting: 'A enviar…', cancel: 'Cancelar',
    success: 'Obrigado — o seu relatório foi enviado.', done: 'Concluído',
    error: 'Algo correu mal. Tente novamente.',
    required: 'Descreva primeiro o problema.',
  },
  nl: {
    button: 'Een probleem melden', title: 'Een probleem melden',
    intro: 'Werkt er iets niet? Laat het ons weten en we lossen het op.',
    messageLabel: 'Wat ging er mis?', messagePlaceholder: 'Beschrijf het probleem…',
    charsLeft: 'Nog {{n}} tekens', emailLabel: 'Je e-mail (optioneel)', emailPlaceholder: 'you@example.com',
    emailHint: 'Voeg je e-mail toe als je een reactie wilt.',
    submit: 'Melding versturen', submitting: 'Versturen…', cancel: 'Annuleren',
    success: 'Bedankt — je melding is verzonden.', done: 'Klaar',
    error: 'Er is iets misgegaan. Probeer het opnieuw.',
    required: 'Beschrijf eerst het probleem.',
  },
  pl: {
    button: 'Zgłoś problem', title: 'Zgłoś problem',
    intro: 'Coś nie działa? Daj nam znać, a to naprawimy.',
    messageLabel: 'Co poszło nie tak?', messagePlaceholder: 'Opisz problem…',
    charsLeft: 'Pozostało {{n}} znaków', emailLabel: 'Twój e-mail (opcjonalnie)', emailPlaceholder: 'you@example.com',
    emailHint: 'Dodaj swój e-mail, jeśli chcesz otrzymać odpowiedź.',
    submit: 'Wyślij zgłoszenie', submitting: 'Wysyłanie…', cancel: 'Anuluj',
    success: 'Dziękujemy — Twoje zgłoszenie zostało wysłane.', done: 'Gotowe',
    error: 'Coś poszło nie tak. Spróbuj ponownie.',
    required: 'Najpierw opisz problem.',
  },
  sv: {
    button: 'Rapportera ett problem', title: 'Rapportera ett problem',
    intro: 'Något som inte fungerar? Berätta för oss så fixar vi det.',
    messageLabel: 'Vad gick fel?', messagePlaceholder: 'Beskriv problemet…',
    charsLeft: '{{n}} tecken kvar', emailLabel: 'Din e-post (valfritt)', emailPlaceholder: 'you@example.com',
    emailHint: 'Lägg till din e-post om du vill ha svar.',
    submit: 'Skicka rapport', submitting: 'Skickar…', cancel: 'Avbryt',
    success: 'Tack — din rapport har skickats.', done: 'Klar',
    error: 'Något gick fel. Försök igen.',
    required: 'Beskriv problemet först.',
  },
  no: {
    button: 'Rapporter et problem', title: 'Rapporter et problem',
    intro: 'Er det noe som ikke fungerer? Si fra, så fikser vi det.',
    messageLabel: 'Hva gikk galt?', messagePlaceholder: 'Beskriv problemet…',
    charsLeft: '{{n}} tegn igjen', emailLabel: 'Din e-post (valgfritt)', emailPlaceholder: 'you@example.com',
    emailHint: 'Legg til e-posten din hvis du vil ha svar.',
    submit: 'Send rapport', submitting: 'Sender…', cancel: 'Avbryt',
    success: 'Takk — rapporten din er sendt.', done: 'Ferdig',
    error: 'Noe gikk galt. Prøv igjen.',
    required: 'Beskriv problemet først.',
  },
  da: {
    button: 'Rapportér et problem', title: 'Rapportér et problem',
    intro: 'Er der noget, der ikke virker? Sig til, så løser vi det.',
    messageLabel: 'Hvad gik galt?', messagePlaceholder: 'Beskriv problemet…',
    charsLeft: '{{n}} tegn tilbage', emailLabel: 'Din e-mail (valgfrit)', emailPlaceholder: 'you@example.com',
    emailHint: 'Tilføj din e-mail, hvis du vil have svar.',
    submit: 'Send rapport', submitting: 'Sender…', cancel: 'Annuller',
    success: 'Tak — din rapport er sendt.', done: 'Færdig',
    error: 'Noget gik galt. Prøv igen.',
    required: 'Beskriv problemet først.',
  },
  fi: {
    button: 'Ilmoita ongelmasta', title: 'Ilmoita ongelmasta',
    intro: 'Eikö jokin toimi? Kerro meille, niin korjaamme sen.',
    messageLabel: 'Mikä meni pieleen?', messagePlaceholder: 'Kuvaile ongelmaa…',
    charsLeft: '{{n}} merkkiä jäljellä', emailLabel: 'Sähköpostisi (valinnainen)', emailPlaceholder: 'you@example.com',
    emailHint: 'Lisää sähköpostisi, jos haluat vastauksen.',
    submit: 'Lähetä ilmoitus', submitting: 'Lähetetään…', cancel: 'Peruuta',
    success: 'Kiitos — ilmoituksesi on lähetetty.', done: 'Valmis',
    error: 'Jotain meni pieleen. Yritä uudelleen.',
    required: 'Kuvaile ensin ongelma.',
  },
  cs: {
    button: 'Nahlásit problém', title: 'Nahlásit problém',
    intro: 'Něco nefunguje? Dejte nám vědět a my to opravíme.',
    messageLabel: 'Co se pokazilo?', messagePlaceholder: 'Popište problém…',
    charsLeft: 'Zbývá {{n}} znaků', emailLabel: 'Váš e-mail (nepovinné)', emailPlaceholder: 'you@example.com',
    emailHint: 'Přidejte svůj e-mail, pokud chcete odpověď.',
    submit: 'Odeslat hlášení', submitting: 'Odesílání…', cancel: 'Zrušit',
    success: 'Děkujeme — vaše hlášení bylo odesláno.', done: 'Hotovo',
    error: 'Něco se pokazilo. Zkuste to znovu.',
    required: 'Nejprve popište problém.',
  },
  ro: {
    button: 'Raportează o problemă', title: 'Raportează o problemă',
    intro: 'Ceva nu funcționează? Spune-ne și vom rezolva.',
    messageLabel: 'Ce nu a mers?', messagePlaceholder: 'Descrie problema…',
    charsLeft: '{{n}} caractere rămase', emailLabel: 'E-mailul tău (opțional)', emailPlaceholder: 'you@example.com',
    emailHint: 'Adaugă e-mailul dacă vrei un răspuns.',
    submit: 'Trimite raportul', submitting: 'Se trimite…', cancel: 'Anulează',
    success: 'Mulțumim — raportul tău a fost trimis.', done: 'Gata',
    error: 'Ceva nu a mers bine. Încearcă din nou.',
    required: 'Descrie mai întâi problema.',
  },
  hu: {
    button: 'Probléma jelentése', title: 'Probléma jelentése',
    intro: 'Valami nem működik? Szóljon, és megjavítjuk.',
    messageLabel: 'Mi a probléma?', messagePlaceholder: 'Írja le a problémát…',
    charsLeft: '{{n}} karakter maradt', emailLabel: 'Az Ön e-mail-címe (opcionális)', emailPlaceholder: 'you@example.com',
    emailHint: 'Adja meg e-mail-címét, ha választ szeretne.',
    submit: 'Jelentés küldése', submitting: 'Küldés…', cancel: 'Mégse',
    success: 'Köszönjük — a jelentését elküldtük.', done: 'Kész',
    error: 'Valami hiba történt. Próbálja újra.',
    required: 'Először írja le a problémát.',
  },
  el: {
    button: 'Αναφορά προβλήματος', title: 'Αναφορά προβλήματος',
    intro: 'Κάτι δεν λειτουργεί; Πείτε μας και θα το διορθώσουμε.',
    messageLabel: 'Τι πήγε στραβά;', messagePlaceholder: 'Περιγράψτε το πρόβλημα…',
    charsLeft: 'Απομένουν {{n}} χαρακτήρες', emailLabel: 'Το email σας (προαιρετικό)', emailPlaceholder: 'you@example.com',
    emailHint: 'Προσθέστε το email σας αν θέλετε απάντηση.',
    submit: 'Αποστολή αναφοράς', submitting: 'Αποστολή…', cancel: 'Άκυρο',
    success: 'Ευχαριστούμε — η αναφορά σας στάλθηκε.', done: 'Τέλος',
    error: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.',
    required: 'Περιγράψτε πρώτα το πρόβλημα.',
  },
  tr: {
    button: 'Sorun bildir', title: 'Sorun bildir',
    intro: 'Çalışmayan bir şey mi var? Bize bildirin, düzeltelim.',
    messageLabel: 'Ne ters gitti?', messagePlaceholder: 'Sorunu açıklayın…',
    charsLeft: '{{n}} karakter kaldı', emailLabel: 'E-postanız (isteğe bağlı)', emailPlaceholder: 'you@example.com',
    emailHint: 'Yanıt istiyorsanız e-postanızı ekleyin.',
    submit: 'Raporu gönder', submitting: 'Gönderiliyor…', cancel: 'İptal',
    success: 'Teşekkürler — raporunuz gönderildi.', done: 'Tamam',
    error: 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
    required: 'Lütfen önce sorunu açıklayın.',
  },
};

let src = fs.readFileSync(TRANS, 'utf8');
let cursor = 0;

for (const lang of LANGS) {
  const decl = `const ${lang} = {`;
  const declIdx = src.indexOf(decl, cursor);
  if (declIdx === -1) throw new Error(`Could not find declaration for language: ${lang}`);

  const anchor = src.indexOf('footer: {', declIdx);
  if (anchor === -1) throw new Error(`Could not find footer section for language: ${lang}`);

  const dict = T[lang];
  const missing = KEYS.filter((k) => !(k in dict));
  if (missing.length) throw new Error(`Missing report translations for ${lang}: ${missing.join(', ')}`);

  const body = KEYS.map((k) => `${k}: ${JSON.stringify(dict[k])}`).join(', ');
  const insertion = `report: { ${body} }, `;
  src = src.slice(0, anchor) + insertion + src.slice(anchor);

  cursor = anchor + insertion.length + 'footer: {'.length;
}

fs.writeFileSync(TRANS, src);
console.log(`Inserted report section (${KEYS.length} keys) into ${LANGS.length} languages.`);
