import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { api } from '../api';
import { useToast } from '../components/Toast';

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
