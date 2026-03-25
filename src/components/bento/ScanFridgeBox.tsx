import ramenImg from '../../assets/ramen.png';
import { mockFridgeChanges } from '../../data/mock';

export default function ScanFridgeBox() {
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
        {/* Left column — fridge scan image */}
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
            <span role="img" aria-label="camera">
              {'📷'}
            </span>
          </div>
        </div>

        {/* Right column — scan results scoreboard */}
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
            }}
          >
            SCAN RESULTS
          </span>

          {/* Changes list */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {mockFridgeChanges.map((item, i) => (
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
                <span style={{ fontSize: 14 }}>{item.emoji}</span>
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
