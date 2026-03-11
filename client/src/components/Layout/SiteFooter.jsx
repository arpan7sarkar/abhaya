import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const productLinks = [
  { to: '/map', label: 'Live Map' },
  { to: '/map', label: 'Safety Scores' },
  { to: '/map', label: 'Emergency SOS' },
  { to: '/community', label: 'Community' },
];

const companyLinks = [
  { to: '/contact', label: 'Contact' },
  { to: '/safety-tips', label: 'Safety Tips' },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          {/* Brand */}
          <div className="site-footer__brand">
            <Link to="/" className="site-footer__logo">
              <Shield size={24} color="var(--gold)" />
              <span className="font-garamond site-footer__logo-text">Avaya</span>
            </Link>
            <p className="site-footer__tagline">
              Your ultimate companion for secure, confident city travel.
            </p>
          </div>

          {/* Product */}
          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Product</h4>
            <div className="site-footer__col-links">
              {productLinks.map(({ to, label }) => (
                <Link key={label} to={to} className="site-footer__link">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="site-footer__col">
            <h4 className="site-footer__col-title">Company</h4>
            <div className="site-footer__col-links">
              {companyLinks.map(({ to, label }) => (
                <Link key={label} to={to} className="site-footer__link">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="site-footer__bottom">
          <div className="site-footer__copyright">
            © {new Date().getFullYear()} Avaya Network. All rights reserved.
          </div>
          <div className="site-footer__emergency">
            Emergency: <strong style={{ color: '#e04040' }}>100</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
