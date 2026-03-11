import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function HeaderBadge() {
  return (
    <Link
      to="/"
      className="panel-card"
      style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '12px',
        textDecoration: 'none',
        color: 'inherit',
      }}
      aria-label="Avaya - Go to home"
    >
      <Shield size={20} color="#e8a020" strokeWidth={2.2} />
      <span className="font-playfair" style={{ fontWeight: 800, fontSize: '18px', color: '#141414', letterSpacing: '-0.01em' }}>
        Avaya
      </span>
    </Link>
  );
}
