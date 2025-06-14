import axios from 'axios';

/**
 * Configuración centralizada de la API
 * Contiene URL base, clave de token y timeout por defecto
 */
const API_CONFIG = {
    BASE_URL: 'http://localhost:3001',
    TOKEN_KEY: 'token',
    TIMEOUT: 10000, // 10 segundos
};

/**
 * Instancia de axios pre-configurada para todas las peticiones API
 * @type {import('axios').AxiosInstance}
 */
export const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: API_CONFIG.TIMEOUT,
});

/**
 * Interceptor de solicitudes: añade token JWT a los headers si existe en localStorage
 */
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

/**
 * Interceptor de respuestas: maneja errores 401 (token inválido)
 * Emite evento 'auth:unauthorized' para manejo centralizado en componentes
 */
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // Manejo específico para errores de autenticación (401)
        if (error.response && error.response.status === 401) {
            // Solo eliminamos el token del localStorage
            localStorage.removeItem(API_CONFIG.TOKEN_KEY);

            // No redireccionamos automáticamente al login desde aquí
            // Los componentes deberían manejar el estado no autenticado
            console.log('Token inválido o expirado, se ha eliminado del localStorage');

            // En lugar de redireccionar, propagamos un evento personalizado
            window.dispatchEvent(new CustomEvent('auth:unauthorized', {
                detail: {
                    path: window.location.pathname,
                    message: 'La sesión ha expirado o no es válida'
                }
            }));
        }
        return Promise.reject(error);
    }
);

/**
 * Funciones CRUD mejoradas con manejo de errores consistente
 * Cada función incluye gestión de errores centralizada mediante handleApiError
 */

/**
 * Obtiene todos los registros de la API
 * @returns {Promise<Array>} Array con los registros obtenidos
 */
export const fetchRecords = async () => {
    try {
        const response = await api.get('/records');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al obtener registros');
        throw error;
    }
};

/**
 * Crea un nuevo registro en la API
 * @param {Object} data - Datos del registro a crear
 * @returns {Promise<Object>} El registro creado con su ID
 */
export const createRecord = async (data) => {
    try {
        const response = await api.post('/records', data);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al crear registro');
        throw error;
    }
};

/**
 * Actualiza un registro existente
 * @param {number|string} id - ID del registro a actualizar
 * @param {Object} data - Nuevos datos del registro
 * @returns {Promise<Object>} El registro actualizado
 */
export const updateRecord = async (id, data) => {
    try {
        const response = await api.put(`/records/${id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al actualizar registro');
        throw error;
    }
};

/**
 * Elimina un registro por su ID
 * @param {number|string} id - ID del registro a eliminar
 * @returns {Promise<Object>} Respuesta de confirmación
 */
export const deleteRecord = async (id) => {
    try {
        const response = await api.delete(`/records/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al eliminar registro');
        throw error;
    }
};

/**
 * Inicia sesión y obtiene token JWT
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario y token JWT
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error de autenticación');
        throw error;
    }
};

/**
 * Obtiene los datos del perfil del usuario autenticado
 * @returns {Promise<Object>} Datos del perfil del usuario
 */
export const fetchUserProfile = async () => {
    try {
        // Endpoint para obtener datos del usuario autenticado
        const response = await api.get('/profile');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al obtener perfil de usuario');
        throw error;
    }
};

/**
 * Actualiza los datos del perfil del usuario
 * @param {Object} profileData - Nuevos datos del perfil
 * @returns {Promise<Object>} Perfil actualizado
 */
export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/profile', profileData);
        return response.data;
    } catch (error) {
        // Manejo específico para errores de contraseña incorrecta
        if (error.response && error.response.status === 401 && error.response.data.error === 'Contraseña actual incorrecta') {
            handleApiError(error, 'Contraseña actual incorrecta');
        } else {
            handleApiError(error, 'Error al actualizar perfil de usuario');
        }
        throw error;
    }
};

/**
 * Función centralizada para manejo de errores de API
 * Procesa y formatea mensajes de error para mejor UX
 * @param {Error} error - Error original de axios
 * @param {string} defaultMessage - Mensaje predeterminado si no hay detalles
 */
const handleApiError = (error, defaultMessage) => {
    let errorMessage = defaultMessage;

    if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else {
            errorMessage = `${defaultMessage}: ${error.response.status}`;
        }
    } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMessage = 'No se pudo conectar con el servidor';
    }

    // Log de error para debugging
    console.error('[API Error]', errorMessage);

    // Asigna el mensaje formateado al error original
    error.message = errorMessage;
};

/**
 * Configuración exportada para uso en otros módulos
 * @type {Object}
 */
export const apiConfig = API_CONFIG;
