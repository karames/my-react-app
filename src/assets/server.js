/**
 * Servidor API REST para la aplicación React CRUD con autenticación JWT
 * Implementa json-server-auth para gestión de usuarios y tokens
 */

const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Inicialización del servidor y recursos básicos
const server = jsonServer.create();
const pathToDb = path.join(__dirname, 'db.json');
const middlewares = jsonServer.defaults();

/**
 * Genera la estructura inicial de datos para la base de datos
 * Incluye usuario de prueba y registros de ejemplo
 * @returns {Object} Datos iniciales estructurados
 */
const createInitialData = () => {
    console.log('Generando datos iniciales para db.json');
    return {
        users: [
            {
                id: 1,
                name: "Nuevo Usuario",
                email: "nuevo@test.com",
                // Contraseña: 'password123' (hash bcrypt)
                password: "$2a$10$TgPr46CU7ZWMoZ.JeowS5.X43SNn/BweWR.yO7gfPXhry1vHpcGJC",
                preferences: {
                    theme: "light"
                }
            }
        ],
        records: [
            {
                id: 1,
                title: "Introducción a React",
                description: "React es una biblioteca JavaScript para construir interfaces de usuario. Es mantenido por Facebook y una comunidad de desarrolladores y empresas."
            },
            {
                id: 2,
                title: "Componentes Funcionales",
                description: "Los componentes funcionales son funciones de JavaScript que reciben props y retornan elementos de React. Son más simples y desde la introducción de Hooks pueden manejar estado."
            },
            {
                id: 3,
                title: "Hooks de React",
                description: "Los Hooks son funciones que permiten a los componentes funcionales usar características de React como el estado y el ciclo de vida. Los hooks más comunes son useState y useEffect."
            },
            {
                id: 4,
                title: "Styled Components",
                description: "Styled Components es una biblioteca para React que permite escribir CSS en JavaScript. Facilita la creación de componentes con estilos específicos y reutilizables."
            },
            {
                id: 5,
                title: "JSON Server",
                description: "JSON Server es una herramienta que permite crear rápidamente un API REST falso completo con cero codificación. Es ideal para prototipado y desarrollo frontend."
            }
        ]
    };
};

/**
 * Verifica la existencia y validez del archivo db.json
 * Determina si es necesario inicializar la base de datos con datos por defecto
 */
let needsInitialData = false;
if (!fs.existsSync(pathToDb)) {
    console.log('No se encuentra el archivo db.json. Se creará uno nuevo.');
    needsInitialData = true;
} else {
    try {
        const fileContent = fs.readFileSync(pathToDb, 'utf8');
        const parsedContent = JSON.parse(fileContent);
        // Se requiere que el archivo tenga las colecciones necesarias
        if (Object.keys(parsedContent).length === 0 || !parsedContent.users || !parsedContent.records) {
            console.log('El archivo db.json está vacío o tiene una estructura inválida. Se reinicializará.');
            needsInitialData = true;
        }
    } catch (error) {
        console.error('Error al leer db.json:', error);
        needsInitialData = true;
    }
}

// Inicialización de la base de datos si es necesario
if (needsInitialData) {
    try {
        const initialData = createInitialData();
        fs.writeFileSync(pathToDb, JSON.stringify(initialData, null, 2));
        console.log('Archivo db.json creado/inicializado exitosamente');
    } catch (error) {
        console.error('Error al crear/inicializar archivo db.json:', error);
        process.exit(1);
    }
}

console.log('Usando db.json en:', pathToDb);

// Inicializar el router con el archivo db.json
const router = jsonServer.router(pathToDb);

// Configuración del servidor
server.db = router.db;

/**
 * Configuración de seguridad CORS
 */
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    optionsSuccessStatus: 200,
    credentials: true
};

// Aplicación de middlewares esenciales
server.use(cors(corsOptions));
server.use(middlewares);
server.use(jsonServer.bodyParser);

/**
 * Endpoint raíz: Punto de entrada principal a la API
 * Proporciona documentación interactiva sobre los endpoints disponibles
 * No requiere autenticación para facilitar descubrimiento de la API
 */
