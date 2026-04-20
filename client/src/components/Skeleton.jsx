import { ENABLE_SKELETONS } from '../featureFlags';

export function SkeletonCard({ count = 6 }) {
  if (!ENABLE_SKELETONS) return null;
  return (
    <div className="tools-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-line skeleton-line-short" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  if (!ENABLE_SKELETONS) return null;
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-row" key={i}>
          <div className="skeleton-line skeleton-line-long" />
          <div className="skeleton-line skeleton-line-short" />
          <div className="skeleton-line skeleton-line-tiny" />
        </div>
      ))}
    </div>
  );
}
