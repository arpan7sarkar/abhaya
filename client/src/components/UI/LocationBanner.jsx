import { useState } from 'react';
import { MapPin, X } from 'lucide-react';

export default function LocationBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        top: '90px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2500,
        width: '92%',
        maxWidth: '520px',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2117 100%)',
          border: '1px solid rgba(203, 160, 82, 0.35)',
          borderRadius: '16px',
          padding: '20px 22px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(203,160,82,0.1)',
          color: '#fff',
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(203, 160, 82, 0.15)',
              border: '1px solid rgba(203, 160, 82, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={18} color="#CBA052" />
          </div>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#CBA052',
              letterSpacing: '0.02em',
            }}
          >
            Location Notice
          </span>
        </div>

        {/* Message */}
        <p
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'rgba(255,255,255,0.85)',
            margin: '0 0 18px 0',
            fontWeight: 400,
          }}
        >
          If your live location is not near <strong style={{ color: '#CBA052' }}>Barasat</strong>, manually update your location near Barasat to test this feature. Since our database is limited to the Barasat region, we will update it to your location soon.
        </p>

        {/* OK Button */}
        <button
          type="button"
          onClick={() => setVisible(false)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid rgba(203, 160, 82, 0.4)',
            background: 'rgba(203, 160, 82, 0.12)',
            color: '#CBA052',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit, sans-serif',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(203, 160, 82, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(203, 160, 82, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(203, 160, 82, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(203, 160, 82, 0.4)';
          }}
        >
          OK, Got it
        </button>
      </div>
    </div>
  );
}
