// One-shot: adds the 8 new profile.* keys for the change-password section
// to every non-English language section in client/src/i18n-translations.js.
//
// Run from repo root:  node scripts/add-profile-password-translations.js

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'client', 'src', 'i18n-translations.js');
let content = fs.readFileSync(FILE, 'utf8');

const T = {
  de: {
    changePassword: 'Passwort ändern',
    currentPassword: 'Aktuelles Passwort',
    newPassword: 'Neues Passwort',
    confirmNewPassword: 'Neues Passwort bestätigen',
    changing: 'Ändern...',
    forgotPasswordPrompt: 'Aktuelles Passwort vergessen? Per E-Mail zurücksetzen',
    sendResetLink: 'Reset-Link senden',
    changeFailed: 'Passwort konnte nicht geändert werden',
  },
  fr: {
    changePassword: 'Changer le mot de passe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    confirmNewPassword: 'Confirmer le nouveau mot de passe',
    changing: 'Changement...',
    forgotPasswordPrompt: 'Mot de passe actuel oublié ? Réinitialiser par email',
    sendResetLink: 'Envoyer le lien de réinitialisation',
    changeFailed: 'Échec du changement de mot de passe',
  },
  es: {
    changePassword: 'Cambiar contraseña',
    currentPassword: 'Contraseña actual',
    newPassword: 'Nueva contraseña',
    confirmNewPassword: 'Confirmar nueva contraseña',
    changing: 'Cambiando...',
    forgotPasswordPrompt: '¿Olvidó la contraseña actual? Restablecer por correo',
    sendResetLink: 'Enviar enlace de restablecimiento',
    changeFailed: 'No se pudo cambiar la contraseña',
  },
  it: {
    changePassword: 'Cambia password',
    currentPassword: 'Password attuale',
    newPassword: 'Nuova password',
    confirmNewPassword: 'Conferma nuova password',
    changing: 'Modifica in corso...',
    forgotPasswordPrompt: 'Hai dimenticato la password attuale? Reimposta via email',
    sendResetLink: 'Invia link di reimpostazione',
    changeFailed: 'Impossibile cambiare la password',
  },
  pt: {
    changePassword: 'Alterar palavra-passe',
    currentPassword: 'Palavra-passe atual',
    newPassword: 'Nova palavra-passe',
    confirmNewPassword: 'Confirmar nova palavra-passe',
    changing: 'A alterar...',
    forgotPasswordPrompt: 'Esqueceu a palavra-passe atual? Redefinir por email',
    sendResetLink: 'Enviar link de redefinição',
    changeFailed: 'Não foi possível alterar a palavra-passe',
  },
  nl: {
    changePassword: 'Wachtwoord wijzigen',
    currentPassword: 'Huidig wachtwoord',
    newPassword: 'Nieuw wachtwoord',
    confirmNewPassword: 'Nieuw wachtwoord bevestigen',
    changing: 'Wijzigen...',
    forgotPasswordPrompt: 'Huidig wachtwoord vergeten? Reset via e-mail',
    sendResetLink: 'Reset-link versturen',
    changeFailed: 'Wachtwoord wijzigen mislukt',
  },
  pl: {
    changePassword: 'Zmień hasło',
    currentPassword: 'Aktualne hasło',
    newPassword: 'Nowe hasło',
    confirmNewPassword: 'Potwierdź nowe hasło',
    changing: 'Zmienianie...',
    forgotPasswordPrompt: 'Nie pamiętasz aktualnego hasła? Zresetuj przez email',
    sendResetLink: 'Wyślij link resetujący',
    changeFailed: 'Nie udało się zmienić hasła',
  },
  sv: {
    changePassword: 'Ändra lösenord',
    currentPassword: 'Nuvarande lösenord',
    newPassword: 'Nytt lösenord',
    confirmNewPassword: 'Bekräfta nytt lösenord',
    changing: 'Ändrar...',
    forgotPasswordPrompt: 'Glömt nuvarande lösenord? Återställ via e-post',
    sendResetLink: 'Skicka återställningslänk',
    changeFailed: 'Det gick inte att ändra lösenordet',
  },
  no: {
    changePassword: 'Endre passord',
    currentPassword: 'Nåværende passord',
    newPassword: 'Nytt passord',
    confirmNewPassword: 'Bekreft nytt passord',
    changing: 'Endrer...',
    forgotPasswordPrompt: 'Glemt nåværende passord? Tilbakestill via e-post',
    sendResetLink: 'Send tilbakestillingslenke',
    changeFailed: 'Kunne ikke endre passordet',
  },
};

function findSectionBlock(content, langName) {
  const start = content.indexOf(`const ${langName} = {`);
  if (start === -1) throw new Error(`Section not found: ${langName}`);
  let depth = 0;
  for (let i = start; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
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
  const before = block.slice(0, closeIdx);
  const after = block.slice(closeIdx);
  return before.replace(/\s*$/, '') + ', ' + additions + ' ' + after;
}

for (const [lang, keys] of Object.entries(T)) {
  const [start, end] = findSectionBlock(content, lang);
  let block = content.slice(start, end);
  const additions = Object.entries(keys)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(', ');
  block = appendKeys(block, 'profile', additions);
  content = content.slice(0, start) + block + content.slice(end);
  console.log(`✔ Updated ${lang}`);
}

fs.writeFileSync(FILE, content);
console.log(`\nDone. Wrote ${FILE}`);
