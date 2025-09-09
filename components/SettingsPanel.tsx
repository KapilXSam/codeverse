import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const SettingsPanel: React.FC = () => {
  return (
    <div className="p-4 bg-card border-l border-border h-full">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Settings</h2>
      <ThemeSwitcher />
    </div>
  );
};

export default SettingsPanel;
