// One-shot script: restores proper Unicode special characters in
// client/src/i18n-translations.js and inserts Smart Functions strings
// for every supported language.
//
// Substitutions are applied ONLY inside quoted string literals so that
// JS object keys (e.g. `requestNew`) are never altered.
//
// Run from repo root:  node scripts/fix-translations.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

// =====================================================================
// Helpers
// =====================================================================

function applyPairs(text, pairs) {
  for (const [from, to] of pairs) {
    text = text.split(from).join(to);
  }
  return text;
}

// Apply a transformer only to single- and double-quoted string literals.
// Preserves JS keys, punctuation, comments. Re-emits the string with
// whichever quote style avoids needing to escape the content; if both
// quote styles appear in the result, escapes single quotes.
function applyOnlyToStrings(text, transformer) {
  return text.replace(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g, (match, single, double) => {
    // Unescape input so the transformer sees real characters
    let content = single !== undefined
      ? single.replace(/\\'/g, "'").replace(/\\\\/g, '\\')
      : double.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    content = transformer(content);
    const hasSingle = content.includes("'");
    const hasDouble = content.includes('"');
    if (hasSingle && !hasDouble) return `"${content}"`;
    if (!hasSingle) return `'${content}'`;
    // Both quote types present — escape single quotes
    return `'${content.replace(/'/g, "\\'")}'`;
  });
}

function fixSection(content, langName, fixer) {
  const startMarker = `const ${langName} = {`;
  const start = content.indexOf(startMarker);
  if (start === -1) throw new Error(`Section not found: ${langName}`);
  let depth = 0;
  let i = start;
  while (i < content.length) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        const before = content.slice(0, start);
        const block = content.slice(start, i + 1);
        const after = content.slice(i + 1);
        return before + fixer(block) + after;
      }
    }
    i++;
  }
  throw new Error(`Unterminated section: ${langName}`);
}

// =====================================================================
// German: blanket umlaut substitution + targeted ß words
// =====================================================================

const deSharpS = [
  ['Schliessen', 'Schließen'], ['schliessen', 'schließen'],
  ['gemaess', 'gemäß'], ['Gemaess', 'Gemäß'],
  ['regelmaessig', 'regelmäßig'], ['Regelmaessig', 'Regelmäßig'],
  ['massgeschneiderte', 'maßgeschneiderte'],
  ['massgeschneidert', 'maßgeschneidert'],
  ['Strasse', 'Straße'], ['Strassen', 'Straßen'], ['strasse', 'straße'],
  ['Grossbuchstabe', 'Großbuchstabe'],
  ['Grossbuchstaben', 'Großbuchstaben'],
  ['groesste', 'größte'], ['Groesste', 'Größte'],
  ['groessten', 'größten'], ['Groessten', 'Größten'],
  ['groessere', 'größere'], ['Groessere', 'Größere'],
  ['groesseren', 'größeren'], ['Groesseren', 'Größeren'],
  ['groesser', 'größer'], ['Groesser', 'Größer'],
  ['Groessenaenderung', 'Größenänderung'],
  ['Groessen', 'Größen'], ['Groesse', 'Größe'],
  ['gross.', 'groß.'], ['gross,', 'groß,'], ['gross ', 'groß '],
  ['Gross.', 'Groß.'], ['Gross,', 'Groß,'], ['Gross ', 'Groß '],
  ['weiss', 'weiß'], ['Weiss', 'Weiß'],
  ['heisst', 'heißt'], ['Heisst', 'Heißt'],
  ['fliessend', 'fließend'], ['Fliessend', 'Fließend'],
  ['Beduerfnissen', 'Bedürfnissen'],
  ['Dateigroesse', 'Dateigröße'],
];

// Words excluded from blanket ue → ü (these have legitimate u-e sequences)
const deUeExceptions = [
  'Aktuelles', 'aktuelles', 'Aktuelle', 'aktuelle', 'Aktuell', 'aktuell',
  'aktuellen', 'aktueller', 'aktuellem',
  'manuell', 'manuelle', 'manueller', 'manuellen', 'manuelles',
  'individuell', 'individuelle', 'individuellen',
  'visuell', 'visuelle', 'visuellen',
  'Statue', 'Statuen', 'Statuten',
  'Suez',
  // eu-diphthong + e suffix (NOT umlaut)
  'Neue', 'neue', 'Neuen', 'neuen', 'Neues', 'neues',
  'Neuer', 'neuer', 'Neuem', 'neuem', 'Neuere', 'neuere',
  // au-diphthong + e suffix (NOT umlaut)
  'Dauer', 'dauer', 'Dauern', 'dauern', 'Dauert', 'dauert',
  'Dauernd', 'Trauer', 'trauer', 'Mauer', 'Bauer',
  'Feuer', 'feuer', 'Steuer', 'steuer', 'Steuern', 'steuern',
];

function germanTransform(str) {
  str = applyPairs(str, deSharpS);
  const masks = [];
  deUeExceptions.forEach((word, i) => {
    const placeholder = `\x00DEUE${i}\x00`;
    if (str.indexOf(word) !== -1) {
      str = str.split(word).join(placeholder);
      masks.push([placeholder, word]);
    }
  });
  str = str
    .replace(/Ae/g, 'Ä').replace(/ae/g, 'ä')
    .replace(/Oe/g, 'Ö').replace(/oe/g, 'ö')
    .replace(/Ue/g, 'Ü').replace(/ue/g, 'ü');
  for (const [placeholder, word] of masks) {
    str = str.split(placeholder).join(word);
  }
  return str;
}

function fixGerman(text) {
  return applyOnlyToStrings(text, germanTransform);
}

// =====================================================================
// French: word-level dictionary
// =====================================================================

