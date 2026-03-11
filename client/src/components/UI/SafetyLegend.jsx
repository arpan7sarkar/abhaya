export default function SafetyLegend() {
  const items = [
    { color: '#22c55e', label: 'Safe', range: '7–10' },
    { color: '#f59e0b', label: 'Moderate', range: '4–6.9' },
    { color: '#ef4444', label: 'Unsafe', range: '0–3.9' },
  ];

  return (
    <div
      className="panel-card"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '16px',
        zIndex: 1000,
        padding: '12px 14px',
        minWidth: '140px',
      }}
    >
      <p
        style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#6b6b6b',
          marginBottom: '10px',
        }}
      >
        Safety
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {items.map(({ color, label, range }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
                boxShadow: `0 0 6px ${color}60`,
              }}
            />
            <span style={{ fontSize: '12px', color: '#141414', fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: '11px', color: '#6b6b6b', marginLeft: 'auto' }}>{range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
