import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { api } from '../api';
import SEO from '../components/SEO';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Backend metadata keys → translation key under metadataPage.labels.
// We list the keys explicitly (rather than reusing the value as a key)
// so the i18n extractor can detect every label used here.
const LABEL_KEYS = [
  'fileName', 'fileSize', 'format', 'mimeType', 'lastModified',
  'pageCount', 'pageWidth', 'pageHeight',
  'title', 'author', 'subject', 'creator', 'producer',
  'creationDate', 'modificationDate',
  'width', 'height',
  'cameraMake', 'cameraModel', 'dateTaken',
  'iso', 'focalLength', 'exposureTime', 'aperture',
  'gpsLatitude', 'gpsLongitude',
  'colorSpace', 'bitDepth',
  'mediaType', 'duration', 'durationSeconds',
  'sampleRate', 'bitrate', 'channels', 'codec',
  'artist', 'album', 'year', 'genre',
];

const SKIP_KEYS = ['fileSizeFormatted', 'pdfError'];

export default function MetadataPage() {
  const { t } = useTranslation();
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
        throw new Error(data.error || t('metadataPage.failExtract'));
      }

      const data = await res.json();
      setMetadata(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [t]);

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
      <SEO
        title={t('metadataPage.title')}
        path="/tools/view-metadata"
        description={t('metadataPage.seoDesc')}
      />
      <h1>{t('metadataPage.title')}</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>{t('metadataPage.body')}</p>

      {!metadata && (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}
        >
          <input {...getInputProps()} />
          {loading ? (
            <p><span className="spinner spinner-sm" /> {t('metadataPage.extracting')}</p>
          ) : isDragActive ? (
            <p>{t('metadataPage.dropHere')}</p>
          ) : (
            <p>{t('metadataPage.dropDefault')}</p>
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
                    <td className="metadata-label">
                      {LABEL_KEYS.includes(key) ? t(`metadataPage.labels.${key}`) : key}
                    </td>
                    <td className="metadata-value">
                      {key === 'fileSize' ? formatSize(val) : String(val)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="btn-ghost" onClick={handleReset} style={{ marginTop: '1rem' }}>
            {t('metadataPage.analyzeAnother')}
          </button>
        </div>
      )}
    </div>
  );
}
