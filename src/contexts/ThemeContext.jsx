import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

/**
 * Definición del tema claro (por defecto)
 * Contiene colores y valores para el modo claro de la aplicación
 */
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

/**
 * Definición del tema oscuro
 * Contiene colores y valores para el modo oscuro de la aplicación
 */
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

/**
 * Contexto para la gestión de temas en la aplicación
 * @type {React.Context}
 */
const ThemeContext = createContext({
    theme: lightTheme,
    themeMode: 'light',
    toggleTheme: () => { },
});

/**
 * Hook personalizado para acceder al contexto de tema
 * @returns {Object} El contexto de tema con valores y funciones
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * Componente proveedor que gestiona el estado del tema de la aplicación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export const ThemeProvider = ({ children }) => {
    // Estado para el modo de tema actual (light/dark)
    const [themeMode, setThemeMode] = useState('light');
    // Estado para los valores concretos del tema según el modo
    const [theme, setTheme] = useState(lightTheme);

    /**
     * Efecto para cargar el tema guardado en localStorage al montar el componente
     */
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setThemeMode(savedTheme);
        }
    }, []);

    /**
     * Efecto para actualizar los valores del tema cuando cambia el modo
     */
    useEffect(() => {
        setTheme(themeMode === 'dark' ? darkTheme : lightTheme);
    }, [themeMode]);

    /**
     * Cambia entre tema claro y oscuro, y guarda la preferencia
     */
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
