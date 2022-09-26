class Mensaje {

    constructor(uid, nombre, mensaje, dest, hora) {

        this.uid = uid;
        this.nombre = nombre;
        this.mensaje = mensaje;
        this.dest = dest;
        this.hora = hora;
    }

};


class ChatMensajes {

    constructor() {

        this.mensajes = [];
        this.usuarios = {};

    }

    get ultimosDiez() {

        if (this.mensajes.length >= 10) {
            ;
            return this.mensajes.slice(0, 10);
        } else {
            return this.mensajes.slice(0, this.mensajes.length);
        }

    }

    ultimosDiezPrivados(uid) {

        let mensPriv = [];

        this.mensajes.forEach( mensaje => {
            if( mensaje.dest === uid ) {
                mensPriv.push(mensaje)
            }
        })

        if (mensPriv.length >= 10) {
            
            return mensPriv.slice(0, 10);

        } else {
            
            return mensPriv.slice(0, mensPriv.length);
            
        }

        

    }

    get usuariosArr() {

        return Object.values(this.usuarios);
    }

    enviarMensaje(uid, nombre, mensaje, dest) {

        const mens = new Mensaje(
            uid,
            nombre,
            mensaje,
            dest,
            (new Date().getHours().toString() + ':' + new Date().getMinutes().toString())
            );

        this.mensajes.push(mens);

    }

    agregarUsuario(usuario) {

        this.usuarios[usuario.id] = usuario;

    }

    borrarUsuario(id) {

        delete this.usuarios[id];

    }

};

module.exports = ChatMensajes;