import Badge from '../shared/Badge';
import { useData } from '../../context/DataContext';
import { mockRestaurants, mockOrders } from '../../data/mock';

export default function DeliveryDashboard() {
  const { orders } = useData();

  const displayOrders = orders.length > 0 ? orders : mockOrders;
  const recentOrders = displayOrders.slice(0, 3);

  const statusStyle = (status: string) => {
    switch (status) {
      case 'delivering': return { color: 'var(--warning)', bg: 'var(--warning-bg)', label: 'Delivering' };
      case 'delivered': return { color: 'var(--success)', bg: 'var(--success-bg)', label: 'Delivered' };
      case 'pending': return { color: 'var(--warning)', bg: 'var(--warning-bg)', label: 'Pending' };
      default: return { color: 'var(--foreground-muted)', bg: 'var(--background-tertiary)', label: status };
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 10,
        height: '100%',
        width: '100%',
      }}
    >
      {/* Recommended Restaurants — top left, spans full width */}
      <div
        style={{
          gridColumn: '1 / -1',
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: 14,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexShrink: 0 }}>
          <span className="font-body font-extrabold text-[13px] uppercase tracking-[0.5px]" style={{ color: 'var(--accent)' }}>
            Recommended for You
          </span>
          <span className="font-body font-bold text-[11px]" style={{ color: 'var(--foreground-muted)' }}>
            Near 28003
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, flex: 1, overflow: 'hidden' }}>
          {mockRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              style={{
                flex: 1,
                background: 'var(--background-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                minWidth: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px var(--shadow)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div>
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: restaurant.placeholderColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, marginBottom: 10,
                  }}
                >
                  {restaurant.emoji}
                </div>
                <div className="font-body font-bold" style={{ fontSize: 14, color: 'var(--foreground)', marginBottom: 2 }}>
                  {restaurant.name}
                </div>
                <div className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>
                  {restaurant.cuisine.join(' · ')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{restaurant.deliveryTime}</span>
                <span className="font-body font-bold" style={{ fontSize: 11, color: 'var(--foreground-muted)', marginLeft: 'auto' }}>{restaurant.priceRange}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders — bottom left */}
      <div
        style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: 14,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span className="font-body font-extrabold text-[13px] uppercase tracking-[0.5px]" style={{ color: 'var(--info)', marginBottom: 8, flexShrink: 0 }}>
          Recent Orders
        </span>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {recentOrders.map((order: any, i: number) => {
            const ss = statusStyle(order.status);
            const name = (order.storeName || order.source || 'Order').split(' — ')[0];
            return (
              <div
                key={order.id || i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 0',
                  borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: order.iconBg || 'var(--background-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="font-body font-bold" style={{ fontSize: 12, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                  <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-muted)' }}>{order.detail || ''}</span>
                </div>
                <Badge color={ss.color} bg={ss.bg}>{ss.label}</Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Deals — bottom right */}
      <div
        style={{
          background: 'var(--background-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: 14,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span className="font-body font-extrabold text-[13px] uppercase tracking-[0.5px]" style={{ color: 'var(--accent)', marginBottom: 8, flexShrink: 0 }}>
          Tonight's Deals
        </span>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
          {[
            { name: '2-for-1 Pizzas', place: "Domino's", discount: '-50%', color: 'var(--danger)' },
            { name: 'Free Delivery', place: 'Uber Eats', discount: 'Free', color: 'var(--success)' },
            { name: 'Combo Meal Deal', place: 'Goiko', discount: '-30%', color: 'var(--warning)' },
          ].map((deal, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 10, background: 'var(--background-secondary)',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              }}
            >
              <div>
                <div className="font-body font-bold" style={{ fontSize: 12, color: 'var(--foreground)' }}>{deal.name}</div>
                <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-muted)' }}>{deal.place}</span>
              </div>
              <span className="font-body font-extrabold" style={{ fontSize: 13, color: deal.color }}>{deal.discount}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 8, flexShrink: 0 }}>
          <span className="font-body font-bold text-[11px]" style={{ color: 'var(--accent)', cursor: 'pointer' }}>
            Browse all deals →
          </span>
        </div>
      </div>
    </div>
  );
}