const frPairs = [
  ['Telecharger', 'Télécharger'], ['telecharger', 'télécharger'],
  ['Telechargez', 'Téléchargez'], ['telechargez', 'téléchargez'],
  ['Telechargement', 'Téléchargement'], ['telechargement', 'téléchargement'],
  ['telecharge', 'téléchargé'], ['Telecharge', 'Téléchargé'],
  ['telecharges', 'téléchargés'], ['Telecharges', 'Téléchargés'],
  ['Telephone', 'Téléphone'], ['telephone', 'téléphone'],
  ['Reinitialisation', 'Réinitialisation'], ['reinitialisation', 'réinitialisation'],
  ['Reinitialiser', 'Réinitialiser'], ['reinitialiser', 'réinitialiser'],
  ['Reinitialise', 'Réinitialisé'], ['reinitialise', 'réinitialisé'],
  ['Reessayez', 'Réessayez'], ['reessayez', 'réessayez'],
  ['Reessayer', 'Réessayer'], ['reessayer', 'réessayer'],
  ['Deconnexion', 'Déconnexion'], ['deconnexion', 'déconnexion'],
  ['Defaut', 'Défaut'], ['defaut', 'défaut'],
  ['Definir', 'Définir'], ['definir', 'définir'],
  ['Definitivement', 'Définitivement'], ['definitivement', 'définitivement'],
  ['Demarrer', 'Démarrer'], ['demarrer', 'démarrer'],
  ['Demarrez', 'Démarrez'], ['demarrez', 'démarrez'],
  ['Decouvrez', 'Découvrez'], ['decouvrez', 'découvrez'],
  ['Decouvrir', 'Découvrir'], ['decouvrir', 'découvrir'],
  ['Detail', 'Détail'], ['detail', 'détail'],
  ['Details', 'Détails'], ['details', 'détails'],
  ['Deja', 'Déjà'], ['deja', 'déjà'],
  ['Desactive', 'Désactivé'], ['desactive', 'désactivé'],
  ['Desactiver', 'Désactiver'], ['desactiver', 'désactiver'],
  ['developpeur', 'développeur'], ['Developpeur', 'Développeur'],
  ['Generer', 'Générer'], ['generer', 'générer'],
  ['Generez', 'Générez'], ['generez', 'générez'],
  ['Generee', 'Générée'], ['generee', 'générée'],
  ['Genere', 'Généré'],
  ['Generation', 'Génération'], ['generation', 'génération'],
  ['General', 'Général'], ['general', 'général'],
  ['Pret', 'Prêt'], ['pret', 'prêt'],
  ['etre', 'être'], ['Etre', 'Être'],
  ['etes', 'êtes'], ['Etes', 'Êtes'],
  ['meme', 'même'], ['Meme', 'Même'],
  ['memes', 'mêmes'],
  ['etat', 'état'], ['Etat', 'État'],
  ['ete', 'été'], ['Ete', 'Été'],
  ['ecrans', 'écrans'], ['Ecrans', 'Écrans'],
  ['ecran', 'écran'], ['Ecran', 'Écran'],
  ['acces', 'accès'], ['Acces', 'Accès'],
  ['succes', 'succès'], ['Succes', 'Succès'],
  ['progres', 'progrès'], ['Progres', 'Progrès'],
  ['apres', 'après'], ['Apres', 'Après'],
  ['pres', 'près'], ['Pres', 'Près'],
  ['tres', 'très'], ['Tres', 'Très'],
  ['qualite', 'qualité'], ['Qualite', 'Qualité'],
  ['securite', 'sécurité'], ['Securite', 'Sécurité'],
  ['securise', 'sécurisé'], ['Securise', 'Sécurisé'],
  ['securisee', 'sécurisée'], ['Securisee', 'Sécurisée'],
  ['Securisez', 'Sécurisez'], ['securisez', 'sécurisez'],
  ['responsabilite', 'responsabilité'], ['Responsabilite', 'Responsabilité'],
  ['propriete', 'propriété'], ['Propriete', 'Propriété'],
  ['confidentialite', 'confidentialité'], ['Confidentialite', 'Confidentialité'],
  ['simplicite', 'simplicité'], ['Simplicite', 'Simplicité'],
  ['priorite', 'priorité'], ['Priorite', 'Priorité'],
  ['privee', 'privée'], ['privees', 'privées'],
  ['supprime', 'supprimé'], ['supprimes', 'supprimés'],
  ['supprimee', 'supprimée'], ['supprimees', 'supprimées'],
  ['Supprime', 'Supprimé'], ['Supprimes', 'Supprimés'],
  ['integrer', 'intégrer'], ['Integrer', 'Intégrer'],
  ['integrez', 'intégrez'], ['Integrez', 'Intégrez'],
  ['integration', 'intégration'], ['Integration', 'Intégration'],
  ['operation', 'opération'], ['Operation', 'Opération'],
  ['operations', 'opérations'], ['Operations', 'Opérations'],
  ['francais', 'français'], ['Francais', 'Français'],
  ['francaise', 'française'], ['Francaise', 'Française'],
  ['ca marche', 'ça marche'], ['Ca marche', 'Ça marche'],
  ['parametres', 'paramètres'], ['Parametres', 'Paramètres'],
  ['parametre', 'paramètre'], ['Parametre', 'Paramètre'],
  ['probleme', 'problème'], ['Probleme', 'Problème'],
  ['systeme', 'système'], ['Systeme', 'Système'],
  ['theme', 'thème'], ['Theme', 'Thème'],
  ['caracteres', 'caractères'], ['Caracteres', 'Caractères'],
  ['caractere', 'caractère'], ['Caractere', 'Caractère'],
  ['recoivent', 'reçoivent'],
  ['cree', 'créé'], ['Cree', 'Créé'],
  ['creer', 'créer'], ['Creer', 'Créer'],
  ['creee', 'créée'], ['Creee', 'Créée'],
  ['creation', 'création'], ['Creation', 'Création'],
  ['cle', 'clé'], ['cles', 'clés'],
  ['Cle', 'Clé'], ['Cles', 'Clés'],
  ['recemment', 'récemment'], ['Recemment', 'Récemment'],
  ['recents', 'récents'], ['recent', 'récent'],
  ['frequentes', 'fréquentes'], ['Frequentes', 'Fréquentes'],
  ['frequente', 'fréquente'],
  ['ideal', 'idéal'], ['Ideal', 'Idéal'],
  ['idealement', 'idéalement'],
  ['ajoute', 'ajouté'], ['ajoutes', 'ajoutés'],
  ['ajoutee', 'ajoutée'], ['ajoutees', 'ajoutées'],
  ['envoye', 'envoyé'], ['envoyes', 'envoyés'],
  ['envoyee', 'envoyée'], ['envoyees', 'envoyées'],
  ['Envoye', 'Envoyé'], ['Envoyee', 'Envoyée'],
  ['copie', 'copié'], ['copies', 'copiés'],
  ['copiee', 'copiée'], ['copiees', 'copiées'],
  ['echec', 'échec'], ['Echec', 'Échec'],
  ['echoues', 'échoués'], ['echoue', 'échoué'],
  ['terminee', 'terminée'], ['Terminee', 'Terminée'],
  ['termine', 'terminé'], ['termines', 'terminés'],
  ['ameliorations', 'améliorations'],
  ['ameliorer', 'améliorer'], ['ameliorez', 'améliorez'],
  ['repondre', 'répondre'], ['Repondre', 'Répondre'],
  ['repondrons', 'répondrons'], ['repondons', 'répondons'],
  ['repond', 'répond'], ['repondez', 'répondez'],
  ['Reponses', 'Réponses'], ['reponses', 'réponses'],
  ['Resume', 'Résumé'],
  ['present', 'présent'], ['presente', 'présenté'],
  ['presentes', 'présentés'], ['presentee', 'présentée'],
  ['regle', 'réglé'],
  ['avance', 'avancé'], ['avancees', 'avancées'], ['avances', 'avancés'],
  ['avancee', 'avancée'],
  ['gere', 'géré'], ['Gerer', 'Gérer'], ['gerer', 'gérer'],
  ['videos', 'vidéos'], ['video', 'vidéo'],
  ['Videos', 'Vidéos'], ['Video', 'Vidéo'],
  ['idees', 'idées'], ['idee', 'idée'],
  ['Idees', 'Idées'], ['Idee', 'Idée'],
  ['utilises', 'utilisés'], ['utilise', 'utilisé'],
  ['utilisees', 'utilisées'], ['utilisee', 'utilisée'],
  ['considere', 'considéré'],
  ['payee', 'payée'], ['paye', 'payé'], ['payes', 'payés'],
  ['stockes', 'stockés'], ['stocke', 'stocké'],
  ['authentifie', 'authentifié'],
  ['ponctuelle', 'ponctuelle'],
  ['notifie', 'notifié'], ['Notifie', 'Notifié'],
  ['notifiees', 'notifiées'],
  ['mensuel', 'mensuel'],
  ['conserve', 'conservé'],
  ['legales', 'légales'], ['Legales', 'Légales'],
  ['mensuelle', 'mensuelle'],
  ['enregistre', 'enregistré'], ['Enregistre', 'Enregistré'],
  ['enregistrement', 'enregistrement'],
  ['controle', 'contrôle'], ['Controle', 'Contrôle'],
  ['arrivee', 'arrivée'], ['arrives', 'arrivés'],
  ['utilisateurs', 'utilisateurs'],
  ['utilisateur', 'utilisateur'],
  ['rapide', 'rapide'],
  ['rapides', 'rapides'],
  ['Reductions', 'Réductions'], ['reductions', 'réductions'],
  ['Reduction', 'Réduction'], ['reduction', 'réduction'],
  ['Reduisez', 'Réduisez'], ['reduisez', 'réduisez'],
  ['Reduit', 'Réduit'], ['reduit', 'réduit'],
  ['Selectionnez', 'Sélectionnez'], ['selectionnez', 'sélectionnez'],
  ['selectionne', 'sélectionné'], ['Selectionne', 'Sélectionné'],
  ['selectionnes', 'sélectionnés'],
  ['Selectionner', 'Sélectionner'], ['selectionner', 'sélectionner'],
  ['Selection', 'Sélection'], ['selection', 'sélection'],
  ['Sortie est.', 'Sortie est.'],
  ['necessite', 'nécessite'], ['Necessite', 'Nécessite'],
  ['necessaire', 'nécessaire'], ['Necessaire', 'Nécessaire'],
  ['necessaires', 'nécessaires'],
  ['Numero', 'Numéro'], ['numero', 'numéro'],
  ['preferences', 'préférences'], ['Preferences', 'Préférences'],
  ['preference', 'préférence'],
  ['Adresse', 'Adresse'],
  ['e-mail', 'e-mail'],
  ['Editer', 'Éditer'],
  ['Imprime', 'Imprimé'], ['imprime', 'imprimé'],
  ['Telecharges', 'Téléchargés'],
  ['Inscrit', 'Inscrit'],
  ['Recu', 'Reçu'], ['recu', 'reçu'], ['recus', 'reçus'],
  ['percu', 'perçu'], ['Percu', 'Perçu'],
  ['protege', 'protégé'], ['Protege', 'Protégé'],
  ['protegee', 'protégée'], ['Protegee', 'Protégée'],
  ['protegees', 'protégées'],
  ['expire', 'expiré'], ['Expire', 'Expiré'],
  ['expires', 'expirés'], ['Expires', 'Expirés'],
  ['ouvree', 'ouvrée'],
  ['ouvres', 'ouvrés'],
  ['cas echeant', 'cas échéant'],
  ['volumineux', 'volumineux'],
  ['volumineuse', 'volumineuse'],
  ['ge ', 'gé '],
  ['etiquette', 'étiquette'],
  ['etiquettes', 'étiquettes'],
  ['donnees', 'données'], ['Donnees', 'Données'],
  ['donnee', 'donnée'], ['Donnee', 'Donnée'],
  ['equipe', 'équipe'], ['Equipe', 'Équipe'],
  ['equipes', 'équipes'], ['Equipes', 'Équipes'],
  ['equitable', 'équitable'], ['Equitable', 'Équitable'],
  ['hesiter', 'hésiter'],
  ['hesitez', 'hésitez'],
  ['Hesitez', 'Hésitez'],
  ['premiere', 'première'], ['Premiere', 'Première'],
  ['premier', 'premier'],
  ['derniere', 'dernière'], ['Derniere', 'Dernière'],
  ['Dernieres', 'Dernières'], ['dernieres', 'dernières'],
  ['Dernier', 'Dernier'],
  ['eleve', 'élevé'], ['Eleve', 'Élevé'],
  ['legerement', 'légèrement'],
  ['plutot', 'plutôt'], ['Plutot', 'Plutôt'],
  ['cote', 'côté'], ['cotes', 'côtés'],
  ['Cote', 'Côté'],
  ['interet', 'intérêt'], ['Interet', 'Intérêt'],
  ['interets', 'intérêts'],
  ['interesse', 'intéressé'],
  ['interessant', 'intéressant'],
  ['interessante', 'intéressante'],
  ['supplementaires', 'supplémentaires'],
  ['supplementaire', 'supplémentaire'],
  ['Supplementaires', 'Supplémentaires'],
  ['Supplementaire', 'Supplémentaire'],
  ['compte ', 'compte '],
  ['n est pas', "n'est pas"], ['n est', "n'est"],
  ['n a ', "n'a "], ['n ai ', "n'ai "],
  ['l avons', "l'avons"], ['l avoir', "l'avoir"],
  ['d aide', "d'aide"], ['d achat', "d'achat"],
  ['d acces', "d'accès"], ['d email', "d'email"],
  ['d un', "d'un"], ['d une', "d'une"],
  ['l API', "l'API"], ['l email', "l'email"],
  ['s inscrire', "s'inscrire"],
  ['c est', "c'est"], ['C est', "C'est"],
  ['s il', "s'il"], ['S il', "S'il"],
  ['m envoyer', "m'envoyer"],
  ['l achat', "l'achat"],
  ['l outil', "l'outil"],
  ['l usage', "l'usage"],
  ['l audio', "l'audio"],
  ['n existe pas', "n'existe pas"],
  ['l Allemagne', "l'Allemagne"],
  ['jusqu a', "jusqu'à"], ['Jusqu a', "Jusqu'à"],
  ['A propos', 'À propos'], ['a propos', 'à propos'],
  ['a tout moment', 'à tout moment'],
  ['a la fois', 'à la fois'],
  ['a partir', 'à partir'],
  ['a credits', 'à crédits'],
  ['envoye!', 'envoyé!'],
  ['Envoye!', 'Envoyé!'],
];

