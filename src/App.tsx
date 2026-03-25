import { useTheme } from './context/ThemeContext';
import BentoGrid from './components/bento/BentoGrid';
import { BrowserAgentOverlay } from './components/BrowserAgentOverlay';
import ginghamPattern from './assets/ginham_pattern.png';

function App() {
  const { isNightMode } = useTheme();

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundImage: `url(${ginghamPattern})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {isNightMode && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(26, 20, 16, 0.85)',
            zIndex: 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Main cream card — bigger: 24px margin instead of 48px */}
      <div
        style={{
          width: 'calc(100vw - 24px)',
          height: 'calc(100dvh - 24px)',
          maxWidth: '1400px',
          background: 'var(--background)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 32px var(--shadow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          transition: 'background 0.3s ease',
        }}
      >
        <BentoGrid />
      </div>

      <BrowserAgentOverlay />
    </div>
  );
}

export default App;
