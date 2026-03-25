import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { ThemeMode } from '../types';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  isDayMode: boolean;
  isNightMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('kittycook-theme');
    return (saved === 'night' ? 'night' : 'day') as ThemeMode;
  });

  useEffect(() => {
    localStorage.setItem('kittycook-theme', mode);
    if (mode === 'night') {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }, [mode]);

  const toggleMode = () => setMode(prev => prev === 'day' ? 'night' : 'day');

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, isDayMode: mode === 'day', isNightMode: mode === 'night' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
