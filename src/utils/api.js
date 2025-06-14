import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token JWT si existe
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Funciones CRUD reutilizables
export const fetchRecords = async () => {
    const response = await api.get('/records');
    return response.data;
};

export const createRecord = async (data) => {
    const response = await api.post('/records', data);
    return response.data;
};

export const updateRecord = async (id, data) => {
    const response = await api.put(`/records/${id}`, data);
    return response.data;
};

export const deleteRecord = async (id) => {
    const response = await api.delete(`/records/${id}`);
    return response.data;
};

// Función para login
export const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    return response.data;
};

// Puedes añadir más funciones para usuarios, perfil, etc.
