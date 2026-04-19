import { useState } from 'react';
import { useToast } from '../components/Toast';

function CodeBlock({ label, code }) {
  const toast = useToast();
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{label}</span>
        <button className="btn-copy-code" onClick={() => {
          navigator.clipboard.writeText(code);
          toast('Copied!', 'success');
        }} type="button">Copy</button>
      </div>
      <pre className="code-block-body"><code>{code}</code></pre>
    </div>
  );
}

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
const { jobId } = await res.json();
console.log('Job started:', jobId);`,
      status: `const res = await fetch(\`https://your-api.railway.app/api/jobs/\${jobId}\`, {
  credentials: 'include',
});
const job = await res.json();
console.log('Status:', job.status);
if (job.status === 'done') {
  console.log('Download:', job.downloadUrl);
}`,
      download: `// Direct download link
window.location.href = \`https://your-api.railway.app\${job.downloadUrl}\`;`,
    },
    python: {
      label: 'Python',
      upload: `import requests

url = "https://your-api.railway.app/api/convert"
files = {"file": open("document.pdf", "rb")}
data = {"outputFormat": "docx", "toolSlug": "pdf-to-word"}
cookies = {"token": "YOUR_JWT_TOKEN"}

response = requests.post(url, files=files, data=data, cookies=cookies)
job_id = response.json()["jobId"]
print(f"Job started: {job_id}")`,
      status: `import requests

url = f"https://your-api.railway.app/api/jobs/{job_id}"
cookies = {"token": "YOUR_JWT_TOKEN"}

response = requests.get(url, cookies=cookies)
job = response.json()
print(f"Status: {job['status']}")
if job["status"] == "done":
    print(f"Download: {job['downloadUrl']}")`,
      download: `import requests

url = f"https://your-api.railway.app{job['downloadUrl']}"
cookies = {"token": "YOUR_JWT_TOKEN"}

response = requests.get(url, cookies=cookies)
with open("output.docx", "wb") as f:
    f.write(response.content)`,
    },
  };

  const active = examples[activeTab];

  return (
    <div className="page">
      <h1>API Documentation</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Use our REST API to integrate file conversion into your applications.
        Generate an API key from your Dashboard to get started.
      </p>

      <section className="api-section">
        <h2>Authentication</h2>
        <p>All API requests require authentication via a session cookie. Log in through the web interface or pass your JWT token as a cookie.</p>
      </section>

      <section className="api-section">
        <h2>Endpoints</h2>

        <div className="api-endpoint">
          <span className="api-method api-method-post">POST</span>
          <code>/api/convert</code>
          <span className="api-desc">Upload a file and start conversion</span>
        </div>
        <div className="api-endpoint">
          <span className="api-method api-method-get">GET</span>
          <code>/api/jobs/:id</code>
          <span className="api-desc">Check conversion status</span>
        </div>
        <div className="api-endpoint">
          <span className="api-method api-method-get">GET</span>
          <code>/api/download/:filename</code>
          <span className="api-desc">Download converted file</span>
        </div>

        <h3>Parameters for POST /api/convert</h3>
        <table className="api-params-table">
          <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
          <tbody>
            <tr><td><code>file</code></td><td>File</td><td>The file to convert (multipart form)</td></tr>
            <tr><td><code>outputFormat</code></td><td>String</td><td>Target format (e.g. docx, png, mp3)</td></tr>
            <tr><td><code>toolSlug</code></td><td>String</td><td>Tool identifier (e.g. pdf-to-word)</td></tr>
          </tbody>
        </table>
      </section>

      <section className="api-section">
        <h2>Code Examples</h2>
        <div className="api-tabs">
          {Object.entries(examples).map(([key, val]) => (
            <button key={key} className={`api-tab ${activeTab === key ? 'api-tab-active' : ''}`} onClick={() => setActiveTab(key)} type="button">
              {val.label}
            </button>
          ))}
        </div>

        <h3>1. Upload and convert a file</h3>
        <CodeBlock label={active.label} code={active.upload} />

        <h3>2. Check conversion status</h3>
        <CodeBlock label={active.label} code={active.status} />

        <h3>3. Download the result</h3>
        <CodeBlock label={active.label} code={active.download} />
      </section>

      <section className="api-section">
        <h2>Rate Limits</h2>
        <ul>
          <li><strong>Free plan:</strong> 5 conversions per day</li>
          <li><strong>Pro plan:</strong> Unlimited conversions</li>
          <li>Files expire after 24 hours</li>
        </ul>
      </section>
    </div>
  );
}
