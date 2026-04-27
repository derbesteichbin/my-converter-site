import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function Settings() {
  const { t } = useTranslation();
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
      if (res.ok) toast(t('settings.saved'), 'success');
    } catch { toast(t('settings.saveFail'), 'error'); }
    finally { setSaving(false); }
  }

  function toggle(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (!prefs) return <div className="page"><p>{t('common.loading')}</p></div>;

  return (
    <div className="page">
      <SEO title={t('settings.title')} path="/settings" />
      <h1>{t('settings.title')}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('settings.body')}</p>

      <div className="settings-card">
        <label className="settings-toggle">
          <input type="checkbox" checked={prefs.notifyConversion} onChange={() => toggle('notifyConversion')} />
          <div>
            <strong>{t('settings.convTitle')}</strong>
            <p className="settings-desc">{t('settings.convBody')}</p>
          </div>
        </label>

        <label className="settings-toggle">
          <input type="checkbox" checked={prefs.notifyWeekly} onChange={() => toggle('notifyWeekly')} />
          <div>
            <strong>{t('settings.weeklyTitle')}</strong>
            <p className="settings-desc">{t('settings.weeklyBody')}</p>
          </div>
        </label>

        <label className="settings-toggle">
          <input type="checkbox" checked={prefs.notifyPromo} onChange={() => toggle('notifyPromo')} />
          <div>
            <strong>{t('settings.promoTitle')}</strong>
            <p className="settings-desc">{t('settings.promoBody')}</p>
          </div>
        </label>

        <button className="btn-primary" onClick={handleSave} disabled={saving} type="button" style={{ marginTop: '1rem' }}>
          {saving ? t('settings.saving') : t('settings.savePrefs')}
        </button>
      </div>
    </div>
  );
}
