import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useToast } from '../components/Toast';

function CodeBlock({ label, code }) {
  const toast = useToast();
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{label}</span>
        <button className="btn-copy-code" onClick={() => { navigator.clipboard.writeText(code); toast('Copied!', 'success'); }} type="button">Copy</button>
      </div>
      <pre className="code-block-body"><code>{code}</code></pre>
    </div>
  );
}

const NAV_SECTIONS = [
  { id: 'docs', title: 'Documentation', items: [
    { id: 'overview', label: 'API Overview' },
    { id: 'auth', label: 'Authentication' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'examples', label: 'Code Examples' },
    { id: 'rate-limits', label: 'Rate Limits' },
  ]},
  { id: 'conversion', title: 'Conversion APIs', items: [
    { label: 'File Conversion API', slug: 'pdf-to-word' },
    { label: 'Image Conversion API', slug: 'jpg-to-png' },
    { label: 'Audio Conversion API', slug: 'mp3-to-wav' },
    { label: 'Document Conversion API', slug: 'word-to-pdf' },
    { label: 'PDF Conversion API', slug: 'compress-pdf' },
    { label: 'MP4 Conversion API', slug: 'mp4-to-avi' },
    { label: 'Video Conversion API', slug: 'mov-to-mp4' },
  ]},
  { id: 'specific', title: 'Specific APIs', items: [
    { label: 'JPG to PDF API', slug: 'jpg-to-png', format: 'pdf' },
    { label: 'Video to MP3 API', slug: 'mp4-to-mp3' },
    { label: 'HEIC to JPG API', slug: 'heic-to-jpg' },
    { label: 'PDF to JPG API', slug: 'pdf-to-word', format: 'jpg' },
    { label: 'WebP to PNG API', slug: 'webp-to-png' },
    { label: 'PDF to Word API', slug: 'pdf-to-word' },
    { label: 'MP4 to MP3 API', slug: 'mp4-to-mp3' },
    { label: 'WebP to JPG API', slug: 'webp-to-jpg' },
    { label: 'Word to PDF API', slug: 'word-to-pdf' },
    { label: 'HTML to PDF API', slug: 'html-to-pdf' },
    { label: 'Website Screenshot API', slug: 'html-to-pdf' },
  ]},
  { id: 'compression', title: 'Compression APIs', items: [
    { label: 'Video Compression API', slug: 'mp4-to-avi' },
    { label: 'Compress PDF API', slug: 'compress-pdf' },
    { label: 'Image Compression API', slug: 'jpg-to-png' },
  ]},
];

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState('curl');

  const examples = {
    curl: {
      label: 'cURL',
      upload: `curl -X POST https://your-api.railway.app/api/convert \\
  -H "Cookie: token=YOUR_JWT_TOKEN" \\
  -F "file=@document.pdf" \\
  -F "outputFormat=docx" \\
  -F "toolSlug=pdf-to-word"`,
      status: `curl https://your-api.railway.app/api/jobs/JOB_ID \\
  -H "Cookie: token=YOUR_JWT_TOKEN"`,
      download: `curl -O https://your-api.railway.app/api/download/FILENAME \\
  -H "Cookie: token=YOUR_JWT_TOKEN"`,
    },
    javascript: {
      label: 'JavaScript',
      upload: `const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('outputFormat', 'docx');
formData.append('toolSlug', 'pdf-to-word');

const res = await fetch('https://your-api.railway.app/api/convert', {
  method: 'POST',
  credentials: 'include',
  body: formData,
});
const { jobId } = await res.json();`,
      status: `const res = await fetch(\`https://your-api.railway.app/api/jobs/\${jobId}\`, {
  credentials: 'include',
});
const job = await res.json();
if (job.status === 'done') {
  console.log('Download:', job.downloadUrl);
}`,
      download: `window.location.href = \`https://your-api.railway.app\${job.downloadUrl}\`;`,
    },
    python: {
      label: 'Python',
      upload: `import requests

url = "https://your-api.railway.app/api/convert"
files = {"file": open("document.pdf", "rb")}
data = {"outputFormat": "docx", "toolSlug": "pdf-to-word"}
cookies = {"token": "YOUR_JWT_TOKEN"}

response = requests.post(url, files=files, data=data, cookies=cookies)
job_id = response.json()["jobId"]`,
      status: `response = requests.get(
    f"https://your-api.railway.app/api/jobs/{job_id}",
    cookies=cookies
)
job = response.json()
if job["status"] == "done":
    print(job["downloadUrl"])`,
      download: `response = requests.get(
    f"https://your-api.railway.app{job['downloadUrl']}",
    cookies=cookies
)
with open("output.docx", "wb") as f:
    f.write(response.content)`,
    },
  };

  const active = examples[activeTab];

  return (
    <div className="api-docs-layout">
      <SEO title="API Documentation" path="/api-docs" description="ConvertAnything REST API documentation. Code examples in cURL, JavaScript, and Python." />

      {/* Sidebar navigation */}
      <aside className="api-sidebar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="api-sidebar-group">
            <h4 className="api-sidebar-title">{section.title}</h4>
            {section.items.map((item) => (
              item.id ? (
                <a key={item.id} href={`#${item.id}`} className="api-sidebar-link">{item.label}</a>
              ) : (
                <Link key={item.label} to={`/tools/${item.slug}`} className="api-sidebar-link">{item.label}</Link>
              )
            ))}
          </div>
        ))}
      </aside>

      {/* Main content */}
      <div className="api-docs-main">
        <h1>API Documentation</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Integrate file conversion into your applications with our REST API. Generate an API key from your <Link to="/dashboard">Dashboard</Link>.
        </p>

        <section className="api-section" id="overview">
          <h2>API Overview</h2>
          <p>The ConvertAnything API allows you to programmatically convert files between 50+ formats. The workflow is simple:</p>
          <ol>
            <li><strong>Upload</strong> a file with your desired output format</li>
            <li><strong>Poll</strong> the job status until it's done</li>
            <li><strong>Download</strong> the converted file</li>
          </ol>
          <p>Base URL: <code>https://your-api.railway.app</code></p>
        </section>

        <section className="api-section" id="auth">
          <h2>Authentication</h2>
          <p>All requests require authentication via a session cookie. Log in through the web interface or pass your JWT token as a cookie header.</p>
        </section>

        <section className="api-section" id="endpoints">
          <h2>Endpoints</h2>
          <div className="api-endpoint"><span className="api-method api-method-post">POST</span><code>/api/convert</code><span className="api-desc">Upload and start conversion</span></div>
          <div className="api-endpoint"><span className="api-method api-method-post">POST</span><code>/api/convert/pdf-tool</code><span className="api-desc">PDF operations (merge, split, compress)</span></div>
          <div className="api-endpoint"><span className="api-method api-method-get">GET</span><code>/api/jobs/:id</code><span className="api-desc">Check job status</span></div>
          <div className="api-endpoint"><span className="api-method api-method-get">GET</span><code>/api/jobs</code><span className="api-desc">List all your jobs</span></div>
          <div className="api-endpoint"><span className="api-method api-method-get">GET</span><code>/api/download/:filename</code><span className="api-desc">Download converted file</span></div>
          <div className="api-endpoint"><span className="api-method api-method-post">POST</span><code>/api/download-zip</code><span className="api-desc">Download multiple files as ZIP</span></div>
          <div className="api-endpoint"><span className="api-method api-method-post">POST</span><code>/api/metadata</code><span className="api-desc">Extract file metadata</span></div>

          <h3>Parameters for POST /api/convert</h3>
          <table className="api-params-table">
            <thead><tr><th>Field</th><th>Type</th><th>Required</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>file</code></td><td>File</td><td>Yes</td><td>The file to convert (multipart form, max 200MB)</td></tr>
              <tr><td><code>outputFormat</code></td><td>String</td><td>Yes</td><td>Target format (e.g. docx, png, mp3)</td></tr>
              <tr><td><code>toolSlug</code></td><td>String</td><td>Yes</td><td>Tool identifier (e.g. pdf-to-word, jpg-to-png)</td></tr>
              <tr><td><code>notifyEmail</code></td><td>String</td><td>No</td><td>Set to "true" to receive email when done</td></tr>
            </tbody>
          </table>

          <h3>Job status response</h3>
          <table className="api-params-table">
            <thead><tr><th>Field</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>id</code></td><td>Job ID</td></tr>
              <tr><td><code>status</code></td><td>pending, processing, done, or failed</td></tr>
              <tr><td><code>downloadUrl</code></td><td>Available when status is "done"</td></tr>
              <tr><td><code>outputSize</code></td><td>Output file size in bytes (when done)</td></tr>
            </tbody>
          </table>
        </section>

        <section className="api-section" id="examples">
          <h2>Code Examples</h2>
          <div className="api-tabs">
            {Object.entries(examples).map(([key, val]) => (
              <button key={key} className={`api-tab ${activeTab === key ? 'api-tab-active' : ''}`} onClick={() => setActiveTab(key)} type="button">{val.label}</button>
            ))}
          </div>
          <h3>1. Upload and convert a file</h3>
          <CodeBlock label={active.label} code={active.upload} />
          <h3>2. Check conversion status</h3>
          <CodeBlock label={active.label} code={active.status} />
          <h3>3. Download the result</h3>
          <CodeBlock label={active.label} code={active.download} />
        </section>

        <section className="api-section" id="rate-limits">
          <h2>Rate Limits</h2>
          <table className="api-params-table">
            <thead><tr><th>Plan</th><th>Limit</th><th>File Size</th></tr></thead>
            <tbody>
              <tr><td>Free</td><td>1 credit (included)</td><td>200 MB</td></tr>
              <tr><td>Pay-as-you-go</td><td>Credits never expire</td><td>200 MB</td></tr>
              <tr><td>Business</td><td>Unlimited</td><td>Custom</td></tr>
            </tbody>
          </table>
          <p>Files are automatically deleted after 24 hours.</p>
        </section>

        {/* Conversion API sections */}
        <section className="api-section">
          <h2>Available Conversion APIs</h2>
          <p>All conversions use the same <code>POST /api/convert</code> endpoint. Set the <code>toolSlug</code> parameter to the desired tool.</p>

          <div className="api-tools-grid">
            {NAV_SECTIONS.filter((s) => s.id !== 'docs').map((section) => (
              <div key={section.id}>
                <h3>{section.title}</h3>
                <div className="api-tools-list">
                  {section.items.map((item) => (
                    <Link key={item.label} to={`/tools/${item.slug}`} className="api-tool-link">
                      <span>{item.label}</span>
                      <code className="api-tool-slug">{item.slug}</code>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
