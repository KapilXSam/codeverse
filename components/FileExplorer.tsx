import React from 'react';
import { FileNode } from '../types';

interface FileExplorerProps {
  files: FileNode[];
  onSelectFile: (path: string) => void;
  selectedFilePath?: string;
}

const FileEntry: React.FC<{
  node: FileNode;
  onSelectFile: (path: string) => void;
  selectedFilePath?: string;
  level?: number;
}> = ({ node, onSelectFile, selectedFilePath, level = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const isDirectory = !!node.children;
  const isSelected = node.path === selectedFilePath;

  const handleSelect = () => {
    if (isDirectory) {
      setIsOpen(!isOpen);
    } else {
      onSelectFile(node.path);
    }
  };

  const paddingLeft = `${level * 16 + 12}px`;

  return (
    <div>
      <div
        onClick={handleSelect}
        className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-secondary rounded ${isSelected ? 'bg-secondary' : ''}`}
        style={{ paddingLeft }}
      >
        {isDirectory && (
          <span className="mr-1.5 transform transition-transform text-muted-foreground">{isOpen ? '▼' : '►'}</span>
        )}
        <span className={`ml-${isDirectory ? '0' : '5'} ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{node.name}</span>
      </div>
      {isDirectory && isOpen && (
        <div>
          {node.children?.map(child => (
            <FileEntry key={child.path} node={child} onSelectFile={onSelectFile} selectedFilePath={selectedFilePath} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onSelectFile, selectedFilePath }) => {
  return (
    <div className="text-sm text-foreground h-full flex flex-col">
      <h3 className="font-bold text-muted-foreground p-3 text-xs uppercase tracking-widest border-b border-border flex-shrink-0">Explorer</h3>
      <div className="p-2 flex-grow overflow-y-auto">
        {files.map(node => (
          <FileEntry key={node.path} node={node} onSelectFile={onSelectFile} selectedFilePath={selectedFilePath} />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;