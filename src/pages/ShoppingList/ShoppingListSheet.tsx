import { useState, useMemo } from 'react';
import SlideUpSheet from '../../components/shared/SlideUpSheet';
import Badge from '../../components/shared/Badge';
import Button from '../../components/shared/Button';
import { mockShoppingList } from '../../data/mock';
import type { ShoppingItem } from '../../types';

interface ShoppingListSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingListSheet({ isOpen, onClose }: ShoppingListSheetProps) {
  const [items, setItems] = useState<ShoppingItem[]>(mockShoppingList);
  const [newItem, setNewItem] = useState('');

  const toggleChecked = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Group items by store
  const grouped = useMemo(() => {
    const map: Record<string, ShoppingItem[]> = {};
    items.forEach((item) => {
      if (!map[item.store]) map[item.store] = [];
      map[item.store].push(item);
    });
    return map;
  }, [items]);

  // Find cheapest store (store with lowest total)
  const cheapestStore = useMemo(() => {
    let minTotal = Infinity;
    let minStore = '';
    Object.entries(grouped).forEach(([store, storeItems]) => {
      const total = storeItems.reduce((sum, i) => sum + i.price, 0);
      if (total < minTotal) {
        minTotal = total;
        minStore = store;
      }
    });
    return minStore;
  }, [grouped]);

  const totalCount = items.length;
  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    const newId = `s${Date.now()}`;
    setItems((prev) => [
      ...prev,
      {
        id: newId,
        name: newItem.trim(),
        quantity: '1',
        store: 'Mercadona',
        price: 0,
        checked: false,
      },
    ]);
    setNewItem('');
  };

  return (
    <SlideUpSheet isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-heading font-extrabold" style={{ fontSize: 18 }}>
            Shopping list
          </span>
          <Badge color="var(--foreground-muted)" bg="var(--background-tertiary)">
            {totalCount}
          </Badge>
        </div>
        <button
          style={{
            background: 'var(--success)',
            color: '#ffffff',
            borderRadius: 9999,
            fontSize: 10,
            padding: '5px 10px',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          className="font-body font-bold"
        >
          📱 Send to WhatsApp
        </button>
      </div>

      {/* Add item input */}
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
        placeholder="Add an item..."
        className="font-body"
        style={{
          width: '100%',
          height: 40,
          background: 'var(--background-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 9999,
          padding: '0 16px',
          fontSize: 13,
          color: 'var(--foreground)',
          outline: 'none',
          marginBottom: 12,
          boxSizing: 'border-box',
        }}
      />

      {/* Grouped items */}
      <div style={{ paddingBottom: 80 }}>
        {Object.entries(grouped).map(([store, storeItems]) => {
          const storeTotal = storeItems.reduce((sum, i) => sum + i.price, 0);
          const isCheapest = store === cheapestStore;

          return (
            <div key={store} style={{ marginBottom: 8 }}>
              {/* Store header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    className="font-body font-bold"
                    style={{ fontSize: 13, color: 'var(--foreground)' }}
                  >
                    {store}
                  </span>
                  <span
                    className="font-body"
                    style={{ fontSize: 11, color: 'var(--foreground-muted)' }}
                  >
                    ({storeItems.length} items)
                  </span>
                  {isCheapest && (
                    <Badge color="var(--success)" bg="var(--success-bg)">
                      Best deal
                    </Badge>
                  )}
                </div>
                <span
                  className="font-body font-bold"
                  style={{ fontSize: 12, color: 'var(--foreground-muted)' }}
                >
                  ~{'\u20AC'}{storeTotal.toFixed(2)}
                </span>
              </div>

              {/* Item rows */}
              {storeItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecked(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 0',
                    cursor: 'pointer',
                    opacity: item.checked ? 0.6 : 1,
                  }}
                >
                  {/* Checkbox */}
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `2px solid ${item.checked ? 'var(--accent)' : 'var(--border)'}`,
                      background: item.checked ? 'var(--accent)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {item.checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Name + quantity */}
                  <span
                    className="font-body"
                    style={{
                      fontSize: 13,
                      color: 'var(--foreground)',
                      flex: 1,
                      textDecoration: item.checked ? 'line-through' : 'none',
                    }}
                  >
                    {item.name}
                  </span>

                  {/* Price */}
                  <span
                    className="font-body font-bold"
                    style={{
                      fontSize: 11,
                      color: 'var(--foreground-muted)',
                      marginLeft: 'auto',
                      flexShrink: 0,
                    }}
                  >
                    {'\u20AC'}{item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Bottom summary */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          padding: '12px 0',
          background: 'var(--background)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div
          className="font-heading font-extrabold"
          style={{ fontSize: 16, color: 'var(--foreground)' }}
        >
          Total: ~{'\u20AC'}{totalPrice.toFixed(2)}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Button variant="primary" className="flex-1">
            🛒 Buy all
          </Button>
          <Button variant="secondary">Compare prices</Button>
        </div>
      </div>
    </SlideUpSheet>
  );
}
