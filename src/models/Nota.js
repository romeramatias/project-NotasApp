// Mong para poder crear el esquema de dato
const mong = require("mongoose");
// Requiero el Schema desde mongoose
const { Schema } = mong;

// Es como definir una clase con sus atributos, modelo
// Es para decirle a MongoDb como van a lucir los datos
const NotaSchema = new Schema({
   titulo: { type: String, required: true },
   descripcion: { type: String, required: true },
   fecha: { type: Date, default: Date.now },
   usuario: { type: String },
});

// Para crear el modelo
module.exports = mong.model("Nota", NotaSchema);