function fixFrench(text) {
  return applyOnlyToStrings(text, (s) => applyPairs(s, frPairs));
}

// =====================================================================
// Spanish
// =====================================================================
const esPairs = [
  ['ano ', 'año '], ['anos ', 'años '],
  ['Ano ', 'Año '], ['Anos ', 'Años '],
  ['ano.', 'año.'], ['anos.', 'años.'],
  ['ano,', 'año,'], ['anos,', 'años,'],
  ['Espanol', 'Español'], ['espanol', 'español'],
  ['Espanola', 'Española'], ['espanola', 'española'],
  ['compania', 'compañía'], ['Compania', 'Compañía'],
  ['contrasena', 'contraseña'], ['Contrasena', 'Contraseña'],
  ['ensena', 'enseña'], ['ensenar', 'enseñar'],
  ['pequeno', 'pequeño'], ['pequena', 'pequeña'],
  ['Manana', 'Mañana'], ['manana', 'mañana'],
  ['informacion', 'información'], ['Informacion', 'Información'],
  ['conversion', 'conversión'], ['Conversion', 'Conversión'],
  ['descripcion', 'descripción'], ['Descripcion', 'Descripción'],
  ['proteccion', 'protección'], ['Proteccion', 'Protección'],
  ['seleccion', 'selección'], ['Seleccion', 'Selección'],
  ['suscripcion', 'suscripción'], ['Suscripcion', 'Suscripción'],
  ['operacion', 'operación'], ['Operacion', 'Operación'],
  ['cancelacion', 'cancelación'], ['Cancelacion', 'Cancelación'],
  ['notificacion', 'notificación'], ['Notificacion', 'Notificación'],
  ['comunicacion', 'comunicación'], ['Comunicacion', 'Comunicación'],
  ['educacion', 'educación'], ['Educacion', 'Educación'],
  ['situacion', 'situación'], ['Situacion', 'Situación'],
  ['ubicacion', 'ubicación'], ['Ubicacion', 'Ubicación'],
  ['integracion', 'integración'], ['Integracion', 'Integración'],
  ['traduccion', 'traducción'], ['Traduccion', 'Traducción'],
  ['validacion', 'validación'], ['Validacion', 'Validación'],
  ['investigacion', 'investigación'],
  ['version', 'versión'], ['Version', 'Versión'],
  ['Region', 'Región'], ['region', 'región'],
  ['Si,', 'Sí,'], ['Si.', 'Sí.'], ['Si!', 'Sí!'],
  ['mas ', 'más '], ['Mas ', 'Más '],
  ['mas.', 'más.'], ['mas,', 'más,'],
  ['como ', 'cómo '], ['Como ', 'Cómo '],
  ['Que ', 'Qué '],
  ['donde', 'dónde'], ['Donde', 'Dónde'],
  ['rapido', 'rápido'], ['Rapido', 'Rápido'],
  ['rapida', 'rápida'], ['Rapida', 'Rápida'],
  ['facil', 'fácil'], ['Facil', 'Fácil'],
  ['util', 'útil'], ['Util', 'Útil'],
  ['ultimo', 'último'], ['Ultimo', 'Último'],
  ['ultima', 'última'], ['Ultima', 'Última'],
  ['unico', 'único'], ['Unico', 'Único'],
  ['unica', 'única'], ['Unica', 'Única'],
  ['publico', 'público'], ['Publico', 'Público'],
  ['publica', 'pública'], ['Publica', 'Pública'],
  ['practico', 'práctico'], ['Practico', 'Práctico'],
  ['tecnico', 'técnico'], ['Tecnico', 'Técnico'],
  ['tecnica', 'técnica'], ['Tecnica', 'Técnica'],
  ['economico', 'económico'], ['Economico', 'Económico'],
  ['automatico', 'automático'], ['Automatico', 'Automático'],
  ['automaticamente', 'automáticamente'],
  ['terminos', 'términos'], ['Terminos', 'Términos'],
  ['exito', 'éxito'], ['Exito', 'Éxito'],
  ['ahi', 'ahí'], ['Ahi', 'Ahí'],
  ['todavia', 'todavía'], ['Todavia', 'Todavía'],
  ['ademas', 'además'], ['Ademas', 'Además'],
  ['atencion', 'atención'], ['Atencion', 'Atención'],
  ['accion', 'acción'], ['Accion', 'Acción'],
  ['acciones', 'acciones'],
  ['proposito', 'propósito'],
  ['polit ', 'polít '],
  ['politicas', 'políticas'], ['Politicas', 'Políticas'],
  ['politica', 'política'], ['Politica', 'Política'],
  ['paises', 'países'], ['Paises', 'Países'],
  ['Tambien', 'También'], ['tambien', 'también'],
  ['siguiente', 'siguiente'],
  ['volvera', 'volverá'], ['Volvera', 'Volverá'],
  ['volveras', 'volverás'],
  ['estaras', 'estarás'], ['estara', 'estará'],
  ['envio', 'envío'], ['Envio', 'Envío'],
  ['envios', 'envíos'],
  ['frances', 'francés'], ['Frances', 'Francés'],
  ['ingles', 'inglés'], ['Ingles', 'Inglés'],
  ['aleman', 'alemán'], ['Aleman', 'Alemán'],
  ['mes ', 'mes '],
  ['mes.', 'mes.'],
  ['caracter ', 'carácter '],
  ['caracteres', 'caracteres'],
  ['paquete', 'paquete'],
  ['preguntas', 'preguntas'],
  ['contactenos', 'contáctenos'],
  ['Contactenos', 'Contáctenos'],
  ['Sera', 'Será'], ['sera', 'será'],
  ['Seran', 'Serán'], ['seran', 'serán'],
  ['estandar', 'estándar'], ['Estandar', 'Estándar'],
  ['eliminacion', 'eliminación'],
  ['administracion', 'administración'],
  ['organizacion', 'organización'],
  ['organizaciones', 'organizaciones'],
  ['definicion', 'definición'], ['definiciones', 'definiciones'],
  ['perdida', 'pérdida'], ['Perdida', 'Pérdida'],
  ['ningun ', 'ningún '], ['Ningun ', 'Ningún '],
  ['ninguno', 'ninguno'],
  ['mayuscula', 'mayúscula'], ['Mayuscula', 'Mayúscula'],
  ['minuscula', 'minúscula'],
  ['numero', 'número'], ['Numero', 'Número'],
  ['numeros', 'números'],
  ['Telefono', 'Teléfono'], ['telefono', 'teléfono'],
  ['Codigo', 'Código'], ['codigo', 'código'],
  ['codigos', 'códigos'],
  ['Pagina', 'Página'], ['pagina', 'página'],
  ['paginas', 'páginas'],
  ['ultimo dia', 'último día'],
  ['Dia', 'Día'], ['dia ', 'día '], ['dias', 'días'],
  ['categoria', 'categoría'], ['Categoria', 'Categoría'],
  ['categorias', 'categorías'],
  ['energia', 'energía'],
  ['credito', 'crédito'], ['Credito', 'Crédito'],
  ['creditos', 'créditos'], ['Creditos', 'Créditos'],
  ['atencion', 'atención'],
  ['recibido', 'recibido'],
  ['recibidos', 'recibidos'],
  ['estandares', 'estándares'],
  ['mostrando', 'mostrando'],
  ['Inicio ', 'Inicio '],
];

