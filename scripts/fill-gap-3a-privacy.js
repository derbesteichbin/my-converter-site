// Chunk 3a of 3: replaces the entire `privacy` block in es/it/pt with the
// comprehensive GDPR-compliant content matching the EN/DE rewrite.
// Run from repo root:  node scripts/fill-gap-3a-privacy.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

// =====================================================================
// Spanish
// =====================================================================
const esPrivacy = {
  title: 'Política de Privacidad',
  seoDesc: 'Política de Privacidad de {{brand}}. Tratamiento de datos conforme al RGPD: qué recopilamos, base legal, conservación, subcontratistas, sus derechos, transferencias internacionales.',
  updated: 'Última actualización: mayo de 2026',
  s1Title: '1. Responsable del tratamiento',
  s1Body: 'El responsable del tratamiento de los datos personales tratados a través de {{brand}} (el "Servicio") es Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Alemania. Para todas las consultas sobre protección de datos — incluida la solicitud para ejercer sus derechos conforme al Reglamento General de Protección de Datos (RGPD) — contacte con nosotros por correo a Support@convertanyformat.com. Como no superamos los umbrales del Art. 37 RGPD ni del § 38 BDSG, no estamos obligados a designar un Delegado de Protección de Datos; el responsable gestiona personalmente todas las cuestiones de protección de datos. Esta Política explica qué datos recopilamos, por qué, sobre qué base legal, con quién los compartimos, cuánto tiempo los conservamos y qué derechos tiene.',
  s2Title: '2. Datos personales que recopilamos',
  s2Account: 'Datos de la cuenta:',
  s2AccountBody: ' su dirección de correo, nombre de visualización opcional, hash bcrypt de su contraseña (nunca la contraseña en sí), identificador de cuenta de Google al iniciar sesión vía OAuth, preferencias de cuenta (tema, idioma, notificaciones) y código de referencia si aplica.',
  s2Usage: 'Datos de uso:',
  s2UsageBody: ' historial de conversiones (nombre de archivo, formato de entrada/salida, marca de tiempo, estado), saldo de créditos y registro de transacciones, estadísticas de uso de herramientas, dirección IP y ubicación aproximada derivada de la IP con fines de prevención de fraude.',
  s2Payment: 'Datos de pago:',
  s2PaymentBody: ' procesados íntegramente por Stripe Payments Europe Ltd. Recibimos solo un identificador de cliente Stripe, los últimos cuatro dígitos de la tarjeta, la marca de la tarjeta y una confirmación de transacción. Nunca vemos ni almacenamos números completos de tarjetas, CVCs ni credenciales bancarias.',
  s2File: 'Datos de archivos:',
  s2FileBody: ' los archivos que carga para conversión se almacenan solo el tiempo necesario para entregar el Servicio y se eliminan automáticamente en veinticuatro horas. No accedemos al contenido de sus archivos, ni lo leemos ni lo analizamos, salvo lo estrictamente necesario para realizar la conversión solicitada.',
  s2Tech: 'Datos técnicos:',
  s2TechBody: ' tipo y versión del navegador, sistema operativo, tipo de dispositivo, URL de referencia, preferencia de idioma e identificadores de cookies. Recopilados automáticamente para seguridad, prevención de abuso y entrega del Servicio.',
  s3Title: '3. Finalidades del tratamiento',
  s3Body: 'Tratamos datos personales para los siguientes fines: (a) operar el Servicio, incluyendo la entrega de las conversiones solicitadas, la gestión de su cuenta y la contabilidad de saldos de crédito; (b) procesar pagos y emitir facturas conformes a fines fiscales a través de Stripe; (c) enviar correos transaccionales como verificación de cuenta, restablecimiento de contraseña, notificaciones de finalización de conversión a las que se haya suscrito y anuncios de estado del Servicio; (d) responder a consultas de soporte y resolver disputas; (e) analizar uso agregado y no identificable para mejorar el Servicio; (f) prevenir fraude, abuso y acceso no autorizado; y (g) cumplir obligaciones legales incluida la conservación de registros fiscales.',
  s4Title: '4. Base legal del tratamiento (Art. 6 RGPD)',
  s4ContractTitle: 'Ejecución de contrato (Art. 6 (1) (b)):',
  s4ContractBody: ' procesar sus conversiones, gestionar su cuenta y operar el sistema de créditos son necesarios para ejecutar el contrato celebrado al registrarse o realizar una compra.',
  s4InterestTitle: 'Interés legítimo (Art. 6 (1) (f)):',
  s4InterestBody: ' prevención de fraude, monitorización de seguridad, detección de abuso, análisis agregados y mejora del Servicio. Hemos realizado un test de ponderación y considerado sus derechos y libertades fundamentales.',
  s4ConsentTitle: 'Consentimiento (Art. 6 (1) (a)):',
  s4ConsentBody: ' correos de marketing, cookies analíticas y cualquier funcionalidad opcional que vaya más allá de lo estrictamente necesario. El consentimiento se otorga libremente vía banner de cookies o ajustes y puede retirarse en cualquier momento sin afectar a la legitimidad del tratamiento previo a la retirada.',
  s4LegalTitle: 'Obligación legal (Art. 6 (1) (c)):',
  s4LegalBody: ' conservación de registros fiscalmente relevantes según el § 147 AO (Código Fiscal alemán), respuesta a solicitudes legales de autoridades competentes y cualquier otra obligación impuesta por la legislación de la UE o alemana.',
  s5Title: '5. Cookies y tecnologías similares',
  s5EssentialTitle: 'Cookies esenciales:',
  s5EssentialBody: ' su token de autenticación (httpOnly, SameSite=Strict), preferencia de tema, preferencia de idioma y estado de consentimiento de cookies. Estrictamente necesarias para el funcionamiento del Servicio y no requieren consentimiento conforme al § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Cookies analíticas:',
  s5AnalyticsBody: ' se establecen solo con su consentimiento expreso vía el banner de cookies. Nos ayudan a entender cómo se usa el Servicio en agregado. Puede retirar el consentimiento en cualquier momento y eliminaremos las cookies correspondientes.',
  s5MarketingTitle: 'Cookies de marketing:',
  s5MarketingBody: ' se establecen solo con su consentimiento expreso. Se usan para personalizar comunicaciones. Puede retirar el consentimiento en cualquier momento.',
  s5Manage: 'Puede gestionar sus preferencias de cookies en cualquier momento mediante el icono de cookies en el pie de página. Los ajustes del navegador también permiten bloquear, eliminar o restringir cookies — tenga en cuenta que bloquear cookies esenciales le impedirá iniciar sesión o realizar compras.',
  s6Title: '6. Comunicación de datos a subcontratistas',
  s6Body: 'Compartimos datos personales únicamente con los siguientes subcontratistas, cada uno bajo un Acuerdo de Tratamiento de Datos conforme al Art. 28 RGPD. Stripe Payments Europe Ltd. (Irlanda) gestiona el procesamiento de pagos; CloudConvert GmbH (Múnich, Alemania) procesa las conversiones de archivos; Supabase Inc. (Estados Unidos, transferencias amparadas por Cláusulas Contractuales Tipo) aloja nuestra base de datos PostgreSQL; Railway Corp. (Estados Unidos, CCT) aloja nuestra aplicación; Resend (Estados Unidos, CCT) entrega correos transaccionales; OpenAI Ireland Ltd. procesa entradas de Smart Functions (audio/texto); y Google LLC (Estados Unidos, certificada bajo el Marco de Privacidad de Datos UE-EE.UU.) provee el inicio de sesión Google OAuth. No vendemos sus datos personales nunca, y no los transferimos a terceros para sus propios fines de marketing.',
  s7Title: '7. Conservación de datos',
  s7Files: 'Archivos:',
  s7FilesBody: ' los archivos cargados y convertidos se eliminan en un plazo de veinticuatro (24) horas desde la carga, independientemente de si fueron descargados.',
  s7Account: 'Datos de cuenta:',
  s7AccountBody: ' se conservan mientras su cuenta esté activa. Al eliminar su cuenta, todos los datos asociados se eliminan en treinta (30) días, salvo los registros que estamos legalmente obligados a conservar.',
  s7Payment: 'Registros de pago y facturación:',
  s7PaymentBody: ' se conservan diez (10) años conforme al § 147 AO (Código Fiscal alemán) por motivos de cumplimiento fiscal y contable. Tras este periodo los datos se eliminan irreversiblemente.',
  s7Logs: 'Logs del servidor:',
  s7LogsBody: ' se conservan treinta (30) días por motivos de seguridad, prevención de abuso e investigación de incidentes, tras lo cual se purgan automáticamente.',
  s8Title: '8. Sus derechos conforme al RGPD',
  s8Intro: 'Tiene amplios derechos respecto a los datos personales que tratamos sobre usted:',
  s8Access: 'Derecho de acceso (Art. 15):',
  s8AccessBody: ' puede solicitar confirmación de si tratamos sus datos y una copia de los mismos.',
  s8Rect: 'Derecho de rectificación (Art. 16):',
  s8RectBody: ' puede corregir datos inexactos directamente desde su página de perfil o contactando con nosotros.',
  s8Erase: 'Derecho de supresión / "derecho al olvido" (Art. 17):',
  s8EraseBody: ' puede solicitar la eliminación de su cuenta y de todos los datos personales asociados, sujeto a obligaciones legales de conservación como los registros fiscales.',
  s8Port: 'Derecho a la portabilidad de los datos (Art. 20):',
  s8PortBody: ' puede solicitar una copia de sus datos en un formato estructurado, comúnmente utilizado y legible por máquina.',
  s8Restrict: 'Derecho a la limitación del tratamiento (Art. 18):',
  s8RestrictBody: ' puede solicitar que limitemos el tratamiento de sus datos mientras resolvemos una disputa, corregimos una inexactitud o evaluamos una reclamación legal.',
  s8Object: 'Derecho de oposición (Art. 21):',
  s8ObjectBody: ' puede oponerse al tratamiento basado en interés legítimo, incluida la elaboración de perfiles. Cesaremos salvo que demostremos motivos legítimos imperiosos que prevalezcan sobre sus intereses.',
  s8Withdraw: 'Derecho a retirar el consentimiento (Art. 7):',
  s8WithdrawBody: ' para cualquier tratamiento basado en consentimiento, puede retirarlo en cualquier momento sin que se vea afectada la legitimidad del tratamiento previo a la retirada.',
  s8Outro: 'Para ejercer cualquiera de estos derechos, escriba a Support@convertanyformat.com desde la dirección asociada a su cuenta. Responderemos en el plazo de un mes, prorrogable por dos meses adicionales para solicitudes complejas, según permite el Art. 12 (3) RGPD. El ejercicio de sus derechos es gratuito.',
  s9Title: '9. Seguridad de los datos',
  s9Body: 'Protegemos sus datos personales utilizando medidas técnicas y organizativas estándar del sector: cifrado TLS 1.2+ para todos los datos en tránsito; hash de contraseñas con bcrypt y factor de coste de 10 o superior; cookies de sesión httpOnly con el atributo SameSite=Strict; principio de mínimos privilegios para acceso interno con registro de auditoría; actualizaciones regulares de dependencias para corregir vulnerabilidades conocidas; limitación de tasa y validación de entradas para prevenir abuso; e infraestructura alojada en proveedores con certificaciones reconocidas (ISO 27001, SOC 2). Separamos lógica y físicamente el almacenamiento de archivos (efímero, 24 horas) y la base de datos de cuentas (persistente, cifrada en reposo). Los incidentes de seguridad se registran y revisan periódicamente. A pesar de todas las medidas, ninguna información transmitida por Internet puede protegerse con absoluta seguridad — protegemos sus datos con medios comercialmente razonables. En caso de violación de seguridad personal, notificaremos a la autoridad de control competente en 72 horas e informaremos a los usuarios afectados sin demora indebida, conforme a los Art. 33-34 RGPD.',
  s10Title: '10. Transferencias internacionales de datos',
  s10Body: 'Algunos de nuestros subcontratistas tienen su sede fuera del Espacio Económico Europeo, principalmente en Estados Unidos. Para cada transferencia hemos implementado las salvaguardas apropiadas requeridas por el Capítulo V RGPD. Las transferencias a Stripe (Irlanda) y CloudConvert (Alemania) permanecen dentro del EEE. Las transferencias a Supabase, Railway, Resend y OpenAI (Estados Unidos) se rigen por las Cláusulas Contractuales Tipo de la Comisión Europea (Módulo 2: responsable a encargado), complementadas con salvaguardas técnicas adicionales como cifrado en tránsito y en reposo. Google LLC está adicionalmente certificada bajo el Marco de Privacidad de Datos UE-EE.UU., proporcionando un nivel adecuado de protección en el sentido del Art. 45 RGPD.',
  s11Title: '11. Privacidad de los menores',
  s11Body: 'El Servicio no se dirige a menores de dieciséis (16) años, y no recopilamos conscientemente datos personales de niños menores de esa edad. Si es un padre/madre o tutor legal y cree que un menor de 16 años nos ha proporcionado datos personales, contacte con nosotros en Support@convertanyformat.com y eliminaremos rápidamente esos datos. Los usuarios entre 16 y 18 años declaran tener el consentimiento de un padre/madre o tutor legal cuando lo requiera la ley de su país de residencia.',
  s12Title: '12. Cambios en esta Política de Privacidad',
  s12Body: 'Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas, en las tecnologías que utilizamos, en los requisitos legales aplicables u otros factores operativos. Los cambios sustanciales se notificarán a su dirección de correo registrada con al menos treinta (30) días de antelación a su entrada en vigor. Los cambios no sustanciales (correcciones de erratas, formato, adiciones aclaratorias) entran en vigor con la publicación. La fecha "Última actualización" en la parte superior de esta página indica cuándo se revisó por última vez la Política. El uso continuado del Servicio tras la fecha efectiva de cualquier cambio constituye aceptación de la Política revisada.',
  s13Title: '13. Contacto y derecho a presentar reclamaciones',
  s13Body: 'Para consultas de protección de datos, solicitudes para ejercer sus derechos RGPD o cualquier otra inquietud relacionada con la privacidad, escriba a Support@convertanyformat.com. Procuramos responder en un mes. Sin perjuicio de cualquier otro recurso administrativo o judicial, tiene derecho conforme al Art. 77 RGPD a presentar una reclamación ante la autoridad de control del Estado miembro de la UE de su residencia, lugar de trabajo o lugar donde se haya producido la presunta infracción. La autoridad de control competente para {{brand}} es la Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Italian
// =====================================================================
const itPrivacy = {
  title: 'Informativa sulla Privacy',
  seoDesc: 'Informativa sulla Privacy di {{brand}}. Trattamento dei dati conforme al GDPR: cosa raccogliamo, base giuridica, conservazione, sub-responsabili, i tuoi diritti, trasferimenti internazionali.',
  updated: 'Ultimo aggiornamento: maggio 2026',
  s1Title: '1. Titolare del trattamento',
  s1Body: 'Il titolare del trattamento dei dati personali trattati tramite {{brand}} (il "Servizio") è Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Germania. Per qualsiasi richiesta in materia di protezione dei dati — incluse le richieste di esercizio dei diritti previsti dal Regolamento Generale sulla Protezione dei Dati (GDPR) — contattaci via email all\'indirizzo Support@convertanyformat.com. Poiché non superiamo le soglie di cui all\'art. 37 GDPR o al § 38 BDSG, non siamo obbligati a nominare un Responsabile della Protezione dei Dati; il titolare gestisce personalmente tutte le questioni di protezione dei dati. La presente Informativa spiega quali dati raccogliamo, perché, su quale base giuridica, con chi li condividiamo, per quanto tempo li conserviamo e quali diritti hai.',
  s2Title: '2. Dati personali che raccogliamo',
  s2Account: 'Dati dell\'account:',
  s2AccountBody: ' indirizzo email, nome visualizzato opzionale, hash bcrypt della password (mai la password in chiaro), identificatore Google in caso di accesso via OAuth, preferenze dell\'account (tema, lingua, notifiche) e codice di referral se applicabile.',
  s2Usage: 'Dati di utilizzo:',
  s2UsageBody: ' cronologia delle conversioni (nome del file, formato di input/output, timestamp, stato), saldo crediti e registro delle transazioni, statistiche di utilizzo degli strumenti, indirizzo IP e ubicazione approssimativa derivata dall\'IP a fini di prevenzione delle frodi.',
  s2Payment: 'Dati di pagamento:',
  s2PaymentBody: ' trattati interamente da Stripe Payments Europe Ltd. Riceviamo solo un identificativo cliente Stripe, le ultime quattro cifre della carta, il marchio della carta e una conferma di transazione. Non vediamo né memorizziamo numeri completi di carta, CVC o credenziali bancarie.',
  s2File: 'Dati dei file:',
  s2FileBody: ' i file che carichi per la conversione vengono memorizzati solo per il tempo necessario all\'erogazione del Servizio e vengono eliminati automaticamente entro ventiquattro ore. Non accediamo al contenuto dei tuoi file, non lo leggiamo né lo analizziamo, se non strettamente necessario per eseguire la conversione richiesta.',
  s2Tech: 'Dati tecnici:',
  s2TechBody: ' tipo e versione del browser, sistema operativo, tipo di dispositivo, URL referrer, preferenza di lingua e identificatori dei cookie. Raccolti automaticamente per sicurezza, prevenzione degli abusi e fornitura del Servizio.',
  s3Title: '3. Finalità del trattamento',
  s3Body: 'Trattiamo i dati personali per le seguenti finalità: (a) gestire il Servizio, comprese le conversioni richieste, la gestione dell\'account e la contabilità dei crediti; (b) elaborare i pagamenti e emettere fatture conformi alla normativa fiscale tramite Stripe; (c) inviare email transazionali come verifica dell\'account, reset della password, notifiche di completamento conversione (se hai aderito) e annunci di stato del Servizio; (d) rispondere alle richieste di assistenza e risolvere controversie; (e) analizzare l\'utilizzo aggregato e non identificabile per migliorare il Servizio; (f) prevenire frodi, abusi e accessi non autorizzati; e (g) adempiere agli obblighi di legge inclusa la conservazione dei registri fiscali.',
  s4Title: '4. Base giuridica del trattamento (art. 6 GDPR)',
  s4ContractTitle: 'Esecuzione del contratto (art. 6 (1) (b)):',
  s4ContractBody: ' il trattamento delle conversioni, la gestione dell\'account e il funzionamento del sistema di crediti sono necessari per l\'esecuzione del contratto stipulato con la registrazione o l\'acquisto.',
  s4InterestTitle: 'Legittimo interesse (art. 6 (1) (f)):',
  s4InterestBody: ' prevenzione delle frodi, monitoraggio della sicurezza, rilevamento di abusi, analisi aggregate e miglioramento del Servizio. Abbiamo effettuato un test di bilanciamento considerando i tuoi diritti e le tue libertà fondamentali.',
  s4ConsentTitle: 'Consenso (art. 6 (1) (a)):',
  s4ConsentBody: ' email di marketing, cookie analitici e qualsiasi funzionalità opzionale che vada oltre la stretta necessità. Il consenso è prestato liberamente tramite banner cookie o impostazioni e può essere revocato in qualsiasi momento senza pregiudicare la liceità del trattamento effettuato prima della revoca.',
  s4LegalTitle: 'Obbligo di legge (art. 6 (1) (c)):',
  s4LegalBody: ' conservazione dei registri rilevanti ai fini fiscali ai sensi del § 147 AO (Codice Fiscale tedesco), risposta a richieste legittime delle autorità competenti e qualsiasi altro obbligo imposto dal diritto UE o tedesco.',
  s5Title: '5. Cookie e tecnologie analoghe',
  s5EssentialTitle: 'Cookie essenziali:',
  s5EssentialBody: ' il tuo token di autenticazione (httpOnly, SameSite=Strict), preferenza di tema, preferenza di lingua e stato del consenso ai cookie. Strettamente necessari al funzionamento del Servizio e non richiedono consenso ai sensi del § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Cookie analitici:',
  s5AnalyticsBody: ' impostati solo con il tuo consenso esplicito tramite il banner cookie. Ci aiutano a capire come viene utilizzato il Servizio in forma aggregata. Puoi revocare il consenso in qualsiasi momento ed elimineremo i cookie corrispondenti.',
  s5MarketingTitle: 'Cookie di marketing:',
  s5MarketingBody: ' impostati solo con il tuo consenso esplicito. Utilizzati per personalizzare le comunicazioni. Puoi revocare il consenso in qualsiasi momento.',
  s5Manage: 'Puoi gestire le preferenze cookie in qualsiasi momento tramite l\'icona dei cookie nel piè di pagina. Le impostazioni del browser ti consentono inoltre di bloccare, eliminare o limitare i cookie — tieni presente che bloccare i cookie essenziali ti impedirà di accedere o effettuare acquisti.',
  s6Title: '6. Condivisione dei dati con sub-responsabili',
  s6Body: 'Condividiamo i dati personali esclusivamente con i seguenti sub-responsabili, ciascuno nominato sulla base di un Accordo di Trattamento dei Dati conforme all\'art. 28 GDPR. Stripe Payments Europe Ltd. (Irlanda) gestisce l\'elaborazione dei pagamenti; CloudConvert GmbH (Monaco di Baviera, Germania) elabora le conversioni dei file; Supabase Inc. (Stati Uniti, trasferimenti coperti dalle Clausole Contrattuali Standard UE) ospita il nostro database PostgreSQL; Railway Corp. (Stati Uniti, CCS) ospita la nostra applicazione; Resend (Stati Uniti, CCS) consegna le email transazionali; OpenAI Ireland Ltd. elabora gli input delle Smart Functions (audio/testo); e Google LLC (Stati Uniti, certificata nell\'EU-US Data Privacy Framework) fornisce il login Google OAuth. Non vendiamo mai i tuoi dati personali e non li trasferiamo a terzi per le loro proprie finalità di marketing.',
  s7Title: '7. Conservazione dei dati',
  s7Files: 'File:',
  s7FilesBody: ' i file caricati e convertiti vengono eliminati entro ventiquattro (24) ore dal caricamento, indipendentemente dal fatto che siano stati scaricati.',
  s7Account: 'Dati dell\'account:',
  s7AccountBody: ' conservati per la durata di vita dell\'account. Quando elimini l\'account, tutti i dati associati vengono rimossi entro trenta (30) giorni, eccezion fatta per i registri che siamo legalmente tenuti a conservare.',
  s7Payment: 'Registri di pagamento e fatturazione:',
  s7PaymentBody: ' conservati per dieci (10) anni in conformità al § 147 AO (Codice Fiscale tedesco) per motivi di compliance fiscale e contabile. Dopo questo periodo i dati vengono cancellati in modo irreversibile.',
  s7Logs: 'Log del server:',
  s7LogsBody: ' conservati per trenta (30) giorni per motivi di sicurezza, prevenzione degli abusi e indagini sugli incidenti, dopodiché vengono automaticamente eliminati.',
  s8Title: '8. I tuoi diritti ai sensi del GDPR',
  s8Intro: 'Hai ampi diritti riguardo ai dati personali che trattiamo su di te:',
  s8Access: 'Diritto di accesso (art. 15):',
  s8AccessBody: ' puoi richiedere conferma del trattamento dei tuoi dati e una copia degli stessi.',
  s8Rect: 'Diritto di rettifica (art. 16):',
  s8RectBody: ' puoi correggere dati inesatti direttamente dalla pagina del profilo o contattandoci.',
  s8Erase: 'Diritto alla cancellazione / "diritto all\'oblio" (art. 17):',
  s8EraseBody: ' puoi richiedere la cancellazione dell\'account e di tutti i dati personali associati, fatti salvi gli obblighi legali di conservazione come i registri fiscali.',
  s8Port: 'Diritto alla portabilità dei dati (art. 20):',
  s8PortBody: ' puoi richiedere una copia dei tuoi dati in un formato strutturato, di uso comune e leggibile da dispositivo automatico.',
  s8Restrict: 'Diritto di limitazione del trattamento (art. 18):',
  s8RestrictBody: ' puoi chiedere di limitare il trattamento dei tuoi dati mentre risolviamo una controversia, correggiamo un\'inesattezza o valutiamo una pretesa legale.',
  s8Object: 'Diritto di opposizione (art. 21):',
  s8ObjectBody: ' puoi opporti al trattamento basato sul legittimo interesse, inclusa la profilazione. Cesseremo a meno che possiamo dimostrare motivi legittimi cogenti che prevalgono sui tuoi interessi.',
  s8Withdraw: 'Diritto di revocare il consenso (art. 7):',
  s8WithdrawBody: ' per qualsiasi trattamento basato sul consenso puoi revocarlo in qualsiasi momento senza pregiudicare la liceità del trattamento effettuato prima della revoca.',
  s8Outro: 'Per esercitare uno qualsiasi di questi diritti, scrivi a Support@convertanyformat.com dall\'indirizzo associato al tuo account. Risponderemo entro un mese, prorogabile di ulteriori due mesi per richieste complesse, come consentito dall\'art. 12 (3) GDPR. L\'esercizio dei tuoi diritti è gratuito.',
  s9Title: '9. Sicurezza dei dati',
  s9Body: 'Proteggiamo i tuoi dati personali utilizzando misure tecniche e organizzative conformi allo stato dell\'arte: crittografia TLS 1.2+ per tutti i dati in transito; hashing bcrypt delle password con cost factor di almeno 10; cookie di sessione httpOnly con attributo SameSite=Strict; principio del minimo privilegio per gli accessi interni con audit log; aggiornamenti regolari delle dipendenze per chiudere vulnerabilità note; limitazione di velocità e validazione degli input per prevenire abusi; infrastruttura ospitata presso fornitori con certificazioni riconosciute (ISO 27001, SOC 2). Separiamo logicamente e fisicamente lo storage dei file (effimero, 24 ore) e il database degli account (persistente, cifrato a riposo). Gli incidenti di sicurezza vengono registrati e regolarmente verificati. Nonostante tutte le misure, nessuna informazione trasmessa via Internet può essere protetta con certezza assoluta — proteggiamo i tuoi dati con mezzi commercialmente ragionevoli. In caso di violazione di dati personali notificheremo l\'autorità di controllo competente entro 72 ore e informeremo gli utenti interessati senza ingiustificato ritardo, in conformità agli artt. 33-34 GDPR.',
  s10Title: '10. Trasferimenti internazionali di dati',
  s10Body: 'Alcuni dei nostri sub-responsabili hanno sede al di fuori dello Spazio Economico Europeo, principalmente negli Stati Uniti. Per ciascuno di questi trasferimenti abbiamo implementato le garanzie appropriate previste dal Capo V del GDPR. I trasferimenti a Stripe (Irlanda) e CloudConvert (Germania) restano all\'interno del SEE. I trasferimenti a Supabase, Railway, Resend e OpenAI (Stati Uniti) sono regolati dalle Clausole Contrattuali Standard della Commissione Europea (Modulo 2: titolare-responsabile), integrate da ulteriori salvaguardie tecniche come la crittografia in transito e a riposo. Google LLC è inoltre certificata nell\'EU-US Data Privacy Framework, fornendo un livello adeguato di protezione ai sensi dell\'art. 45 GDPR.',
  s11Title: '11. Privacy dei minori',
  s11Body: 'Il Servizio non è rivolto a minori di sedici (16) anni e non raccogliamo consapevolmente dati personali da minori di tale età. Se sei un genitore o tutore legale e ritieni che un minore di 16 anni ci abbia fornito dati personali, contattaci all\'indirizzo Support@convertanyformat.com e provvederemo a eliminarli prontamente. Gli utenti tra i 16 e i 18 anni dichiarano di avere il consenso di un genitore o tutore legale ove richiesto dalla legge del loro paese di residenza.',
  s12Title: '12. Modifiche alla presente Informativa',
  s12Body: 'Possiamo aggiornare la presente Informativa sulla Privacy di volta in volta per riflettere modifiche delle nostre pratiche, delle tecnologie utilizzate, dei requisiti normativi applicabili o di altri fattori operativi. Le modifiche sostanziali saranno notificate al tuo indirizzo email registrato almeno trenta (30) giorni prima dell\'entrata in vigore. Le modifiche non sostanziali (correzioni di refusi, formattazione, integrazioni esplicative) entrano in vigore con la pubblicazione. La data "Ultimo aggiornamento" all\'inizio di questa pagina indica quando l\'Informativa è stata revisionata l\'ultima volta. L\'uso continuato del Servizio dopo la data effettiva di una modifica costituisce accettazione dell\'Informativa rivista.',
  s13Title: '13. Contatti e diritto di reclamo',
  s13Body: 'Per richieste di protezione dei dati, esercizio dei tuoi diritti GDPR o qualsiasi altra preoccupazione legata alla privacy, scrivi a Support@convertanyformat.com. Cerchiamo di rispondere entro un mese. Fatto salvo qualsiasi altro ricorso amministrativo o giudiziale, hai diritto ai sensi dell\'art. 77 GDPR a presentare reclamo all\'autorità di controllo dello Stato membro UE in cui risiedi, lavori o dove è avvenuta la presunta violazione. L\'autorità di controllo competente per {{brand}} è la Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
};

// =====================================================================
// Portuguese
// =====================================================================
const ptPrivacy = {
  title: 'Política de Privacidade',
  seoDesc: 'Política de Privacidade de {{brand}}. Tratamento de dados conforme o RGPD: o que recolhemos, base legal, conservação, subcontratantes, os seus direitos, transferências internacionais.',
  updated: 'Última atualização: maio de 2026',
  s1Title: '1. Responsável pelo tratamento',
  s1Body: 'O responsável pelo tratamento dos dados pessoais tratados através de {{brand}} (o "Serviço") é Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf, Alemanha. Para todas as questões de proteção de dados — incluindo pedidos para exercer os seus direitos ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD) — contacte-nos por email em Support@convertanyformat.com. Como não atingimos os limiares previstos no Art. 37 RGPD ou no § 38 BDSG, não somos obrigados a designar um Encarregado da Proteção de Dados; o responsável trata pessoalmente todos os assuntos de proteção de dados. Esta Política explica que dados recolhemos, porquê, com que base legal, com quem os partilhamos, durante quanto tempo os conservamos e que direitos tem.',
  s2Title: '2. Dados pessoais que recolhemos',
  s2Account: 'Dados da conta:',
  s2AccountBody: ' o seu endereço de email, nome de exibição opcional, hash bcrypt da sua palavra-passe (nunca a palavra-passe em si), identificador da conta Google ao iniciar sessão via OAuth, preferências da conta (tema, idioma, notificações) e código de referência se aplicável.',
  s2Usage: 'Dados de utilização:',
  s2UsageBody: ' histórico de conversões (nome do ficheiro, formato de entrada/saída, data e hora, estado), saldo de créditos e registo de transações, estatísticas de utilização das ferramentas, endereço IP e localização aproximada derivada do IP para fins de prevenção de fraude.',
  s2Payment: 'Dados de pagamento:',
  s2PaymentBody: ' tratados na totalidade pela Stripe Payments Europe Ltd. Recebemos apenas um identificador de cliente Stripe, os últimos quatro dígitos do cartão, a marca do cartão e uma confirmação de transação. Nunca vemos nem armazenamos números completos de cartão, CVCs ou credenciais bancárias.',
  s2File: 'Dados de ficheiros:',
  s2FileBody: ' os ficheiros que carrega para conversão são armazenados apenas pelo tempo necessário à prestação do Serviço e são eliminados automaticamente em vinte e quatro horas. Não acedemos ao conteúdo dos seus ficheiros, nem o lemos ou analisamos, salvo o estritamente necessário para realizar a conversão solicitada.',
  s2Tech: 'Dados técnicos:',
  s2TechBody: ' tipo e versão do navegador, sistema operativo, tipo de dispositivo, URL de referência, preferência de idioma e identificadores de cookies. Recolhidos automaticamente por motivos de segurança, prevenção de abuso e prestação do Serviço.',
  s3Title: '3. Finalidades do tratamento',
  s3Body: 'Tratamos dados pessoais para as seguintes finalidades: (a) operação do Serviço, incluindo a entrega das conversões solicitadas, gestão da sua conta e contabilização de saldos de crédito; (b) processamento de pagamentos e emissão de faturas conformes a fins fiscais através da Stripe; (c) envio de emails transacionais como verificação de conta, redefinição de palavra-passe, notificações de conclusão de conversão a que tenha aderido e anúncios de estado do Serviço; (d) resposta a pedidos de suporte e resolução de disputas; (e) análise agregada e não identificável da utilização para melhorar o Serviço; (f) prevenção de fraude, abuso e acesso não autorizado; e (g) cumprimento de obrigações legais incluindo a conservação de registos fiscais.',
  s4Title: '4. Base legal do tratamento (Art. 6 RGPD)',
  s4ContractTitle: 'Execução de contrato (Art. 6 (1) (b)):',
  s4ContractBody: ' o tratamento das suas conversões, a gestão da sua conta e a operação do sistema de créditos são necessários para a execução do contrato celebrado quando se registou ou efetuou uma compra.',
  s4InterestTitle: 'Interesse legítimo (Art. 6 (1) (f)):',
  s4InterestBody: ' prevenção de fraude, monitorização de segurança, deteção de abuso, análise agregada e melhoria do Serviço. Realizámos um teste de ponderação considerando os seus direitos e liberdades fundamentais.',
  s4ConsentTitle: 'Consentimento (Art. 6 (1) (a)):',
  s4ConsentBody: ' emails de marketing, cookies analíticos e quaisquer funcionalidades opcionais que vão além do estritamente necessário. O consentimento é dado livremente através do banner de cookies ou definições e pode ser retirado a qualquer momento sem afetar a licitude do tratamento anterior à retirada.',
  s4LegalTitle: 'Obrigação legal (Art. 6 (1) (c)):',
  s4LegalBody: ' conservação de registos fiscalmente relevantes nos termos do § 147 AO (Código Fiscal alemão), resposta a pedidos legítimos de autoridades competentes e qualquer outra obrigação imposta pela lei da UE ou alemã.',
  s5Title: '5. Cookies e tecnologias semelhantes',
  s5EssentialTitle: 'Cookies essenciais:',
  s5EssentialBody: ' o seu token de autenticação (httpOnly, SameSite=Strict), preferência de tema, preferência de idioma e estado de consentimento de cookies. Estritamente necessários ao funcionamento do Serviço e não exigem consentimento conforme o § 25 (2) TTDSG.',
  s5AnalyticsTitle: 'Cookies analíticos:',
  s5AnalyticsBody: ' definidos apenas com o seu consentimento expresso através do banner de cookies. Ajudam-nos a perceber como o Serviço é utilizado em forma agregada. Pode retirar o consentimento a qualquer momento e eliminaremos os cookies correspondentes.',
  s5MarketingTitle: 'Cookies de marketing:',
  s5MarketingBody: ' definidos apenas com o seu consentimento expresso. Utilizados para personalizar comunicações. Pode retirar o consentimento a qualquer momento.',
  s5Manage: 'Pode gerir as preferências de cookies a qualquer momento através do ícone de cookies no rodapé da página. As definições do navegador também permitem bloquear, eliminar ou restringir cookies — note que bloquear cookies essenciais o impedirá de iniciar sessão ou efetuar compras.',
  s6Title: '6. Partilha de dados com subcontratantes',
  s6Body: 'Partilhamos dados pessoais apenas com os seguintes subcontratantes, cada um vinculado por um Acordo de Tratamento de Dados conforme o Art. 28 RGPD. A Stripe Payments Europe Ltd. (Irlanda) processa pagamentos; a CloudConvert GmbH (Munique, Alemanha) processa conversões de ficheiros; a Supabase Inc. (Estados Unidos, transferências cobertas pelas Cláusulas Contratuais-Tipo da UE) aloja a nossa base de dados PostgreSQL; a Railway Corp. (Estados Unidos, CCT) aloja a nossa aplicação; a Resend (Estados Unidos, CCT) entrega emails transacionais; a OpenAI Ireland Ltd. processa entradas das Smart Functions (áudio/texto); e a Google LLC (Estados Unidos, certificada no EU-US Data Privacy Framework) fornece o início de sessão Google OAuth. Nunca vendemos os seus dados pessoais e não os transferimos para terceiros para finalidades de marketing próprias.',
  s7Title: '7. Conservação de dados',
  s7Files: 'Ficheiros:',
  s7FilesBody: ' os ficheiros carregados e convertidos são eliminados em vinte e quatro (24) horas após o carregamento, independentemente de terem sido descarregados.',
  s7Account: 'Dados da conta:',
  s7AccountBody: ' conservados enquanto a sua conta estiver ativa. Ao eliminar a conta, todos os dados associados são removidos em trinta (30) dias, exceto os registos que somos legalmente obrigados a manter.',
  s7Payment: 'Registos de pagamento e faturação:',
  s7PaymentBody: ' conservados por dez (10) anos em cumprimento do § 147 AO (Código Fiscal alemão) por motivos de conformidade fiscal e contabilística. Findo este período os dados são eliminados de forma irreversível.',
  s7Logs: 'Logs do servidor:',
  s7LogsBody: ' conservados por trinta (30) dias por motivos de segurança, prevenção de abuso e investigação de incidentes, sendo posteriormente eliminados de forma automática.',
  s8Title: '8. Os seus direitos ao abrigo do RGPD',
  s8Intro: 'Tem amplos direitos em relação aos dados pessoais que tratamos sobre si:',
  s8Access: 'Direito de acesso (Art. 15):',
  s8AccessBody: ' pode solicitar confirmação de que tratamos os seus dados e uma cópia dos mesmos.',
  s8Rect: 'Direito de retificação (Art. 16):',
  s8RectBody: ' pode corrigir dados inexatos diretamente na sua página de perfil ou contactando-nos.',
  s8Erase: 'Direito ao apagamento / "direito a ser esquecido" (Art. 17):',
  s8EraseBody: ' pode solicitar a eliminação da sua conta e de todos os dados pessoais associados, sujeito a obrigações legais de conservação como os registos fiscais.',
  s8Port: 'Direito à portabilidade dos dados (Art. 20):',
  s8PortBody: ' pode solicitar uma cópia dos seus dados num formato estruturado, de uso comum e legível por máquina.',
  s8Restrict: 'Direito à limitação do tratamento (Art. 18):',
  s8RestrictBody: ' pode solicitar que limitemos o tratamento dos seus dados enquanto resolvemos uma disputa, corrigimos uma inexatidão ou avaliamos uma pretensão legal.',
  s8Object: 'Direito de oposição (Art. 21):',
  s8ObjectBody: ' pode opor-se ao tratamento baseado no interesse legítimo, incluindo a definição de perfis. Cessaremos salvo se demonstrarmos motivos legítimos imperiosos que prevaleçam sobre os seus interesses.',
  s8Withdraw: 'Direito de retirar o consentimento (Art. 7):',
  s8WithdrawBody: ' para qualquer tratamento baseado em consentimento, pode retirá-lo a qualquer momento sem afetar a licitude do tratamento anterior à retirada.',
  s8Outro: 'Para exercer qualquer destes direitos, escreva para Support@convertanyformat.com a partir do endereço associado à sua conta. Responderemos no prazo de um mês, prorrogável por mais dois meses para pedidos complexos, conforme permitido pelo Art. 12 (3) RGPD. O exercício dos seus direitos é gratuito.',
  s9Title: '9. Segurança dos dados',
  s9Body: 'Protegemos os seus dados pessoais com medidas técnicas e organizativas conformes ao estado da arte: encriptação TLS 1.2+ para todos os dados em trânsito; hash bcrypt das palavras-passe com fator de custo igual ou superior a 10; cookies de sessão httpOnly com o atributo SameSite=Strict; princípio do menor privilégio para acesso interno com registo de auditoria; atualizações regulares das dependências para corrigir vulnerabilidades conhecidas; limitação de taxa e validação de entradas para prevenir abuso; infraestrutura alojada em fornecedores com certificações reconhecidas (ISO 27001, SOC 2). Separamos lógica e fisicamente o armazenamento de ficheiros (efémero, 24 horas) e a base de dados das contas (persistente, encriptada em repouso). Os incidentes de segurança são registados e revistos regularmente. Apesar de todas as medidas, nenhuma informação transmitida via Internet pode ser protegida com segurança absoluta — protegemos os seus dados com meios comercialmente razoáveis. Em caso de violação de dados pessoais notificaremos a autoridade de controlo competente no prazo de 72 horas e informaremos os utilizadores afetados sem demora indevida, em conformidade com os Arts. 33-34 RGPD.',
  s10Title: '10. Transferências internacionais de dados',
  s10Body: 'Alguns dos nossos subcontratantes têm sede fora do Espaço Económico Europeu, principalmente nos Estados Unidos. Para cada transferência implementámos as salvaguardas adequadas exigidas pelo Capítulo V do RGPD. As transferências para a Stripe (Irlanda) e CloudConvert (Alemanha) permanecem dentro do EEE. As transferências para a Supabase, Railway, Resend e OpenAI (Estados Unidos) regem-se pelas Cláusulas Contratuais-Tipo da Comissão Europeia (Módulo 2: responsável-subcontratante), complementadas por salvaguardas técnicas adicionais, como encriptação em trânsito e em repouso. A Google LLC está adicionalmente certificada no EU-US Data Privacy Framework, fornecendo um nível adequado de proteção nos termos do Art. 45 RGPD.',
  s11Title: '11. Privacidade das crianças',
  s11Body: 'O Serviço não se destina a crianças com menos de dezasseis (16) anos e não recolhemos conscientemente dados pessoais de crianças com menos dessa idade. Se for pai/mãe ou tutor legal e acreditar que uma criança com menos de 16 anos nos forneceu dados pessoais, contacte-nos em Support@convertanyformat.com e procederemos à eliminação prontamente. Os utilizadores entre 16 e 18 anos declaram ter o consentimento de um pai/mãe ou tutor legal quando exigido pela lei do seu país de residência.',
  s12Title: '12. Alterações a esta Política de Privacidade',
  s12Body: 'Podemos atualizar esta Política de Privacidade de tempos a tempos para refletir alterações nas nossas práticas, nas tecnologias que usamos, nos requisitos legais aplicáveis ou noutros fatores operacionais. As alterações materiais serão notificadas ao seu endereço de email registado com pelo menos trinta (30) dias de antecedência relativamente à entrada em vigor. As alterações não materiais (correções de erros tipográficos, formatação, adições clarificadoras) entram em vigor com a publicação. A data "Última atualização" no topo desta página indica quando a Política foi revista pela última vez. O uso continuado do Serviço após a data efetiva de qualquer alteração constitui aceitação da Política revista.',
  s13Title: '13. Contacto e direito a apresentar reclamação',
  s13Body: 'Para questões de proteção de dados, pedidos para exercer os seus direitos RGPD ou quaisquer outras preocupações relacionadas com a privacidade, escreva para Support@convertanyformat.com. Pretendemos responder no prazo de um mês. Sem prejuízo de qualquer outro recurso administrativo ou judicial, tem o direito, ao abrigo do Art. 77 RGPD, de apresentar reclamação à autoridade de controlo do Estado-Membro da UE onde reside, trabalha ou onde se tenha verificado a alegada infração. A autoridade de controlo competente para {{brand}} é a Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.',
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

const PAYLOADS = { es: esPrivacy, it: itPrivacy, pt: ptPrivacy };

for (const [lang, privacy] of Object.entries(PAYLOADS)) {
  const block = findLangBlock(content, lang);
  content = replaceTopLevelKey(content, 'privacy', privacy, block.start, block.end);
  console.log(`✔ Updated ${lang}.privacy`);
}

fs.writeFileSync(FILE, content);
console.log('\nDone (3 of 7 — nl/pl/sv/no in next script).');
