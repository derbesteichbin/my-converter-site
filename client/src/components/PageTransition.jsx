import { useLocation } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import { ENABLE_PAGE_TRANSITIONS } from '../featureFlags';

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (!ENABLE_PAGE_TRANSITIONS || location.pathname === prevPath.current) {
      setDisplayChildren(children);
      return;
    }
    prevPath.current = location.pathname;
    setTransitioning(true);
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setTransitioning(false);
    }, 150);
    return () => clearTimeout(timeout);
  }, [location.pathname, children]);

  if (!ENABLE_PAGE_TRANSITIONS) return children;

  return (
    <div className={`page-transition ${transitioning ? 'page-exit' : 'page-enter'}`}>
      {displayChildren}
    </div>
  );
}
