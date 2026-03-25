import { useState, useEffect } from 'react';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { getFavoriteRecipes, generateRecipes, getUserId } from '../../services/api';
import { mockRecipes } from '../../data/mock';

export default function RecipesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) { setUseMock(true); return; }
    setLoading(true);
    getFavoriteRecipes(userId)
      .then(data => {
        if (data?.length > 0) { setFavorites(data); setUseMock(false); }
        else setUseMock(true);
      })
      .catch(() => setUseMock(true))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    const userId = getUserId();
    if (!userId) return;
    setGenerating(true);
    try {
      const result = await generateRecipes(userId);
      if (Array.isArray(result)) setSuggestions(result);
      else if (result?.recipes) setSuggestions(result.recipes);
    } catch (e) { /* */ }
    setGenerating(false);
  };

  const diffStyle = (d: string) => {
    switch (d) {
      case 'easy': return { color: 'var(--success)', bg: 'var(--success-bg)' };
      case 'medium': return { color: 'var(--warning)', bg: 'var(--warning-bg)' };
      case 'hard': return { color: 'var(--danger)', bg: 'var(--danger-bg)' };
      default: return { color: 'var(--foreground-muted)', bg: 'var(--background-tertiary)' };
    }
  };

  const recipes = useMock ? mockRecipes : favorites;

  const renderCard = (recipe: any, index: number) => {
    const ds = diffStyle(recipe.difficulty || '');
    const id = recipe.id || `r-${index}`;
    const expanded = expandedRecipe === id;
    const name = recipe.title || recipe.name || 'Untitled';
    const time = recipe.timeMinutes || recipe.cook_time_minutes || recipe.time_minutes;

    return (
      <div key={id} style={{ background: 'var(--background-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div onClick={() => setExpandedRecipe(expanded ? null : id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, cursor: 'pointer' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: recipe.placeholderColor || 'var(--background-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-body font-bold" style={{ fontSize: 14, color: 'var(--foreground)' }}>{name}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              {time && <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{time} min</span>}
              {recipe.difficulty && <Badge color={ds.color} bg={ds.bg}>{recipe.difficulty}</Badge>}
              {recipe.servings && <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{recipe.servings} servings</span>}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        {expanded && (
          <div style={{ padding: '0 14px 14px 74px' }}>
            {(recipe.ingredients?.length > 0) && (
              <div style={{ marginBottom: 10 }}>
                <span className="font-body font-bold" style={{ fontSize: 12, color: 'var(--foreground)', display: 'block', marginBottom: 4 }}>Ingredients</span>
                {recipe.ingredients.map((ing: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                    <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>
                      {ing.name || ing}{ing.amount ? ` — ${ing.amount}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {(recipe.steps?.length > 0) && (
              <div>
                <span className="font-body font-bold" style={{ fontSize: 12, color: 'var(--foreground)', display: 'block', marginBottom: 4 }}>Steps</span>
                {recipe.steps.map((step: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 8, padding: '3px 0' }}>
                    <span className="font-body font-bold" style={{ fontSize: 11, color: 'var(--accent)', width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}.</span>
                    <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)', lineHeight: 1.4 }}>{step.instruction || step}</span>
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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-heading font-extrabold" style={{ fontSize: 20, color: 'var(--foreground)' }}>Recipes</span>
          <Badge color="var(--foreground-muted)" bg="var(--background-tertiary)">{recipes.length + suggestions.length}</Badge>
        </div>
        {!useMock && <Badge color="var(--success)" bg="var(--success-bg)">Live</Badge>}
      </div>

      <div style={{ marginBottom: 12, flexShrink: 0 }}>
        <Button variant="primary" onClick={handleGenerate} disabled={generating || !getUserId()} className="w-full">
          {generating ? 'Generating...' : 'Generate Suggestions from Pantry'}
        </Button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
        {suggestions.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <span className="font-body font-bold" style={{ fontSize: 13, color: 'var(--accent)', display: 'block', marginBottom: 8 }}>AI Suggestions</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {suggestions.map((r, i) => renderCard(r, 1000 + i))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="font-body" style={{ textAlign: 'center', padding: 40, color: 'var(--foreground-muted)' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recipes.map((r, i) => renderCard(r, i))}
          </div>
        )}
      </div>
    </div>
  );
}
