import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

type Theme = 'light' | 'dark';
export type AccentColor = 'teal' | 'blue' | 'green' | 'violet' | 'orange' | 'rose';

interface ThemeContextType {
  theme: Theme;
  accent: AccentColor;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ACCENT_COLORS: AccentColor[] = ['teal', 'blue', 'green', 'violet', 'orange', 'rose'];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (storedTheme) return storedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
     if (typeof window !== 'undefined') {
      const storedAccent = window.localStorage.getItem('accentColor') as AccentColor;
      return ACCENT_COLORS.includes(storedAccent) ? storedAccent : 'blue';
    }
    return 'blue';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
      
      root.setAttribute('data-accent-color', accent);
      localStorage.setItem('accentColor', accent);
    }
  }, [theme, accent]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setAccent = (newAccent: AccentColor) => setAccentState(newAccent);

  const value = useMemo(() => ({ theme, accent, setTheme, setAccent }), [theme, accent]);

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};