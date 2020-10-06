const passport = require("passport");
const helpers = {};

// Va a ser un objeto varios metodos

// Tambien es un middleware
helpers.estaAutenticado = (req, res, next) => {
   // Passport tiene un metodo que hace la autentiacion
   console.log('Autenticado:', req.isAuthenticated());
   if (req.isAuthenticated()) {
      return next();
   }
   req.flash("mens_error", "No iniciaste sesión");
   res.redirect("/usuarios/ingresar");
};

module.exports = helpers;
