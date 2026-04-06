import React from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
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
  const totalFiles = reports ? Object.keys(reports).length : 0;
  const totalIssues = reports
    ? Object.values(reports).reduce((sum, issues) => sum + issues.length, 0)
    : 0;

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Analysis Results</h2>
        {loading && (
          <span className="loading-spinner">
            <Loader2 size={14} className="btn-icon spin" aria-hidden="true" />
            Analyzing...
          </span>
        )}
      </div>

      {reports && (
        <div className="results-summary">
          <span>{totalFiles} file{totalFiles !== 1 ? "s" : ""} scanned</span>
          <span>{totalIssues} issue{totalIssues !== 1 ? "s" : ""} found</span>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      {reports ? (
        <div className="reports-list">
          {Object.entries(reports).map(([filename, issues]) => (
            <div key={filename} className="file-report">
              <div className="report-header">
                <h3>{filename}</h3>
                <span className={`issue-count ${issues.length === 0 ? "clean" : "has-issues"}`}>
                  {issues.length === 0 ? (
                    <>
                      <CheckCircle2 size={13} className="btn-icon" aria-hidden="true" />
                      Clean
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={13} className="btn-icon" aria-hidden="true" />
                      {issues.length} issue{issues.length !== 1 ? "s" : ""}
                    </>
                  )}
                </span>
              </div>

              {issues.length === 0 ? (
                <div className="clean-message">
                  <CheckCircle2 size={16} className="btn-icon" aria-hidden="true" />
                  No issues found.
                </div>
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
          <h3>Ready when you are</h3>
          <p>Paste Python code, then click Analyze to generate a review report.</p>
        </div>
      )}
    </div>
  );
};

