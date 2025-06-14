import { createGlobalStyle } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Estilos globales base de la aplicación
 * Define variables CSS personalizadas que adoptan los valores del tema actual
 * Establece reset de CSS y estilos base para elementos HTML comunes
 */
const BaseStyles = createGlobalStyle`
    :root {
        --primary: ${props => props.theme.primary};
        --primary-dark: ${props => props.theme.primaryDark};
        --primary-light: ${props => props.theme.primary}30;
        --background: ${props => props.theme.background};
        --card: ${props => props.theme.card};
        --text: ${props => props.theme.text};
        --text-secondary: ${props => props.theme.textSecondary};
        --border: ${props => props.theme.border};
        --success: ${props => props.theme.success};
        --error: ${props => props.theme.error};
        --warning: ${props => props.theme.warning};
        --info: ${props => props.theme.info};
        --border-radius: 8px;
        --border-radius-lg: 12px;
        --border-radius-xl: 16px;
        --font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        --shadow-sm: 0 2px 5px rgba(0, 0, 0, 0.08);
        --shadow-md: 0 4px 10px rgba(0, 0, 0, 0.12);
        --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.15);
        --transition: 0.3s ease;
        --spacing-xs: 4px;
        --spacing-sm: 8px;
        --spacing-md: 16px;
        --spacing-lg: 24px;
        --spacing-xl: 32px;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html, body {
        height: 100%;
    }

    body {
        font-family: var(--font-family);
        background-color: var(--background);
        color: var(--text);
        line-height: 1.6;
        transition: background-color var(--transition), color var(--transition);
        overflow-x: hidden;
        padding-bottom: var(--spacing-xl);
        scroll-behavior: smooth;
    }

    h1, h2, h3, h4, h5, h6 {
        margin-bottom: 1rem;
        color: var(--text);
        font-weight: 600;
        line-height: 1.2;
    }

    /* Excluimos los títulos de notificaciones de los estilos globales */
    [class*="NotificationTitle"] {
        color: inherit;
    }

    h1 {
        font-size: 2rem;
    }

    h2 {
        font-size: 1.75rem;
    }

    h3 {
        font-size: 1.5rem;
    }

    a {
        text-decoration: none;
        color: var(--primary);
        transition: color var(--transition);
    }

    a:hover {
        color: var(--primary-dark);
    }

    button, .button {
        cursor: pointer;
        border: none;
        border-radius: var(--border-radius);
        padding: 0.5rem 1rem;
        background-color: var(--primary);
        color: white;
        font-weight: 500;
        transition: background-color var(--transition), transform var(--transition);
        font-family: var(--font-family);
        font-size: 0.9rem;
    }

    /* Excluimos los botones de cierre de notificaciones de los estilos globales */
    [class*="CloseButton"] {
        color: inherit;
    }

    button:hover:not(:disabled), .button:hover:not(:disabled) {
        background-color: var(--primary-dark);
        transform: translateY(-1px);
    }

    button:disabled, .button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    p {
        margin-bottom: 1rem;
        color: var(--text);
    }

    /* Excluimos los mensajes de notificaciones de los estilos globales */
    [class*="NotificationMessage"] {
        color: inherit;
        margin-bottom: 0;
    }

    input, textarea, select {
        font-family: var(--font-family);
        font-size: 0.95rem;
        transition: border-color var(--transition), box-shadow var(--transition);
    }

    /* Scrollbar personalizado */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: ${props => props.theme.themeMode === 'dark' ? '#222' : '#f1f1f1'};
    }

    ::-webkit-scrollbar-thumb {
        background: ${props => props.theme.themeMode === 'dark' ? '#444' : '#ccc'};
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${props => props.theme.themeMode === 'dark' ? '#555' : '#bbb'};
    }

    /* Estilos de focus accesibles */
    :focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
    }

    /* Transiciones suaves entre temas */
    * {
        transition: background-color 0.3s, color 0.3s, border-color 0.3s;
    }
`;

/**
 * Componente que aplica los estilos globales
 * Obtiene el tema actual del contexto ThemeContext y lo inyecta en los estilos globales
 * @returns {React.Component} Componente de estilos globales con el tema aplicado
 */
const GlobalStyles = () => {
    const { theme, themeMode } = useTheme();
    return <BaseStyles theme={theme} themeMode={themeMode} />;
};

export default GlobalStyles;
