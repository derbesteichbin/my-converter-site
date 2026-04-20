import { useState } from 'react';
import SEO from '../components/SEO';

const FAQS = [
  { q: 'What file formats are supported?', a: 'We support over 50 file formats including PDF, Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, WebP, HEIC, SVG, MP4, AVI, MOV, MKV, MP3, WAV, FLAC, AAC, ZIP, RAR, 7Z, and many more. New formats are added regularly.' },
  { q: 'How long are my files stored?', a: 'All uploaded and converted files are automatically deleted after 24 hours. We do not keep any copies of your files beyond this period. You can download your converted files immediately after conversion.' },
  { q: 'Is ConvertAnything free to use?', a: 'New users get 1 free conversion credit. After that, you can purchase credit packs starting at just \u20AC0.99 for a single conversion, \u20AC7.99 for 10 conversions, or \u20AC20.99 for 30 conversions. Credits never expire.' },
  { q: 'How does the credit system work?', a: 'Each file conversion uses 1 credit. When you purchase a credit pack, the credits are added to your account instantly. You can use them anytime \u2014 they never expire. Check your remaining credits on your Dashboard.' },
  { q: 'Is my data secure?', a: 'Yes. All file transfers use HTTPS encryption. Files are processed on secure servers and automatically deleted after 24 hours. We never access, read, or share your file contents. Your data is your data.' },
  { q: 'What is the maximum file size?', a: 'You can upload files up to 200 MB per file. For larger files, consider compressing them first or contact us about our Business plan which supports larger files.' },
  { q: 'How fast are conversions?', a: 'Most conversions complete in seconds. Larger files or complex formats (like video) may take up to a few minutes. You\'ll see a progress bar and estimated time during conversion.' },
  { q: 'Can I convert multiple files at once?', a: 'Yes! You can drag and drop multiple files at once on any tool page. Each file is converted independently, and you can download them individually or all together as a ZIP archive.' },
  { q: 'Do I need to create an account?', a: 'Yes, a free account is required to use the conversion tools. This helps us track your credits and conversion history. You can sign up with email or Google in seconds.' },
  { q: 'How do I get a refund?', a: 'If you experience any issues with your conversion credits, contact us within 14 days of purchase and we\'ll provide a full refund. We want you to be completely satisfied with our service.' },
  { q: 'Can I use the API to convert files programmatically?', a: 'Yes! We offer a REST API for developers. Generate an API key from your Dashboard and check our API documentation page for code examples in JavaScript, Python, and cURL.' },
  { q: 'What happens if a conversion fails?', a: 'If a conversion fails, your credit is not deducted. You\'ll see an error message with details. You can try again or contact us if the issue persists.' },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="page">
      <SEO title="FAQ" path="/faq" description="Frequently asked questions about ConvertAnything. Formats, pricing, security, file limits, and more." />
      <h1>Frequently Asked Questions</h1>
      <p className="page-subtitle">Find answers to common questions about ConvertAnything.</p>

      <div className="faq-list">
        {FAQS.map((faq, i) => (
          <div className={`faq-item ${openIndex === i ? 'faq-open' : ''}`} key={i}>
            <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)} type="button" aria-expanded={openIndex === i}>
              <span>{faq.q}</span>
              <span className="faq-arrow">{openIndex === i ? '\u2212' : '\u002B'}</span>
            </button>
            {openIndex === i && <p className="faq-answer">{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
