// ThemeContext.js
import React, { createContext, useState, useContext } from "react";

// Create a context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to access the theme context
export const useTheme = () => {
    return useContext(ThemeContext);
};
