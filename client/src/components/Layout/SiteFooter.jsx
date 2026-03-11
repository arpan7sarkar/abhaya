import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const productLinks = [
  { to: '/map', label: 'Live Map' },
  { to: '/map', label: 'Safety Scores' },
  { to: '/map', label: 'Emergency SOS' },
  { to: '/#how-it-works', label: 'How it Works' },
];

const companyLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/safety-tips', label: 'Safety Tips' },
];

export default function SiteFooter() {
  return (
    <footer style={{ background: 'var(--white)', padding: '64px 8% 40px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '80px', marginBottom: '64px' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', textDecoration: 'none' }}>
              <Shield size={24} color="var(--gold)" />
              <span className="font-garamond" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>Avaya</span>
            </Link>
            <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '280px', lineHeight: 1.6 }}>
              Your ultimate companion for secure, confident city travel.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'var(--ink)' }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {productLinks.map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--gold)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px', color: 'var(--ink)' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {companyLinks.map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  style={{ color: 'var(--muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--gold)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--muted)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '32px', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '13px' }}>© {new Date().getFullYear()} Avaya Network. All rights reserved.</div>
          <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Emergency: <strong style={{ color: '#e04040' }}>100</strong></div>
        </div>
      </div>
    </footer>
  );
}
