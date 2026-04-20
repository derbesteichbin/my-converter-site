import { useState } from 'react';
import SEO from '../components/SEO';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function Contact() {
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
        toast('Message sent successfully!', 'success');
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to send', 'error');
      }
    } catch { toast('Could not connect to server', 'error'); }
    finally { setSending(false); }
  }

  return (
    <div className="page">
      <SEO title="Contact" path="/contact" description="Get in touch with ConvertAnything. Send us a message for support, feedback, or business inquiries." />
      <h1>Contact Us</h1>
      <p className="page-subtitle">Have a question, feedback, or need help? Send us a message and we'll get back to you.</p>

      {sent ? (
        <div className="contact-success">
          <h2>Message sent!</h2>
          <p>Thank you for reaching out. We'll respond within 24 hours.</p>
        </div>
      ) : (
        <form className="contact-page-form" onSubmit={handleSubmit}>
          <label htmlFor="c-name">Name</label>
          <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label htmlFor="c-email">Email</label>
          <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label htmlFor="c-subject">Subject</label>
          <input id="c-subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <label htmlFor="c-message">Message</label>
          <textarea id="c-message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn-primary" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send message'}</button>
        </form>
      )}
    </div>
  );
}
