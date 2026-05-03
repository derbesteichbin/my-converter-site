// Chunk 2 of 3: replaces the entire `terms` block in es/it/pt/nl/pl/sv/no
// with comprehensive content matching the English/German rewrite. Old
// terms text in those languages was much shorter and used the same key
// shape — replacing in full keeps the structure consistent across all 10
// supported languages.
//
// Run from repo root:  node scripts/fill-gap-2-terms.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

const UPDATED = {
  es: 'Última actualización: mayo de 2026',
  it: 'Ultimo aggiornamento: maggio 2026',
  pt: 'Última atualização: maio de 2026',
  nl: 'Laatst bijgewerkt: mei 2026',
  pl: 'Ostatnia aktualizacja: maj 2026',
  sv: 'Senast uppdaterad: maj 2026',
  no: 'Sist oppdatert: mai 2026',
};

// =====================================================================
// Spanish
// =====================================================================
const esTerms = {
  title: 'Condiciones del Servicio',
  seoDesc: 'Condiciones del Servicio de {{brand}}. Obligaciones de cuenta, sistema de créditos, pagos, reembolsos, manejo de archivos, usos prohibidos, responsabilidad y jurisdicción alemana.',
  updated: UPDATED.es,
  s1Title: '1. Ámbito y aceptación de las condiciones',
  s1Body: 'Estas Condiciones del Servicio ("Condiciones") rigen su uso de {{brand}} (el "Servicio"), una plataforma web de conversión de archivos operada desde Alemania por Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf. Al crear una cuenta, completar una compra o utilizar el Servicio de cualquier forma, confirma que ha leído, comprendido y aceptado estar legalmente vinculado por estas Condiciones. Si no está de acuerdo, no debe utilizar el Servicio. Podemos actualizar estas Condiciones según se establece en la sección 14, y el uso continuado tras la entrada en vigor de los cambios constituye aceptación.',
  s2Title: '2. Descripción del servicio',
  s2Body: '{{brand}} ofrece conversión de archivos basada en navegador en más de cincuenta formatos de entrada y salida, incluyendo documentos (PDF, Word, Excel, PowerPoint, OpenDocument), imágenes (JPG, PNG, WebP, HEIC, SVG, TIFF), audio (MP3, WAV, FLAC, AAC, OGG), vídeo (MP4, AVI, MOV, MKV, WebM) y archivos comprimidos (ZIP, RAR, 7Z, TAR, GZ). El Servicio también ofrece Smart Functions con IA: OCR, texto a voz, voz a texto y generación automática de subtítulos. La conversión se realiza por nuestra infraestructura y por API de terceros confiables conforme a la sección 12. Nos esforzamos por ofrecer alta disponibilidad pero no garantizamos un servicio ininterrumpido o libre de errores.',
  s3Title: '3. Registro de cuenta y seguridad',
  s3Body: 'Para utilizar el Servicio debe crear una cuenta con una dirección de correo válida y contraseña que cumpla nuestros requisitos mínimos de seguridad, o iniciar sesión vía Google OAuth. Es el único responsable de salvaguardar sus credenciales y de toda actividad bajo su cuenta. Notifíquenos inmediatamente en Support@convertanyformat.com si sospecha uso no autorizado. Debe tener al menos dieciséis (16) años para registrarse; los usuarios entre 16 y 18 años declaran tener el consentimiento de un progenitor o tutor legal cuando lo requiera la ley de su país de residencia. Nos reservamos el derecho a rechazar registros, suspender cuentas o cancelar el acceso por incumplimientos.',
  s4Title: '4. Sistema de créditos',
  s4Body: 'El Servicio funciona con un modelo de créditos prepagados. Cada conversión exitosa descuenta un número definido de créditos de su saldo. Las conversiones de formato estándar cuestan un (1) crédito por archivo. Las Smart Functions se cobran por uso: Texto a voz cuesta 1 crédito por cada 1.000 caracteres de entrada (redondeado hacia arriba); Voz a texto y el Generador automático de subtítulos cuestan 1 crédito por cada 5 minutos de duración de audio o vídeo (redondeado hacia arriba). Las conversiones fallidas no descuentan créditos. Los créditos no son transferibles, no caducan y solo pueden canjearse dentro del Servicio. Los créditos bonus por referidos siguen las mismas reglas pero no se pueden canjear por dinero.',
  s5Title: '5. Precios y pagos',
  s5Body: 'Los paquetes de créditos se ofrecen en tres tamaños: 1 crédito (0,99 €), 10 créditos (7,99 €) y 30 créditos (20,99 €). Todos los precios están en euros e incluyen el IVA alemán aplicable (actualmente 19 %). Los pagos se procesan exclusivamente por Stripe Payments Europe Ltd., una entidad de pago autorizada; no almacenamos números completos de tarjetas de pago. Al comprar créditos declara estar autorizado a usar el método de pago indicado. Emitiremos una factura electrónica conforme a fines fiscales por cada compra. Nos reservamos el derecho a modificar los precios con preaviso mínimo de treinta (30) días por correo a su dirección registrada.',
  s6Title: '6. Política de reembolsos',
  s6Body: 'Como consumidor residente en la Unión Europea, dispone de un derecho de desistimiento de catorce (14) días para compras digitales conforme a la Fernabsatzgesetz alemana. Al comprar créditos y utilizar alguno dentro del plazo de desistimiento, renuncia expresamente a su derecho de desistimiento conforme a § 356 Abs. 5 BGB. Los créditos no utilizados son reembolsables íntegramente en los catorce días posteriores a la compra. Para solicitar un reembolso, escriba a Support@convertanyformat.com desde el correo asociado a su cuenta; los reembolsos se procesan en cinco a diez días hábiles al método de pago original. Nos reservamos el derecho a denegar solicitudes que razonablemente consideremos de mala fe.',
  s7Title: '7. Tamaño y restricciones de formato de archivos',
  s7Body: 'El tamaño máximo de carga es 200 MB por archivo para conversiones estándar y 25 MB para herramientas Smart Functions (limitadas por la API de OpenAI). Los formatos compatibles se enumeran en la página Herramientas; cargar un archivo en formato no compatible puede causar una conversión fallida sin descuento de créditos. Nos reservamos el derecho a rechazar archivos que contengan malware, excedan nuestra capacidad de infraestructura, supongan un coste desproporcionado o pongan en peligro el funcionamiento del Servicio. Los archivos que sospechemos razonablemente que contienen contenido ilegal pueden ser denunciados a las autoridades competentes según exija la ley.',
  s8Title: '8. Eliminación automática de archivos',
  s8Body: 'Todos los archivos que cargue, junto con la salida convertida que entregamos, se almacenan solo el tiempo necesario para prestar el Servicio y se eliminan automática y permanentemente de nuestros sistemas en un plazo de veinticuatro (24) horas desde la carga. Los enlaces de descarga expiran cuando los archivos subyacentes se eliminan. No conservamos copias, copias de seguridad ni miniaturas de sus archivos más allá de esta ventana. Si necesita un archivo convertido más allá de este período debe descargarlo y almacenarlo localmente. Los registros del servidor que puedan referenciar incidentalmente nombres de archivo se conservan por separado según las reglas de retención de nuestra Política de Privacidad.',
  s9Title: '9. Usos prohibidos',
  s9Body: 'Acepta no utilizar el Servicio para: (a) cargar o distribuir malware, virus o cualquier código malicioso; (b) violar leyes aplicables, incluidas las de derechos de autor, marcas o protección de datos; (c) intentar obtener acceso no autorizado a nuestros sistemas, cuentas de otros usuarios o cualquier infraestructura subyacente; (d) usar sistemas automatizados, scripts o bots para eludir límites de uso, precios de créditos o controles de seguridad; (e) cargar contenido ilegal, difamatorio, de odio, acosador o que represente a menores en contextos inapropiados; (f) procesar contenido que viole la privacidad u otros derechos de personas identificables sin su consentimiento. Las infracciones pueden conllevar la cancelación inmediata de la cuenta, la pérdida de los créditos sin reembolso y la denuncia a autoridades competentes.',
  s10Title: '10. Propiedad intelectual',
  s10Body: 'Conserva la plena propiedad de todos los archivos que cargue y de la salida convertida que produzca el Servicio. Al cargar un archivo nos otorga una licencia limitada, no exclusiva y libre de regalías exclusivamente para realizar la conversión solicitada; esta licencia termina automáticamente cuando el archivo se elimina conforme a la sección 8. El nombre {{brand}}, el logotipo, el diseño visual, el código fuente y el software subyacente son nuestra propiedad intelectual exclusiva, protegidos por la legislación alemana de derechos de autor y tratados internacionales. No puede aplicar ingeniería inversa, descompilar ni intentar derivar el código fuente del Servicio salvo en la medida expresamente permitida por ley imperativa (p. ej., § 69d UrhG).',
  s11Title: '11. Limitación de responsabilidad',
  s11Body: 'El Servicio se ofrece "tal cual" y "según disponibilidad" sin garantías de ningún tipo, expresas o implícitas, incluidas las garantías de comerciabilidad, idoneidad para un fin determinado, exactitud de las conversiones o disponibilidad ininterrumpida. En la medida máxima permitida por la ley alemana, nuestra responsabilidad agregada total por cualquier reclamación derivada o relacionada con el Servicio no excederá la cantidad total que nos haya pagado en los doce (12) meses anteriores a la reclamación. No somos responsables de daños indirectos, incidentales, consecuentes o punitivos, incluida la pérdida de datos, lucro cesante o interrupción del negocio. Recomendamos expresamente realizar copias de seguridad locales antes de cargar archivos importantes. Las limitaciones anteriores no se aplican a la responsabilidad por daños a la vida, cuerpo o salud, conducta dolosa o gravemente negligente, según la Ley alemana de Responsabilidad por Productos Defectuosos, ni a cualquier otra responsabilidad que no pueda limitarse o excluirse según la ley imperativa alemana.',
  s12Title: '12. Servicios de terceros',
  s12Body: 'El Servicio se basa en los siguientes proveedores externos que actúan como encargados del tratamiento conforme al Art. 28 RGPD: Stripe Payments Europe Ltd. (procesamiento de pagos), CloudConvert GmbH (procesamiento de conversiones, con sede en Múnich, Alemania), Supabase Inc. (alojamiento de base de datos PostgreSQL), Railway Corp. (alojamiento de la aplicación), Resend (envío de correos transaccionales), OpenAI Ireland Ltd. (Smart Functions impulsadas por TTS-1 y Whisper-1) y Google LLC (inicio de sesión Google OAuth). Hemos firmado Acuerdos de Tratamiento de Datos con cada proveedor que maneje datos personales. Cada proveedor opera bajo sus propios términos de servicio que se aplican junto con estas Condiciones.',
  s13Title: '13. Ley aplicable y jurisdicción',
  s13Body: 'Estas Condiciones y las obligaciones extracontractuales que surjan en relación con ellas se rigen por las leyes de la República Federal de Alemania, excluyendo la Convención de las Naciones Unidas sobre los Contratos de Compraventa Internacional de Mercaderías. Las disposiciones imperativas de protección al consumidor del país de residencia habitual del consumidor permanecen inalteradas. El lugar de jurisdicción exclusivo para todas las disputas derivadas o relacionadas con estas Condiciones es Düsseldorf, Alemania, siempre que sea comerciante, persona jurídica de derecho público o fondo especial de derecho público. La Comisión Europea proporciona una plataforma de resolución de disputas en línea en https://ec.europa.eu/consumers/odr; no estamos obligados ni nos comprometemos a participar en procedimientos ante un órgano de arbitraje de consumidores.',
  s14Title: '14. Cambios en estas Condiciones',
  s14Body: 'Podemos modificar estas Condiciones a nuestra discreción para reflejar cambios en el Servicio, en la legislación aplicable o en las operaciones del negocio. Los cambios sustanciales se notificarán a su dirección de correo registrada con al menos treinta (30) días de antelación a su entrada en vigor, y mostraremos un aviso en el sitio web. Los cambios no sustanciales (aclaraciones, formato, actualizaciones de la lista de proveedores externos en la sección 12) entran en vigor con la publicación. El uso continuado del Servicio tras la fecha efectiva de cualquier cambio constituye aceptación. Si no acepta los cambios puede cerrar su cuenta en cualquier momento desde su página de perfil; los créditos previamente descontados no son reembolsables por desacuerdo con cambios de política.',
};

