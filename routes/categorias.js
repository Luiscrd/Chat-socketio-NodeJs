const { Router, response, request } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole, tieneRol } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoriaById, actualizarCategoria, borrarCategoria } = require('../controllers/categorias-controller');
const { categoriaExist, nombreCategoriaExist } = require('../helpers/db-validators');

const router = Router();

// GET acceso público
router.get('/', obtenerCategorias)

// GET obtener categoria (público)
router.get('/:id', [
    check('id', 'El id está vacio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(categoriaExist),
    validarCampos,
], obtenerCategoriaById)

// POST crear una categoria (Privada)
router.post('/', [
    validarJWT,
    tieneRol(['USER_ROL', 'ADMIN_ROL']),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(nombreCategoriaExist),
    validarCampos

], crearCategoria)

// PUT actualizar una categoria (Privada)
router.put('/:id', [
    validarJWT,
    check('id', 'El id está vacio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(categoriaExist),
    tieneRol(['USER_ROL', 'ADMIN_ROL']),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(nombreCategoriaExist),
    validarCampos
], actualizarCategoria)

// DELETE eliminar una categoria (Privada)
router.delete('/:id', [
    validarJWT,
    check('id', 'El id está vacio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(categoriaExist),
    tieneRol(['USER_ROL', 'ADMIN_ROL']),
    validarCampos
], borrarCategoria)

module.exports = router;