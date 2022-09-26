const express = require('express');
const cors = require('cors');
const { createServer } = require('http') 
const fileUpload = require('express-fileupload');
const { dbConection } = require('../database/confij');
const { socketController } = require('../sockets/controller');

class Server {

    constructor(ruta = '/') {

        this.app = express();
        this.port = process.env.PORT;
        this.rutaRaiz = ruta;
        this.Server = createServer( this.app );
        this.io = require('socket.io')( this.Server );
        // Paths de rutas
        this.authPath = '/api/auth';
        this.buscarPath = '/api/buscar';
        this.uploadPath = '/api/upload';
        this.usuariosPath = '/api/usuarios';
        this.categoriasPath = '/api/categorias';
        this.productosPath = '/api/productos';
        // Conectar a la base de datos
        this.conectarDb();
        // Middlewares
        this.middelwares();
        // Rutas de la aplicación
        this.routes();
        // Sockets
        this.sockests();

    }

    async conectarDb() {

        await dbConection();

    }

    middelwares() {

        // CORS
        this.app.use(cors());
        // Lectura y trasformación del body
        this.app.use(express.json());
        // Directorio Público
        this.app.use(express.static('public'));
        // Expresss File Upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        this.app.use( this.authPath, require('../routes/auth'));

        this.app.use( this.buscarPath, require('../routes/buscar'));

        this.app.use( this.uploadPath, require('../routes/uploads'));

        this.app.use( this.usuariosPath, require('../routes/user'));

        this.app.use( this.categoriasPath, require('../routes/categorias'));

        this.app.use( this.productosPath, require('../routes/productos'));

        this.app.get('/api', (req, res) => {

            res.sendFile(this.rutaRaiz + '/public/REST.html');

        });

        this.app.get('*', (req, res) => {

            res.status(404).sendFile(this.rutaRaiz + '/public/404.html')
        });

        this.app.put('*', (req, res) => {

            res.status(404).sendFile(this.rutaRaiz + '/public/404.html')
        });

        this.app.post('*', (req, res) => {

            res.status(404).sendFile(this.rutaRaiz + '/public/404.html')
        });

        this.app.patch('*', (req, res) => {

            res.status(404).sendFile(this.rutaRaiz + '/public/404.html')
        });

        this.app.delete('*', (req, res) => {

            res.status(404).sendFile(this.rutaRaiz + '/public/404.html')
        });


    }

    sockests() {

        this.io.on("connection", (socket) => socketController(socket, this.io) );

    }

    listen() {

        this.Server.listen(this.port, () => {
            console.log(`Servidor corriendo en: http://localhost:${this.port}`);
        })

    }
};

module.exports = Server;