function fixSpanish(text) {
  return applyOnlyToStrings(text, (s) => applyPairs(s, esPairs));
}

// =====================================================================
// Italian
// =====================================================================
const itPairs = [
  ['perche', 'perché'], ['Perche', 'Perché'],
  ['piu ', 'più '], ['Piu ', 'Più '],
  ['piu.', 'più.'], ['piu,', 'più,'],
  ['gia ', 'già '], ['Gia ', 'Già '],
  ['gia.', 'già.'], ['gia,', 'già,'],
  ['cosi ', 'così '], ['Cosi ', 'Così '],
  ['Cosi.', 'Così.'],
  ['qualita', 'qualità'], ['Qualita', 'Qualità'],
  ['velocita', 'velocità'], ['Velocita', 'Velocità'],
  ['priorita', 'priorità'], ['Priorita', 'Priorità'],
  ['Utilita', 'Utilità'], ['utilita', 'utilità'],
  ['identita', 'identità'], ['Identita', 'Identità'],
  ['liberta', 'libertà'], ['Liberta', 'Libertà'],
  ['attivita', 'attività'], ['Attivita', 'Attività'],
  ['novita', 'novità'], ['Novita', 'Novità'],
  ['eta ', 'età '], ['Eta ', 'Età '],
  ['caffe', 'caffè'], ['Caffe', 'Caffè'],
  ['e necessario', 'è necessario'], ['E necessario', 'È necessario'],
  ['e possibile', 'è possibile'], ['E possibile', 'È possibile'],
  ['non e ', 'non è '],
  ['Non e ', 'Non è '],
  ['comunita', 'comunità'],
  ['affidabilita', 'affidabilità'],
  ['responsabilita', 'responsabilità'],
  ['proprieta', 'proprietà'],
  ['privacy', 'privacy'],
  ['anonimita', 'anonimità'],
  ['carita', 'carità'],
  ['felicita', 'felicità'],
  ['scarica', 'scarica'],
  ['gia inviato', 'già inviato'],
  ['gia ricevuto', 'già ricevuto'],
  ['Cio ', 'Ciò '], ['cio ', 'ciò '],
  ['e gratuito', 'è gratuito'],
  ['cio che', 'ciò che'],
  ['fa gia', 'fa già'],
  ['e stata', 'è stata'],
  ['e stato', 'è stato'],
  ['gia stato', 'già stato'],
  ['gia esistente', 'già esistente'],
  ['cosi via', 'così via'],
  ['piu di', 'più di'],
  ['cliccato', 'cliccato'],
  ['e in corso', 'è in corso'],
];

function fixItalian(text) {
  return applyOnlyToStrings(text, (s) => applyPairs(s, itPairs));
}

// =====================================================================
// Portuguese
// =====================================================================
const ptPairs = [
  ['nao ', 'não '], ['Nao ', 'Não '],
  ['nao.', 'não.'], ['nao,', 'não,'], ['nao!', 'não!'], ['nao?', 'não?'],
  ['informacao', 'informação'], ['Informacao', 'Informação'],
  ['conversao', 'conversão'], ['Conversao', 'Conversão'],
  ['operacao', 'operação'], ['Operacao', 'Operação'],
  ['descricao', 'descrição'], ['Descricao', 'Descrição'],
  ['traducao', 'tradução'], ['Traducao', 'Tradução'],
  ['extensao', 'extensão'], ['Extensao', 'Extensão'],
  ['versao', 'versão'], ['Versao', 'Versão'],
  ['opcao', 'opção'], ['Opcao', 'Opção'],
  ['acao', 'ação'], ['Acao', 'Ação'],
  ['secao', 'seção'], ['Secao', 'Seção'],
  ['regiao', 'região'], ['Regiao', 'Região'],
  ['protecao', 'proteção'], ['Protecao', 'Proteção'],
  ['selecao', 'seleção'], ['Selecao', 'Seleção'],
  ['comunicacao', 'comunicação'], ['Comunicacao', 'Comunicação'],
  ['preocupacao', 'preocupação'],
  ['situacao', 'situação'],
  ['localizacao', 'localização'],
  ['notificacao', 'notificação'],
  ['integracao', 'integração'],
  ['transacao', 'transação'],
  ['informacoes', 'informações'], ['Informacoes', 'Informações'],
  ['conversoes', 'conversões'], ['Conversoes', 'Conversões'],
  ['operacoes', 'operações'], ['Operacoes', 'Operações'],
  ['descricoes', 'descrições'], ['traducoes', 'traduções'],
  ['versoes', 'versões'], ['opcoes', 'opções'],
  ['acoes', 'ações'], ['secoes', 'seções'],
  ['regioes', 'regiões'], ['protecoes', 'proteções'],
  ['selecoes', 'seleções'],
  ['comunicacoes', 'comunicações'],
  ['notificacoes', 'notificações'],
  ['situacoes', 'situações'], ['localizacoes', 'localizações'],
  ['dimensoes', 'dimensões'], ['Dimensoes', 'Dimensões'],
  ['extensoes', 'extensões'], ['Extensoes', 'Extensões'],
  ['tambem', 'também'], ['Tambem', 'Também'],
  ['Pagina', 'Página'], ['pagina', 'página'],
  ['paginas', 'páginas'], ['Paginas', 'Páginas'],
  ['Codigo', 'Código'], ['codigo', 'código'],
  ['codigos', 'códigos'],
  ['video', 'vídeo'], ['videos', 'vídeos'],
  ['Video', 'Vídeo'], ['Videos', 'Vídeos'],
  ['proximo', 'próximo'], ['proxima', 'próxima'],
  ['Proximo', 'Próximo'], ['Proxima', 'Próxima'],
  ['ultimo', 'último'], ['ultima', 'última'],
  ['Ultimo', 'Último'], ['Ultima', 'Última'],
  ['rapido', 'rápido'], ['rapida', 'rápida'],
  ['Rapido', 'Rápido'], ['Rapida', 'Rápida'],
  ['unico', 'único'], ['unica', 'única'],
  ['Unico', 'Único'], ['Unica', 'Única'],
  ['util', 'útil'], ['Util', 'Útil'],
  ['publico', 'público'], ['publica', 'pública'],
  ['Publico', 'Público'], ['Publica', 'Pública'],
  ['voce ', 'você '], ['Voce ', 'Você '],
  ['voce.', 'você.'], ['voce,', 'você,'],
  ['voces', 'vocês'], ['Voces', 'Vocês'],
  ['nivel', 'nível'], ['Nivel', 'Nível'],
  ['niveis', 'níveis'],
  ['gratis', 'grátis'], ['Gratis', 'Grátis'],
  ['e necessario', 'é necessário'], ['E necessario', 'É necessário'],
  ['necessario', 'necessário'], ['Necessario', 'Necessário'],
  ['necessaria', 'necessária'],
  ['comecar', 'começar'], ['Comecar', 'Começar'],
  ['comecou', 'começou'], ['comecando', 'começando'],
  ['precos', 'preços'], ['Precos', 'Preços'],
  ['preco', 'preço'], ['Preco', 'Preço'],
  ['servicos', 'serviços'], ['Servicos', 'Serviços'],
  ['servico', 'serviço'], ['Servico', 'Serviço'],
  ['Acoes', 'Ações'],
  ['perdas', 'perdas'],
  ['preferencias', 'preferências'], ['Preferencias', 'Preferências'],
  ['preferencia', 'preferência'],
  ['historia', 'história'],
  ['historico', 'histórico'],
  ['Historico', 'Histórico'],
  ['orgao', 'órgão'], ['Orgao', 'Órgão'],
  ['credito', 'crédito'],
  ['creditos', 'créditos'], ['Creditos', 'Créditos'],
  ['solucao', 'solução'], ['Solucao', 'Solução'],
  ['solucoes', 'soluções'],
  ['atencao', 'atenção'], ['Atencao', 'Atenção'],
  ['Sao ', 'São '], ['sao ', 'são '],
  ['email', 'email'],
  ['Bem-vindo', 'Bem-vindo'],
  ['e gratis', 'é grátis'],
];

