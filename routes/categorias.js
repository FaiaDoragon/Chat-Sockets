
const { Router } = require('express');
const { check } = require('express-validator');

const { 
    validarJWT, 
    validarCampos, 
    esAdminRole 
} = require('../middleware/');

const { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
    borrarCategoria
} = require('../controllers/categorias');

const { existeCategoria } = require('../helpers/db-validators')

const router = Router()

/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias)

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'no es un id valido en mongo').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoria)

//crear categoria - privado - cualquier persona con un toke valido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//actualizar - privado - cualquiera con token valido
router.put('/:id', [
    validarJWT,
    check('id').custom( existeCategoria ),
    validarCampos
], actualizarCategoria)

//borrar una categoria - admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria)
module.exports = router;