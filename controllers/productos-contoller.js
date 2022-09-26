const { request, response } = require("express");
const { Producto, Categoria } = require('../models')

const crearProducto = async (req = request, res = response) => {

    const { nombre, ...resto } = req.body

    const nombreNue = req.body.nombre.charAt(0).toUpperCase() + req.body.nombre.toLowerCase().slice(1);

    const data = {
        nombre: nombreNue,
        usuario: req.uid,
        ...resto
    }

    const producto = new Producto(data);

    await producto.save();

    const categoria = await Categoria.findById(producto.categoria);

    const categoriaBd = {
        uid: producto.categoria,
        nombre: categoria.nombre
    }

    const prodDev = {
        uid: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        disponible: producto.disponible,
        categoria: categoriaBd
    }

    res.status(201).json({

        msg: `Producto ${nombre} guardada correctamente`,
        producto: prodDev

    });

};

const obtenerProductos = async (req = request, res = response) => {

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
    const [productos, total] = await Promise.all([
        Producto.find({ estado: true }).skip(numDesde).limit(numLimit).populate('categoria', 'nombre'),
        Producto.countDocuments({ estado: true })
    ])

    let productosFin = [];

    if (productos.length === 0) {

        res.status(200).json({

            msg: `No hay ningugna categoría en la BD`,

        });

        return;

    } else {

        productos.forEach(producto => {

            const { _id: uid, nombre, precio, img, disponible, categoria } = producto;
            const nueProducto = { uid, nombre, precio, img, disponible, categoria };
            productosFin.push(nueProducto);

        })

        res.status(200).json({

            msg: `Respuesta aceptada con ${productos.length} Productos desde el ${(numDesde + 1) + 'º'} de ${total} totales en la BD`,
            length: productos.length,
            desde: (numDesde + 1) + 'º',
            productos: productosFin
    
        });

    };

    

};

const obtenerProductoById = async (req = request, res = response) => {

    // Sacar parametros del get
    const { id } = req.params;

    // Obtener productos activada por id
    const productoBD = await Producto.findOne({ _id: id, estado: true }).populate('categoria', 'nombre');

    if (!productoBD) {

        res.status(400).json({

            msg: `La categoría  con id ==> ${id} <== no existe`,

        });

        return

    };

    const prodDev = {
        uid: productoBD._id,
        nombre: productoBD.nombre,
        precio: productoBD.precio,
        disponible: productoBD.disponible,
        categoria: productoBD.categoria
    }


    res.status(200).json({

        msg: `Respuesta aceptada`,
        producto: prodDev

    });

};

const actualizarProducto = async (req = request, res = response) => {

    // Sacar parametros del get
    const { id } = req.params;
    const { estado:estadoBody, usuario:usuarioBody, ...data } = req.body


    // Actualizar categoría
    const productoBD = await Producto.findByIdAndUpdate({ _id: id }, data, { new: true }).populate('categoria', 'nombre');

    const { _id, estado, usuario, ...resto } = productoBD;

    const producto = {
        uid: _id,
        nombre: resto._doc.nombre,
        precio: resto._doc.precio,
        disponible: resto._doc.disponible,
        categoria: resto._doc.categoria
    }

    res.status(200).json({

        msg: `Categoría actualizada:`,
        producto: producto

    });

};

const borrarProducto = async (req = request, res = response) => {

    // Sacar parametros del get
    const { id } = req.params;

    //  caActualizartegoría
    const productoBD = await Producto.findByIdAndUpdate({ _id: id }, { estado: false }, { new: true }).populate('categoria', 'nombre');

    const { _id, estado, usuario, ...resto } = productoBD;

    const producto = {
        uid: _id,
        nombre: resto._doc.nombre,
        precio: resto._doc.precio,
        disponible: resto._doc.disponible,
        categoria: resto._doc.categoria
    }

    res.status(200).json({

        msg: `Categoría borrada:`,
        producto: producto

    });

};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    borrarProducto
}

