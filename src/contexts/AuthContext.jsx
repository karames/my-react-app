import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api, apiConfig } from '../utils/api';

/**
 * Contexto para gestionar la autenticación en la aplicación
 * @type {React.Context}
 */
const AuthContext = createContext();

/**
 * Hook personalizado que permite a los componentes acceder al contexto de autenticación
 * @returns {Object} Objeto con valores y funciones de autenticación
 * @throws {Error} Si se usa fuera del AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

/**
 * Proveedor del contexto de autenticación que gestiona el estado de la sesión del usuario
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos envueltos por este provider
 */
export const AuthProvider = ({ children }) => {
    // Estado para almacenar datos del usuario autenticado
    const [user, setUser] = useState(null);
    // Estado para controlar carga durante operaciones de autenticación
    const [loading, setLoading] = useState(true);
    // Estado para manejar mensajes de error
    const [error, setError] = useState('');
    // Estado para almacenar la última ruta a la que se intentó acceder antes de autenticar
    const [lastAuthRedirect, setLastAuthRedirect] = useState('');

    /**
     * Efecto para verificar la autenticación del usuario al iniciar la aplicación
     * y configurar el manejador de eventos para errores de autenticación
     */
    useEffect(() => {
        /**
         * Verifica si hay un token almacenado y valida la sesión del usuario
         */
        const checkAuth = async () => {
            const token = localStorage.getItem(apiConfig.TOKEN_KEY);
            console.log('Token en localStorage:', token ? 'Presente' : 'Ausente');

            if (token) {
                try {
                    // Verificamos si el token es válido haciendo una petición al endpoint del perfil
                    const response = await api.get('/profile');

                    // Configuramos el usuario con los datos de perfil
                    setUser({
                        ...response.data,
                        // Generamos un ID consistente si no viene del servidor
                        id: response.data.id || (response.data.email ? response.data.email.split('@')[0] : 'user')
                    });
                } catch (error) {
                    console.error('Error al verificar el token:', error);

                    // Eliminamos el token inválido o expirado
                    localStorage.removeItem(apiConfig.TOKEN_KEY);

                    // Manejamos diferentes tipos de errores de autenticación
                    if (error.response && error.response.status === 401) {
                        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
                    } else {
                        setError('Error al cargar tu perfil. Por favor, intenta iniciar sesión nuevamente.');
                    }
                }
            }
            setLoading(false);
        };

        checkAuth();

        /**
         * Manejador de eventos para errores de autenticación
         * Escucha el evento personalizado 'auth:unauthorized' que puede ser disparado
         * desde cualquier parte de la aplicación cuando se detecta un error de autenticación
         * @param {CustomEvent} event - Evento con detalles del error de autenticación
         */
        const handleAuthError = (event) => {
            // Guardamos la ruta actual para redirigir después del login
            if (event.detail && event.detail.path) {
                setLastAuthRedirect(event.detail.path);
                localStorage.setItem('auth_redirect', event.detail.path);
            }

            // Reseteamos el usuario y configuramos el mensaje de error
            setUser(null);
            setError(event.detail?.message || 'Sesión expirada. Por favor, inicia sesión nuevamente.');
        };

        // Configuramos el listener para eventos de autenticación inválida
        window.addEventListener('auth:unauthorized', handleAuthError);

        // Limpieza del efecto
        return () => {
            window.removeEventListener('auth:unauthorized', handleAuthError);
        };
    }, []);

    /**
     * Función para iniciar sesión de usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Object} Objeto con información sobre el resultado de la operación
     */
    const login = async (email, password) => {
        try {
            setLoading(true);

            // Realizamos la petición de login
            const response = await api.post('/login', { email, password });
            const { accessToken, user: userData } = response.data;

            // Guardamos el token de acceso en localStorage
            localStorage.setItem(apiConfig.TOKEN_KEY, accessToken);

            // Guardamos datos de usuario como respaldo
            localStorage.setItem('user_data', JSON.stringify(userData));

            // Actualizamos el estado con los datos del usuario
            setUser(userData);
            setError('');

            // Verificamos si hay una ruta guardada para redirigir después del login
            const redirectPath = localStorage.getItem('auth_redirect');
            if (redirectPath) {
                localStorage.removeItem('auth_redirect'); // Limpiamos después de usar

                // Devolvemos la ruta para que el componente de Auth maneje la navegación
                return { success: true, redirectPath };
            }

            return { success: true };
        } catch (error) {
            // Personalizamos el mensaje de error según el tipo de respuesta
            let errorMessage = 'Error al iniciar sesión';

            if (error.response) {
                // Manejamos diferentes códigos de error HTTP
                if (error.response.status === 400) {
                    errorMessage = 'Email o contraseña incorrectos';
                } else if (error.response.status === 401) {
                    errorMessage = 'No autorizado. Verifica tus credenciales.';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                // Error de conectividad con el servidor
                errorMessage = 'No se pudo conectar con el servidor. Verifica que esté en ejecución.';
            }

            // Actualizamos el estado de error
            setError(errorMessage);
            console.error('[Auth Error]', error);

            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    /**
     * Función para cerrar sesión del usuario
     * Elimina el token y resetea el estado del usuario
     */
    const logout = () => {
        localStorage.removeItem(apiConfig.TOKEN_KEY);
        localStorage.removeItem('user_data'); // Limpiamos también los datos de usuario
        setUser(null);
    };

    // Propiedad calculada para verificar si el usuario está autenticado
    const isAuthenticated = !!user;

    /**
     * Objeto con todos los valores y funciones que se exponen en el contexto
     * @type {Object}
     */
    const authValues = {
        user,            // Datos del usuario actual
        loading,         // Estado de carga de operaciones de autenticación
        error,           // Mensaje de error actual
        isAuthenticated, // Indicador booleano de autenticación
        login,           // Función para iniciar sesión
        logout,          // Función para cerrar sesión
        setError,        // Función para actualizar el mensaje de error
    };

    return (
        <AuthContext.Provider value={authValues}>
            {children}
        </AuthContext.Provider>
    );
};

// Validación de propiedades
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
