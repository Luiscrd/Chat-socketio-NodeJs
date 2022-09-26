const { Categoria, Producto, Role, Usuario } = require('../models');

const esRolValido = async(rol = '') => {

    const existeRol = await Role.findOne({rol});

    if( !existeRol ) {

        throw new Error(`El rol => ${rol} <= no está registrado en la BD`)

    };

};

const emailExiste = async(correo = '') => {

    const existEamil = await Usuario.findOne({ correo });

    if(existEamil) {

        throw new Error(`El correo => ${correo} <= ya está registrado en la BD`);

    };

};

const usuarioExist = async(id = '') => {
    

    const existUsuario = await Usuario.findById( id );
   
    if(!existUsuario) {

        throw new Error(`El usuario con el id ==> ${id} <== No existe.`);

    };

};

const categoriaExist = async(id = '') => {
    

    const existCategoria = await Categoria.findById( id );
   
    if(!existCategoria) {

        throw new Error(`La categoría con el id ==> ${id} <== No existe.`);

    };

};

const nombreCategoriaExist = async(nombre = '') => {
    

    const existCategoria = await Categoria.find( {nombre} );
   
    if(!existCategoria) {

        throw new Error(`El nombre de la categoría ==> ${id} <== Ya existe.`);

    };

};

const productoExist = async(id = '') => {
    

    const existProducto = await Producto.findById( id );
   
    if(!existProducto) {

        throw new Error(`El producto con el id ==> ${id} <== No existe.`);

    };

};

const nombreProductoExist = async(nombre = '') => {
    
    nombre = nombre.charAt(0).toUpperCase() + nombre.toLowerCase().slice(1);

    console.log(nombre);
    const existProducto = await Producto.find( {nombre} );
   
    if(existProducto.length !== 0) {

        throw new Error(`El nombre de producto ==> ${nombre} <== Ya existe.`);

    };

};

const coleccionesPermitdas = (colecion = '', coleciones = []) => {

    const incluida = coleciones.includes(colecion);

    if ( !incluida ) {

        throw new Error(`El parametro ==> ${colecion} <== No es vaslido, prueeba con: ${coleciones}.`);
    }

    return true;
    
}

module.exports = {
    esRolValido,
    emailExiste,
    usuarioExist,
    categoriaExist,
    nombreCategoriaExist,
    productoExist,
    nombreProductoExist,
    coleccionesPermitdas
};