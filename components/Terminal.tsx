import React, { useEffect, useRef } from 'react';

interface TerminalProps {
  output: string[];
}

const Terminal: React.FC<TerminalProps> = ({ output }) => {
  const endOfOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfOutputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div className="bg-black text-gray-300 font-mono text-sm p-4 h-full flex flex-col">
      <div className="flex-shrink-0 border-b border-gray-700 pb-2 mb-2">
        <h3 className="text-white uppercase tracking-wider">Terminal</h3>
      </div>
      <div className="flex-grow overflow-y-auto">
        {output.map((line, index) => (
          <div key={index} className="flex">
            <span className="text-green-400 mr-2">$</span>
            <span className="flex-1 whitespace-pre-wrap">{line}</span>
          </div>
        ))}
        <div ref={endOfOutputRef} />
      </div>
    </div>
  );
};

export default Terminal;
