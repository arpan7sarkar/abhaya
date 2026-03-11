import { X, AlertTriangle } from 'lucide-react';
import { useAvayaStore } from '../../store/useAvayaStore';

export default function SOSModal() {
  const sosResult = useAvayaStore((s) => s.sosResult);
  const sosModalOpen = useAvayaStore((s) => s.sosModalOpen);
  const setSosModalOpen = useAvayaStore((s) => s.setSosModalOpen);

  if (!sosModalOpen || !sosResult) return null;

  const distKm = sosResult.distance_meters
    ? (sosResult.distance_meters / 1000).toFixed(1)
    : null;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setSosModalOpen(false);
      }}
      onKeyDown={(e) => e.key === 'Escape' && setSosModalOpen(false)}
    >
      <div
        className="panel-card animate-scale-in"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '360px',
          padding: '28px 24px',
          borderRadius: '20px',
        }}
        role="dialog"
        aria-labelledby="sos-modal-title"
      >
        <button
          onClick={() => setSosModalOpen(false)}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f7f6f2',
            border: 'none',
            borderRadius: '8px',
            color: '#6b6b6b',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            style={{
              background: 'rgba(220,38,38,0.15)',
              borderRadius: '10px',
              padding: '8px',
              display: 'flex',
            }}
          >
            <AlertTriangle size={22} color="#ef4444" />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: '#6b6b6b', marginBottom: '2px', fontWeight: 500 }}>
              NEAREST POLICE STATION
            </p>
            <h3 id="sos-modal-title" style={{ fontSize: '16px', fontWeight: 700, color: '#141414' }}>
              Nearest Police Station
            </h3>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#141414', marginBottom: '6px' }}>
            {sosResult.name}
          </p>
          {sosResult.address && (
            <p style={{ fontSize: '13px', color: '#6b6b6b', marginBottom: '10px', lineHeight: '1.5' }}>
              {sosResult.address}
            </p>
          )}
          {distKm && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#f7f6f2',
                border: '1px solid #e8e6e0',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '12px',
                color: '#e8a020',
                fontWeight: 600,
              }}
            >
              📍 {distKm} km away
            </span>
          )}
        </div>

        <a
          href={`tel:${sosResult.phone || '100'}`}
          style={{
            display: 'block',
            textAlign: 'center',
            background: '#e8a020',
            color: '#ffffff',
            padding: '13px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '15px',
            textDecoration: 'none',
            letterSpacing: '0.02em',
          }}
          rel="noopener noreferrer"
        >
          📞 Call Now
        </a>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#6b6b6b', marginTop: '10px' }}>
          You can also call emergency: <strong style={{ color: '#141414' }}>100</strong>
        </p>
      </div>
    </div>
  );
}
