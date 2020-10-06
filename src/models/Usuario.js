const mong = require("mongoose");
const { Schema } = mong;
const bcrypt = require("bcryptjs");

const UsuarioSchema = new Schema({
   nombre: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
   date: { type: Date, default: Date.now },
});

// Cifrado de pass
// Creacion de un metodo
UsuarioSchema.methods.encriptarPass = async (password) => {
   // Genera un hash que cifra la pass
   const salt = await bcrypt.genSalt(10);
   const hash = bcrypt.hash(password, salt);
   return hash;
};

// No puedo usar la funcion flecha porque pierde el scope
UsuarioSchema.methods.compararPass = async function (password) {
    // Compara la pass que le llega y la que tiene en el modelo de datos (UserSchema)
    return await bcrypt.compare(password, this.password)
}

module.exports = mong.model("Usuario", UsuarioSchema);
