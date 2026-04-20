import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="page not-found-page">
      <Helmet><title>Page Not Found - ConvertAnything</title></Helmet>
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>

      <div className="not-found-actions">
        <Link to="/" className="btn-primary">Go to Home</Link>
        <Link to="/tools" className="btn-ghost">Browse Tools</Link>
      </div>

      <div className="not-found-popular">
        <h3>Popular tools</h3>
        <div className="not-found-links">
          <Link to="/tools/pdf-to-word">PDF to Word</Link>
          <Link to="/tools/jpg-to-png">JPG to PNG</Link>
          <Link to="/tools/mp4-to-mp3">MP4 to MP3</Link>
          <Link to="/tools/compress-pdf">Compress PDF</Link>
          <Link to="/tools/merge-pdf">Merge PDF</Link>
          <Link to="/tools/heic-to-jpg">HEIC to JPG</Link>
        </div>
      </div>
    </div>
  );
}
