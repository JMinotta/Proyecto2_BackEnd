import { Router } from "express";
import { UserController } from "../controller/usuario.controller";

const usuarioRoute = Router();

usuarioRoute.post("/registrar", UserController.registrar);
usuarioRoute.post("/login", UserController.login);
usuarioRoute.put("/actualizar/:id", UserController.actualizar);
usuarioRoute.delete("/eliminar/:id", UserController.eliminar);

export default usuarioRoute;
