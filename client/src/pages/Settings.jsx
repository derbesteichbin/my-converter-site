import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function Settings() {
  const toast = useToast();
  const [prefs, setPrefs] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api('/api/profile')
      .then((r) => r.json())
      .then((data) => setPrefs({
        notifyConversion: data.notifyConversion,
        notifyWeekly: data.notifyWeekly,
        notifyPromo: data.notifyPromo,
      }))
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await api('/api/profile/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      if (res.ok) toast('Preferences saved', 'success');
    } catch { toast('Failed to save', 'error'); }
    finally { setSaving(false); }
  }

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (!prefs) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <Helmet><title>Notification Settings - Converter</title></Helmet>
      <h1>Notification Settings</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Choose which email notifications you want to receive.
      </p>

      <div className="settings-card">
        <label className="settings-toggle">
          <input type="checkbox" checked={prefs.notifyConversion} onChange={() => toggle('notifyConversion')} />
          <div>
            <strong>Conversion complete</strong>
            <p className="settings-desc">Get notified when your file conversion is done</p>
          </div>
        </label>

        <label className="settings-toggle">
          <input type="checkbox" checked={prefs.notifyWeekly} onChange={() => toggle('notifyWeekly')} />
          <div>
            <strong>Weekly usage summary</strong>
            <p className="settings-desc">Receive a weekly email with your conversion stats</p>
          </div>
        </label>

        <label className="settings-toggle">
          <input type="checkbox" checked={prefs.notifyPromo} onChange={() => toggle('notifyPromo')} />
          <div>
            <strong>Promotional emails</strong>
            <p className="settings-desc">Hear about new features and special offers</p>
          </div>
        </label>

        <button className="btn-primary" onClick={handleSave} disabled={saving} type="button" style={{ marginTop: '1rem' }}>
          {saving ? 'Saving...' : 'Save preferences'}
        </button>
      </div>
    </div>
  );
}
