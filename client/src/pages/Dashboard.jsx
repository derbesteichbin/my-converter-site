import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, API_URL } from '../api';
import { getToolBySlug } from '../toolsConfig';

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

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [recentTools, setRecentTools] = useState([]);

  useEffect(() => {
    api('/api/jobs')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (Array.isArray(data)) setJobs(data); })
      .catch(() => {});
    setRecentTools(getRecentTools());
  }, []);

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

      <h2>Conversion history</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        {jobs.length} {jobs.length === 1 ? 'conversion' : 'conversions'} total
      </p>

      {jobs.length === 0 ? (
        <p className="empty-state">No conversions yet. Go convert a file!</p>
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
              return (
                <tr key={job.id}>
                  <td className="job-file-cell" title={inputName}>{inputName}</td>
                  <td>{outputExt}</td>
                  <td>{statusBadge(job.status)}</td>
                  <td>{new Date(job.createdAt).toLocaleDateString()} {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    {job.status === 'done' && job.outputFile && (
                      <a href={`${API_URL}/api/download/${job.outputFile}`} className="batch-download" download>
                        Download
                      </a>
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
