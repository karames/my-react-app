import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

// Tema claro (por defecto)
const lightTheme = {
    primary: '#007bff',
    primaryDark: '#0056b3',
    background: '#f4f4f4',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#dddddd',
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
};

// Tema oscuro
const darkTheme = {
    primary: '#0d6efd',
    primaryDark: '#0a58ca',
    background: '#121212',
    card: '#1e1e1e',
    text: '#e0e0e0',
    textSecondary: '#a0a0a0',
    border: '#333333',
    success: '#198754',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
};

// Crear el contexto de tema
const ThemeContext = createContext({
    theme: lightTheme,
    themeMode: 'light',
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('light');
    const [theme, setTheme] = useState(lightTheme);

    // Cargar el tema guardado en localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setThemeMode(savedTheme);
        }
    }, []);

    // Actualizar el tema cuando cambie el modo
    useEffect(() => {
        setTheme(themeMode === 'dark' ? darkTheme : lightTheme);
    }, [themeMode]);

    // Función para cambiar entre tema claro y oscuro
    const toggleTheme = () => {
        const newThemeMode = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newThemeMode);
        localStorage.setItem('theme', newThemeMode);
    };

    return (
        <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
