const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: [true, 'El usuario creador es obligatorio'],
    }
    
});

CategoriaSchema.methods.toJSON = function() {

    const {__v, _id, ...categoria} = this.toObject();
    categoria.uid = _id;

    return categoria;

}


module.exports = model('Categoria', CategoriaSchema);