import React, { useState } from "react";
import "../styles/editor.css";

interface FileUploadProps {
  onFilesSelected: (files: Record<string, string>) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    processFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    const fileMap: Record<string, string> = {};
    let processed = 0;

    Array.from(fileList).forEach((file) => {
      if (file.name.endsWith(".py")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            fileMap[file.name] = e.target.result as string;
            processed++;
            if (processed === fileList.length) {
              onFilesSelected(fileMap);
            }
          }
        };
        reader.readAsText(file);
      }
    });
  };

  return (
    <div
      className={`file-upload ${dragActive ? "active" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept=".py"
        onChange={handleChange}
        disabled={disabled}
        id="file-input"
        style={{ display: "none" }}
      />
      <label htmlFor="file-input" className="upload-label">
        <div className="upload-content">
          <span className="upload-icon">📁</span>
          <p>Drag Python files here or click to select</p>
          <p className="upload-hint">.py files only</p>
        </div>
      </label>
    </div>
  );
};

