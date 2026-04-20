import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useTranslation } from 'react-i18next';
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
      if (res.ok) toast('Profile updated', 'success');
    } catch { toast('Failed to update', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    try {
      const res = await api('/api/profile', { method: 'DELETE' });
      if (res.ok) {
        toast('Account deleted', 'info');
        navigate('/login');
      }
    } catch { toast('Failed to delete account', 'error'); }
  }

  if (!profile) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <SEO title="Profile" path="/profile" />
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="profile-field">
          <label>Email</label>
          <div className="profile-name-row">
            <input type="email" value={newEmail || profile.email} onChange={(e) => setNewEmail(e.target.value)} placeholder={profile.email} />
            <button className="btn-primary" disabled={savingEmail || !newEmail || newEmail === profile.email} onClick={async () => {
              setSavingEmail(true);
              try {
                const res = await api('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newEmail }) });
                if (res.ok) { toast('Email updated', 'success'); profile.email = newEmail; }
                else toast('Failed to update email', 'error');
              } catch { toast('Error', 'error'); }
              finally { setSavingEmail(false); }
            }} type="button">{savingEmail ? 'Saving...' : 'Update'}</button>
          </div>
        </div>

        <div className="profile-field">
          <label htmlFor="displayName">Display name</label>
          <div className="profile-name-row">
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              aria-label="Display name"
            />
            <button className="btn-primary" onClick={handleSaveName} disabled={saving} type="button">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="profile-field">
          <label>Plan</label>
          <p><span className={`status-badge ${profile.plan === 'pro' ? 'badge-done' : 'badge-pending'}`}>{profile.plan.toUpperCase()}</span></p>
        </div>

        <div className="profile-field">
          <label>Member since</label>
          <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="profile-field">
          <label>Total conversions</label>
          <p>{profile.stats.totalJobs}</p>
        </div>

        {profile.bonusCredits > 0 && (
          <div className="profile-field">
            <label>Bonus credits</label>
            <p>{profile.bonusCredits} extra conversions/day from referrals</p>
          </div>
        )}
      </div>

      <div className="profile-danger">
        <h2>Danger zone</h2>
        {!confirmDelete ? (
          <button className="btn-danger" onClick={() => setConfirmDelete(true)} type="button">
            Delete my account
          </button>
        ) : (
          <div className="delete-confirm">
            <p>This will permanently delete your account and all conversion history. This cannot be undone.</p>
            <div className="delete-confirm-actions">
              <button className="btn-danger" onClick={handleDelete} type="button">Yes, delete my account</button>
              <button className="btn-ghost" onClick={() => setConfirmDelete(false)} type="button">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
