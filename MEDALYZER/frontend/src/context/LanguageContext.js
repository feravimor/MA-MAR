import React, { createContext, useState, useContext } from 'react';

// Translation files
const translations = {
    en: {
        dashboard: "Dashboard",
        financialReports: "Financial Reports",
        inventoryManagement: "Inventory Management",
        treatmentManagement: "Treatment Management",
        predictiveAnalysis: "Predictive Analysis",
        settings: "Settings",
        languageSelection: "Language Selection",
    },
    es: {
        dashboard: "Panel",
        financialReports: "Informes Financieros",
        inventoryManagement: "Gestión de Inventario",
        treatmentManagement: "Gestión de Tratamientos",
        predictiveAnalysis: "Análisis Predictivo",
        settings: "Configuraciones",
        languageSelection: "Selección de Idioma",
    },
};

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");

    const switchLanguage = (lang) => {
        setLanguage(lang);
    };

    const t = (key) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, switchLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
