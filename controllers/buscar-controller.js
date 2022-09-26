
const { request, response } = require("express");
const { ObjectId } = require("mongodb");
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'productosporcategoria'
];

const buscarUsuarios = async( termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );

    if (esMongoId) {

        const usuario = await Usuario.findById(termino);
        res.status(200).json({

            results: (!usuario ? [] : [usuario])
    
        });

        return;

    } ;

    const regEx = new RegExp(termino,'i')

    const usuarios = await Usuario.find({ 
        $or: [
            { nombre: regEx },
            { correo: regEx },
        ],
        $and: [{stado:true}]
    });

    const largo = usuarios.length;

    res.status(200).json({

        msg: `Se han encontrado ${largo} resultados con la expresión ${termino}`,
        length: largo,
        results: usuarios

    });

};

const buscarCategorias = async( termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );

    if (esMongoId) {

        const categoria = await Categoria.findById(termino).populate('usuario','nombre');
        res.status(200).json({

            results: (!categoria ? [] : [categoria])
    
        });

        return;

    } ;

    const regEx = new RegExp(termino,'i')

    const categorias = await Categoria.find({ nombre: regEx, stado:true})
    .populate('usuario','nombre');

    const largo = categorias.length;

    res.status(200).json({

        msg: `Se han encontrado ${largo} resultados con la expresión ${termino}`,
        length: largo,
        results: categorias

    });

};

const buscarProductos = async( termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );

    if (esMongoId) {

        const producto = await Producto.findById(termino)
        .populate('categoria','nombre')
        .populate('usuario','nombre');

        res.status(200).json({

            results: (!producto ? [] : [producto])
    
        });

        return;

    } ;

    const regEx = new RegExp(termino,'i')

    const productos = await Producto.find({ 
        $or: [
            { nombre: regEx },
            { descripcion: regEx },
        ],
        $and: [{stado:true}]
    })
    .populate('categoria','nombre')
    .populate('usuario','nombre');

    const largo = productos.length;

    res.status(200).json({

        msg: `Se han encontrado ${largo} resultados con la expresión ${termino}`,
        length: largo,
        results: productos

    });

};

const buscarProductosPorCategoria = async( termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );

    if (!esMongoId) {

        res.status(400).json({

            msg: 'No es un formato correto de id categoria'
    
        });

        return;

    } ;

    const categoria = ObjectId(termino);

    const productos = await Producto.find({ categoria: categoria, stado:true})
    .populate('categoria','nombre')
    .populate('usuario','nombre');

    const largo = productos.length;

    res.status(200).json({

        msg: `Se han encontrado ${largo} resultados con la expresión ${termino}`,
        length: largo,
        results: productos

    });

};

const buscar = async(req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes(coleccion) ) {

        res.status(400).json({

            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
    
        });

        return;
    }

    switch (coleccion) {

        case 'usuarios':
            buscarUsuarios(termino,res);
            break;

        case 'categoria':
            buscarCategorias(termino,res);
            break;

        case 'productos':
            buscarProductos(termino,res);
            break;

        case 'productosporcategoria':
            buscarProductosPorCategoria(termino,res);
            break;

        default:

            res.status(500).json({

                msg: `Error en la busqueda`
        
            });

            break;

    }

};

module.exports = buscar;