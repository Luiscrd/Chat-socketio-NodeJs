const jwt = require('jsonwebtoken');
const Usario = require('../models/usuarios');

const generarJWT = ( uid = '' ) => {
    
    return new Promise( (resolve,reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if (err) {

                console.warn(err);
                reject('No se pudo generar el token');

            } else {

                resolve( token );

            };

        });

    });

};

const comprobarJWT = async( token = '' ) => {

    try {

        if ( token.length < 10 ) {

            console.log('Menor de 10');

            return null;

        }

        const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );
        

        const usuario = await Usario.findById(uid)

        
        if ( usuario ){

            if ( usuario.stado ) {

                return usuario;

            } else {

                return null;

            };
            
        } else {

            return null;

        };

    } catch(err) {

        return null;

    };
};



module.exports = {
    generarJWT,
    comprobarJWT 
}