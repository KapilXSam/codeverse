import React, { useState, useEffect } from 'react';
import { FileNode } from '../types';
import FileExplorer from './FileExplorer';
import Editor from './Editor';
import Terminal from './Terminal';

interface IdeViewProps {
  files: FileNode[];
  onFileChange: (path: string, content: string) => void;
  terminalLogs: string[];
}

const IdeView: React.FC<IdeViewProps> = ({ files, onFileChange, terminalLogs }) => {
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string } | null>(null);

  const findFile = (nodes: FileNode[], path: string): FileNode | undefined => {
      for (const node of nodes) {
          if (node.path === path) return node;
          if (node.children) {
              const found = findFile(node.children, path);
              if(found) return found;
          }
      }
      return undefined;
  };
  
  useEffect(() => {
    if (selectedFile) {
        const file = findFile(files, selectedFile.path);
        if(file && typeof file.content === 'string' && file.content !== selectedFile.content) {
            setSelectedFile({path: file.path, content: file.content});
        }
    }
  }, [files, selectedFile?.path]);

  const handleSelectFile = (path: string) => {
    const file = findFile(files, path);
    if(file && typeof file.content === 'string') {
        setSelectedFile({ path: file.path, content: file.content });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (selectedFile && value !== undefined) {
      onFileChange(selectedFile.path, value);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-grow flex flex-row overflow-hidden h-2/3">
        <div className="w-1/4 min-w-[200px] bg-card overflow-y-auto border-r border-border">
          <FileExplorer files={files} onSelectFile={handleSelectFile} selectedFilePath={selectedFile?.path}/>
        </div>
        <div className="w-3/4">
          {selectedFile ? (
            <Editor path={selectedFile.path} value={selectedFile.content} onChange={handleEditorChange} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a file to begin editing
            </div>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 h-1/3 overflow-hidden border-t border-border">
        <Terminal logs={terminalLogs} />
      </div>
    </div>
  );
};

export default IdeView;