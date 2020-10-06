const router = require("express").Router();
const Nota = require("../models/Nota");
const { estaAutenticado } = require("../helpers/auth");

router.get("/notas/agregar", estaAutenticado, (req, res) => {
   res.render("notas/nueva-nota");
});

// Ruta para recibir los datos
router.post("/notas/nueva-nota", estaAutenticado, async (req, res) => {
   // Objeto del formulario
   // console.log(req.body);

   // Guardo el titulo y descripcion en una constante
   const { titulo, descripcion } = req.body;

   // Creo constante para guardar los errores
   const errores = [];

   // Validamos si hay algun campo que no se haya completado
   // En caso de que algun campo este vacio guardamos error
   if (!titulo) {
      errores.push({ texto: "Por favor ingrese un titulo" });
   }

   if (!descripcion) {
      errores.push({ texto: "Por favor ingrese una descripcion" });
   }

   // En el caso de que haya algun error, renderizamos la vista nuevamente enviandole los datos
   if (errores.length > 0) {
      res.render("notas/nueva-nota", { titulo, descripcion, errores });
   } else {
      // Si todo va ok, creamos el objeto y lo guardamos en la DB
      const nuevaNota = Nota({ titulo, descripcion });
      // Asincrono porque puede llevar un tiempo, dps de que termine seguimos con la ejecucion
      // Async sigue laburando mientras esto se ejecuta o al reves   ?
      // Lo guarda en la DB, tambien envio mensaje con flash

      // Le asigno un usuario a esa nota
      console.log(req.user.id);
      nuevaNota.usuario = req.user.id;

      await nuevaNota.save();
      req.flash("mens_exito", "Nota agregada 🥳🥳");
      res.redirect("/notas");
   }
});

// Comandos de Mongo
// mongo => use notes-db => show collections => db.notas.find().pretty()
router.get("/notas", estaAutenticado, async (req, res) => {
   // Desde la coleccion Nota, buscamos todos los datos
   // Guardamos todas las notas en esta variable
   // Llevamos a la vista en donde vamos a mostrar todas las notas
   await Nota.find({usuario: req.user.id})
      .sort({ fecha: "desc" })
      .then((documentos) => {
         const contexto = {
            notas: documentos.map((documento) => {
               return {
                  titulo: documento.titulo,
                  descripcion: documento.descripcion,
                  _id: documento._id,
               };
            }),
         };
         res.render("notas/todas-notas", { notas: contexto.notas });
      });
});

router.get("/notas/editar/:id", estaAutenticado, async (req, res) => {
   const id = req.params.id;
   const nota = await Nota.findById(id).then((notaId) => {
      return {
         titulo: notaId.titulo,
         descripcion: notaId.descripcion,
         _id: notaId._id,
      };
   });
   res.render("notas/editar-nota", { nota });
});

router.put("/notas/editar-nota/:id", estaAutenticado, async (req, res) => {
   const { titulo, descripcion } = req.body;
   await Nota.findByIdAndUpdate(req.params.id, { titulo, descripcion });
   req.flash("mens_exito", "Nota editada 😁😁");
   res.redirect("/notas");
});

router.delete("/notas/borrar/:id", estaAutenticado, async (req, res) => {
   const id = req.params.id;
   await Nota.findByIdAndDelete(id);
   req.flash("mens_exito", "Nota eliminada 🤐🤐");
   res.redirect("/notas");
});

module.exports = router;