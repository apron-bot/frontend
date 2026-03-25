import { mockShoppingList } from '../../data/mock';
import { useData } from '../../context/DataContext';

export default function ShoppingListBox() {
  const { inventory } = useData();

  // Build a shopping list from inventory low-stock items if we have live data
  // Otherwise fall back to mock data
  const hasLiveData = inventory.length > 0;

  // For live data, show items that might need restocking (low quantity)
  const liveShoppingItems = inventory
    .filter((item) => item.quantity <= 2)
    .map((item, i) => ({
      id: `live-${i}`,
      name: item.name,
      quantity: `${item.quantity} ${item.unit}`,
    }));

  const displayItems = hasLiveData && liveShoppingItems.length > 0
    ? liveShoppingItems.slice(0, 6)
    : mockShoppingList.slice(0, 6);

  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

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
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 8,
        }}
      >
        <span
          className="font-body font-bold"
          style={{ fontSize: 13, color: 'var(--foreground)' }}
        >
          {hasLiveData && liveShoppingItems.length > 0 ? 'Low Stock' : 'Weekly Groceries'}
        </span>
        <span
          className="font-body"
          style={{ fontSize: 10, color: 'var(--foreground-muted)' }}
        >
          {dateStr}
        </span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {displayItems.map((item) => {
          const displayName = item.name.includes(' \u2014 ')
            ? item.name.split(' \u2014 ')[0]
            : item.name;

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '3px 0',
              }}
            >
              <span
                className="font-body"
                style={{
                  fontSize: 11,
                  color: 'var(--foreground)',
                  maxWidth: '70%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </span>
              <span
                className="font-body font-bold"
                style={{
                  fontSize: 10,
                  color: 'var(--foreground-muted)',
                }}
              >
                {item.quantity}
              </span>
            </div>
          );
        })}
      </div>

      {/* See all link */}
      <span
        className="font-body font-bold"
        style={{
          marginTop: 'auto',
          fontSize: 11,
          color: 'var(--accent)',
          cursor: 'pointer',
        }}
      >
        See all &rarr;
      </span>
    </div>
  );
}
