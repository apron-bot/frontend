import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { useData } from '../../context/DataContext';
import { mockOrders } from '../../data/mock';

export default function OrdersPage() {
  const { orders, connected } = useData();

  const hasLiveData = orders.length > 0;
  const displayOrders = hasLiveData ? orders : mockOrders;

  const statusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'var(--warning)', bg: 'var(--warning-bg)', label: 'Pending' };
      case 'confirmed': return { color: 'var(--info)', bg: 'var(--info-bg)', label: 'Confirmed' };
      case 'delivering': return { color: 'var(--warning)', bg: 'var(--warning-bg)', label: 'Delivering' };
      case 'delivered': return { color: 'var(--success)', bg: 'var(--success-bg)', label: 'Delivered' };
      case 'failed': return { color: 'var(--danger)', bg: 'var(--danger-bg)', label: 'Failed' };
      default: return { color: 'var(--foreground-muted)', bg: 'var(--background-tertiary)', label: status };
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-heading font-extrabold" style={{ fontSize: 20, color: 'var(--foreground)' }}>Orders</span>
          <Badge color="var(--foreground-muted)" bg="var(--background-tertiary)">{displayOrders.length}</Badge>
        </div>
        {connected && hasLiveData && <Badge color="var(--success)" bg="var(--success-bg)">Live</Badge>}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
        {displayOrders.length === 0 ? (
          <div className="font-body" style={{ textAlign: 'center', padding: 40, color: 'var(--foreground-muted)', fontSize: 13 }}>
            No orders yet. Ask Bobby to order groceries via Telegram!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayOrders.map((order: any, i: number) => {
              const ss = statusStyle(order.status);
              const storeName = (order.storeName || order.source || 'Store').split(' — ')[0];
              const total = order.total_price || order.items?.reduce((s: number, it: any) => s + (it.price || 0) * (it.quantity || 1), 0) || 0;
              const items = order.items || [];

              return (
                <div
                  key={order.id || i}
                  style={{
                    background: 'var(--background-card)', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', padding: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: order.iconBg || 'var(--background-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-body font-bold" style={{ fontSize: 14, color: 'var(--foreground)' }}>{storeName}</div>
                        <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{order.detail || `${items.length} items`}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {total > 0 && (
                        <span className="font-body font-bold" style={{ fontSize: 14, color: 'var(--foreground)' }}>
                          {'\u20AC'}{total.toFixed(2)}
                        </span>
                      )}
                      <Badge color={ss.color} bg={ss.bg}>{ss.label}</Badge>
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div style={{ marginTop: 4, paddingLeft: 46 }}>
                      {items.slice(0, 5).map((item: any, j: number) => (
                        <div key={j} className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)', padding: '1px 0' }}>
                          {item.name} x{item.quantity}
                          {item.price > 0 && <span style={{ marginLeft: 4 }}>{'\u20AC'}{item.price.toFixed(2)}</span>}
                        </div>
                      ))}
                      {items.length > 5 && (
                        <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-hint)' }}>+{items.length - 5} more</span>
                      )}
                    </div>
                  )}

                  {['pending', 'confirmed', 'delivering'].includes(order.status) && (
                    <div style={{ marginTop: 10, paddingLeft: 46 }}>
                      <Button variant="secondary" className="text-[11px] px-3 py-1">Track Order</Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
