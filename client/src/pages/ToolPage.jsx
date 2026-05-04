import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { api, API_URL } from '../api';
import { getToolBySlug, getToolLabel, getToolDescription, ADVANCED_SETTINGS } from '../toolsConfig';
import { useToast } from '../components/Toast';

// Credit packs surfaced in the no-credits modal. Mirrors PACK_IDS in
// Pricing.jsx; kept in sync manually. The label is a translation key
// resolved at render time so the modal localises with the active language.
const CREDIT_PACKS = [
  { id: 'pack1',  credits: 1,  price: '0.99',  labelKey: 'tool.packLabelSingle' },
  { id: 'pack10', credits: 10, price: '7.99',  labelKey: 'tool.packLabel10', popular: true },
  { id: 'pack30', credits: 30, price: '20.99', labelKey: 'tool.packLabel30' },
];

function formatToolName(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function estimateTime(files) {
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const mb = totalBytes / (1024 * 1024);
  if (mb < 1) return 'a few seconds';
  if (mb < 5) return '~10 seconds';
  if (mb < 20) return '~30 seconds';
  if (mb < 50) return '~1 minute';
  if (mb < 100) return '~2 minutes';
  return '~3-5 minutes';
}

function estimateSeconds(files) {
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  const mb = totalBytes / (1024 * 1024);
  if (mb < 1) return 5;
  if (mb < 5) return 10;
  if (mb < 20) return 30;
  if (mb < 50) return 60;
  if (mb < 100) return 120;
  return 240;
}

function estimateOutputSize(inputBytes, inputFormat, outputFormat) {
  const mb = inputBytes / (1024 * 1024);
  // Rough multipliers based on common conversions
  const key = `${inputFormat}-${outputFormat}`;
  const ratios = {
    'pdf-docx': 1.2, 'pdf-doc': 1.2, 'pdf-txt': 0.05, 'pdf-html': 0.8,
    'docx-pdf': 0.8, 'doc-pdf': 0.8, 'pptx-pdf': 0.7,
    'jpg-png': 3.0, 'jpeg-png': 3.0, 'png-jpg': 0.3, 'png-jpeg': 0.3,
    'webp-png': 2.5, 'webp-jpg': 0.4, 'bmp-png': 0.15, 'bmp-jpg': 0.05,
    'svg-png': 0.5, 'heic-jpg': 0.8, 'heic-png': 2.0, 'tiff-jpg': 0.1,
    'mp4-mp3': 0.1, 'mp4-avi': 5.0, 'mp4-mov': 1.1, 'mov-mp4': 0.5,
    'mkv-mp4': 0.8, 'avi-mp4': 0.2, 'webm-mp4': 0.8,
    'mp3-wav': 10.0, 'wav-mp3': 0.1, 'flac-mp3': 0.15, 'aac-mp3': 1.0,
    'ogg-mp3': 1.0, 'wma-mp3': 1.0, 'm4a-mp3': 1.0,
  };
  const ratio = ratios[key] || 1.0;
  return Math.round(inputBytes * ratio);
}

async function shareOrCopy(url) {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Converted file', url });
      return 'shared';
    } catch { return null; }
  }
  await navigator.clipboard.writeText(url);
  return 'copied';
}

function saveRecentTool(slug) {
  try {
    const recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
    const updated = [slug, ...recent.filter((s) => s !== slug)].slice(0, 5);
    localStorage.setItem('recentTools', JSON.stringify(updated));
  } catch { /* ignore */ }
}

function getSavedFormat(toolSlug, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem('toolFormats') || '{}');
    return saved[toolSlug] || fallback;
  } catch { return fallback; }
}

function saveFormat(toolSlug, format) {
  try {
    const saved = JSON.parse(localStorage.getItem('toolFormats') || '{}');
    saved[toolSlug] = format;
    localStorage.setItem('toolFormats', JSON.stringify(saved));
  } catch { /* ignore */ }
}

function validateFileType(file, toolDef) {
  if (!toolDef?.inputFormats) return null;
  const ext = file.name.split('.').pop().toLowerCase();
  if (toolDef.inputFormats.includes(ext)) return null;
  return `"${file.name}" is not a supported file type. Expected: ${toolDef.inputFormats.map((f) => '.' + f).join(', ')}`;
}

const PDF_TOOL_TYPES = new Set(['pdf-merge', 'pdf-split', 'pdf-compress', 'pdf-rotate', 'pdf-protect', 'pdf-unlock']);
const TTS_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
const TTS_SPEEDS = [0.75, 1.0, 1.25, 1.5];

