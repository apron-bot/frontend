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
  const [favorites, setFavorites] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

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
          setFavorites(data);
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
        setSuggestions(result);
      } else if (result && result.recipes && Array.isArray(result.recipes)) {
        setSuggestions(result.recipes);
      }
    } catch (e) {
      /* silently fail */
    } finally {
      setGenerating(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRecipe((prev) => (prev === id ? null : id));
  };

  const displayRecipes: any[] = useMock ? mockRecipes : favorites;

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

  const renderRecipeCard = (recipe: any, index: number) => {
    const ds = difficultyStyle(recipe.difficulty || '');
    const recipeId = recipe.id || `recipe-${index}`;
    const isExpanded = expandedRecipe === recipeId;
    const recipeName = recipe.title || recipe.name || 'Untitled Recipe';
    const cookTime = recipe.timeMinutes || recipe.cook_time || recipe.time_minutes;
    const ingredients = recipe.ingredients || [];
    const steps = recipe.steps || [];

    return (
      <div
        key={recipeId}
        style={{
          padding: '12px 0',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Clickable header */}
        <div
          onClick={() => toggleExpand(recipeId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
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
              {recipeName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
              {/* Cook time */}
              {cookTime && (
                <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {cookTime} min
                </span>
              )}

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

          {/* Expand arrow */}
          <div style={{ flexShrink: 0, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div style={{ marginTop: 12, marginLeft: 56 }}>
            {/* Ingredients */}
            {ingredients.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <span
                  className="font-body font-bold"
                  style={{ fontSize: 11, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}
                >
                  Ingredients
                </span>
                {ingredients.map((ing: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '2px 0',
                    }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                    <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>
                      {ing.name || ing}{ing.amount ? ` - ${ing.amount}` : ''}
                    </span>
                    {ing.inPantry !== undefined && (
                      <Badge
                        color={ing.inPantry ? 'var(--success)' : 'var(--danger)'}
                        bg={ing.inPantry ? 'var(--success-bg)' : 'var(--danger-bg, rgba(255,80,80,0.1))'}
                      >
                        {ing.inPantry ? 'have' : 'need'}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Steps */}
            {steps.length > 0 && (
              <div>
                <span
                  className="font-body font-bold"
                  style={{ fontSize: 11, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}
                >
                  Steps
                </span>
                {steps.map((step: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 8,
                      padding: '4px 0',
                    }}
                  >
                    <span
                      className="font-body font-bold"
                      style={{
                        fontSize: 10,
                        color: 'var(--accent)',
                        flexShrink: 0,
                        width: 16,
                        textAlign: 'right',
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)', lineHeight: 1.4 }}>
                      {step.instruction || step}
                      {step.timerMinutes && (
                        <span style={{ color: 'var(--warning)', fontWeight: 700, marginLeft: 4 }}>
                          ({step.timerMinutes} min)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
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
            {displayRecipes.length + suggestions.length}
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

      {/* Generated suggestions section */}
      {suggestions.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="font-body font-bold" style={{ fontSize: 13, color: 'var(--accent)' }}>
              AI Suggestions
            </span>
            <Badge color="var(--accent)" bg="var(--accent-bg)">
              {suggestions.length}
            </Badge>
          </div>
          {suggestions.map((recipe, index) => renderRecipeCard(recipe, 1000 + index))}
        </div>
      )}

      {/* Favorites / recipes list */}
      <div style={{ paddingBottom: 16 }}>
        {suggestions.length > 0 && displayRecipes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="font-body font-bold" style={{ fontSize: 13, color: 'var(--foreground)' }}>
              {useMock ? 'Sample Recipes' : 'Favorites'}
            </span>
          </div>
        )}

        {loading ? (
          <div
            className="font-body"
            style={{ textAlign: 'center', padding: 32, color: 'var(--foreground-muted)', fontSize: 13 }}
          >
            Loading recipes...
          </div>
        ) : displayRecipes.length === 0 && suggestions.length === 0 ? (
          <div
            className="font-body"
            style={{ textAlign: 'center', padding: 32, color: 'var(--foreground-muted)', fontSize: 13 }}
          >
            No recipes found. Try generating some suggestions!
          </div>
        ) : (
          displayRecipes.map((recipe, index) => renderRecipeCard(recipe, index))
        )}
      </div>
    </SlideUpSheet>
  );
}
