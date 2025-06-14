import axios from 'axios';

// Configuración centralizada
const API_CONFIG = {
    BASE_URL: 'http://localhost:3001',
    TOKEN_KEY: 'token',
    TIMEOUT: 10000, // 10 segundos
};

// Creación de la instancia de axios con configuración mejorada
export const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: API_CONFIG.TIMEOUT,
});

// Interceptor para añadir el token JWT si existe
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

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // Si el token expiró o es inválido (401)
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
 */

// Obtener todos los registros
export const fetchRecords = async () => {
    try {
        const response = await api.get('/records');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al obtener registros');
        throw error;
    }
};

// Crear un nuevo registro
export const createRecord = async (data) => {
    try {
        const response = await api.post('/records', data);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al crear registro');
        throw error;
    }
};

// Actualizar un registro existente
export const updateRecord = async (id, data) => {
    try {
        const response = await api.put(`/records/${id}`, data);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al actualizar registro');
        throw error;
    }
};

// Eliminar un registro
export const deleteRecord = async (id) => {
    try {
        const response = await api.delete(`/records/${id}`);
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al eliminar registro');
        throw error;
    }
};

// Iniciar sesión y obtener token JWT
export const login = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error de autenticación');
        throw error;
    }
};

// Obtener datos del perfil del usuario
export const fetchUserProfile = async () => {
    try {
        // En un caso real, usarías un endpoint específico como /users/me
        // Simulamos que hay un endpoint /profile
        const response = await api.get('/profile');
        return response.data;
    } catch (error) {
        handleApiError(error, 'Error al obtener perfil de usuario');
        throw error;
    }
};

// Actualizar datos del perfil del usuario
export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/profile', profileData);
        return response.data;
    } catch (error) {
        // Mensaje de error personalizado si es un error de contraseña
        if (error.response && error.response.status === 401 && error.response.data.error === 'Contraseña actual incorrecta') {
            handleApiError(error, 'Contraseña actual incorrecta');
        } else {
            handleApiError(error, 'Error al actualizar perfil de usuario');
        }
        throw error;
    }
};

// Función centralizada para manejo de errores
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

    // Aquí podrías implementar un sistema de logging o mostrar notificaciones
    console.error('[API Error]', errorMessage);

    // Mantenemos el error original pero con mensaje mejorado
    error.message = errorMessage;
};

// Exportamos también la configuración para posibles usos en otros archivos
export const apiConfig = API_CONFIG;
