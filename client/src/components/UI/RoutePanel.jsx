import { X, Navigation, ArrowLeft } from 'lucide-react';
import { useAvayaStore } from '../../store/useAvayaStore';

const getSafetyColor = (score) => {
  if (typeof score !== 'number') return '#8a8f9e';
  if (score >= 7) return '#22c55e';
  if (score >= 4) return '#f59e0b';
  return '#ef4444';
};

const getSafetyLabel = (score) => {
  if (typeof score !== 'number') return '—';
  if (score >= 7) return 'Safe';
  if (score >= 4) return 'Moderate';
  return 'Unsafe';
};

export default function RoutePanel() {
  const allRoutes = useAvayaStore((s) => s.allRoutes);
  const selectedRouteIndex = useAvayaStore((s) => s.selectedRouteIndex);
  const routeViewMode = useAvayaStore((s) => s.routeViewMode);
  const destination = useAvayaStore((s) => s.destination);
  const clearRoute = useAvayaStore((s) => s.clearRoute);
  const setRouteViewMode = useAvayaStore((s) => s.setRouteViewMode);

  // Only render in 'detail' mode
  if (routeViewMode !== 'detail' || !allRoutes.length) return null;

  const activeRoute = allRoutes[selectedRouteIndex]?.features ?? [];
  const meta = allRoutes[selectedRouteIndex]?.metadata;

  if (!activeRoute.length) return null;

  const scores = activeRoute
    .map((f) => f?.properties?.final_safety_score)
    .filter((s) => typeof s === 'number');
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : null;

  const hasMultipleRoutes = allRoutes.length > 1;

  return (
    <div
      className="panel-card animate-slide-up"
      style={{
        position: 'fixed',
        top: '90px',
        right: '24px',
        width: 'calc(100vw - 48px)',
        maxWidth: '380px',
        zIndex: 1000,
        maxHeight: 'calc(100vh - 120px)',
        borderRadius: '20px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
        background: '#ffffff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px 12px',
          borderBottom: '1px solid #e8e6e0',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {hasMultipleRoutes && (
            <button
              type="button"
              onClick={() => setRouteViewMode('select')}
              style={{
                background: '#f7f6f2',
                border: 'none',
                borderRadius: '6px',
                color: '#6b6b6b',
                cursor: 'pointer',
                padding: '4px 6px',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'inherit',
              }}
              title="Back to all routes"
            >
              <ArrowLeft size={14} />
            </button>
          )}
          <Navigation size={16} color="#e8a020" />
          <span style={{ fontWeight: 600, fontSize: '15px', color: '#141414' }}>
            {hasMultipleRoutes ? `Route ${selectedRouteIndex + 1}` : 'Route'}
            {meta?.isSafest && (
              <span style={{ fontSize: '11px', color: '#22c55e', marginLeft: '8px', fontWeight: 500 }}>
                🛡️ Safest
              </span>
            )}
            {meta?.isShortest && (
              <span style={{ fontSize: '11px', color: '#60a5fa', marginLeft: '8px', fontWeight: 500 }}>
                ⚡ Shortest
              </span>
            )}
          </span>
          {avgScore && (
            <span
              style={{
                background: `${getSafetyColor(parseFloat(avgScore))}20`,
                color: getSafetyColor(parseFloat(avgScore)),
                border: `1px solid ${getSafetyColor(parseFloat(avgScore))}40`,
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {avgScore} avg
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={clearRoute}
          style={{
            background: '#f7f6f2',
            border: 'none',
            borderRadius: '8px',
            color: '#6b6b6b',
            cursor: 'pointer',
            padding: '6px 10px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'inherit',
          }}
        >
          <X size={13} />
          Clear
        </button>
      </div>

      {destination?.name && (
        <p style={{ padding: '8px 20px 0', fontSize: '12px', color: '#6b6b6b', flexShrink: 0 }}>
          To: <span style={{ color: '#e8a020' }}>{destination.name.split(',').slice(0, 2).join(',')}</span>
        </p>
      )}

      <div style={{ overflowY: 'auto', padding: '10px 16px 20px', flex: 1 }}>
        {activeRoute.map((feature, idx) => {
          const p = feature?.properties ?? {};
          const score = p.final_safety_score;
          const color = getSafetyColor(score);

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                marginBottom: '6px',
                background: '#fdf9f3',
                borderRadius: '10px',
                borderLeft: `3px solid ${color}`,
                border: '1px solid #e8e6e0' // add border to make it pop slightly
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#141414',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {p.road_name || `Segment ${idx + 1}`}
                </p>
                {p.road_type && (
                  <p style={{ fontSize: '11px', color: '#6b6b6b', marginTop: '2px' }}>{p.road_type}</p>
                )}
              </div>
              <span
                style={{
                  background: `${color}20`,
                  color,
                  border: `1px solid ${color}40`,
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {typeof score === 'number' ? score.toFixed(1) : '–'} · {getSafetyLabel(score)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
