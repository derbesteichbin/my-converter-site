export const API_URL = import.meta.env.VITE_API_URL || '';

export function api(path, options = {}) {
  return fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
  });
}
