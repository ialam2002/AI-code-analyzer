import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Editor } from "./components/Editor";
import { ResultsPanel } from "./components/ResultsPanel";
import { FileUpload } from "./components/FileUpload";
import { useAuth } from "./hooks/useAuth";
import { analysisAPI } from "./api/client";
import "./styles/theme.css";
import "./styles/editor.css";
import "./styles/results.css";
import "./styles/responsive.css";
import "./styles.css";

type Reports = Record<string, string[]>;

export default function App() {
  const [filesText, setFilesText] = useState<string>(
    "# Paste Python code here or upload .py files\n\n# Example:\nprint('Hello World')\nimport unused_module"
  );
  const [reports, setReports] = useState<Reports | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { user, logout } = useAuth();

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // User is logged in
    }
  }, []);

  const buildPayload = (): Record<string, string> => {
    // Simple convention: if text contains a line like `---path/to/file.py---`, split into files
    const lines = filesText.split(/\r?\n/);
    let currentName = "code.py";
    let buffer: string[] = [];
    const result: Record<string, string> = {};

    for (const line of lines) {
      const m = line.match(/^---\s*(.+?)\s*---$/);
      if (m) {
        if (buffer.length > 0) {
          result[currentName] = buffer.join("\n");
        }
        currentName = m[1];
        buffer = [];
      } else {
        buffer.push(line);
      }
    }
    if (buffer.length > 0) result[currentName] = buffer.join("\n");

    return Object.keys(result).length > 0 ? result : { "code.py": filesText };
  };

  const handleAnalyze = async () => {
    setError(null);
    setLoading(true);
    setReports(null);
    try {
      const payload = buildPayload();
      const response = await analysisAPI.analyze(payload);
      setReports(response.data.reports);
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to analyze code";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesUpload = (uploadedFiles: Record<string, string>) => {
    // Set the first file as the main text, or concatenate all
    const fileNames = Object.keys(uploadedFiles);
    if (fileNames.length === 1) {
      setFilesText(uploadedFiles[fileNames[0]]);
    } else {
      // Multiple files - concatenate with separator
      const combined = fileNames
        .map((name) => `---${name}---\n${uploadedFiles[name]}`)
        .join("\n");
      setFilesText(combined);
    }
  };

  const handleLogout = () => {
    logout();
    setShowLoginModal(false);
  };

  return (
    <div className="app">
      <Header
        isLoggedIn={!!user}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
        username={user?.username}
      />

      <main className="app-main">
        <div className="container">
          <section className="editor-section">
            <Editor
              value={filesText}
              onChange={setFilesText}
              disabled={loading}
            />
            <FileUpload onFilesSelected={handleFilesUpload} disabled={loading} />
            <div className="controls">
              <button
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={loading || !filesText.trim()}
              >
                {loading ? "🔄 Analyzing..." : "🔍 Analyze"}
              </button>
            </div>
          </section>

          <section className="results-section">
            <ResultsPanel
              reports={reports}
              error={error}
              loading={loading}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

