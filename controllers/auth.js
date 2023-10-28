const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async( req, res = response) => {

    const { correo, password } = req.body;

    try {

        //validar Usuario

        const usuario = await Usuario.findOne({correo})
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo  '
            })
        }

        //si el usuario esta activo

        if ( !usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        //validar password

        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        //generar JWT
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg : 'hubo un error comuniquese con el administrador'
        })
    }
}

const googleSingIn = async(req, res=response) => {
    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true    
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //si el usuario db
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'hable con el administrador, usuario bloqueado'
            });
        }

        //generar JWT
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        })
    } catch (error) {
        json.status(400).json({
            ok: false,
            msg: "El token no se pudo verificar"
        })
    }
}

const renovarToken = async( req, res = response ) => {
    const { usuario } = req;

    //generar JWT
    const token = await generarJWT( usuario.id )

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSingIn,
    renovarToken
}