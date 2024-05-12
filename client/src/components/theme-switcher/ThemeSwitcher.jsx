import React, { useState } from "react";
import IconButton from "../buttons/IconButton";
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "./ThemeContext";

const ThemeSwitcher = () => {
    const { isDarkMode, setIsDarkMode } = useTheme();

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);

        // Get the <html> element
        const htmlElement = document.querySelector("html");
        // Update the data-bs-theme attribute
        htmlElement.setAttribute("data-bs-theme", isDarkMode ? "light" : "dark");
    };

    return (
        <IconButton
            text={isDarkMode ? "Dark Mode" : "Light Mode"}
            onClick={toggleTheme}
            icon={isDarkMode ? faMoon : faSun}
            styling={`btn mx-1 fw-bold ${isDarkMode ? "btn-dark" : "btn-light"}`}
        />
    );
};

export default ThemeSwitcher;
