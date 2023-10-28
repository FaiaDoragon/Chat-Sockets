const { Schema, model } = require('mongoose')

const usuarioSchema = Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        require: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'contraseña es obligatorio'],
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        //emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//ocultamos el password, tiene que ser una funcion normal para que funcione
usuarioSchema.methods.toJSON = function () {
    const { password, __v, _id,...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'Usuario', usuarioSchema);