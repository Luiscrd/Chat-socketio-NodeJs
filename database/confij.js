const mongoose = require('mongoose');

const dbConection = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch(error => console.log(error));

        console.log('Base de datos Online');

    } catch (error) {

        console.log(error);
        throw new Error('Error a la hora de cargar la base de datos')

    }
}

module.exports = {
    dbConection
}