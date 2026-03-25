import { useState, useEffect } from 'react';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import { getFavoriteRecipes, generateRecipes, getUserId, type RecipeFilters } from '../../services/api';
import { useData } from '../../context/DataContext';

// Inline SVG radar chart for flavor profile
const FLAVORS = ['Salty', 'Sweet', 'Sour', 'Spicy', 'Umami'] as const;
const FLAVOR_KEYS = ['salty', 'sweet', 'sour', 'spicy', 'umami'] as const;
const CX = 90, CY = 90, R = 65, LEVELS = 3;
const ANGLE_STEP = (2 * Math.PI) / 5;
const START = -Math.PI / 2;

function pt(axis: number, level: number, max = LEVELS) {
  const a = START + axis * ANGLE_STEP;
  const r = (level / max) * R;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}
function polygon(level: number) {
  return Array.from({ length: 5 }, (_, i) => { const p = pt(i, level); return `${p.x},${p.y}`; }).join(' ');
}

function FlavorRadar({ data, onChange }: { data: Record<string, number>; onChange: (key: string, val: number) => void }) {
  const filled = FLAVOR_KEYS.map((k, i) => { const p = pt(i, data[k] || 0); return `${p.x},${p.y}`; }).join(' ');

  return (
    <svg width={180} height={180} viewBox="0 0 180 180" style={{ overflow: 'visible' }}>
      {[1, 2, 3].map(l => <polygon key={l} points={polygon(l)} fill="none" stroke="var(--border)" strokeWidth={1} />)}
      {Array.from({ length: 5 }, (_, i) => { const p = pt(i, LEVELS); return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="var(--border)" strokeWidth={1} />; })}
      <polygon points={filled} fill="rgba(255, 107, 74, 0.2)" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" />
      {FLAVOR_KEYS.map((k, i) => {
        const p = pt(i, data[k] || 0.01);
        const lp = pt(i, LEVELS + 1.2, LEVELS);
        return (
          <g key={k}>
            <circle
              cx={data[k] === 0 ? CX : p.x} cy={data[k] === 0 ? CY : p.y}
              r={8} fill="var(--accent)" stroke="#fff" strokeWidth={2}
              style={{ cursor: 'pointer' }}
              onClick={() => onChange(k, (data[k] + 1) % (LEVELS + 1))}
            />
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: 10, fontFamily: "'Nunito'", fontWeight: 600, fill: 'var(--foreground-muted)' }}>
              {FLAVORS[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function RecipesPage() {
  const { mealPlan } = useData();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  // Generator controls
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState<string>('');
  const [flavors, setFlavors] = useState<Record<string, number>>({ salty: 1, sweet: 0, sour: 0, spicy: 1, umami: 1 });

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    setLoading(true);
    getFavoriteRecipes(userId)
      .then(data => {
        if (data?.length > 0) setFavorites(data);
      })
      .catch(() => { /* silently fail */ })
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    const userId = getUserId();
    if (!userId) return;
    setGenerating(true);
    const filters: RecipeFilters = {
      servings,
      difficulty: difficulty || undefined,
      flavor_profile: flavors,
    };
    try {
      const result = await generateRecipes(userId, filters);
      if (Array.isArray(result)) setSuggestions(result);
      else if (result?.recipes) setSuggestions(result.recipes);
    } catch (e) { /* */ }
    setGenerating(false);
  };

  const diffStyle = (d: string) => {
    const dl = d?.toLowerCase();
    if (dl === 'easy' || dl === 'beginner') return { color: 'var(--success)', bg: 'var(--success-bg)' };
    if (dl === 'medium' || dl === 'intermediate') return { color: 'var(--warning)', bg: 'var(--warning-bg)' };
    if (dl === 'hard' || dl === 'advanced') return { color: 'var(--danger)', bg: 'var(--danger-bg)' };
    return { color: 'var(--foreground-muted)', bg: 'var(--background-tertiary)' };
  };

  // Extract recipes from the weekly meal plan
  const mealPlanRecipes: any[] = [];
  if (mealPlan?.meals && Array.isArray(mealPlan.meals)) {
    const seen = new Set<string>();
    for (const meal of mealPlan.meals) {
      if (meal.recipe) {
        const name = meal.recipe.name || meal.recipe.title || '';
        if (name && !seen.has(name)) {
          seen.add(name);
          mealPlanRecipes.push(meal.recipe);
        }
      }
    }
  }

  // Show favorites if available, otherwise show meal plan recipes
  const recipes = favorites.length > 0 ? favorites : mealPlanRecipes;
  const hasLiveData = recipes.length > 0;

  const renderCard = (recipe: any, index: number) => {
    const ds = diffStyle(recipe.difficulty || '');
    const id = recipe.id || `r-${index}`;
    const expanded = expandedRecipe === id;
    const name = recipe.title || recipe.name || 'Untitled';
    const time = recipe.timeMinutes || recipe.cook_time_minutes || recipe.time_minutes;

    return (
      <div key={id} style={{ background: 'var(--background-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div onClick={() => setExpandedRecipe(expanded ? null : id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, cursor: 'pointer' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: recipe.placeholderColor || 'var(--background-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
            {recipe.emoji || '🍽️'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-body font-bold" style={{ fontSize: 13, color: 'var(--foreground)' }}>{name}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 3, flexWrap: 'wrap', alignItems: 'center' }}>
              {time && <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-muted)' }}>{time} min</span>}
              {recipe.difficulty && <Badge color={ds.color} bg={ds.bg}>{recipe.difficulty}</Badge>}
              {recipe.servings && <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-muted)' }}>{recipe.servings} servings</span>}
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        {expanded && (
          <div style={{ padding: '0 14px 14px 70px' }}>
            {recipe.description && <p className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)', marginBottom: 8 }}>{recipe.description}</p>}
            {(recipe.ingredients?.length > 0) && (
              <div style={{ marginBottom: 8 }}>
                <span className="font-body font-bold" style={{ fontSize: 11, color: 'var(--foreground)', display: 'block', marginBottom: 3 }}>Ingredients</span>
                {recipe.ingredients.map((ing: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '1px 0' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                    <span className="font-body" style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>
                      {ing.name || ing}{ing.amount ? ` — ${ing.amount}` : ing.quantity ? ` — ${ing.quantity} ${ing.unit || ''}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {(recipe.steps?.length > 0) && (
              <div>
                <span className="font-body font-bold" style={{ fontSize: 11, color: 'var(--foreground)', display: 'block', marginBottom: 3 }}>Steps</span>
                {recipe.steps.map((step: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 6, padding: '2px 0' }}>
                    <span className="font-body font-bold" style={{ fontSize: 10, color: 'var(--accent)', width: 14, textAlign: 'right', flexShrink: 0 }}>{i + 1}.</span>
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
    <div style={{ height: '100%', display: 'flex', gap: 16, overflow: 'hidden' }}>
      {/* Left: Generator controls */}
      <div style={{
        width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12,
        background: 'var(--background-card)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', padding: 16, overflow: 'hidden',
      }}>
        <span className="font-heading font-extrabold" style={{ fontSize: 16, color: 'var(--foreground)' }}>Generate Recipes</span>

        {/* Servings */}
        <div>
          <span className="font-body font-bold" style={{ fontSize: 11, color: 'var(--foreground-muted)', display: 'block', marginBottom: 4 }}>Servings</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 6].map(n => (
              <button
                key={n}
                onClick={() => setServings(n)}
                className="font-body font-bold"
                style={{
                  flex: 1, padding: '6px 0', borderRadius: 'var(--radius-full)', border: 'none', fontSize: 12, cursor: 'pointer',
                  background: servings === n ? 'var(--accent)' : 'var(--background-secondary)',
                  color: servings === n ? '#fff' : 'var(--foreground-muted)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <span className="font-body font-bold" style={{ fontSize: 11, color: 'var(--foreground-muted)', display: 'block', marginBottom: 4 }}>Difficulty</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { label: 'Easy', value: 'easy', c: 'var(--success)', bg: 'var(--success-bg)' },
              { label: 'Medium', value: 'medium', c: 'var(--warning)', bg: 'var(--warning-bg)' },
              { label: 'Hard', value: 'hard', c: 'var(--danger)', bg: 'var(--danger-bg)' },
            ].map(d => (
              <button
                key={d.value}
                onClick={() => setDifficulty(difficulty === d.value ? '' : d.value)}
                className="font-body font-bold"
                style={{
                  flex: 1, padding: '6px 0', borderRadius: 'var(--radius-full)', border: 'none', fontSize: 11, cursor: 'pointer',
                  background: difficulty === d.value ? d.c : 'var(--background-secondary)',
                  color: difficulty === d.value ? '#fff' : 'var(--foreground-muted)',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Flavor Profile Radar */}
        <div>
          <span className="font-body font-bold" style={{ fontSize: 11, color: 'var(--foreground-muted)', display: 'block', marginBottom: 4 }}>Flavor Profile</span>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <FlavorRadar
              data={flavors}
              onChange={(key, val) => setFlavors(prev => ({ ...prev, [key]: val }))}
            />
          </div>
          <span className="font-body" style={{ fontSize: 9, color: 'var(--foreground-hint)', textAlign: 'center', display: 'block' }}>
            Click dots to adjust (0–3)
          </span>
        </div>

        {/* Generate button */}
        <Button variant="primary" onClick={handleGenerate} disabled={generating} className="w-full">
          {generating ? 'Generating...' : 'Generate from Pantry'}
        </Button>
        {!getUserId() && (
          <span className="font-body" style={{ fontSize: 10, color: 'var(--foreground-hint)', textAlign: 'center', display: 'block' }}>
            Message @ChefBobbyBot on Telegram first to connect
          </span>
        )}
      </div>

      {/* Right: Recipe list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="font-heading font-extrabold" style={{ fontSize: 20, color: 'var(--foreground)' }}>Recipes</span>
            <Badge color="var(--foreground-muted)" bg="var(--background-tertiary)">{recipes.length + suggestions.length}</Badge>
          </div>
          {hasLiveData && <Badge color="var(--success)" bg="var(--success-bg)">Live</Badge>}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scrollbar">
          {suggestions.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <span className="font-body font-bold" style={{ fontSize: 13, color: 'var(--accent)', display: 'block', marginBottom: 6 }}>AI Suggestions</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {suggestions.map((r, i) => renderCard(r, 1000 + i))}
              </div>
            </div>
          )}
          {loading ? (
            <div className="font-body" style={{ textAlign: 'center', padding: 40, color: 'var(--foreground-muted)' }}>Loading...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recipes.map((r, i) => renderCard(r, i))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
