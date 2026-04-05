import React from "react";
import { useTheme } from "../hooks/useTheme";
import "../styles/theme.css";

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  username?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  username,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <h1>🔍 Code Review Assistant</h1>
          <p className="subtitle">AI-powered Python code analysis</p>
        </div>

        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title="Toggle dark/light mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {isLoggedIn && (
            <div className="user-info">
              <span className="username">👤 {username}</span>
              <button className="logout-btn" onClick={onLogoutClick}>
                Logout
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <button className="login-btn" onClick={onLoginClick}>
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

