const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');

const server = jsonServer.create();
const pathToDb = path.join(__dirname, 'db.json');
console.log('Usando db.json en:', pathToDb);
const router = jsonServer.router(pathToDb);
const middlewares = jsonServer.defaults();

server.db = router.db;

server.use(middlewares);
// Middleware de logging eliminado para evitar consumir el stream del body y romper json-server-auth
// Si necesitas depuración, usa un proxy como Fiddler, Postman o revisa el frontend
server.use(auth);
server.use(router);

console.log('Iniciando servidor...');
const port = process.env.PORT || 3001;
server.listen(port, (err) => {
    if (err) {
        console.error('Error al iniciar el servidor:', err);
    } else {
        console.log(`JSON Server + Auth running on port ${port}`);
    }
});
