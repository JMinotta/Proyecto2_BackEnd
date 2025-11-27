import { Router } from "express"
import { LibroController } from "../controller/libro.controller"
import { authenticate, verPermisos} from "../../middleware/autenticar"  

const libroRoute = Router()

libroRoute.post("/crear", authenticate, verPermisos("crearLibros"), LibroController.crear)
libroRoute.get("/buscar", LibroController.buscarVarios)
libroRoute.get("/buscar/:id", LibroController.buscarUno)
libroRoute.delete("/eliminar/:id", authenticate, verPermisos("borrarLibros"), LibroController.eliminar)
libroRoute.put("/actualizar/:id", authenticate, verPermisos("modificarLibros"), LibroController.actualizar)

export default libroRoute
