import ramenImg from '../../assets/ramen.png';
import { useData } from '../../context/DataContext';

const FOOD_EMOJI: Record<string, string> = {
  egg: '🥚', eggs: '🥚', milk: '🥛', cheese: '🧀', butter: '🧈',
  bread: '🍞', rice: '🍚', pasta: '🍝', chicken: '🍗', beef: '🥩',
  meat: '🥩', fish: '🐟', salmon: '🐟', shrimp: '🦐', prawn: '🦐',
  tomato: '🍅', tomatoes: '🍅', potato: '🥔', potatoes: '🥔',
  onion: '🧅', garlic: '🧄', lettuce: '🥬', carrot: '🥕',
  broccoli: '🥦', corn: '🌽', pepper: '🌶️', cucumber: '🥒',
  avocado: '🥑', banana: '🍌', apple: '🍎', orange: '🍊',
  lemon: '🍋', watermelon: '🍉', grape: '🍇', grapes: '🍇',
  strawberry: '🍓', peach: '🍑', pineapple: '🍍', coconut: '🥥',
  mushroom: '🍄', soup: '🍲', stew: '🍲', oil: '🫒', olive: '🫒',
  salt: '🧂', honey: '🍯', chocolate: '🍫', coffee: '☕', tea: '🍵',
  water: '💧', juice: '🧃', wine: '🍷', beer: '🍺',
  pizza: '🍕', burger: '🍔', sushi: '🍣', taco: '🌮',
  cake: '🍰', cookie: '🍪', ice: '🧊', yogurt: '🥛',
};

function getFoodEmoji(name: string): string {
  const lower = name.toLowerCase().trim();
  if (FOOD_EMOJI[lower]) return FOOD_EMOJI[lower];
  // Try partial match
  for (const [key, emoji] of Object.entries(FOOD_EMOJI)) {
    if (lower.includes(key) || key.includes(lower)) return emoji;
  }
  return '🍽️';
}

interface ScanFridgeBoxProps {
  onOpenPantry?: () => void;
}

export default function ScanFridgeBox({ onOpenPantry }: ScanFridgeBoxProps) {
  const { inventory, fridgeChanges, lastPhoto, connected } = useData();

  // Priority: 1) live SSE fridge changes, 2) current inventory as "+N" items, 3) nothing
  const hasLiveChanges = fridgeChanges.length > 0;
  const hasInventory = inventory.length > 0;

  // Build display list: if we have recent SSE changes show those,
  // otherwise show the full inventory as detected items (all positive)
  const displayChanges = hasLiveChanges
    ? fridgeChanges.map((c) => ({ delta: c.delta, name: c.name }))
    : hasInventory
      ? inventory.map((item) => ({ delta: item.quantity, name: item.name }))
      : [];

  // Use last photo from backend if available
  const fridgeImageSrc = lastPhoto
    ? `data:image/jpeg;base64,${lastPhoto}`
    : ramenImg;

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
      <div style={{ display: 'flex', gap: 12, flex: 1, minHeight: 0 }}>
        {/* Left column — fridge scan image */}
        <div
          style={{
            flex: '0 0 40%',
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            background: 'var(--background-secondary)',
            overflow: 'hidden',
          }}
        >
          <img
            src={fridgeImageSrc}
            alt="Fridge scan"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'var(--radius-md)',
            }}
          />
          {/* Camera icon overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          {/* Live inventory count */}
          {hasInventory && (
            <div
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: 9999,
                padding: '2px 6px',
                fontSize: 9,
                fontWeight: 700,
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {inventory.length} items
            </div>
          )}

          {connected && (
            <div
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--success)',
                border: '1.5px solid rgba(255,255,255,0.8)',
              }}
            />
          )}
        </div>

        {/* Right column — scan results */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <span
            className="font-body font-extrabold"
            style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--accent)',
              marginBottom: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {hasLiveChanges ? 'SCAN RESULTS' : hasInventory ? 'INVENTORY' : 'SCAN RESULTS'}
            {(hasLiveChanges || hasInventory) && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--success)',
                  display: 'inline-block',
                }}
              />
            )}
          </span>

          {/* Items list */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {displayChanges.length > 0 ? (
              displayChanges.slice(0, 10).map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 0',
                  }}
                >
                  <span
                    className="font-body font-extrabold"
                    style={{
                      fontSize: 13,
                      color: item.delta > 0 ? 'var(--success)' : 'var(--danger)',
                      minWidth: 32,
                    }}
                  >
                    {item.delta > 0 ? `+${item.delta}` : item.delta}
                  </span>
                  <span style={{ fontSize: 14, lineHeight: 1 }}>
                    {getFoodEmoji(item.name)}
                  </span>
                  <span
                    className="font-body font-normal"
                    style={{ fontSize: 12, color: 'var(--foreground)' }}
                  >
                    {item.name}
                  </span>
                </div>
              ))
            ) : (
              <div className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)', padding: '8px 0' }}>
                Send a fridge photo to @ChefBobbyBot to scan your inventory
              </div>
            )}
            {displayChanges.length > 10 && (
              <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-muted)' }}>
                +{displayChanges.length - 10} more
              </span>
            )}
          </div>

          {/* See more link */}
          <span
            className="font-body font-bold"
            onClick={onOpenPantry}
            style={{
              marginTop: 'auto',
              fontSize: 11,
              color: 'var(--accent)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            See more →
          </span>
        </div>
      </div>
    </div>
  );
}