// Display name + description i18n key for each voice. The description
// values live in i18n.js so they translate; the names stay capitalised
// English (they're proper names of OpenAI voices).
const VOICE_DESC_KEY = (id) => `tool.voiceDesc.${id}`;
const WHISPER_LANGUAGE_HINTS = [
  ['auto', 'Auto Detect'],
  ['en', 'English'],
  ['de', 'Deutsch'],
  ['fr', 'Français'],
  ['es', 'Español'],
  ['it', 'Italiano'],
  ['pt', 'Português'],
  ['nl', 'Nederlands'],
  ['pl', 'Polski'],
  ['sv', 'Svenska'],
  ['no', 'Norsk'],
];

export default function ToolPage() {
  const { toolName } = useParams();
  const toolDef = getToolBySlug(toolName);
  const formats = toolDef?.outputFormats || ['pdf', 'png', 'jpg'];
  const isPdfTool = PDF_TOOL_TYPES.has(toolDef?.toolType);
  const isPdfMerge = toolDef?.toolType === 'pdf-merge';
  const isSmartTool = toolDef?.toolType === 'smart';
  const isTts = toolName === 'text-to-speech';
  const isStt = toolName === 'speech-to-text';
  const extraFields = toolDef?.extraFields || [];
  const advancedFields = ADVANCED_SETTINGS[toolDef?.category] || [];
  const toast = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({ status: 'loading', plan: null, credits: null });
  // null | 'guest' | 'no_credits' | 'confirm'
  const [modal, setModal] = useState(null);
  const [buyingPack, setBuyingPack] = useState('');

  const translatedLabel = getToolLabel(toolDef, t);
  // Translated description from toolDescriptions.<slug> (covers all 51+
  // tools), falling back to legacy smartFunctions strings for any tool
  // not yet migrated. Replaces the previous English-only inline copy.
  const toolDescription = getToolDescription(toolDef, t);
  const seoTitle = toolDef ? `${translatedLabel} - Free Online Converter` : 'File Converter';
  // Build a keyword-rich description. For format-conversion tools we name
  // the input/output formats explicitly (e.g. "PDF to DOCX") so the page
  // ranks for that exact query, then layer in the trust/utility phrases
  // ("fast", "no installation", "files deleted after 24 hours") that match
  // how users phrase converter searches.
  function buildSeoDesc() {
    if (!toolDef) return 'Free online file converter. Fast, secure, no signup required. Files deleted after 24 hours.';
    if (toolDescription) {
      return `${toolDescription} Free online tool. No installation needed. Files deleted after 24 hours.`;
    }
    const fromList = (toolDef.inputFormats || []).map((f) => f.toUpperCase()).join(', ');
    const toList = (toolDef.outputFormats || []).map((f) => f.toUpperCase()).join(', ');
    if (toolDef.toolType === 'pdf-merge') {
      return 'Merge multiple PDF files into one online for free. Combine PDFs in any order. Fast, accurate, no installation needed. Files deleted after 24 hours.';
    }
    if (toolDef.toolType === 'pdf-compress') {
      return 'Compress PDF online for free. Reduce PDF file size while preserving quality. Fast, accurate compression. No installation needed. Files deleted after 24 hours.';
    }
    if (toolDef.toolType === 'pdf-split') {
      return 'Split PDF online for free. Extract specific pages from a PDF. Fast, accurate, no installation needed. Files deleted after 24 hours.';
    }
    if (toolDef.toolType === 'pdf-rotate') {
      return 'Rotate PDF online for free. Rotate PDF pages 90, 180 or 270 degrees. Fast, no installation needed. Files deleted after 24 hours.';
    }
    if (toolDef.toolType === 'pdf-protect') {
      return 'Protect PDF with password online for free. Encrypt PDF files in seconds. Fast, secure, no installation needed. Files deleted after 24 hours.';
    }
    if (toolDef.toolType === 'pdf-unlock') {
      return 'Unlock PDF online for free. Remove password protection from PDF files. Fast, secure, no installation needed. Files deleted after 24 hours.';
    }
    if (toolDef.toolType === 'metadata') {
      return 'View file metadata online for free. Inspect dimensions, duration, author, codec, page count and more. No installation needed.';
    }
    return `Convert ${fromList} to ${toList} online for free. Fast, accurate ${fromList} to ${toList} conversion. No installation needed. Files deleted after 24 hours.`;
  }
  const seoDesc = buildSeoDesc();
  const seoUrl = `https://www.convertanyformat.com/tools/${toolName}`;
  const seoJsonLd = toolDef ? {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${translatedLabel} - ConvertAnyFormat`,
    description: seoDesc,
    url: seoUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (web-based)',
    browserRequirements: 'Requires JavaScript and modern browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ConvertAnyFormat',
      url: 'https://www.convertanyformat.com',
    },
  } : null;

  const [files, setFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState(() => getSavedFormat(toolName, formats[0]));
  const [batchJobs, setBatchJobs] = useState([]);
  const [overallStatus, setOverallStatus] = useState('idle');
  const [error, setError] = useState('');
  const pollRefs = useRef([]);

  const [pageRanges, setPageRanges] = useState('');
  const [rotation, setRotation] = useState('90');
  const [password, setPassword] = useState('');

  // Smart Functions: per-tool extras
  const [ttsText, setTtsText] = useState('');
  const [ttsVoice, setTtsVoice] = useState('alloy');
  const [ttsSpeed, setTtsSpeed] = useState('1');
  const [languageHint, setLanguageHint] = useState('auto');

  // Speech-to-Text microphone recording state
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recorderRef = useRef(null);
  const recordTimerRef = useRef(null);
  const recordChunksRef = useRef([]);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedValues, setAdvancedValues] = useState({});
  const [notifyEmail, setNotifyEmail] = useState(false);

  // Drag reorder state
  const [dragIndex, setDragIndex] = useState(null);

  // Progress bar state
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  // Offline detection
  const [offline, setOffline] = useState(!navigator.onLine);

  // Expiry countdown
  const [expiryTime, setExpiryTime] = useState(null);
  const [countdown, setCountdown] = useState('');

  // Auth + plan/credits — fetched once so we can gate Convert without
  // forcing login on page entry. Visitors land on 'guest', logged-in users
  // get plan + credits which drive the 5MB free-tier check and the
  // credits-exhausted message.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const meRes = await api('/api/auth/me');
        const meData = await meRes.json();
        if (cancelled) return;
        if (!meData.user) {
          setAuthState({ status: 'guest', plan: null, credits: null });
          return;
        }
        const profRes = await api('/api/profile');
        const profData = await profRes.json().catch(() => ({}));
        if (cancelled) return;
        setAuthState({
          status: 'authed',
          plan: profData.plan || 'free',
          credits: profData.stats?.credits ?? 0,
        });
      } catch {
        if (!cancelled) setAuthState({ status: 'guest', plan: null, credits: null });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Offline detection
  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  // Save format preference when changed
  useEffect(() => {
    if (toolName && outputFormat) saveFormat(toolName, outputFormat);
  }, [outputFormat, toolName]);

  // Track recently used tools
  useEffect(() => {
    if (toolName && toolDef && !toolDef.toolType?.startsWith('metadata')) {
      saveRecentTool(toolName);
    }
  }, [toolName]);

  useEffect(() => {
    return () => {
      pollRefs.current.forEach((id) => clearInterval(id));
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (modal) { setModal(null); return; }
        setShowAdvanced(false);
        setError('');
      }
      if (e.key === 'Enter' && !e.repeat && files.length > 0 && overallStatus === 'idle' && !modal) {
        const tag = e.target.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
          e.preventDefault();
          handleConvert();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files, overallStatus, modal]);

  useEffect(() => {
    pollRefs.current.forEach((id) => clearInterval(id));
    pollRefs.current = [];
    setFiles([]);
    setOutputFormat(getSavedFormat(toolName, formats[0]));
    setBatchJobs([]);
    setOverallStatus('idle');
    setError('');
    setPageRanges('');
    setRotation('90');
    setPassword('');
    setTtsText('');
    setTtsVoice('alloy');
    setTtsSpeed('1');
    setLanguageHint('auto');
    setShowAdvanced(false);
    setAdvancedValues({});
    setNotifyEmail(false);
  }, [toolName]);

  const onDrop = useCallback((accepted) => {
    if (accepted.length === 0) return;

    // Validate file types
    if (toolDef?.inputFormats) {
      const invalid = accepted.map((f) => validateFileType(f, toolDef)).filter(Boolean);
      if (invalid.length > 0) {
        toast(invalid[0], 'error');
        return;
      }
    }

    setFiles((prev) => [...prev, ...accepted]);
    setOverallStatus('idle');
    setBatchJobs([]);
    setError('');
  }, [toolDef]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop,
  });

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // Drag reorder handlers
  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setFiles((prev) => {
      const updated = [...prev];
      const [dragged] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, dragged);
      return updated;
    });
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  function updateAdvanced(key, value) {
    setAdvancedValues((prev) => ({ ...prev, [key]: value }));
  }

  function buildExtraFormData(formData) {
    if (extraFields.includes('pageRanges') && pageRanges) formData.append('pageRanges', pageRanges);
    if (extraFields.includes('rotation')) formData.append('rotation', rotation);
    if (extraFields.includes('password') && password) formData.append('password', password);
    if (notifyEmail) formData.append('notifyEmail', 'true');
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
          setBatchJobs((prev) => prev.map((j, i) => i === index ? { ...j, status: 'done', downloadUrl: job.downloadUrl, outputSize: job.outputSize } : j));
          // For Speech to Text, fetch the transcript so we can render it
          // inline below the download button.
          if (isStt && job.downloadUrl) {
            api(job.downloadUrl)
              .then((r) => r.ok ? r.text() : '')
              .then((transcript) => {
                if (!transcript) return;
                setBatchJobs((prev) => prev.map((j, i) => i === index ? { ...j, transcript } : j));
              })
              .catch(() => {});
          }
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

  function startProgress() {
    const estSecs = estimateSeconds(files);
    setProgress(0);
    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += 0.5;
      // Asymptotic approach to 95% — never reaches 100 until actually done
      const pct = Math.min(95, Math.round((elapsed / estSecs) * 90));
      setProgress(pct);
    }, 500);
  }

  function stopProgress() {
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = null;
    setProgress(100);
  }

  // ── Speech-to-Text microphone recording ──────────────────────────
  async function startRecording() {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Let the browser pick its preferred container (Chrome/Firefox: webm
      // with Opus; Safari: mp4 with AAC). Both are accepted by Whisper.
      const recorder = new MediaRecorder(stream);
      recordChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (recordTimerRef.current) {
          clearInterval(recordTimerRef.current);
          recordTimerRef.current = null;
        }
        const mimeType = recorder.mimeType || 'audio/webm';
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(recordChunksRef.current, { type: mimeType });
        if (blob.size === 0) {
          setRecording(false);
          setRecordSeconds(0);
          return;
        }
        const file = new File([blob], `recording-${Date.now()}.${ext}`, { type: mimeType });
        setFiles([file]);
        setRecording(false);
        setRecordSeconds(0);
        setOverallStatus('idle');
        setBatchJobs([]);
        setError('');
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      toast(t('tool.micPermissionDenied'), 'error');
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  }

  // Stop recording + clear timer if the component unmounts mid-record
  useEffect(() => {
    return () => {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        try { recorderRef.current.stop(); } catch { /* ignore */ }
      }
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  function formatRecordTime(seconds) {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function handleConvert() {
    // TTS allows submitting typed text without uploading a file. All other
    // tools require at least one file.
    if (files.length === 0 && !(isTts && ttsText.trim())) return;

    if (authState.status === 'loading') return;
    if (authState.status === 'guest') { setModal('guest'); return; }
    if ((authState.credits ?? 0) <= 0) { setModal('no_credits'); return; }

    // Authed + has credits — show confirm step
    setModal('confirm');
  }

  async function handleBuyPack(packId) {
    setBuyingPack(packId);
    try {
      const res = await api('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack: packId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast(data.error || t('pricing.checkoutFail'), 'error');
        setBuyingPack('');
        return;
      }
      window.location.href = data.url;
    } catch {
      toast(t('common.connectError'), 'error');
      setBuyingPack('');
    }
  }

  async function actuallyConvert() {
    setModal(null);
    setError('');
    setOverallStatus('converting');
    startProgress();

    // Smart Functions (OpenAI TTS / Whisper) — single-file or text-only flow.
    if (isSmartTool) {
      const inputName = isTts && !files.length ? `${ttsText.slice(0, 40)}…` : files[0]?.name || 'input';
      const inputSize = files[0]?.size || ttsText.length;
      const job0 = { file: inputName, inputSize, status: 'uploading', jobId: null, downloadUrl: null, outputSize: null, error: null, transcript: null };
      setBatchJobs([job0]);

      try {
        const formData = new FormData();
        formData.append('toolSlug', toolName);
        if (files[0]) formData.append('file', files[0]);
        if (isTts) {
          formData.append('text', ttsText);
          formData.append('voice', ttsVoice);
          formData.append('ttsSpeed', ttsSpeed);
          formData.append('ttsFormat', outputFormat);  // mp3 / opus / aac
        }
        if (isStt) {
          formData.append('sttFormat', outputFormat);  // txt / docx
          if (languageHint && languageHint !== 'auto') formData.append('languageHint', languageHint);
        }
        if (toolName === 'auto-subtitle') {
          formData.append('subtitleFormat', outputFormat);  // srt / vtt
          if (languageHint && languageHint !== 'auto') formData.append('languageHint', languageHint);
        }

        const res = await api('/api/smart', { method: 'POST', body: formData });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 429 && data.code === 'no_credits') {
            setBatchJobs([]);
            stopProgress();
            setOverallStatus('idle');
            setModal('no_credits');
            return;
          }
          throw new Error(data.error || 'Upload failed');
        }
        const { jobId } = await res.json();
        setBatchJobs([{ ...job0, status: 'processing', jobId }]);
        pollJob(0, jobId);
      } catch (err) {
        setBatchJobs([{ ...job0, status: 'failed', error: err.message }]);
      }
      return;
    }

    if (isPdfTool) {
      const totalSize = files.reduce((s, f) => s + f.size, 0);
      const jobs = [{ file: isPdfMerge ? `${files.length} files` : files[0].name, inputSize: totalSize, status: 'uploading', jobId: null, downloadUrl: null, outputSize: null, error: null }];
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
          if (res.status === 429 && data.code === 'no_credits') {
            setBatchJobs([]);
            stopProgress();
            setOverallStatus('idle');
            setModal('no_credits');
            return;
          }
          throw new Error(data.error || 'Upload failed');
        }
        const { jobId } = await res.json();
        setBatchJobs([{ ...jobs[0], status: 'processing', jobId }]);
        pollJob(0, jobId);
      } catch (err) {
        setBatchJobs([{ ...jobs[0], status: 'failed', error: err.message }]);
      }
    } else {
      const jobs = files.map((f) => ({ file: f.name, inputSize: f.size, status: 'uploading', jobId: null, downloadUrl: null, outputSize: null, error: null }));
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
            if (res.status === 429 && data.code === 'no_credits') {
              setBatchJobs([]);
              stopProgress();
              setOverallStatus('idle');
              setModal('no_credits');
              return;
            }
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

  useEffect(() => {
    if (batchJobs.length === 0) return;
    const allDone = batchJobs.every((j) => j.status === 'done' || j.status === 'failed');
    if (allDone && overallStatus === 'converting') {
      stopProgress();
      setOverallStatus('done');
      const succeeded = batchJobs.filter((j) => j.status === 'done').length;
      const failed = batchJobs.filter((j) => j.status === 'failed').length;
      if (failed === 0) {
        toast(`${succeeded} file${succeeded > 1 ? 's' : ''} converted successfully!`, 'success');
      } else {
        toast(`${succeeded} succeeded, ${failed} failed`, 'error');
      }
      // Start 24h expiry countdown
      setExpiryTime(Date.now() + 24 * 60 * 60 * 1000);
    }
  }, [batchJobs]);

  // Countdown timer
  useEffect(() => {
    if (!expiryTime) return;
    const tick = setInterval(() => {
      const remaining = expiryTime - Date.now();
      if (remaining <= 0) {
        setCountdown('Expired');
        clearInterval(tick);
        return;
      }
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      setCountdown(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(tick);
  }, [expiryTime]);

  async function handleDownloadAll() {
    const filenames = batchJobs
      .filter((j) => j.status === 'done' && j.downloadUrl)
      .map((j) => j.downloadUrl.split('/').pop());

    if (filenames.length === 0) return;

    try {
      const res = await api('/api/download-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filenames }),
      });

      if (!res.ok) throw new Error('ZIP download failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-files.zip';
      a.click();
      URL.revokeObjectURL(url);
      toast('ZIP downloaded!', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

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

  function isImageFile(file) {
    return file.type.startsWith('image/');
  }

  const isCompressTool = toolDef?.toolType === 'pdf-compress' || toolName?.includes('compress');

  return (
    <div className="page">
      <SEO
        title={translatedLabel || toolName}
        description={seoDesc}
        path={`/tools/${toolName}`}
        jsonLd={seoJsonLd}
      />
      {offline && <div className="offline-banner" role="alert">{t('tool.offline')}</div>}
      <h1>{translatedLabel || formatToolName(toolName)}</h1>

      {/* Translated description from toolDescriptions.<slug>. One source
          of truth for every tool type. */}
      {toolDescription && (
        <p className="tool-description">{toolDescription}</p>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${hasFiles ? 'dropzone-has-file' : ''}`}
      >
        <input {...getInputProps()} />
        {hasFiles && files.length === 1 && !isPdfMerge ? (
          <div className="dropzone-file">
            {isImageFile(files[0]) && (
              <img className="file-preview-thumb" src={URL.createObjectURL(files[0])} alt="Preview" />
            )}
            {!isImageFile(files[0]) && (
              <span className="file-preview-icon">{files[0].name.split('.').pop().toUpperCase()}</span>
            )}
            <span className="dropzone-filename">{files[0].name}</span>
            <span className="dropzone-filesize">{formatSize(files[0].size)}</span>
          </div>
        ) : isDragActive ? (
          <p>{t('tool.dropActive')}</p>
        ) : (
          <p>{t('tool.drop')}</p>
        )}
      </div>

      {/* Mobile camera capture */}
      {toolDef?.category === 'Image' && (
        <label className="camera-btn" aria-label={t('tool.photo')}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                if (toolDef?.inputFormats) {
                  const err = validateFileType(f, toolDef);
                  if (err) { toast(err, 'error'); return; }
                }
                setFiles((prev) => [...prev, f]);
              }
            }}
          />
          {t('tool.photo')}
        </label>
      )}

      {/* File info bar */}
      {hasFiles && overallStatus === 'idle' && (
        <div className="file-info-bar">
          <span>{files.length} {files.length === 1 ? 'file' : 'files'} — {formatSize(files.reduce((s, f) => s + f.size, 0))} total</span>
          <span className="file-info-details">
            {files.length === 1 && toolDef?.inputFormats && (
              <span className="file-info-output">
                Est. output: ~{formatSize(estimateOutputSize(files[0].size, files[0].name.split('.').pop().toLowerCase(), outputFormat))}
              </span>
            )}
            <span className="file-info-time">{t('tool.estTime')}: {estimateTime(files)}</span>
          </span>
        </div>
      )}

      {/* File list with drag reorder for PDF merge */}
      {files.length > 1 && overallStatus === 'idle' && (
        <div className="multi-file-list">
          {isPdfMerge && <p className="reorder-hint">{t('tool.reorderHint')}</p>}
          {files.map((f, i) => (
            <div
              className={`multi-file-item ${dragIndex === i ? 'multi-file-dragging' : ''}`}
              key={`${f.name}-${i}`}
              draggable={isPdfMerge}
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
            >
              {isPdfMerge && <span className="drag-handle">&#8942;&#8942;</span>}
              {isImageFile(f) ? (
                <img className="multi-file-thumb" src={URL.createObjectURL(f)} alt="" />
              ) : (
                <span className="multi-file-icon">{f.name.split('.').pop().toUpperCase()}</span>
              )}
              <span className="multi-file-name">{f.name}</span>
              <span className="multi-file-size">{formatSize(f.size)}</span>
              <button className="multi-file-remove" onClick={() => removeFile(i)} type="button">&times;</button>
            </div>
          ))}
          <p className="batch-count">{t('tool.filesSelected', { count: files.length })}</p>
        </div>
      )}

      {/* Text to Speech: text input + voice selector. Shown only when no
          file is uploaded so the user can either type OR drop a .txt file. */}
      {isTts && overallStatus === 'idle' && !files.length && (
        <div className="tts-controls">
          <label htmlFor="tts-text" className="tts-label">{t('tool.ttsTextLabel')}</label>
          <textarea
            id="tts-text"
            className="tts-textarea"
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            placeholder={t('tool.ttsPlaceholder')}
            rows={6}
            maxLength={4096}
          />
          <p className="tts-char-count">{ttsText.length} / 4096</p>

          <div className="voice-section">
            <span className="voice-section-label">{t('tool.ttsVoiceLabel')}</span>
            <div className="voice-cards" role="radiogroup" aria-label={t('tool.ttsVoiceLabel')}>
              {TTS_VOICES.map((v) => {
                const selected = ttsVoice === v;
                return (
                  <label key={v} className={`voice-card ${selected ? 'voice-card-selected' : ''}`}>
                    <input
                      type="radio"
                      name="tts-voice"
                      value={v}
                      checked={selected}
                      onChange={() => setTtsVoice(v)}
                      className="voice-card-input"
                    />
                    <span className="voice-card-name">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
                    <span className="voice-card-desc">{t(VOICE_DESC_KEY(v))}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="tts-voice-row">
            <label htmlFor="tts-speed">{t('tool.ttsSpeedLabel')}</label>
            <select id="tts-speed" value={ttsSpeed} onChange={(e) => setTtsSpeed(e.target.value)}>
              {TTS_SPEEDS.map((s) => (
                <option key={s} value={s}>{s}x{s === 1 ? ` (${t('tool.ttsSpeedDefault')})` : ''}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Speech to Text: microphone recording controls. Shown when no file
          uploaded yet — recording stops with a Blob that gets pushed into
          the files state, so the existing convert flow handles the rest. */}
      {isStt && overallStatus === 'idle' && !files.length && (
        <div className="record-controls">
          {!recording ? (
            <button type="button" className="btn-ghost record-btn" onClick={startRecording}>
              <span aria-hidden="true" className="record-icon">●</span>
              {t('tool.recordBtn')}
            </button>
          ) : (
            <button type="button" className="btn-primary record-btn record-btn-stop" onClick={stopRecording}>
              <span aria-hidden="true" className="record-icon record-icon-pulsing">■</span>
              {t('tool.stopRecording')} <span className="record-timer">{formatRecordTime(recordSeconds)}</span>
            </button>
          )}
        </div>
      )}

      {/* Speech to Text + Auto Subtitle: language hint selector */}
      {(isStt || toolName === 'auto-subtitle') && overallStatus === 'idle' && (
        <div className="extra-field">
          <label htmlFor="lang-hint">{t('tool.languageHintLabel')}</label>
          <select id="lang-hint" value={languageHint} onChange={(e) => setLanguageHint(e.target.value)}>
            {WHISPER_LANGUAGE_HINTS.map(([code, label]) => (
              <option key={code} value={code}>{code === 'auto' ? t('tool.languageAuto') : label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Progress bar */}
      {overallStatus === 'converting' && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span className="progress-label">{progress}%</span>
        </div>
      )}

      {/* Batch job progress */}
      {batchJobs.length > 0 && (
        <div className="batch-results">
          {batchJobs.map((job, i) => (
            <div className={`batch-item batch-item-${job.status}`} key={i}>
              <span className="batch-item-name">{job.file}</span>
              <span className="batch-item-status">
                {job.status === 'uploading' && t('tool.statusUploading')}
                {job.status === 'processing' && <><span className="spinner spinner-sm" /> {t('tool.statusProcessing')}</>}
                {job.status === 'done' && (
                  <>
                    {isCompressTool && job.outputSize && job.inputSize && (
                      <span className="compression-stat">
                        {formatSize(job.inputSize)} &rarr; {formatSize(job.outputSize)}
                        ({Math.round((1 - job.outputSize / job.inputSize) * 100)}% smaller)
                      </span>
                    )}
                    <a href={`${API_URL}${job.downloadUrl}`} className="batch-download" download>{t('common.download')}</a>
                    <button className="btn-share" aria-label={t('tool.share')} onClick={async () => {
                      const url = `${window.location.origin}${API_URL}${job.downloadUrl}`;
                      const result = await shareOrCopy(url);
                      if (result === 'copied') toast('Download link copied!', 'success');
                      else if (result === 'shared') toast('Shared!', 'success');
                    }} type="button">{t('tool.share')}</button>
                  </>
                )}
                {job.status === 'failed' && <span className="batch-error">{job.error}</span>}
              </span>
              {isStt && job.transcript && (
                <pre className="stt-transcript" aria-label={t('tool.sttTranscriptLabel')}>{job.transcript}</pre>
              )}
            </div>
          ))}
          {overallStatus === 'done' && (
            <div className="batch-done-actions">
              {batchJobs.filter((j) => j.status === 'done').length > 1 && (
                <button className="btn-primary" onClick={handleDownloadAll} type="button" aria-label="Download all as ZIP">{t('tool.downloadAll')}</button>
              )}
              <button className="btn-ghost" onClick={handleReset}>{t('tool.convertMore')}</button>
              {countdown && (
                <p className="expiry-countdown">{t('tool.expire')} {countdown}</p>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="convert-error">{error}</p>}

      {overallStatus !== 'done' && batchJobs.length === 0 && (
        <>
          {extraFields.includes('pageRanges') && (
            <div className="extra-field">
              <label htmlFor="pageRanges">{t('tool.pageRangesLabel')}</label>
              <input id="pageRanges" type="text" value={pageRanges} onChange={(e) => setPageRanges(e.target.value)} disabled={busy} />
            </div>
          )}
          {extraFields.includes('rotation') && (
            <div className="extra-field">
              <label htmlFor="rotation">{t('tool.rotationLabel')}</label>
              <select id="rotation" value={rotation} onChange={(e) => setRotation(e.target.value)} disabled={busy}>
                <option value="90">90°</option>
                <option value="180">180°</option>
                <option value="270">270°</option>
              </select>
            </div>
          )}
          {extraFields.includes('password') && (
            <div className="extra-field">
              <label htmlFor="password">{toolDef?.toolType === 'pdf-unlock' ? t('tool.currentPasswordLabel') : t('tool.setPasswordLabel')}</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} />
            </div>
          )}

          <label className="email-toggle">
            <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} disabled={busy} aria-label={t('tool.emailMe')} />
            {t('tool.emailMe')}
          </label>

          <div className="tool-controls">
            {formats.length > 1 && (
              <div className="format-select">
                <label htmlFor="format">{t('tool.output')}</label>
                <select id="format" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} disabled={busy}>
                  {formats.map((f) => (
                    <option key={f} value={f}>.{f}</option>
                  ))}
                </select>
              </div>
            )}

            {authState.status === 'authed' && (
              <span
                className="credit-pill"
                title="Conversion credits"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '999px',
                  background: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  color: 'var(--text)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                <span aria-hidden="true">●</span>
                {t((authState.credits ?? 0) === 1 ? 'tool.creditPillSingular' : 'tool.creditPillPlural', { count: authState.credits ?? 0 })}
              </span>
            )}

            <button className="btn-primary convert-btn" disabled={!hasFiles || busy} onClick={handleConvert} aria-label={t('tool.convert')}>
              {busy && <span className="spinner" />}
              {busy ? t('tool.converting') : files.length > 1 ? `${t('tool.convert')} ${files.length}` : t('tool.convert')}
            </button>
          </div>

          {advancedFields.length > 0 && (
            <div className="advanced-section">
              <button className="btn-ghost advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)} type="button" aria-expanded={showAdvanced}>
                {showAdvanced ? t('tool.hide') : t('tool.show')} {t('tool.advanced')}
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
                            <option value="">{t('tool.advDefault')}</option>
                            {field.options.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
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

      {modal && (
        <div
          className="convert-modal-overlay"
          onClick={() => setModal(null)}
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="convert-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '1.75rem', maxWidth: '480px',
              width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              color: 'var(--text)',
            }}
          >
            {modal === 'guest' && (
              <>
                <h2 style={{ margin: '0 0 0.5rem' }}>{t('tool.guestModalTitle')}</h2>
                <p style={{ margin: '0 0 1.25rem', color: 'var(--text-muted)' }}>
                  {t('tool.guestModalBody')}
                </p>
                <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => navigate('/login')} type="button">{t('auth.logIn')}</button>
                  <button className="btn-ghost" onClick={() => navigate('/register')} type="button">{t('auth.register')}</button>
                  <button className="btn-ghost" onClick={() => setModal(null)} type="button" style={{ marginLeft: 'auto' }}>{t('common.cancel')}</button>
                </div>
              </>
            )}

            {modal === 'no_credits' && (
              <>
                <h2 style={{ margin: '0 0 0.5rem' }}>{t('tool.noCreditsModalTitle')}</h2>
                <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)' }}>
                  {t('tool.noCreditsModalBody')}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
                  {CREDIT_PACKS.map((pack) => (
                    <div
                      key={pack.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: '1rem', padding: '0.875rem 1rem',
                        border: pack.popular ? '1.5px solid rgba(124, 58, 237, 0.55)' : '1px solid var(--border)',
                        borderRadius: '10px',
                        background: pack.popular ? 'rgba(124, 58, 237, 0.06)' : 'transparent',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {t(pack.labelKey)}
                          {pack.popular && (
                            <span style={{
                              marginLeft: '0.5rem', fontSize: '0.6875rem', fontWeight: 700,
                              padding: '0.125rem 0.5rem', borderRadius: '999px',
                              background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: '#fff',
                            }}>{t('tool.popularPackBadge')}</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>€{pack.price}</div>
                      </div>
                      <button
                        className="btn-primary"
                        onClick={() => handleBuyPack(pack.id)}
                        disabled={!!buyingPack}
                        type="button"
                      >
                        {buyingPack === pack.id ? t('pricing.redirecting') : t('tool.buyBtn')}
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-ghost" onClick={() => setModal(null)} type="button">{t('common.cancel')}</button>
                </div>
              </>
            )}

            {modal === 'confirm' && (
              <>
                <h2 style={{ margin: '0 0 0.5rem' }}>{t('tool.confirmModalTitle')}</h2>
                <p style={{ margin: '0 0 1.25rem', color: 'var(--text)' }}>
                  {t((authState.credits ?? 0) === 1 ? 'tool.confirmBodySingular' : 'tool.confirmBodyPlural', { count: authState.credits ?? 0 })}
                </p>
                <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
                  <button className="btn-ghost" onClick={() => setModal(null)} type="button">{t('common.cancel')}</button>
                  <button className="btn-primary" onClick={actuallyConvert} type="button" autoFocus>{t('tool.confirmBtn')}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
