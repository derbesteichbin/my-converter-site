import SEO from '../components/SEO';

const ENTRIES = [
  { date: '2026-04-20', title: 'PWA Support', desc: 'Install ConvertAnything as an app on your phone or desktop. Added service worker for offline caching.' },
  { date: '2026-04-20', title: 'SEO & Performance', desc: 'Lazy-loaded all pages, added Open Graph tags, JSON-LD schema, and security headers.' },
  { date: '2026-04-20', title: 'Page Transitions & Skeletons', desc: 'Smooth fade animations between pages, skeleton loading screens, and micro hover animations.' },
  { date: '2026-04-19', title: 'Contact, FAQ, About, Legal Pages', desc: 'Added Contact form, FAQ with 12 questions, About page, Terms of Service, and Privacy Policy.' },
  { date: '2026-04-19', title: 'Forgot Password Flow', desc: 'Full password reset via email with secure tokens and password strength validation.' },
  { date: '2026-04-19', title: 'Google OAuth', desc: 'Sign in with Google for faster account creation and login.' },
  { date: '2026-04-19', title: 'Credit-Based Pricing', desc: 'New pricing model with credit packs: 1 for EUR 0.99, 10 for EUR 7.99, 30 for EUR 20.99.' },
  { date: '2026-04-19', title: '27 Languages', desc: 'Interface translated into 27 languages including German, French, Spanish, Chinese, Japanese, Arabic, and more.' },
  { date: '2026-04-19', title: 'Dark Mode Redesign', desc: 'Premium dark theme with glowing gradient cards, frosted glass navbar, and animated background.' },
  { date: '2026-04-19', title: 'Favorites, Search, Command Palette', desc: 'Star your favorite tools, search by name, and use Ctrl+K to quickly navigate.' },
  { date: '2026-04-19', title: 'Batch Processing', desc: 'Convert multiple files at once with per-file progress tracking and ZIP download.' },
  { date: '2026-04-06', title: '51 Conversion Tools', desc: 'Expanded from 8 to 51 tools across Document, Image, Video, Audio, Archive, and PDF categories.' },
  { date: '2026-04-06', title: 'Initial Launch', desc: 'ConvertAnything launched with file conversion, user auth, Stripe billing, and CloudConvert integration.' },
];

export default function Changelog() {
  return (
    <div className="page">
      <SEO title="Changelog" path="/changelog" description="See what's new in ConvertAnything. Latest features, improvements, and updates." />
      <h1>Changelog</h1>
      <p className="page-subtitle">See what's new in ConvertAnything.</p>

      <div className="changelog-list">
        {ENTRIES.map((entry, i) => (
          <div className="changelog-entry" key={i}>
            <span className="changelog-date">{entry.date}</span>
            <div>
              <h3 className="changelog-title">{entry.title}</h3>
              <p className="changelog-desc">{entry.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
