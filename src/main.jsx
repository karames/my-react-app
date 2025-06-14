import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

/**
 * Punto de entrada principal de la aplicación React
 * Renderiza el componente App dentro del ThemeProvider para gestión de temas
 * y lo envuelve en StrictMode para detectar problemas potenciales
 */
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </React.StrictMode>
)
