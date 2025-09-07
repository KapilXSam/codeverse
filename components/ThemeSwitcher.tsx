import React from 'react';
import { useTheme, ACCENT_COLORS } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from './icons/Icons';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, accent, setAccent } = useTheme();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Mode</h3>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-md bg-secondary">
          <button
            onClick={() => setTheme('light')}
            className={`px-2 py-1 text-sm rounded ${theme === 'light' ? 'bg-background text-foreground' : 'text-muted-foreground'}`}
          >
            <SunIcon className="w-4 h-4 inline mr-1.5" />
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`px-2 py-1 text-sm rounded ${theme === 'dark' ? 'bg-background text-foreground' : 'text-muted-foreground'}`}
          >
            <MoonIcon className="w-4 h-4 inline mr-1.5" />
            Dark
          </button>
        </div>
      </div>
       <div>
        <h3 className="text-sm font-medium text-foreground mb-2">Accent Color</h3>
        <div className="grid grid-cols-6 gap-2">
            {ACCENT_COLORS.map(color => {
                const isActive = accent === color;
                return (
                    <button
                        key={color}
                        onClick={() => setAccent(color)}
                        className={`h-8 w-8 rounded-full border-2 transition-all ${isActive ? 'border-ring' : 'border-transparent'}`}
                        style={{ backgroundColor: `hsl(var(--theme-accent-${color}))` }}
                        aria-label={`Set accent color to ${color}`}
                    >
                         {/* This is a trick to get Tailwind to generate the classes */}
                         <span className="hidden bg-[#16a34a] bg-[#ea580c] bg-[#6d28d9] bg-[#0284c7] bg-[#ca8a04] bg-[#e11d48]"></span>
                    </button>
                )
            })}
        </div>
      </div>
       {/* Add a style tag to define the colors for the buttons, as they can't use dynamic tailwind classes */}
       <style>{`
          :root {
            --theme-accent-teal: #14b8a6;
            --theme-accent-blue: #0ea5e9;
            --theme-accent-green: #22c55e;
            --theme-accent-violet: #8b5cf6;
            --theme-accent-orange: #f97316;
            --theme-accent-rose: #f43f5e;
          }
       `}</style>
    </div>
  );
};

export default ThemeSwitcher;