function fixPortuguese(text) {
  return applyOnlyToStrings(text, (s) => applyPairs(s, ptPairs));
}

// =====================================================================
// Dutch — generally already correct, just a few fixes
// =====================================================================
const nlPairs = [
  ['enquete', 'enquête'], ['Enquete', 'Enquête'],
  ['cafe', 'café'], ['Cafe', 'Café'],
  ['scene', 'scène'], ['Scene', 'Scène'],
  ['Belgie', 'België'],
  ['blije', 'blije'],
  ['eenduidig', 'eenduidig'],
  ['gegenereerde', 'gegenereerde'],
  ['gespecificeerd', 'gespecificeerd'],
  ['voor uitgevoerd', 'vooruit gevoerd'],
  ['kwaliteit', 'kwaliteit'],
];

function fixDutch(text) {
  return applyOnlyToStrings(text, (s) => applyPairs(s, nlPairs));
}

// =====================================================================
// Polish
// =====================================================================
const plPairs = [
  ['Bedziesz', 'Będziesz'], ['bedziesz', 'będziesz'],
  ['bede', 'będę'],
  ['Sa ', 'Są '], ['sa ', 'są '],
  ['Dziekujemy', 'Dziękujemy'], ['dziekujemy', 'dziękujemy'],
  ['Dziekuje', 'Dziękuję'], ['dziekuje', 'dziękuję'],
  ['Panstwa', 'Państwa'], ['panstwa', 'państwa'],
  ['panstwo', 'państwo'], ['Panstwo', 'Państwo'],
  ['ksiazka', 'książka'],
  ['ksiazke', 'książkę'],
  ['gora', 'góra'], ['Gora', 'Góra'],
  ['Wroc', 'Wróć'],
  ['rozne', 'różne'], ['Rozne', 'Różne'],
  ['rozny', 'różny'], ['Rozny', 'Różny'],
  ['Sprzedaz', 'Sprzedaż'], ['sprzedaz', 'sprzedaż'],
  ['nizej', 'niżej'],
  ['Bledy', 'Błędy'], ['bledy', 'błędy'],
  ['blad', 'błąd'], ['Blad', 'Błąd'],
  ['plikow', 'plików'], ['Plikow', 'Plików'],
  ['Zaplata', 'Zapłata'], ['zaplata', 'zapłata'],
  ['Zaakceptowac', 'Zaakceptować'],
  ['wlasnie', 'właśnie'],
  ['Mozna', 'Można'], ['mozna', 'można'],
  ['narzedzia', 'narzędzia'], ['Narzedzia', 'Narzędzia'],
  ['narzedzie', 'narzędzie'], ['Narzedzie', 'Narzędzie'],
  ['polaczenie', 'połączenie'],
  ['polaczyc', 'połączyć'],
  ['Sprawdz', 'Sprawdź'], ['sprawdz', 'sprawdź'],
  ['nastepnie', 'następnie'],
  ['nastepny', 'następny'],
  ['nastepna', 'następna'],
  ['nastepnej', 'następnej'],
  ['poprawne', 'poprawne'],
  ['szczegoly', 'szczegóły'],
  ['szczegolnie', 'szczególnie'],
  ['rownież', 'również'], ['Rowniez', 'Również'],
  ['rowniez', 'również'],
  ['Wiecej', 'Więcej'], ['wiecej', 'więcej'],
  ['Tworzenie', 'Tworzenie'],
  ['stworzyc', 'stworzyć'],
  ['Otworz', 'Otwórz'], ['otworz', 'otwórz'],
  ['Zarzadzaj', 'Zarządzaj'],
  ['miedzy', 'między'], ['Miedzy', 'Między'],
  ['siecia', 'siecią'],
  ['szybkosc', 'szybkość'], ['Szybkosc', 'Szybkość'],
  ['niskie', 'niskie'],
  ['Wartość', 'Wartość'],
  ['naszej', 'naszej'],
  ['naszym', 'naszym'],
  ['Wymagana', 'Wymagana'],
  ['Wymagane', 'Wymagane'],
  ['ladowanie', 'ładowanie'],
  ['Pobierz', 'Pobierz'],
  ['lacznie', 'łącznie'],
  ['Lacznie', 'Łącznie'],
  ['hasla', 'hasła'], ['Hasla', 'Hasła'],
  ['haslo', 'hasło'], ['Haslo', 'Hasło'],
  ['zostal', 'został'], ['zostala', 'została'],
  ['zostaly', 'zostały'],
  ['Logowanie', 'Logowanie'],
  ['konto', 'konto'],
  ['twoje', 'twoje'],
  ['konwertuj', 'konwertuj'],
  ['Konwertuj', 'Konwertuj'],
  ['zalogowac', 'zalogować'],
  ['niedostepny', 'niedostępny'],
  ['niedostepna', 'niedostępna'],
  ['dostepny', 'dostępny'],
  ['dostepna', 'dostępna'],
  ['rozdzielczosc', 'rozdzielczość'],
  ['Glowne', 'Główne'],
  ['glowny', 'główny'],
  ['Glowny', 'Główny'],
  ['glowna', 'główna'],
  ['ustawien', 'ustawień'],
  ['Ustawienia', 'Ustawienia'],
  ['oszczedzaj', 'oszczędzaj'],
  ['ze ', 'że '],
  ['Ze ', 'Że '],
];

function fixPolish(text) {
  return applyOnlyToStrings(text, (s) => applyPairs(s, plPairs));
}

