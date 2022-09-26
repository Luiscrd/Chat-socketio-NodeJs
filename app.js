require('dotenv').config();
const Server = require('./models/server');

const server = new Server(__dirname);

server.listen();