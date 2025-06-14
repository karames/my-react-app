import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { api, apiConfig } from '../utils/api';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastAuthRedirect, setLastAuthRedirect] = useState('');

    // Verificar si hay un token almacenado al iniciar la aplicación
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem(apiConfig.TOKEN_KEY);
            console.log('Token en localStorage:', token ? 'Presente' : 'Ausente');

            if (token) {
                try {
                    console.log('Verificando token de autenticación...');
                    // console.log('Token valor:', token); // Comentado por seguridad

                    // Verificar si el token es válido
                    const response = await api.get('/profile');
                    console.log('Respuesta del perfil:', response.data);
                    setUser({
                        ...response.data,
                        // Asegurar que tengamos una propiedad id
                        id: response.data.id || (response.data.email ? response.data.email.split('@')[0] : 'user')
                    });
                } catch (error) {
                    console.error('Error al verificar el token:', error);
                    console.error('Detalles del error:', error.response ? error.response.data : 'No hay datos de respuesta');
                    // Token inválido o expirado
                    localStorage.removeItem(apiConfig.TOKEN_KEY);
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

        // Escuchar eventos de autenticación inválida
        const handleAuthError = (event) => {
            console.log('Evento de autenticación inválida recibido:', event.detail);
            // Guardar la ruta actual para redirigir después del login
            if (event.detail && event.detail.path) {
                setLastAuthRedirect(event.detail.path);
                localStorage.setItem('auth_redirect', event.detail.path);
            }
            // No redireccionamos aquí automáticamente, dejamos que los componentes manejen esto
            setUser(null);
            setError(event.detail?.message || 'Sesión expirada. Por favor, inicia sesión nuevamente.');
        };

        window.addEventListener('auth:unauthorized', handleAuthError);

        return () => {
            window.removeEventListener('auth:unauthorized', handleAuthError);
        };
    }, []);

    // Iniciar sesión
    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await api.post('/login', { email, password });
            const { accessToken, user: userData } = response.data;

            // Guardar el token y asegurarse de que se guarda correctamente
            localStorage.setItem(apiConfig.TOKEN_KEY, accessToken);
            console.log('Token guardado en localStorage:', accessToken);

            // También guardamos el usuario directamente para tener backup
            localStorage.setItem('user_data', JSON.stringify(userData));

            setUser(userData);
            setError('');

            // Verificar si hay una ruta guardada para redirigir después del login
            const redirectPath = localStorage.getItem('auth_redirect');
            if (redirectPath) {
                console.log('Redirigiendo a ruta guardada después del login:', redirectPath);
                localStorage.removeItem('auth_redirect'); // Limpiar después de usar
                // En lugar de hacer un redireccionamiento brusco, devolvemos la ruta
                // para que el componente de Auth pueda manejar la navegación
                return { success: true, redirectPath };
            }

            return { success: true };
        } catch (error) {
            // Mejorar el mensaje de error basado en la respuesta del servidor
            let errorMessage = 'Error al iniciar sesión';

            if (error.response) {
                // El servidor respondió con un código de error
                if (error.response.status === 400) {
                    errorMessage = 'Email o contraseña incorrectos';
                } else if (error.response.status === 401) {
                    errorMessage = 'No autorizado. Verifica tus credenciales.';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                // La petición fue hecha pero no se recibió respuesta
                errorMessage = 'No se pudo conectar con el servidor. Verifica que esté en ejecución.';
            }

            setError(errorMessage);
            console.error('[Auth Error]', error);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Cerrar sesión
    const logout = () => {
        localStorage.removeItem(apiConfig.TOKEN_KEY);
        setUser(null);
    };

    const isAuthenticated = !!user;

    // Valores a exponer en el contexto
    const authValues = {
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        setError,
    };

    return (
        <AuthContext.Provider value={authValues}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
