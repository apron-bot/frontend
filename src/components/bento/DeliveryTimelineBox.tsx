import { mockOrders } from '../../data/mock';

interface TimelineStep {
  label: string;
  detail: string;
  status: 'completed' | 'current' | 'future';
}

export default function DeliveryTimelineBox() {
  const order = mockOrders[0];
  const storeName = order.storeName.split(' \u2014 ')[0];

  const steps: TimelineStep[] = [
    { label: 'Ordered', detail: '10:30 AM', status: 'completed' },
    { label: 'Packing', detail: '12 items', status: 'completed' },
    { label: 'On the way', detail: '\uD83D\uDEF5 15 min left', status: 'current' },
    { label: 'Delivered', detail: '', status: 'future' },
  ];

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
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {order.emoji}
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
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 700,
                      lineHeight: 1,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    &#10003;
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
    </div>
  );
}
