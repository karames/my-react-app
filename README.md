# My React App

Este proyecto es una aplicación React que implementa un CRUD utilizando `json-server` y `json-server-auth` para la gestión de datos y autenticación. La aplicación permite a los usuarios crear, leer, actualizar y eliminar registros, y requiere autenticación previa con usuario y contraseña. Todos los estilos están implementados con Styled Components y se utiliza `prop-types` para la validación de props.

## Estructura del Proyecto

```text
my-react-app
├── src
│   ├── assets
│   │   ├── db.json          # Base de datos simulada para json-server
│   │   └── server.js        # Configuración del servidor json-server-auth
│   ├── components
│   │   ├── Auth.jsx         # Componente de autenticación
│   │   ├── Create.jsx       # Componente para crear nuevos registros
│   │   ├── Delete.jsx       # Componente para eliminar registros
│   │   ├── Read.jsx         # Componente para leer registros
│   │   ├── Update.jsx       # Componente para actualizar registros
│   │   └── Profile.jsx      # Componente de perfil de usuario
│   ├── App.jsx              # Punto de entrada de la aplicación
│   ├── main.jsx             # Inicializa la aplicación React
│   └── styles
│       └── GlobalStyles.js   # Estilos globales utilizando Styled Components
├── package.json              # Configuración del proyecto y dependencias
├── vite.config.js            # Configuración de Vite
└── README.md                 # Documentación del proyecto
```

## Instalación

1. Clona el repositorio:

    ```terminal
    git clone <URL_DEL_REPOSITORIO>
    cd my-react-app
    ```

2. Instala las dependencias:

    ```terminal
    npm install
    ```

## Ejecución del proyecto

Para que la aplicación funcione correctamente, debes tener **dos terminales abiertas**:

1. **Terminal 1 (backend):**

   Lanza el backend con json-server-auth en el puerto 3001:

   ```sh
   npx json-server-auth --watch src/assets/db.json --port 3001
   ```

2. **Terminal 2 (frontend):**

   Lanza el frontend con Vite en el puerto 3000:

   ```sh
   npm run dev
   ```

Luego accede a la aplicación en [http://localhost:3000](http://localhost:3000)

## Uso

- Accede a la aplicación en `http://localhost:3000`.
- Utiliza el componente de autenticación para iniciar sesión.
- Una vez autenticado, podrás acceder a las funcionalidades de crear, leer, actualizar y eliminar registros.
- Navegación mediante barra superior.
- El token JWT se almacena en localStorage y se elimina al cerrar sesión.

## Notas

- Asegúrate de que el servidor `json-server` esté corriendo antes de iniciar la aplicación React.
- La autenticación se maneja mediante JWT, y los tokens se almacenan en el local storage del navegador.
- Todos los estilos están implementados con Styled Components.
- Se utiliza `prop-types` para la validación de props en los componentes.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, por favor abre un issue o envía un pull request.

## Previsualización de la build de producción

Para comprobar cómo se verá tu aplicación en producción:

1. Genera la build optimizada:
   ```sh
   npm run build
   ```
2. Lanza la previsualización local:
   ```sh
   npm run preview
   ```
3. Abre tu navegador en la URL que aparece en la terminal (normalmente http://localhost:4173)

Así puedes asegurarte de que todo funciona correctamente antes de desplegar.
