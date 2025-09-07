
import React from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';

interface EditorProps {
  path: string;
  value: string;
  onChange: (value: string | undefined) => void;
}

const Editor: React.FC<EditorProps> = ({ path, value, onChange }) => {
  return (
    <MonacoEditor
      height="100%"
      path={path}
      defaultValue={value}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
};

export default Editor;
