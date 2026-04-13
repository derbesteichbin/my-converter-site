import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth status on mount and on route change
  useEffect(() => {
    api('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setLoggedIn(!!data.user))
      .catch(() => setLoggedIn(false));
  }, [location.pathname]);

  async function handleLogout() {
    await api('/api/auth/logout', { method: 'POST' });
    setLoggedIn(false);
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Converter
      </Link>

      <div className="navbar-links">
        <Link to="/tools">Tools</Link>
        <Link to="/pricing">Pricing</Link>
      </div>

      <div className="navbar-auth">
        {loggedIn ? (
          <>
            <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
            <button className="btn-ghost" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost">Log in</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
