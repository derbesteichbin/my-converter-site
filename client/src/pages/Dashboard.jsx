import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, API_URL } from '../api';
import { getToolBySlug } from '../toolsConfig';
import { useToast } from '../components/Toast';
import { EmptyHistory } from '../components/EmptyState';
import { SkeletonTable } from '../components/Skeleton';

function statusBadge(status) {
  const cls = {
    done: 'badge-done',
    pending: 'badge-pending',
    processing: 'badge-processing',
    failed: 'badge-failed',
  }[status] || 'badge-pending';
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

function getRecentTools() {
  try {
    const slugs = JSON.parse(localStorage.getItem('recentTools') || '[]');
    return slugs.map(getToolBySlug).filter(Boolean).slice(0, 3);
  } catch { return []; }
}

function isImageExt(ext) {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'ico', 'tiff'].includes(ext);
}

function guessToolSlug(inputFile, outputFile) {
  const inExt = inputFile?.split('.').pop()?.toLowerCase();
  const outExt = outputFile?.split('.').pop()?.toLowerCase();
  if (!inExt || !outExt) return null;
  return `${inExt}-to-${outExt}`;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [recentTools, setRecentTools] = useState([]);
  const [apiKey, setApiKey] = useState(null);
  const [loadingKey, setLoadingKey] = useState(false);
  const [profile, setProfile] = useState(null);
  const toast = useToast();

  useEffect(() => {
    api('/api/jobs')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (Array.isArray(data)) setJobs(data); })
      .catch(() => {})
      .finally(() => setJobsLoading(false));
    api('/api/auth/api-key')
      .then((r) => r.json())
      .then((data) => setApiKey(data.apiKey))
      .catch(() => {});
    api('/api/profile')
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {});
    setRecentTools(getRecentTools());
  }, []);

  async function generateApiKey() {
    setLoadingKey(true);
    try {
      const res = await api('/api/auth/generate-api-key', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setApiKey(data.apiKey);
        toast('API key generated!', 'success');
      }
    } catch { toast('Failed to generate key', 'error'); }
    finally { setLoadingKey(false); }
  }

  function copyApiKey() {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      toast('API key copied!', 'success');
    }
  }

  const recentDone = jobs.filter((j) => j.status === 'done' && j.outputFile).slice(0, 4);

  return (
    <div className="page">
      <h1>Dashboard</h1>

      {recentTools.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Recently used tools</h2>
          <div className="tools-grid">
            {recentTools.map((t) => (
              <Link to={`/tools/${t.slug}`} className="tool-card" key={t.slug}>
                <span className="tool-card-label">{t.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Usage stats */}
      {profile?.stats && (
        <section className="usage-stats-section">
          <h2>Usage</h2>
          <div className="usage-stats-grid">
            <div className="usage-stat-card">
              <span className="usage-stat-number">{profile.stats.credits}</span>
              <span className="usage-stat-label">Credits remaining</span>
              {profile.stats.credits <= 0 && (
                <Link to="/pricing" className="usage-stat-link">Buy more credits</Link>
              )}
            </div>
            <div className="usage-stat-card">
              <span className="usage-stat-number">{profile.stats.monthlyJobs}</span>
              <span className="usage-stat-label">Conversions this month</span>
            </div>
            <div className="usage-stat-card">
              <span className="usage-stat-number">{profile.stats.totalJobs}</span>
              <span className="usage-stat-label">Total conversions</span>
            </div>
          </div>
        </section>
      )}

      {/* Referral section */}
      {profile?.referralCode && (
        <section className="referral-section">
          <h2>Refer a friend</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            Share your link and get 5 free conversion credits for each friend who signs up.
          </p>
          <div className="referral-link-row">
            <code className="referral-link">{`${window.location.origin}/register?ref=${profile.referralCode}`}</code>
            <button className="btn-ghost" onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/register?ref=${profile.referralCode}`);
              toast('Referral link copied!', 'success');
            }} type="button">Copy</button>
          </div>
          {profile.bonusCredits > 0 && (
            <p className="referral-bonus">You have {profile.bonusCredits} bonus credits from referrals</p>
          )}
        </section>
      )}

      {/* API Key section */}
      <section className="api-key-section">
        <h2>API Access</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
          Use your API key to integrate conversions into your apps. <Link to="/api-docs">View API docs</Link>
        </p>
        {apiKey ? (
          <div className="api-key-display">
            <code className="api-key-value">{apiKey}</code>
            <button className="btn-ghost" onClick={copyApiKey} type="button">Copy</button>
            <button className="btn-ghost" onClick={generateApiKey} disabled={loadingKey} type="button">Regenerate</button>
          </div>
        ) : (
          <button className="btn-primary" onClick={generateApiKey} disabled={loadingKey} type="button">
            {loadingKey ? 'Generating...' : 'Generate API Key'}
          </button>
        )}
      </section>

      {/* Recently converted files */}
      {recentDone.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Recently converted</h2>
          <div className="recent-files-grid">
            {recentDone.map((job) => {
              const outExt = job.outputFile.split('.').pop().toLowerCase();
              return (
                <a
                  key={job.id}
                  href={`${API_URL}/api/download/${job.outputFile}`}
                  className="recent-file-card"
                  download
                >
                  {isImageExt(outExt) ? (
                    <img className="recent-file-thumb" src={`${API_URL}/api/download/${job.outputFile}`} alt="" />
                  ) : (
                    <span className="recent-file-badge">{outExt.toUpperCase()}</span>
                  )}
                  <span className="recent-file-name" title={job.inputFile}>{job.inputFile}</span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Conversion history</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>{jobs.length} {jobs.length === 1 ? 'conversion' : 'conversions'} total</p>
        </div>
        {jobs.length > 0 && (
          <button className="btn-ghost" onClick={() => {
            const rows = [['Date', 'Input File', 'Output Format', 'Status']];
            jobs.forEach((j) => {
              rows.push([new Date(j.createdAt).toISOString(), j.inputFile || '', j.outputFile ? j.outputFile.split('.').pop() : '', j.status]);
            });
            const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'conversion-history.csv';
            a.click();
            toast('CSV downloaded', 'success');
          }} type="button">Export CSV</button>
        )}
      </div>

      {jobsLoading ? (
        <SkeletonTable rows={4} />
      ) : jobs.length === 0 ? (
        <EmptyHistory />
      ) : (
        <table className="jobs-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Output</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const inputName = job.inputFile || '-';
              const outputExt = job.outputFile ? job.outputFile.split('.').pop().toUpperCase() : '-';
              const toolSlug = guessToolSlug(job.inputFile, job.outputFile);
              const toolDef = toolSlug ? getToolBySlug(toolSlug) : null;
              return (
                <tr key={job.id}>
                  <td className="job-file-cell" title={inputName}>{inputName}</td>
                  <td><span className="format-badge">{outputExt}</span></td>
                  <td>{statusBadge(job.status)}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()} {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="job-actions">
                    {job.status === 'done' && job.outputFile && (
                      <a href={`${API_URL}/api/download/${job.outputFile}`} className="batch-download" download>
                        Download
                      </a>
                    )}
                    {toolDef && (
                      <Link to={`/tools/${toolDef.slug}`} className="btn-reconvert" title={`Open ${toolDef.label}`}>
                        Convert again
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
