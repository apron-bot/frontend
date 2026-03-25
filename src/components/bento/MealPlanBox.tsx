import { useState } from 'react';
import { mockMealPlan } from '../../data/mock';

export default function MealPlanBox() {
  const [skippedDays, setSkippedDays] = useState<Set<number>>(new Set());

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
        {mockMealPlan.map((day, index) => {
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

              {/* Emoji container */}
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
                  <span>{day.recipe.emoji}</span>
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
                      color: '#fff',
                      fontSize: 8,
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    &#10003;
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
