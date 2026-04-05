import { useState, useCallback } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", newValue ? "dark" : "light");
      return newValue;
    });
  }, []);

  // Apply theme on mount
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }

  return { isDark, toggleTheme };
}

