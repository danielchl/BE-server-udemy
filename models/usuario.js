var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// Nos ayuda a validar los roles
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}


var usuarioSchema = new Schema({
    nombre: { type: String, required: [ true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required:[ true, 'El correo es necesario'] },
    password: { type: String, required: [ true, 'El password es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default:'USER_ROLE', enum: rolesValidos },
});

// Valida el campo del schema con 'unique: true'
// {PATH} para cuando hay mas de un campo con unique agarra el nombre del campo
// y lo inserta en el mensaje
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser unico' } )


module.exports = mongoose.model('Usuario', usuarioSchema);