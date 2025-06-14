import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
    ],
    server: {
        port: 5173,
        open: true,
    },
    build: {
        outDir: 'dist',
    },
    root: '.', // Añadir la configuración de la raíz del proyecto
    base: './', // Añadir la configuración de la base del proyecto
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
