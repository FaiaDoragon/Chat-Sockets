const { Router } = require("express");
const { cargarArchivos, 
    actualizarImagen, 
    mostrarImagen, 
    actualizarImagenCloudinary 
} = require("../controllers/uploads");
const { check } = require("express-validator");
const { validarCampos, validarArchivo } = require("../middleware");
const { coleccionesPermitidas } = require("../helpers");



const router = Router()

router.post('/', validarArchivo, cargarArchivos);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary)
// actualizarImagen)

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)


module.exports = router
