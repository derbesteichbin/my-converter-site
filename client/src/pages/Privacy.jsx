import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <div className="page legal-page">
      <Helmet><title>Privacy Policy - ConvertAnything</title></Helmet>
      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: April 2026</p>

      <section><h2>1. Data Controller</h2>
      <p>ConvertAnything is operated from Germany. We are the data controller responsible for your personal data under the EU General Data Protection Regulation (GDPR).</p></section>

      <section><h2>2. Data We Collect</h2>
      <p><strong>Account data:</strong> Email address, hashed password, display name (optional), and account settings.</p>
      <p><strong>Usage data:</strong> Conversion history (file names, formats, timestamps, status), credit balance, and tool usage statistics.</p>
      <p><strong>Payment data:</strong> Processed by Stripe. We do not store credit card numbers. We receive only transaction confirmations and customer IDs.</p>
      <p><strong>File data:</strong> Files uploaded for conversion are temporarily stored for processing and automatically deleted within 24 hours.</p>
      <p><strong>Technical data:</strong> IP address, browser type, and device information collected automatically for security and performance.</p></section>

      <section><h2>3. How We Use Your Data</h2>
      <p>We use your data to: (a) provide the file conversion service; (b) manage your account and credits; (c) process payments; (d) send transactional emails (conversion complete, password reset); (e) improve the Service; (f) comply with legal obligations.</p></section>

      <section><h2>4. Legal Basis (GDPR Article 6)</h2>
      <p><strong>Contract performance:</strong> Processing your conversions and managing your account.</p>
      <p><strong>Legitimate interest:</strong> Service improvement, security, and fraud prevention.</p>
      <p><strong>Consent:</strong> Marketing emails and analytics cookies (only with your explicit opt-in).</p>
      <p><strong>Legal obligation:</strong> Tax records and compliance with German law.</p></section>

      <section><h2>5. Cookies</h2>
      <p><strong>Essential cookies:</strong> Authentication token, theme preference, language preference. Required for the site to function.</p>
      <p><strong>Analytics cookies:</strong> Used only if you opt in via our cookie consent manager. Help us understand how the site is used.</p>
      <p><strong>Marketing cookies:</strong> Used only if you opt in. For personalized communications.</p>
      <p>You can manage your cookie preferences at any time using the cookie settings icon at the bottom of every page.</p></section>

      <section><h2>6. Data Sharing</h2>
      <p>We share data only with: (a) <strong>CloudConvert</strong> — for file conversion processing; (b) <strong>Stripe</strong> — for payment processing; (c) <strong>Resend</strong> — for transactional emails; (d) <strong>Supabase</strong> — for database hosting. We do not sell your data to third parties.</p></section>

      <section><h2>7. Data Retention</h2>
      <p><strong>Files:</strong> Automatically deleted within 24 hours of upload.</p>
      <p><strong>Account data:</strong> Retained while your account is active. Deleted upon account deletion.</p>
      <p><strong>Payment records:</strong> Retained for 10 years as required by German tax law.</p>
      <p><strong>Server logs:</strong> Retained for 30 days for security purposes.</p></section>

      <section><h2>8. Your Rights (GDPR)</h2>
      <p>You have the right to:</p>
      <ul>
        <li><strong>Access:</strong> Request a copy of your personal data.</li>
        <li><strong>Rectification:</strong> Correct inaccurate data via your Profile page.</li>
        <li><strong>Erasure:</strong> Delete your account and all associated data from your Profile page.</li>
        <li><strong>Data portability:</strong> Export your data in a machine-readable format.</li>
        <li><strong>Restriction:</strong> Request we limit processing of your data.</li>
        <li><strong>Objection:</strong> Object to processing based on legitimate interest.</li>
        <li><strong>Withdraw consent:</strong> Withdraw cookie or email consent at any time.</li>
      </ul>
      <p>To exercise any of these rights, contact us via our Contact page.</p></section>

      <section><h2>9. Data Security</h2>
      <p>We protect your data with: HTTPS encryption for all transfers, bcrypt password hashing, httpOnly session cookies, and secure cloud infrastructure. We regularly review and update our security practices.</p></section>

      <section><h2>10. International Transfers</h2>
      <p>Your data may be processed by third-party services (CloudConvert, Stripe, Supabase) hosted in the EU or countries with adequate data protection as determined by the European Commission.</p></section>

      <section><h2>11. Children's Privacy</h2>
      <p>The Service is not intended for children under 16. We do not knowingly collect data from children.</p></section>

      <section><h2>12. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Significant changes will be communicated via email.</p></section>

      <section><h2>13. Contact and Complaints</h2>
      <p>For data protection inquiries, contact us via our Contact page. You also have the right to lodge a complaint with your local data protection authority.</p></section>
    </div>
  );
}
