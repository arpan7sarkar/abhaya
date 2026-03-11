import { X } from 'lucide-react';
import { useAvayaStore } from '../../store/useAvayaStore';

export default function ErrorBanner() {
  const error = useAvayaStore((s) => s.error);
  const clearError = useAvayaStore((s) => s.clearError);

  if (!error) return null;

  return (
    <div
      className="animate-fade-in"
      role="alert"
      style={{
        position: 'fixed',
        top: '70px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1500,
        width: 'calc(100% - 32px)',
        maxWidth: '440px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.4)',
        borderRadius: '12px',
        color: '#ef4444',
        fontSize: '13px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <span style={{ flex: 1 }}>{error}</span>
      <button
        type="button"
        onClick={clearError}
        aria-label="Dismiss"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          opacity: 0.9,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
