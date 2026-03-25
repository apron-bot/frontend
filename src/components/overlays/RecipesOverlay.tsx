import { useState, useEffect } from 'react';
import SlideUpSheet from '../shared/SlideUpSheet';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { getFavoriteRecipes, generateRecipes, getUserId } from '../../services/api';
import { mockRecipes } from '../../data/mock';

interface RecipesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipesOverlay({ isOpen, onClose }: RecipesOverlayProps) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [useMock, setUseMock] = useState(false);

  // Fetch recipes when overlay opens
  useEffect(() => {
    if (!isOpen) return;
    const userId = getUserId();
    if (!userId) {
      setUseMock(true);
      return;
    }
    setLoading(true);
    getFavoriteRecipes(userId)
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setRecipes(data);
          setUseMock(false);
        } else {
          setUseMock(true);
        }
      })
      .catch(() => {
        setUseMock(true);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleGenerate = async () => {
    const userId = getUserId();
    if (!userId) return;
    setGenerating(true);
    try {
      const result = await generateRecipes(userId);
      if (result && Array.isArray(result)) {
        setRecipes(result);
        setUseMock(false);
      }
    } catch (e) {
      /* silently fail */
    } finally {
      setGenerating(false);
    }
  };

  const displayRecipes: any[] = useMock ? mockRecipes : recipes;

  // Difficulty color
  const difficultyStyle = (d: string) => {
    switch (d) {
      case 'easy':
        return { color: 'var(--success)', bg: 'var(--success-bg)' };
      case 'medium':
        return { color: 'var(--warning)', bg: 'var(--warning-bg, rgba(255,170,0,0.1))' };
      case 'hard':
        return { color: 'var(--danger)', bg: 'var(--danger-bg, rgba(255,80,80,0.1))' };
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
            Recipes
          </span>
          <Badge color="var(--foreground-muted)" bg="var(--background-tertiary)">
            {displayRecipes.length}
          </Badge>
        </div>
        {!useMock && (
          <Badge color="var(--success)" bg="var(--success-bg)">
            Live
          </Badge>
        )}
      </div>

      {/* Generate button */}
      <div style={{ marginBottom: 16 }}>
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={generating || !getUserId()}
          className="w-full"
        >
          {generating ? 'Generating...' : 'Generate Suggestions'}
        </Button>
      </div>

      {/* Recipes list */}
      <div style={{ paddingBottom: 16 }}>
        {loading ? (
          <div
            className="font-body"
            style={{ textAlign: 'center', padding: 32, color: 'var(--foreground-muted)', fontSize: 13 }}
          >
            Loading recipes...
          </div>
        ) : displayRecipes.length === 0 ? (
          <div
            className="font-body"
            style={{ textAlign: 'center', padding: 32, color: 'var(--foreground-muted)', fontSize: 13 }}
          >
            No recipes found. Try generating some suggestions!
          </div>
        ) : (
          displayRecipes.map((recipe: any, index: number) => {
            const ds = difficultyStyle(recipe.difficulty || '');
            return (
              <div
                key={recipe.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {/* Recipe icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: recipe.placeholderColor || 'var(--background-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 11h.01" />
                    <path d="M11 15h.01" />
                    <path d="M16 16h.01" />
                    <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
                  </svg>
                </div>

                {/* Recipe details */}
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
                    {recipe.title || recipe.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    {/* Cook time */}
                    <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {recipe.timeMinutes || recipe.cook_time || '?'} min
                    </span>

                    {/* Difficulty */}
                    {recipe.difficulty && (
                      <Badge color={ds.color} bg={ds.bg}>
                        {recipe.difficulty}
                      </Badge>
                    )}

                    {/* Servings */}
                    {recipe.servings && (
                      <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        {recipe.servings}
                      </span>
                    )}
                  </div>
                </div>

                {/* Saved indicator */}
                {recipe.saved && (
                  <div style={{ flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
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