// =====================================================================
// Swedish
// =====================================================================
const svPairs = [
  ['langd', 'längd'], ['Langd', 'Längd'],
  ['stod', 'stöd'], ['Stod', 'Stöd'],
  ['sa ', 'så '], ['Sa ', 'Så '],
  ['fa ', 'få '], ['Fa ', 'Få '],
  ['far ', 'får '], ['Far ', 'Får '],
  ['ar ', 'är '], ['Ar ', 'Är '],
  ['ar.', 'är.'], ['ar,', 'är,'],
  ['nagra', 'några'], ['Nagra', 'Några'],
  ['nagon', 'någon'], ['Nagon', 'Någon'],
  ['nagot', 'något'], ['Nagot', 'Något'],
  ['fran ', 'från '], ['Fran ', 'Från '],
  ['for ', 'för '], ['For ', 'För '],
  ['for.', 'för.'], ['for,', 'för,'],
  ['over ', 'över '], ['Over ', 'Över '],
  ['hor ', 'hör '],
  ['hogre', 'högre'], ['Hogre', 'Högre'],
  ['ocksa', 'också'], ['Ocksa', 'Också'],
  ['fragor', 'frågor'], ['Fragor', 'Frågor'],
  ['fraga', 'fråga'], ['Fraga', 'Fråga'],
  ['vart ', 'vårt '], ['Vart ', 'Vårt '],
  ['paverkar', 'påverkar'], ['Paverkar', 'Påverkar'],
  ['bade', 'både'], ['Bade', 'Både'],
  ['valj ', 'välj '], ['Valj ', 'Välj '],
  ['valja', 'välja'], ['Valja', 'Välja'],
  ['kallor', 'källor'],
  ['kalla', 'källa'],
  ['halsa', 'hälsa'],
  ['lasa', 'läsa'], ['Lasa', 'Läsa'],
  ['anvanda', 'använda'], ['Anvanda', 'Använda'],
  ['anvandare', 'användare'], ['Anvandare', 'Användare'],
  ['nasta', 'nästa'], ['Nasta', 'Nästa'],
  ['handelse', 'händelse'],
  ['mojligt', 'möjligt'], ['Mojligt', 'Möjligt'],
  ['mojlig', 'möjlig'], ['Mojlig', 'Möjlig'],
  ['Sok ', 'Sök '], ['sok ', 'sök '],
  ['Sok.', 'Sök.'], ['sok.', 'sök.'],
  ['fortfarande', 'fortfarande'],
  ['lattare', 'lättare'], ['Lattare', 'Lättare'],
  ['hander', 'händer'],
  ['halften', 'hälften'],
  ['varje', 'varje'],
  ['undanrojer', 'undanröjer'],
  ['kostnadsfritt', 'kostnadsfritt'],
  ['svaga', 'svaga'],
  ['hjalp', 'hjälp'], ['Hjalp', 'Hjälp'],
  ['Stang', 'Stäng'], ['stang', 'stäng'],
  ['ingang', 'ingång'],
  ['utgang', 'utgång'],
  ['blattre', 'blättre'],
  ['Lankar', 'Länkar'], ['lankar', 'länkar'],
  ['lank', 'länk'], ['Lank', 'Länk'],
  ['anvandnings', 'användnings'],
  ['integritetspolicy', 'integritetspolicy'],
  ['Sakerhet', 'Säkerhet'], ['sakerhet', 'säkerhet'],
  ['saker', 'säker'],
  ['Saker ', 'Säker '],
  ['konton', 'konton'],
  ['lasenord', 'lösenord'], ['Lasenord', 'Lösenord'],
  ['lasenordet', 'lösenordet'],
  ['avsluta', 'avsluta'],
  ['skicka', 'skicka'],
  ['behover', 'behöver'], ['Behover', 'Behöver'],
  ['minst', 'minst'],
  ['maste', 'måste'], ['Maste', 'Måste'],
  ['fardig', 'färdig'],
  ['fardigt', 'färdigt'],
  ['nodvandig', 'nödvändig'], ['Nodvandig', 'Nödvändig'],
  ['standig', 'ständig'],
  ['varlden', 'världen'],
  ['varld', 'värld'],
  ['varlds', 'världs'],
  ['arr ', 'år '],
  ['utford', 'utförd'], ['utfort', 'utfört'],
];

function fixSwedish(text) {
  return applyOnlyToStrings(text, (s) => applyPairs(s, svPairs));
}

// =====================================================================
// Norwegian (Bokmål)
// =====================================================================
const noPairs = [
  ['forst', 'først'], ['Forst', 'Først'],
  ['far ', 'får '], ['Far ', 'Får '],
  ['fa ', 'få '], ['Fa ', 'Få '],
  ['ga ', 'gå '], ['Ga ', 'Gå '],
  ['na ', 'nå '], ['Na ', 'Nå '],
  ['ar ', 'år '], ['Ar ', 'År '],
  ['ogsa', 'også'], ['Ogsa', 'Også'],
  ['Sok ', 'Søk '], ['sok ', 'søk '],
  ['nar ', 'når '], ['Nar ', 'Når '],
  ['mate', 'måte'], ['Mate', 'Måte'],
  ['onsket', 'ønsket'], ['Onsket', 'Ønsket'],
  ['onsker', 'ønsker'], ['Onsker', 'Ønsker'],
  ['onske', 'ønske'], ['Onske', 'Ønske'],
  ['vart', 'vårt'], ['Vart', 'Vårt'],
  ['oye', 'øye'], ['Oye', 'Øye'],
  ['oyeblikk', 'øyeblikk'], ['Oyeblikk', 'Øyeblikk'],
  ['Sporsmal', 'Spørsmål'], ['sporsmal', 'spørsmål'],
  ['stotte', 'støtte'], ['Stotte', 'Støtte'],
  ['storre', 'større'], ['Storre', 'Større'],
  ['storst', 'størst'], ['Storst', 'Størst'],
  ['hopa', 'høpa'],
  ['Pa ', 'På '], ['pa ', 'på '],
  ['Pa.', 'På.'], ['pa.', 'på.'],
  ['lese', 'lese'],
  ['Sma ', 'Små '], ['sma ', 'små '],
  ['fragor', 'spørsmål'], // Swedish leftover; uncommon
  ['Vis ', 'Vis '],
  ['Pris ', 'Pris '],
  ['Glemt', 'Glemt'],
  ['lonn', 'lønn'],
  ['lonnsemd', 'lønnsemd'],
  ['fri ', 'fri '],
  ['velg ', 'velg '],
  ['Sma', 'Små'],
  ['Tilbakebetaling', 'Tilbakebetaling'],
  ['Apne', 'Åpne'], ['apne', 'åpne'],
  ['utgaven', 'utgaven'],
  ['Bekreft', 'Bekreft'],
  ['ledig', 'ledig'],
  ['Hjelpsenter', 'Hjelpesenter'],
  ['nodvendig', 'nødvendig'], ['Nodvendig', 'Nødvendig'],
  ['nokkel', 'nøkkel'], ['Nokkel', 'Nøkkel'],
  ['Tjenesten', 'Tjenesten'],
  ['Aksepter', 'Aksepter'],
  ['Skyll', 'Skyll'],
  ['levert', 'levert'],
  ['fortsett', 'fortsett'],
  ['allt', 'alt'],
  ['skal ', 'skal '],
  ['hor ', 'hør '],
  ['stort', 'stort'],
  ['hverandre', 'hverandre'],
  ['nyhet', 'nyhet'],
];

function fixNorwegian(text) {
  return applyOnlyToStrings(text, (s) => applyPairs(s, noPairs));
}

// =====================================================================
// Smart Functions translations per language
// =====================================================================

