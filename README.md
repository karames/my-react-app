# My React App

Este proyecto es una aplicación React que implementa un CRUD utilizando `json-server` y `json-server-auth` para la gestión de datos y autenticación. La aplicación permite a los usuarios crear, leer, actualizar y eliminar registros, y requiere autenticación previa con usuario y contraseña.

## Estructura del Proyecto

```text
my-react-app
├── src
│   ├── assets
│   │   └── db.json          # Base de datos simulada para json-server
│   ├── components
│   │   ├── Auth.jsx         # Componente de autenticación
│   │   ├── Create.jsx       # Componente para crear nuevos registros
│   │   ├── Delete.jsx       # Componente para eliminar registros
│   │   ├── Read.jsx         # Componente para leer registros
│   │   └── Update.jsx       # Componente para actualizar registros
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

3. Inicia el servidor `json-server`:

    ```terminal
    json-server --watch src/assets/db.json --port 3001 --middlewares node_modules/json-server-auth/src/middlewares.js
    ```

4. Inicia la aplicación React:

    ```terminal
    npm run dev
    ```

## Uso

- Accede a la aplicación en `http://localhost:3000`.
- Utiliza el componente de autenticación para iniciar sesión.
- Una vez autenticado, podrás acceder a las funcionalidades de crear, leer, actualizar y eliminar registros.

## Notas

- Asegúrate de que el servidor `json-server` esté corriendo antes de iniciar la aplicación React.
- La autenticación se maneja mediante JWT, y los tokens se almacenan en el local storage del navegador.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar este proyecto, por favor abre un issue o envía un pull request.
