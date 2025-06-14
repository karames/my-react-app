import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    :root {
        --primary: #007bff;
        --primary-dark: #0056b3;
        --background: #f4f4f4;
        --text: #333;
        --border-radius: 4px;
        --font-family: 'Arial', sans-serif;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: var(--font-family);
        background-color: var(--background);
        color: var(--text);
        line-height: 1.6;
    }

    h1, h2, h3, h4, h5, h6 {
        margin-bottom: 1rem;
    }

    a {
        text-decoration: none;
        color: var(--primary);
    }

    a:hover {
        text-decoration: underline;
    }

    button {
        cursor: pointer;
        border: none;
        border-radius: var(--border-radius);
        padding: 0.5rem 1rem;
        background-color: var(--primary);
        color: white;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: var(--primary-dark);
    }

    p {
        margin: 0;
        padding: 0;
    }
`;

export default GlobalStyles;