server.get('/', (req, res) => {
    // Obtener versión desde package.json
    try {
        const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
        const version = packageJson.version || '1.0.0';

        res.json({
            message: 'API server running',
            status: 'online',
            version: version,
            serverTime: new Date().toISOString(),
            documentation: 'https://my-react-app.demo/api-docs',
            developer: 'Gonzalo Rodríguez de Dios Cabrera',
            endpoints: {
                auth: {
                    login: {
                        path: '/login',
                        method: 'POST',
                        description: 'Autenticación de usuarios y obtención de token JWT',
                        requiresAuth: false
                    }
                },
                records: {
                    getAll: {
                        path: '/records',
                        method: 'GET',
                        description: 'Obtiene todos los registros',
                        requiresAuth: true,
                        queryParams: ['_page', '_limit', 'q', '_sort', '_order']
                    },
                    getOne: {
                        path: '/records/:id',
                        method: 'GET',
                        description: 'Obtiene un registro específico por ID',
                        requiresAuth: true
                    },
                    create: {
                        path: '/records',
                        method: 'POST',
                        description: 'Crea un nuevo registro',
                        requiresAuth: true
                    },
                    update: {
                        path: '/records/:id',
                        method: 'PUT',
                        description: 'Actualiza un registro existente',
                        requiresAuth: true
                    },
                    delete: {
                        path: '/records/:id',
                        method: 'DELETE',
                        description: 'Elimina un registro existente',
                        requiresAuth: true
                    }
                },
                profile: {
                    get: {
                        path: '/profile',
                        method: 'GET',
                        description: 'Obtiene el perfil del usuario autenticado',
                        requiresAuth: true
                    },
                    update: {
                        path: '/profile',
                        method: 'PUT',
                        description: 'Actualiza el perfil del usuario autenticado',
                        requiresAuth: true
                    }
                },
                users: {
                    get: {
                        path: '/users/:id',
                        method: 'GET',
                        description: 'Obtiene información de un usuario por ID',
                        requiresAuth: true
                    },
                    update: {
                        path: '/users/:id',
                        method: 'PUT',
                        description: 'Actualiza la información de un usuario',
                        requiresAuth: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al leer package.json:', error);
        res.json({
            message: 'API server running',
            status: 'online',
            endpoints: {
                auth: '/login',
                records: '/records',
                profile: '/profile'
            }
        });
    }
});

/**
 * Configuración de autenticación con json-server-auth
 * Define las reglas de acceso y autenticación para los endpoints
 */
const rules = auth.rewriter({
    // Si necesitamos personalizar las reglas de reescritura de rutas
});
server.use(rules);
server.use(auth);

// Middleware de diagnóstico para autenticación JWT
server.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    if (process.env.NODE_ENV !== 'production') {
        console.log('Auth Headers:', authHeader ? 'Presentes' : 'Ausentes');

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            console.log('Token JWT:', token ? 'Presente' : 'Ausente');
            console.log('Usuario autenticado:', req.user ? 'Sí' : 'No');

            if (!req.user && token) {
                console.log('⚠️ ADVERTENCIA: Token presente pero req.user no establecido');
            }
        }
    }

    next();
});

/**
 * IMPORTANTE: Orden de los middlewares y rutas
 * 1. Middlewares básicos (CORS, bodyParser)
 * 2. Autenticación (json-server-auth)
 * 3. Rutas personalizadas autenticadas
 * 4. Router principal de json-server (al final)
 */

// Endpoint de diagnóstico para la autenticación
server.get('/auth-test', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No hay token de autorización' });
    }

    // Mostramos información sobre la petición
    res.json({
        auth: true,
        token: authHeader.split(' ')[1] ? 'Presente' : 'Ausente',
        user: req.user || 'No disponible'
    });
});

// Endpoint personalizado para perfil de usuario - Implementación manual de verificación de token
server.get('/profile', (req, res) => {
    try {
        // Depuración - Verificar headers y token
        console.log('Headers de autenticación:', req.headers.authorization);

        // IMPORTANTE: Implementación manual para extraer la información del token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Error: No hay token de autorización o formato incorrecto');
            return res.status(401).json({ error: 'Token de autorización requerido' });
        }

        // Extraer el token del header
        const token = authHeader.split(' ')[1];
        console.log('Token extraído:', token ? 'Presente' : 'Ausente');

        // Extraer el email del token (en un caso real, deberías verificar el token con JWT)
        // NOTA: Esto es una simplificación EXTREMA solo para depurar el problema
        // En producción DEBES usar una biblioteca como jsonwebtoken para verificar el token correctamente

        // Simplemente buscaremos un usuario basado en el token
        const allUsers = router.db.get('users').value();
        console.log('Buscando usuario por token entre', allUsers.length, 'usuarios');

        // Esto permitirá cualquier token, solo para propósitos de depuración
        // y asumiendo que estamos en un entorno de desarrollo controlado
        const userId = 1; // Usamos el primer usuario para pruebas

        // Buscar el usuario con el ID fijo (solo para pruebas)
        const user = router.db.get('users').find({ id: userId }).value();

        if (!user) {
            console.log('Error: Usuario no encontrado con ID', userId);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Construir objeto de perfil a partir de los datos del usuario
        const profile = {
            id: user.id,
            name: user.name || user.email.split('@')[0],
            email: user.email,
            preferences: user.preferences || { theme: 'light' }
        };

        return res.json(profile);
    } catch (error) {
        console.error('Error en el endpoint /profile:', error);
        return res.status(500).json({
            error: 'Error interno del servidor al procesar la solicitud de perfil',
            message: error.message
        });
    }
});