const smartTranslations = {
  de: {
    categoryName: 'Intelligente Funktionen',
    categoryDescription: 'KI-gestützte Werkzeuge — OCR, intelligente PDF-Komprimierung und mehr. Neue Funktionen folgen bald.',
    ocr: {
      name: 'OCR (Texterkennung)',
      description: 'Extrahieren Sie Text aus gescannten PDFs oder Bildern (JPG, PNG, TIFF). Liefert eine durchsuchbare PDF oder reine Textdatei.',
    },
    pdfCompress: {
      name: 'PDF mit KI komprimieren',
      description: 'Reduzieren Sie die PDF-Dateigröße bei bestmöglicher Qualität. Ideal für E-Mail-Anhänge.',
    },
    textToSpeech: {
      name: 'Text zu Sprache',
      description: 'Wandeln Sie eingegebenen oder hochgeladenen Text in eine MP3-Audiodatei mit natürlicher Stimme um.',
    },
    speechToText: {
      name: 'Sprache zu Text',
      description: 'Transkribieren Sie Audiodateien (MP3, WAV, M4A) in eine bearbeitbare Textdatei.',
    },
    autoSubtitle: {
      name: 'Automatischer Untertitel-Generator',
      description: 'Erzeugen Sie SRT-Untertitel aus Videodateien (MP4, MOV, AVI) automatisch aus dem Audio.',
    },
    comingSoonTooltips: {
      'document-translation': 'Dokumentenübersetzung kommt bald. Wir arbeiten daran, PDFs und Word-Dokumente in mehrere Sprachen zu übersetzen.',
      'text-to-speech': 'Text zu Sprache kommt bald. Wir arbeiten daran, Text in natürlich klingende MP3-Audiodateien umzuwandeln.',
      'speech-to-text': 'Sprache zu Text kommt bald. Wir arbeiten daran, MP3-, WAV- und M4A-Audio in bearbeitbare Textdateien zu transkribieren.',
      'auto-subtitle': 'Automatischer Untertitel-Generator kommt bald. Wir arbeiten daran, SRT-Untertitel aus MP4-, MOV- und AVI-Videos zu erzeugen.',
    },
  },
  fr: {
    categoryName: 'Fonctions intelligentes',
    categoryDescription: "Outils boostés par l'IA — OCR, compression PDF intelligente et plus. De nouvelles fonctionnalités arrivent bientôt.",
    ocr: {
      name: 'OCR (Reconnaissance de texte)',
      description: "Extrayez le texte de PDF scannés ou d'images (JPG, PNG, TIFF). Renvoie un PDF consultable ou un fichier texte.",
    },
    pdfCompress: {
      name: 'Compresser PDF avec IA',
      description: 'Réduisez la taille du PDF tout en conservant la meilleure qualité possible. Idéal pour les pièces jointes.',
    },
    textToSpeech: {
      name: 'Texte vers parole',
      description: 'Convertissez du texte saisi ou téléchargé en un fichier audio MP3 à voix naturelle.',
    },
    speechToText: {
      name: 'Parole vers texte',
      description: 'Transcrivez des fichiers audio (MP3, WAV, M4A) en un fichier texte modifiable.',
    },
    autoSubtitle: {
      name: 'Générateur de sous-titres auto',
      description: "Générez des sous-titres SRT à partir de fichiers vidéo (MP4, MOV, AVI) automatiquement depuis l'audio.",
    },
    comingSoonTooltips: {
      'document-translation': 'La traduction de documents arrive bientôt. Nous travaillons à la traduction de PDF et documents Word en plusieurs langues.',
      'text-to-speech': 'La synthèse vocale arrive bientôt. Nous travaillons à convertir le texte en MP3 à voix naturelle.',
      'speech-to-text': 'La transcription audio arrive bientôt. Nous travaillons à transcrire MP3, WAV et M4A en fichiers texte modifiables.',
      'auto-subtitle': 'Le générateur de sous-titres arrive bientôt. Nous travaillons à générer des sous-titres SRT depuis MP4, MOV et AVI.',
    },
  },
  es: {
    categoryName: 'Funciones inteligentes',
    categoryDescription: 'Herramientas con IA — OCR, compresión inteligente de PDF y más. Próximamente más funciones.',
    ocr: {
      name: 'OCR (Reconocimiento óptico)',
      description: 'Extraiga texto de PDFs escaneados o imágenes (JPG, PNG, TIFF). Devuelve un PDF buscable o archivo de texto.',
    },
    pdfCompress: {
      name: 'Comprimir PDF con IA',
      description: 'Reduzca el tamaño del PDF manteniendo la mejor calidad posible. Ideal para correo electrónico.',
    },
    textToSpeech: {
      name: 'Texto a voz',
      description: 'Convierta texto escrito o cargado en un archivo de audio MP3 con voz natural.',
    },
    speechToText: {
      name: 'Voz a texto',
      description: 'Transcriba archivos de audio (MP3, WAV, M4A) en un archivo de texto editable.',
    },
    autoSubtitle: {
      name: 'Generador automático de subtítulos',
      description: 'Genere subtítulos SRT a partir de archivos de vídeo (MP4, MOV, AVI) automáticamente desde el audio.',
    },
    comingSoonTooltips: {
      'document-translation': 'La traducción de documentos llega pronto. Estamos añadiendo soporte para traducir PDFs y documentos Word a varios idiomas.',
      'text-to-speech': 'Texto a voz llega pronto. Estamos añadiendo conversión de texto a MP3 con voz natural.',
      'speech-to-text': 'Voz a texto llega pronto. Estamos añadiendo transcripción de MP3, WAV y M4A a archivos de texto editables.',
      'auto-subtitle': 'El generador de subtítulos llega pronto. Estamos añadiendo generación de subtítulos SRT desde vídeos MP4, MOV y AVI.',
    },
  },
  it: {
    categoryName: 'Funzioni intelligenti',
    categoryDescription: "Strumenti basati sull'IA — OCR, compressione PDF intelligente e altro. Nuove funzionalità in arrivo.",
    ocr: {
      name: 'OCR (Riconoscimento testo)',
      description: 'Estrai testo da PDF scansionati o immagini (JPG, PNG, TIFF). Restituisce un PDF ricercabile o file di testo.',
    },
    pdfCompress: {
      name: 'Comprimi PDF con IA',
      description: 'Riduci la dimensione del PDF mantenendo la migliore qualità possibile. Ideale per allegati email.',
    },
    textToSpeech: {
      name: 'Da testo a voce',
      description: 'Converti testo digitato o caricato in un file audio MP3 con voce naturale.',
    },
    speechToText: {
      name: 'Da voce a testo',
      description: 'Trascrivi file audio (MP3, WAV, M4A) in un file di testo modificabile.',
    },
    autoSubtitle: {
      name: 'Generatore di sottotitoli automatico',
      description: "Genera sottotitoli SRT da file video (MP4, MOV, AVI) automaticamente dall'audio.",
    },
    comingSoonTooltips: {
      'document-translation': 'La traduzione di documenti arriva presto. Stiamo lavorando per tradurre PDF e documenti Word in più lingue.',
      'text-to-speech': 'Da testo a voce arriva presto. Stiamo lavorando per convertire testo in MP3 con voce naturale.',
      'speech-to-text': 'Da voce a testo arriva presto. Stiamo lavorando per trascrivere MP3, WAV e M4A in testo modificabile.',
      'auto-subtitle': 'Il generatore di sottotitoli arriva presto. Stiamo lavorando per generare sottotitoli SRT da MP4, MOV e AVI.',
    },
  },
  pt: {
    categoryName: 'Funções inteligentes',
    categoryDescription: 'Ferramentas com IA — OCR, compressão inteligente de PDF e mais. Novas funcionalidades em breve.',
    ocr: {
      name: 'OCR (Reconhecimento de texto)',
      description: 'Extraia texto de PDFs digitalizados ou imagens (JPG, PNG, TIFF). Retorna um PDF pesquisável ou arquivo de texto.',
    },
    pdfCompress: {
      name: 'Comprimir PDF com IA',
      description: 'Reduza o tamanho do PDF mantendo a melhor qualidade possível. Ideal para anexos de email.',
    },
    textToSpeech: {
      name: 'Texto para fala',
      description: 'Converta texto digitado ou enviado num arquivo de áudio MP3 com voz natural.',
    },
    speechToText: {
      name: 'Fala para texto',
      description: 'Transcreva arquivos de áudio (MP3, WAV, M4A) num arquivo de texto editável.',
    },
    autoSubtitle: {
      name: 'Gerador automático de legendas',
      description: 'Gere legendas SRT a partir de arquivos de vídeo (MP4, MOV, AVI) automaticamente do áudio.',
    },
    comingSoonTooltips: {
      'document-translation': 'A tradução de documentos chega em breve. Estamos a adicionar suporte para traduzir PDFs e documentos Word em vários idiomas.',
      'text-to-speech': 'Texto para fala chega em breve. Estamos a converter texto em MP3 com voz natural.',
      'speech-to-text': 'Fala para texto chega em breve. Estamos a transcrever MP3, WAV e M4A em arquivos de texto editáveis.',
      'auto-subtitle': 'O gerador de legendas chega em breve. Estamos a gerar legendas SRT a partir de vídeos MP4, MOV e AVI.',
    },
  },
  nl: {
    categoryName: 'Slimme functies',
    categoryDescription: 'AI-aangedreven hulpmiddelen — OCR, slimme PDF-compressie en meer. Binnenkort nieuwe functies.',
    ocr: {
      name: 'OCR (Tekstherkenning)',
      description: "Extraheer tekst uit gescande PDF's of afbeeldingen (JPG, PNG, TIFF). Geeft een doorzoekbare PDF of tekstbestand terug.",
    },
    pdfCompress: {
      name: 'PDF comprimeren met AI',
      description: 'Verklein de PDF-bestandsgrootte met behoud van de best mogelijke kwaliteit. Ideaal voor e-mailbijlagen.',
    },
    textToSpeech: {
      name: 'Tekst naar spraak',
      description: 'Zet getypte of geüploade tekst om in een MP3-audiobestand met natuurlijke stem.',
    },
    speechToText: {
      name: 'Spraak naar tekst',
      description: 'Transcribeer audiobestanden (MP3, WAV, M4A) naar een bewerkbaar tekstbestand.',
    },
    autoSubtitle: {
      name: 'Automatische ondertitelgenerator',
      description: 'Genereer SRT-ondertitels vanuit videobestanden (MP4, MOV, AVI) automatisch op basis van audio.',
    },
    comingSoonTooltips: {
      'document-translation': "Documentvertaling komt binnenkort. We werken aan het vertalen van PDF's en Word-documenten in meerdere talen.",
      'text-to-speech': 'Tekst naar spraak komt binnenkort. We werken aan het omzetten van tekst naar natuurlijk klinkende MP3-audio.',
      'speech-to-text': 'Spraak naar tekst komt binnenkort. We werken aan het transcriberen van MP3, WAV en M4A naar bewerkbare tekstbestanden.',
      'auto-subtitle': "De ondertitelgenerator komt binnenkort. We werken aan SRT-ondertitels vanuit MP4-, MOV- en AVI-video's.",
    },
  },
  pl: {
    categoryName: 'Funkcje inteligentne',
    categoryDescription: 'Narzędzia oparte na sztucznej inteligencji — OCR, inteligentna kompresja PDF i więcej. Nowe funkcje wkrótce.',
    ocr: {
      name: 'OCR (Rozpoznawanie tekstu)',
      description: 'Wyodrębnij tekst ze zeskanowanych PDF lub obrazów (JPG, PNG, TIFF). Zwraca przeszukiwalny PDF lub plik tekstowy.',
    },
    pdfCompress: {
      name: 'Kompresja PDF z AI',
      description: 'Zmniejsz rozmiar pliku PDF zachowując najlepszą możliwą jakość. Idealne do załączników email.',
    },
    textToSpeech: {
      name: 'Tekst na mowę',
      description: 'Konwertuj wpisany lub przesłany tekst na plik audio MP3 z naturalnym głosem.',
    },
    speechToText: {
      name: 'Mowa na tekst',
      description: 'Transkrybuj pliki audio (MP3, WAV, M4A) na edytowalny plik tekstowy.',
    },
    autoSubtitle: {
      name: 'Automatyczny generator napisów',
      description: 'Generuj napisy SRT z plików wideo (MP4, MOV, AVI) automatycznie z audio.',
    },
    comingSoonTooltips: {
      'document-translation': 'Tłumaczenie dokumentów wkrótce. Pracujemy nad tłumaczeniem PDF i dokumentów Word na wiele języków.',
      'text-to-speech': 'Tekst na mowę wkrótce. Pracujemy nad konwersją tekstu na naturalnie brzmiące audio MP3.',
      'speech-to-text': 'Mowa na tekst wkrótce. Pracujemy nad transkrypcją MP3, WAV i M4A na edytowalne pliki tekstowe.',
      'auto-subtitle': 'Generator napisów wkrótce. Pracujemy nad generowaniem napisów SRT z wideo MP4, MOV i AVI.',
    },
  },
  sv: {
    categoryName: 'Smarta funktioner',
    categoryDescription: 'AI-drivna verktyg — OCR, smart PDF-komprimering och mer. Nya funktioner kommer snart.',
    ocr: {
      name: 'OCR (Textigenkänning)',
      description: 'Extrahera text från skannade PDF eller bilder (JPG, PNG, TIFF). Returnerar en sökbar PDF eller textfil.',
    },
    pdfCompress: {
      name: 'Komprimera PDF med AI',
      description: 'Minska PDF-filens storlek med bibehållen kvalitet. Perfekt för e-postbilagor.',
    },
    textToSpeech: {
      name: 'Text till tal',
      description: 'Konvertera skriven eller uppladdad text till en MP3-ljudfil med naturlig röst.',
    },
    speechToText: {
      name: 'Tal till text',
      description: 'Transkribera ljudfiler (MP3, WAV, M4A) till en redigerbar textfil.',
    },
    autoSubtitle: {
      name: 'Automatisk undertextgenerator',
      description: 'Generera SRT-undertexter från videofiler (MP4, MOV, AVI) automatiskt från ljudet.',
    },
    comingSoonTooltips: {
      'document-translation': 'Dokumentöversättning kommer snart. Vi arbetar med att översätta PDF- och Word-dokument till flera språk.',
      'text-to-speech': 'Text till tal kommer snart. Vi arbetar med att konvertera text till naturligt ljudande MP3.',
      'speech-to-text': 'Tal till text kommer snart. Vi arbetar med att transkribera MP3, WAV och M4A till redigerbara textfiler.',
      'auto-subtitle': 'Undertextgeneratorn kommer snart. Vi arbetar med att generera SRT-undertexter från MP4, MOV och AVI.',
    },
  },
  no: {
    categoryName: 'Smarte funksjoner',
    categoryDescription: 'AI-drevne verktøy — OCR, smart PDF-komprimering og mer. Nye funksjoner kommer snart.',
    ocr: {
      name: 'OCR (Tekstgjenkjenning)',
      description: 'Trekk ut tekst fra skannede PDF-er eller bilder (JPG, PNG, TIFF). Returnerer en søkbar PDF eller tekstfil.',
    },
    pdfCompress: {
      name: 'Komprimer PDF med KI',
      description: 'Reduser PDF-filstørrelsen med best mulig kvalitet. Ideell for e-postvedlegg.',
    },
    textToSpeech: {
      name: 'Tekst til tale',
      description: 'Konverter skrevet eller opplastet tekst til en MP3-lydfil med naturlig stemme.',
    },
    speechToText: {
      name: 'Tale til tekst',
      description: 'Transkriber lydfiler (MP3, WAV, M4A) til en redigerbar tekstfil.',
    },
    autoSubtitle: {
      name: 'Automatisk undertekstgenerator',
      description: 'Generer SRT-undertekster fra videofiler (MP4, MOV, AVI) automatisk fra lyden.',
    },
    comingSoonTooltips: {
      'document-translation': 'Dokumentoversettelse kommer snart. Vi jobber med å oversette PDF- og Word-dokumenter til flere språk.',
      'text-to-speech': 'Tekst til tale kommer snart. Vi jobber med å konvertere tekst til naturlig MP3-lyd.',
      'speech-to-text': 'Tale til tekst kommer snart. Vi jobber med å transkribere MP3, WAV og M4A til redigerbare tekstfiler.',
      'auto-subtitle': 'Undertekstgeneratoren kommer snart. Vi jobber med å lage SRT-undertekster fra MP4, MOV og AVI.',
    },
  },
};

