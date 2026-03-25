import SlideUpSheet from '../shared/SlideUpSheet';
import Badge from '../shared/Badge';
import { useData } from '../../context/DataContext';
import { mockIngredients } from '../../data/mock';

interface PantryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PantryOverlay({ isOpen, onClose }: PantryOverlayProps) {
  const { inventory } = useData();

  // Use live inventory if available, otherwise fall back to mock data
  const hasLiveData = inventory.length > 0;

  // Source badge color helper
  const sourceColor = (source: string) => {
    switch (source) {
      case 'scan':
        return { color: 'var(--accent)', bg: 'var(--accent-bg)' };
      case 'receipt':
        return { color: 'var(--success)', bg: 'var(--success-bg)' };
      case 'manual':
        return { color: 'var(--foreground-muted)', bg: 'var(--background-tertiary)' };
      default:
        return { color: 'var(--foreground-muted)', bg: 'var(--background-tertiary)' };
    }
  };

  return (
    <SlideUpSheet isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-heading font-extrabold" style={{ fontSize: 18, color: 'var(--foreground)' }}>
            Pantry
          </span>
          <Badge color="var(--foreground-muted)" bg="var(--background-tertiary)">
            {hasLiveData ? inventory.length : mockIngredients.length}
          </Badge>
        </div>
        {hasLiveData && (
          <Badge color="var(--success)" bg="var(--success-bg)">
            Live
          </Badge>
        )}
      </div>

      {/* Items list */}
      <div style={{ paddingBottom: 16 }}>
        {hasLiveData ? (
          // Live inventory from backend
          inventory.length === 0 ? (
            <div
              className="font-body"
              style={{
                textAlign: 'center',
                padding: 32,
                color: 'var(--foreground-muted)',
                fontSize: 13,
              }}
            >
              No items in your pantry yet. Scan your fridge or add items via Telegram!
            </div>
          ) : (
            inventory.map((item) => {
              const sc = sourceColor(item.source);
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    {/* Food icon placeholder */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'var(--background-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" />
                        <line x1="10" y1="1" x2="10" y2="4" />
                        <line x1="14" y1="1" x2="14" y2="4" />
                      </svg>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        className="font-body font-bold"
                        style={{
                          fontSize: 13,
                          color: 'var(--foreground)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span
                          className="font-body"
                          style={{ fontSize: 11, color: 'var(--foreground-muted)' }}
                        >
                          {item.quantity} {item.unit}
                        </span>
                        {item.source && (
                          <Badge color={sc.color} bg={sc.bg}>
                            {item.source}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {item.expiry_date && (
                    <span
                      className="font-body"
                      style={{ fontSize: 10, color: 'var(--warning)', flexShrink: 0, marginLeft: 8 }}
                    >
                      exp {new Date(item.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              );
            })
          )
        ) : (
          // Mock data fallback
          mockIngredients.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'var(--background-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    className="font-body font-bold"
                    style={{ fontSize: 13, color: 'var(--foreground)' }}
                  >
                    {item.name}
                  </div>
                  <span
                    className="font-body"
                    style={{ fontSize: 11, color: item.isLowStock ? 'var(--danger)' : 'var(--foreground-muted)' }}
                  >
                    {item.quantity}
                  </span>
                </div>
              </div>
              <Badge
                color="var(--foreground-muted)"
                bg="var(--background-tertiary)"
              >
                {item.category}
              </Badge>
            </div>
          ))
        )}
      </div>
    </SlideUpSheet>
  );
}
