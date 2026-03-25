import { mockOrders } from '../../data/mock';
import { useData } from '../../context/DataContext';

interface TimelineStep {
  label: string;
  detail: string;
  status: 'completed' | 'current' | 'future';
}

export default function DeliveryTimelineBox() {
  const { orders } = useData();

  // Use live orders if available, otherwise fall back to mock
  const displayOrders = orders.length > 0 ? orders : mockOrders;
  const order = displayOrders[0];
  const storeName = (order.storeName || order.store_name || 'Order').split(' \u2014 ')[0];

  // Build timeline steps based on order status
  const buildSteps = (): TimelineStep[] => {
    const status = order.status;
    if (status === 'delivered') {
      return [
        { label: 'Ordered', detail: '', status: 'completed' },
        { label: 'Packing', detail: '', status: 'completed' },
        { label: 'On the way', detail: '', status: 'completed' },
        { label: 'Delivered', detail: '', status: 'completed' },
      ];
    }
    if (status === 'delivering') {
      return [
        { label: 'Ordered', detail: '10:30 AM', status: 'completed' },
        { label: 'Packing', detail: `${order.items?.length || 0} items`, status: 'completed' },
        { label: 'On the way', detail: '~15 min left', status: 'current' },
        { label: 'Delivered', detail: '', status: 'future' },
      ];
    }
    // Default / pending
    return [
      { label: 'Ordered', detail: '', status: 'current' },
      { label: 'Packing', detail: '', status: 'future' },
      { label: 'On the way', detail: '', status: 'future' },
      { label: 'Delivered', detail: '', status: 'future' },
    ];
  };

  const steps = buildSteps();

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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--success-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            color: 'var(--foreground)',
          }}
        >
          {storeName}
        </span>
      </div>

      {/* Timeline */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.label}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                position: 'relative',
                marginBottom: isLast ? 0 : 12,
              }}
            >
              {/* Left indicator */}
              <div
                style={{
                  position: 'relative',
                  width: 20,
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {/* Circle */}
                {step.status === 'completed' && (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                {step.status === 'current' && (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      position: 'relative',
                      zIndex: 1,
                      boxShadow: '0 0 0 4px var(--accent-bg)',
                    }}
                    className="pulse-dot"
                  />
                )}
                {step.status === 'future' && (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'transparent',
                      border: '2px solid var(--foreground-hint)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                )}

                {/* Connecting line */}
                {!isLast && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 2,
                      bottom: -12,
                      background: 'var(--border)',
                    }}
                  />
                )}
              </div>

              {/* Right content */}
              <div style={{ paddingTop: 0 }}>
                <div
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    color:
                      step.status === 'future'
                        ? 'var(--foreground-hint)'
                        : 'var(--foreground)',
                    lineHeight: 1.3,
                  }}
                >
                  {step.label}
                </div>
                {step.detail && (
                  <div
                    style={{
                      fontFamily: "'Nunito', sans-serif",
                      fontSize: 9,
                      color: 'var(--foreground-muted)',
                      lineHeight: 1.3,
                    }}
                  >
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom ETA */}
      {order.status === 'delivering' && (
        <div style={{ marginTop: 'auto', paddingTop: 8 }}>
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              color: 'var(--warning)',
            }}
          >
            ETA: ~15 min
          </span>
        </div>
      )}
    </div>
  );
}
