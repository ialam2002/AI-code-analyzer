import React from "react";
import "../styles/results.css";

interface ResultsPanelProps {
  reports: Record<string, string[]> | null;
  error: string | null;
  loading: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  reports,
  error,
  loading,
}) => {
  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Analysis Results</h2>
        {loading && <span className="loading-spinner">⏳ Analyzing...</span>}
      </div>

      {error && <div className="error-box">{error}</div>}

      {reports ? (
        <div className="reports-list">
          {Object.entries(reports).map(([filename, issues]) => (
            <div key={filename} className="file-report">
              <div className="report-header">
                <h3>{filename}</h3>
                <span className={`issue-count ${issues.length === 0 ? "clean" : "has-issues"}`}>
                  {issues.length === 0 ? "✓ Clean" : `${issues.length} issue${issues.length !== 1 ? "s" : ""}`}
                </span>
              </div>

              {issues.length === 0 ? (
                <div className="clean-message">No issues found! 🎉</div>
              ) : (
                <ul className="issues-list">
                  {issues.map((issue, idx) => (
                    <li key={idx} className="issue-item">
                      {issue}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="placeholder">
          👈 Paste Python code and click "Analyze" to get started
        </div>
      )}
    </div>
  );
};

