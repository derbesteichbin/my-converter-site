import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { useToast } from '../components/Toast';

function CodeBlock({ label, code }) {
  const { t } = useTranslation();
  const toast = useToast();
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span>{label}</span>
        <button className="btn-copy-code" onClick={() => { navigator.clipboard.writeText(code); toast(t('apiDocs.copiedToast'), 'success'); }} type="button">{t('apiDocs.copyBtn')}</button>
      </div>
      <pre className="code-block-body"><code>{code}</code></pre>
    </div>
  );
}

// Sidebar structure. Anchor items use `id` for in-page navigation; tool-link
// items use `slug` to route to the actual conversion tool. Labels are keys
// into the apiDocs.* namespace so the whole sidebar localises.
function buildNavSections(t) {
  return [
    { id: 'docs', title: t('apiDocs.navDocs'), items: [
      { id: 'overview', label: t('apiDocs.navOverview') },
      { id: 'auth', label: t('apiDocs.navAuth') },
      { id: 'endpoints', label: t('apiDocs.navEndpoints') },
      { id: 'examples', label: t('apiDocs.navExamples') },
      { id: 'rate-limits', label: t('apiDocs.navRateLimits') },
    ]},
    { id: 'conversion', title: t('apiDocs.navConversion'), items: [
      { label: t('apiDocs.navFileConversion'), slug: 'pdf-to-word' },
      { label: t('apiDocs.navImageConversion'), slug: 'jpg-to-png' },
      { label: t('apiDocs.navAudioConversion'), slug: 'mp3-to-wav' },
      { label: t('apiDocs.navDocumentConversion'), slug: 'word-to-pdf' },
      { label: t('apiDocs.navPdfConversion'), slug: 'compress-pdf' },
      { label: t('apiDocs.navMp4Conversion'), slug: 'mp4-to-avi' },
      { label: t('apiDocs.navVideoConversion'), slug: 'mov-to-mp4' },
    ]},
    { id: 'specific', title: t('apiDocs.navSpecific'), items: [
      { label: t('apiDocs.navJpgToPdf'), slug: 'jpg-to-png', format: 'pdf' },
      { label: t('apiDocs.navVideoToMp3'), slug: 'mp4-to-mp3' },
      { label: t('apiDocs.navHeicToJpg'), slug: 'heic-to-jpg' },
      { label: t('apiDocs.navPdfToJpg'), slug: 'pdf-to-word', format: 'jpg' },
      { label: t('apiDocs.navWebpToPng'), slug: 'webp-to-png' },
      { label: t('apiDocs.navPdfToWord'), slug: 'pdf-to-word' },
      { label: t('apiDocs.navMp4ToMp3'), slug: 'mp4-to-mp3' },
      { label: t('apiDocs.navWebpToJpg'), slug: 'webp-to-jpg' },
      { label: t('apiDocs.navWordToPdf'), slug: 'word-to-pdf' },
      { label: t('apiDocs.navHtmlToPdf'), slug: 'html-to-pdf' },
      { label: t('apiDocs.navWebsiteScreenshot'), slug: 'html-to-pdf' },
    ]},
    { id: 'compression', title: t('apiDocs.navCompression'), items: [
      { label: t('apiDocs.navVideoCompression'), slug: 'mp4-to-avi' },
      { label: t('apiDocs.navCompressPdf'), slug: 'compress-pdf' },
      { label: t('apiDocs.navImageCompression'), slug: 'jpg-to-png' },
    ]},
  ];
}

