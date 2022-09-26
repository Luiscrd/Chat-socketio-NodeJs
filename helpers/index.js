const validarNumerosParms = require('./params-validators');
const googleVerify = require('./google-verify');
const generarJWT = require('./generar-jwt');
const {
    esRolValido,
    emailExiste,
    usuarioExist,
    categoriaExist,
    nombreCategoriaExist,
    productoExist,
    nombreProductoExist
} = require('./db-validators');
const validarNumerosParms = require('./subir-archivo');

module.exports = {
    validarNumerosParms,
    googleVerify,
    generarJWT,
    esRolValido,
    emailExiste,
    usuarioExist,
    categoriaExist,
    nombreCategoriaExist,
    productoExist,
    nombreProductoExist,
    validarNumerosParms
}