import Bobby from './Bobby';
import { useTheme } from '../../context/ThemeContext';
import { useGreeting } from '../../hooks/useGreeting';

const NAV_TABS = ['Dashboard', 'Pantry', 'Recipes', 'Orders'] as const;
type NavTab = (typeof NAV_TABS)[number];

interface CardHeaderProps {
  activePage: NavTab;
  onPageChange: (page: NavTab) => void;
}

export default function CardHeader({ activePage, onPageChange }: CardHeaderProps) {
  const { isDayMode, toggleMode } = useTheme();
  const greeting = useGreeting();

  const greetingText = isDayMode ? greeting.text : greeting.nightText;

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left side: Bobby + branding */}
      <div className="flex items-center">
        <Bobby size={110} />
        <div className="flex flex-col" style={{ gap: 2, marginLeft: 14 }}>
          <span
            className="font-pixel text-[13px]"
            style={{ color: 'var(--accent)', letterSpacing: '-0.5px' }}
          >
            KittyCook
          </span>
          <span
            className="font-body text-[13px] max-w-[200px] truncate"
            style={{ color: 'var(--foreground-muted)' }}
          >
            {greetingText}
          </span>
        </div>
      </div>

      {/* Right side: nav tabs + mode toggle */}
      <div className="flex items-center gap-2">
        {NAV_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onPageChange(tab)}
            className={`font-body font-bold text-[12px] px-4 py-[6px] rounded-full transition-all duration-200 ${
              activePage === tab ? 'text-white' : 'hover:bg-background-tertiary'
            }`}
            style={
              activePage === tab
                ? { background: 'var(--accent)' }
                : { color: 'var(--foreground-muted)' }
            }
          >
            {tab}
          </button>
        ))}

        <button
          onClick={toggleMode}
          className="flex items-center justify-center rounded-full cursor-pointer"
          style={{
            width: 34,
            height: 34,
            background: 'var(--background-secondary)',
            border: '1px solid var(--border)',
            transition: 'all 0.2s',
            marginLeft: 4,
          }}
        >
          {isDayMode ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
