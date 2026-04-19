import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { api, API_URL } from '../api';
import { getToolBySlug, ADVANCED_SETTINGS } from '../toolsConfig';

function formatToolName(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ToolPage() {
  const { toolName } = useParams();
  const toolDef = getToolBySlug(toolName);
  const formats = toolDef?.outputFormats || ['pdf', 'png', 'jpg'];
  const isMultiFile = toolDef?.multipleFiles || false;
  const extraFields = toolDef?.extraFields || [];
  const advancedFields = ADVANCED_SETTINGS[toolDef?.category] || [];

  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState(formats[0]);
  const [status, setStatus] = useState('idle');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  // Extra field state
  const [pageRanges, setPageRanges] = useState('');
  const [rotation, setRotation] = useState('90');
  const [password, setPassword] = useState('');

  // Advanced settings state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedValues, setAdvancedValues] = useState({});

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  // Reset state when tool changes
  useEffect(() => {
    setFiles([]);
    setOutputFormat(formats[0]);
    setStatus('idle');
    setDownloadUrl(null);
    setError('');
    setPageRanges('');
    setRotation('90');
    setPassword('');
    setShowAdvanced(false);
    setAdvancedValues({});
  }, [toolName]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: isMultiFile,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setFiles(isMultiFile ? (prev) => [...prev, ...accepted] : [accepted[0]]);
        setStatus('idle');
        setDownloadUrl(null);
        setError('');
      }
    },
  });

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function updateAdvanced(key, value) {
    setAdvancedValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleConvert() {
    if (files.length === 0) return;
    setStatus('uploading');
    setError('');
    setDownloadUrl(null);

    try {
      const formData = new FormData();
      formData.append('outputFormat', outputFormat);
      formData.append('toolSlug', toolName);

      // Append file(s)
      if (isMultiFile) {
        files.forEach((f) => formData.append('files', f));
      } else {
        formData.append('file', files[0]);
      }

      // Append extra fields
      if (extraFields.includes('pageRanges') && pageRanges) formData.append('pageRanges', pageRanges);
      if (extraFields.includes('rotation')) formData.append('rotation', rotation);
      if (extraFields.includes('password') && password) formData.append('password', password);

      // Append advanced settings
      Object.entries(advancedValues).forEach(([key, val]) => {
        if (val !== '' && val !== undefined && val !== false) formData.append(key, val);
      });

      const endpoint = toolDef?.toolType ? '/api/convert/pdf-tool' : '/api/convert';
      const res = await api(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      const { jobId } = await res.json();
      setStatus('processing');

      pollRef.current = setInterval(async () => {
        try {
          const jobRes = await api(`/api/jobs/${jobId}`);
          if (!jobRes.ok) throw new Error('Failed to check status');

          const job = await jobRes.json();

          if (job.status === 'done') {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setDownloadUrl(job.downloadUrl);
            setStatus('done');
          } else if (job.status === 'failed') {
            clearInterval(pollRef.current);
            pollRef.current = null;
            setStatus('failed');
            setError('Conversion failed. Please try again.');
          }
        } catch {
          clearInterval(pollRef.current);
          pollRef.current = null;
          setStatus('failed');
          setError('Lost connection while checking status.');
        }
      }, 2000);
    } catch (err) {
      setStatus('failed');
      setError(err.message || 'Something went wrong');
    }
  }

  function handleReset() {
    setFiles([]);
    setStatus('idle');
    setDownloadUrl(null);
    setError('');
  }

  const busy = status === 'uploading' || status === 'processing';
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
        {hasFiles && !isMultiFile ? (
          <div className="dropzone-file">
            <span className="dropzone-filename">{files[0].name}</span>
            <span className="dropzone-filesize">{(files[0].size / 1024).toFixed(1)} KB</span>
          </div>
        ) : isDragActive ? (
          <p>Drop {isMultiFile ? 'files' : 'it'} here...</p>
        ) : (
          <p>Drag & drop {isMultiFile ? 'files' : 'a file'} here, or click to browse</p>
        )}
      </div>

      {/* Multi-file list */}
      {isMultiFile && files.length > 0 && (
        <div className="multi-file-list">
          {files.map((f, i) => (
            <div className="multi-file-item" key={`${f.name}-${i}`}>
              <span className="multi-file-name">{f.name}</span>
              <span className="multi-file-size">{(f.size / 1024).toFixed(1)} KB</span>
              <button className="multi-file-remove" onClick={() => removeFile(i)} type="button">&times;</button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="convert-error">{error}</p>}

      {status === 'done' && downloadUrl ? (
        <div className="convert-result">
          <p className="convert-success">Conversion complete!</p>
          <div className="convert-actions">
            <a href={`${API_URL}${downloadUrl}`} className="btn-primary convert-btn" download>
              Download
            </a>
            <button className="btn-ghost" onClick={handleReset}>
              Convert another file
            </button>
          </div>
        </div>
      ) : (
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
              {status === 'uploading' ? 'Uploading...' : status === 'processing' ? 'Converting...' : 'Convert'}
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
