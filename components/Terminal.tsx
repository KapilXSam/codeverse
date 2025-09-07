import React, { useEffect, useRef } from 'react';

interface TerminalProps {
  logs: string[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full bg-background text-foreground font-mono text-sm p-4 flex flex-col">
      <h3 className="text-muted-foreground font-bold mb-2 flex-shrink-0 text-xs uppercase tracking-wider">Terminal</h3>
      <div ref={terminalRef} className="flex-grow overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index} className="whitespace-pre-wrap text-muted-foreground">{log}</div>
        ))}
      </div>
    </div>
  );
};

export default Terminal;