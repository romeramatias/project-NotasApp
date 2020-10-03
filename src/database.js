// Configuracion y creacion de la DB
// Mongoose, modulo que permite conectarme con mongodb
const mongoose = require("mongoose");

// - Connect permite conectarme a una dir de internet, como tengo mongodb instalado en la pc
// le digo que se conecte al localhost y al nombre de la db, si no existe la db con ese nombre
// la creara.
// - El objeto que le enviamos son unas configuraciones de mongoose por defecto
mongoose
   .connect("mongodb://localhost/notes-db", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
   })
   // Promesa que si se conecta bien muestra un mensaje, caso contrario en el catch muestra cual fue el error
   .then((db) => console.log("DB Conectada"))
   .catch((err) => console.error(err));
