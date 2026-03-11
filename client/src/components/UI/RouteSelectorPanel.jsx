import { useState } from 'react';
import { X, ChevronRight, ChevronDown, Route } from 'lucide-react';
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
  const destination = useAvayaStore((s) => s.destination);
  const selectRoute = useAvayaStore((s) => s.selectRoute);
  const clearRoute = useAvayaStore((s) => s.clearRoute);

  // Local expanded state for accordion
  const [expandedIdx, setExpandedIdx] = useState(null);

  if (!allRoutes.length) return null;

  const handleCardClick = (idx) => {
    selectRoute(idx);
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

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
        </button>
      </div>

      {/* Destination label */}
      {destination?.name && (
        <p style={{ padding: '8px 20px 0', fontSize: '12px', color: '#6b6b6b', flexShrink: 0 }}>
          📍 To: <span style={{ color: '#e8a020' }}>{destination.name.split(',').slice(0, 2).join(',')}</span>
        </p>
      )}

      {/* Route cards (accordion) */}
      <div style={{ overflowY: 'auto', padding: '10px 16px 16px', flex: 1 }}>
        {allRoutes.map((route, idx) => {
          const meta = route.metadata;
          const avgScore = meta.avgSafetyScore;
          const color = getSafetyColor(avgScore);
          const isSelected = idx === selectedRouteIndex;
          const isExpanded = idx === expandedIdx;
          const routeColor = ROUTE_COLORS[idx % ROUTE_COLORS.length];
          const segments = route.features ?? [];

          return (
            <div key={idx} style={{ marginBottom: '8px' }}>
              {/* Route summary card */}
              <button
                type="button"
                onClick={() => handleCardClick(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: isExpanded ? `${routeColor}15` : isSelected ? `${routeColor}10` : '#fdf9f3',
                  borderRadius: isExpanded ? '12px 12px 0 0' : '12px',
                  border: isExpanded
                    ? `1.5px solid ${routeColor}60`
                    : isSelected
                      ? `1.5px solid ${routeColor}40`
                      : '1.5px solid #e8e6e0',
                  borderBottom: isExpanded ? `1px solid ${routeColor}30` : undefined,
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
                          background: 'rgba(20,20,20,0.9)',
                          color: '#ffffff',
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

                {/* Safety badge + chevron */}
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
                  {isExpanded
                    ? <ChevronDown size={14} color="#6b6b6b" />
                    : <ChevronRight size={14} color="#6b6b6b" />}
                </div>
              </button>

              {/* Expanded segment breakdown */}
              {isExpanded && segments.length > 0 && (
                <div
                  style={{
                    background: `${routeColor}08`,
                    border: `1.5px solid ${routeColor}60`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    padding: '12px 16px 14px',
                  }}
                >
                  <div style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#6b6b6b',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '10px',
                  }}>
                    Segment Breakdown
                  </div>
                  {segments.map((feature, sIdx) => {
                    const p = feature?.properties ?? {};
                    const segScore = p.final_safety_score;
                    const segColor = getSafetyColor(segScore);

                    return (
                      <div
                        key={sIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 0',
                          borderBottom: sIdx < segments.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: segColor,
                            flexShrink: 0,
                          }} />
                          <span style={{
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#141414',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {p.road_name || `Segment ${sIdx + 1}`}
                          </span>
                        </div>
                        <span
                          style={{
                            color: segColor,
                            fontSize: '13px',
                            fontWeight: 600,
                            flexShrink: 0,
                            marginLeft: '8px',
                          }}
                        >
                          {typeof segScore === 'number' ? segScore.toFixed(1) : '–'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
