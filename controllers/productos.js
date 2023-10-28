const { response } = require('express');
const { Producto } = require('../models');

// obtenerCategiruas - paginado - total - populate
const obtenerProductos = async(req, res=response) => {

    const { limit = 5, desde = 0 } = req.query
    const query = {estado: true}

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit))
    ])

    res.json({
        msg: "get api - controlador",
        total,
        productos
    });

}

//obtenerCategoria - populate {}
const obtenerProducto = async(req, res=response) => {

    const  { id }  = req.params;
    const categoria = req.body;

    const categoriaDB = await Categoria.findById( id, categoria )


    res.json({
        msg: "get categoria - controlador",
        categoriaDB
    });

}

const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya se encuentra registrado en la base de datos`
        })
    }

    //generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //guardar DB

    await producto.save();

    res.status(201).json(producto)
}

//actualizarCategoria
const actualizarProducto = async(req, res = response) => {
    const  { id }  = req.params;
    const producto = req.body;

    const productoDB = await Producto.findByIdAndUpdate( id, categoria )


    res.json({
        msg: "put api - controlador",
        productoDB
    });
}

//borrarCategoria - estado:false
const borrarProducto = async(req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado: false})

    res.json({
        msg: "Delete api - controlador",
        producto
    });
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}