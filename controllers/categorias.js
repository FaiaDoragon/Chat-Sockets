const { response } = require('express');
const { Categoria } = require('../models')

// obtenerCategiruas - paginado - total - populate
const obtenerCategorias = async(req, res=response) => {

    const { limit = 5, desde = 0 } = req.query
    const query = {estado: true}

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit))
    ])

    res.json({
        msg: "get api - controlador",
        total,
        categorias
    });

}

//obtenerCategoria - populate {}
const obtenerCategoria = async(req, res=response) => {

    const  { id }  = req.params;
    const categoria = req.body;

    const categoriaDB = await Categoria.findById( id, categoria )


    res.json({
        msg: "get categoria - controlador",
        categoriaDB
    });

}

const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        })
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
        estado,
        precio,
        categoria
    }

    const categoria = new Categoria(data);

    //guardar DB

    await categoria.save();

    res.status(201).json(categoria)
}

//actualizarCategoria
const actualizarCategoria = async(req, res = response) => {
    const  { id }  = req.params;
    const categoria = req.body;

    const categoriaDB = await Categoria.findByIdAndUpdate( id, categoria )


    res.json({
        msg: "put api - controlador",
        categoriaDB
    });
}

//borrarCategoria - estado:false
const borrarCategoria = async(req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false})

    res.json({
        msg: "Delete api - controlador",
        categoria
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}