import { X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

const typeStyles = {
  success: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', color: '#22c55e' },
  error: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', color: '#ef4444' },
  info: { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', color: '#3b82f6' },
  warning: { bg: 'rgba(182, 0, 0, 0.2)', border: 'rgba(165, 0, 0, 1)', color: '#ff0000ff' },
};

export default function Toast() {
  const toasts = useToastStore((s) => s.toasts);
  const dismissToast = useToastStore((s) => s.dismissToast);

  if (!toasts.length) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '90%',
        maxWidth: '400px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(({ id, message, type }) => {
        const s = typeStyles[type] || typeStyles.info;
        return (
          <div
            key={id}
            className="animate-fade-in"
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: '12px',
              color: s.color,
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}
          >
            <span style={{ flex: 1 }}>{message}</span>
            <button
              type="button"
              onClick={() => dismissToast(id)}
              aria-label="Dismiss"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                opacity: 0.8,
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
