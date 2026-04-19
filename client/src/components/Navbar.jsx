import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api';

function getInitialTheme() {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch { return 'light'; }
}

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
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
        <button className="btn-ghost theme-toggle" onClick={toggleTheme} title="Toggle dark mode" type="button">
          {theme === 'light' ? '\u263E' : '\u2600'}
        </button>
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
