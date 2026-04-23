import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ darkMode, setDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;
  const isAdmin    = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home',     path: '/home'    },
    { label: 'About',    path: '/about'   },
    { label: 'Contact',  path: '/contact',  guestOnly:       true },
    { label: 'Feed',     path: '/feed',     requiresAuth:    true },
    { label: 'Profile',  path: '/profile',  requiresAuth:    true },
    { label: 'Admin',    path: '/admin',    requiresAdmin:   true },
    { label: 'Login',    path: '/login',    hideWhenLoggedIn: true },
    { label: 'Register', path: '/register', hideWhenLoggedIn: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={scrolled ? 'scrolled' : ''}>

      {/* Logo */}
      <Link to="/home" className="logo">
        <svg className="logo-icon" viewBox="0 0 32 32" fill="none">
          <path d="M16 2C16 2 4 8 4 20C4 26 9 30 16 30C23 30 28 26 28 20C28 8 16 2 16 2Z" fill="#5a7a52" />
          <path d="M16 7C16 7 7 12 7 20C7 24 11 27 16 27" fill="#7eab6e" />
          <line x1="16" y1="30" x2="16" y2="15" stroke="#2c4227" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        EcoAdvocate
      </Link>

      {/* Nav */}
      <nav>
        {navItems.map(({ label, path, requiresAuth, requiresAdmin, hideWhenLoggedIn, guestOnly }) => {
          if (requiresAdmin    && !isAdmin)    return null;
          if (requiresAuth     && !isLoggedIn) return null;
          if (hideWhenLoggedIn && isLoggedIn)  return null;
          if (guestOnly        && isLoggedIn)  return null;

          return (
            <Link
              key={label}
              to={path}
              className={`nav-btn${location.pathname === path ? ' active' : ''}`}
            >
              {label}
            </Link>
          );
        })}

        {isLoggedIn && (
          <button className="nav-btn" onClick={handleLogout}>
            Logout
          </button>
        )}

        <button
          className="dark-toggle"
          onClick={() => setDarkMode(prev => !prev)}
          aria-label="Toggle dark mode"
          title={darkMode ? 'Switch to Light' : 'Switch to Dark'}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </nav>

    </header>
  );
};

export default Header;