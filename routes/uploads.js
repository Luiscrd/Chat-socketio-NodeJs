const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostratImagen, actualizarImagenCloudinary } = require('../controllers/uploads-controllers');
const { coleccionesPermitdas } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole, tieneRol, validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post( '/', [
    validarArchivoSubir,
    validarJWT,
    tieneRol(['USER_ROL', 'ADMIN_ROL']),
    validarCampos,
], cargarArchivo );

// ===========================================================================
// Guadar los archivos en local: Descomentar y comentar el siguiente para usar
// ===========================================================================
// router.put( '/:coleccion/:id', [
//     validarArchivoSubir,
//     validarJWT,
//     tieneRol(['USER_ROL', 'ADMIN_ROL']),
//     check('coleccion').custom( c => coleccionesPermitdas( c, ['usuarios','productos'] ) ),
//     check('id', 'No es un id valido').isMongoId(),
//     validarCampos,
// ], actualizarImagen );

router.put( '/:coleccion/:id', [
    validarArchivoSubir,
    validarJWT,
    tieneRol(['USER_ROL', 'ADMIN_ROL']),
    check('coleccion').custom( c => coleccionesPermitdas( c, ['usuarios','productos'] ) ),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
], actualizarImagenCloudinary );

router.get( '/:coleccion/:id', [
    check('coleccion').custom( c => coleccionesPermitdas( c, ['usuarios','productos'] ) ),
    check('id', 'No es un id valido').isMongoId(),
    validarCampos,
], mostratImagen );


module.exports = router;