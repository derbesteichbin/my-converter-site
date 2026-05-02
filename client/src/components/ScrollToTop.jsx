import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scroll the window to the top on every pathname change. Mounted once
// inside <BrowserRouter>, so every route navigation (including clicking
// a tool card) lands at y=0. Hash anchors are preserved — if the URL
// has a #hash we leave the browser's default behaviour alone so
// in-page anchors still work.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
