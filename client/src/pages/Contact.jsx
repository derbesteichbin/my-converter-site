import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function Contact() {
  const { t } = useTranslation();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await api('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        toast(t('contact.sentToast'), 'success');
      } else {
        const data = await res.json();
        toast(data.error || t('contact.sendFail'), 'error');
      }
    } catch { toast(t('common.connectError'), 'error'); }
    finally { setSending(false); }
  }

  return (
    <div className="page">
      <SEO title={t('contact.title')} path="/contact" description={t('contact.seoDesc', { brand: 'ConvertAnyFormat' })} />
      <h1>{t('contact.title')}</h1>
      <p className="page-subtitle">{t('contact.subtitle')}</p>
      <p style={{ color: 'var(--text-muted)', marginTop: '-0.25rem', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        Or email us directly at <a href="mailto:Support@convertanyformat.com">Support@convertanyformat.com</a>.
      </p>

      {sent ? (
        <div className="contact-success">
          <h2>{t('contact.sentTitle')}</h2>
          <p>{t('contact.sentBody')}</p>
        </div>
      ) : (
        <form className="contact-page-form" onSubmit={handleSubmit}>
          <label htmlFor="c-name">{t('contact.name')}</label>
          <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label htmlFor="c-email">{t('contact.email')}</label>
          <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label htmlFor="c-subject">{t('contact.subject')}</label>
          <input id="c-subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <label htmlFor="c-message">{t('contact.message')}</label>
          <textarea id="c-message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn-primary" type="submit" disabled={sending}>{sending ? t('contact.sending') : t('contact.send')}</button>
        </form>
      )}
    </div>
  );
}
