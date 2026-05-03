import { useLocation } from 'react-router-dom';
import { ENABLE_PAGE_TRANSITIONS } from '../featureFlags';

// Wraps the routed Outlet in a fade-in animation that runs whenever the
// pathname changes. Uses a key={pathname} pattern so React naturally
// remounts the wrapper on each route change — much simpler than the
// previous displayChildren-swap approach (which delayed the new page by
// 150ms and could appear as "navigation not working" if the swap state
// got out of sync).
export default function PageTransition({ children }) {
  const location = useLocation();
  if (!ENABLE_PAGE_TRANSITIONS) return children;
  return (
    <div key={location.pathname} className="page-transition page-enter">
      {children}
    </div>
  );
}
