
const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validarJWT, 
    validarCampos, 
    esAdminRole 
} = require('../middleware/');

const { 
    crearProducto, 
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto, 
    borrarProducto
} = require('../controllers/productos');

const { existeCategoria, existeProducto } = require('../helpers/db-validators')

const router = Router()

/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
router.get('/', obtenerProductos)

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'no es un id valido en mongo').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProducto)

//crear categoria - privado - cualquier persona con un toke valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'no es un id de mongo').isMongoId(),
    check('categoria').custom( existeCategoria),
    validarCampos
], crearProducto)

//actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id').custom( existeProducto ),
    validarCampos
], actualizarProducto)

//borrar una categoria - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id').custom( existeCategoria ),
    validarCampos
], borrarProducto)

module.exports = router;