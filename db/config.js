const mongoose = require('mongoose');

//funcion para conectarnos a la base de datos
const dbConection = async() => {

    try {

        await mongoose.connect( process.env.MONGODB_CNN);

        console.log('Base de datos Online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }

}

module.exports = {
    dbConection
};