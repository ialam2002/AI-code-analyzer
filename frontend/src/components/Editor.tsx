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
  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2>Code Editor</h2>
        <span className="char-count">{value.length} characters</span>
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

