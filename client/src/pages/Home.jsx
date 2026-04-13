import { Link } from 'react-router-dom';

const POPULAR_TOOLS = [
  { name: 'pdf-to-word', label: 'PDF to Word' },
  { name: 'jpg-to-png', label: 'JPG to PNG' },
  { name: 'mp4-to-mp3', label: 'MP4 to MP3' },
  { name: 'png-to-jpg', label: 'PNG to JPG' },
];

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Convert any file, instantly</h1>
        <p>Free online file converter. PDF, images, audio, video and more.</p>
        <Link to="/tools" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
          Browse all tools
        </Link>
      </section>

      <section className="popular-tools">
        <h2>Popular tools</h2>
        <div className="tools-grid">
          {POPULAR_TOOLS.map((t) => (
            <Link to={`/tools/${t.name}`} className="tool-card" key={t.name}>
              <span className="tool-card-label">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
