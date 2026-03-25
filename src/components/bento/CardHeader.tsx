import Bobby from './Bobby';
import { useTheme } from '../../context/ThemeContext';
import { useGreeting } from '../../hooks/useGreeting';

const NAV_TABS = ['Dashboard', 'Pantry', 'Recipes', 'Orders'] as const;

export default function CardHeader() {
  const { isDayMode, toggleMode } = useTheme();
  const greeting = useGreeting();

  const greetingText = isDayMode ? greeting.text : greeting.nightText;

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left side: Bobby + branding */}
      <div className="flex items-center">
        <Bobby size={80} />
        <div className="flex flex-col" style={{ gap: 2, marginLeft: 12 }}>
          <span
            className="font-pixel text-[11px]"
            style={{ color: 'var(--accent)', letterSpacing: '-0.5px' }}
          >
            KittyCook
          </span>
          <span className="font-body text-[12px] text-foreground-muted max-w-[160px] truncate">
            {greetingText}
          </span>
        </div>
      </div>

      {/* Right side: nav tabs + mode toggle */}
      <div className="flex items-center gap-2">
        {NAV_TABS.map((tab) => {
          const isActive = tab === 'Dashboard';
          return (
            <button
              key={tab}
              className={`font-body font-bold text-[11px] px-3 py-[5px] rounded-full ${
                isActive ? 'text-white' : 'hover:bg-background-tertiary'
              }`}
              style={
                isActive
                  ? { background: 'var(--accent)' }
                  : { color: 'var(--foreground-muted)' }
              }
            >
              {tab}
            </button>
          );
        })}

        <button
          onClick={toggleMode}
          className="flex items-center justify-center rounded-full cursor-pointer"
          style={{
            width: 32,
            height: 32,
            background: 'var(--background-secondary)',
            border: '1px solid var(--border)',
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 12 }}>{isDayMode ? '\u2600\uFE0F' : '\uD83C\uDF19'}</span>
        </button>
      </div>
    </div>
  );
}
