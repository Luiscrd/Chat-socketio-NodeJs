
let usuario = null;
let socket = null;

const mensajeEnv = document.getElementById('mensajEnv');
const ulMensajes = document.getElementById('ulMensajes');
const txtUid = document.getElementById('txtUid');
const ulUsuarios = document.getElementById('ulUsuarios');
const nombreSelect = document.getElementById('nombreSelect');
const avatarPrincipal = document.getElementById('avatarPrincipal')

const validarJWTChat = async () => {

    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {

        window.location = '/';

        throw new Error('EL token no es valido o no exixte')

    }

    const resp = await fetch('http://localhost:8080/api/auth', {
        headers: { 'LcrToken': token }
    });

    const { usuario: userDb, token: tokenDb } = await resp.json();

    localStorage.setItem('token', tokenDb);
    usuario = userDb;

    document.getElementById('nombre-usuario').innerHTML = usuario.nombre;
    document.getElementById('avatar-usuario').src = usuario.img;

    document

    await conectarSocket();


}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'Lcr-Token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes);
    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', dibujarMensajes);
        

}

mensajeEnv.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = mensajeEnv.value;

    const uid = txtUid.value;

    if (keyCode !== 13) {

        return;

    } else if (mensaje === 0) {

        return;

    } else {

        socket.emit('enviar-mensaje', { mensaje, uid });
        mensajeEnv.value = '';

    }
})

const main = async () => {

    await validarJWTChat();

};

const dibujarUsuarios = async (usuarios = []) => {

    const token = localStorage.getItem('token') || '';
    const resp = await fetch('http://localhost:8080/api/auth', {
        headers: { 'LcrToken': token }
    });

    const { usuario: userDb, token: tokenDb } = await resp.json();

    let usersHtml = `<li class="linea-usua-list select" id="grupal" onclick="seleccionarChat(this.id, 'Chat grupal', './images/soappepito.png')">
    <img alt="profilepicture" src="./images/soappepito.png" class="img-list-constact">
    <h1 class="font-name">Chat grupal - Soap Pepito</h1>
    <p class="font-online">(online)</p>
</li>`;

    usuarios.forEach(user => {
        if (user.uid !== userDb.uid) {
            usersHtml += `<li class="linea-usua-list no-select" id="${user.uid}" onclick="seleccionarChat(this.id, '${user.nombre}', '${user.img}')">
        <img alt="profilepicture" src="${user.img}" class="img-list-constact">
        <h1 class="font-name">${user.nombre}</h1>
        <p class="font-online">(online)</p>
    </li>`
        }

    })

    ulUsuarios.innerHTML = usersHtml;

}

const dibujarMensajes = async (mensajes = []) => {

    const token = localStorage.getItem('token') || '';
    const resp = await fetch('http://localhost:8080/api/auth', {
        headers: { 'LcrToken': token }
    });

    const { usuario: userDb, token: tokenDb } = await resp.json();

    let mensajesHtml = '';

    mensajes.forEach(mensaje => {
        if (mensaje.uid !== userDb.uid) {
            let nombre = mensaje.nombre.split(' ');
            nombre = nombre[0]
            mensajesHtml += `<li class="li-mensajes-ot"><span class="mensaje-caht-ot">(${ nombre }) ${mensaje.mensaje}<span class="hora-mensaje">${mensaje.hora}</span></span></li>`
        } else {
            let nombre = mensaje.nombre.split(' ');
            nombre = nombre[0]
            mensajesHtml += `<li class="li-mensajes"><span class="mensaje-caht">(${ nombre }) ${mensaje.mensaje}<span class="hora-mensaje">${mensaje.hora}</span></span></li>`
        }

    })

    ulMensajes.innerHTML = mensajesHtml;

}

const seleccionarChat = (id, nombre, img) => {
    const votsChat = document.querySelectorAll('li.linea-usua-list');
    votsChat.forEach( elemn => {
        elemn.classList.remove('select')
        elemn.classList.add('no-select')
    })
    document.getElementById(id).classList.remove('no-select');
    document.getElementById(id).classList.add('select');
    nombreSelect.innerHTML = nombre;
    avatarPrincipal.src = img;
    txtUid.value = id;
}

main();


