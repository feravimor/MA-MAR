import React, { createContext, useState } from 'react';

const translations = {
    en: {
        auth_error: 'Authentication error',
        fetch_error: 'Error fetching data',
        cancel_error: 'Error canceling appointment',
        appointment_management_title: 'Appointment Management',
        date_label: 'Date',
        time_label: 'Time',
        cancel_button: 'Cancel',
        no_appointments_message: 'No appointments available',
        // ...other translations...
    },
    es: {
        auth_error: 'Error de autenticación',
        fetch_error: 'Error al obtener datos',
        cancel_error: 'Error al cancelar la cita',
        appointment_management_title: 'Gestión de Citas',
        date_label: 'Fecha',
        time_label: 'Hora',
        cancel_button: 'Cancelar',
        no_appointments_message: 'No hay citas disponibles',
        // ...other translations...
    },
    // ...other languages...
};

const LanguageContext = createContext();

const MultiLanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const translate = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ translate, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export { MultiLanguageProvider, LanguageContext };
