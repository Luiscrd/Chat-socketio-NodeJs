const { Router, response, request } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole, tieneRol } = require('../middlewares');
const { crearProducto, obtenerProductos, obtenerProductoById, actualizarProducto, borrarProducto } = require('../controllers/productos-contoller');
const { productoExist, nombreProductoExist, categoriaExist } = require('../helpers/db-validators');

const router = Router();

// GET acceso público
router.get('/', obtenerProductos)

// GET obtener categoria (público)
router.get('/:id', [
    check('id', 'El id está vacio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(productoExist),
    validarCampos,
], obtenerProductoById)

// POST crear una categoria (Privada)
router.post('/', [
    validarJWT,
    tieneRol(['USER_ROL', 'ADMIN_ROL']),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom(nombreProductoExist),
    check('categoria', 'La categoría está vacia').not().isEmpty(),
    check('categoria', 'El id de categoría no es valido').isMongoId(),
    check('categoria').custom(categoriaExist),
    validarCampos

], crearProducto)

// PUT actualizar una categoria (Privada)
router.put('/:id', [
    validarJWT,
    check('id', 'El id está vacio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(productoExist),
    tieneRol(['USER_ROL', 'ADMIN_ROL']),
    check('nombre').custom(nombreProductoExist),
    check('categoria', 'El id de categoría no es valido').isMongoId(),
    check('categoria').custom(categoriaExist),
    validarCampos
], actualizarProducto)

// DELETE eliminar una categoria (Privada)
router.delete('/:id', [
    validarJWT,
    check('id', 'El id está vacio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(productoExist),
    tieneRol(['USER_ROL', 'ADMIN_ROL']),
    validarCampos
], borrarProducto)

module.exports = router;