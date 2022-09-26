const bcrypt = require('bcryptjs');
const { response, request } = require('express');
const Usario = require('../models/usuarios');

const userGet = async(req = request, res = response) => {

    // Sacar parametros del get
    const { desde = 0, pages = 1, limit = 5 } = req.query;

    // Pasar a numeros los parametros
    let numDesde = Number(desde);
    let numPages = Number(pages);
    let numLimit = Number(limit);

    // Validar si son numeros
    if (Number.isNaN(numDesde)){

        res.status(406).json({
            msg: `Desde: ==> ${desde} <== No es un numero.`,
            sujerencia: 'Introduzca un valor numerico',
            desde,
    
        });

        return;
       
    }

    if (Number.isNaN(numPages)){

        res.status(406).json({

            msg: `Pages: ==> ${pages} <== No es un numero.`,
            sujerencia: 'Introduzca un valor numerico',
            pages
    
        });
        
        return;
    }

    if (Number.isNaN(numLimit)){

        res.status(406).json({

            msg: `Limit: ==> ${limit} <== No es un numero.`,
            sujerencia: 'Introduzca un valor numerico',
            limit

        });

        return;

    }
    
    // Obtener usuarios y total por seoparado
    // const usuarios = await Usario.find({stado:true}).skip( Number(desde)).limit(Number(limit));
    // const total = await Usario.countDocuments({stado:true});

    // Obtener usuarios y total en una sola promesa 
    const [ usuarios, total ] = await Promise.all([
        Usario.find({stado:true}).skip(numDesde).limit(numLimit),
        Usario.countDocuments({stado:true})
    ])

    res.status(200).json({

        msg: `Respuesta aceptada con ${usuarios.length} Usuarios desde el ${desde}º de ${total} totales en la BD`,
        length: usuarios.length,
        desde,
        usuarios

    });

};

const userPut = async(req = request, res = response) => {

    // Obtener id del parametro
    let { id } = req.params;
    
    // sacar variables no deseasdas
    const { _id, password, google, correo, ...resto } = req.body;

    // Comprobar si hay contraseña y cambiarla
    if ( password ) {

        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);

    };

    // Guardar cambios
    const usuario = await Usario.findByIdAndUpdate(id, resto);

    res.status(202).json({

        msg: 'Usuario Actualizado',
        usuario

    });

};

const userPost = async(req = request, res = response) => {
    
    // Sacar parametros POST
    const { nombre, correo, password, rol } = req.body;

    //Generar un usuario con los parametros
    const usuario = new Usario({nombre,correo,password,rol});
    
    // Encriptar Password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    //Guardar Usuario
    await usuario.save();

    // Respuesta correcta
    res.status(201).json({

        msg:'Usuario Guardado correctamente',
        usuario

    });

};

const userPatch = (req = request, res = response) => {
    res.status(201).json({

        msg: 'PATCH - API - USERPATCH'

    });
};

const userDelete = async(req = request, res = response) => {

    // sacar id de los parametros
    const { id } = req.params;

    // Borrar fisicamente
    // const usuario = await Usario.findByIdAndDelete( id );

    // Borrar virtualmente
    const usuario = await Usario.findByIdAndUpdate( id, { stado: false} );

    res.status(202).json({

        msg: 'Usuario borrado correctamente',
        usuario,

    });
};

module.exports = {
    userGet,
    userPut,
    userPost,
    userPatch,
    userDelete
};