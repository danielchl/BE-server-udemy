var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: [true, 'El id de usuario es requerido'] },
    hospital: { type:Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id del hosptital es requerido']}
});

module.exports = mongoose.model('Medico', medicoSchema);