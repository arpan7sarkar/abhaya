import { MapPin, LocateFixed } from 'lucide-react';
import { useAvayaStore } from '../../store/useAvayaStore';
import { useToastStore } from '../../store/useToastStore';

export default function LocationModeToggle() {
  const locationMode = useAvayaStore((s) => s.locationMode);
  const setLocationMode = useAvayaStore((s) => s.setLocationMode);
  const addToast = useToastStore((s) => s.addToast);

  const isLive = locationMode === 'live';

  const toggle = () => {
    if (isLive) {
      setLocationMode('manual');
      addToast('Manual mode — tap anywhere on the map to set location', 'info');
    } else {
      setLocationMode('live');
      addToast('Switched to live GPS location', 'success');
    }
  };

  return (
    <div
      className="panel-card"
      style={{
        position: 'fixed',
        top: '70px',
        left: '16px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '4px',
        borderRadius: '14px',
      }}
    >
      <button
        type="button"
        onClick={() => { if (!isLive) toggle(); }}
        aria-label="Use live GPS location"
        title="Live GPS"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '12px',
          fontWeight: 600,
          background: isLive ? 'rgba(34,197,94,0.15)' : 'transparent',
          color: isLive ? '#22c55e' : '#6b6b6b',
          transition: 'all 0.2s ease',
        }}
      >
        <LocateFixed size={16} strokeWidth={2.2} />
        <span>Live</span>
      </button>

      <button
        type="button"
        onClick={() => { if (isLive) toggle(); }}
        aria-label="Set location manually"
        title="Manual — tap to set location on map"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: '12px',
          fontWeight: 600,
          background: !isLive ? 'rgba(232,160,32,0.15)' : 'transparent',
          color: !isLive ? '#e8a020' : '#6b6b6b',
          transition: 'all 0.2s ease',
        }}
      >
        <MapPin size={16} strokeWidth={2.2} />
        <span>Manual</span>
      </button>
    </div>
  );
}
