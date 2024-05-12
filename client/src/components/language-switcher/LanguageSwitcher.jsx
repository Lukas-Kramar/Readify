import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook

const LanguageSwitcher = () => {
    const { i18n } = useTranslation(); // Access the i18n instance

    const [languages, setLanguages] = useState(["ENG", "CZ"]);
    const [selectedLanguage, setSelectedLanguage] = useState("ENG");

    const changeLanguage = (lang) => {
        switch (lang) {
            case "ENG":
                setSelectedLanguage(lang);
                i18n.changeLanguage("en");
                return;
            case "CZ":
                setSelectedLanguage(lang);
                i18n.changeLanguage("cs");
                return;
            default:
                return;
        }
    };

    return (
        <div className="mb-3">
            {languages.map((lang, i) => (
                <button
                    key={i}
                    className={`btn mx-1 fw-bold ${lang === selectedLanguage ? "btn-secondary" : "btn-primary"
                        }`}
                    disabled={lang === selectedLanguage}
                    onClick={() => changeLanguage(lang)}
                >
                    {lang}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
