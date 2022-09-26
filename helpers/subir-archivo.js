const path = require("path");
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;

        const extension = archivo.mimetype.split('/')[1];

        if (!extensionesValidas.includes(extension)) {

            return reject( `Los archivos con extensión: '.${extension}' No son validos, prueba con archivos '${extensionesValidas}'`);

        }

        const nombreArchivo = uuidv4() + '.' + extension;
        const uploadPath = path.resolve('./uploads/'+ carpeta + nombreArchivo);

        archivo.mv(uploadPath, (err) => {

            if (err) {

                reject( err );

            }

            resolve(nombreArchivo);

        });

    });

};

module.exports = {
    subirArchivo
}