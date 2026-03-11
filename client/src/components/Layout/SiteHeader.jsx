import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { Show, UserButton, useUser } from '@clerk/react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/map', label: 'Map' },
  { to: '/community', label: 'Community' },
  { to: '/safety-tips', label: 'Safety Tips' },
  { to: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header className="site-header">
        {/* Left: Logo */}
        <Link to="/" className="site-header__logo">
          <Shield size={28} color="#e8a020" strokeWidth={2} />
          <span className="font-playfair site-header__logo-text">Avaya</span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="site-header__desktop-nav" aria-label="Main navigation">
          <Show when="signed-in">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`site-header__nav-link ${isActive ? 'site-header__nav-link--active' : ''}`}
                >
                  {label}
                </Link>
              );
            })}
          </Show>
        </nav>

        {/* Right: Auth & Mobile Menu Button */}
        <div className="site-header__actions">
          <Show when="signed-out">
            <div className="site-header__auth-buttons">
              <Link to="/sign-in" className="site-header__login-btn">
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/sign-up" className="site-header__signup-btn">
                <UserPlus size={18} />
                Sign Up
              </Link>
            </div>
          </Show>
          <Show when="signed-in">
            <div className="site-header__user-pill">
              <UserButton showName={true} />
            </div>
            {/* On small screens, hide the name and show compact */}
            <div className="site-header__user-pill--compact">
              <UserButton showName={false} />
            </div>
          </Show>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="site-header__mobile-toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay + drawer */}
      {mobileOpen && (
        <>
          <div className="site-header__overlay" onClick={() => setMobileOpen(false)} />
          <div className="site-header__mobile-drawer animate-fade-in">
            <Show when="signed-in">
              {navLinks.map(({ to, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`site-header__mobile-link ${isActive ? 'site-header__mobile-link--active' : ''}`}
                  >
                    {label}
                  </Link>
                );
              })}
            </Show>
            <Show when="signed-out">
              <div className="site-header__mobile-auth">
                <Link to="/sign-in" onClick={() => setMobileOpen(false)} className="site-header__mobile-login">
                  <LogIn size={18} />
                  Login
                </Link>
                <Link to="/sign-up" onClick={() => setMobileOpen(false)} className="site-header__mobile-signup">
                  <UserPlus size={18} />
                  Sign Up
                </Link>
              </div>
            </Show>
          </div>
        </>
      )}
    </>
  );
}
