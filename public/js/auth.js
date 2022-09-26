function handleCredentialResponse(response) {

    const body = { id_token: response.credential };

    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(data => {
            localStorage.setItem('token', data.token);
            // console.log('Token: '+data.token);
            // console.log('ID: '+data.usuario.uid);
            // console.log('Name: '+data.usuario.nombre);
            // console.log('Image URL: '+data.usuario.img);
            // console.log('Email: '+data.usuario.correo);
            buttonLo.style.display = '';
            document.getElementById('btn-login').innerHTML = 'Ir a Chat';
            localStorage.setItem('usuario', data.usuario.nombre);

        })
        .catch(err => console.log(err));

};

const button = document.getElementById('btn-login');
const buttonLo = document.getElementById('btn-logout');

if (localStorage.getItem('token')) {

    document.getElementById('nombre-log').innerHTML = `Hola ${localStorage.getItem('usuario')}`;
    document.getElementById('btn-login').innerHTML = 'Ir a Chat';
    buttonLo.style.display = '';

}

button.onclick = () => {

    if (document.getElementById('btn-login').innerHTML === 'Mostrar Login') {

        document.getElementById('form-prin').style.display = "flex";
        document.getElementById('btn-login').innerHTML = 'Ocultar Login'

    } else if (document.getElementById('btn-login').innerHTML === 'Ir a Chat') {

        window.location = '/chat.html'

    } else {

        document.getElementById('form-prin').style.display = "none";
        document.getElementById('btn-login').innerHTML = 'Mostrar Login';

    }



};

const form = document.getElementById('form-prin');

form.addEventListener('submit', ev => {

    ev.preventDefault();

    const formData = {};

    for (let el of form.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        };
    };

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(resp => resp.json())
        .then(({ msg, token, usuario }) => {
            if (msg !== 'Logueado Correctamente') {
                return console.error(msg);
            };
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', usuario.nombre);
            document.getElementById('form-prin').style.display = "none";
            buttonLo.style.display = '';
            document.getElementById('btn-login').innerHTML = 'Ir a Chat';
            document.getElementById('nombre-log').innerHTML = `Hola ${usuario.nombre}`;
            document.getElementById('btn-login').getAttribute('src', '/chat.html')

        })
        .catch(err => {
            console.log(err)
        })

});

buttonLo.onclick = () => {

    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload();
    });


}

