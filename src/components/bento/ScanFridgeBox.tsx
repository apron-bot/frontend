import ramenImg from '../../assets/ramen.png';
import { mockFridgeChanges } from '../../data/mock';
import { useData } from '../../context/DataContext';

export default function ScanFridgeBox() {
  const { inventory, fridgeChanges } = useData();

  // Use live fridge changes from SSE if available, otherwise fall back to mock
  const hasLiveChanges = fridgeChanges.length > 0;
  const displayChanges = hasLiveChanges
    ? fridgeChanges.map((c) => ({ delta: c.delta, name: c.name }))
    : mockFridgeChanges;

  return (
    <div
      style={{
        height: '100%',
        background: 'var(--background-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        padding: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Left column -- fridge scan image */}
        <div
          style={{
            flex: '0 0 40%',
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            background: 'var(--background-secondary)',
            overflow: 'hidden',
          }}
        >
          <img
            src={ramenImg}
            alt="Fridge scan"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'var(--radius-md)',
            }}
          />
          {/* Camera icon overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 12,
              lineHeight: 1,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          {/* Live inventory count badge */}
          {inventory.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: 9999,
                padding: '2px 6px',
                fontSize: 9,
                fontWeight: 700,
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {inventory.length} items
            </div>
          )}
        </div>

        {/* Right column -- scan results scoreboard */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <span
            className="font-body font-extrabold"
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--accent)',
              marginBottom: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            SCAN RESULTS
            {hasLiveChanges && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--success)',
                  display: 'inline-block',
                }}
              />
            )}
          </span>

          {/* Changes list */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {displayChanges.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 0',
                }}
              >
                <span
                  className="font-body font-extrabold"
                  style={{
                    fontSize: 13,
                    color:
                      item.delta > 0 ? 'var(--success)' : 'var(--danger)',
                    minWidth: 28,
                  }}
                >
                  {item.delta > 0 ? `+${item.delta}` : item.delta}
                </span>
                {/* SVG food icon instead of emoji */}
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                </span>
                <span
                  className="font-body font-normal"
                  style={{ fontSize: 12, color: 'var(--foreground)' }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          {/* See more link */}
          <span
            className="font-body font-bold"
            style={{
              marginTop: 'auto',
              fontSize: 11,
              color: 'var(--accent)',
              cursor: 'pointer',
            }}
          >
            See more &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}
