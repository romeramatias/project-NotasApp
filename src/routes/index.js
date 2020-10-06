// Requiero express para crear routers
// Router es un metodo que permite tener un objeto que facilite la creacion de rutas
const router = require("express").Router();

// Permite crear rutas del servidor
// Creamos la ruta index, el '/' seria la pagina inicial
router.get('/', (req, res) => {
    res.render("index")
})


router.get('/sobremi', (req, res) => {
    res.render("sobremi")
})

module.exports = router;