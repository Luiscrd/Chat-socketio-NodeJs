const { request, response } = require("express");
const { Categoria } = require('../models')

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.charAt(0).toUpperCase() + req.body.nombre.toLowerCase().slice(1);

    const data = {
        nombre,
        usuario: req.uid,
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json({

        msg: `Categoría ${nombre} guardada correctamente`,
        categoria

    });

};

const obtenerCategorias = async (req = request, res = response) => {

    // Sacar parametros del get
    const { desde = 0, limit = 5 } = req.query;

    // Pasar a numeros los parametros
    let numDesde = Number(desde);
    let numLimit = Number(limit);

    // Validar si son numeros
    if (Number.isNaN(numDesde)) {

        res.status(406).json({
            msg: `Desde: ==> ${desde} <== No es un numero.`,
            sujerencia: 'Introduzca un valor numerico',
            desde,

        });

        return;

    }

    if (Number.isNaN(numLimit)) {

        res.status(406).json({

            msg: `Limit: ==> ${limit} <== No es un numero.`,
            sujerencia: 'Introduzca un valor numerico',
            limit

        });

        return;

    }

    // Obtener caategorias y total en una sola promesa 
    const [categorias, total] = await Promise.all([
        Categoria.find({ estado: true }).skip(numDesde).limit(numLimit),
        Categoria.countDocuments({ estado: true })
    ])

    let categoriasFin = [];

    if (categorias.length === 0) {

        res.status(200).json({

            msg: `No hay ningugna categoría en la BD`,

        });

        return;

    } else {

        categorias.forEach(categoria => {

            const { _id: uid, nombre } = categoria;
            const nueCategoria = { uid, nombre };
            categoriasFin.push(nueCategoria);

        })

    };

    res.status(200).json({

        msg: `Respuesta aceptada con ${categorias.length} Categorias desde el ${(numDesde + 1) + 'º'} de ${total} totales en la BD`,
        length: categorias.length,
        desde: (numDesde + 1) + 'º',
        categorias: categoriasFin

    });

};

const obtenerCategoriaById = async (req = request, res = response) => {

    // Sacar parametros del get
    const { id } = req.params;
    
    // Obtener categorias activada por id
    const categoriaBD = await Categoria.findOne({ _id: id, estado: true })

    if (!categoriaBD) {

        res.status(400).json({

            msg: `La categoría  con id ==> ${id} <== no existe`,

        });

        return

    };

    const { nombre, _id: uid } = categoriaBD;

    const categoria = {
        uid,
        nombre
    }



    res.status(200).json({

        msg: `Respuesta aceptada`,
        categoria

    });

};

const actualizarCategoria = async (req = request, res = response) => {

    // Sacar parametros del get
    const { id } = req.params;
    const {estado, usuario, ...data} = req.body


    // Actualizar categoría
    const categoriaBD = await Categoria.findByIdAndUpdate({ _id: id},data,{new: true});

    const { nombre, _id: uid } = categoriaBD;

    const categoria = {
        uid,
        nombre
    }

    res.status(200).json({

        msg: `Categoría actualizada:`,
        categoria

    });

};

const borrarCategoria = async (req = request, res = response) => {

    // Sacar parametros del get
    const { id } = req.params;
    const {estado, usuario, ...data} = req.body


    //  caActualizartegoría
    const categoriaBD = await Categoria.findByIdAndUpdate({ _id: id},{estado:false},{new: true});

    const { nombre, _id: uid } = categoriaBD;

    const categoria = {
        uid,
        nombre
    }

    res.status(200).json({

        msg: `Categoría borrada:`,
        categoria

    });

};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaById,
    actualizarCategoria,
    borrarCategoria
}

