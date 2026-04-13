import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../api';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading'); // loading | ok | denied

  useEffect(() => {
    api('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setStatus(data.user ? 'ok' : 'denied'))
      .catch(() => setStatus('denied'));
  }, []);

  if (status === 'loading') return null;
  if (status === 'denied') return <Navigate to="/login" replace />;
  return children;
}
