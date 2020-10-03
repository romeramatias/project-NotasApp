const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");

// Session este modulo es para mantener sesiones, guardar los datos en la app
// Method override extiende la funcionalidad de los formularios
// Express handlebars es el motor de plantillas
// Path es un modulo de node
// Express es una funcion, lo almaceno en una constante app

// INICIALIZACIONES
const app = express();
require('./database.js')

// Dividimos el archivo en distintas secciones
//-------------------------------------------------------------------------------------------------------------------------------
// SETTINGS (Configuraciones)
//-------------------------------------------------------------------------------------------------------------------------------
// Podes modificar las vistas, motor de plantillas o cosas generales ej el framework
// - Seteamos la configuracion del puerto
// - process.env.PORT: Si existe un puerto lo toma, sino usa el 3000
app.set("port", process.env.PORT || 3000);

// - Configuramos las vistas, las seteo y les indico donde estan
// - path.join permite unir directorios
// - __dirname devuelve la ruta en donde se esta ejecutando el archivo
// en este caso devuelve la carpeta 'src'
app.set("views", path.join(__dirname, "views"));

// - Seteamos los handlebars, es el motor de plantillas
// - .hbs son los archivos de handlebars, exphbs es una funciones
// creamos un objeto para setear de que manera vamos a utilizar las vistas
app.engine(
   ".hbs",
   exphbs({
      defaultLayout: "main",
      // Concatena la carpeta views con layouts
      layoutsDir: path.join(app.get("views"), "layouts"),
      // Partials son partes de html que podemos reutilizar en cualquier vista
      partialsDir: path.join(app.get("views"), "partials"),
      extname: ".hbs",
   })
);
// - Seteo en la app el motor de plantillas
app.set("view engine", ".hbs");

//-------------------------------------------------------------------------------------------------------------------------------
// MIDDLEWARE (Funciones ejecutadas antes que lleguen al sv, antes que pasarselo a las rutas)
//-------------------------------------------------------------------------------------------------------------------------------
// - Metodo de express urlencoded, para la interpretacion de datos recibidos, ej cuando un user se registra
// extended false asegura que solo lleguen los datos, no otras cosas
app.use(express.urlencoded({ extended: false }));

// - Es para que pueda recibir metodos put y delete aparte de get y post
// el parametro es un input oculto
app.use(methodOverride("_method"));

// - Session, crea un objeto. Clave. resave y saveun... son configs por defecto
// que me van a permitir guardar las sesiones (autenticar y guardar los datos)
app.use(session({ secret: "matiasapp", resave: true, saveUninitialized: true }));

//-------------------------------------------------------------------------------------------------------------------------------
// GLOBAL VARIABLES (Datos accesibles a toda la app)
//-------------------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------------------
// ROUTES
//-------------------------------------------------------------------------------------------------------------------------------
// Urls que iran dentro de la carpeta routes
// En cada uno de los .js iran las url del sv. 
// Index las urls de la pagina principal, ej about
// Notes las urls para crear y manejar sus notas
// Users las urls en donde se autentica, sign in, sign out, sign up
// - Con esto le estoy indicando al sv que ahi estan las rutas
app.use(require('./routes/index.js'))
app.use(require('./routes/notes.js'))
app.use(require('./routes/users.js'))

//-------------------------------------------------------------------------------------------------------------------------------
// STATIC FILES
//-------------------------------------------------------------------------------------------------------------------------------
// - Al igual que hice antes establecemos la carpeta public con archivos estaticos
app.use(express.static(path.join(__dirname, 'public')))

//-------------------------------------------------------------------------------------------------------------------------------
// SERVER ESCUCHANDO
//-------------------------------------------------------------------------------------------------------------------------------
// - Establezco el puerto al sv
// - Muestro mensaje de que sv esta escuchando
app.listen(app.get("port"), () => {
   console.log("Servidor en puerto", app.get("port"));
});
