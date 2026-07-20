const { Resend } = require('resend');

const FROM = 'ConvertAnyFormat <noreply@convertanyformat.com>';

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTimestamp(date) {
  const d = date instanceof Date ? date : new Date(date || Date.now());
  return d.toUTCString();
}

function row(label, value) {
  if (value === null || value === undefined || value === '') return '';
  return `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;color:#111827;vertical-align:top">${value}</td></tr>`;
}

function table(rows) {
  return `<table style="border-collapse:collapse;font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;line-height:1.5">${rows.filter(Boolean).join('')}</table>`;
}

function wrapper({ title, intro, body, footer }) {
  return `<!doctype html><html><body style="background:#f7f7f5;margin:0;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7e5e0;border-radius:12px;padding:28px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#111827">
      <h1 style="margin:0 0 8px;font-size:18px">${escapeHtml(title)}</h1>
      ${intro ? `<p style="margin:0 0 16px;color:#6b7280;font-size:14px">${escapeHtml(intro)}</p>` : ''}
      ${body}
      ${footer ? `<p style="margin:20px 0 0;color:#9ca3af;font-size:12px">${escapeHtml(footer)}</p>` : ''}
    </div>
  </body></html>`;
}

async function send({ subject, html }) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) {
    console.log('[notifyOwner] Skipping — RESEND_API_KEY or OWNER_EMAIL missing');
    return;
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM,
      to: process.env.OWNER_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error('[notifyOwner] failed:', err && err.message);
  }
}

async function notifyNewRegistration({ email, method }) {
  const now = new Date();
  const html = wrapper({
    title: 'New user registered',
    intro: 'A new account was just created on ConvertAnyFormat.',
    body: table([
      row('Email', escapeHtml(email)),
      row('Method', escapeHtml(method === 'google' ? 'Google sign-in' : 'Email + password')),
      row('Registered', escapeHtml(formatTimestamp(now))),
    ]),
    footer: 'Automated notification from ConvertAnyFormat.',
  });
  return send({
    subject: `New ${method === 'google' ? 'Google ' : ''}registration: ${email}`,
    html,
  });
}

const PACK_LABELS = {
  pack1: 'Single credit',
  pack10: '10-credit pack',
  pack30: '30-credit pack',
};

async function notifyNewPurchase({ email, pack, amountEuros }) {
  const now = new Date();
  const packLabel = PACK_LABELS[pack] || pack || 'Credit pack';
  const amountStr = typeof amountEuros === 'number' ? `€${amountEuros.toFixed(2)}` : escapeHtml(amountEuros);
  const html = wrapper({
    title: 'New credit pack purchased',
    intro: 'A user just completed a purchase on ConvertAnyFormat.',
    body: table([
      row('Email', escapeHtml(email)),
      row('Pack', escapeHtml(packLabel)),
      row('Amount paid', amountStr),
      row('Date', escapeHtml(formatTimestamp(now))),
    ]),
    footer: 'Automated notification from ConvertAnyFormat.',
  });
  return send({
    subject: `New purchase: ${packLabel} (${amountStr}) — ${email}`,
    html,
  });
}

async function notifyBusinessInquiry({ name, company, email, message }) {
  const html = wrapper({
    title: 'New business plan inquiry',
    intro: 'Someone just submitted the business contact form.',
    body: `${table([
      row('Name', escapeHtml(name)),
      row('Company', escapeHtml(company || '—')),
      row('Email', `<a href="mailto:${escapeHtml(email)}" style="color:#2563eb">${escapeHtml(email)}</a>`),
    ])}<p style="margin:18px 0 6px;color:#6b7280;font-size:13px;font-weight:600">Message</p>
    <div style="background:#f9f6f1;border:1px solid #e7e5e0;border-radius:8px;padding:12px 14px;white-space:pre-wrap;font-size:14px;line-height:1.55;color:#111827">${escapeHtml(message)}</div>`,
    footer: 'Automated notification from ConvertAnyFormat.',
  });
  return send({
    subject: `Business inquiry from ${name}${company ? ` (${company})` : ''}`,
    html,
  });
}

async function notifyNewReview({ email, rating, comment, createdAt }) {
  const stars = '★'.repeat(rating) + '☆'.repeat(Math.max(0, 5 - rating));
  const html = wrapper({
    title: 'New review submitted',
    intro: 'A user just left a review on ConvertAnyFormat.',
    body: `${table([
      row('User', escapeHtml(email)),
      row('Rating', `<span style="color:#f5b301;font-size:16px;letter-spacing:2px">${stars}</span> <span style="color:#6b7280">(${rating}/5)</span>`),
      row('Date', escapeHtml(formatTimestamp(createdAt))),
    ])}${comment ? `<p style="margin:18px 0 6px;color:#6b7280;font-size:13px;font-weight:600">Review</p>
    <div style="background:#f9f6f1;border:1px solid #e7e5e0;border-radius:8px;padding:12px 14px;white-space:pre-wrap;font-size:14px;line-height:1.55;color:#111827">${escapeHtml(comment)}</div>` : '<p style="margin:14px 0 0;color:#9ca3af;font-size:13px;font-style:italic">No comment provided.</p>'}`,
    footer: 'Automated notification from ConvertAnyFormat.',
  });
  return send({
    subject: `New ${rating}★ review from ${email}`,
    html,
  });
}

async function notifyProblemReport({ message, contactEmail, pageUrl, userAgent, userId, userEmail, createdAt }) {
  const html = wrapper({
    title: 'New problem report',
    intro: 'A user just reported a problem on ConvertAnyFormat.',
    body: `${table([
      row('From', userEmail ? escapeHtml(userEmail) : '<span style="color:#9ca3af">Not logged in (guest)</span>'),
      row('Reply-to', contactEmail ? `<a href="mailto:${escapeHtml(contactEmail)}" style="color:#2563eb">${escapeHtml(contactEmail)}</a>` : '<span style="color:#9ca3af">Not provided</span>'),
      row('Page', escapeHtml(pageUrl)),
      row('User ID', userId ? escapeHtml(userId) : '<span style="color:#9ca3af">—</span>'),
      row('Browser', escapeHtml(userAgent)),
      row('Date', escapeHtml(formatTimestamp(createdAt))),
    ])}<p style="margin:18px 0 6px;color:#6b7280;font-size:13px;font-weight:600">Description</p>
    <div style="background:#f9f6f1;border:1px solid #e7e5e0;border-radius:8px;padding:12px 14px;white-space:pre-wrap;font-size:14px;line-height:1.55;color:#111827">${escapeHtml(message)}</div>`,
    footer: 'Automated notification from ConvertAnyFormat.',
  });
  return send({
    subject: 'New problem report on ConvertAnyFormat',
    html,
  });
}

module.exports = {
  notifyNewRegistration,
  notifyNewPurchase,
  notifyBusinessInquiry,
  notifyNewReview,
  notifyProblemReport,
};
