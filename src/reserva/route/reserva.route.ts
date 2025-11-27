import { Router } from "express"
import { ReservaController } from "../controller/reserva.controller"
import {authenticate} from "../../middleware/autenticar"

const reservaRoute = Router()

reservaRoute.post("/reservar", authenticate, ReservaController.reserva)
reservaRoute.get("/libro/:id", authenticate, ReservaController.historiaByLibro)
reservaRoute.get("/usuario/:id", authenticate, ReservaController.historiaByUsuario)
reservaRoute.post("/devolver", authenticate, ReservaController.devolver)

export default reservaRoute
