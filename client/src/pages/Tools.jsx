import { Link } from 'react-router-dom';

const TOOLS = [
  { name: 'pdf-to-word', label: 'PDF to Word', category: 'Document' },
  { name: 'word-to-pdf', label: 'Word to PDF', category: 'Document' },
  { name: 'jpg-to-png', label: 'JPG to PNG', category: 'Image' },
  { name: 'png-to-jpg', label: 'PNG to JPG', category: 'Image' },
  { name: 'webp-to-png', label: 'WebP to PNG', category: 'Image' },
  { name: 'svg-to-png', label: 'SVG to PNG', category: 'Image' },
  { name: 'mp4-to-mp3', label: 'MP4 to MP3', category: 'Audio/Video' },
  { name: 'mp3-to-wav', label: 'MP3 to WAV', category: 'Audio/Video' },
];

const categories = [...new Set(TOOLS.map((t) => t.category))];

export default function Tools() {
  return (
    <div className="page">
      <h1>All conversion tools</h1>

      {categories.map((cat) => (
        <section key={cat} style={{ marginBottom: '2rem' }}>
          <h2>{cat}</h2>
          <div className="tools-grid">
            {TOOLS.filter((t) => t.category === cat).map((t) => (
              <Link to={`/tools/${t.name}`} className="tool-card" key={t.name}>
                <span className="tool-card-label">{t.label}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
