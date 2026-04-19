import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLang = (() => {
  try { return localStorage.getItem('lang') || 'en'; }
  catch { return 'en'; }
})();

i18n.use(initReactI18next).init({
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  resources: {
    en: {
      translation: {
        nav: { tools: 'Tools', pricing: 'Pricing', dashboard: 'Dashboard', login: 'Log in', register: 'Register', logout: 'Log out' },
        home: { title: 'Convert any file, instantly', subtitle: 'Free online file converter. PDF, images, audio, video and more.', browse: 'Browse all tools', popular: 'Popular tools', recent: 'Recently used' },
        tools: { title: 'All conversion tools', search: 'Search tools...', favorites: 'Favorites', noFavs: 'No favorites yet', noFavsHint: 'Click the heart on any tool to save it here for quick access', noMatch: 'No tools match' },
        tool: { drop: 'Drag & drop files here, or click to browse', convert: 'Convert', converting: 'Converting...', uploading: 'Uploading...', output: 'Output format', estTime: 'Est. time', estOutput: 'Est. output', emailMe: 'Email me when done', advanced: 'advanced settings', photo: 'Take a photo', expire: 'Files expire in', downloadAll: 'Download All (ZIP)', convertMore: 'Convert more files', done: 'Conversion complete!', share: 'Share' },
        dash: { title: 'Dashboard', recentTools: 'Recently used tools', recentFiles: 'Recently converted', history: 'Conversion history', total: 'total', noJobs: 'No conversions yet. Go convert a file!', apiAccess: 'API Access', apiHint: 'Use your API key to integrate conversions into your apps.', apiDocs: 'View API docs', genKey: 'Generate API Key', regenKey: 'Regenerate', copy: 'Copy', convertAgain: 'Convert again' },
        pricing: { title: 'Pricing', subtitle: 'Simple pricing, no hidden fees.', free: 'Free', pro: 'Pro', getPro: 'Get Pro', getStarted: 'Get started' },
        auth: { login: 'Log in', register: 'Create account', email: 'Email', password: 'Password', loggingIn: 'Logging in...', creating: 'Creating account...', noAccount: "Don't have an account?", hasAccount: 'Already have an account?' },
        cookie: { message: 'We use cookies to improve your experience. By using this site, you agree to our use of cookies.', accept: 'Accept', decline: 'Decline' },
        skip: 'Skip to main content',
      },
    },
    de: {
      translation: {
        nav: { tools: 'Werkzeuge', pricing: 'Preise', dashboard: 'Dashboard', login: 'Anmelden', register: 'Registrieren', logout: 'Abmelden' },
        home: { title: 'Jede Datei sofort konvertieren', subtitle: 'Kostenloser Online-Dateikonverter. PDF, Bilder, Audio, Video und mehr.', browse: 'Alle Werkzeuge', popular: 'Beliebte Werkzeuge', recent: 'Zuletzt verwendet' },
        tools: { title: 'Alle Konvertierungswerkzeuge', search: 'Werkzeuge suchen...', favorites: 'Favoriten', noFavs: 'Noch keine Favoriten', noFavsHint: 'Klicke auf das Herz eines Werkzeugs, um es hier zu speichern', noMatch: 'Keine Werkzeuge gefunden' },
        tool: { drop: 'Dateien hierher ziehen oder klicken', convert: 'Konvertieren', converting: 'Konvertiere...', uploading: 'Hochladen...', output: 'Ausgabeformat', estTime: 'Gesch. Zeit', estOutput: 'Gesch. Ausgabe', emailMe: 'Per E-Mail benachrichtigen', advanced: 'Erweiterte Einstellungen', photo: 'Foto aufnehmen', expire: 'Dateien ablaufen in', downloadAll: 'Alle herunterladen (ZIP)', convertMore: 'Weitere Dateien konvertieren', done: 'Konvertierung abgeschlossen!', share: 'Teilen' },
        dash: { title: 'Dashboard', recentTools: 'Zuletzt verwendete Werkzeuge', recentFiles: 'Zuletzt konvertiert', history: 'Konvertierungsverlauf', total: 'gesamt', noJobs: 'Noch keine Konvertierungen.', apiAccess: 'API-Zugang', apiHint: 'Verwende deinen API-Schlüssel zur Integration.', apiDocs: 'API-Dokumentation', genKey: 'API-Schlüssel generieren', regenKey: 'Neu generieren', copy: 'Kopieren', convertAgain: 'Erneut konvertieren' },
        pricing: { title: 'Preise', subtitle: 'Einfache Preise, keine versteckten Kosten.', free: 'Kostenlos', pro: 'Pro', getPro: 'Pro holen', getStarted: 'Loslegen' },
        auth: { login: 'Anmelden', register: 'Konto erstellen', email: 'E-Mail', password: 'Passwort', loggingIn: 'Anmelden...', creating: 'Konto erstellen...', noAccount: 'Noch kein Konto?', hasAccount: 'Bereits ein Konto?' },
        cookie: { message: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.', accept: 'Akzeptieren', decline: 'Ablehnen' },
        skip: 'Zum Hauptinhalt springen',
      },
    },
    es: {
      translation: {
        nav: { tools: 'Herramientas', pricing: 'Precios', dashboard: 'Panel', login: 'Iniciar sesion', register: 'Registrarse', logout: 'Cerrar sesion' },
        home: { title: 'Convierte cualquier archivo al instante', subtitle: 'Convertidor de archivos online gratuito. PDF, imagenes, audio, video y mas.', browse: 'Ver todas las herramientas', popular: 'Herramientas populares', recent: 'Usadas recientemente' },
        tools: { title: 'Todas las herramientas', search: 'Buscar herramientas...', favorites: 'Favoritos', noFavs: 'Sin favoritos', noFavsHint: 'Haz clic en el corazon de una herramienta para guardarla aqui', noMatch: 'No se encontraron herramientas' },
        tool: { drop: 'Arrastra archivos aqui o haz clic para buscar', convert: 'Convertir', converting: 'Convirtiendo...', uploading: 'Subiendo...', output: 'Formato de salida', estTime: 'Tiempo est.', estOutput: 'Salida est.', emailMe: 'Notificarme por email', advanced: 'Configuracion avanzada', photo: 'Tomar foto', expire: 'Los archivos expiran en', downloadAll: 'Descargar todo (ZIP)', convertMore: 'Convertir mas archivos', done: 'Conversion completada!', share: 'Compartir' },
        dash: { title: 'Panel', recentTools: 'Herramientas recientes', recentFiles: 'Archivos recientes', history: 'Historial de conversiones', total: 'total', noJobs: 'Sin conversiones aun.', apiAccess: 'Acceso API', apiHint: 'Usa tu clave API para integrar conversiones.', apiDocs: 'Ver documentacion', genKey: 'Generar clave API', regenKey: 'Regenerar', copy: 'Copiar', convertAgain: 'Convertir de nuevo' },
        pricing: { title: 'Precios', subtitle: 'Precios simples, sin cargos ocultos.', free: 'Gratis', pro: 'Pro', getPro: 'Obtener Pro', getStarted: 'Comenzar' },
        auth: { login: 'Iniciar sesion', register: 'Crear cuenta', email: 'Correo', password: 'Contrasena', loggingIn: 'Iniciando...', creating: 'Creando cuenta...', noAccount: 'No tienes cuenta?', hasAccount: 'Ya tienes cuenta?' },
        cookie: { message: 'Usamos cookies para mejorar tu experiencia.', accept: 'Aceptar', decline: 'Rechazar' },
        skip: 'Ir al contenido principal',
      },
    },
    fr: {
      translation: {
        nav: { tools: 'Outils', pricing: 'Tarifs', dashboard: 'Tableau de bord', login: 'Connexion', register: "S'inscrire", logout: 'Deconnexion' },
        home: { title: 'Convertissez tout fichier instantanement', subtitle: 'Convertisseur en ligne gratuit. PDF, images, audio, video et plus.', browse: 'Tous les outils', popular: 'Outils populaires', recent: 'Utilises recemment' },
        tools: { title: 'Tous les outils', search: 'Rechercher...', favorites: 'Favoris', noFavs: 'Pas de favoris', noFavsHint: 'Cliquez sur le coeur pour sauvegarder un outil ici', noMatch: 'Aucun outil trouve' },
        tool: { drop: 'Glissez des fichiers ici ou cliquez pour parcourir', convert: 'Convertir', converting: 'Conversion...', uploading: 'Envoi...', output: 'Format de sortie', estTime: 'Temps est.', estOutput: 'Sortie est.', emailMe: 'Me notifier par email', advanced: 'Parametres avances', photo: 'Prendre une photo', expire: 'Fichiers expirent dans', downloadAll: 'Tout telecharger (ZIP)', convertMore: 'Convertir plus de fichiers', done: 'Conversion terminee !', share: 'Partager' },
        dash: { title: 'Tableau de bord', recentTools: 'Outils recents', recentFiles: 'Fichiers recents', history: 'Historique', total: 'total', noJobs: 'Aucune conversion.', apiAccess: 'Acces API', apiHint: 'Utilisez votre cle API pour integrer les conversions.', apiDocs: 'Voir la documentation', genKey: 'Generer une cle API', regenKey: 'Regenerer', copy: 'Copier', convertAgain: 'Reconvertir' },
        pricing: { title: 'Tarifs', subtitle: 'Tarification simple, sans frais caches.', free: 'Gratuit', pro: 'Pro', getPro: 'Obtenir Pro', getStarted: 'Commencer' },
        auth: { login: 'Connexion', register: 'Creer un compte', email: 'Email', password: 'Mot de passe', loggingIn: 'Connexion...', creating: 'Creation...', noAccount: 'Pas de compte ?', hasAccount: 'Deja un compte ?' },
        cookie: { message: 'Nous utilisons des cookies pour ameliorer votre experience.', accept: 'Accepter', decline: 'Refuser' },
        skip: 'Aller au contenu principal',
      },
    },
    it: {
      translation: {
        nav: { tools: 'Strumenti', pricing: 'Prezzi', dashboard: 'Dashboard', login: 'Accedi', register: 'Registrati', logout: 'Esci' },
        home: { title: 'Converti qualsiasi file, istantaneamente', subtitle: 'Convertitore online gratuito. PDF, immagini, audio, video e altro.', browse: 'Tutti gli strumenti', popular: 'Strumenti popolari', recent: 'Usati di recente' },
        tools: { title: 'Tutti gli strumenti', search: 'Cerca strumenti...', favorites: 'Preferiti', noFavs: 'Nessun preferito', noFavsHint: 'Clicca sul cuore per salvare uno strumento qui', noMatch: 'Nessuno strumento trovato' },
        tool: { drop: 'Trascina i file qui o clicca per sfogliare', convert: 'Converti', converting: 'Conversione...', uploading: 'Caricamento...', output: 'Formato di uscita', estTime: 'Tempo stimato', estOutput: 'Uscita stimata', emailMe: 'Avvisami via email', advanced: 'Impostazioni avanzate', photo: 'Scatta una foto', expire: 'I file scadono tra', downloadAll: 'Scarica tutto (ZIP)', convertMore: 'Converti altri file', done: 'Conversione completata!', share: 'Condividi' },
        dash: { title: 'Dashboard', recentTools: 'Strumenti recenti', recentFiles: 'File recenti', history: 'Cronologia conversioni', total: 'totale', noJobs: 'Nessuna conversione.', apiAccess: 'Accesso API', apiHint: 'Usa la tua chiave API per integrare le conversioni.', apiDocs: 'Vedi documentazione', genKey: 'Genera chiave API', regenKey: 'Rigenera', copy: 'Copia', convertAgain: 'Converti di nuovo' },
        pricing: { title: 'Prezzi', subtitle: 'Prezzi semplici, nessun costo nascosto.', free: 'Gratuito', pro: 'Pro', getPro: 'Ottieni Pro', getStarted: 'Inizia' },
        auth: { login: 'Accedi', register: 'Crea account', email: 'Email', password: 'Password', loggingIn: 'Accesso...', creating: 'Creazione...', noAccount: 'Non hai un account?', hasAccount: 'Hai gia un account?' },
        cookie: { message: 'Utilizziamo i cookie per migliorare la tua esperienza.', accept: 'Accetta', decline: 'Rifiuta' },
        skip: 'Vai al contenuto principale',
      },
    },
  },
});

export default i18n;
