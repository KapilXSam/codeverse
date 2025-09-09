import React from 'react';
import { BoardIcon, CodeIcon, PlayIcon, StopIcon } from './icons/Icons';

interface SidebarProps {
  viewMode: 'orchestration' | 'ide';
  onSetViewMode: (mode: 'orchestration' | 'ide') => void;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ viewMode, onSetViewMode, isRunning, onStart, onStop }) => {
  return (
    <aside className="w-20 bg-background border-r border-border flex flex-col items-center justify-between py-6">
      <div className="space-y-6">
        <button
          onClick={() => onSetViewMode('orchestration')}
          className={`p-3 rounded-lg transition-colors ${viewMode === 'orchestration' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
          title="Orchestration Board"
        >
          <BoardIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => onSetViewMode('ide')}
          className={`p-3 rounded-lg transition-colors ${viewMode === 'ide' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}
          title="IDE View"
        >
          <CodeIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="space-y-4">
        {isRunning ? (
          <button
            onClick={onStop}
            className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
            title="Stop Orchestration"
          >
            <StopIcon className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={onStart}
            className="p-3 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30"
            title="Start Orchestration"
          >
            <PlayIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
