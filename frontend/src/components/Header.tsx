import React from "react";
import { LogIn, LogOut, Moon, ShieldCheck, Sun, User } from "lucide-react";
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
          <h1>
            <ShieldCheck size={20} className="brand-icon" aria-hidden="true" />
            Code Review Assistant
          </h1>
          <p className="subtitle">Fast static analysis for Python files</p>
        </div>

        <div className="header-controls">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title="Toggle dark/light mode"
          >
            {isDark ? (
              <>
                <Sun size={14} className="btn-icon" aria-hidden="true" />
                Light
              </>
            ) : (
              <>
                <Moon size={14} className="btn-icon" aria-hidden="true" />
                Dark
              </>
            )}
          </button>

          {isLoggedIn && (
            <div className="user-info">
              <span className="username">
                <User size={13} className="btn-icon" aria-hidden="true" />
                {username}
              </span>
              <button className="logout-btn" onClick={onLogoutClick}>
                <LogOut size={14} className="btn-icon" aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <button className="login-btn" onClick={onLoginClick}>
              <LogIn size={14} className="btn-icon" aria-hidden="true" />
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

