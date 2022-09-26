const { request, response } = require("express");
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req = request, res = response) => {

    try {

        const nombre = await subirArchivo(req.files, ['png', 'jpg', 'jpeg', 'gif'], 'img/');

        res.status(200).json({ res: 'Archivo subido', nombre });


    } catch (msg) {

        res.status(400).json({ msg });

    }

};

const actualizarImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No exixte ningún Usuario con el id: ${id}`
                });
            };

            break;

        case 'productos':

            modelo = await Producto.findById(id).populate('categoria', 'nombre').populate('usuario', 'nombre');

            if (!modelo) {
                return res.status(400).json({
                    msg: `No exixte ningún Producto con el id: ${id}`
                });
            };
            break;

        default:

            res.status(500).json({ msg: `Se saltó la validacion, contacte con el administrador` });

            break;
    };

    const ruta = 'img/' + coleccion + '/';

    if (modelo.img) {

        const pathImagen = path.resolve('./uploads/' + ruta + modelo.img);

        try {

            if (fs.readFileSync(pathImagen)) {

                fs.unlinkSync(pathImagen);

            }

        } catch (err) {

            console.log(`No se encontraba el archivo: ${pathImagen}, se creara uno nuevo.`);

        };

    };

    try {

        modelo.img = await subirArchivo(req.files, undefined, ruta);

        modelo.save()

        res.status(200).json({

            msg: `Los/las ${coleccion} con id ${id} se actualizaron correctamente`,
            modelo

        });

    } catch (msg) {

        res.status(400).json({ msg });

    };

};

const actualizarImagenCloudinary = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No exixte ningún Usuario con el id: ${id}`
                });
            };

            break;

        case 'productos':

            modelo = await Producto.findById(id).populate('categoria', 'nombre').populate('usuario', 'nombre');

            if (!modelo) {
                return res.status(400).json({
                    msg: `No exixte ningún Producto con el id: ${id}`
                });
            };
            break;

        default:

            res.status(500).json({ msg: `Se saltó la validacion, contacte con el administrador` });

            break;
    };

    try {

        // Metodo para borrar la foto anterior => No funciona <=
        // if (modelo.img) {

        //     const nombreArr = modelo.img.split('/');
        //     const nombre = nombreArr[nombreArr.length - 1];
        //     const [public_id] = nombre.split('.');
        //     const borrar = await cloudinary.uploader.destroy(public_id);
        //     console.log(borrar);

        // };

        const { tempFilePath } = req.files.archivo;
        const resp = await cloudinary.uploader.upload( tempFilePath, { folder: coleccion} );

        modelo.img = resp.secure_url;
        modelo.save();

        res.status(200).json({
            modelo
        });


    } catch (err) {

        res.status(500).json({ err });

    };

};

const mostratImagen = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No exixte ningún Usuario con el id: ${id}`
                });
            };

            break;

        case 'productos':

            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No exixte ningún Producto con el id: ${id}`
                });
            };
            break;

        default:

            res.status(500).json({ msg: `Se saltó la validacion, contacte con el administrador` });

            break;
    };

    const ruta = 'img/' + coleccion + '/';

    if (modelo.img) {

        const pathImagen = path.resolve('./uploads/' + ruta + modelo.img);

        try {

            if (fs.readFileSync(pathImagen)) {

                res.sendFile(pathImagen);

            };

        } catch (msg) {

            res.sendFile(path.resolve('./assets/no-image.jpg'));

        };

    };

};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostratImagen,

};