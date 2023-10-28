
const validaJWT = require('../middleware/validar-jwt');
const validaRoles = require('../middleware/validar-roles');
const validarCampos = require('../middleware/validar-campos');
const validarArchivo = require('../middleware/validar-archivo');
module.exports = {
    ...validaJWT,
    ...validaRoles,
    ...validarCampos,
    ...validarArchivo
}