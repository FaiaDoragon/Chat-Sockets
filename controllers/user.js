const  { response, request } = require('express')
const bcryptjs = require('bcryptjs')


const Usuario = require('../models/usuario');


// controladores de las peticiones HTTP
const usuariosGet = async(req = request, res = response ) => {

    //const {q, nombre = 'no name', apikey} = req.query;
    const { limit = 5, desde = 0 } = req.query
    const query = {estado: true}

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limit));

    // const total = await Usuario.countDocuments(query)

    //como vamos a ejecutar 2 promesas independientes entre si las ejecutaremos al mismo tiempo
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
    ])


    res.json({
        msg: "get api - controlador",
        total,
        usuarios
        // total,
        // usuarios
    });
}

const usuariosPost = async (req, res = response ) => {

    const { nombre, correo, password, rol} = req.body
    const usuario = new Usuario( {nombre, correo, password, rol} )

    //Verificar si el correo existe
    

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password,salt)

    //Guardar en DB
    await usuario.save();

    res.json({
        msg: "post api - controlador",
        usuario
    });
}

const usuariosPut = async(req, res = response ) => {

    const { id } = req.params;
    const { password, google, correo, ...resto } = req.body;

    //TODO validar con base de datos
    if ( password ) {
        //encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDB = await Usuario.findByIdAndUpdate( id, resto )


    res.json({
        msg: "put api - controlador",
        usuarioDB
    });
}

const usuariosPatch = (req, res = response ) => {
    res.json({

        ok: true,
        msg: "Patch api - controlador"
    });
}

const usuariosDelete = async(req, res = response ) => {

    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})

    res.json({
        msg: "Delete api - controlador",
        usuario
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}