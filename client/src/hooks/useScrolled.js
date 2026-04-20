import { useState, useEffect } from 'react';
import { ENABLE_MICRO_ANIMATIONS } from '../featureFlags';

export default function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!ENABLE_MICRO_ANIMATIONS) return;
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return ENABLE_MICRO_ANIMATIONS ? scrolled : false;
}
