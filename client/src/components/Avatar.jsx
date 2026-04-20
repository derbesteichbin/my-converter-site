import { memo } from 'react';

function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ['#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#8b5cf6'];
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name, email) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }
  return (email || '?')[0].toUpperCase();
}

function Avatar({ name, email, size = 32 }) {
  const initials = getInitials(name, email);
  const bg = hashColor(email || name || '');

  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.4, background: bg }} aria-hidden="true">
      {initials}
    </span>
  );
}

export default memo(Avatar);