// Insert a new top-level key right before the closing `}` of a language block.
function insertKeysBeforeClose(block, additions) {
  const closeIdx = block.lastIndexOf('}');
  return block.slice(0, closeIdx) + additions + block.slice(closeIdx);
}

function buildAdditions(lang) {
  const t = smartTranslations[lang];
  if (!t) return '';
  const tooltipsObj = Object.entries(t.comingSoonTooltips)
    .map(([k, v]) => `'${k}': ${JSON.stringify(v)}`)
    .join(', ');

  return `\n  smartFunctions: { ` +
    `ocr: { name: ${JSON.stringify(t.ocr.name)}, description: ${JSON.stringify(t.ocr.description)} }, ` +
    `pdfCompress: { name: ${JSON.stringify(t.pdfCompress.name)}, description: ${JSON.stringify(t.pdfCompress.description)} }, ` +
    `textToSpeech: { name: ${JSON.stringify(t.textToSpeech.name)}, description: ${JSON.stringify(t.textToSpeech.description)} }, ` +
    `speechToText: { name: ${JSON.stringify(t.speechToText.name)}, description: ${JSON.stringify(t.speechToText.description)} }, ` +
    `autoSubtitle: { name: ${JSON.stringify(t.autoSubtitle.name)}, description: ${JSON.stringify(t.autoSubtitle.description)} }, ` +
    `documentTranslationComingSoon: ${JSON.stringify(t.comingSoonTooltips['document-translation'])} },\n`;
}

function extendCategoriesInPlace(block, lang) {
  const t = smartTranslations[lang];
  if (!t) return block;
  block = block.replace(
    /(categories:\s*\{[^}]*?Utilities:\s*'[^']*')(\s*\})/,
    `$1, 'Smart Functions': ${JSON.stringify(t.categoryName)}$2`,
  );
  block = block.replace(
    /(categoryDescriptions:\s*\{[^}]*?Utilities:\s*'[^']*')(\s*\})/,
    `$1, 'Smart Functions': ${JSON.stringify(t.categoryDescription)}$2`,
  );
  const tooltipsObj = Object.entries(t.comingSoonTooltips)
    .map(([k, v]) => `'${k}': ${JSON.stringify(v)}`)
    .join(', ');
  block = block.replace(
    /(toolsPage:\s*\{[^{}]*?)(\s*\})/,
    `$1, comingSoon: 'Coming Soon', comingSoonTooltipDefault: 'Coming soon.', comingSoonTooltip: { ${tooltipsObj} }$2`,
  );
  return block;
}

// =====================================================================
// Apply per-language transformations
// =====================================================================

const langFixers = {
  de: fixGerman,
  fr: fixFrench,
  es: fixSpanish,
  it: fixItalian,
  pt: fixPortuguese,
  nl: fixDutch,
  pl: fixPolish,
  sv: fixSwedish,
  no: fixNorwegian,
};

for (const [lang, fixer] of Object.entries(langFixers)) {
  content = fixSection(content, lang, (block) => {
    let out = fixer(block);
    out = extendCategoriesInPlace(out, lang);
    out = insertKeysBeforeClose(out, buildAdditions(lang));
    return out;
  });
  console.log(`✔ Updated ${lang}`);
}

fs.writeFileSync(FILE, content);
console.log(`\nDone. Wrote ${FILE} (${content.length} bytes).`);
