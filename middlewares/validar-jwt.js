const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usario = require('../models/usuarios');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('LcrToken');

    if ( !token ) {

        res.status(401).json({

            msg: 'No tienes permiso para realizar está acción',
    
        });

    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );

        req.uid = uid;

        const usuarioPeticion = await Usario.findById(uid);

        if ( !usuarioPeticion ) {

            res.status(404).json({
    
                msg: 'Usuario no existe',
        
            });
    
            return;
    
        }

        if (usuarioPeticion.stado === false) {

            res.status(403).json({
    
                msg: 'Token no valido',
        
            });
    
            return;
    
        } else {

            req.usuario = usuarioPeticion;

            next();

        }

    } catch(err) {

        console.warn(err);

        res.status(403).json({

            msg: 'Servicio no disponible',
    
        });

    }

};

module.exports = {
    validarJWT
}