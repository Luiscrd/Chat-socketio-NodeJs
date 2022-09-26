const { request, response } = require("express");
const Usario = require('../models/usuarios');

const esAdminRole = async(req = request, res = response, next) => {

    const uid = req.uid;

    const usuarioPeticion = await Usario.findById(uid);

    if (usuarioPeticion.rol !== 'ADMIN_ROL') {

        res.status(401).json({

            msg: 'No tienes permiso para realizar está acción',
    
        });

    } else {

        next();

    };

};

const tieneRol = (roles = []) => {

    return async(req = request, res = response, next) => {

        const uid = req.uid;
    
        const usuarioPeticion = await Usario.findById(uid);

        const permiso = roles.includes(usuarioPeticion.rol);
    
        if (!permiso) {
    
            res.status(401).json({
    
                msg: 'No tienes permiso para realizar está acción',
        
            });
    
        } else {
    
            next();
    
        };
    
    };

} 


module.exports = {
    esAdminRole,
    tieneRol
};