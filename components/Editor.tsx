import React, { useState, useEffect } from 'react';
import { FileNode } from '../types';

interface EditorProps {
  file: FileNode | null;
  onContentChange: (path: string, content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ file, onContentChange }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    setContent(file?.content || '');
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (file) {
      onContentChange(file.path, e.target.value);
    }
  };

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full bg-background text-muted-foreground">
        <p>Select a file to start editing.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-editor-background">
      <div className="flex-shrink-0 bg-card border-b border-border p-2 text-sm text-foreground">
        {file.path}
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        className="w-full h-full p-4 bg-editor-background text-editor-foreground font-mono text-sm resize-none outline-none leading-relaxed"
        spellCheck="false"
      />
    </div>
  );
};

export default Editor;
