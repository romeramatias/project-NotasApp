const router = require("express").Router();
const Usuario = require("../models/Usuario");
const passport = require("passport");

// Render del form
router.get("/usuarios/ingresar", (req, res) => {
   res.render("usuarios/ingresar");
});

router.get("/usuarios/registrarse", (req, res) => {
   res.render("usuarios/registrarse");
});

// Post de form
router.post(
   "/usuarios/ingresar",
   passport.authenticate("local", {
      // Si todo va ok lo redirigo a las notas
      successRedirect: "/notas",
      failureRedirect: "/usuarios/ingresar",
      failureFlash: true,
   })
);

router.post("/usuarios/registrarse", async (req, res) => {
   const { nombre, email, pass, confirm_pass } = req.body;
   const errores = [];

   // Esto se podria hacer con el modulo validator
   if (nombre.length <= 0) {
      errores.push({ texto: "Ingrese su nombre" });
   }

   if (pass != confirm_pass) {
      errores.push({ texto: "Las contraseñas no coinciden" });
   }

   if (pass.length < 4) {
      errores.push({ texto: "La contraseña debe tener al menos 4 caracteres" });
   }

   if (errores.length > 0) {
      res.render("usuarios/registrarse", { errores, nombre, email });
   } else {
      const nuevoUsuario = new Usuario({ nombre, email, pass });
      // Reemplaza la contraseña por una encriptada
      nuevoUsuario.password = await nuevoUsuario.encriptarPass(pass);
      await nuevoUsuario.save();
      req.flash("mens_exito", "Registro exitoso");
      res.redirect("/usuarios/ingresar");
   }
});

router.get("/usuarios/cerrarsesion", (req, res) => {
   req.logout();
   req.flash("mens_exito", "Sesión finalizada");
   res.redirect("/");
});

module.exports = router;
