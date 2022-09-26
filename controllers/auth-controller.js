const { response, request } = require("express");
const bcrypt = require('bcryptjs');
var generator = require('generate-password');
const Usario = require('../models/usuarios');

const { googleVerify } = require("../helpers/google-verify");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe y si el usuario etá activo
        const usuario = await Usario.findOne({ correo });

        if ( !usuario || !usuario.stado ) {
            return res.status(400).json({

                msg: `Usuario o contraseña no validos`,
        
            });
        };

        // Verificar la contraseña
        const validarPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validarPassword ) {
            return res.status(400).json({

                msg: `Usuario o contraseña no validos`,
        
            });
        };

        // Generar JWT
        const token = await generarJWT( usuario.id );

        res.status(202).json({

            msg: `Logueado Correctamente`,
            usuario,
            token
    
        });

    } catch(err) {

        console.warn(err);

        res.status(500).json({

            msg: `Contacte con el administrador`,
    
        });

    }

};

const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {
    
        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usario.findOne({ correo });

        if (!usuario) {

            const data = {
                nombre,
                correo,
                password: generator.generate({ length: 10, numbers: true }),
                img,
                rol: 'USER_ROL',
                google: true
            };

            usuario = new Usario(data);

            await usuario.save();
        };

        if ( !usuario.stado ) {

            res.status(401).json({

                msg: 'El usuario no se encuentra operativo',
        
            });

            return;
        };

        const token = await generarJWT( usuario.id )

        res.status(202).json({

            msg: 'Logueado con Google',
            usuario,
            token,
    
        });
    
    } catch(err) {

        console.warn(err);

        res.status(500).json({

            msg: 'Error del servidor',
    
        });

    }

};

const renovarToken = async( req = request, res = response ) => {

    const usuario = req.usuario;
    const token = await generarJWT( usuario.id );

    // usuario.token = token;
    // usuario.save()

    res.status(200).json({
        msg: 'Ok',
        usuario,
        token

    });
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}