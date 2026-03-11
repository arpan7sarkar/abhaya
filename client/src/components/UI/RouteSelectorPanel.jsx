import { X, Navigation, Shield, ChevronRight, Route } from 'lucide-react';
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

const ROUTE_COLORS = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'];

export default function RouteSelectorPanel() {
  const allRoutes = useAvayaStore((s) => s.allRoutes);
  const selectedRouteIndex = useAvayaStore((s) => s.selectedRouteIndex);
  const routeViewMode = useAvayaStore((s) => s.routeViewMode);
  const destination = useAvayaStore((s) => s.destination);
  const selectRoute = useAvayaStore((s) => s.selectRoute);
  const showSafestRoute = useAvayaStore((s) => s.showSafestRoute);
  const setRouteViewMode = useAvayaStore((s) => s.setRouteViewMode);
  const clearRoute = useAvayaStore((s) => s.clearRoute);

  if (!allRoutes.length || routeViewMode !== 'select') return null;

  return (
    <div
      className="panel-card animate-slide-up"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        maxHeight: '50vh',
        borderRadius: '20px 20px 0 0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
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
          <Route size={16} color="#60a5fa" />
          <span style={{ fontWeight: 600, fontSize: '15px', color: '#141414' }}>
            {allRoutes.length} Route{allRoutes.length > 1 ? 's' : ''} Found
          </span>
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

      {/* Destination label */}
      {destination?.name && (
        <p style={{ padding: '8px 20px 0', fontSize: '12px', color: '#6b6b6b', flexShrink: 0 }}>
          To: <span style={{ color: '#e8a020' }}>{destination.name.split(',').slice(0, 2).join(',')}</span>
        </p>
      )}

      {/* Route cards */}
      <div style={{ overflowY: 'auto', padding: '10px 16px 12px', flex: 1 }}>
        {allRoutes.map((route, idx) => {
          const meta = route.metadata;
          const avgScore = meta.avgSafetyScore;
          const color = getSafetyColor(avgScore);
          const isSelected = idx === selectedRouteIndex;
          const routeColor = ROUTE_COLORS[idx % ROUTE_COLORS.length];

          return (
            <button
              key={idx}
              type="button"
              onClick={() => selectRoute(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                marginBottom: '8px',
                background: isSelected ? `${routeColor}15` : '#fdf9f3',
                borderRadius: '12px',
                border: isSelected ? `1.5px solid ${routeColor}60` : '1.5px solid #e8e6e0',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Route color indicator */}
              <div
                style={{
                  width: '4px',
                  height: '36px',
                  borderRadius: '4px',
                  background: routeColor,
                  flexShrink: 0,
                }}
              />

              {/* Route info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#141414' }}>
                    Route {idx + 1}
                  </span>
                  {meta.isSafest && (
                    <span
                      style={{
                        background: 'rgba(34,197,94,0.15)',
                        color: '#22c55e',
                        border: '1px solid rgba(34,197,94,0.3)',
                        borderRadius: '20px',
                        padding: '1px 8px',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Safest
                    </span>
                  )}
                  {meta.isShortest && (
                    <span
                      style={{
                        background: 'rgba(96,165,250,0.15)',
                        color: '#60a5fa',
                        border: '1px solid rgba(96,165,250,0.3)',
                        borderRadius: '20px',
                        padding: '1px 8px',
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Shortest
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#6b6b6b' }}>
                  <span>{meta.segmentCount} segment{meta.segmentCount !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>{meta.totalDistanceKm != null
                    ? meta.totalDistanceKm < 1
                      ? `${Math.round(meta.totalDistanceKm * 1000)} m`
                      : `${meta.totalDistanceKm} km`
                    : `Cost: ${meta.totalCost}`}</span>
                </div>
              </div>

              {/* Safety badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span
                  style={{
                    background: `${color}20`,
                    color,
                    border: `1px solid ${color}40`,
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {avgScore !== null ? `${avgScore} · ${getSafetyLabel(avgScore)}` : '—'}
                </span>
                <ChevronRight size={14} color="#6b6b6b" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom actions */}
      <div
        style={{
          padding: '10px 16px 18px',
          borderTop: '1px solid #e8e6e0',
          display: 'flex',
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={showSafestRoute}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '12px',
            color: '#22c55e',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          <Shield size={16} />
          Show Safest Route
        </button>

        <button
          type="button"
          onClick={() => setRouteViewMode('detail')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '12px 16px',
            background: '#fdf9f3',
            border: '1px solid #e8e6e0',
            borderRadius: '12px',
            color: '#141414',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
        >
          <Navigation size={14} />
          Details
        </button>
      </div>
    </div>
  );
}
