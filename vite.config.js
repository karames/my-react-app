/**
 * Configuración de Vite para la aplicación React
 * @see {@link https://vitejs.dev/config/} para más información
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    /**
     * Plugins utilizados por Vite
     * @see {@link https://vitejs.dev/plugins/}
     */
    plugins: [
        react(), // Plugin oficial para soporte de React
    ],

    /**
     * Configuración del servidor de desarrollo
     */
    server: {
        port: 5173,      // Puerto en el que se ejecutará el servidor de desarrollo
        open: true,      // Abre automáticamente el navegador al iniciar
    },

    /**
     * Configuración de construcción para producción
     */
    build: {
        outDir: 'dist',  // Directorio donde se generarán los archivos de producción
    },

    /**
     * Directorio raíz del proyecto
     */
    root: '.',

    /**
     * Ruta base para los assets en producción
     * './' permite desplegar la aplicación en cualquier subdirectorio
     */
    base: './',

    /**
     * Configuración de resolución de rutas
     */
    resolve: {
        alias: {
            '@': '/src', // Permite usar '@/' como alias para la carpeta src
        },
    },
});
