import React from "react";
import "../styles/editor.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  placeholder = "Paste Python code here...",
  disabled = false,
}) => {
  const lineCount = value.length > 0 ? value.split(/\r?\n/).length : 0;
  const wordCount = value.trim().length > 0 ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Code Editor</h2>
        <div className="editor-meta">
          <span className="editor-tag">Python</span>
          <span className="char-count">
            {lineCount} lines | {wordCount} words | {value.length} chars
          </span>
        </div>
      </div>
      <textarea
        className="editor-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