// =====================================================================
// Italian
// =====================================================================
const itTerms = {
  title: 'Condizioni del Servizio',
  seoDesc: 'Condizioni del Servizio di {{brand}}. Obblighi dell\'account, sistema di crediti, pagamenti, rimborsi, gestione dei file, usi vietati, responsabilità e giurisdizione tedesca.',
  updated: UPDATED.it,
  s1Title: '1. Ambito e accettazione delle condizioni',
  s1Body: 'Le presenti Condizioni del Servizio ("Condizioni") regolano il tuo uso di {{brand}} (il "Servizio"), una piattaforma web di conversione di file operata dalla Germania da Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf. Creando un account, completando un acquisto o utilizzando il Servizio in qualsiasi modo, confermi di aver letto, compreso e accettato di essere legalmente vincolato dalle presenti Condizioni. Se non sei d\'accordo, non devi utilizzare il Servizio. Possiamo aggiornare queste Condizioni secondo quanto previsto nella sezione 14, e l\'uso continuato dopo l\'entrata in vigore delle modifiche costituisce accettazione.',
  s2Title: '2. Descrizione del servizio',
  s2Body: '{{brand}} fornisce conversione di file basata su browser in oltre cinquanta formati di input e output, inclusi documenti (PDF, Word, Excel, PowerPoint, OpenDocument), immagini (JPG, PNG, WebP, HEIC, SVG, TIFF), audio (MP3, WAV, FLAC, AAC, OGG), video (MP4, AVI, MOV, MKV, WebM) e archivi (ZIP, RAR, 7Z, TAR, GZ). Il Servizio offre anche Smart Functions con IA: OCR, da testo a voce, da voce a testo e generazione automatica di sottotitoli. La conversione viene effettuata dalla nostra infrastruttura e da API di terze parti affidabili come indicato nella sezione 12. Ci impegniamo a garantire un\'elevata disponibilità ma non garantiamo un servizio ininterrotto o privo di errori.',
  s3Title: '3. Registrazione dell\'account e sicurezza',
  s3Body: 'Per utilizzare il Servizio devi creare un account con un indirizzo email valido e una password che soddisfi i nostri requisiti minimi di sicurezza, oppure accedere tramite Google OAuth. Sei l\'unico responsabile della custodia delle tue credenziali e di tutte le attività svolte sotto il tuo account. Devi notificarci immediatamente all\'indirizzo Support@convertanyformat.com in caso di sospetto uso non autorizzato. Devi avere almeno sedici (16) anni per registrarti; gli utenti tra i 16 e i 18 anni dichiarano di avere il consenso di un genitore o tutore legale ove richiesto dalla legge del paese di residenza. Ci riserviamo il diritto di rifiutare registrazioni, sospendere account o terminare l\'accesso in caso di violazione.',
  s4Title: '4. Sistema di crediti',
  s4Body: 'Il Servizio funziona con un modello di crediti prepagati. Ogni conversione riuscita scala un numero definito di crediti dal tuo saldo. Le conversioni di formato standard costano un (1) credito per file. Le Smart Functions sono tariffate in base all\'uso: Da testo a voce costa un credito ogni 1.000 caratteri di input (arrotondati per eccesso); Da voce a testo e il Generatore di sottotitoli automatico costano un credito ogni 5 minuti di durata audio o video (arrotondati per eccesso). Le conversioni fallite non scalano crediti. I crediti non sono trasferibili, non scadono e possono essere riscattati solo all\'interno del Servizio. I crediti bonus dal programma referral seguono le stesse regole ma non possono essere convertiti in denaro.',
  s5Title: '5. Prezzi e pagamenti',
  s5Body: 'I pacchetti di crediti sono offerti in tre dimensioni: 1 credito (0,99 €), 10 crediti (7,99 €) e 30 crediti (20,99 €). Tutti i prezzi sono in euro e includono l\'IVA tedesca applicabile (attualmente 19%). I pagamenti vengono elaborati esclusivamente da Stripe Payments Europe Ltd., un istituto di pagamento autorizzato; non memorizziamo numeri completi di carte di pagamento. Acquistando crediti dichiari di essere autorizzato a utilizzare il metodo di pagamento fornito. Per ogni acquisto emetteremo una fattura elettronica conforme ai fini fiscali. Ci riserviamo il diritto di modificare i prezzi con preavviso di almeno trenta (30) giorni via email all\'indirizzo registrato.',
  s6Title: '6. Politica di rimborso',
  s6Body: 'Come consumatore residente nell\'Unione Europea hai un diritto di recesso di quattordici (14) giorni per gli acquisti digitali secondo la Fernabsatzgesetz tedesca. Acquistando crediti e utilizzandone uno qualsiasi entro il periodo di recesso rinunci espressamente al diritto di recesso come consentito ai sensi del § 356 Abs. 5 BGB. I crediti non utilizzati sono interamente rimborsabili entro quattordici giorni dall\'acquisto. Per richiedere un rimborso scrivi a Support@convertanyformat.com dall\'indirizzo associato al tuo account; i rimborsi vengono elaborati entro cinque-dieci giorni lavorativi sul metodo di pagamento originale. Ci riserviamo il diritto di rifiutare richieste che riteniamo ragionevolmente in malafede.',
  s7Title: '7. Dimensioni dei file e restrizioni sui formati',
  s7Body: 'La dimensione massima di caricamento è 200 MB per file per le conversioni standard e 25 MB per le Smart Functions (limitate dall\'API OpenAI). I formati supportati sono elencati nella pagina Strumenti; il caricamento di un file in un formato non supportato può causare una conversione fallita per la quale non verranno scalati crediti. Ci riserviamo il diritto di rifiutare file che contengono malware, superano la nostra capacità infrastrutturale, comportano costi sproporzionati o mettono in pericolo il funzionamento del Servizio. I file che sospettiamo ragionevolmente contengano contenuti illegali possono essere segnalati alle autorità competenti come richiesto dalla legge.',
  s8Title: '8. Eliminazione automatica dei file',
  s8Body: 'Tutti i file che carichi, insieme all\'output convertito che ti consegniamo, vengono memorizzati solo per il tempo necessario a fornire il Servizio e vengono eliminati automaticamente e permanentemente dai nostri sistemi entro ventiquattro (24) ore dal caricamento. I link di download scadono quando i file sottostanti vengono eliminati. Non conserviamo copie, backup o miniature dei tuoi file oltre questa finestra. Se hai bisogno di un file convertito oltre questo periodo, devi scaricarlo e archiviarlo localmente. I log del server che possono incidentalmente fare riferimento a nomi di file vengono conservati separatamente secondo le regole di retention della nostra Privacy Policy.',
  s9Title: '9. Usi vietati',
  s9Body: 'Accetti di non utilizzare il Servizio per: (a) caricare o distribuire malware, virus o codice dannoso; (b) violare leggi applicabili, incluso il diritto d\'autore, i marchi o la protezione dei dati; (c) tentare di accedere senza autorizzazione ai nostri sistemi, agli account di altri utenti o all\'infrastruttura sottostante; (d) utilizzare sistemi automatizzati, script o bot per eludere limiti di velocità, prezzi dei crediti o controlli di sicurezza; (e) caricare contenuti illegali, diffamatori, d\'odio, molesti o che ritraggono minori in contesti inappropriati; (f) elaborare contenuti che violano la privacy o altri diritti di persone identificabili senza il loro consenso. Le violazioni possono comportare la chiusura immediata dell\'account, la perdita dei crediti residui senza rimborso e la segnalazione alle autorità competenti.',
  s10Title: '10. Proprietà intellettuale',
  s10Body: 'Mantieni la piena proprietà di tutti i file che carichi e dell\'output convertito prodotto dal Servizio. Caricando un file ci concedi una licenza limitata, non esclusiva e gratuita esclusivamente per eseguire la conversione richiesta; questa licenza termina automaticamente quando il file viene eliminato ai sensi della sezione 8. Il nome {{brand}}, il logo, il design visivo, il codice sorgente e il software sottostante sono di nostra esclusiva proprietà intellettuale e sono protetti dal diritto d\'autore tedesco e dai trattati internazionali. Non è consentito decodificare, decompilare o tentare in altro modo di ricavare il codice sorgente del Servizio se non nei limiti espressamente consentiti dalla legge imperativa (es. § 69d UrhG).',
  s11Title: '11. Limitazione di responsabilità',
  s11Body: 'Il Servizio è fornito "così com\'è" e "secondo disponibilità" senza garanzie di alcun tipo, espresse o implicite, comprese garanzie di commerciabilità, idoneità a uno scopo specifico, accuratezza delle conversioni o disponibilità ininterrotta. Nella misura massima consentita dalla legge tedesca, la nostra responsabilità complessiva totale per qualsiasi pretesa derivante o connessa al Servizio non potrà superare l\'importo totale che ci hai versato nei dodici (12) mesi precedenti alla pretesa. Non siamo responsabili per danni indiretti, incidentali, conseguenti o punitivi, inclusa la perdita di dati, mancato profitto o interruzione dell\'attività. Raccomandiamo espressamente di effettuare copie di backup locali prima di caricare file importanti. Le limitazioni precedenti non si applicano alla responsabilità per lesioni alla vita, integrità fisica o salute, condotta dolosa o gravemente negligente, ai sensi della legge tedesca sulla responsabilità del produttore, o a qualsiasi altra responsabilità che non possa essere limitata o esclusa dalla legge tedesca imperativa.',
  s12Title: '12. Servizi di terze parti',
  s12Body: 'Il Servizio si avvale dei seguenti fornitori esterni che agiscono come responsabili del trattamento per nostro conto ai sensi dell\'art. 28 GDPR: Stripe Payments Europe Ltd. (elaborazione dei pagamenti), CloudConvert GmbH (elaborazione delle conversioni, con sede a Monaco di Baviera), Supabase Inc. (hosting del database PostgreSQL), Railway Corp. (hosting dell\'applicazione), Resend (invio di email transazionali), OpenAI Ireland Ltd. (Smart Functions basate su TTS-1 e Whisper-1) e Google LLC (accesso Google OAuth). Abbiamo firmato Accordi di Trattamento dei Dati con ciascun fornitore che gestisce dati personali. Ogni fornitore opera secondo i propri termini di servizio che si applicano insieme alle presenti Condizioni.',
  s13Title: '13. Legge applicabile e foro competente',
  s13Body: 'Le presenti Condizioni e le obbligazioni extracontrattuali da esse derivanti o ad esse connesse sono regolate dalle leggi della Repubblica Federale di Germania, escludendo la Convenzione delle Nazioni Unite sui contratti di vendita internazionale di merci. Le disposizioni imperative di tutela del consumatore del paese di residenza abituale del consumatore restano inalterate. Il foro competente esclusivo per tutte le controversie derivanti o connesse alle presenti Condizioni è Düsseldorf, Germania, a condizione che tu sia un commerciante, una persona giuridica di diritto pubblico o un fondo speciale di diritto pubblico. La Commissione Europea fornisce una piattaforma per la risoluzione extragiudiziale delle controversie all\'indirizzo https://ec.europa.eu/consumers/odr; non siamo obbligati né disponibili a partecipare a procedure di arbitrato dei consumatori.',
  s14Title: '14. Modifiche alle presenti Condizioni',
  s14Body: 'Possiamo modificare le presenti Condizioni a nostra discrezione per riflettere cambiamenti nel Servizio, nella legge applicabile o nelle operazioni aziendali. Le modifiche sostanziali saranno notificate al tuo indirizzo email registrato almeno trenta (30) giorni prima dell\'entrata in vigore e visualizzeremo un avviso sul sito. Le modifiche non sostanziali (chiarimenti, formattazione, aggiornamenti dell\'elenco dei fornitori terzi nella sezione 12) entrano in vigore con la pubblicazione. L\'uso continuato del Servizio dopo la data effettiva di una modifica costituisce accettazione delle Condizioni riviste. Se non accetti le modifiche puoi chiudere il tuo account in qualsiasi momento dalla pagina del profilo; i crediti precedentemente scalati non sono rimborsabili in caso di disaccordo con le modifiche delle politiche.',
};

