import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../api';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

const LABEL_MAP = {
  fileName: 'File Name',
  fileSize: 'File Size',
  format: 'Format',
  mimeType: 'MIME Type',
  lastModified: 'Last Modified',
  pageCount: 'Pages',
  pageWidth: 'Page Width (pt)',
  pageHeight: 'Page Height (pt)',
  title: 'Title',
  author: 'Author',
  subject: 'Subject',
  creator: 'Creator',
  producer: 'Producer',
  creationDate: 'Creation Date',
  modificationDate: 'Modification Date',
  width: 'Width (px)',
  height: 'Height (px)',
  cameraMake: 'Camera Make',
  cameraModel: 'Camera Model',
  dateTaken: 'Date Taken',
  iso: 'ISO',
  focalLength: 'Focal Length',
  exposureTime: 'Exposure Time',
  aperture: 'Aperture',
  gpsLatitude: 'GPS Latitude',
  gpsLongitude: 'GPS Longitude',
  colorSpace: 'Color Space',
  bitDepth: 'Bit Depth',
  mediaType: 'Media Type',
  duration: 'Duration',
  durationSeconds: 'Duration (seconds)',
  sampleRate: 'Sample Rate',
  bitrate: 'Bitrate',
  channels: 'Channels',
  codec: 'Codec',
  artist: 'Artist',
  album: 'Album',
  year: 'Year',
  genre: 'Genre',
};

const SKIP_KEYS = ['fileSizeFormatted', 'pdfError'];

export default function MetadataPage() {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (accepted) => {
    if (accepted.length === 0) return;
    setLoading(true);
    setError('');
    setMetadata(null);

    try {
      const formData = new FormData();
      formData.append('file', accepted[0]);

      const res = await api('/api/metadata', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to extract metadata');
      }

      const data = await res.json();
      setMetadata(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop,
  });

  function handleReset() {
    setMetadata(null);
    setError('');
  }

  return (
    <div className="page">
      <h1>File Info</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Upload any file to view its metadata — dimensions, duration, author, camera info, page count, and more.
      </p>

      {!metadata && (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          {loading ? (
            <p><span className="spinner spinner-sm" /> Extracting metadata...</p>
          ) : isDragActive ? (
            <p>Drop it here...</p>
          ) : (
            <p>Drag & drop a file here, or click to browse</p>
          )}
        </div>
      )}

      {error && <p className="convert-error">{error}</p>}

      {metadata && (
        <div className="metadata-result">
          <table className="metadata-table">
            <tbody>
              {Object.entries(metadata)
                .filter(([key, val]) => val !== null && val !== undefined && !SKIP_KEYS.includes(key))
                .map(([key, val]) => (
                  <tr key={key}>
                    <td className="metadata-label">{LABEL_MAP[key] || key}</td>
                    <td className="metadata-value">
                      {key === 'fileSize' ? formatSize(val) : String(val)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="btn-ghost" onClick={handleReset} style={{ marginTop: '1rem' }}>
            Analyze another file
          </button>
        </div>
      )}
    </div>
  );
}
