const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-jwt");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async (soket = new Socket(), io) => {

    const token = soket.handshake.headers['lcr-token'];

    const usuario = await comprobarJWT(token);


    if (!usuario) {

        return soket.disconnect();

    }

    chatMensajes.agregarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    io.emit('recibir-mensajes', chatMensajes.ultimosDiez);

    soket.join(usuario.id);


    soket.on('disconnect', () => {
        chatMensajes.borrarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })

    soket.on('enviar-mensaje', ({ mensaje, uid }) => {
        
        if (uid) {
            
            let nombre = usuario.nombre.split(' ');
            nombre = nombre[0]
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje, uid);
            soket.to( uid ).emit('mensaje-privado', chatMensajes.ultimosDiez);

        } else {

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje, uid);

            io.emit('recibir-mensajes', chatMensajes.ultimosDiez);

        }




    })
};

module.exports = {
    socketController
}