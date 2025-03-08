import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        color: #333;
        line-height: 1.6;
    }

    h1, h2, h3, h4, h5, h6 {
        margin-bottom: 1rem;
    }

    a {
        text-decoration: none;
        color: #007bff;
    }

    a:hover {
        text-decoration: underline;
    }

    button {
        cursor: pointer;
        border: none;
        border-radius: 4px;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #0056b3;
    }

    p {
        margin: 0;
        padding: 0;
    }
`;

export default GlobalStyles;
