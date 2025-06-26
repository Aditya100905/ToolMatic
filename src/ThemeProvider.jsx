import { createContext, useContext, useEffect, useState } from "react";

// Creating ThemeContext
const ThemeContext = createContext();

// ThemeProvider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage if available
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = () => {
    // Toggle between light and dark themes
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme); // Save to localStorage
      return newTheme;
    });
  };

  useEffect(() => {
    // Remove both light and dark classes to prevent overlapping styles
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme); // Apply the selected theme
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* Set the background color for the body based on the theme */}
      <div
        className={`transition-all duration-300 ${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
