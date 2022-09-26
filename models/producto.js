const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        default: 0
    },
    descripcion: {
        type: String,
    },
    img: {
        type: String,
    },
    disponible: {
        type: Boolean,
        default: true,
        required: [true, 'El estado disponible es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es obligatorio'],
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [true, 'La categoría es obligatoria'],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios',
        required: [true, 'El usuario creador es obligatorio'],
    }
    
});

ProductoSchema.methods.toJSON = function() {

    const {__v, _id, ...producto} = this.toObject();
    producto.uid = _id;

    return producto;

}


module.exports = model('Producto', ProductoSchema);