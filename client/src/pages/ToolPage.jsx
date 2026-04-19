import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { api, API_URL } from '../api';
import { getToolBySlug, ADVANCED_SETTINGS } from '../toolsConfig';

function formatToolName(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ToolPage() {
  const { toolName } = useParams();
  const toolDef = getToolBySlug(toolName);
  const formats = toolDef?.outputFormats || ['pdf', 'png', 'jpg'];
  const isPdfTool = !!toolDef?.toolType;
  const isPdfMerge = toolDef?.toolType === 'pdf-merge';
  const extraFields = toolDef?.extraFields || [];
  const advancedFields = ADVANCED_SETTINGS[toolDef?.category] || [];

  // For PDF merge: files are merged into one job
  // For everything else: each file gets its own conversion job (batch)
  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState(formats[0]);
  const [batchJobs, setBatchJobs] = useState([]); // { file, status, jobId, downloadUrl, error }
  const [overallStatus, setOverallStatus] = useState('idle'); // idle | converting | done
  const [error, setError] = useState('');
  const pollRefs = useRef([]);

  // Extra field state
  const [pageRanges, setPageRanges] = useState('');
  const [rotation, setRotation] = useState('90');
  const [password, setPassword] = useState('');

  // Advanced settings state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedValues, setAdvancedValues] = useState({});

  // Cleanup polls on unmount
  useEffect(() => {
    return () => pollRefs.current.forEach((id) => clearInterval(id));
  }, []);

  // Reset state when tool changes
  useEffect(() => {
    pollRefs.current.forEach((id) => clearInterval(id));
    pollRefs.current = [];
    setFiles([]);
    setOutputFormat(formats[0]);
    setBatchJobs([]);
    setOverallStatus('idle');
    setError('');
    setPageRanges('');
    setRotation('90');
    setPassword('');
    setShowAdvanced(false);
    setAdvancedValues({});
  }, [toolName]);

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFiles((prev) => [...prev, ...accepted]);
      setOverallStatus('idle');
      setBatchJobs([]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop,
  });

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateAdvanced(key, value) {
    setAdvancedValues((prev) => ({ ...prev, [key]: value }));
  }

  function buildExtraFormData(formData) {
    if (extraFields.includes('pageRanges') && pageRanges) formData.append('pageRanges', pageRanges);
    if (extraFields.includes('rotation')) formData.append('rotation', rotation);
    if (extraFields.includes('password') && password) formData.append('password', password);
    Object.entries(advancedValues).forEach(([key, val]) => {
      if (val !== '' && val !== undefined && val !== false) formData.append(key, val);
    });
  }

  function pollJob(index, jobId) {
    const intervalId = setInterval(async () => {
      try {
        const res = await api(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error('Failed to check status');
        const job = await res.json();

        if (job.status === 'done') {
          clearInterval(intervalId);
          setBatchJobs((prev) => prev.map((j, i) => i === index ? { ...j, status: 'done', downloadUrl: job.downloadUrl } : j));
        } else if (job.status === 'failed') {
          clearInterval(intervalId);
          setBatchJobs((prev) => prev.map((j, i) => i === index ? { ...j, status: 'failed', error: 'Conversion failed' } : j));
        }
      } catch {
        clearInterval(intervalId);
        setBatchJobs((prev) => prev.map((j, i) => i === index ? { ...j, status: 'failed', error: 'Lost connection' } : j));
      }
    }, 2000);
    pollRefs.current.push(intervalId);
  }

  async function handleConvert() {
    if (files.length === 0) return;
    setError('');
    setOverallStatus('converting');

    if (isPdfTool) {
      // PDF tools: single job with all files
      const jobs = [{ file: isPdfMerge ? `${files.length} files` : files[0].name, status: 'uploading', jobId: null, downloadUrl: null, error: null }];
      setBatchJobs(jobs);

      try {
        const formData = new FormData();
        formData.append('outputFormat', outputFormat);
        formData.append('toolSlug', toolName);
        if (isPdfMerge) {
          files.forEach((f) => formData.append('files', f));
        } else {
          formData.append('files', files[0]);
        }
        buildExtraFormData(formData);

        const res = await api('/api/convert/pdf-tool', { method: 'POST', body: formData });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Upload failed');
        }
        const { jobId } = await res.json();
        setBatchJobs([{ ...jobs[0], status: 'processing', jobId }]);
        pollJob(0, jobId);
      } catch (err) {
        setBatchJobs([{ ...jobs[0], status: 'failed', error: err.message }]);
      }
    } else {
      // Standard conversion: one job per file (batch)
      const jobs = files.map((f) => ({ file: f.name, status: 'uploading', jobId: null, downloadUrl: null, error: null }));
      setBatchJobs(jobs);

      for (let i = 0; i < files.length; i++) {
        try {
          const formData = new FormData();
          formData.append('file', files[i]);
          formData.append('outputFormat', outputFormat);
          formData.append('toolSlug', toolName);
          buildExtraFormData(formData);

          const res = await api('/api/convert', { method: 'POST', body: formData });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || 'Upload failed');
          }
          const { jobId } = await res.json();
          setBatchJobs((prev) => prev.map((j, idx) => idx === i ? { ...j, status: 'processing', jobId } : j));
          pollJob(i, jobId);
        } catch (err) {
          setBatchJobs((prev) => prev.map((j, idx) => idx === i ? { ...j, status: 'failed', error: err.message } : j));
        }
      }
    }
  }

  // Track overall completion
  useEffect(() => {
    if (batchJobs.length === 0) return;
    const allDone = batchJobs.every((j) => j.status === 'done' || j.status === 'failed');
    if (allDone && overallStatus === 'converting') {
      setOverallStatus('done');
    }
  }, [batchJobs]);

  function handleReset() {
    pollRefs.current.forEach((id) => clearInterval(id));
    pollRefs.current = [];
    setFiles([]);
    setBatchJobs([]);
    setOverallStatus('idle');
    setError('');
  }

  const busy = overallStatus === 'converting';
  const hasFiles = files.length > 0;

  return (
    <div className="page">
      <h1>{toolDef?.label || formatToolName(toolName)}</h1>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${hasFiles ? 'dropzone-has-file' : ''}`}
      >
        <input {...getInputProps()} />
        {hasFiles && files.length === 1 && !isPdfMerge ? (
          <div className="dropzone-file">
            <span className="dropzone-filename">{files[0].name}</span>
            <span className="dropzone-filesize">{formatSize(files[0].size)}</span>
          </div>
        ) : isDragActive ? (
          <p>Drop files here...</p>
        ) : (
          <p>Drag & drop files here, or click to browse</p>
        )}
      </div>

      {/* File list (shown when multiple files or PDF merge) */}
      {files.length > 1 && overallStatus === 'idle' && (
        <div className="multi-file-list">
          {files.map((f, i) => (
            <div className="multi-file-item" key={`${f.name}-${i}`}>
              <span className="multi-file-name">{f.name}</span>
              <span className="multi-file-size">{formatSize(f.size)}</span>
              <button className="multi-file-remove" onClick={() => removeFile(i)} type="button">&times;</button>
            </div>
          ))}
          <p className="batch-count">{files.length} files selected</p>
        </div>
      )}

      {/* Batch job progress */}
      {batchJobs.length > 0 && (
        <div className="batch-results">
          {batchJobs.map((job, i) => (
            <div className={`batch-item batch-item-${job.status}`} key={i}>
              <span className="batch-item-name">{job.file}</span>
              <span className="batch-item-status">
                {job.status === 'uploading' && 'Uploading...'}
                {job.status === 'processing' && <><span className="spinner spinner-sm" /> Converting...</>}
                {job.status === 'done' && (
                  <a href={`${API_URL}${job.downloadUrl}`} className="batch-download" download>Download</a>
                )}
                {job.status === 'failed' && <span className="batch-error">{job.error}</span>}
              </span>
            </div>
          ))}
          {overallStatus === 'done' && (
            <div className="batch-done-actions">
              <button className="btn-ghost" onClick={handleReset}>Convert more files</button>
            </div>
          )}
        </div>
      )}

      {error && <p className="convert-error">{error}</p>}

      {overallStatus !== 'done' && batchJobs.length === 0 && (
        <>
          {/* Extra fields for PDF tools */}
          {extraFields.includes('pageRanges') && (
            <div className="extra-field">
              <label htmlFor="pageRanges">Page ranges (e.g. 1-3, 5, 7-10)</label>
              <input id="pageRanges" type="text" value={pageRanges} onChange={(e) => setPageRanges(e.target.value)} disabled={busy} />
            </div>
          )}
          {extraFields.includes('rotation') && (
            <div className="extra-field">
              <label htmlFor="rotation">Rotation</label>
              <select id="rotation" value={rotation} onChange={(e) => setRotation(e.target.value)} disabled={busy}>
                <option value="90">90°</option>
                <option value="180">180°</option>
                <option value="270">270°</option>
              </select>
            </div>
          )}
          {extraFields.includes('password') && (
            <div className="extra-field">
              <label htmlFor="password">{toolDef?.toolType === 'pdf-unlock' ? 'Current password' : 'Set password'}</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} />
            </div>
          )}

          {/* Format selector + Convert button */}
          <div className="tool-controls">
            {formats.length > 1 && (
              <div className="format-select">
                <label htmlFor="format">Output format</label>
                <select id="format" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} disabled={busy}>
                  {formats.map((f) => (
                    <option key={f} value={f}>.{f}</option>
                  ))}
                </select>
              </div>
            )}

            <button className="btn-primary convert-btn" disabled={!hasFiles || busy} onClick={handleConvert}>
              {busy && <span className="spinner" />}
              {busy ? 'Converting...' : files.length > 1 ? `Convert ${files.length} files` : 'Convert'}
            </button>
          </div>

          {/* Advanced settings */}
          {advancedFields.length > 0 && (
            <div className="advanced-section">
              <button className="btn-ghost advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)} type="button">
                {showAdvanced ? 'Hide' : 'Show'} advanced settings
              </button>
              {showAdvanced && (
                <div className="advanced-fields">
                  {advancedFields.map((field) => {
                    if (field.dependsOn && !advancedValues[field.dependsOn]) return null;

                    if (field.type === 'checkbox') {
                      return (
                        <label key={field.key} className="advanced-checkbox">
                          <input type="checkbox" checked={!!advancedValues[field.key]} onChange={(e) => updateAdvanced(field.key, e.target.checked)} disabled={busy} />
                          {field.label}
                        </label>
                      );
                    }
                    if (field.type === 'select') {
                      return (
                        <div key={field.key} className="advanced-field">
                          <label>{field.label}</label>
                          <select value={advancedValues[field.key] || ''} onChange={(e) => updateAdvanced(field.key, e.target.value)} disabled={busy}>
                            <option value="">Default</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    if (field.type === 'number') {
                      return (
                        <div key={field.key} className="advanced-field">
                          <label>{field.label}</label>
                          <input type="number" min={field.min} max={field.max} placeholder={field.placeholder} value={advancedValues[field.key] || ''} onChange={(e) => updateAdvanced(field.key, e.target.value)} disabled={busy} />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
