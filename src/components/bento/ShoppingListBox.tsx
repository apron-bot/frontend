import { mockShoppingList } from '../../data/mock';

export default function ShoppingListBox() {
  const displayItems = mockShoppingList.slice(0, 6);

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
          Weekly Groceries
        </span>
        <span
          className="font-body"
          style={{ fontSize: 10, color: 'var(--foreground-muted)' }}
        >
          Mar 25
        </span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {displayItems.map((item) => {
          const displayName = item.name.includes(' — ')
            ? item.name.split(' — ')[0]
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
