import { Shield } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#fdf9f3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        <div
          className="animate-pulse-ring"
          style={{
            position: 'absolute',
            inset: '-16px',
            borderRadius: '50%',
            border: '2px solid rgba(232, 160, 32, 0.4)',
          }}
        />
        <div
          className="animate-spin-shield"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
          }}
        >
          <Shield size={48} color="#e8a020" strokeWidth={1.5} />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '15px', color: '#141414', fontWeight: 600, marginBottom: '4px' }}>
          Getting your location…
        </p>
        <p style={{ fontSize: '13px', color: '#6b6b6b' }}>Please allow location access</p>
      </div>
    </div>
  );
}