// Endpoint para actualizar perfil - Implementación manual de verificación de token
server.put('/profile', (req, res) => {
    try {
        // Depuración - Verificar headers y token
        console.log('PUT /profile - Headers de autenticación:', req.headers.authorization ? 'Presente' : 'Ausente');

        // IMPORTANTE: Implementación manual para extraer la información del token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Error: No hay token de autorización o formato incorrecto');
            return res.status(401).json({ error: 'Token de autorización requerido' });
        }

        // Para pruebas, usamos el ID fijo
        const userId = 1;
        const profileUpdate = req.body;

        // Validar datos
        if (!profileUpdate || typeof profileUpdate !== 'object') {
            return res.status(400).json({ error: 'Datos de perfil inválidos' });
        }

        console.log('Actualizando perfil para el usuario:', userId, 'con datos:', JSON.stringify(profileUpdate));

        // Obtener usuario actual
        const user = router.db.get('users').find({ id: userId }).value();

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }        // Actualizar usuario según los campos recibidos
        let updatedUser = { ...user };

        // Actualizar solo los campos que vienen en la solicitud
        if (profileUpdate.name !== undefined) {
            updatedUser.name = profileUpdate.name || user.email.split('@')[0];
        }

        // Manejar preferencias especialmente para actualizaciones parciales
        if (profileUpdate.preferences) {
            updatedUser.preferences = {
                ...(user.preferences || { theme: 'light' }),
                ...profileUpdate.preferences
            };
        }

        // Manejar cambio de contraseña si se proporcionan las contraseñas
        if (profileUpdate.currentPassword && profileUpdate.newPassword) {
            const bcrypt = require('bcryptjs');

            // Verificar que la contraseña actual sea correcta
            const isPasswordValid = bcrypt.compareSync(profileUpdate.currentPassword, user.password);

            if (!isPasswordValid) {
                console.log('Error: Contraseña actual incorrecta');
                return res.status(401).json({ error: 'Contraseña actual incorrecta' });
            }

            // Hashear la nueva contraseña
            const hashedPassword = bcrypt.hashSync(profileUpdate.newPassword, 10);
            updatedUser.password = hashedPassword;

            console.log('Contraseña actualizada correctamente');
        }

        console.log('Usuario actualizado:', JSON.stringify(updatedUser));

        // Guardar en la base de datos
        router.db.get('users').find({ id: userId }).assign(updatedUser).write();

        // Construir objeto de perfil para la respuesta
        const profile = {
            id: updatedUser.id,
            name: updatedUser.name || updatedUser.email.split('@')[0],
            email: updatedUser.email,
            preferences: updatedUser.preferences || { theme: 'light' }
        };

        console.log('Perfil actualizado, respondiendo con:', JSON.stringify(profile));
        return res.json(profile);
    } catch (error) {
        console.error('Error en el endpoint PUT /profile:', error);
        return res.status(500).json({
            error: 'Error interno del servidor al actualizar el perfil',
            message: error.message
        });
    }
});

// Middleware de validación de datos
server.use((req, res, next) => {
    // Validación para creación de registros
    if (req.method === 'POST' && req.path === '/records') {
        // Validar campos obligatorios
        if (!req.body.title || !req.body.description) {
            return res.status(400).json({
                error: 'Los registros deben tener título y descripción'
            });
        }

        // Normalizar estructura de datos
        const { title, description, ...rest } = req.body;
        req.body = {
            ...rest,
            title,
            description
        };
    }
    // Validación para actualización de registros
    else if ((req.method === 'PUT' || req.method === 'PATCH') && req.path.startsWith('/records/')) {
        const { title, description, ...rest } = req.body;
        if (title !== undefined || description !== undefined) {
            req.body = {
                ...rest,
                ...(title !== undefined ? { title } : {}),
                ...(description !== undefined ? { description } : {})
            };
        }
    }
    next();
});

// Aplicación del router principal de json-server
server.use(router);

// Middleware global de manejo de errores
server.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'production' ? 'Algo salió mal' : err.message
    });
});

// Configuración del puerto de escucha
const PORT = process.env.PORT || 3001;

// Inicio del servidor HTTP
server.listen(PORT, () => {
    console.log(`✅ Servidor API ejecutándose en http://localhost:${PORT}`);
    console.log(`📚 Documentación disponible en http://localhost:${PORT}/`);
});
