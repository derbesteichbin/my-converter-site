import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div className="page legal-page">
      <Helmet><title>Terms of Service - ConvertAnything</title></Helmet>
      <h1>Terms of Service</h1>
      <p className="legal-updated">Last updated: April 2026</p>

      <section><h2>1. Overview</h2>
      <p>These Terms of Service ("Terms") govern your use of ConvertAnything ("Service"), operated from Germany. By using the Service, you agree to these Terms. If you do not agree, please do not use the Service.</p></section>

      <section><h2>2. Account Registration</h2>
      <p>To use the conversion tools, you must create an account with a valid email address and password. You are responsible for maintaining the security of your account credentials. You must not share your account or allow unauthorized access.</p></section>

      <section><h2>3. Service Description</h2>
      <p>ConvertAnything provides online file conversion services. We support various file formats including documents, images, video, audio, and archives. Conversions are processed using third-party APIs (CloudConvert). Files are temporarily stored for processing and automatically deleted within 24 hours.</p></section>

      <section><h2>4. Pricing and Payments</h2>
      <p>New accounts receive 1 free conversion credit. Additional credits can be purchased through our pricing page. Payments are processed securely by Stripe. All prices are displayed in Euros (EUR) and include applicable taxes. Credits do not expire.</p></section>

      <section><h2>5. Refund Policy</h2>
      <p>You may request a full refund within 14 days of purchase if you are unsatisfied with the Service. To request a refund, contact us at the email provided on our Contact page. Refunds will be processed to the original payment method within 5-10 business days.</p></section>

      <section><h2>6. File Handling and Deletion</h2>
      <p>Uploaded files are stored temporarily for the sole purpose of conversion. All files (uploaded and converted) are automatically and permanently deleted within 24 hours. We do not access, read, analyze, or share the content of your files.</p></section>

      <section><h2>7. Acceptable Use</h2>
      <p>You agree not to: (a) upload malicious files, viruses, or malware; (b) use the Service for any illegal purpose; (c) attempt to circumvent usage limits or security measures; (d) use automated tools to abuse the Service; (e) upload content that infringes on intellectual property rights of others.</p></section>

      <section><h2>8. Intellectual Property</h2>
      <p>You retain full ownership of all files you upload and convert. We claim no rights over your content. The ConvertAnything name, logo, and website design are our intellectual property.</p></section>

      <section><h2>9. Limitation of Liability</h2>
      <p>The Service is provided "as is" without warranties of any kind. We are not liable for any data loss, conversion errors, or damages arising from the use of the Service. Our total liability is limited to the amount you paid for the Service in the preceding 12 months.</p></section>

      <section><h2>10. Data Protection (GDPR)</h2>
      <p>We process personal data in accordance with the EU General Data Protection Regulation (GDPR). For details on how we collect, use, and protect your data, please see our Privacy Policy. You have the right to access, correct, delete, and export your personal data at any time.</p></section>

      <section><h2>11. Termination</h2>
      <p>You may delete your account at any time from your Profile page. We reserve the right to suspend or terminate accounts that violate these Terms. Upon termination, all associated data is permanently deleted.</p></section>

      <section><h2>12. Changes to Terms</h2>
      <p>We may update these Terms from time to time. Significant changes will be communicated via email or a notice on the website. Continued use of the Service after changes constitutes acceptance.</p></section>

      <section><h2>13. Governing Law</h2>
      <p>These Terms are governed by the laws of the Federal Republic of Germany. Any disputes shall be resolved in the courts of Germany.</p></section>

      <section><h2>14. Contact</h2>
      <p>For questions about these Terms, contact us via our Contact page or at the email address provided there.</p></section>
    </div>
  );
}
