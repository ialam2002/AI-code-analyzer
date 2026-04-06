import React, { useState } from "react";
import { FileCode2, UploadCloud } from "lucide-react";
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
  const [selectedCount, setSelectedCount] = useState(0);

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
    const pythonFiles = Array.from(fileList).filter((file) => file.name.endsWith(".py"));
    let processed = 0;

    if (pythonFiles.length === 0) {
      setSelectedCount(0);
      return;
    }

    pythonFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          fileMap[file.name] = e.target.result as string;
          processed++;
          if (processed === pythonFiles.length) {
            setSelectedCount(Object.keys(fileMap).length);
            onFilesSelected(fileMap);
          }
        }
      };
      reader.readAsText(file);
    });
  };

  return (
    <div
      className={`file-upload ${dragActive ? "active" : ""} ${disabled ? "disabled" : ""}`}
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
          <span className="upload-icon" aria-hidden="true">
            <UploadCloud size={28} />
          </span>
          <p>Drop Python files here or click to browse</p>
          <p className="upload-hint">Only `.py` files are imported</p>
          {selectedCount > 0 && (
            <p className="upload-selected">
              <FileCode2 size={13} className="btn-icon" aria-hidden="true" />
              {selectedCount} file{selectedCount > 1 ? "s" : ""} loaded
            </p>
          )}
        </div>
      </label>
    </div>
  );
};

