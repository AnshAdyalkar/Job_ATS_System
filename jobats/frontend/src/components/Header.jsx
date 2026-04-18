import React, { useEffect, useState } from 'react';

const Header = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isAuthed = () => {
    return Boolean(localStorage.getItem('token') || sessionStorage.getItem('token'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/auth';
  };

  return (
    <header className="header">
      <div className="container header-content">
        <h1>🎯 ATS Resume Analyzer</h1>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              marginRight: '20px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Home
          </a>
          {isAuthed() ? (
            <>
              <a
                href="/profile"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: '20px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Profile
              </a>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 14px' }}>
                Logout
              </button>
            </>
          ) : (
            <a
              href="/auth"
              style={{
                color: 'white',
                textDecoration: 'none',
                marginRight: '20px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Login
            </a>
          )}
          <a
            href="/dashboard"
            style={{
              color: 'white',
              textDecoration: 'none',
              marginRight: '20px',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Dashboard
          </a>
          <div
            className="theme-toggle"
            style={{ background: 'transparent', border: 'none', padding: 0 }}
            aria-label="Theme toggle"
            title="Toggle theme"
            role="group"
          >
            <div className="theme-toggle-inner">
              <button
                type="button"
                className={`theme-chip ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
                title="Light"
              >
                ☀️
              </button>
              <button
                type="button"
                className={`theme-chip ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
                title="Dark"
              >
                🌙
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
