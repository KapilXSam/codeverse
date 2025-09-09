import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import FileExplorer from './FileExplorer';
import Editor from './Editor';
import Terminal from './Terminal';
import { FileNode } from '../types';

interface IdeViewProps {
  files: FileNode[];
  onFileContentChange: (path: string, content: string) => void;
  terminalOutput: string[];
}

const findFile = (nodes: FileNode[], path: string): FileNode | null => {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findFile(node.children, path);
      if (found) return found;
    }
  }
  return null;
};


const IdeView: React.FC<IdeViewProps> = ({ files, onFileContentChange, terminalOutput }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('/src/App.tsx');
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);

  useEffect(() => {
    const foundFile = findFile(files, selectedFilePath);
    if(foundFile) {
      setActiveFile(foundFile);
    } else {
        // Find first file if selected one is not found
        const findFirstFile = (nodes: FileNode[]): FileNode | null => {
            for (const node of nodes) {
                if (node.content !== undefined) return node;
                if (node.children) {
                    const found = findFirstFile(node.children);
                    if (found) return found;
                }
            }
            return null;
        }
        const firstFile = findFirstFile(files);
        if (firstFile) {
            setSelectedFilePath(firstFile.path);
            setActiveFile(firstFile);
        }
    }
  }, [selectedFilePath, files]);

  return (
    <div className="flex h-full bg-background">
      <div className="w-64 bg-card border-r border-border flex-shrink-0">
        <FileExplorer files={files} onSelectFile={setSelectedFilePath} selectedFilePath={selectedFilePath} />
      </div>
      <div className="flex-grow flex flex-col">
        <Split
          sizes={[70, 30]}
          minSize={[200, 150]}
          direction="vertical"
          className="flex-grow h-full"
          gutterClassName="gutter-vertical"
        >
          <div className="h-full overflow-auto">
            <Editor
              file={activeFile}
              onContentChange={onFileContentChange}
            />
          </div>
          <div className="h-full overflow-auto">
            <Terminal output={terminalOutput} />
          </div>
        </Split>
      </div>
      {/* Add styles for react-split gutter */}
      <style>{`
        .gutter-vertical {
          background-color: hsl(var(--border));
          cursor: row-resize;
        }
        .gutter-vertical:hover {
          background-color: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
};

export default IdeView;
