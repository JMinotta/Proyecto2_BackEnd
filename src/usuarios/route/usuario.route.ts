import { Router } from "express"
import { UsuarioController } from "../controller/usuario.controller"
import { authenticate, verPermisos} from "../../middleware/autenticar"     
const usuarioRoute = Router()

usuarioRoute.post("/registrar", UsuarioController.registrar)
usuarioRoute.post("/login", UsuarioController.login)
usuarioRoute.get("/buscar/:id", authenticate,verPermisos("verUsuarios"), UsuarioController.getUsuario)
usuarioRoute.put("/actualizar/:id", authenticate,verPermisos("modificarUsuarios"), UsuarioController.actualizar)
usuarioRoute.delete("/eliminar/:id",authenticate,verPermisos("inhabilitarUsuarios"), UsuarioController.eliminar)

export default usuarioRoute
