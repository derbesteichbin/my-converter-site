import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import PasswordInput from '../components/PasswordInput';
import { api } from '../api';
import { useToast } from '../components/Toast';

function ChecklistItem({ ok, label }) {
  return (
    <li className={ok ? 'check-pass' : 'check-fail'}>
      <span className="check-icon" aria-hidden="true">
        <svg className="icon-x" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M4 4 L12 12 M12 4 L4 12" />
        </svg>
        <svg className="icon-check" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 8.5 L6.5 11.5 L12.5 5" />
        </svg>
      </span>
      <span>{label}</span>
    </li>
  );
}

export default function Profile() {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Password change
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [sendingResetEmail, setSendingResetEmail] = useState(false);

  const pwdHasMinLength = newPwd.length >= 6;
  const pwdHasUppercase = /[A-Z]/.test(newPwd);
  const pwdHasNumber = /[0-9]/.test(newPwd);
  const pwdHasSpecial = /[!@#$%^&*]/.test(newPwd);
  const pwdIsStrong = pwdHasMinLength && pwdHasUppercase && pwdHasNumber && pwdHasSpecial;
  const pwdsMatch = newPwd === confirmPwd && confirmPwd.length > 0;
  const canSubmitPwd = currentPwd.length > 0 && pwdIsStrong && pwdsMatch && !changingPwd;

  useEffect(() => {
    api('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setDisplayName(data.displayName || '');
      })
      .catch(() => {});
  }, []);

  async function handleSaveName() {
    setSaving(true);
    try {
      const res = await api('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName }),
      });
      if (res.ok) toast(t('profile.profileUpdated'), 'success');
    } catch { toast(t('profile.updateFail'), 'error'); }
    finally { setSaving(false); }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwdError('');

    if (!pwdIsStrong) {
      setPwdError(t('auth.pwWeak'));
      return;
    }
    if (!pwdsMatch) {
      setPwdError(t('auth.pwMismatch'));
      return;
    }

    setChangingPwd(true);
    try {
      const res = await api('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPwdError(data.error || t('profile.changeFailed'));
        return;
      }
      toast(t('profile.passwordChanged'), 'success');
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch {
      setPwdError(t('common.connectError'));
    } finally {
      setChangingPwd(false);
    }
  }

  async function handleSendResetEmail() {
    if (!profile?.email) return;
    setSendingResetEmail(true);
    try {
      const res = await api('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email }),
      });
      if (res.ok) {
        toast(t('profile.resetLinkSent'), 'success');
      } else {
        toast(t('forgot.somethingWrong'), 'error');
      }
    } catch {
      toast(t('common.connectError'), 'error');
    } finally {
      setSendingResetEmail(false);
    }
  }

  async function handleDelete() {
    try {
      const res = await api('/api/profile', { method: 'DELETE' });
      if (res.ok) {
        toast(t('profile.accountDeleted'), 'info');
        navigate('/login');
      }
    } catch { toast(t('profile.deleteFail'), 'error'); }
  }

  if (!profile) return <div className="page"><p>{t('common.loading')}</p></div>;

  return (
    <div className="page">
      <SEO title={t('profile.title')} path="/profile" />
      <h1>{t('profile.title')}</h1>

      <div className="profile-card">
        <div className="profile-field">
          <label>{t('profile.email')}</label>
          <div className="profile-name-row">
            <input type="email" value={newEmail || profile.email} onChange={(e) => setNewEmail(e.target.value)} placeholder={profile.email} />
            <button className="btn-primary" disabled={savingEmail || !newEmail || newEmail === profile.email} onClick={async () => {
              setSavingEmail(true);
              try {
                const res = await api('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newEmail }) });
                if (res.ok) { toast(t('profile.emailUpdated'), 'success'); profile.email = newEmail; }
                else toast(t('profile.emailFail'), 'error');
              } catch { toast(t('profile.errorGeneric'), 'error'); }
              finally { setSavingEmail(false); }
            }} type="button">{savingEmail ? t('profile.updating') : t('profile.update')}</button>
          </div>
        </div>

        <div className="profile-field">
          <label htmlFor="displayName">{t('profile.displayName')}</label>
          <div className="profile-name-row">
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('profile.yourName')}
              aria-label={t('profile.displayName')}
            />
            <button className="btn-primary" onClick={handleSaveName} disabled={saving} type="button">
              {saving ? t('profile.saving') : t('profile.save')}
            </button>
          </div>
        </div>

        <div className="profile-field">
          <label>{t('profile.plan')}</label>
          <p><span className={`status-badge ${profile.plan === 'pro' ? 'badge-done' : 'badge-pending'}`}>{profile.plan.toUpperCase()}</span></p>
        </div>

        <div className="profile-field">
          <label>{t('profile.memberSince')}</label>
          <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="profile-field">
          <label>{t('profile.totalConv')}</label>
          <p>{profile.stats.totalJobs}</p>
        </div>

        {profile.bonusCredits > 0 && (
          <div className="profile-field">
            <label>{t('profile.bonusCreditsLabel')}</label>
            <p>{t('profile.bonusCreditsValue', { count: profile.bonusCredits })}</p>
          </div>
        )}
      </div>

      <div className="profile-card profile-pwd-section" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>{t('profile.changePassword')}</h2>
        <form onSubmit={handleChangePassword} className="pwd-form">
          {pwdError && <p className="auth-error">{pwdError}</p>}

          <div className="pwd-field">
            <label htmlFor="currentPwd">{t('profile.currentPassword')}</label>
            <PasswordInput
              id="currentPwd"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="pwd-field">
            <label htmlFor="newPwd">{t('profile.newPassword')}</label>
            <PasswordInput
              id="newPwd"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              autoComplete="new-password"
            />
            <ul className="password-checklist pwd-checklist-animated">
              <ChecklistItem ok={pwdHasMinLength} label={t('auth.pwMinLength')} />
              <ChecklistItem ok={pwdHasUppercase} label={t('auth.pwUppercase')} />
              <ChecklistItem ok={pwdHasNumber} label={t('auth.pwNumber')} />
              <ChecklistItem ok={pwdHasSpecial} label={t('auth.pwSpecial')} />
            </ul>
          </div>

          <div className="pwd-field">
            <label htmlFor="confirmPwd">{t('profile.confirmNewPassword')}</label>
            <PasswordInput
              id="confirmPwd"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              autoComplete="new-password"
            />
            {confirmPwd.length > 0 && !pwdsMatch && (
              <p className="password-mismatch">{t('auth.pwMismatch')}</p>
            )}
          </div>

          <button className="btn-primary pwd-submit" type="submit" disabled={!canSubmitPwd}>
            {changingPwd ? t('profile.changing') : t('profile.changePassword')}
          </button>
        </form>

        <div className="pwd-reset-block">
          <p>{t('profile.forgotPasswordPrompt')}</p>
          <button
            className="btn-ghost"
            type="button"
            onClick={handleSendResetEmail}
            disabled={sendingResetEmail}
          >
            {sendingResetEmail ? t('forgot.sending') : t('profile.sendResetLink')}
          </button>
        </div>
      </div>

      <div className="profile-danger">
        <h2>{t('profile.dangerZone')}</h2>
        {!confirmDelete ? (
          <button className="btn-danger" onClick={() => setConfirmDelete(true)} type="button">
            {t('profile.deleteBtn')}
          </button>
        ) : (
          <div className="delete-confirm">
            <p>{t('profile.deleteWarn')}</p>
            <div className="delete-confirm-actions">
              <button className="btn-danger" onClick={handleDelete} type="button">{t('profile.deleteYes')}</button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(false)} type="button">{t('profile.cancel')}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
