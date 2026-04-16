export const API_URL = import.meta.env.VITE_API_URL || '';
console.log('[api] VITE_API_URL:', API_URL || '(not set, using relative paths)');

export function api(path, options = {}) {
  return fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
  });
}