// =====================================================================
// Portuguese
// =====================================================================
const ptTerms = {
  title: 'Termos do Serviço',
  seoDesc: 'Termos do Serviço de {{brand}}. Obrigações da conta, sistema de créditos, pagamentos, reembolsos, tratamento de ficheiros, usos proibidos, responsabilidade e jurisdição alemã.',
  updated: UPDATED.pt,
  s1Title: '1. Âmbito e aceitação dos Termos',
  s1Body: 'Estes Termos do Serviço ("Termos") regem a sua utilização de {{brand}} (o "Serviço"), uma plataforma web de conversão de ficheiros operada a partir da Alemanha por Arwand Moobed Mehdiabadi, Suitbertus Str. 3, 40223 Düsseldorf. Ao criar uma conta, completar uma compra ou usar o Serviço de qualquer forma, confirma que leu, compreendeu e aceitou estar legalmente vinculado por estes Termos. Se não concordar, não deve usar o Serviço. Podemos atualizar estes Termos conforme indicado na secção 14, e o uso continuado após as alterações entrarem em vigor constitui aceitação.',
  s2Title: '2. Descrição do serviço',
  s2Body: '{{brand}} fornece conversão de ficheiros baseada em navegador em mais de cinquenta formatos de entrada e saída, incluindo documentos (PDF, Word, Excel, PowerPoint, OpenDocument), imagens (JPG, PNG, WebP, HEIC, SVG, TIFF), áudio (MP3, WAV, FLAC, AAC, OGG), vídeo (MP4, AVI, MOV, MKV, WebM) e arquivos (ZIP, RAR, 7Z, TAR, GZ). O Serviço também oferece Smart Functions com IA: OCR, texto para fala, fala para texto e geração automática de legendas. A conversão é realizada pela nossa infraestrutura e por APIs de terceiros confiáveis conforme a secção 12. Esforçamo-nos por garantir alta disponibilidade mas não garantimos serviço ininterrupto ou sem erros.',
  s3Title: '3. Registo de conta e segurança',
  s3Body: 'Para usar o Serviço deve criar uma conta com um endereço de email válido e uma palavra-passe que cumpra os nossos requisitos mínimos de segurança, ou iniciar sessão via Google OAuth. É o único responsável pela proteção das suas credenciais e por toda a atividade na sua conta. Notifique-nos imediatamente em Support@convertanyformat.com em caso de suspeita de uso não autorizado. Deve ter pelo menos dezasseis (16) anos para se registar; utilizadores entre 16 e 18 anos declaram ter o consentimento de um pai ou tutor legal quando exigido pela lei do seu país de residência. Reservamo-nos o direito de recusar registos, suspender contas ou cancelar o acesso por incumprimentos.',
  s4Title: '4. Sistema de créditos',
  s4Body: 'O Serviço funciona com um modelo de créditos pré-pagos. Cada conversão bem-sucedida deduz um número definido de créditos do seu saldo. Conversões de formato padrão custam um (1) crédito por ficheiro. As Smart Functions são cobradas por uso: Texto para fala custa 1 crédito por cada 1.000 caracteres de entrada (arredondado para cima); Fala para texto e o Gerador automático de legendas custam 1 crédito por cada 5 minutos de duração de áudio ou vídeo (arredondado para cima). Conversões falhadas não deduzem créditos. Os créditos não são transferíveis, não expiram e só podem ser resgatados dentro do Serviço. Os créditos bónus do programa de referência seguem as mesmas regras mas não podem ser trocados por dinheiro.',
  s5Title: '5. Preços e pagamentos',
  s5Body: 'Os pacotes de créditos são vendidos em três tamanhos: 1 crédito (0,99 €), 10 créditos (7,99 €) e 30 créditos (20,99 €). Todos os preços estão em euros e incluem o IVA alemão aplicável (atualmente 19%). Os pagamentos são processados exclusivamente pela Stripe Payments Europe Ltd., uma instituição de pagamento autorizada; não armazenamos números completos de cartões. Ao comprar créditos declara estar autorizado a usar o método de pagamento fornecido. Emitiremos uma fatura eletrónica conforme aos fins fiscais por cada compra. Reservamo-nos o direito de modificar preços com pré-aviso mínimo de trinta (30) dias por email para o seu endereço registado.',
  s6Title: '6. Política de reembolso',
  s6Body: 'Como consumidor residente na União Europeia tem um direito de livre resolução de catorze (14) dias para compras digitais nos termos da Fernabsatzgesetz alemã. Ao comprar créditos e usar algum dentro do prazo de resolução, renuncia expressamente ao seu direito de livre resolução conforme permitido pelo § 356 Abs. 5 BGB. Os créditos não utilizados são reembolsáveis na totalidade nos catorze dias após a compra. Para solicitar um reembolso escreva para Support@convertanyformat.com a partir do email associado à sua conta; os reembolsos são processados em cinco a dez dias úteis para o método de pagamento original. Reservamo-nos o direito de recusar pedidos que razoavelmente consideremos de má-fé.',
  s7Title: '7. Tamanho do ficheiro e restrições de formato',
  s7Body: 'O tamanho máximo de upload é 200 MB por ficheiro para conversões padrão e 25 MB para ferramentas Smart Functions (limitadas pela API da OpenAI). Os formatos suportados estão listados na página Ferramentas; carregar um ficheiro em formato não suportado pode resultar em conversão falhada sem dedução de créditos. Reservamo-nos o direito de recusar ficheiros que contenham malware, excedam a nossa capacidade de infraestrutura, imponham custo desproporcionado ou de outra forma comprometam a operação do Serviço. Ficheiros que razoavelmente suspeitemos conterem conteúdo ilegal podem ser denunciados às autoridades competentes conforme exigido por lei.',
  s8Title: '8. Eliminação automática de ficheiros',
  s8Body: 'Todos os ficheiros que carrega, juntamente com a saída convertida que entregamos, são armazenados apenas pelo tempo necessário para fornecer o Serviço e são eliminados automaticamente e permanentemente dos nossos sistemas em vinte e quatro (24) horas após o upload. Os links de download expiram quando os ficheiros subjacentes são eliminados. Não conservamos cópias, backups ou miniaturas dos seus ficheiros para além desta janela. Se precisar de um ficheiro convertido para além deste período, deve descarregá-lo e armazená-lo localmente. Os logs do servidor que possam referenciar incidentalmente nomes de ficheiros são conservados separadamente segundo as regras de retenção da nossa Política de Privacidade.',
  s9Title: '9. Usos proibidos',
  s9Body: 'Concorda em não usar o Serviço para: (a) carregar ou distribuir malware, vírus ou qualquer código malicioso; (b) violar leis aplicáveis, incluindo direitos de autor, marcas ou proteção de dados; (c) tentar obter acesso não autorizado aos nossos sistemas, contas de outros utilizadores ou qualquer infraestrutura subjacente; (d) usar sistemas automatizados, scripts ou bots para contornar limites de uso, preços de créditos ou controlos de segurança; (e) carregar conteúdo ilegal, difamatório, de ódio, de assédio ou que represente menores em contextos inadequados; (f) processar conteúdo que viole a privacidade ou outros direitos de pessoas identificáveis sem o seu consentimento. As infrações podem resultar em encerramento imediato da conta, perda dos créditos restantes sem reembolso e denúncia às autoridades competentes.',
  s10Title: '10. Propriedade intelectual',
  s10Body: 'Mantém a propriedade total de todos os ficheiros que carrega e da saída convertida produzida pelo Serviço. Ao carregar um ficheiro concede-nos uma licença limitada, não exclusiva e isenta de royalties exclusivamente para realizar a conversão solicitada; esta licença termina automaticamente quando o ficheiro é eliminado nos termos da secção 8. O nome {{brand}}, logótipo, design visual, código-fonte e software subjacente são da nossa propriedade intelectual exclusiva, protegidos pelo direito de autor alemão e tratados internacionais. Não pode fazer engenharia reversa, descompilar ou tentar de outra forma derivar o código-fonte do Serviço, salvo na medida expressamente permitida pela lei imperativa (por exemplo, § 69d UrhG).',
  s11Title: '11. Limitação de responsabilidade',
  s11Body: 'O Serviço é fornecido "como está" e "conforme disponível" sem garantias de qualquer tipo, expressas ou implícitas, incluindo garantias de comercialização, adequação a um fim específico, exatidão das conversões ou disponibilidade ininterrupta. Na máxima medida permitida pela lei alemã, a nossa responsabilidade total agregada por qualquer reclamação decorrente ou relacionada com o Serviço não excederá o montante total que nos pagou nos doze (12) meses anteriores à reclamação. Não somos responsáveis por danos indiretos, incidentais, consequenciais ou punitivos, incluindo perda de dados, lucros cessantes ou interrupção de negócio. Recomendamos expressamente fazer cópias de segurança locais antes de carregar ficheiros importantes. As limitações precedentes não se aplicam à responsabilidade por danos à vida, ao corpo ou à saúde, conduta dolosa ou com negligência grosseira, nos termos da Lei alemã de Responsabilidade do Produto, ou a qualquer outra responsabilidade que não possa ser limitada ou excluída pela lei imperativa alemã.',
  s12Title: '12. Serviços de terceiros',
  s12Body: 'O Serviço utiliza os seguintes fornecedores externos que atuam como subcontratantes em nosso nome ao abrigo do Art. 28 RGPD: Stripe Payments Europe Ltd. (processamento de pagamentos), CloudConvert GmbH (processamento de conversões, com sede em Munique), Supabase Inc. (alojamento de base de dados PostgreSQL), Railway Corp. (alojamento de aplicação), Resend (envio de emails transacionais), OpenAI Ireland Ltd. (Smart Functions baseadas em TTS-1 e Whisper-1) e Google LLC (login Google OAuth). Celebrámos Acordos de Tratamento de Dados com cada fornecedor que processe dados pessoais. Cada fornecedor opera segundo os seus próprios termos de serviço que se aplicam em conjunto com estes Termos.',
  s13Title: '13. Lei aplicável e jurisdição',
  s13Body: 'Estes Termos e quaisquer obrigações extracontratuais decorrentes ou em conexão com eles regem-se pelas leis da República Federal da Alemanha, excluindo a Convenção das Nações Unidas sobre Contratos de Compra e Venda Internacional de Mercadorias. As disposições imperativas de proteção do consumidor do país de residência habitual do consumidor permanecem inalteradas. O foro exclusivo para todas as disputas decorrentes ou relacionadas com estes Termos é Düsseldorf, Alemanha, desde que seja comerciante, pessoa coletiva de direito público ou fundo especial de direito público. A Comissão Europeia fornece uma plataforma de resolução extrajudicial de litígios em https://ec.europa.eu/consumers/odr; não estamos obrigados nem disponíveis para participar em procedimentos perante uma comissão de arbitragem de consumidores.',
  s14Title: '14. Alterações a estes Termos',
  s14Body: 'Podemos modificar estes Termos a nosso critério para refletir alterações no Serviço, na lei aplicável ou nas operações empresariais. As alterações materiais serão notificadas para o seu endereço de email registado com pelo menos trinta (30) dias de antecedência relativamente à entrada em vigor, e exibiremos um aviso no site. As alterações não materiais (esclarecimentos, formatação, atualizações da lista de fornecedores externos na secção 12) entram em vigor com a publicação. O uso continuado do Serviço após a data de entrada em vigor de qualquer alteração constitui aceitação dos Termos revistos. Se não aceitar as alterações pode encerrar a sua conta a qualquer momento na página de perfil; os créditos previamente deduzidos não são reembolsáveis em caso de discordância com alterações de política.',
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

const PAYLOADS = { es: esTerms, it: itTerms, pt: ptTerms };

for (const [lang, terms] of Object.entries(PAYLOADS)) {
  const block = findLangBlock(content, lang);
  content = replaceTopLevelKey(content, 'terms', terms, block.start, block.end);
  console.log(`✔ Updated ${lang}.terms`);
}

fs.writeFileSync(FILE, content);
console.log('\nDone (3 of 7 languages — nl/pl/sv/no in next script).');