export default function ApiDocs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('curl');

  const navSections = buildNavSections(t);

  // Code-example snippets stay in English: programming languages (cURL,
  // JavaScript, Python) are universally written that way, and the code
  // itself is a technical artefact, not UI text.
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
      <SEO title={t('apiDocs.seoTitle')} path="/api-docs" description={t('apiDocs.seoDesc')} />

      {/* Sidebar navigation */}
      <aside className="api-sidebar">
        {navSections.map((section) => (
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
        <h1>{t('apiDocs.pageTitle')}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {t('apiDocs.pageIntro')} <Link to="/dashboard">{t('apiDocs.pageIntroLinkText')}</Link>.
        </p>

        <section className="api-section" id="overview">
          <h2>{t('apiDocs.overviewTitle')}</h2>
          <p>{t('apiDocs.overviewIntro')}</p>
          <ol>
            <li><strong>{t('apiDocs.workflowUpload')}</strong> {t('apiDocs.workflowUploadDesc')}</li>
            <li><strong>{t('apiDocs.workflowPoll')}</strong> {t('apiDocs.workflowPollDesc')}</li>
            <li><strong>{t('apiDocs.workflowDownload')}</strong> {t('apiDocs.workflowDownloadDesc')}</li>
          </ol>
          <p>{t('apiDocs.baseUrl')} <code>https://your-api.railway.app</code></p>
        </section>

        <section className="api-section" id="auth">
          <h2>{t('apiDocs.authTitle')}</h2>
          <p>{t('apiDocs.authBody')}</p>
        </section>

        <section className="api-section" id="endpoints">
          <h2>{t('apiDocs.endpointsTitle')}</h2>
          <div className="api-endpoint"><span className="api-method api-method-post">POST</span><code>/api/convert</code><span className="api-desc">{t('apiDocs.endpointConvert')}</span></div>
          <div className="api-endpoint"><span className="api-method api-method-post">POST</span><code>/api/convert/pdf-tool</code><span className="api-desc">{t('apiDocs.endpointPdfTool')}</span></div>
          <div className="api-endpoint"><span className="api-method api-method-get">GET</span><code>/api/jobs/:id</code><span className="api-desc">{t('apiDocs.endpointJobStatus')}</span></div>
          <div className="api-endpoint"><span className="api-method api-method-get">GET</span><code>/api/jobs</code><span className="api-desc">{t('apiDocs.endpointJobsList')}</span></div>
          <div className="api-endpoint"><span className="api-method api-method-get">GET</span><code>/api/download/:filename</code><span className="api-desc">{t('apiDocs.endpointDownload')}</span></div>
          <div className="api-endpoint"><span className="api-method api-method-post">POST</span><code>/api/download-zip</code><span className="api-desc">{t('apiDocs.endpointDownloadZip')}</span></div>
          <div className="api-endpoint"><span className="api-method api-method-post">POST</span><code>/api/metadata</code><span className="api-desc">{t('apiDocs.endpointMetadata')}</span></div>

          <h3>{t('apiDocs.paramsTitle')}</h3>
          <table className="api-params-table">
            <thead><tr><th>{t('apiDocs.paramField')}</th><th>{t('apiDocs.paramType')}</th><th>{t('apiDocs.paramRequired')}</th><th>{t('apiDocs.paramDescription')}</th></tr></thead>
            <tbody>
              <tr><td><code>file</code></td><td>{t('apiDocs.paramTypeFile')}</td><td>{t('apiDocs.paramYes')}</td><td>{t('apiDocs.paramFileDesc')}</td></tr>
              <tr><td><code>outputFormat</code></td><td>{t('apiDocs.paramTypeString')}</td><td>{t('apiDocs.paramYes')}</td><td>{t('apiDocs.paramOutputFormatDesc')}</td></tr>
              <tr><td><code>toolSlug</code></td><td>{t('apiDocs.paramTypeString')}</td><td>{t('apiDocs.paramYes')}</td><td>{t('apiDocs.paramToolSlugDesc')}</td></tr>
              <tr><td><code>notifyEmail</code></td><td>{t('apiDocs.paramTypeString')}</td><td>{t('apiDocs.paramNo')}</td><td>{t('apiDocs.paramNotifyEmailDesc')}</td></tr>
            </tbody>
          </table>

          <h3>{t('apiDocs.jobResponseTitle')}</h3>
          <table className="api-params-table">
            <thead><tr><th>{t('apiDocs.paramField')}</th><th>{t('apiDocs.paramDescription')}</th></tr></thead>
            <tbody>
              <tr><td><code>id</code></td><td>{t('apiDocs.jobResponseId')}</td></tr>
              <tr><td><code>status</code></td><td>{t('apiDocs.jobResponseStatus')}</td></tr>
              <tr><td><code>downloadUrl</code></td><td>{t('apiDocs.jobResponseDownloadUrl')}</td></tr>
              <tr><td><code>outputSize</code></td><td>{t('apiDocs.jobResponseOutputSize')}</td></tr>
            </tbody>
          </table>
        </section>

        <section className="api-section" id="examples">
          <h2>{t('apiDocs.examplesTitle')}</h2>
          <div className="api-tabs">
            {Object.entries(examples).map(([key, val]) => (
              <button key={key} className={`api-tab ${activeTab === key ? 'api-tab-active' : ''}`} onClick={() => setActiveTab(key)} type="button">{val.label}</button>
            ))}
          </div>
          <h3>{t('apiDocs.exampleStep1')}</h3>
          <CodeBlock label={active.label} code={active.upload} />
          <h3>{t('apiDocs.exampleStep2')}</h3>
          <CodeBlock label={active.label} code={active.status} />
          <h3>{t('apiDocs.exampleStep3')}</h3>
          <CodeBlock label={active.label} code={active.download} />
        </section>

        <section className="api-section" id="rate-limits">
          <h2>{t('apiDocs.rateLimitsTitle')}</h2>
          <table className="api-params-table">
            <thead><tr><th>{t('apiDocs.rateLimitsPlan')}</th><th>{t('apiDocs.rateLimitsLimit')}</th><th>{t('apiDocs.rateLimitsFileSize')}</th></tr></thead>
            <tbody>
              <tr><td>{t('apiDocs.rateLimitsFree')}</td><td>{t('apiDocs.rateLimitsFreeLimit')}</td><td>200 MB</td></tr>
              <tr><td>{t('apiDocs.rateLimitsPayg')}</td><td>{t('apiDocs.rateLimitsPaygLimit')}</td><td>200 MB</td></tr>
              <tr><td>{t('apiDocs.rateLimitsBusiness')}</td><td>{t('apiDocs.rateLimitsBusinessLimit')}</td><td>{t('apiDocs.rateLimitsBusinessSize')}</td></tr>
            </tbody>
          </table>
          <p>{t('apiDocs.rateLimitsNote')}</p>
        </section>

        {/* Conversion API sections */}
        <section className="api-section">
          <h2>{t('apiDocs.availableTitle')}</h2>
          <p>{t('apiDocs.availableIntroPart1')} <code>POST /api/convert</code> {t('apiDocs.availableIntroPart2')} <code>toolSlug</code> {t('apiDocs.availableIntroPart3')}</p>

          <div className="api-tools-grid">
            {navSections.filter((s) => s.id !== 'docs').map((section) => (
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
