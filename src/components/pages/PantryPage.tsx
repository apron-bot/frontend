import { useState, useEffect, useCallback } from 'react';
import Badge from '../shared/Badge';
import { useData } from '../../context/DataContext';
import { mockIngredients } from '../../data/mock';
import { getFoodIcon, generateFoodIcon } from '../../services/api';

const letterColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
];

export default function PantryPage() {
  const { inventory, connected } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [iconCache, setIconCache] = useState<Record<string, string>>({});
  const [generatingIcon, setGeneratingIcon] = useState<string | null>(null);

  const hasLiveData = inventory.length > 0;
  const getLetterColor = (name: string) => letterColors[name.charCodeAt(0) % letterColors.length];

  const loadIcon = useCallback(async (foodName: string) => {
    if (iconCache[foodName]) return;
    const icon = await getFoodIcon(foodName).catch(() => null);
    if (icon) setIconCache(prev => ({ ...prev, [foodName]: icon }));
  }, [iconCache]);

  useEffect(() => {
    if (hasLiveData) inventory.forEach(item => loadIcon(item.name));
  }, [hasLiveData, inventory, loadIcon]);

  const handleGenerateIcon = async (foodName: string) => {
    setGeneratingIcon(foodName);
    const icon = await generateFoodIcon(foodName).catch(() => null);
    if (icon) setIconCache(prev => ({ ...prev, [foodName]: icon }));
    setGeneratingIcon(null);
  };

  const sourceColor = (source: string) => {
    switch (source) {
      case 'photo_parse': return { color: 'var(--accent)', bg: 'var(--accent-bg)' };
      case 'manual': return { color: 'var(--foreground-muted)', bg: 'var(--background-tertiary)' };
      default: return { color: 'var(--foreground-muted)', bg: 'var(--background-tertiary)' };
    }
  };

  const items = hasLiveData
    ? [...inventory].filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name))
    : mockIngredients.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-heading font-extrabold" style={{ fontSize: 20, color: 'var(--foreground)' }}>Pantry</span>
          <Badge color="var(--foreground-muted)" bg="var(--background-tertiary)">{items.length}</Badge>
        </div>
        {connected && <Badge color="var(--success)" bg="var(--success-bg)">Live</Badge>}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="font-body"
        style={{
          width: '100%', padding: '10px 14px', fontSize: 13,
          borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
          background: 'var(--background-secondary)', color: 'var(--foreground)',
          outline: 'none', boxSizing: 'border-box', marginBottom: 12, flexShrink: 0,
        }}
      />

      {/* Items grid */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} className="hide-scrollbar">
        {items.length === 0 ? (
          <div className="font-body" style={{ textAlign: 'center', padding: 40, color: 'var(--foreground-muted)', fontSize: 13 }}>
            {searchQuery ? `No items match "${searchQuery}"` : (
              <>No items in your pantry yet.<br /><span style={{ color: 'var(--accent)', fontWeight: 700 }}>Send a fridge photo to @ChefBobbyBot</span></>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {items.map((item: any) => {
              const sc = sourceColor(item.source || '');
              const hasIcon = iconCache[item.name];
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: 12,
                    background: 'var(--background-card)', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0, overflow: 'hidden',
                    background: hasIcon ? 'transparent' : getLetterColor(item.name),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {hasIcon ? (
                      <img src={`data:image/png;base64,${iconCache[item.name]}`} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 10 }} />
                    ) : (
                      <span className="font-body font-bold" style={{ fontSize: 16, color: '#fff' }}>{item.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-body font-bold" style={{ fontSize: 13, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span className="font-body" style={{ fontSize: 11, color: item.isLowStock ? 'var(--danger)' : 'var(--foreground-muted)' }}>
                        {item.quantity} {item.unit || ''}
                      </span>
                      {item.source && <Badge color={sc.color} bg={sc.bg}>{item.source}</Badge>}
                    </div>
                  </div>
                  {!hasIcon && (
                    <button
                      onClick={() => handleGenerateIcon(item.name)}
                      disabled={generatingIcon === item.name}
                      className="font-body font-bold"
                      style={{
                        fontSize: 9, color: 'var(--accent)', background: 'var(--accent-bg)',
                        border: 'none', borderRadius: 'var(--radius-sm)', padding: '3px 7px',
                        cursor: generatingIcon === item.name ? 'wait' : 'pointer',
                        opacity: generatingIcon === item.name ? 0.5 : 1, whiteSpace: 'nowrap', flexShrink: 0,
                      }}
                    >
                      {generatingIcon === item.name ? '...' : 'Gen Icon'}
                    </button>
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
