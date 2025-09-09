import React, { useState, useRef, useEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { SettingsIcon } from './icons/Icons';

interface HeaderProps {
  title: string;
  projectName?: string;
  githubUrl?: string | null;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, projectName, githubUrl, onBack }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-background border-b border-border p-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center">
        {onBack && (
          <button onClick={onBack} className="mr-4 p-2 rounded-md hover:bg-secondary">
            &larr; Back
          </button>
        )}
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {projectName && <span className="text-xl text-muted-foreground ml-2">/ {projectName}</span>}
      </div>
      <div className="flex items-center space-x-4">
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.19.01-.82.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21-.15.46-.55.38A8.013 8.013 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
            <span>View on GitHub</span>
          </a>
        )}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={() => setIsSettingsOpen(prev => !prev)}
            className="p-2 rounded-full hover:bg-secondary"
            aria-label="Theme settings"
          >
            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
          </button>
          {isSettingsOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-30">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <ThemeSwitcher />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
