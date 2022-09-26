const { request, response } = require("express");

const validarArchivoSubir = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No hay archivos para subir.');
        return;
    }

    if (!req.files.archivo) {
        res.status(400).send('No hay archivos para subir.');
        return;
    }

    next();

};

module.exports = validarArchivoSubir;