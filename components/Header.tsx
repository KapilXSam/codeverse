import React, { useState, useRef, useEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import { SettingsIcon } from './icons/Icons';

interface HeaderProps {
    title: string;
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-card text-foreground border-b border-border flex-shrink-0">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center space-x-4">
        {children}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Open theme settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          {isPopoverOpen && (
            <div
              ref={popoverRef}
              className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-10 p-4"
            >
              <ThemeSwitcher />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;