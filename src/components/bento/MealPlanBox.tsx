import { useState } from 'react';
import { mockMealPlan } from '../../data/mock';
import { useData } from '../../context/DataContext';
import type { MealPlanDay } from '../../types';

export default function MealPlanBox() {
  const [skippedDays, setSkippedDays] = useState<Set<number>>(new Set());
  const { mealPlan, connected } = useData();

  const toggleDay = (index: number) => {
    setSkippedDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Convert live meal plan data to display format, or use mock
  let displayPlan: MealPlanDay[] = mockMealPlan;
  let hasLiveData = false;

  if (mealPlan && mealPlan.days && Array.isArray(mealPlan.days)) {
    displayPlan = mealPlan.days.map((day: any) => ({
      day: day.day || day.name || '',
      dayShort: (day.day || day.name || '').substring(0, 3).toUpperCase(),
      recipe: day.recipe
        ? { title: day.recipe.title || day.recipe.name || '', emoji: day.recipe.emoji || '' }
        : null,
      cooked: day.cooked || false,
      isToday: day.isToday || false,
    }));
    hasLiveData = true;
  } else if (mealPlan && Array.isArray(mealPlan)) {
    displayPlan = mealPlan.map((day: any) => ({
      day: day.day || day.name || '',
      dayShort: (day.day || day.name || '').substring(0, 3).toUpperCase(),
      recipe: day.recipe
        ? { title: day.recipe.title || day.recipe.name || '', emoji: day.recipe.emoji || '' }
        : null,
      cooked: day.cooked || false,
      isToday: day.isToday || false,
    }));
    hasLiveData = true;
  }

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
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 800,
              fontSize: 13,
              color: 'var(--foreground)',
            }}
          >
            Meal Plan
          </span>
          {connected && hasLiveData && (
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
        </div>
        <span
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: 10,
            color: 'var(--accent)',
          }}
        >
          This Week
        </span>
      </div>

      {/* Days grid */}
      <div style={{ flex: 1, display: 'flex', gap: 4 }}>
        {displayPlan.map((day, index) => {
          const isSkipped = skippedDays.has(index);

          return (
            <div
              key={day.day}
              onClick={() => toggleDay(index)}
              style={{
                flex: 1,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '6px 2px',
                cursor: 'pointer',
                userSelect: 'none',
                opacity: isSkipped ? 0.4 : 1,
                transition: 'opacity 0.2s',
                ...(day.isToday
                  ? {
                      border: '1.5px solid var(--accent)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--accent-bg)',
                    }
                  : {}),
              }}
            >
              {/* Day label */}
              <span
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  fontSize: 9,
                  color: 'var(--foreground-muted)',
                  textTransform: 'uppercase',
                }}
              >
                {day.dayShort}
              </span>

              {/* Icon container */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: 'var(--background-secondary)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  margin: '4px 0',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                {day.recipe ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 11h.01" />
                    <path d="M11 15h.01" />
                    <path d="M16 16h.01" />
                    <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
                  </svg>
                ) : (
                  <span style={{ color: 'var(--foreground-muted)' }}>&mdash;</span>
                )}

                {/* Cooked checkmark overlay */}
                {day.cooked && !isSkipped && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Dish name */}
              {day.recipe ? (
                <span
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: 8,
                    color: 'var(--foreground)',
                    lineHeight: 1.2,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    textDecoration: isSkipped ? 'line-through' : 'none',
                  }}
                >
                  {day.recipe.title}
                </span>
              ) : (
                <span
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: 8,
                    color: 'var(--foreground-hint)',
                    fontStyle: 'italic',
                    lineHeight: 1.2,
                  }}
                >
                  Rest
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
