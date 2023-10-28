const { Router } = require('express');
const { check } = require('express-validator')

// const { validarJWT } = require('../middleware/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middleware/validar-roles');
// const { validarCampos } = require('../middleware/validar-campos');

const {
    validarCampos,
    validarJWT,
    tieneRole,
    esAdminRole
} = require('../middleware')

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { 
    usuariosGet, 
    usuariosPost, 
    usuariosPut, 
    usuariosPatch, 
    usuariosDelete 
} = require('../controllers/user');




const router = Router()

router.get('/', usuariosGet);

//TODO: Revisar la validacion del rol
router.put('/:id', [
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y mas de 6 letras').isLength({ min : 6 }),
    check('correo').isEmail().custom(emailExiste),
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);



router.patch('/', usuariosPatch);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole( 'ADMIN_ROLE', 'USER_ROLE' ),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);


module.exports = router;
