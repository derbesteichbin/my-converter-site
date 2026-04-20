import SEO from '../components/SEO';

export default function About() {
  return (
    <div className="page">
      <SEO title="About" path="/about" description="Learn about ConvertAnything, our mission, values, and what makes our file converter different." />
      <h1>About ConvertAnything</h1>

      <section className="about-section">
        <h2>What we do</h2>
        <p>ConvertAnything is a fast, secure, and easy-to-use online file converter. We support over 50 file formats — from documents and images to video, audio, and archives. Whether you need to convert a PDF to Word, compress an image, or extract audio from a video, we've got you covered.</p>
      </section>

      <section className="about-section">
        <h2>Why we built this</h2>
        <p>We were frustrated with existing file converters: slow, cluttered with ads, confusing interfaces, and questionable privacy practices. We built ConvertAnything to be the tool we wished existed — clean, fast, and respectful of your data. No ads, no tracking, no nonsense.</p>
      </section>

      <section className="about-section">
        <h2>What makes us different</h2>
        <ul>
          <li><strong>Privacy first:</strong> Your files are automatically deleted after 24 hours. We never read, store, or share your content.</li>
          <li><strong>50+ formats:</strong> Documents, images, video, audio, archives, and PDF tools — all in one place.</li>
          <li><strong>No installation:</strong> Everything runs in your browser. No software to download or update.</li>
          <li><strong>Batch processing:</strong> Convert multiple files at once. Download them individually or as a ZIP.</li>
          <li><strong>Developer API:</strong> Integrate file conversion into your own apps with our REST API.</li>
          <li><strong>Fair pricing:</strong> Start free, then pay only for what you use. Credits never expire.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Our mission</h2>
        <p>To make file conversion simple, secure, and accessible to everyone. We believe converting a file should take seconds, not minutes — and it should never compromise your privacy.</p>
      </section>

      <section className="about-section">
        <h2>Our values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Privacy</h3>
            <p>Your files are yours. We process them, deliver the result, and delete everything within 24 hours.</p>
          </div>
          <div className="value-card">
            <h3>Simplicity</h3>
            <p>No clutter, no confusion. Upload, choose a format, download. That's it.</p>
          </div>
          <div className="value-card">
            <h3>Transparency</h3>
            <p>Clear pricing, no hidden fees, no surprise charges. You always know what you're paying for.</p>
          </div>
          <div className="value-card">
            <h3>Quality</h3>
            <p>We use industry-leading conversion technology to ensure your files are converted accurately every time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
