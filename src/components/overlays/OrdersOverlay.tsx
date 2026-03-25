import SlideUpSheet from '../shared/SlideUpSheet';
import Badge from '../shared/Badge';
import { useData } from '../../context/DataContext';
import { mockOrders } from '../../data/mock';

interface OrdersOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrdersOverlay({ isOpen, onClose }: OrdersOverlayProps) {
  const { orders } = useData();

  // Use live orders if available, otherwise fall back to mock data
  const hasLiveData = orders.length > 0;
  const displayOrders = hasLiveData ? orders : mockOrders;

  // Status badge style
  const statusStyle = (status: string) => {
    switch (status) {
      case 'delivering':
        return { color: 'var(--warning)', bg: 'var(--warning-bg, rgba(255,170,0,0.1))' };
      case 'delivered':
        return { color: 'var(--success)', bg: 'var(--success-bg)' };
      case 'pending':
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
            Orders
          </span>
          <Badge color="var(--foreground-muted)" bg="var(--background-tertiary)">
            {displayOrders.length}
          </Badge>
        </div>
        {hasLiveData && (
          <Badge color="var(--success)" bg="var(--success-bg)">
            Live
          </Badge>
        )}
      </div>

      {/* Orders list */}
      <div style={{ paddingBottom: 16 }}>
        {displayOrders.length === 0 ? (
          <div
            className="font-body"
            style={{ textAlign: 'center', padding: 32, color: 'var(--foreground-muted)', fontSize: 13 }}
          >
            No orders yet.
          </div>
        ) : (
          displayOrders.map((order: any, index: number) => {
            const ss = statusStyle(order.status);
            const storeName = (order.storeName || order.store_name || 'Order').split(' \u2014 ')[0];
            const total = order.items
              ? order.items.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1), 0)
              : 0;

            return (
              <div
                key={order.id || index}
                style={{
                  padding: '14px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {/* Order header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  {/* Store icon */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: order.iconBg || 'var(--background-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
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
                      {storeName}
                    </div>
                    <div
                      className="font-body"
                      style={{ fontSize: 11, color: 'var(--foreground-muted)', marginTop: 1 }}
                    >
                      {order.detail || `${order.items?.length || 0} items`}
                    </div>
                  </div>

                  <Badge color={ss.color} bg={ss.bg}>
                    {order.status}
                  </Badge>
                </div>

                {/* Order items */}
                {order.items && order.items.length > 0 && (
                  <div style={{ marginLeft: 46 }}>
                    {order.items.map((item: any, itemIndex: number) => (
                      <div
                        key={itemIndex}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '3px 0',
                        }}
                      >
                        <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>
                          {item.name} x{item.quantity}
                        </span>
                        {item.price > 0 && (
                          <span className="font-body font-bold" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>
                            {'\u20AC'}{(item.price * (item.quantity || 1)).toFixed(2)}
                          </span>
                        )}
                      </div>
                    ))}
                    {total > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '6px 0 0',
                          borderTop: '1px solid var(--border)',
                          marginTop: 4,
                        }}
                      >
                        <span className="font-body font-bold" style={{ fontSize: 12, color: 'var(--foreground)' }}>
                          Total
                        </span>
                        <span className="font-body font-bold" style={{ fontSize: 12, color: 'var(--foreground)' }}>
                          {'\u20AC'}{total.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </SlideUpSheet>
  );
}
