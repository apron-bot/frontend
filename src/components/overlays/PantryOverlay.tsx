import { useState, useEffect, useCallback } from 'react';
import SlideUpSheet from '../shared/SlideUpSheet';
import Badge from '../shared/Badge';
import { useData } from '../../context/DataContext';
import { mockIngredients } from '../../data/mock';
import { getFoodIcon, generateFoodIcon } from '../../services/api';

interface PantryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PantryOverlay({ isOpen, onClose }: PantryOverlayProps) {
  const { inventory, connected } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [iconCache, setIconCache] = useState<Record<string, string>>({});
  const [generatingIcon, setGeneratingIcon] = useState<string | null>(null);

  const hasLiveData = inventory.length > 0;

  // Try to load icons for inventory items
  const loadIcon = useCallback(async (foodName: string) => {
    if (iconCache[foodName]) return;
    try {
      const icon = await getFoodIcon(foodName);
      if (icon) {
        setIconCache((prev) => ({ ...prev, [foodName]: icon }));
      }
    } catch (e) {
      /* no cached icon */
    }
  }, [iconCache]);

  // Load icons when overlay opens
  useEffect(() => {
    if (!isOpen || !hasLiveData) return;
    inventory.forEach((item) => {
      loadIcon(item.name);
    });
  }, [isOpen, hasLiveData, inventory, loadIcon]);

  const handleGenerateIcon = async (foodName: string) => {
    setGeneratingIcon(foodName);
    try {
      const icon = await generateFoodIcon(foodName);
      if (icon) {
        setIconCache((prev) => ({ ...prev, [foodName]: icon }));
      }
    } catch (e) {
      /* generation failed */
    } finally {
      setGeneratingIcon(null);
    }
  };

  // Source badge color helper
  const sourceColor = (source: string) => {
    switch (source) {
      case 'photo_parse':
        return { color: 'var(--accent)', bg: 'var(--accent-bg)' };
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

  // Color for first-letter fallback circles
  const letterColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  ];
  const getLetterColor = (name: string) => {
    const index = name.charCodeAt(0) % letterColors.length;
    return letterColors[index];
  };

  // Filter items
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMock = mockIngredients.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort live inventory by name
  const sortedInventory = [...filteredInventory].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

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
          <span className="font-heading font-extrabold" style={{ fontSize: 18, color: 'var(--foreground)' }}>
            Pantry
          </span>
          <Badge color="var(--foreground-muted)" bg="var(--background-tertiary)">
            {hasLiveData ? inventory.length : mockIngredients.length}
          </Badge>
        </div>
        {connected && (
          <Badge color="var(--success)" bg="var(--success-bg)">
            Live
          </Badge>
        )}
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="font-body"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: 13,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'var(--background-secondary)',
            color: 'var(--foreground)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Items list */}
      <div style={{ paddingBottom: 16 }}>
        {hasLiveData ? (
          sortedInventory.length === 0 && searchQuery ? (
            <div
              className="font-body"
              style={{
                textAlign: 'center',
                padding: 32,
                color: 'var(--foreground-muted)',
                fontSize: 13,
              }}
            >
              No items match "{searchQuery}"
            </div>
          ) : sortedInventory.length === 0 ? (
            <div
              className="font-body"
              style={{
                textAlign: 'center',
                padding: 32,
                color: 'var(--foreground-muted)',
                fontSize: 13,
              }}
            >
              <div style={{ marginBottom: 8 }}>No items in your pantry yet.</div>
              <div style={{ fontSize: 12 }}>
                Send a photo of your fridge to{' '}
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>@ChefBobbyBot</span>{' '}
                on Telegram to get started!
              </div>
            </div>
          ) : (
            sortedInventory.map((item) => {
              const sc = sourceColor(item.source);
              const hasIcon = iconCache[item.name];
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
                    {/* Food icon */}
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: hasIcon ? 'transparent' : getLetterColor(item.name),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden',
                      }}
                    >
                      {hasIcon ? (
                        <img
                          src={`data:image/png;base64,${iconCache[item.name]}`}
                          alt={item.name}
                          style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 8 }}
                        />
                      ) : (
                        <span
                          className="font-body font-bold"
                          style={{ fontSize: 14, color: '#fff' }}
                        >
                          {item.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                    {item.expiry_date && (
                      <span
                        className="font-body"
                        style={{ fontSize: 10, color: 'var(--warning)' }}
                      >
                        exp {new Date(item.expiry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    {!hasIcon && (
                      <button
                        onClick={() => handleGenerateIcon(item.name)}
                        disabled={generatingIcon === item.name}
                        className="font-body font-bold"
                        style={{
                          fontSize: 9,
                          color: 'var(--accent)',
                          background: 'var(--accent-bg)',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: '2px 6px',
                          cursor: generatingIcon === item.name ? 'wait' : 'pointer',
                          opacity: generatingIcon === item.name ? 0.5 : 1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {generatingIcon === item.name ? '...' : 'Gen Icon'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )
        ) : (
          // Mock data fallback
          filteredMock.map((item) => (
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
                    background: getLetterColor(item.name),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="font-body font-bold"
                    style={{ fontSize: 14, color: '#fff' }}
                  >
                    {item.name.charAt(0).toUpperCase()}
                  </span>
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
