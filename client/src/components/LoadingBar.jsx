import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(true);
    setProgress(30);
    const t1 = setTimeout(() => setProgress(60), 100);
    const t2 = setTimeout(() => setProgress(90), 200);
    const t3 = setTimeout(() => { setProgress(100); }, 300);
    const t4 = setTimeout(() => { setVisible(false); setProgress(0); }, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [location.pathname]);

  if (!visible) return null;

  return <div className="loading-bar" style={{ width: `${progress}%` }} />;
}
