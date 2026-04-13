import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { api, API_URL } from '../api';

const FORMAT_OPTIONS = {
  'pdf-to-word': ['docx', 'doc', 'txt'],
  'word-to-pdf': ['pdf'],
  'jpg-to-png':  ['png', 'webp', 'bmp'],
  'png-to-jpg':  ['jpg', 'jpeg', 'webp'],
  'webp-to-png': ['png', 'jpg'],
  'svg-to-png':  ['png', 'jpg'],
  'mp4-to-mp3':  ['mp3', 'wav', 'ogg'],
  'mp3-to-wav':  ['wav', 'ogg', 'flac'],
};

function formatToolName(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ToolPage() {
  const { toolName } = useParams();
  const formats = FORMAT_OPTIONS[toolName] || ['pdf', 'png', 'jpg'];
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState(formats[0]);
  const [status, setStatus] = useState('idle'); // idle | uploading | processing | done | failed
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  // Clean up polling on unmount
  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: (accepted) => {
      if (accepted.length > 0) {
        setFile(accepted[0]);
        setStatus('idle');
        setDownloadUrl(null);
        setError('');
      }
    },
  });

  async function handleConvert() {
    if (!file) return;
    setStatus('uploading');
    setError('');
    setDownloadUrl(null);

    try {
      // 1. Upload and start conversion
      const formData = new FormData();
      formData.append('file', file);
      formData.append('outputFormat', outputFormat);

      const res = await api('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      const { jobId } = await res.json();
      setStatus('processing');

      // 2. Poll for completion every 2 seconds
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
    setFile(null);
    setStatus('idle');
    setDownloadUrl(null);
    setError('');
  }

  const busy = status === 'uploading' || status === 'processing';

  return (
    <div className="page">
      <h1>{formatToolName(toolName)}</h1>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${file ? 'dropzone-has-file' : ''}`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="dropzone-file">
            <span className="dropzone-filename">{file.name}</span>
            <span className="dropzone-filesize">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        ) : isDragActive ? (
          <p>Drop it here...</p>
        ) : (
          <p>Drag & drop a file here, or click to browse</p>
        )}
      </div>

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
        <div className="tool-controls">
          <div className="format-select">
            <label htmlFor="format">Output format</label>
            <select
              id="format"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              disabled={busy}
            >
              {formats.map((f) => (
                <option key={f} value={f}>
                  .{f}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-primary convert-btn"
            disabled={!file || busy}
            onClick={handleConvert}
          >
            {busy && <span className="spinner" />}
            {status === 'uploading'
              ? 'Uploading...'
              : status === 'processing'
                ? 'Converting...'
                : 'Convert'}
          </button>
        </div>
      )}
    </div>
  );
}
