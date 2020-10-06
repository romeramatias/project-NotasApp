// Passport guarda los datos en una sesion
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Importo el modelo users para consultar con la bd
const Usuario = require("../models/Usuario");

// Define una nueva estrategia de autenticacion
passport.use(
   new LocalStrategy(
      {
         // Parametros que el usuario va a enviar cuando se quiera autenticar
         usernameField: "email",
         // A continuacion necesito una funcion para validarlo
      },
      // Esta funcion recibe los datos y un callback
      async (email, password, done) => {
         // Buscar en DB, contraseña valida, etc
         const usuario = await Usuario.findOne({ email: email });
         // En el caso de que no encuentre un usuario, retornamos el callback done
         // para terminar el proceso de autenticacion, que puede terminar con algun error
         // con ningun usuario o con un mensaje de error
         if (!usuario) {
            // Null para el usuario, false para el error y mensaje usuario no encontrado
            // SI NO ENCUENTRA USUARIO CON ESE MAIL
            return done(null, false, { message: "Usuario no encontrado" });
         } else {
            // Si encuentra al usuario empezamos a validar la contraseña
            const coincidencia = await usuario.compararPass(password);
            if (coincidencia) {
               // Null xq no hay error, usuario porque encontramos
               // SI ESTA TODO OK
               console.log("Sesion iniciada", usuario.nombre);
               return done(null, usuario);
            } else {
               // SI LA PASS ESTA MAL
               return done(null, false, { message: "Contraseña incorrecta" });
            }
         }
      }
   )
);

// Por ahora anda la autenticacion pero hay que almacenarlo en algun lugar
// Lo guardamos en una sesion
// Le llega una funcion con el usuario y el done callback
passport.serializeUser((usuario, done) => {
   // Ejecutamos el callback con error null y usuario id
   // El id es para que en prox sesiones evitar estar pidiendo el login
   //console.log("Serialize");
   //console.log(usuario);
   done(null, usuario.id);
   // * SI EL USER SE LOGEA ALMACENAMOS LA SESION SU ID
});

// Proceso inverso, toma un id y genera un usuario
passport.deserializeUser((id, done) => {
   // Busq en DB
   // Si hay un usuario en la sesion lo buscamos por id
   Usuario.findById(id, (err, usuario) => {
      //console.log("Deserialize Done");
      //console.log(usuario);
      done(err, usuario);
   });
});
