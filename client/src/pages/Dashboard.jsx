import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('/api/jobs', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (Array.isArray(data)) setJobs(data); })
      .catch(() => {});
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>

      {jobs.length === 0 ? (
        <p className="empty-state">No conversions yet. Go convert a file!</p>
      ) : (
        <table className="jobs-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.originalName || job.inputFile}</td>
                <td>{job.status}</td>
                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
